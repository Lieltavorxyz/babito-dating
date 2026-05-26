/* Stage 2 — The Proposal (button evasion mechanics) */

let yesBtnEl  = null;
let noBtnEl   = null;
let cloneEls  = [];
let proposalDuckZone = null;

function renderStage2(app) {
  app.className = 'stage-2';
  STATE.yesAttempts  = 0;
  STATE.noTeleports  = 0;
  cloneEls = [];

  app.innerHTML = `
    <div class="proposal-wrap">
      <div id="prop-duck-top" style="animation: slide-down 400ms ease both"></div>

      <div class="proposal-question" style="animation: card-enter 400ms ease 100ms both">
        <h2 class="title-display title-lg">Will you go on a date with me,</h2>
        <h2 class="title-display title-lg" style="background:linear-gradient(135deg,#f472b6,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
          Boobito?
        </h2>
        <p class="proposal-subtitle" style="animation:fade-in 400ms ease 400ms both">
          Think carefully. Or don't. The button has opinions.
        </p>
      </div>

      <div class="btn-row" style="animation: slide-up 400ms ease 300ms both">
        <button id="yes-btn" class="btn btn-yes">Yes</button>
        <button id="no-btn"  class="btn btn-no">No</button>
      </div>

      <div id="attempt-hint" class="text-muted" style="font-size:0.8rem;min-height:1.2em;animation:fade-in 400ms ease 600ms both"></div>
    </div>

    <div class="proposal-duck-zone" id="proposal-duck-zone"></div>
  `;

  yesBtnEl  = document.getElementById('yes-btn');
  noBtnEl   = document.getElementById('no-btn');
  proposalDuckZone = document.getElementById('proposal-duck-zone');

  /* Render watcher duck */
  renderDuck(proposalDuckZone, 'idle', 'sm');

  /* Top decorative duck */
  renderDuck(document.getElementById('prop-duck-top'), 'idle', 'sm');

  /* ── No Button — teleport on hover/touch ── */
  noBtnEl.addEventListener('mouseover', onNoHover);
  noBtnEl.addEventListener('touchstart', onNoTouch, { passive: false });

  /* ── Yes Button — evasion on hover/touch ── */
  yesBtnEl.addEventListener('mouseenter', onYesHover);
  yesBtnEl.addEventListener('touchstart',  onYesTouch, { passive: false });
}

/* ── No button handlers ─────────────────────── */
function onNoHover() { teleportNo(); }

function onNoTouch(e) {
  e.preventDefault();
  teleportNo();
}

function teleportNo() {
  if (!noBtnEl) return;
  STATE.noTeleports++;

  const pad  = 70;
  const padB = 100; /* bottom safe zone (gesture area) */
  const btnW = noBtnEl.offsetWidth  || 80;
  const btnH = noBtnEl.offsetHeight || 44;
  const vw   = window.innerWidth;
  const vh   = window.innerHeight;

  let x, y, tries = 0;
  const yesBounds = yesBtnEl ? yesBtnEl.getBoundingClientRect() : { left: vw/2, top: vh/2 };
  const prevLeft  = parseFloat(noBtnEl.style.left) || -999;
  const prevTop   = parseFloat(noBtnEl.style.top)  || -999;

  do {
    x = pad + Math.random() * (vw - pad * 2 - btnW);
    y = pad + Math.random() * (vh - pad - padB - btnH);
    tries++;
  } while (
    tries < 40 && (
      Math.hypot(x - yesBounds.left, y - yesBounds.top) < 130 ||
      Math.hypot(x - prevLeft, y - prevTop) < 90
    )
  );

  /* Instant teleport — no animation, that's the joke */
  noBtnEl.style.position   = 'fixed';
  noBtnEl.style.transition = 'none';
  noBtnEl.style.left       = x + 'px';
  noBtnEl.style.top        = y + 'px';
  noBtnEl.style.zIndex     = '55';

  /* Duck reacts after 3 teleports */
  if (STATE.noTeleports === 3) {
    duckReact(proposalDuckZone, 'shocked', 'I can\'t watch.', 'anim-duck-shake');
  } else if (STATE.noTeleports === 6) {
    duckReact(proposalDuckZone, 'celebrate', 'Give up already!', 'anim-duck-bounce');
  }

  /* Spawn a tiny floating disapproval duck near the No button */
  if (STATE.noTeleports <= 3) {
    const floatDuck = spawnFloatingDuck('shocked', x - 10, y - 70, 'sm', 'anim-duck-disapprove');
    if (floatDuck) setTimeout(() => {
      floatDuck.style.transition = 'opacity 300ms ease';
      floatDuck.style.opacity = '0';
      setTimeout(() => floatDuck.remove(), 350);
    }, 900);
  }
}

