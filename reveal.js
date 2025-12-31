/**
 * Snippit - Reveal Mode Game Logic
 * =================================
 * In Reveal mode, the player sees a very zoomed-in map snippit and has 10 rounds
 * to guess the location. Each round, the map zooms out to reveal more context.
 * 
 * Win condition: Guess within 5 km of the target location
 * Game over: Use all 10 rounds without guessing correctly
 * 
 * Play Styles:
 * - Classic: No time limit, take your time
 * - Timer: 2 minutes in round 1, decreasing by 12 seconds each round
 * 
 * Scoring: The fewer rounds you need, the better!
 */

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

// Keep track of prior guesses in this 10-round session.
let guessHistoryMarkers = [];

const INITIAL_LOAD_DELAY_MS = 900;

let gameInitialized = false;

// Reveal mode constants
const REVEAL_MAX_ROUNDS = 10;
const REVEAL_WIN_DISTANCE_KM = 5;

// Zoom levels: start extremely zoomed in (19), gradually zoom out to wider view
// Each round zooms out progressively
const REVEAL_ZOOM_LEVELS = [19, 18, 17, 16, 15, 14, 12, 11, 10, 9];

// Timer mode: 2 minutes in round 1, decreasing by 12 seconds each round
const REVEAL_TIMER_BASE_MS = 2 * 60 * 1000; // 2 minutes
const REVEAL_TIMER_DECREASE_MS = 12 * 1000; // 12 seconds less each round

// Tile sources
const MAIN_TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const MAIN_TILE_ATTRIBUTION = '© OpenStreetMap contributors © CARTO';
const MAIN_TILE_SUBDOMAINS = 'abcd';

const SNIPPIT_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const SNIPPIT_TILE_ATTRIBUTION = '© OpenStreetMap contributors';
const SNIPPIT_TILE_SUBDOMAINS = 'abc';

// Game state
let revealState = null;

// Confetti animation
let confettiRafId = null;
let confettiActive = false;
let confettiContinuous = false;
let confettiPieces = [];

// Splitter sizing
const MIN_PANORAMA_WIDTH_PX = 280;
const MIN_MAP_WIDTH_PX = 280;
const DEFAULT_MAP_WIDTH_PX = 400;

let currentMapWidthPx = DEFAULT_MAP_WIDTH_PX;
let invalidateScheduled = false;

// Non-repeating randomizer
let locationDeck = [];
let lastPickedLocationIndex = null;
let lastPickedLocationName = '';

function safeJsonParse(value) {
    if (!value) return null;
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

function isValidIndexArray(arr, maxLen) {
    if (!Array.isArray(arr)) return false;
    for (const v of arr) {
        if (!Number.isInteger(v)) return false;
        if (v < 0 || v >= maxLen) return false;
    }
    return true;
}

function restoreDeckState() {
    if (typeof sessionStorage !== 'undefined' && typeof locations !== 'undefined' && Array.isArray(locations) && locations.length > 0) {
        const meta = safeJsonParse(sessionStorage.getItem(LOCATION_DECK_META_KEY));
        const deck = safeJsonParse(sessionStorage.getItem(LOCATION_DECK_KEY));

        if (meta && meta.len === locations.length && isValidIndexArray(deck, locations.length)) {
            locationDeck = deck;
            lastPickedLocationIndex = (Number.isInteger(meta.lastIndex) ? meta.lastIndex : null);
            lastPickedLocationName = (typeof meta.lastName === 'string' ? meta.lastName : '');
        }
    }
}

function persistLocationDeckState() {
    try {
        if (typeof sessionStorage === 'undefined') return;
        if (!Array.isArray(locations) || locations.length === 0) return;
        sessionStorage.setItem(LOCATION_DECK_KEY, JSON.stringify(locationDeck));
        sessionStorage.setItem(LOCATION_DECK_META_KEY, JSON.stringify({
            len: locations.length,
            lastIndex: lastPickedLocationIndex,
            lastName: lastPickedLocationName
        }));
    } catch {
        // Ignore storage errors
    }
}

restoreDeckState();

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

    if (locationDeck.length > 1 && (lastPickedLocationIndex !== null || lastPickedLocationName)) {
        const nextPos = locationDeck.length - 1;
        const nextIndex = locationDeck[nextPos];
        const nextName = (locations[nextIndex] && locations[nextIndex].name) ? locations[nextIndex].name : '';

        const repeatsIndex = (lastPickedLocationIndex !== null) && (nextIndex === lastPickedLocationIndex);
        const repeatsName = !!(lastPickedLocationName && nextName && nextName === lastPickedLocationName);

        if (repeatsIndex || repeatsName) {
            let swapPos = nextPos - 1;
            while (swapPos >= 0) {
                const candIndex = locationDeck[swapPos];
                const candName = (locations[candIndex] && locations[candIndex].name) ? locations[candIndex].name : '';
                const okIndex = (lastPickedLocationIndex === null) || (candIndex !== lastPickedLocationIndex);
                const okName = (!lastPickedLocationName) || (!candName) || (candName !== lastPickedLocationName);
                if (okIndex && okName) break;
                swapPos -= 1;
            }

            if (swapPos >= 0) {
                [locationDeck[nextPos], locationDeck[swapPos]] = [locationDeck[swapPos], locationDeck[nextPos]];
            }
        }
    }

    persistLocationDeckState();
}

