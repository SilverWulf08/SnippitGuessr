/**
 * Snippit - Home Screen
 * =====================
 * Handles the main home screen UI, mode selection cards, intro overlays,
 * and navigation to different game modes.
 * 
 * Game Modes:
 * - Classic: Guess the location from a zoomed-in map snippit
 * - Questions: Answer geography questions by guessing on the map
 * - Reveal: Start zoomed in and zoom out each round until you find it
 * 
 * Play Styles:
 * - Classic (no timer/points): Play at your own pace
 * - Points: Timed rounds with scoring based on distance and speed
 * - Timer (Reveal only): Decreasing time limit per round
 */

const INITIAL_LOAD_DELAY_MS = 900;
let initialSpinnerDismissed = false;

clearMapHintOnReload();

// Questions intro should default to Classic/no-points.
// We still store the choice when starting the mode, but we reset it when returning home.
sessionStorage.removeItem('snippit.questionsUsePoints');
sessionStorage.removeItem('snippit.questionsDifficulty');

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

function showHomeScreen() {
    const home = document.getElementById('homeScreen');
    if (home) home.style.display = 'block';
}

let pendingMode = null;

const QUESTIONS_USE_POINTS_KEY = 'snippit.questionsUsePoints';
const QUESTIONS_DIFFICULTY_KEY = 'snippit.questionsDifficulty';

const PATCH_NOTES_URL = 'patch-notes.json?v=20251224_1';
let patchNotesCache = null;

