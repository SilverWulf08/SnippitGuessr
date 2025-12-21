const INITIAL_LOAD_DELAY_MS = 900;
let initialSpinnerDismissed = false;

clearMapHintOnReload();

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

function setModeIntroVisible(visible) {
    const intro = document.getElementById('modeIntro');
    if (!intro) return;
    intro.classList.toggle('is-visible', visible);
    intro.setAttribute('aria-hidden', visible ? 'false' : 'true');
}

function showModeIntro(mode) {
    pendingMode = mode;

    const intro = document.getElementById('modeIntro');
    const title = document.getElementById('modeIntroTitle');
    const desc = document.getElementById('modeIntroDescription');
    const diff = document.getElementById('modeIntroPointsDifficulty');
    const back = document.getElementById('modeIntroBack');
    const play = document.getElementById('modeIntroPlay');
    if (!intro || !title || !desc || !diff) return;

    intro.dataset.mode = mode;

    if (back) back.style.display = '';
    if (play) {
        play.style.display = '';
        play.textContent = 'Play';
    }

    if (mode === 'endless') {
        title.textContent = 'Endless mode';
        desc.textContent = 'Play as many rounds as you like. After each guess you\'ll see how far off you were, so you can keep improving your world knowledge.';
        diff.style.display = 'none';
    } else if (mode === 'points') {
        title.textContent = 'Points mode';
        desc.textContent =
            'Play 10 rounds and try to reach 1000 points.\n' +
            'Points are based on distance (closer = more points) and a speed bonus.\n' +
            'If time runs out, the round ends with 0 points and auto-advances.\n\n' +
            'Normal: 2:00 per round. Speed bonus: 2x (under 30s), 1.5x (under 60s).\n' +
            'Challenging: 1:00 per round. Reduced distance points. Speed bonus: 1.5x (under 30s).\n' +
            'Hard: 0:30 per round. Very tough distance points. Speed bonus: 2x (under 10s).';
        diff.style.display = 'block';
    } else {
        // Help / about screen
        title.textContent = 'What is Snippit?';
        desc.textContent =
            'Snippit is a quick geography guessing game.\n\n' +
            'You see a zoomed-in mini-map (the “snippit”) and you try to place your guess on the big world map.\n' +
            'After guessing you\'ll see the distance between your guess and the real location.\n\n' +
            'Endless mode: keep playing and improve.\n' +
            'Points mode: 10 rounds, reach 1000 points — accuracy + speed matter.';
        diff.style.display = 'none';

        // Spec: big Back button instead of Play for this screen.
        if (back) back.style.display = 'none';
        if (play) play.textContent = 'Back';
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

function startSelectedMode() {
    if (!pendingMode) return;

    if (pendingMode === 'help') {
        hideModeIntro();
        return;
    }

    showInitialSpinner();

    if (pendingMode === 'endless') {
        sessionStorage.setItem('snippit.startMode', 'endless');
        setTimeout(() => {
            window.location.href = 'game.html';
        }, 80);
        return;
    }

    // Points mode
    sessionStorage.setItem('snippit.startMode', 'points');
    sessionStorage.setItem('snippit.pointsDifficulty', getSelectedPointsDifficulty());
    setTimeout(() => {
        window.location.href = 'points.html';
    }, 80);
}

function wireModeIntro() {
    const back = document.getElementById('modeIntroBack');
    const play = document.getElementById('modeIntroPlay');

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
}

function wireHomeButtons() {
    const endless = document.getElementById('endlessMode');
    const points = document.getElementById('pointsMode');
    const help = document.getElementById('homeHelpBtn');

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

    // No loading spinner here: we first show the mode intro screen.
    activate(endless, () => showModeIntro('endless'));
    activate(points, () => showModeIntro('points'));
    activate(help, () => showModeIntro('help'));
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
        if (e.animationName === 'homeTitleBarrelRoll') {
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
    const DURATION_MS = 1100;

    const addBurst = () => {
        resize();

        const rect = pill.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top;
        const bornAt = performance.now();

        const count = 36;
        for (let i = 0; i < count; i++) {
            const angle = (-Math.PI / 2) + (-0.9 + Math.random() * 1.8);
            const speed = 3.5 + Math.random() * 4.5;
            particles.push({
                x: originX,
                y: originY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 4 + Math.random() * 5,
                rotation: Math.random() * Math.PI,
                rotationSpeed: (-0.25 + Math.random() * 0.5),
                color: colors[Math.floor(Math.random() * colors.length)],
                bornAt
            });
        }

        if (!animationRunning) {
            animationRunning = true;
            requestAnimationFrame(frame);
        }
    };

    const frame = (now) => {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // Update + draw all particles, and keep only those still alive.
        let writeIndex = 0;
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const age = now - p.bornAt;
            if (age >= DURATION_MS) continue;

            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;
            p.vy += 0.12; // gravity

            const alpha = Math.max(0, 1 - age / DURATION_MS);

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

        if (particles.length > 0) {
            requestAnimationFrame(frame);
        } else {
            animationRunning = false;
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
    };

    const activate = () => addBurst();

    pill.addEventListener('click', activate);
    pill.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activate();
        }
    });

    window.addEventListener('resize', resize);
}

window.addEventListener('load', () => {
    wireHomeButtons();
    wireModeIntro();
    wireHomeTitleBarrelRoll();
    wireHomeCreditConfetti();

    // Always show the loading sequence before presenting the home screen.
    showInitialSpinner();
    setTimeout(() => {
        showHomeScreen();
        // One automatic roll when the home screen first appears.
        // Uses the same logic as click-to-roll, so behavior stays consistent.
        requestAnimationFrame(homeTitleRollOnce);
        fadeOutInitialSpinner();
    }, INITIAL_LOAD_DELAY_MS);
});
