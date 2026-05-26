/* Stage 0 — Intro Screen */

function renderStage0(app) {
  app.className = 'stage-0';

  app.innerHTML = `
    <div class="swim-lane">
      <div class="swim-duck-anim" id="swim-duck"></div>
    </div>

    <div class="stage-0-inner">
      <h1 class="title-display title-xl">A Very Important Quiz</h1>
      <div class="intro-subtitle">for Babito</div>

      <p class="intro-desc" style="animation: slide-up 500ms ease 300ms both">
        This may change your life.<br>Or at least your evening.
      </p>

      <div class="intro-duck-row" style="animation: slide-up 500ms ease 450ms both">
        <div id="intro-duck-left"></div>
        <div id="intro-duck-right"></div>
      </div>

      <button
        id="begin-btn"
        class="btn btn-primary anim-btn-pulse"
        style="margin-top:8px; animation: slide-up 500ms ease 600ms both, btn-pulse 2s ease-in-out 1200ms infinite;"
      >
        Let's do this
      </button>

      <p class="text-muted" style="animation: fade-in 600ms ease 900ms both; font-size:0.8rem;">
        3 questions stand between you and destiny
      </p>
    </div>
  `;

  /* Swim duck */
  const swimEl = document.getElementById('swim-duck');
  if (swimEl) {
    swimEl.style.cssText = 'width:80px;height:80px;';
    swimEl.innerHTML = DUCK_SVGS.swim;
    const svg = swimEl.querySelector('svg');
    if (svg) { svg.style.width='100%'; svg.style.height='100%'; }
  }

  /* Idle ducks on sides */
  const leftEl  = document.getElementById('intro-duck-left');
  const rightEl = document.getElementById('intro-duck-right');
  if (leftEl)  renderDuck(leftEl,  'idle', 64);
  if (rightEl) {
    renderDuck(rightEl, 'happy', 64);
    const svg = rightEl.querySelector('svg');
    if (svg) svg.style.transform = 'scaleX(-1)'; /* flip SVG not wrap — avoids conflict with anim transforms */
  }

  /* Waddle the left duck gently */
  setTimeout(() => {
    const ld = leftEl && leftEl.querySelector('.duck-wrap');
    if (ld) ld.classList.add('anim-duck-waddle');
  }, 800);

  /* Begin button */
  document.getElementById('begin-btn').addEventListener('click', () => {
    goToStage(1);
  });
}
