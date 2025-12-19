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

function initMap() {
    // Show initial spinner during page load/refresh.
    showInitialSpinner();

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

    // Add CartoDB tiles with English labels
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        maxZoom: 19
    }).addTo(map);

    // Add click listener
    map.on('click', (e) => {
        // Allow moving the pin freely until the guess is submitted.
        if (!guessLocked) placeGuessMarker(e.latlng);
    });

    initSplitter();

    // Start first round with the same small delay as Next Round.
    nextRoundTimer = setTimeout(() => {
        nextRoundTimer = null;
        newRound();
    }, 900);
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

    // Use standard OSM tiles so the snippit has road names + POIs as clues
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
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
    document.getElementById('guessBtn').disabled = false;
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
    document.getElementById('guessBtn').disabled = true;
    document.getElementById('nextBtn').disabled = false;
    document.getElementById('result').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('guessBtn').style.display = 'block';
    document.getElementById('hint').style.display = 'block';

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

    guessLocked = true;

    document.getElementById('hint').style.display = 'none';

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
    document.getElementById('distance').textContent = `${distance.toFixed(2)} km`;

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

    document.getElementById('resultText').textContent = message;
    document.getElementById('actualLocationName').innerHTML = `<strong>Actual location:</strong> ${currentLocationName}`;
    document.getElementById('guessedLocationName').innerHTML = `<strong>You guessed near:</strong> ${guessedName}`;
    document.getElementById('result').style.display = 'block';

    // Show next button
    document.getElementById('guessBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'block';
}

// Event listeners
document.getElementById('guessBtn').addEventListener('click', makeGuess);

document.getElementById('nextBtn').addEventListener('click', () => {
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

// Initialize on load
window.addEventListener('load', initMap);
