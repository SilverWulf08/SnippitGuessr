/**
 * Snippit - Classic, Questions & Radar Mode Game Logic
 * =====================================================
 * This file handles the main game logic for:
 * - Classic mode (game.html): Guess location from a zoomed-in map snippit
 * - Classic mode with Points (points.html): Same but with timed rounds and scoring
 * - Questions mode (questions.html): Answer questions by guessing on the map
 * - Radar mode (radar.html): Guess location from a radar chart showing location characteristics
 * 
 * The mode is determined by the data-mode attribute on the body element:
 * - 'classic' or undefined: Classic mode (no points)
 * - 'points': Classic mode with Points play style
 * - 'questions': Questions mode (can also use points scoring)
 * - 'radar': Radar mode (can also use points scoring)
 * 
 * For Reveal mode, see reveal.js
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

const INITIAL_LOAD_DELAY_MS = 900;

let gameInitialized = false;

const GAME_MODE = (() => {
    const mode = document.body && document.body.dataset && document.body.dataset.mode;
    if (mode === 'points') return 'points';
    if (mode === 'questions') return 'questions';
    if (mode === 'radar') return 'radar';
    return 'classic';
})();
const POINTS_ROUNDS_TOTAL = 10;
const POINTS_GOAL_TOTAL = 1000;

const QUESTIONS_USE_POINTS_KEY = 'snippit.questionsUsePoints';
const QUESTIONS_DIFFICULTY_KEY = 'snippit.questionsDifficulty';
const RADAR_USE_POINTS_KEY = 'snippit.radarUsePoints';
const RADAR_DIFFICULTY_KEY = 'snippit.radarDifficulty';

// Tile sources
// Main map: CARTO Voyager for English labels + good detail.
const MAIN_TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const MAIN_TILE_ATTRIBUTION = '© OpenStreetMap contributors © CARTO';
const MAIN_TILE_SUBDOMAINS = 'abcd';

// Snippit (mini map): OSM Standard.
const SNIPPIT_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const SNIPPIT_TILE_ATTRIBUTION = '© OpenStreetMap contributors';
const SNIPPIT_TILE_SUBDOMAINS = 'abc';

function isLowEndMobileDevice() {
    // Keep this conservative to avoid surprising quality drops.
    const smallScreen = window.matchMedia('(max-width: 768px)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const saveData = !!(connection && connection.saveData);

    const lowCores = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency > 0
        ? navigator.hardwareConcurrency <= 4
        : false;
    const lowMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory > 0
        ? navigator.deviceMemory <= 4
        : false;

    // Only treat as low-end if it's a phone-like device AND we see a likely constraint.
    return (smallScreen && coarsePointer) && (prefersReducedMotion || saveData || lowCores || lowMemory);
}

function getConfettiDevicePixelRatioCap() {
    const raw = window.devicePixelRatio || 1;
    // Confetti is a full-screen canvas; DPR is a major perf multiplier.
    return isLowEndMobileDevice() ? Math.min(raw, 1.25) : Math.min(raw, 2);
}

function getPointsDifficulty() {
    let key = 'snippit.pointsDifficulty';
    if (isQuestionsMode() && isQuestionsPointsMode()) {
        key = QUESTIONS_DIFFICULTY_KEY;
    } else if (isRadarMode() && isRadarPointsMode()) {
        key = RADAR_DIFFICULTY_KEY;
    }
    const v = sessionStorage.getItem(key);
    if (v === 'expert') return 'expert';
    if (v === 'hard') return 'hard';
    if (v === 'challenging') return 'challenging';
    return 'normal';
}

function getPointsRoundTimeLimitMs() {
    const diff = getPointsDifficulty();
    if (diff === 'hard' || diff === 'expert') return 30 * 1000;
    if (diff === 'challenging') return 1 * 60 * 1000;
    return 2 * 60 * 1000;
}

function formatDifficultyLabel(difficulty) {
    if (difficulty === 'expert') return 'Expert';
    if (difficulty === 'hard') return 'Hard';
    if (difficulty === 'challenging') return 'Challenging';
    return 'Normal';
}

let pointsState = null;

let confettiRafId = null;
let confettiActive = false;
let confettiContinuous = false;
let confettiPieces = [];

// Splitter sizing (desktop/tablet)
const MIN_PANORAMA_WIDTH_PX = 280;
const MIN_MAP_WIDTH_PX = 280;
const DEFAULT_MAP_WIDTH_PX = 400;

let currentMapWidthPx = DEFAULT_MAP_WIDTH_PX;
let invalidateScheduled = false;

// Non-repeating randomizer: each location is used once per cycle.
let locationDeck = [];
let lastPickedLocationIndex = null;
let lastPickedLocationName = '';

// Questions mode deck.
let questionDeck = [];
let lastPickedQuestionIndex = null;
let lastPickedQuestionAnswer = '';

let currentQuestionText = '';
let currentQuestionFact = '';

// Radar mode deck.
let radarDeck = [];
let lastPickedRadarIndex = null;
let lastPickedRadarName = '';

let currentRadarLocation = null;

// Persist decks across page navigation (Home -> game -> Home -> game) within the same tab.
// Storage keys are defined in shared.js and cleared only on reload.

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
    // Locations deck
    if (typeof sessionStorage !== 'undefined' && typeof locations !== 'undefined' && Array.isArray(locations) && locations.length > 0) {
        const meta = safeJsonParse(sessionStorage.getItem(LOCATION_DECK_META_KEY));
        const deck = safeJsonParse(sessionStorage.getItem(LOCATION_DECK_KEY));

        if (meta && meta.len === locations.length && isValidIndexArray(deck, locations.length)) {
            locationDeck = deck;
            lastPickedLocationIndex = (Number.isInteger(meta.lastIndex) ? meta.lastIndex : null);
            lastPickedLocationName = (typeof meta.lastName === 'string' ? meta.lastName : '');
        }
    }

    // Questions deck
    if (typeof sessionStorage !== 'undefined' && typeof questions !== 'undefined' && Array.isArray(questions) && questions.length > 0) {
        const meta = safeJsonParse(sessionStorage.getItem(QUESTION_DECK_META_KEY));
        const deck = safeJsonParse(sessionStorage.getItem(QUESTION_DECK_KEY));

        if (meta && meta.len === questions.length && isValidIndexArray(deck, questions.length)) {
            questionDeck = deck;
            lastPickedQuestionIndex = (Number.isInteger(meta.lastIndex) ? meta.lastIndex : null);
            lastPickedQuestionAnswer = (typeof meta.lastAnswer === 'string' ? meta.lastAnswer : '');
        }
    }

    // Radar deck
    if (typeof sessionStorage !== 'undefined' && typeof radarLocations !== 'undefined' && Array.isArray(radarLocations) && radarLocations.length > 0) {
        const meta = safeJsonParse(sessionStorage.getItem(RADAR_DECK_META_KEY));
        const deck = safeJsonParse(sessionStorage.getItem(RADAR_DECK_KEY));

        if (meta && meta.len === radarLocations.length && isValidIndexArray(deck, radarLocations.length)) {
            radarDeck = deck;
            lastPickedRadarIndex = (Number.isInteger(meta.lastIndex) ? meta.lastIndex : null);
            lastPickedRadarName = (typeof meta.lastName === 'string' ? meta.lastName : '');
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
        // Ignore storage errors (e.g., quota or blocked storage)
    }
}

function persistQuestionDeckState() {
    try {
        if (typeof sessionStorage === 'undefined') return;
        if (typeof questions === 'undefined' || !Array.isArray(questions) || questions.length === 0) return;
        sessionStorage.setItem(QUESTION_DECK_KEY, JSON.stringify(questionDeck));
        sessionStorage.setItem(QUESTION_DECK_META_KEY, JSON.stringify({
            len: questions.length,
            lastIndex: lastPickedQuestionIndex,
            lastAnswer: lastPickedQuestionAnswer
        }));
    } catch {
        // Ignore storage errors
    }
}

function persistRadarDeckState() {
    try {
        if (typeof sessionStorage === 'undefined') return;
        if (typeof radarLocations === 'undefined' || !Array.isArray(radarLocations) || radarLocations.length === 0) return;
        sessionStorage.setItem(RADAR_DECK_KEY, JSON.stringify(radarDeck));
        sessionStorage.setItem(RADAR_DECK_META_KEY, JSON.stringify({
            len: radarLocations.length,
            lastIndex: lastPickedRadarIndex,
            lastName: lastPickedRadarName
        }));
    } catch {
        // Ignore storage errors
    }
}

// Restore persisted deck state as early as possible (after datasets are loaded).
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

    // Small quality tweak: avoid immediately repeating the last location across a cycle boundary (when possible).
    // Prefer comparing by name, since the dataset may contain duplicates/variants of the same place.
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

    // Avoid immediate repeats by *name* as well as by index.
    // This also helps when the dataset contains multiple entries for the same place.
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

function refillQuestionDeck() {
    questionDeck = questions.map((_, idx) => idx);
    shuffleInPlace(questionDeck);

    if (questionDeck.length > 1 && (lastPickedQuestionIndex !== null || lastPickedQuestionAnswer)) {
        const nextPos = questionDeck.length - 1;
        const nextIndex = questionDeck[nextPos];
        const nextAnswer = (questions[nextIndex] && questions[nextIndex].answer) ? questions[nextIndex].answer : '';

        const repeatsIndex = (lastPickedQuestionIndex !== null) && (nextIndex === lastPickedQuestionIndex);
        const repeatsAnswer = !!(lastPickedQuestionAnswer && nextAnswer && nextAnswer === lastPickedQuestionAnswer);

        if (repeatsIndex || repeatsAnswer) {
            let swapPos = nextPos - 1;
            while (swapPos >= 0) {
                const candIndex = questionDeck[swapPos];
                const candAnswer = (questions[candIndex] && questions[candIndex].answer) ? questions[candIndex].answer : '';
                const okIndex = (lastPickedQuestionIndex === null) || (candIndex !== lastPickedQuestionIndex);
                const okAnswer = (!lastPickedQuestionAnswer) || (!candAnswer) || (candAnswer !== lastPickedQuestionAnswer);
                if (okIndex && okAnswer) break;
                swapPos -= 1;
            }

            if (swapPos >= 0) {
                [questionDeck[nextPos], questionDeck[swapPos]] = [questionDeck[swapPos], questionDeck[nextPos]];
            }
        }
    }

    persistQuestionDeckState();
}

function pickNextQuestion() {
    if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('No questions available. Check questions.js');
    }

    if (questionDeck.length === 0) {
        refillQuestionDeck();
    }

    // Avoid immediate repeats by *answer* as well as by index.
    let index = questionDeck.pop();
    const pickedAnswer = (questions[index] && questions[index].answer) ? questions[index].answer : '';
    if (questionDeck.length > 0 && lastPickedQuestionAnswer && pickedAnswer === lastPickedQuestionAnswer) {
        let swapPos = questionDeck.length - 1;
        while (swapPos >= 0) {
            const candIndex = questionDeck[swapPos];
            const candAnswer = (questions[candIndex] && questions[candIndex].answer) ? questions[candIndex].answer : '';
            if (candAnswer !== lastPickedQuestionAnswer) break;
            swapPos -= 1;
        }

        if (swapPos >= 0) {
            const altIndex = questionDeck[swapPos];
            questionDeck[swapPos] = index;
            index = altIndex;
        }
    }

    lastPickedQuestionIndex = index;
    lastPickedQuestionAnswer = questions[index] ? questions[index].answer : '';

    persistQuestionDeckState();
    return questions[index];
}

function refillRadarDeck() {
    radarDeck = radarLocations.map((_, idx) => idx);
    shuffleInPlace(radarDeck);

    if (radarDeck.length > 1 && (lastPickedRadarIndex !== null || lastPickedRadarName)) {
        const nextPos = radarDeck.length - 1;
        const nextIndex = radarDeck[nextPos];
        const nextName = (radarLocations[nextIndex] && radarLocations[nextIndex].name) ? radarLocations[nextIndex].name : '';

        const repeatsIndex = (lastPickedRadarIndex !== null) && (nextIndex === lastPickedRadarIndex);
        const repeatsName = !!(lastPickedRadarName && nextName && nextName === lastPickedRadarName);

        if (repeatsIndex || repeatsName) {
            let swapPos = nextPos - 1;
            while (swapPos >= 0) {
                const candIndex = radarDeck[swapPos];
                const candName = (radarLocations[candIndex] && radarLocations[candIndex].name) ? radarLocations[candIndex].name : '';
                const okIndex = (lastPickedRadarIndex === null) || (candIndex !== lastPickedRadarIndex);
                const okName = (!lastPickedRadarName) || (!candName) || (candName !== lastPickedRadarName);
                if (okIndex && okName) break;
                swapPos -= 1;
            }

            if (swapPos >= 0) {
                [radarDeck[nextPos], radarDeck[swapPos]] = [radarDeck[swapPos], radarDeck[nextPos]];
            }
        }
    }

    persistRadarDeckState();
}

function pickNextRadarLocation() {
    if (!Array.isArray(radarLocations) || radarLocations.length === 0) {
        throw new Error('No radar locations available. Check radar.js');
    }

    if (radarDeck.length === 0) {
        refillRadarDeck();
    }

    // Avoid immediate repeats by name as well as by index.
    let index = radarDeck.pop();
    const pickedName = (radarLocations[index] && radarLocations[index].name) ? radarLocations[index].name : '';
    if (radarDeck.length > 0 && lastPickedRadarName && pickedName === lastPickedRadarName) {
        let swapPos = radarDeck.length - 1;
        while (swapPos >= 0) {
            const candIndex = radarDeck[swapPos];
            const candName = (radarLocations[candIndex] && radarLocations[candIndex].name) ? radarLocations[candIndex].name : '';
            if (candName !== lastPickedRadarName) break;
            swapPos -= 1;
        }

        if (swapPos >= 0) {
            const altIndex = radarDeck[swapPos];
            radarDeck[swapPos] = index;
            index = altIndex;
        }
    }

    lastPickedRadarIndex = index;
    lastPickedRadarName = radarLocations[index] ? radarLocations[index].name : '';

    persistRadarDeckState();
    return radarLocations[index];
}

function initGameIfNeeded() {
    if (gameInitialized) return;

    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        // This script is intended for the game page only.
        return;
    }

    const lowEndMobile = isLowEndMobileDevice();

    // Initialize main Leaflet map with continuous world wrapping
    map = L.map('map', {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        worldCopyJump: true,
        preferCanvas: true,
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
        // Retina tiles + large buffers can be expensive on mobile.
        detectRetina: !lowEndMobile,
        // Keep fewer tiles around on low-end mobile to reduce memory/GC pressure.
        keepBuffer: lowEndMobile ? 2 : 6,
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
    clearDecksOnReload();

    // Questions mode can optionally run with points scoring; drive UI visibility via a class.
    if (document.body) {
        document.body.classList.toggle('is-points-scoring', isPointsScoringMode());
    }

    // Safety: if this page isn't a points-scoring session, drop any stale state.
    if (!isPointsScoringMode()) {
        if (pointsState && pointsState.timerIntervalId) {
            clearInterval(pointsState.timerIntervalId);
        }
        pointsState = null;
    }

    // Hide timer if not in points scoring mode
    const timerEl = document.getElementById('pointsTimer');
    if (timerEl) {
        timerEl.style.display = isPointsScoringMode() ? 'block' : 'none';
    }

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

function isQuestionsMode() {
    return GAME_MODE === 'questions';
}

function isQuestionsPointsMode() {
    return sessionStorage.getItem(QUESTIONS_USE_POINTS_KEY) === '1';
}

function isRadarMode() {
    return GAME_MODE === 'radar';
}

function isRadarPointsMode() {
    return sessionStorage.getItem(RADAR_USE_POINTS_KEY) === '1';
}

function isPointsScoringMode() {
    return isPointsMode() || (isQuestionsMode() && isQuestionsPointsMode()) || (isRadarMode() && isRadarPointsMode());
}

function setQuestionText(text) {
    currentQuestionText = text || '';
    const el = document.getElementById('questionText');
    if (el) el.textContent = currentQuestionText;
}

function setQuestionFact(text) {
    currentQuestionFact = text || '';
}

function ensurePointsState() {
    if (!isPointsScoringMode()) return null;
    if (pointsState) return pointsState;
    pointsState = {
        difficulty: getPointsDifficulty(),
        timeLimitMs: getPointsRoundTimeLimitMs(),
        gameEnded: false,
        gameOver: false,
        gameOverReason: '',
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
    if (!isPointsScoringMode()) return;
    pointsState = {
        difficulty: getPointsDifficulty(),
        timeLimitMs: getPointsRoundTimeLimitMs(),
        gameEnded: false,
        gameOver: false,
        gameOverReason: '',
        round: 0,
        totalPoints: 0,
        totalTimeMs: 0,
        roundStartMs: 0,
        roundEnded: false,
        lastTimerText: '',
        timerIntervalId: null
    };
}

let pointsTimerElCache = null;

function getPointsTimerEl() {
    if (pointsTimerElCache && document.contains(pointsTimerElCache)) return pointsTimerElCache;
    pointsTimerElCache = document.getElementById('pointsTimer');
    return pointsTimerElCache;
}

function setPointsTimerText(text) {
    if (pointsState && pointsState.lastTimerText === text) return;
    const el = getPointsTimerEl();
    if (el) el.textContent = text;
    if (pointsState) pointsState.lastTimerText = text;
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
    pointsState.lastTimerText = '';
    setPointsTimerText(formatClockMs(pointsState.timeLimitMs));

    // Tick relatively frequently so it feels responsive.
    pointsState.timerIntervalId = setInterval(tickPointsRoundTimer, 200);
}

function getBasePointsForDistanceKm(distanceKm, difficulty) {
    if (difficulty === 'hard' || difficulty === 'expert') {
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
    if (difficulty === 'hard' || difficulty === 'expert') {
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

    const setSpinnerButtonLabel = (btn, label) => {
        if (!btn) return;
        const icon = btn.querySelector('.retry-icon');
        btn.textContent = '';
        if (icon) btn.appendChild(icon);
        btn.append(` ${label}`);
    };

    const crownEl = document.getElementById('pointsSummaryCrown');

    const totalPoints = pointsState ? pointsState.totalPoints : 0;
    const totalTimeMs = pointsState ? pointsState.totalTimeMs : 0;
    const success = totalPoints >= POINTS_GOAL_TOTAL;
    const gameOver = !!(pointsState && pointsState.gameOver);
    const isExpert = !!(pointsState && pointsState.difficulty === 'expert');

    const titleEl = document.getElementById('pointsSummaryTitle');
    if (titleEl) {
        if (gameOver) {
            titleEl.textContent = '😔 Game Over';
        } else if (success) {
            if (isExpert) {
                titleEl.textContent = '👑 Expert Victory!';
            } else {
                titleEl.textContent = '🎉 Goal Reached!';
            }
        } else {
            if (isQuestionsMode()) {
                titleEl.textContent = 'Questions (Points)';
            } else if (isRadarMode()) {
                titleEl.textContent = 'Radar (Points)';
            } else {
                titleEl.textContent = 'Classic (Points)';
            }
        }
    }

    const scoreEl = document.getElementById('pointsSummaryScore');
    const goalEl = document.getElementById('pointsSummaryGoal');
    const difficultyEl = document.getElementById('pointsSummaryDifficulty');
    const roundsEl = document.getElementById('pointsSummaryRounds');
    const timeEl = document.getElementById('pointsSummaryTime');

    if (scoreEl) scoreEl.textContent = `${totalPoints} pts`;
    if (goalEl) {
        goalEl.textContent = gameOver
            ? ((pointsState && pointsState.gameOverReason === 'timeout')
                ? "You didn't make a guess in time"
                : 'A guess was over 1000 km away')
            : (success ? `Goal reached (≥ ${POINTS_GOAL_TOTAL})` : `Goal not reached (${POINTS_GOAL_TOTAL} needed)`);
    }
    if (difficultyEl) {
        const difficulty = pointsState ? pointsState.difficulty : getPointsDifficulty();
        difficultyEl.textContent = `Difficulty: ${formatDifficultyLabel(difficulty)}`;
    }
    if (roundsEl) {
        if (success && pointsState) {
            roundsEl.textContent = `Completed in: ${pointsState.round}/${POINTS_ROUNDS_TOTAL} rounds`;
            roundsEl.style.display = 'block';
        } else {
            roundsEl.style.display = 'none';
        }
    }
    if (timeEl) timeEl.textContent = `Total time: ${formatClockMs(totalTimeMs)}`;

    // Retry button label: Retry on loss, Play again on success
    const retryBtn = document.getElementById('pointsRetryBtn');
    setSpinnerButtonLabel(retryBtn, success ? 'Play again' : 'Retry');

    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');

    // Hide the SVG crown - we now use emojis in the title
    if (crownEl) {
        crownEl.style.display = 'none';
    }

    if (success) {
        const isExpertSuccess = !!(pointsState && pointsState.difficulty === 'expert');
        if (isExpertSuccess) {
            launchConfetti({ continuous: true, colors: ['#f5c938'] });
        } else {
            // Default celebration (non-expert): keep it non-gold.
            launchConfetti({ continuous: false, colors: ['#4CAF50', '#ffffff'] });
        }
    }
}

function hidePointsSummaryOverlay() {
    const overlay = document.getElementById('pointsSummaryOverlay');
    if (!overlay) return;
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');

    stopConfetti();
}

function wirePointsSummaryActions() {
    if (!isPointsScoringMode()) return;

    const backBtn = document.getElementById('pointsBackBtn');
    const retryBtn = document.getElementById('pointsRetryBtn');
    const homeBtn = document.getElementById('pointsHomeBtn');

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            hidePointsSummaryOverlay();

            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn) {
                nextBtn.textContent = 'Show summary';
                nextBtn.style.display = 'block';
            }
        });
    }

    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            hidePointsSummaryOverlay();
            resetPointsState();

            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn) nextBtn.textContent = 'Next Round';

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

function endPointsGame(options = {}) {
    if (!pointsState) return;
    const { gameOver = false, reason = '' } = options;
    stopPointsRoundTimer();
    pointsState.roundEnded = true;
    pointsState.gameEnded = true;
    pointsState.gameOver = !!gameOver;
    pointsState.gameOverReason = gameOver ? String(reason || '') : '';

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

    // Treat timeout like an end-of-round reveal (no guess was made).

    // Clear any unsubmitted guess marker/line.
    if (guessMarker) map.removeLayer(guessMarker);
    if (polyline) map.removeLayer(polyline);
    guessMarker = null;
    polyline = null;
    guessLocation = null;

    // Show the actual location.
    if (actualMarker) map.removeLayer(actualMarker);
    actualMarker = L.circleMarker([actualLocation.lat, actualLocation.lng], {
        radius: 10,
        fillColor: '#FF5252',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
    }).addTo(map).bindPopup('Actual Location').openPopup();

    // Center the map so the target is visible behind overlays.
    map.setView([actualLocation.lat, actualLocation.lng], 5);

    // Expert: any timeout is immediate Game Over.
    if (pointsState.difficulty === 'expert') {
        endPointsGame({ gameOver: true, reason: 'timeout' });
        return;
    }

    // Last round: go straight to the summary overlay (but keep the target visible on the map behind it).
    if (pointsState.round >= POINTS_ROUNDS_TOTAL) {
        endPointsGame();
        return;
    }

    // Update result overlay text.
    const distanceEl = document.getElementById('distance');
    if (distanceEl) distanceEl.textContent = '—';

    const roundEl = document.getElementById('roundProgress');
    if (roundEl && pointsState) roundEl.textContent = `Round ${pointsState.round}/${POINTS_ROUNDS_TOTAL}`;

    const resultText = document.getElementById('resultText');
    if (resultText) resultText.textContent = "⏰ You didn't make a guess in time.";

    const actualName = document.getElementById('actualLocationName');
    if (actualName) actualName.innerHTML = `<strong>Actual location:</strong> ${currentLocationName}`;

    const guessedNameEl = document.getElementById('guessedLocationName');
    if (guessedNameEl) guessedNameEl.innerHTML = '<strong>You guessed:</strong> (no guess)';
    
    // Show round/points counter for Points mode even on timeout
    if (isPointsScoringMode() && pointsState && guessedNameEl) {
        const roundCounter = `Round ${pointsState.round}/${POINTS_ROUNDS_TOTAL} • ${pointsState.totalPoints}/${POINTS_GOAL_TOTAL} pts`;
        guessedNameEl.innerHTML = `<strong>You guessed:</strong> (no guess)<br><span style="color: rgba(255,255,255,0.7); font-size: 0.9em; margin-top: 4px; display: inline-block;">${roundCounter}</span>`;
    }

    const factEl = document.getElementById('factText');
    if (factEl) {
        if (isQuestionsMode() && currentQuestionFact) {
            factEl.textContent = currentQuestionFact;
            factEl.style.display = 'block';
        } else if (isRadarMode() && currentRadarLocation && currentRadarLocation.fact) {
            factEl.textContent = currentRadarLocation.fact;
            factEl.style.display = 'block';
        } else {
            factEl.textContent = '';
            factEl.style.display = 'none';
        }
    }

    showResultAnimated();

    // Show next button (no auto-advance).
    const guessBtn = document.getElementById('guessBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (guessBtn) guessBtn.style.display = 'none';
    if (nextBtn) {
        nextBtn.textContent = 'Next Round';
        nextBtn.disabled = false;
        nextBtn.style.display = 'block';
    }
}

function stopConfetti() {
    confettiActive = false;
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

    const { continuous = false, color = '#f5c938', colors = null } = options;
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

    // For continuous mode, seed pieces across the whole screen height so it starts immediately.
    // For burst mode, keep them above the screen.
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
            p.speedY += 0.03; // gravity

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

        // Questions mode: default to a maximized map panel on larger screens.
        // Keep the user's chosen width after they drag the splitter.
        if (isQuestionsMode() && !splitterHasUserSetWidth) {
            const containerWidth = container.getBoundingClientRect().width;
            const splitterWidth = splitter.getBoundingClientRect().width;
            const maxMapWidth = Math.max(0, containerWidth - splitterWidth - MIN_PANORAMA_WIDTH_PX);
            const nextWidth = clampMapWidthPx(maxMapWidth);
            applyMapWidthPx(nextWidth);
            return;
        }

        // Ensure we start from a sensible width and keep it clamped on resizes.
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
            // Pointer is on the splitter; treat its center as the boundary.
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
    if (!container) return;

    // Reset Leaflet internal id + DOM content for safe re-init
    container.innerHTML = '';
    if (container._leaflet_id) {
        delete container._leaflet_id;
    }

    const lowEndMobile = isLowEndMobileDevice();

    // Create mini map showing zoomed-in view of the location
    miniMap = L.map(container, {
        center: [lat, lng],
        zoom: 16, // More zoomed-in so it's harder to recognize instantly
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false,
        preferCanvas: true
    });

    // Snippit tiles (OSM Standard)
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

    const factEl = document.getElementById('factText');
    if (factEl) {
        factEl.style.display = 'none';
        factEl.textContent = '';
    }
    setQuestionFact('');

    const mapEl = document.getElementById('map');
    if (mapEl) mapEl.classList.remove('result-hidden');

    const showToggle = document.getElementById('resultShowToggle');
    if (showToggle) showToggle.classList.remove('is-visible');

    if (isPointsScoringMode()) {
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
        if (roundEl) roundEl.textContent = `Round ${pointsState.round}/${POINTS_ROUNDS_TOTAL}`;

        startPointsRoundTimer();
    }

    if (isQuestionsMode()) {
        const q = pickNextQuestion();
        actualLocation = { lat: q.lat, lng: q.lng };
        currentLocationName = q.answer;
        setQuestionText(q.question);
        setQuestionFact(q.fact || '');

        // No minimap in Questions mode.
        if (miniMap) {
            miniMap.off();
            miniMap.remove();
            miniMap = null;
        }
    } else if (isRadarMode()) {
        const loc = pickNextRadarLocation();
        actualLocation = { lat: loc.lat, lng: loc.lng };
        currentLocationName = loc.name;
        currentRadarLocation = loc;

        // Draw radar chart
        const canvas = document.getElementById('radarCanvas');
        if (canvas && typeof drawRadarChart === 'function') {
            drawRadarChart(canvas, loc.radar);
        }

        // Update legend
        // const legend = document.getElementById('radarLegend');
        // if (legend && typeof updateRadarLegend === 'function') {
        //     updateRadarLegend(legend);
        // }

        // No minimap in Radar mode.
        if (miniMap) {
            miniMap.off();
            miniMap.remove();
            miniMap = null;
        }
    } else {
        // Get random location
        const location = pickNextLocation();
        actualLocation = { lat: location.lat, lng: location.lng };
        currentLocationName = location.name;

        // Create mini-map showing zoomed-in view
        createMiniMap(location.lat, location.lng);
    }

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

    if (isPointsScoringMode()) {
        ensurePointsState();
        if (pointsState.roundEnded) return;
        pointsState.roundEnded = true;
        stopPointsRoundTimer();
    }

    guessLocked = true;

    const distance = calculateDistance(
        guessLocation.lat,
        guessLocation.lng,
        actualLocation.lat,
        actualLocation.lng
    );

    const isExpertGameOver = isPointsScoringMode() && pointsState && pointsState.difficulty === 'expert' && distance > 1000;

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
    if (Array.isArray(locations)) {
        for (const loc of locations) {
            const dist = calculateDistance(guessLocation.lat, guessLocation.lng, loc.lat, loc.lng);
            if (dist < minDistance) {
                minDistance = dist;
                guessedName = loc.name;
            }
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

    if (isPointsScoringMode()) {
        const elapsedMs = Math.max(0, Date.now() - pointsState.roundStartMs);
        pointsState.totalTimeMs += elapsedMs;

        const basePoints = getBasePointsForDistanceKm(distance, pointsState.difficulty);
        const multiplier = getSpeedMultiplierForElapsedMs(elapsedMs, pointsState.difficulty);
        const awarded = Math.round(basePoints * multiplier);
        pointsState.totalPoints += awarded;

        const progressEl = document.getElementById('pointsProgress');
        if (progressEl) progressEl.textContent = `${pointsState.totalPoints}/${POINTS_GOAL_TOTAL} pts`;

        const roundEl = document.getElementById('roundProgress');
        if (roundEl) roundEl.textContent = `Round ${pointsState.round}/${POINTS_ROUNDS_TOTAL}`;

        const multiplierText = multiplier === 1 ? '' : ` (x${multiplier})`;
        message = `${message} +${awarded} points${multiplierText}`;

        // Expert twist: a single guess over 1000 km ends the entire run.
        if (isExpertGameOver) {
            const guessBtn = document.getElementById('guessBtn');
            const nextBtn = document.getElementById('nextBtn');
            if (guessBtn) guessBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';

            setTimeout(() => {
                endPointsGame({ gameOver: true });
            }, 250);
        } else {
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
    }

    const resultText = document.getElementById('resultText');
    const actualName = document.getElementById('actualLocationName');
    const guessedNameEl = document.getElementById('guessedLocationName');
    const result = document.getElementById('result');
    const factEl = document.getElementById('factText');
    if (resultText) resultText.textContent = message;
    if (actualName) actualName.innerHTML = `<strong>Actual location:</strong> ${currentLocationName}`;
    if (guessedNameEl) guessedNameEl.innerHTML = `<strong>You guessed near:</strong> ${guessedName}`;
    
    // Show round/points counter for Points mode
    if (isPointsScoringMode() && pointsState) {
        const roundCounter = `Round ${pointsState.round}/${POINTS_ROUNDS_TOTAL} • ${pointsState.totalPoints}/${POINTS_GOAL_TOTAL} pts`;
        if (guessedNameEl) {
            guessedNameEl.innerHTML = `<strong>You guessed near:</strong> ${guessedName}<br><span style="color: rgba(255,255,255,0.7); font-size: 0.9em; margin-top: 4px; display: inline-block;">${roundCounter}</span>`;
        }
    }
    
    if (factEl) {
        if (isQuestionsMode() && currentQuestionFact) {
            factEl.textContent = currentQuestionFact;
            factEl.style.display = 'block';
        } else if (isRadarMode() && currentRadarLocation && currentRadarLocation.fact) {
            factEl.textContent = currentRadarLocation.fact;
            factEl.style.display = 'block';
        } else {
            factEl.textContent = '';
            factEl.style.display = 'none';
        }
    }
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
    if (nextBtn && !isPointsScoringMode()) nextBtn.style.display = 'block';
    if (nextBtn && isPointsScoringMode() && pointsState.round < POINTS_ROUNDS_TOTAL && pointsState.totalPoints < POINTS_GOAL_TOTAL) nextBtn.style.display = 'block';
}

// Event listeners
const guessBtn = document.getElementById('guessBtn');
if (guessBtn) guessBtn.addEventListener('click', makeGuess);

const nextBtn = document.getElementById('nextBtn');
if (nextBtn) nextBtn.addEventListener('click', () => {
    if (isPointsScoringMode() && pointsState && pointsState.gameEnded) {
        showPointsSummaryOverlay();
        nextBtn.style.display = 'none';
        return;
    }

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
        if (isPointsScoringMode()) {
            resetPointsState();
            wirePointsSummaryActions();
        }
        newRound();
    }, INITIAL_LOAD_DELAY_MS);
});
