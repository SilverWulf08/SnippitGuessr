let map;
let miniMap;
let actualLocation;
let guessMarker;
let actualMarker;
let guessLocation = null;
let polyline;
let currentLocationName = '';

let guessLocked = false;
let nextRoundTimer = null;
let initialSpinnerDismissed = false;

const INITIAL_LOAD_DELAY_MS = 900;

let gameInitialized = false;

const GAME_MODE = (document.body && document.body.dataset && document.body.dataset.mode === 'points') ? 'points' : 'endless';
const POINTS_ROUNDS_TOTAL = 10;
const POINTS_GOAL_TOTAL = 1000;

// Tile sources
// Main map: CARTO Voyager for English labels + good detail.
const MAIN_TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const MAIN_TILE_ATTRIBUTION = '© OpenStreetMap contributors © CARTO';
const MAIN_TILE_SUBDOMAINS = 'abcd';

// Snippit (mini map): OSM Standard.
const SNIPPIT_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const SNIPPIT_TILE_ATTRIBUTION = '© OpenStreetMap contributors';
const SNIPPIT_TILE_SUBDOMAINS = 'abc';

function getHintToastEls() {
    return {
        toast: document.getElementById('hintToast'),
        close: document.getElementById('hintToastClose')
    };
}

function isMapHintDismissed() {
    return sessionStorage.getItem(MAP_HINT_DISMISSED_KEY) === '1';
}

function showMapHintToastIfAllowed() {
    const { toast } = getHintToastEls();
    if (!toast) return;
    if (isMapHintDismissed()) {
        toast.style.display = 'none';
        return;
    }
    toast.style.display = 'flex';
}

function hideMapHintToast() {
    const { toast } = getHintToastEls();
    if (!toast) return;
    toast.style.display = 'none';
}

function wireMapHintToast() {
    const { toast, close } = getHintToastEls();
    if (!toast || !close) return;

    close.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        sessionStorage.setItem(MAP_HINT_DISMISSED_KEY, '1');
        hideMapHintToast();
    });
}

function getPointsDifficulty() {
    const v = sessionStorage.getItem('snippit.pointsDifficulty');
    if (v === 'hard') return 'hard';
    if (v === 'challenging') return 'challenging';
    return 'normal';
}

function getPointsRoundTimeLimitMs() {
    const diff = getPointsDifficulty();
    if (diff === 'hard') return 30 * 1000;
    if (diff === 'challenging') return 1 * 60 * 1000;
    return 2 * 60 * 1000;
}

let pointsState = null;

// Splitter sizing (desktop/tablet)
const MIN_PANORAMA_WIDTH_PX = 280;
const MIN_MAP_WIDTH_PX = 280;
const DEFAULT_MAP_WIDTH_PX = 400;

let currentMapWidthPx = DEFAULT_MAP_WIDTH_PX;
let invalidateScheduled = false;

// Non-repeating randomizer: each location is used once per cycle.
let locationDeck = [];
let lastPickedLocationIndex = null;

