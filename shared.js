/**
 * Snippit - Shared Utilities
 * ==========================
 * Common helpers and constants used across all pages (home screen and game modes).
 * This file should be loaded before any other Snippit JavaScript files.
 */

// Persisted non-repeating decks (cleared only on reload).
const LOCATION_DECK_KEY = 'snippit.locationDeck';
const QUESTION_DECK_KEY = 'snippit.questionDeck';
const RADAR_DECK_KEY = 'snippit.radarDeck';
const LOCATION_DECK_META_KEY = 'snippit.locationDeckMeta';
const QUESTION_DECK_META_KEY = 'snippit.questionDeckMeta';
const RADAR_DECK_META_KEY = 'snippit.radarDeckMeta';

function getNavigationType() {
    try {
        const entry = performance.getEntriesByType('navigation')[0];
        if (entry && entry.type) return entry.type;

        // Fallback for older browsers.
        // 0 = navigate, 1 = reload, 2 = back_forward, 255 = undefined
        if (performance && performance.navigation && typeof performance.navigation.type === 'number') {
            if (performance.navigation.type === 1) return 'reload';
            if (performance.navigation.type === 2) return 'back_forward';
            if (performance.navigation.type === 0) return 'navigate';
        }

        return 'unknown';
    } catch {
        return 'unknown';
    }
}

function clearDecksOnReload() {
    if (getNavigationType() === 'reload') {
        // Reset the non-repeating decks on a hard refresh.
        sessionStorage.removeItem(LOCATION_DECK_KEY);
        sessionStorage.removeItem(QUESTION_DECK_KEY);
        sessionStorage.removeItem(RADAR_DECK_KEY);
        sessionStorage.removeItem(LOCATION_DECK_META_KEY);
        sessionStorage.removeItem(QUESTION_DECK_META_KEY);
        sessionStorage.removeItem(RADAR_DECK_META_KEY);
    }
}