/* ── Yes button handlers ─────────────────────── */
let yesEvading = false;

function onYesHover() {
  if (yesEvading) return;
  yesEvading = true;
  STATE.yesAttempts++;
  doYesEvasion();
}

function onYesTouch(e) {
  if (STATE.yesAttempts >= 2 && cloneEls.length === 0) {
    /* Attempt 3+ on touch: let the modal show */
    return;
  }
  e.preventDefault();
  if (yesEvading) return;
  yesEvading = true;
  STATE.yesAttempts++;
  doYesEvasion();
}

function doYesEvasion() {
  if (STATE.yesAttempts === 1) {
    yesSlideAway();
  } else if (STATE.yesAttempts === 2) {
    yesCloneSplit();
  } else {
    showYesModal();
    yesEvading = false;
  }
}

/* Attempt 1 — Slide away */
function yesSlideAway() {
  if (!yesBtnEl) { yesEvading = false; return; }

  const dirs = [
    { dx: -220, dy: 0   },
    { dx:  220, dy: 0   },
    { dx: 0,   dy: -180 },
    { dx: 0,   dy:  180 },
  ];
  const d   = dirs[Math.floor(Math.random() * dirs.length)];
  const vw  = window.innerWidth;
  const vh  = window.innerHeight;
  const rect = yesBtnEl.getBoundingClientRect();

  /* Clamp so it stays on screen */
  const clampedDx = Math.max(-rect.left + 10, Math.min(vw - rect.right - 10, d.dx));
  const clampedDy = Math.max(-rect.top + 10,  Math.min(vh - rect.bottom - 10, d.dy));

  setHint('Hmm... almost...');
  duckReact(proposalDuckZone, 'happy', 'Hehe.', 'anim-duck-bounce');

  yesBtnEl.style.transition = 'transform 280ms ease-out';
  yesBtnEl.style.transform  = `translate(${clampedDx}px, ${clampedDy}px)`;

  setTimeout(() => {
    if (!yesBtnEl) return;
    yesBtnEl.style.transition = 'transform 450ms cubic-bezier(0.34,1.3,0.64,1)';
    yesBtnEl.style.transform  = 'translate(0,0)';
    setTimeout(() => {
      yesEvading = false;
      setHint('');
    }, 500);
  }, 900);
}

/* Attempt 2 — Clone split (4 buttons, 1 real) */
function yesCloneSplit() {
  if (!yesBtnEl) { yesEvading = false; return; }

  setHint('Pick the right one...');
  duckReact(proposalDuckZone, 'shocked', 'Oh no.', 'anim-duck-shake');

  /* Hide original */
  yesBtnEl.style.visibility = 'hidden';

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const bw = 130;
  const bh = 50;

  /* 4 positions: quadrant spread */
  const positions = [
    { left: vw * 0.18,  top: vh * 0.30 },
    { left: vw * 0.58,  top: vh * 0.30 },
    { left: vw * 0.18,  top: vh * 0.62 },
    { left: vw * 0.58,  top: vh * 0.62 },
  ].map(p => ({
    left: Math.max(10, Math.min(vw - bw - 10, p.left)),
    top:  Math.max(10, Math.min(vh - bh - 80, p.top)),
  }));

  const realIdx = Math.floor(Math.random() * 4);
  cloneEls = [];

  positions.forEach((pos, i) => {
    const clone = document.createElement('button');
    clone.className   = 'btn-clone';
    clone.textContent = 'Yes';
    clone.dataset.real = (i === realIdx) ? 'true' : 'false';
    clone.style.left   = pos.left + 'px';
    clone.style.top    = pos.top  + 'px';
    clone.style.animation = `card-enter 300ms ease ${i * 80}ms both`;

    clone.addEventListener('click',      () => onCloneClick(clone, pos));
    clone.addEventListener('touchstart', (e) => { e.preventDefault(); onCloneClick(clone, pos); }, { passive: false });

    document.body.appendChild(clone);
    cloneEls.push(clone);
  });
}

