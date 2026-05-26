/* app.js — State machine + stage router (load last) */

const STATE = {
  stage:        0,
  questionIndex: 0,
  answers:      [],
  yesAttempts:  0,
  noTeleports:  0,
};

function goToStage(n) {
  STATE.stage = n;

  /* Clean up any fixed-positioned No button residue */
  const app = document.getElementById('app');
  if (!app) return;

  /* Remove clone buttons from body */
  document.querySelectorAll('.btn-clone').forEach(c => c.remove());
  document.querySelectorAll('.clone-tooltip').forEach(c => c.remove());
  document.querySelectorAll('#yes-modal').forEach(c => c.remove());
  document.body.style.overflow = '';

  /* Clear floating ducks */
  clearFloatingDucks();

  /* Fade out current content */
  app.style.transition = 'opacity 200ms ease';
  app.style.opacity    = '0';

  setTimeout(() => {
    app.style.opacity    = '1';
    app.style.transition = '';
    app.innerHTML        = '';

    switch (n) {
      case 0: renderStage0(app); break;
      case 1: renderStage1(app); break;
      case 2: renderStage2(app); break;
      case 3: renderStage3(app); break;
    }
  }, 210);
}

/* Boot */
document.addEventListener('DOMContentLoaded', () => goToStage(0));