function shuffleInPlace(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function refillLocationDeck() {
    locationDeck = locations.map((_, idx) => idx);
    shuffleInPlace(locationDeck);

    // Small quality tweak: avoid immediately repeating the last location across a cycle boundary (when possible).
    if (locationDeck.length > 1 && lastPickedLocationIndex !== null) {
        const nextIndex = locationDeck[locationDeck.length - 1];
        if (nextIndex === lastPickedLocationIndex) {
            const swapWith = locationDeck.length - 2;
            [locationDeck[locationDeck.length - 1], locationDeck[swapWith]] = [locationDeck[swapWith], locationDeck[locationDeck.length - 1]];
        }
    }
}

function pickNextLocation() {
    if (!Array.isArray(locations) || locations.length === 0) {
        throw new Error('No locations available. Check locations.js');
    }

    if (locationDeck.length === 0) {
        refillLocationDeck();
    }

    const index = locationDeck.pop();
    lastPickedLocationIndex = index;
    return locations[index];
}

function initGameIfNeeded() {
    if (gameInitialized) return;

    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        // This script is intended for the game page only.
        return;
    }

    // Initialize main Leaflet map with continuous world wrapping
    map = L.map('map', {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        worldCopyJump: true,
        // Clamp vertical panning to the map edges while keeping horizontal panning effectively endless.
        // Leaflet's bounds apply to both axes, so we use a very wide longitude range.
        maxBounds: L.latLngBounds(
            L.latLng(-85, -1000000),
            L.latLng(85, 1000000)
        ),
        maxBoundsViscosity: 1.0
    });

    // Main world map
    L.tileLayer(MAIN_TILE_URL, {
        attribution: MAIN_TILE_ATTRIBUTION,
        subdomains: MAIN_TILE_SUBDOMAINS,
        maxZoom: 19,
        detectRetina: true,
        // Smoother zooming: keep more tiles around and avoid reloading while mid-zoom.
        keepBuffer: 6,
        updateWhenIdle: true,
        updateWhenZooming: false,
        reuseTiles: true
    }).addTo(map);

    // Add click listener
    map.on('click', (e) => {
        // Allow moving the pin freely until the guess is submitted.
        if (!guessLocked) placeGuessMarker(e.latlng);
    });

    initSplitter();
    clearMapHintOnReload();
    wireMapHintToast();

    gameInitialized = true;
}

function formatClockMs(ms) {
    const clamped = Math.max(0, ms);
    const totalSeconds = Math.floor(clamped / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function isPointsMode() {
    return GAME_MODE === 'points';
}

function ensurePointsState() {
    if (!isPointsMode()) return null;
    if (pointsState) return pointsState;
    pointsState = {
        difficulty: getPointsDifficulty(),
        timeLimitMs: getPointsRoundTimeLimitMs(),
        round: 0,
        totalPoints: 0,
        totalTimeMs: 0,
        roundStartMs: 0,
        roundEnded: false,
        timerIntervalId: null
    };
    return pointsState;
}

function resetPointsState() {
    if (!isPointsMode()) return;
    pointsState = {
        difficulty: getPointsDifficulty(),
        timeLimitMs: getPointsRoundTimeLimitMs(),
        round: 0,
        totalPoints: 0,
        totalTimeMs: 0,
        roundStartMs: 0,
        roundEnded: false,
        timerIntervalId: null
    };
}

function getPointsTimerEl() {
    return document.getElementById('pointsTimer');
}

function setPointsTimerText(text) {
    const el = getPointsTimerEl();
    if (el) el.textContent = text;
}

function stopPointsRoundTimer() {
    if (!pointsState) return;
    if (pointsState.timerIntervalId) {
        clearInterval(pointsState.timerIntervalId);
        pointsState.timerIntervalId = null;
    }
}

function tickPointsRoundTimer() {
    if (!pointsState) return;
    if (pointsState.roundEnded) return;

    const elapsed = Date.now() - pointsState.roundStartMs;
    const remaining = pointsState.timeLimitMs - elapsed;

    setPointsTimerText(formatClockMs(remaining));

    if (remaining <= 0) {
        onPointsRoundTimeout();
    }
}

function startPointsRoundTimer() {
    if (!pointsState) return;
    stopPointsRoundTimer();
    pointsState.roundStartMs = Date.now();
    setPointsTimerText(formatClockMs(pointsState.timeLimitMs));

    // Tick relatively frequently so it feels responsive.
    pointsState.timerIntervalId = setInterval(tickPointsRoundTimer, 200);
}

function getBasePointsForDistanceKm(distanceKm, difficulty) {
    if (difficulty === 'hard') {
        // Intentionally harsh: reaching 1000 in 10 rounds is difficult but possible with consistent close guesses.
        if (distanceKm < 2) return 200;
        if (distanceKm < 10) return 150;
        if (distanceKm < 50) return 95;
        if (distanceKm < 200) return 65;
        if (distanceKm < 500) return 40;
        if (distanceKm < 1000) return 20;
        return 10;
    }

    if (difficulty === 'challenging') {
        if (distanceKm < 10) return 170;
        if (distanceKm < 50) return 130;
        if (distanceKm < 200) return 100;
        if (distanceKm < 500) return 75;
        if (distanceKm < 1000) return 55;
        return 35;
    }

    // Normal
    if (distanceKm < 10) return 200;
    if (distanceKm < 50) return 160;
    if (distanceKm < 200) return 120;
    if (distanceKm < 500) return 90;
    if (distanceKm < 1000) return 60;
    return 30;
}

function getSpeedMultiplierForElapsedMs(elapsedMs, difficulty) {
    if (difficulty === 'hard') {
        return elapsedMs < 10 * 1000 ? 2 : 1;
    }

    if (difficulty === 'challenging') {
        return elapsedMs < 30 * 1000 ? 1.5 : 1;
    }

    // Normal
    if (elapsedMs < 30 * 1000) return 2;
    if (elapsedMs < 60 * 1000) return 1.5;
    return 1;
}

function showPointsSummaryOverlay() {
    const overlay = document.getElementById('pointsSummaryOverlay');
    if (!overlay) return;

    const scoreEl = document.getElementById('pointsSummaryScore');
    const goalEl = document.getElementById('pointsSummaryGoal');
    const roundsEl = document.getElementById('pointsSummaryRounds');
    const timeEl = document.getElementById('pointsSummaryTime');

    const totalPoints = pointsState ? pointsState.totalPoints : 0;
    const totalTimeMs = pointsState ? pointsState.totalTimeMs : 0;
    const success = totalPoints >= POINTS_GOAL_TOTAL;

    if (scoreEl) scoreEl.textContent = `${totalPoints} pts`;
    if (goalEl) goalEl.textContent = success ? `Goal reached (≥ ${POINTS_GOAL_TOTAL})` : `Goal not reached (${POINTS_GOAL_TOTAL} needed)`;
    if (roundsEl) {
        if (success && pointsState) {
            roundsEl.textContent = `Completed in: ${pointsState.round}/${POINTS_ROUNDS_TOTAL} rounds`;
            roundsEl.style.display = 'block';
        } else {
            roundsEl.style.display = 'none';
        }
    }
    if (timeEl) timeEl.textContent = `Total time: ${formatClockMs(totalTimeMs)}`;

    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');

    if (success) {
        launchConfetti();
    }
}

function hidePointsSummaryOverlay() {
    const overlay = document.getElementById('pointsSummaryOverlay');
    if (!overlay) return;
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
}

function wirePointsSummaryActions() {
    if (!isPointsMode()) return;

    const retryBtn = document.getElementById('pointsRetryBtn');
    const homeBtn = document.getElementById('pointsHomeBtn');

    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            hidePointsSummaryOverlay();
            resetPointsState();
            showInitialSpinner();
            setTimeout(() => {
                initGameIfNeeded();
                newRound();
            }, INITIAL_LOAD_DELAY_MS);
        });
    }

    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}

