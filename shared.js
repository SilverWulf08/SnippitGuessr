// Shared helpers used across pages (home + game).

const MAP_HINT_DISMISSED_KEY = 'snippit.mapHintDismissed';

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

function clearMapHintOnReload() {
    // User wants the hint back only when the tab is refreshed.
    // sessionStorage survives reload, so we explicitly clear the dismissal flag on reload.
    if (getNavigationType() === 'reload') {
        sessionStorage.removeItem(MAP_HINT_DISMISSED_KEY);
    }
}