async function loadPatchNotes() {
    if (patchNotesCache) return patchNotesCache;
    const res = await fetch(PATCH_NOTES_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load patch notes: ${res.status}`);
    const data = await res.json();
    patchNotesCache = data;
    return data;
}

function renderPatchNotes(data) {
    const introEl = document.getElementById('patchNotesIntro');
    const listEl = document.getElementById('patchNotesList');
    if (!introEl || !listEl) return;

    introEl.textContent = (data && typeof data.intro === 'string') ? data.intro : '';
    listEl.innerHTML = '';

    const versions = (data && Array.isArray(data.versions)) ? data.versions : [];
    for (const v of versions) {
        const versionText = (v && typeof v.version === 'string') ? v.version : 'Unknown';
        const dateText = (v && typeof v.date === 'string') ? v.date : '';
        const notes = (v && Array.isArray(v.notes)) ? v.notes : [];

        const section = document.createElement('section');
        section.className = 'patch-notes__version';

        const title = document.createElement('div');
        title.className = 'patch-notes__version-title';
        title.textContent = `Version ${versionText}`;
        section.appendChild(title);

        if (dateText) {
            const meta = document.createElement('div');
            meta.className = 'patch-notes__version-meta';
            meta.textContent = dateText;
            section.appendChild(meta);
        }

        if (notes.length > 0) {
            const ul = document.createElement('ul');
            ul.className = 'patch-notes__items';
            for (const item of notes) {
                const li = document.createElement('li');
                li.textContent = String(item);
                ul.appendChild(li);
            }
            section.appendChild(ul);
        }

        listEl.appendChild(section);
    }
}

function setPatchNotesLoading(loading) {
    const introEl = document.getElementById('patchNotesIntro');
    const listEl = document.getElementById('patchNotesList');
    if (!introEl || !listEl) return;
    if (!loading) return;
    introEl.textContent = 'Loading patch notes…';
    listEl.innerHTML = '';
}

function setPatchNotesError(message) {
    const introEl = document.getElementById('patchNotesIntro');
    const listEl = document.getElementById('patchNotesList');
    if (!introEl || !listEl) return;
    introEl.textContent = message || 'Could not load patch notes.';
    listEl.innerHTML = '';
}

function getPointsDifficultyExplanationText() {
    return (
        'Points are based on distance (closer = more points) and a speed bonus.\n' +
        'If time runs out, the round ends with 0 points and auto-advances.\n\n' +
        'Normal: 2:00 per round. Speed bonus: 2x (under 30s), 1.5x (under 60s).\n' +
        'Challenging: 1:00 per round. Reduced distance points. Speed bonus: 1.5x (under 30s).\n' +
        'Hard: 0:30 per round. Very tough distance points. Speed bonus: 2x (under 10s).\n' +
        'Expert: same as Hard, but if you guess more than 1000 km away even once, it is Game Over.'
    );
}

function getQuestionsDifficultyExplanationText() {
    return (
        'Classic: keep playing at your own pace.\n\n' +
        'Points: 10 rounds, reach 1000 points. You score based on distance (closer = more points) plus a speed bonus.\n' +
        'If time runs out, the round ends with 0 points.\n\n' +
        'Normal: 2:00 per round. Speed bonus: 2x (under 30s), 1.5x (under 60s).\n' +
        'Challenging: 1:00 per round. Reduced distance points. Speed bonus: 1.5x (under 30s).\n' +
        'Hard: 0:30 per round. Very tough distance points. Speed bonus: 2x (under 10s).\n' +
        'Expert: same as Hard, but if you guess more than 1000 km away even once, it is Game Over.'
    );
}

function setModeIntroMoreOverlayVisible(visible) {
    const overlay = document.getElementById('modeIntroMoreOverlay');
    if (!overlay) return;

    // Important: allow CSS transitions to run by not toggling display+class in the same frame.
    if (visible) {
        overlay.style.display = 'flex';
        overlay.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => {
            overlay.classList.add('is-visible');
        });
        return;
    }

    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');

    // Wait for fade-out before removing from layout.
    window.setTimeout(() => {
        if (!overlay.classList.contains('is-visible')) {
            overlay.style.display = 'none';
        }
    }, 220);
}

function setModeIntroMoreOverlayContent(titleText, bodyText) {
    const title = document.getElementById('modeIntroMoreTitle');
    const body = document.getElementById('modeIntroMoreBody');
    if (title) title.textContent = titleText;
    if (body) body.textContent = bodyText;
}

function setModeIntroVisible(visible) {
    const intro = document.getElementById('modeIntro');
    if (!intro) return;
    intro.classList.toggle('is-visible', visible);
    intro.setAttribute('aria-hidden', visible ? 'false' : 'true');

    if (!visible) {
        setModeIntroMoreOverlayVisible(false);
    }
}

function getCheckedRadioValue(name) {
    const selected = document.querySelector(`input[type="radio"][name="${name}"]:checked`);
    return selected ? selected.value : '';
}

function setCheckedRadioValue(name, value) {
    const input = document.querySelector(`input[type="radio"][name="${name}"][value="${value}"]`);
    if (!input) return;
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
}

function showModeIntro(mode) {
    pendingMode = mode;

    const intro = document.getElementById('modeIntro');
    const title = document.getElementById('modeIntroTitle');
    const desc = document.getElementById('modeIntroDescription');
    const helpExtra = document.getElementById('modeIntroHelpExtra');
    const helpModes = document.getElementById('modeIntroHelpModes');
    const patchNotes = document.getElementById('modeIntroPatchNotes');
    const moreBtn = document.getElementById('modeIntroMoreBtn');
    const moreParking = document.getElementById('modeIntroInfoParking');
    const classicScoring = document.getElementById('modeIntroClassicScoring');
    const diff = document.getElementById('modeIntroPointsDifficulty');
    const qScoring = document.getElementById('modeIntroQuestionsScoring');
    const qDiff = document.getElementById('modeIntroQuestionsDifficulty');
    const back = document.getElementById('modeIntroBack');
    const play = document.getElementById('modeIntroPlay');
    if (!intro || !title || !desc || !diff) return;

    intro.dataset.mode = mode;

    if (back) back.style.display = '';
    if (play) {
        play.style.display = '';
        play.textContent = 'Play';
    }

    if (helpExtra) helpExtra.style.display = 'none';
    if (patchNotes) patchNotes.style.display = 'none';

    // Ensure the Points info button starts from a known place every time.
    if (moreBtn && moreParking) {
        moreParking.appendChild(moreBtn);
    }

    if (mode === 'classic') {
        title.textContent = 'Classic mode';
        desc.textContent =
            'Play the classic Snippit experience.\n' +
            'You\'ll see a zoomed-in mini-map (the “snippit”) and have to try and guess the correct spot by placing your guess on the big world map.\n\n' +
            'Choose Classic or Points play style.';

        if (classicScoring) classicScoring.style.display = 'block';
        if (qScoring) qScoring.style.display = 'none';

        const revealScoring = document.getElementById('modeIntroRevealScoring');
        if (revealScoring) revealScoring.style.display = 'none';

        // Default state: Classic (no points)
        const classicRadio = document.querySelector('input[name="classicScoring"][value="classic"]');
        if (classicRadio) classicRadio.checked = true;

        diff.style.display = 'none';
        if (moreBtn) moreBtn.style.display = 'none';

        const normalDiff = document.querySelector('input[name="pointsDifficulty"][value="normal"]');
        if (normalDiff) normalDiff.checked = true;
    } else if (mode === 'questions') {
        title.textContent = 'Questions mode';
        desc.textContent =
            'Answer short prompts by guessing the correct spot on the world map.\n\n' +
            'Expect questions about places, famous people, historic events, landmarks, and food — enough variety to keep it surprising.\n\n' +
            'Choose Classic or Points play style.';
        if (moreBtn) moreBtn.style.display = 'none';
        if (classicScoring) classicScoring.style.display = 'none';
        diff.style.display = 'none';
        if (qScoring) qScoring.style.display = 'block';

        const revealScoring = document.getElementById('modeIntroRevealScoring');
        if (revealScoring) revealScoring.style.display = 'none';

        // Default state: Classic (no points)
        const classicRadio = document.querySelector('input[name="questionsScoring"][value="classic"]');
        if (classicRadio) classicRadio.checked = true;
        if (qDiff) qDiff.style.display = 'none';

        const normalDiff = document.querySelector('input[name="questionsDifficulty"][value="normal"]');
        if (normalDiff) normalDiff.checked = true;
    } else if (mode === 'reveal') {
        title.textContent = 'Reveal mode';
        desc.textContent =
            'Start with a very zoomed in snippit and try to guess where it is on the world map.\n\n' +
            'Each round the snippit zooms out a little more, revealing more of the area.\n' +
            'You have 10 rounds to guess within 5 km of the target. The earlier you guess, the better!\n\n' +
            'Choose Classic or Timer play style.';
        if (moreBtn) moreBtn.style.display = 'none';
        if (classicScoring) classicScoring.style.display = 'none';
        diff.style.display = 'none';
        if (qScoring) qScoring.style.display = 'none';

        const revealScoring = document.getElementById('modeIntroRevealScoring');
        if (revealScoring) revealScoring.style.display = 'block';

        // Default state: Classic (no timer)
        const classicRadio = document.querySelector('input[name="revealScoring"][value="classic"]');
        if (classicRadio) classicRadio.checked = true;
    } else if (mode === 'help') {
        // Help / about screen
        title.textContent = 'What is Snippit?';
        // Keep the current first three lines from the old description.
        desc.textContent =
            'Snippit is a quick geography guessing game playable on both desktop and mobile devices in the browser.\n\n' +
            'You see a zoomed-in mini-map (the “snippit”) and you try to place your guess on the big world map.\n' +
            'After guessing you\'ll see the distance between your guess and the real location.';

        if (helpExtra) helpExtra.style.display = 'block';
        if (helpModes) {
            helpModes.textContent =
                'Classic mode: Play the classic Snippit experience.\n' +
                'Choose Classic or Points play style.\n\n' +
                'Questions mode: Answer short prompts by guessing the correct spot on the world map.\n' +
                'Choose Classic or Points play style.\n\n' +
                'Reveal mode: Start with a very zoomed in snippit and zoom out each round.\n' +
                'Guess within 5 km in 10 rounds to win. Choose Classic or Timer play style.';
        }

        if (moreBtn) moreBtn.style.display = 'none';
        if (classicScoring) classicScoring.style.display = 'none';
        diff.style.display = 'none';
        if (qScoring) qScoring.style.display = 'none';

        const revealScoringHelp = document.getElementById('modeIntroRevealScoring');
        if (revealScoringHelp) revealScoringHelp.style.display = 'none';

        // Spec: big Back button instead of Play for this screen.
        if (back) back.style.display = 'none';
        if (play) play.textContent = 'Back';
    } else if (mode === 'patchNotes') {
        title.textContent = 'Patch Notes';
        desc.textContent = '';

        if (patchNotes) patchNotes.style.display = 'block';
        setPatchNotesLoading(true);
        loadPatchNotes()
            .then((data) => renderPatchNotes(data))
            .catch(() => setPatchNotesError('Could not load patch notes.'));

        if (moreBtn) moreBtn.style.display = 'none';
        if (classicScoring) classicScoring.style.display = 'none';
        diff.style.display = 'none';
        if (qScoring) qScoring.style.display = 'none';

        const revealScoringPN = document.getElementById('modeIntroRevealScoring');
        if (revealScoringPN) revealScoringPN.style.display = 'none';

        // Use the same "big Back" behavior as the help screen.
        if (back) back.style.display = 'none';
        if (play) play.textContent = 'Back';
    } else {
        // Fallback
        title.textContent = '';
        desc.textContent = '';
        if (moreBtn) moreBtn.style.display = 'none';
        if (classicScoring) classicScoring.style.display = 'none';
        diff.style.display = 'none';
        if (qScoring) qScoring.style.display = 'none';

        const revealScoringFB = document.getElementById('modeIntroRevealScoring');
        if (revealScoringFB) revealScoringFB.style.display = 'none';
    }

    setModeIntroVisible(true);
}

function hideModeIntro() {
    pendingMode = null;
    setModeIntroVisible(false);
}

function getSelectedPointsDifficulty() {
    const selected = document.querySelector('input[name="pointsDifficulty"]:checked');
    return selected ? selected.value : 'normal';
}

function getQuestionsUsePointsSelected() {
    const el = document.getElementById('questionsUsePointsToggle');
    return !!(el && el.checked);
}

function getSelectedQuestionsDifficulty() {
    const selected = document.querySelector('input[name="questionsDifficulty"]:checked');
    return selected ? selected.value : 'normal';
}

function getSelectedQuestionsScoring() {
    const selected = document.querySelector('input[name="questionsScoring"]:checked');
    return selected ? selected.value : 'classic';
}

function getSelectedClassicScoring() {
    const selected = document.querySelector('input[name="classicScoring"]:checked');
    return selected ? selected.value : 'classic';
}

function getSelectedRevealScoring() {
    const selected = document.querySelector('input[name="revealScoring"]:checked');
    return selected ? selected.value : 'classic';
}

function startSelectedMode() {
    if (!pendingMode) return;

    if (pendingMode === 'help' || pendingMode === 'patchNotes') {
        hideModeIntro();
        return;
    }

    if (pendingMode === 'reveal') {
        const revealScoring = getSelectedRevealScoring();
        sessionStorage.setItem('snippit.startMode', 'reveal');
        sessionStorage.setItem('snippit.revealPlayStyle', revealScoring);
        showInitialSpinner();
        setTimeout(() => {
            window.location.href = 'reveal.html';
        }, 80);
        return;
    }

    showInitialSpinner();

    if (pendingMode === 'classic') {
        const scoring = getSelectedClassicScoring();
        if (scoring === 'points') {
            sessionStorage.setItem('snippit.startMode', 'points');
            sessionStorage.setItem('snippit.pointsDifficulty', getSelectedPointsDifficulty());
            setTimeout(() => {
                window.location.href = 'points.html';
            }, 80);
            return;
        }

        sessionStorage.setItem('snippit.startMode', 'classic');
        setTimeout(() => {
            window.location.href = 'game.html';
        }, 80);
        return;
    }

    if (pendingMode === 'questions') {
        sessionStorage.setItem('snippit.startMode', 'questions');

        const usePoints = getSelectedQuestionsScoring() === 'points';
        if (usePoints) {
            sessionStorage.setItem(QUESTIONS_USE_POINTS_KEY, '1');
            sessionStorage.setItem(QUESTIONS_DIFFICULTY_KEY, getSelectedQuestionsDifficulty());
        } else {
            sessionStorage.removeItem(QUESTIONS_USE_POINTS_KEY);
            sessionStorage.removeItem(QUESTIONS_DIFFICULTY_KEY);
        }

        setTimeout(() => {
            window.location.href = 'questions.html';
        }, 80);
        return;
    }

    // (Points mode is launched via Classic -> Classic with points)
}

function wireModeIntro() {
    const back = document.getElementById('modeIntroBack');
    const play = document.getElementById('modeIntroPlay');
    const qDiff = document.getElementById('modeIntroQuestionsDifficulty');
    const pointsDiff = document.getElementById('modeIntroPointsDifficulty');
    const moreBtn = document.getElementById('modeIntroMoreBtn');
    const moreParking = document.getElementById('modeIntroInfoParking');
    const pointsInfoSlot = document.getElementById('modeIntroPointsInfoSlot');
    const questionsInfoSlot = document.getElementById('modeIntroQuestionsInfoSlot');
    const moreOverlay = document.getElementById('modeIntroMoreOverlay');
    const helpPointsInfoBtn = document.getElementById('modeIntroHelpPointsInfoBtn');

    const parkMoreBtn = () => {
        if (moreBtn && moreParking) {
            moreParking.appendChild(moreBtn);
        }
    };

    const placeMoreBtn = (slotEl) => {
        if (!moreBtn) return;
        if (!slotEl) {
            parkMoreBtn();
            return;
        }
        slotEl.appendChild(moreBtn);
    };

    const activate = (el, handler) => {
        if (!el) return;
        el.addEventListener('click', handler);
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handler();
            }
        });
    };

    activate(back, hideModeIntro);
    activate(play, startSelectedMode);

    if (helpPointsInfoBtn) {
        helpPointsInfoBtn.addEventListener('click', () => {
            setModeIntroMoreOverlayContent('Points info', getPointsDifficultyExplanationText());
            setModeIntroMoreOverlayVisible(true);
        });
    }

    if (moreBtn) {
        moreBtn.addEventListener('click', () => {
            const modeIntro = document.getElementById('modeIntro');
            const mode = modeIntro ? modeIntro.dataset.mode : '';
            const showPointsInfo = () => {
                setModeIntroMoreOverlayContent('Points info', getPointsDifficultyExplanationText());
                setModeIntroMoreOverlayVisible(true);
            };

            if (mode === 'classic' && getSelectedClassicScoring() === 'points') {
                showPointsInfo();
                return;
            }

            if (mode === 'questions' && getSelectedQuestionsScoring() === 'points') {
                showPointsInfo();
                return;
            }
        });
    }

    if (moreOverlay) {
        moreOverlay.addEventListener('click', (e) => {
            if (e.target === moreOverlay) {
                setModeIntroMoreOverlayVisible(false);
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        const overlay = document.getElementById('modeIntroMoreOverlay');
        if (overlay && overlay.classList.contains('is-visible')) {
            setModeIntroMoreOverlayVisible(false);
        }
    });

    if (qDiff) {
        const updateQuestionsDifficultyVisibility = () => {
            const v = getSelectedQuestionsScoring();
            qDiff.style.display = (v === 'points') ? 'block' : 'none';
            if (moreBtn) {
                moreBtn.style.display = (v === 'points') ? 'inline-block' : 'none';
            }

            if (v === 'points') {
                placeMoreBtn(questionsInfoSlot);
            } else {
                parkMoreBtn();
            }
        };

        document.addEventListener('change', (e) => {
            const t = e.target;
            if (!(t instanceof HTMLInputElement)) return;
            if (t.name === 'questionsScoring') {
                updateQuestionsDifficultyVisibility();
            }
        });

        updateQuestionsDifficultyVisibility();
    }

    if (pointsDiff && moreBtn) {
        const updateClassicPointsVisibility = () => {
            const modeIntro = document.getElementById('modeIntro');
            const mode = modeIntro ? modeIntro.dataset.mode : '';
            if (mode !== 'classic') return;

            const v = getSelectedClassicScoring();
            pointsDiff.style.display = (v === 'points') ? 'block' : 'none';
            moreBtn.style.display = (v === 'points') ? 'inline-block' : 'none';

            if (v === 'points') {
                placeMoreBtn(pointsInfoSlot);
            } else {
                parkMoreBtn();
            }
        };

        document.addEventListener('change', (e) => {
            const t = e.target;
            if (!(t instanceof HTMLInputElement)) return;
            if (t.name === 'classicScoring') {
                updateClassicPointsVisibility();
            }
        });

        updateClassicPointsVisibility();
    }
}

function wireHomeButtons() {
    const classic = document.getElementById('classicMode');
    const points = document.getElementById('revealMode');
    const questions = document.getElementById('questionsMode');
    const help = document.getElementById('homeHelpBtn');
    const patchNotes = document.getElementById('homePatchNotesBtn');
    const deck = document.getElementById('homeDeck');

    const activate = (el, handler) => {
        if (!el) return;
        el.addEventListener('click', handler);
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handler();
            }
        });
    };

    const wireHomeModeDeck = () => {
        if (!deck || !classic || !questions || !points) {
            // Fallback: keep the original click behavior.
            activate(questions, () => showModeIntro('questions'));
            activate(classic, () => showModeIntro('classic'));
            activate(points, () => showModeIntro('points'));
            return;
        }

        // Canonical order for the deck.
        const cards = [questions, classic, points];
        const modeById = {
            questionsMode: 'questions',
            classicMode: 'classic',
            revealMode: 'reveal'
        };

        // Default: Classic mode is front-and-center.
        let activeIndex = 1;
        let isAnimating = false;

        const normalizeDelta = (delta, n) => {
            // Wrap into [-floor(n/2), floor(n/2)] for n=3 -> [-1, 1]
            if (delta > 1) return delta - n;
            if (delta < -1) return delta + n;
            return delta;
        };

        const applyPositions = () => {
            const n = cards.length;
            for (let i = 0; i < n; i++) {
                const card = cards[i];
                const delta = normalizeDelta(i - activeIndex, n);
                card.dataset.deckPos = String(delta);
                card.tabIndex = (delta === 0) ? 0 : -1;
            }
        };

        const setActive = (nextIndex, opts = {}) => {
            const { focus = false } = opts;
            if (typeof nextIndex !== 'number') return;
            const n = cards.length;
            const clamped = ((nextIndex % n) + n) % n;
            if (clamped === activeIndex) return;
            if (isAnimating) return;
            isAnimating = true;
            activeIndex = clamped;
            applyPositions();

            window.setTimeout(() => {
                isAnimating = false;
                if (focus) {
                    const active = cards[activeIndex];
                    if (active) active.focus({ preventScroll: true });
                }
            }, 540);
        };

        const cycle = (dir) => {
            setActive(activeIndex + dir, { focus: true });
        };

        const openActiveMode = () => {
            const active = cards[activeIndex];
            if (!active) return;
            const mode = modeById[active.id];
            if (!mode) return;
            showModeIntro(mode);
        };

        // Keyboard behavior for cards (click is handled via delegated handler below).
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];

            card.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    cycle(-1);
                    return;
                }
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    cycle(1);
                    return;
                }
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (i !== activeIndex) {
                        setActive(i, { focus: true });
                    } else {
                        openActiveMode();
                    }
                }
            });
        }

        // Swipe support (mobile + trackpads). Keeps it lightweight: only detects a clear left/right gesture.
        let pointerDown = false;
        let startX = 0;
        let startY = 0;
        let startAt = 0;
        let didSwipe = false;
        const SWIPE_MIN_PX = 44;
        const SWIPE_MAX_MS = 700;

        const isVerticalDeckLayout = () => {
            // Keep this in sync with the CSS breakpoint for the vertical deck.
            return !!(window.matchMedia && window.matchMedia('(max-width: 520px)').matches);
        };

        const onPointerDown = (e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            pointerDown = true;
            didSwipe = false;
            startX = e.clientX;
            startY = e.clientY;
            startAt = performance.now();
        };

        const onPointerUp = (e) => {
            if (!pointerDown) return;
            pointerDown = false;
            const dt = performance.now() - startAt;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            // Must be reasonably quick.
            if (dt > SWIPE_MAX_MS) return;

            if (isVerticalDeckLayout()) {
                // Vertical deck: swipe up/down.
                if (Math.abs(dy) < SWIPE_MIN_PX) return;
                if (Math.abs(dy) < Math.abs(dx) * 1.25) return;

                // Mark that we swiped so click handlers know not to fire.
                didSwipe = true;

                // Swipe up = next card (down the stack)
                if (dy < 0) cycle(1);
                else cycle(-1);
                return;
            }

            // Horizontal deck: swipe left/right.
            if (Math.abs(dx) < SWIPE_MIN_PX) return;
            if (Math.abs(dx) < Math.abs(dy) * 1.25) return;

            // Mark that we swiped so click handlers know not to fire.
            didSwipe = true;

            // Swipe left = next card (to the right)
            if (dx < 0) cycle(1);
            else cycle(-1);
        };

        deck.addEventListener('pointerdown', onPointerDown);
        deck.addEventListener('pointerup', onPointerUp);
        deck.addEventListener('pointercancel', () => { pointerDown = false; didSwipe = false; });

        // Handle clicks on cards. We use a single delegated handler to avoid issues with pointer capture.
        deck.addEventListener('click', (e) => {
            // If a swipe just happened, ignore the click.
            if (didSwipe) {
                didSwipe = false;
                return;
            }

            // Find which card was clicked.
            const card = e.target.closest('.home-mode');
            if (!card) return;

            const cardIndex = cards.indexOf(card);
            if (cardIndex === -1) return;

            if (cardIndex !== activeIndex) {
                setActive(cardIndex);
            } else {
                openActiveMode();
            }
        });

        applyPositions();
    };

    // No loading spinner here: we first show the mode intro screen.
    wireHomeModeDeck();
    activate(help, () => showModeIntro('help'));
    activate(patchNotes, () => showModeIntro('patchNotes'));
}

function homeTitleRollOnce() {
    const inner = document.querySelector('.home-title__inner');
    if (!inner) return;
    if (inner.classList.contains('is-rolling')) return;
    inner.classList.add('is-rolling');
}

function wireHomeTitleBarrelRoll() {
    const title = document.querySelector('.home-title');
    const inner = document.querySelector('.home-title__inner');
    if (!title || !inner) return;

    inner.addEventListener('animationend', (e) => {
        if (e.animationName === 'homeTitleTextFrontFlip') {
            inner.classList.remove('is-rolling');
        }
    });

    title.addEventListener('click', homeTitleRollOnce);
    title.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            homeTitleRollOnce();
        }
    });
}

function wireHomeCreditConfetti() {
    const pill = document.getElementById('homeCredit');
    const canvas = document.getElementById('homeConfettiCanvas');
    if (!pill || !canvas) return;

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

    // Keep one animation loop; clicks just add more particles.
    const colors = ['#4CAF50', '#FFD700', '#ffffff'];
    const particles = [];
    let animationRunning = false;
    const PARTICLE_LIFE_MS = 1200;
    const RAIN_EMIT_MS = 1000;
    let rainUntil = 0;

    const spawnRainParticles = (now, count) => {
        for (let i = 0; i < count; i++) {
            const originX = Math.random() * window.innerWidth;
            const originY = -12 - Math.random() * 40;
            const speedY = 2.0 + Math.random() * 4.2;
            const driftX = (-0.9 + Math.random() * 1.8);
            particles.push({
                x: originX,
                y: originY,
                vx: driftX,
                vy: speedY,
                size: 4 + Math.random() * 5,
                rotation: Math.random() * Math.PI,
                rotationSpeed: (-0.25 + Math.random() * 0.5),
                color: colors[Math.floor(Math.random() * colors.length)],
                bornAt: now
            });
        }
    };

    const addRain = () => {
        resize();
        const bornAt = performance.now();

        // Emit continuously for ~1 second so it feels like "rain".
        rainUntil = Math.max(rainUntil, bornAt + RAIN_EMIT_MS);
        spawnRainParticles(bornAt, 10);

        if (!animationRunning) {
            animationRunning = true;
            requestAnimationFrame(frame);
        }
    };

    const frame = (now) => {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        if (now < rainUntil) {
            spawnRainParticles(now, 4);
        }

        // Update + draw all particles, and keep only those still alive.
        let writeIndex = 0;
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const age = now - p.bornAt;
            if (age >= PARTICLE_LIFE_MS) continue;

            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;
            p.vy += 0.14; // gravity

            const alpha = Math.max(0, 1 - age / PARTICLE_LIFE_MS);

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
            ctx.restore();

            particles[writeIndex++] = p;
        }
        particles.length = writeIndex;

        if (particles.length > 0 || now < rainUntil) {
            requestAnimationFrame(frame);
        } else {
            animationRunning = false;
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
    };

    const activate = () => addRain();

    pill.addEventListener('click', activate);
    pill.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activate();
        }
    });

    window.addEventListener('resize', resize);
}

function updateHomeBottomBarScale() {
    const bar = document.getElementById('homeBottomBar');
    const pill = document.getElementById('homeCredit');
    const actions = document.getElementById('homeBottomActions');
    if (!bar || !pill || !actions) return;

    // Measure at scale 1.
    bar.style.setProperty('--home-bottom-scale', '1');

    const GAP = 10;
    const barRect = bar.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();
    const actionsRect = actions.getBoundingClientRect();

    const required = pillRect.width + GAP + actionsRect.width;
    const desired = (required > 0 && barRect.width > 0) ? (barRect.width / required) : 1;
    const scale = Math.max(0.72, Math.min(1, desired));
    bar.style.setProperty('--home-bottom-scale', String(scale));
}

function wireHomeBottomBarScale() {
    let rafId = 0;
    const schedule = () => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            rafId = 0;
            updateHomeBottomBarScale();
        });
    };

    window.addEventListener('resize', schedule);
    schedule();
}

window.addEventListener('load', () => {
    wireHomeButtons();
    wireModeIntro();
    wireHomeTitleBarrelRoll();
    wireHomeCreditConfetti();
    wireHomeBottomBarScale();

    // Always show the loading sequence before presenting the home screen.
    showInitialSpinner();
    setTimeout(() => {
        showHomeScreen();
        updateHomeBottomBarScale();
        // One automatic roll when the home screen first appears.
        // Uses the same logic as click-to-roll, so behavior stays consistent.
        requestAnimationFrame(homeTitleRollOnce);
        fadeOutInitialSpinner();
    }, INITIAL_LOAD_DELAY_MS);
});