function endPointsGame() {
    if (!pointsState) return;
    stopPointsRoundTimer();
    pointsState.roundEnded = true;

    // Hide in-game controls so the summary is the focus.
    const guessBtn = document.getElementById('guessBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (guessBtn) guessBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';

    showPointsSummaryOverlay();
}

function onPointsRoundTimeout() {
    if (!pointsState) return;
    if (pointsState.roundEnded) return;

    pointsState.roundEnded = true;
    stopPointsRoundTimer();
    pointsState.totalTimeMs += pointsState.timeLimitMs;
    setPointsTimerText('0:00');
    guessLocked = true;

    // If this was the last round, finish immediately.
    if (pointsState.round >= POINTS_ROUNDS_TOTAL) {
        endPointsGame();
        return;
    }

    // Auto-advance to the next round.
    showRoundSpinner();
    nextRoundTimer = setTimeout(() => {
        nextRoundTimer = null;
        newRound();
    }, 500);
}

function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(window.innerWidth * dpr);
        canvas.height = Math.floor(window.innerHeight * dpr);
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const colors = ['#4CAF50', '#FFD700', '#ffffff'];
    const pieces = Array.from({ length: 140 }, () => {
        const x = Math.random() * window.innerWidth;
        const y = -20 - Math.random() * 200;
        const size = 6 + Math.random() * 8;
        const speedY = 2 + Math.random() * 5;
        const speedX = -2 + Math.random() * 4;
        const rotation = Math.random() * Math.PI;
        const rotationSpeed = (-0.15 + Math.random() * 0.3);
        return {
            x,
            y,
            size,
            speedX,
            speedY,
            rotation,
            rotationSpeed,
            color: colors[Math.floor(Math.random() * colors.length)]
        };
    });

    const start = performance.now();
    const duration = 2600;

    const frame = (now) => {
        const t = now - start;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (const p of pieces) {
            p.x += p.speedX;
            p.y += p.speedY;
            p.rotation += p.rotationSpeed;
            p.speedY += 0.03; // gravity

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            ctx.restore();
        }

        if (t < duration) {
            requestAnimationFrame(frame);
        } else {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
    };

    requestAnimationFrame(frame);
}

function scheduleInvalidateSizes() {
    if (invalidateScheduled) return;
    invalidateScheduled = true;
    requestAnimationFrame(() => {
        invalidateScheduled = false;
        if (map) map.invalidateSize();
        if (miniMap) miniMap.invalidateSize();
    });
}

function isMobileStackedLayout() {
    return window.matchMedia('(max-width: 768px)').matches;
}

function applyMapWidthPx(mapWidthPx) {
    const mapEl = document.getElementById('map');
    if (!mapEl) return;

    currentMapWidthPx = mapWidthPx;
    mapEl.style.width = `${mapWidthPx}px`;
    mapEl.style.flex = `0 0 ${mapWidthPx}px`;
    scheduleInvalidateSizes();
}

function clearMapWidthOverride() {
    const mapEl = document.getElementById('map');
    if (!mapEl) return;
    mapEl.style.width = '';
    mapEl.style.flex = '';
    scheduleInvalidateSizes();
}

function clampMapWidthPx(proposedMapWidthPx) {
    const container = document.getElementById('container');
    const splitter = document.getElementById('splitter');
    if (!container || !splitter) return proposedMapWidthPx;

    const containerWidth = container.getBoundingClientRect().width;
    const splitterWidth = splitter.getBoundingClientRect().width;

    const maxMapWidth = Math.max(0, containerWidth - splitterWidth - MIN_PANORAMA_WIDTH_PX);
    const minMapWidth = Math.min(MIN_MAP_WIDTH_PX, maxMapWidth);

    return Math.min(maxMapWidth, Math.max(minMapWidth, proposedMapWidthPx));
}

function initSplitter() {
    const container = document.getElementById('container');
    const splitter = document.getElementById('splitter');
    const mapEl = document.getElementById('map');
    if (!container || !splitter || !mapEl) return;

    const syncForLayout = () => {
        if (isMobileStackedLayout()) {
            clearMapWidthOverride();
            return;
        }

        // Ensure we start from a sensible width and keep it clamped on resizes.
        const currentWidth = mapEl.getBoundingClientRect().width || currentMapWidthPx;
        const nextWidth = clampMapWidthPx(currentWidth || DEFAULT_MAP_WIDTH_PX);
        applyMapWidthPx(nextWidth);
    };

    syncForLayout();

    let dragging = false;

    const onPointerMove = (e) => {
        if (!dragging || isMobileStackedLayout()) return;

        const containerRect = container.getBoundingClientRect();
        const splitterRect = splitter.getBoundingClientRect();
        const splitterW = splitterRect.width;

        // Pointer is on the splitter; treat its center as the boundary.
        const proposedMapWidth = (containerRect.right - e.clientX) - splitterW / 2;
        const clamped = clampMapWidthPx(proposedMapWidth);
        applyMapWidthPx(clamped);
    };

    const stopDrag = () => {
        if (!dragging) return;
        dragging = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        scheduleInvalidateSizes();
    };

    splitter.addEventListener('pointerdown', (e) => {
        if (isMobileStackedLayout()) return;
        dragging = true;
        splitter.setPointerCapture(e.pointerId);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    });

    splitter.addEventListener('pointermove', onPointerMove);
    splitter.addEventListener('pointerup', stopDrag);
    splitter.addEventListener('pointercancel', stopDrag);

    window.addEventListener('resize', syncForLayout);
}

function showInitialSpinner() {
    const el = document.getElementById('initialSpinner');
    if (!el) return;

    // Allow re-using the initial spinner for mode transitions.
    initialSpinnerDismissed = false;
    el.classList.remove('is-fading-out');
    el.style.display = 'flex';
}

function fadeOutInitialSpinner() {
    if (initialSpinnerDismissed) return;

    const el = document.getElementById('initialSpinner');
    if (!el) {
        initialSpinnerDismissed = true;
        return;
    }

    initialSpinnerDismissed = true;
    el.classList.add('is-fading-out');

    // Match CSS transition duration.
    setTimeout(() => {
        el.style.display = 'none';
    }, 420);
}

function showRoundSpinner() {
    const el = document.getElementById('roundSpinner');
    if (el) el.style.display = 'flex';
}

function hideRoundSpinner() {
    const el = document.getElementById('roundSpinner');
    if (el) el.style.display = 'none';
}

function createMiniMap(lat, lng) {
    // Fully dispose previous Leaflet instance (otherwise Leaflet may keep the container "initialized")
    if (miniMap) {
        miniMap.off();
        miniMap.remove();
        miniMap = null;
    }

    const container = document.getElementById('miniMap');
    if (container) {
        // Reset Leaflet internal id + DOM content for safe re-init
        container.innerHTML = '';
        if (container._leaflet_id) {
            delete container._leaflet_id;
        }
    }

    // Create mini map showing zoomed-in view of the location
    miniMap = L.map('miniMap', {
        center: [lat, lng],
        zoom: 16, // More zoomed-in so it's harder to recognize instantly
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false
    });

    // Snippit tiles (OSM Standard)
    L.tileLayer(SNIPPIT_TILE_URL, {
        attribution: SNIPPIT_TILE_ATTRIBUTION,
        subdomains: SNIPPIT_TILE_SUBDOMAINS,
        maxZoom: 19,
        detectRetina: true,
        keepBuffer: 6,
        updateWhenIdle: true,
        updateWhenZooming: false,
        reuseTiles: true
    }).addTo(miniMap);

    // In flex layouts Leaflet can initialize before the container has a final size
    setTimeout(() => miniMap.invalidateSize(), 0);
}

function placeGuessMarker(latlng) {
    if (guessMarker) {
        map.removeLayer(guessMarker);
    }

    guessMarker = L.circleMarker(latlng, {
        radius: 10,
        fillColor: '#4CAF50',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
    }).addTo(map);

    guessLocation = latlng;
    const guessBtn = document.getElementById('guessBtn');
    if (guessBtn) guessBtn.disabled = false;
}

function newRound() {
    if (nextRoundTimer) {
        clearTimeout(nextRoundTimer);
        nextRoundTimer = null;
    }

    // Clear previous markers and polyline
    if (guessMarker) map.removeLayer(guessMarker);
    if (actualMarker) map.removeLayer(actualMarker);
    if (polyline) map.removeLayer(polyline);

    guessLocation = null;
    guessLocked = false;
    const guessBtn = document.getElementById('guessBtn');
    const nextBtn = document.getElementById('nextBtn');
    const result = document.getElementById('result');

    if (guessBtn) {
        guessBtn.disabled = true;
        guessBtn.style.display = 'block';
    }
    if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.style.display = 'none';
    }
    if (result) {
        result.classList.remove('is-hiding');
        result.style.display = 'none';
    }
    showMapHintToastIfAllowed();

    const mapEl = document.getElementById('map');
    if (mapEl) mapEl.classList.remove('result-hidden');

    const showToggle = document.getElementById('resultShowToggle');
    if (showToggle) showToggle.classList.remove('is-visible');

    if (isPointsMode()) {
        ensurePointsState();
        pointsState.roundEnded = false;

        // If the player already reached the goal, finish immediately.
        if (pointsState.totalPoints >= POINTS_GOAL_TOTAL) {
            endPointsGame();
            return;
        }

        // Advance round and check for end.
        pointsState.round += 1;
        if (pointsState.round > POINTS_ROUNDS_TOTAL) {
            endPointsGame();
            return;
        }

        const roundEl = document.getElementById('roundProgress');
        if (roundEl) roundEl.textContent = `${pointsState.round}/${POINTS_ROUNDS_TOTAL}`;

        startPointsRoundTimer();
    }

    // Get random location
    const location = pickNextLocation();
    actualLocation = { lat: location.lat, lng: location.lng };
    currentLocationName = location.name;

    // Create mini-map showing zoomed-in view
    createMiniMap(location.lat, location.lng);

    // Reset main map view
    map.setView([20, 0], 2);

    hideRoundSpinner();
    fadeOutInitialSpinner();
}