function pickNextLocation() {
    if (!Array.isArray(locations) || locations.length === 0) {
        throw new Error('No locations available. Check locations.js');
    }

    if (locationDeck.length === 0) {
        refillLocationDeck();
    }

    let index = locationDeck.pop();
    const pickedName = (locations[index] && locations[index].name) ? locations[index].name : '';
    if (locationDeck.length > 0 && lastPickedLocationName && pickedName === lastPickedLocationName) {
        let swapPos = locationDeck.length - 1;
        while (swapPos >= 0) {
            const candIndex = locationDeck[swapPos];
            const candName = (locations[candIndex] && locations[candIndex].name) ? locations[candIndex].name : '';
            if (candName !== lastPickedLocationName) break;
            swapPos -= 1;
        }

        if (swapPos >= 0) {
            const altIndex = locationDeck[swapPos];
            locationDeck[swapPos] = index;
            index = altIndex;
        }
    }

    lastPickedLocationIndex = index;
    lastPickedLocationName = locations[index] ? locations[index].name : '';

    persistLocationDeckState();
    return locations[index];
}

function isLowEndMobileDevice() {
    const smallScreen = window.matchMedia('(max-width: 768px)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const saveData = !!(connection && connection.saveData);
    const lowCores = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency > 0
        ? navigator.hardwareConcurrency <= 4 : false;
    const lowMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory > 0
        ? navigator.deviceMemory <= 4 : false;

    return (smallScreen && coarsePointer) && (prefersReducedMotion || saveData || lowCores || lowMemory);
}

function getConfettiDevicePixelRatioCap() {
    const raw = window.devicePixelRatio || 1;
    return isLowEndMobileDevice() ? Math.min(raw, 1.25) : Math.min(raw, 2);
}

function isTimerMode() {
    return sessionStorage.getItem('snippit.revealPlayStyle') === 'timer';
}

function getRevealRoundTimeLimitMs(round) {
    // Round 1: 2 minutes, each subsequent round has 12 seconds less
    const timeMs = REVEAL_TIMER_BASE_MS - ((round - 1) * REVEAL_TIMER_DECREASE_MS);
    return Math.max(timeMs, 12000); // Minimum 12 seconds
}

function formatClockMs(ms) {
    const clamped = Math.max(0, ms);
    const totalSeconds = Math.floor(clamped / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function initRevealState() {
    revealState = {
        round: 0,
        gameEnded: false,
        gameOver: false,
        won: false,
        totalTimeMs: 0,
        roundStartMs: 0,
        roundEnded: false,
        timerIntervalId: null,
        lastTimerText: '',
        finalDistance: 0
    };
}

function stopRevealTimer() {
    if (!revealState) return;
    if (revealState.timerIntervalId) {
        clearInterval(revealState.timerIntervalId);
        revealState.timerIntervalId = null;
    }
}

function setRevealTimerText(text) {
    if (revealState && revealState.lastTimerText === text) return;
    const el = document.getElementById('revealTimer');
    if (el) el.textContent = text;
    if (revealState) revealState.lastTimerText = text;
}

function tickRevealTimer() {
    if (!revealState) return;
    if (revealState.roundEnded) return;

    const elapsed = Date.now() - revealState.roundStartMs;
    const timeLimit = getRevealRoundTimeLimitMs(revealState.round);
    const remaining = timeLimit - elapsed;

    setRevealTimerText(formatClockMs(remaining));

    if (remaining <= 0) {
        onRevealRoundTimeout();
    }
}

function startRevealTimer() {
    if (!revealState || !isTimerMode()) return;
    stopRevealTimer();
    revealState.roundStartMs = Date.now();
    revealState.lastTimerText = '';
    const timeLimit = getRevealRoundTimeLimitMs(revealState.round);
    setRevealTimerText(formatClockMs(timeLimit));

    revealState.timerIntervalId = setInterval(tickRevealTimer, 200);
}

function onRevealRoundTimeout() {
    if (!revealState) return;
    if (revealState.roundEnded) return;

    revealState.roundEnded = true;
    stopRevealTimer();
    const timeLimit = getRevealRoundTimeLimitMs(revealState.round);
    revealState.totalTimeMs += timeLimit;
    setRevealTimerText('0:00');

    guessLocked = true;

    const isLastRound = revealState.round >= REVEAL_MAX_ROUNDS;

    // Result UI: timeout behaves like an end-of-round pause.
    const distanceEl = document.getElementById('distance');
    if (distanceEl) distanceEl.textContent = '—';

    const resultText = document.getElementById('resultText');
    if (resultText) resultText.textContent = "⏰ You were too late — time ran out.";

    const actualName = document.getElementById('actualLocationName');
    const guessedNameEl = document.getElementById('guessedLocationName');

    // Only reveal the target on the final round timeout.
    if (isLastRound) {
        if (actualMarker) map.removeLayer(actualMarker);
        actualMarker = L.circleMarker([actualLocation.lat, actualLocation.lng], {
            radius: 10,
            fillColor: '#FF5252',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 1
        }).addTo(map).bindPopup('Actual Location').openPopup();

        map.setView([actualLocation.lat, actualLocation.lng], 5);

        if (actualName) actualName.innerHTML = `<strong>Actual location:</strong> ${currentLocationName}`;
        if (guessedNameEl) guessedNameEl.innerHTML = '<strong>You guessed:</strong> (no guess)';
    } else {
        if (actualName) actualName.innerHTML = '';
        if (guessedNameEl) guessedNameEl.innerHTML = '';
    }

        // Update the reveal round progress when the round ends
        updateRevealRoundProgress();
    showResultAnimated();

    const guessBtn = document.getElementById('guessBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (guessBtn) guessBtn.style.display = 'none';

    if (isLastRound) {
        if (nextBtn) nextBtn.style.display = 'none';
        setTimeout(() => {
            endRevealGame({ gameOver: true, distance: 0 });
        }, 500);
        return;
    }

    if (nextBtn) {
        nextBtn.style.display = 'block';
        nextBtn.textContent = 'Zoom Out';
        nextBtn.disabled = false;
    }
}

function finalizeCurrentRoundGuessMarker(roundNumber) {
    if (!guessMarker) return;
    if (!guessLocation) return;

    // Re-style the current round's marker and keep it on the map as history.
    guessMarker.setStyle({
        radius: 7,
        fillColor: '#4CAF50',
        color: '#fff',
        weight: 2,
        opacity: 0.65,
        fillOpacity: 0.35
    });

    guessHistoryMarkers.push(guessMarker);
    guessMarker = null;
}

function clearGuessHistoryMarkers() {
    if (map && Array.isArray(guessHistoryMarkers)) {
        for (const m of guessHistoryMarkers) {
            try {
                map.removeLayer(m);
            } catch {
                // Ignore
            }
        }
    }
    guessHistoryMarkers = [];
}

function initGameIfNeeded() {
    if (gameInitialized) return;

    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    const lowEndMobile = isLowEndMobileDevice();

    map = L.map('map', {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        worldCopyJump: true,
        preferCanvas: true,
        maxBounds: L.latLngBounds(
            L.latLng(-85, -1000000),
            L.latLng(85, 1000000)
        ),
        maxBoundsViscosity: 1.0
    });

    L.tileLayer(MAIN_TILE_URL, {
        attribution: MAIN_TILE_ATTRIBUTION,
        subdomains: MAIN_TILE_SUBDOMAINS,
        maxZoom: 19,
        detectRetina: !lowEndMobile,
        keepBuffer: lowEndMobile ? 2 : 6,
        updateWhenIdle: true,
        updateWhenZooming: false,
        reuseTiles: true
    }).addTo(map);

    map.on('click', (e) => {
        if (!guessLocked) placeGuessMarker(e.latlng);
    });

    initSplitter();
    clearDecksOnReload();

    // Show/hide timer based on play style
    const timerEl = document.getElementById('revealTimer');
    if (timerEl) {
        timerEl.style.display = isTimerMode() ? 'block' : 'none';
    }

    gameInitialized = true;
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

let splitterHasUserSetWidth = false;

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

    let resizeRaf = null;

    const syncForLayout = () => {
        if (resizeRaf !== null) return;
        resizeRaf = requestAnimationFrame(() => {
            resizeRaf = null;

            if (isMobileStackedLayout()) {
                clearMapWidthOverride();
                return;
            }

            const currentWidth = mapEl.getBoundingClientRect().width || currentMapWidthPx;
            const nextWidth = clampMapWidthPx(currentWidth || DEFAULT_MAP_WIDTH_PX);
            applyMapWidthPx(nextWidth);
        });
    };

    syncForLayout();

    let dragging = false;
    let dragContainerRight = 0;
    let dragSplitterW = 0;
    let dragRaf = null;
    let pendingClientX = 0;

    const onPointerMove = (e) => {
        if (!dragging || isMobileStackedLayout()) return;

        pendingClientX = e.clientX;
        if (dragRaf !== null) return;
        dragRaf = requestAnimationFrame(() => {
            dragRaf = null;
            const proposedMapWidth = (dragContainerRight - pendingClientX) - dragSplitterW / 2;
            const clamped = clampMapWidthPx(proposedMapWidth);
            applyMapWidthPx(clamped);
        });
    };

    const stopDrag = () => {
        if (!dragging) return;
        dragging = false;
        splitterHasUserSetWidth = true;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        scheduleInvalidateSizes();
    };

    splitter.addEventListener('pointerdown', (e) => {
        if (isMobileStackedLayout()) return;
        dragging = true;

        const containerRect = container.getBoundingClientRect();
        const splitterRect = splitter.getBoundingClientRect();
        dragContainerRight = containerRect.right;
        dragSplitterW = splitterRect.width;

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

function createMiniMap(lat, lng, zoomLevel) {
    if (miniMap) {
        miniMap.off();
        miniMap.remove();
        miniMap = null;
    }

    const container = document.getElementById('miniMap');
    if (!container) return;

    container.innerHTML = '';
    if (container._leaflet_id) {
        delete container._leaflet_id;
    }

    const lowEndMobile = isLowEndMobileDevice();

    miniMap = L.map(container, {
        center: [lat, lng],
        zoom: zoomLevel,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false,
        preferCanvas: true
    });

    L.tileLayer(SNIPPIT_TILE_URL, {
        attribution: SNIPPIT_TILE_ATTRIBUTION,
        subdomains: SNIPPIT_TILE_SUBDOMAINS,
        maxZoom: 19,
        detectRetina: !lowEndMobile,
        keepBuffer: lowEndMobile ? 2 : 6,
        updateWhenIdle: true,
        updateWhenZooming: false,
        reuseTiles: true
    }).addTo(miniMap);

    setTimeout(() => miniMap.invalidateSize(), 0);
}

function updateMiniMapZoom(zoomLevel) {
    if (!miniMap) return;
    miniMap.setZoom(zoomLevel);
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

function updateRevealRoundProgress() {
    const el = document.getElementById('revealRoundProgress');
    if (!el || !revealState) return;
    el.textContent = `Round ${revealState.round}/${REVEAL_MAX_ROUNDS}`;
}

function startNewGame() {
    if (nextRoundTimer) {
        clearTimeout(nextRoundTimer);
        nextRoundTimer = null;
    }

    // Clear previous markers and polyline
    if (guessMarker) map.removeLayer(guessMarker);
    if (actualMarker) map.removeLayer(actualMarker);
    if (polyline) map.removeLayer(polyline);

    clearGuessHistoryMarkers();

    guessLocation = null;
    guessLocked = false;

    // Pick a new location
    const location = pickNextLocation();
    actualLocation = { lat: location.lat, lng: location.lng };
    currentLocationName = location.name;

    // Initialize game state
    initRevealState();
    revealState.round = 1;

    // Create mini-map at the most zoomed in level
    const zoomLevel = REVEAL_ZOOM_LEVELS[0];
    createMiniMap(location.lat, location.lng, zoomLevel);

    updateRevealRoundProgress();

    const guessBtn = document.getElementById('guessBtn');
    const nextBtn = document.getElementById('nextBtn');
    const result = document.getElementById('result');

    if (guessBtn) {
        guessBtn.textContent = 'Guess!';
        guessBtn.disabled = true;
        guessBtn.style.display = 'block';
    }
    if (nextBtn) {
        nextBtn.style.display = 'none';
        nextBtn.textContent = 'Zoom Out';
    }
    if (result) {
        result.classList.remove('is-hiding');
        result.style.display = 'none';
    }

    const mapEl = document.getElementById('map');
    if (mapEl) mapEl.classList.remove('result-hidden');

    const showToggle = document.getElementById('resultShowToggle');
    if (showToggle) showToggle.classList.remove('is-visible');


    // Reset main map view
    map.setView([20, 0], 2);

    // Start timer if in timer mode
    if (isTimerMode()) {
        startRevealTimer();
    }

    hideRoundSpinner();
    fadeOutInitialSpinner();
}

function nextRevealRound() {
    if (!revealState) return;

    // Persist the just-finished round's guess marker so it remains visible in the next round.
    const prevRound = revealState.round;
    if (revealState.roundEnded) {
        finalizeCurrentRoundGuessMarker(prevRound);
    }

    revealState.round += 1;
    revealState.roundEnded = false;

    if (revealState.round > REVEAL_MAX_ROUNDS) {
        endRevealGame({ gameOver: true });
        return;
    }

    // Clear active guess marker (history markers remain).
    if (guessMarker) {
        map.removeLayer(guessMarker);
        guessMarker = null;
    }
    if (actualMarker) {
        map.removeLayer(actualMarker);
        actualMarker = null;
    }
    if (polyline) {
        map.removeLayer(polyline);
        polyline = null;
    }
    guessLocation = null;
    guessLocked = false;

    // Zoom out the mini-map
    const zoomIndex = Math.min(revealState.round - 1, REVEAL_ZOOM_LEVELS.length - 1);
    const zoomLevel = REVEAL_ZOOM_LEVELS[zoomIndex];
    updateMiniMapZoom(zoomLevel);

    updateRevealRoundProgress();

    const guessBtn = document.getElementById('guessBtn');
    const nextBtn = document.getElementById('nextBtn');
    const result = document.getElementById('result');

    if (guessBtn) {
        guessBtn.disabled = true;
        guessBtn.style.display = 'block';
    }
    if (nextBtn) {
        nextBtn.style.display = 'none';
    }
    if (result) {
        result.classList.remove('is-hiding');
        result.style.display = 'none';
    }

    const mapEl = document.getElementById('map');
    if (mapEl) mapEl.classList.remove('result-hidden');

    const showToggle = document.getElementById('resultShowToggle');
    if (showToggle) showToggle.classList.remove('is-visible');

    // Reset main map view
    map.setView([20, 0], 2);

    // Start timer for new round if in timer mode
    if (isTimerMode()) {
        startRevealTimer();
    }

    hideRoundSpinner();
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

    if (result.style.display === 'block') return;

    if (showToggle) showToggle.classList.remove('is-visible');
    if (mapEl) mapEl.classList.remove('result-hidden');

    result.style.display = 'block';
    result.classList.add('is-hiding');
    void result.offsetHeight;
    requestAnimationFrame(() => {
        result.classList.remove('is-hiding');
    });
}

function stopConfetti() {
    updateRevealRoundProgress();
    confettiContinuous = false;
    confettiPieces = [];
    if (confettiRafId !== null) {
        cancelAnimationFrame(confettiRafId);
        confettiRafId = null;
    }

    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    if (canvas && ctx) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
}

function launchConfetti(options = {}) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const { continuous = false, color = '#4CAF50', colors = null } = options;
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
        const dpr = getConfettiDevicePixelRatioCap();
        canvas.width = Math.floor(window.innerWidth * dpr);
        canvas.height = Math.floor(window.innerHeight * dpr);
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    stopConfetti();
    confettiActive = true;
    confettiContinuous = !!continuous;

    const palette = (Array.isArray(colors) && colors.length > 0) ? colors : [color];
    const pickColor = () => palette[Math.floor(Math.random() * palette.length)];

    const makePiece = (spawnY) => {
        const w = window.innerWidth;
        return {
            x: Math.random() * w,
            y: spawnY,
            size: 6 + Math.random() * 8,
            speedX: -1.5 + Math.random() * 3,
            speedY: 2.5 + Math.random() * 6,
            rotation: Math.random() * Math.PI,
            rotationSpeed: (-0.15 + Math.random() * 0.3),
            color: pickColor()
        };
    };

    const lowEndMobile = isLowEndMobileDevice();
    const initialCount = confettiContinuous
        ? (lowEndMobile ? 70 : 140)
        : (lowEndMobile ? 90 : 160);

    confettiPieces = Array.from({ length: initialCount }, () => {
        const spawnY = confettiContinuous
            ? (-window.innerHeight + Math.random() * (window.innerHeight * 2))
            : (-20 - Math.random() * 220);
        return makePiece(spawnY);
    });

    const start = performance.now();
    const duration = confettiContinuous ? Infinity : 2600;

    const frame = (now) => {
        if (!confettiActive) return;

        const t = now - start;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (const p of confettiPieces) {
            p.x += p.speedX;
            p.y += p.speedY;
            p.rotation += p.rotationSpeed;
            p.speedY += 0.03;

            if (confettiContinuous && p.y > window.innerHeight + 40) {
                const np = makePiece(-40 - Math.random() * (window.innerHeight * 0.35));
                p.x = np.x;
                p.y = np.y;
                p.size = np.size;
                p.speedX = np.speedX;
                p.speedY = np.speedY;
                p.rotation = np.rotation;
                p.rotationSpeed = np.rotationSpeed;
                p.color = np.color;
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            ctx.restore();
        }

        if (t < duration) {
            confettiRafId = requestAnimationFrame(frame);
        } else {
            stopConfetti();
        }
    };

    confettiRafId = requestAnimationFrame(frame);
}

function showRevealSummaryOverlay() {
    const overlay = document.getElementById('revealSummaryOverlay');
    if (!overlay) return;

    const setSpinnerButtonLabel = (btn, label) => {
        if (!btn) return;
        const icon = btn.querySelector('.retry-icon');
        btn.textContent = '';
        if (icon) btn.appendChild(icon);
        btn.append(` ${label}`);
    };

    const crownEl = document.getElementById('revealSummaryCrown');
    const titleEl = document.getElementById('revealSummaryTitle');
    const resultEl = document.getElementById('revealSummaryResult');
    const roundsEl = document.getElementById('revealSummaryRounds');
    const distanceEl = document.getElementById('revealSummaryDistance');
    const timeEl = document.getElementById('revealSummaryTime');
    const locationEl = document.getElementById('revealSummaryLocation');

    const won = revealState ? revealState.won : false;
    const gameOver = revealState ? revealState.gameOver : false;
    const round = revealState ? revealState.round : 0;
    const distance = revealState ? revealState.finalDistance : 0;
    const totalTimeMs = revealState ? revealState.totalTimeMs : 0;

    if (titleEl) {
        if (gameOver) {
            titleEl.textContent = '😔 Game Over';
        } else if (won) {
            if (round === 1) {
                titleEl.textContent = '👑 Perfect First Try!';
            } else if (round <= 3) {
                titleEl.textContent = '🎉 Excellent!';
            } else {
                titleEl.textContent = '🎉 You Found It!';
            }
        }
    }

    if (resultEl) {
        if (won) {
            resultEl.textContent = round === 1 ? '🎯 Incredible!' : (round <= 3 ? '🌟 Amazing!' : (round <= 6 ? '👍 Great job!' : '👌 Nice work!'));
        } else {
            resultEl.textContent = 'Better luck next time!';
        }
    }

    if (roundsEl) {
        if (won) {
            roundsEl.textContent = `Found in ${round} of ${REVEAL_MAX_ROUNDS} rounds`;
        } else {
            roundsEl.textContent = `Could not find within ${REVEAL_MAX_ROUNDS} rounds`;
        }
    }

    if (distanceEl) {
        if (won) {
            distanceEl.textContent = `Distance: ${distance.toFixed(2)} km`;
        } else {
            distanceEl.textContent = `Target was within ${REVEAL_WIN_DISTANCE_KM} km`;
        }
    }

    if (timeEl) {
        if (isTimerMode() && totalTimeMs > 0) {
            timeEl.textContent = `Total time: ${formatClockMs(totalTimeMs)}`;
            timeEl.style.display = 'block';
        } else {
            timeEl.style.display = 'none';
        }
    }

    if (locationEl) {
        locationEl.textContent = `Location: ${currentLocationName}`;
    }

    // Retry button label: Retry on loss, Play again on win
    const retryBtn = document.getElementById('revealRetryBtn');
    setSpinnerButtonLabel(retryBtn, won ? 'Play again' : 'Retry');

    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');

    // Hide the SVG crown - we now use emojis in the title
    if (crownEl) {
        crownEl.style.display = 'none';
    }

    if (won) {
        // Better celebration for early guesses
        if (round <= 3) {
            launchConfetti({ continuous: true, colors: ['#4CAF50', '#FFD700', '#ffffff'] });
        } else {
            launchConfetti({ continuous: false, colors: ['#4CAF50', '#ffffff'] });
        }
    }
}

function hideRevealSummaryOverlay() {
    const overlay = document.getElementById('revealSummaryOverlay');
    if (!overlay) return;
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');

    stopConfetti();
}

function endRevealGame(options = {}) {
    if (!revealState) return;
    const { gameOver = false, won = false, distance = 0 } = options;
    stopRevealTimer();
    revealState.roundEnded = true;
    revealState.gameEnded = true;
    revealState.gameOver = !!gameOver;
    revealState.won = !!won;
    revealState.finalDistance = distance;

    const guessBtn = document.getElementById('guessBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (guessBtn) guessBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';

    showRevealSummaryOverlay();
}

function makeGuess() {
    if (!revealState) return;
    // After the game ends, reuse the Guess button as a "Show summary" button.
    if (revealState.gameEnded) {
        showRevealSummaryOverlay();
        return;
    }

    if (!guessLocation) return;
    if (revealState.roundEnded) return;

    stopRevealTimer();

    // Track elapsed time for timer mode
    if (isTimerMode()) {
        const elapsedMs = Math.max(0, Date.now() - revealState.roundStartMs);
        revealState.totalTimeMs += elapsedMs;
    }

    guessLocked = true;

    const distance = calculateDistance(
        guessLocation.lat,
        guessLocation.lng,
        actualLocation.lat,
        actualLocation.lng
    );

    // Check if guess is within 5km
    const isCorrect = distance <= REVEAL_WIN_DISTANCE_KM;
    const isLastRound = revealState.round >= REVEAL_MAX_ROUNDS;
    const isGameEnding = isCorrect || isLastRound;

    // Only show actual location marker and line when game is ending (win or game over)
    if (isGameEnding) {
        // Place actual location marker
        actualMarker = L.circleMarker([actualLocation.lat, actualLocation.lng], {
            radius: 10,
            fillColor: '#FF5252',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 1
        }).addTo(map).bindPopup('Actual Location').openPopup();

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
    }

    // Display result
    const distanceEl = document.getElementById('distance');
    if (distanceEl) distanceEl.textContent = `${distance.toFixed(2)} km`;

    updateRevealRoundProgress();

    let message = '';
    if (isCorrect) {
        if (distance < 1) {
            message = '🎯 Amazing! Almost exact!';
        } else if (distance < 3) {
            message = '🌟 Excellent! Very close!';
        } else {
            message = '✅ Correct! Within 5 km!';
        }
    } else {
        if (isLastRound) {
            message = `❌ Game over! You were ${distance.toFixed(1)} km away`;
        } else {
            message = `❌ ${distance.toFixed(1)} km away - try again!`;
        }
    }

    const resultText = document.getElementById('resultText');
    const actualName = document.getElementById('actualLocationName');
    const guessedNameEl = document.getElementById('guessedLocationName');
    const result = document.getElementById('result');

    if (resultText) resultText.textContent = message;
    
    // Only show actual location name when game is ending
    if (isGameEnding) {
        if (actualName) actualName.innerHTML = `<strong>Actual location:</strong> ${currentLocationName}`;
        if (guessedNameEl) {
            // Find the closest location name for the guess
            let guessedName = 'Unknown';
            let minDistance = Infinity;
            if (Array.isArray(locations)) {
                for (const loc of locations) {
                    const dist = calculateDistance(guessLocation.lat, guessLocation.lng, loc.lat, loc.lng);
                    if (dist < minDistance) {
                        minDistance = dist;
                        guessedName = loc.name;
                    }
                }
            }
            guessedNameEl.innerHTML = `<strong>You guessed near:</strong> ${guessedName}`;
        }
    } else {
        // Hide location info during the game
        if (actualName) actualName.innerHTML = '';
        if (guessedNameEl) guessedNameEl.innerHTML = '';
    }
    
    if (result) {
        result.style.display = 'block';
        result.classList.remove('is-hiding');
    }

    const mapEl = document.getElementById('map');
    if (mapEl) mapEl.classList.remove('result-hidden');
    const showToggle = document.getElementById('resultShowToggle');
    if (showToggle) showToggle.classList.remove('is-visible');

    const guessBtn = document.getElementById('guessBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (isCorrect) {
        // Player won!
        if (guessBtn) guessBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';

        setTimeout(() => {
            endRevealGame({ won: true, distance: distance });
        }, 500);
    } else {
        // Wrong guess
        revealState.roundEnded = true;

        if (revealState.round >= REVEAL_MAX_ROUNDS) {
            // Game over - used all rounds
            if (guessBtn) guessBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';

            setTimeout(() => {
                endRevealGame({ gameOver: true, distance: distance });
            }, 500);
        } else {
            // Show next button to zoom out
            if (guessBtn) guessBtn.style.display = 'none';
            if (nextBtn) {
                nextBtn.style.display = 'block';
                nextBtn.textContent = 'Zoom Out';
            }
        }
    }
}

function wireRevealSummaryActions() {
    const backBtn = document.getElementById('revealBackBtn');
    const retryBtn = document.getElementById('revealRetryBtn');
    const homeBtn = document.getElementById('revealHomeBtn');

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            hideRevealSummaryOverlay();

            const guessBtn = document.getElementById('guessBtn');
            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn) nextBtn.style.display = 'none';
            if (guessBtn) {
                guessBtn.textContent = 'Show summary';
                guessBtn.disabled = false;
                guessBtn.style.display = 'block';
            }
        });
    }

    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            hideRevealSummaryOverlay();

            showInitialSpinner();
            setTimeout(() => {
                initGameIfNeeded();
                startNewGame();
            }, INITIAL_LOAD_DELAY_MS);
        });
    }

    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
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

    nextRoundTimer = setTimeout(() => {
        nextRoundTimer = null;
        nextRevealRound();
        if (nextBtn) nextBtn.disabled = false;
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
    showInitialSpinner();
    setTimeout(() => {
        initGameIfNeeded();
        wireRevealSummaryActions();
        startNewGame();
    }, INITIAL_LOAD_DELAY_MS);
});