function onCloneClick(clone, pos) {
  if (clone.dataset.real === 'true') {
    clearClones();
    yesConfirmed();
  } else {
    /* Fake click — shame the user, fade clone */
    clone.classList.add('anim-clone-fade');
    showCloneTooltip('Not that one!', pos.left, pos.top);
    duckReact(proposalDuckZone, 'shocked', 'Oops!', 'anim-duck-shake');
    setTimeout(() => clone.remove(), 420);
    cloneEls = cloneEls.filter(c => c !== clone);

    /* If all fakes clicked without finding real → reshuffle */
    if (cloneEls.length === 1 && cloneEls[0].dataset.real === 'true') {
      /* Real is the last one — make it obvious */
      cloneEls[0].style.boxShadow = '0 0 0 4px #fbbf24, 0 4px 20px rgba(251,191,36,0.4)';
    }
    if (cloneEls.length === 0) {
      /* All gone somehow — show modal */
      showYesModal();
    }
  }
}

function showCloneTooltip(text, x, y) {
  const tip = document.createElement('div');
  tip.className   = 'clone-tooltip';
  tip.textContent = text;
  tip.style.left  = x + 'px';
  tip.style.top   = (y - 36) + 'px';
  document.body.appendChild(tip);
  setTimeout(() => tip.remove(), 1200);
}

function clearClones() {
  cloneEls.forEach(c => c.remove());
  cloneEls = [];
  if (yesBtnEl) yesBtnEl.style.visibility = 'visible';
}

/* Attempt 3+ — Modal */
function showYesModal() {
  clearClones();
  if (yesBtnEl) yesBtnEl.style.visibility = 'visible';

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.id        = 'yes-modal';

  backdrop.innerHTML = `
    <div class="modal-card">
      <div class="duck-wrap" id="modal-duck" style="width:88px;height:88px;margin:0 auto 20px"></div>
      <h3 class="title-display title-sm" style="margin-bottom:10px">Are you sure?</h3>
      <p class="text-body" style="color:var(--text-muted);margin-bottom:24px;font-size:0.95rem">
        Romance at this level is legally binding in at least 3 countries.
        A duck witnessed this. There is no going back.
      </p>
      <div class="modal-btns">
        <button id="modal-sure"  class="btn btn-yes">I'm absolutely sure</button>
        <button id="modal-think" class="btn btn-ghost">Let me think...</button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.style.overflow = 'hidden';

  const md = document.getElementById('modal-duck');
  renderDuck(md, 'celebrate', 88);
  const dw = md && md.querySelector('.duck-wrap');
  if (dw) dw.classList.add('anim-duck-bounce');

  document.getElementById('modal-sure').addEventListener('click', () => {
    backdrop.remove();
    document.body.style.overflow = '';
    yesConfirmed();
  });

  document.getElementById('modal-think').addEventListener('click', () => {
    backdrop.remove();
    document.body.style.overflow = '';
    STATE.yesAttempts = 2; /* reset to clone stage */
    yesEvading = false;
    setHint('Take your time...');
    duckReact(proposalDuckZone, 'idle', 'Waiting...', '');
  });
}

function yesConfirmed() {
  clearClones();
  if (yesBtnEl) {
    yesBtnEl.classList.add('btn-win');
    yesBtnEl.textContent = 'Yes!!!';
  }
  duckReact(proposalDuckZone, 'celebrate', 'YESSS!', 'anim-duck-bounce');
  const rect = yesBtnEl ? yesBtnEl.getBoundingClientRect() : { left: window.innerWidth/2, top: window.innerHeight/2 };
  miniBurst(rect.left + rect.width/2, rect.top + rect.height/2, 28);

  setTimeout(() => goToStage(3), 900);
}

function setHint(text) {
  const hint = document.getElementById('attempt-hint');
  if (hint) hint.textContent = text;
}