function hideResultAnimated() {
    const result = document.getElementById('result');
    const mapEl = document.getElementById('map');
    const showToggle = document.getElementById('resultShowToggle');
    if (!result) return;

    if (result.style.display === 'none') return;
    if (result.classList.contains('is-hiding')) return;

    result.classList.add('is-hiding');

    const onEnd = (e) => {
        if (e.propertyName !== 'transform') return;
        result.removeEventListener('transitionend', onEnd);
        result.style.display = 'none';
        result.classList.remove('is-hiding');
        if (mapEl) mapEl.classList.add('result-hidden');
        if (showToggle) showToggle.classList.add('is-visible');
    };
    result.addEventListener('transitionend', onEnd);
}

function showResultAnimated() {
    const result = document.getElementById('result');
    const mapEl = document.getElementById('map');
    const showToggle = document.getElementById('resultShowToggle');
    if (!result) return;

    // Only show if we've already rendered content before.
    if (result.style.display === 'block') return;

    if (showToggle) showToggle.classList.remove('is-visible');
    if (mapEl) mapEl.classList.remove('result-hidden');

    result.style.display = 'block';
    // Start from off-screen state, then animate down.
    result.classList.add('is-hiding');
    void result.offsetHeight;
    requestAnimationFrame(() => {
        result.classList.remove('is-hiding');
    });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function makeGuess() {
    if (!guessLocation) return;

    if (isPointsMode()) {
        ensurePointsState();
        if (pointsState.roundEnded) return;
        pointsState.roundEnded = true;
        stopPointsRoundTimer();
    }

    guessLocked = true;

    hideMapHintToast();

    const distance = calculateDistance(
        guessLocation.lat,
        guessLocation.lng,
        actualLocation.lat,
        actualLocation.lng
    );

    // Place actual location marker
    actualMarker = L.circleMarker([actualLocation.lat, actualLocation.lng], {
        radius: 10,
        fillColor: '#FF5252',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
    }).addTo(map).bindPopup('Actual Location').openPopup();

    // Update guess marker
    guessMarker.bindPopup('Your Guess');

    // Draw line between guess and actual
    polyline = L.polyline([
        [guessLocation.lat, guessLocation.lng],
        [actualLocation.lat, actualLocation.lng]
    ], {
        color: '#FFD700',
        weight: 3,
        opacity: 0.8,
        dashArray: '10, 10'
    }).addTo(map);

    // Fit map to show both markers
    const bounds = L.latLngBounds([
        [guessLocation.lat, guessLocation.lng],
        [actualLocation.lat, actualLocation.lng]
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });

    // Find the closest location name for the guess
    let guessedName = 'Unknown';
    let minDistance = Infinity;
    for (const loc of locations) {
        const dist = calculateDistance(guessLocation.lat, guessLocation.lng, loc.lat, loc.lng);
        if (dist < minDistance) {
            minDistance = dist;
            guessedName = loc.name;
        }
    }

    // Display result
    const distanceEl = document.getElementById('distance');
    if (distanceEl) distanceEl.textContent = `${distance.toFixed(2)} km`;

    let message = '';
    if (distance < 10) {
        message = '🎯 Amazing! Perfect guess!';
    } else if (distance < 50) {
        message = '🌟 Excellent! Very close!';
    } else if (distance < 200) {
        message = '👍 Great job!';
    } else if (distance < 500) {
        message = '👌 Not bad!';
    } else if (distance < 1000) {
        message = '😊 Good try!';
    } else {
        message = '🌍 Keep practicing!';
    }

    if (isPointsMode()) {
        const elapsedMs = Math.max(0, Date.now() - pointsState.roundStartMs);
        pointsState.totalTimeMs += elapsedMs;

        const basePoints = getBasePointsForDistanceKm(distance, pointsState.difficulty);
        const multiplier = getSpeedMultiplierForElapsedMs(elapsedMs, pointsState.difficulty);
        const awarded = Math.round(basePoints * multiplier);
        pointsState.totalPoints += awarded;

        const progressEl = document.getElementById('pointsProgress');
        if (progressEl) progressEl.textContent = `${pointsState.totalPoints}/${POINTS_GOAL_TOTAL}`;

        const roundEl = document.getElementById('roundProgress');
        if (roundEl) roundEl.textContent = `${pointsState.round}/${POINTS_ROUNDS_TOTAL}`;

        const multiplierText = multiplier === 1 ? '' : ` (x${multiplier})`;
        message = `${message} +${awarded} points${multiplierText}`;

        // If the goal is reached, end immediately (timer already stopped above).
        if (pointsState.totalPoints >= POINTS_GOAL_TOTAL) {
            const guessBtn = document.getElementById('guessBtn');
            const nextBtn = document.getElementById('nextBtn');
            if (guessBtn) guessBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';

            setTimeout(() => {
                endPointsGame();
            }, 250);
        }

        // If this was the last round, end the game after showing the result.
        if (pointsState.round >= POINTS_ROUNDS_TOTAL) {
            // Hide the next-round UI; the summary is shown on top.
            const guessBtn = document.getElementById('guessBtn');
            const nextBtn = document.getElementById('nextBtn');
            if (guessBtn) guessBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';

            setTimeout(() => {
                endPointsGame();
            }, 250);
        }
    }

    const resultText = document.getElementById('resultText');
    const actualName = document.getElementById('actualLocationName');
    const guessedNameEl = document.getElementById('guessedLocationName');
    const result = document.getElementById('result');
    if (resultText) resultText.textContent = message;
    if (actualName) actualName.innerHTML = `<strong>Actual location:</strong> ${currentLocationName}`;
    if (guessedNameEl) guessedNameEl.innerHTML = `<strong>You guessed near:</strong> ${guessedName}`;
    if (result) {
        result.style.display = 'block';
        result.classList.remove('is-hiding');
    }

    const mapEl = document.getElementById('map');
    if (mapEl) mapEl.classList.remove('result-hidden');
    const showToggle = document.getElementById('resultShowToggle');
    if (showToggle) showToggle.classList.remove('is-visible');

    // Show next button
    const guessBtn = document.getElementById('guessBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (guessBtn) guessBtn.style.display = 'none';
    if (nextBtn && !isPointsMode()) nextBtn.style.display = 'block';
    if (nextBtn && isPointsMode() && pointsState.round < POINTS_ROUNDS_TOTAL) nextBtn.style.display = 'block';
}

// Event listeners
const guessBtn = document.getElementById('guessBtn');
if (guessBtn) guessBtn.addEventListener('click', makeGuess);

const nextBtn = document.getElementById('nextBtn');
if (nextBtn) nextBtn.addEventListener('click', () => {
    const guessBtn = document.getElementById('guessBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (guessBtn) guessBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;

    showRoundSpinner();

    // Small intentional pause so the transition feels responsive and gives tiles a moment to load.
    nextRoundTimer = setTimeout(() => {
        nextRoundTimer = null;
        newRound();
    }, 500);
});

const resultEl = document.getElementById('result');
if (resultEl) resultEl.addEventListener('click', hideResultAnimated);

const resultShowToggle = document.getElementById('resultShowToggle');
if (resultShowToggle) resultShowToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    showResultAnimated();
});

// Initialize on load
window.addEventListener('load', () => {
    // Game page only: show initial loading, then start.
    showInitialSpinner();
    setTimeout(() => {
        initGameIfNeeded();
        if (isPointsMode()) {
            resetPointsState();
            wirePointsSummaryActions();
        }
        newRound();
    }, INITIAL_LOAD_DELAY_MS);
});
