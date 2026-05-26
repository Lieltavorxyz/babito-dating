/* Stage 1 — Warm-up Quiz (3 questions) */

const QUESTIONS = [
  {
    text: 'How much do you love me today?',
    options: [
      { label: 'A normal amount',              duck: 'shocked',   anim: 'anim-duck-shake',  speech: '...normal?!' },
      { label: 'A lot, actually',              duck: 'happy',     anim: 'anim-duck-bounce', speech: 'I\'ll take it.' },
      { label: 'More than I love ducks',       duck: 'celebrate', anim: 'anim-duck-bounce', speech: 'Wow. Wow.' },
      { label: 'Truly an unreasonable amount', duck: 'celebrate', anim: 'anim-duck-spin',   speech: '*faints*' },
    ],
  },
  {
    text: 'A duck and I both want the last piece of bread. Who gets it?',
    options: [
      { label: 'The duck, obviously',      duck: 'celebrate', anim: 'anim-duck-bounce', speech: 'Correct answer.' },
      { label: 'You, because you\'re cute',duck: 'happy',     anim: 'anim-duck-waddle', speech: 'Acceptable.' },
      { label: 'Split it fairly',          duck: 'idle',      anim: 'anim-duck-waddle', speech: 'Fine, I guess.' },
      { label: 'Fight for it',             duck: 'shocked',   anim: 'anim-duck-shake',  speech: 'CHALLENGE ACCEPTED.' },
    ],
  },
  {
    text: 'On a scale of 1–4, how ready are you for what\'s about to happen?',
    options: [
      { label: '1 — Not ready at all',   duck: 'shocked',   anim: 'anim-duck-shake',  speech: 'Same, honestly.' },
      { label: '2 — Somewhat ready',     duck: 'idle',      anim: 'anim-duck-waddle', speech: 'Okay then.' },
      { label: '3 — Pretty ready',       duck: 'happy',     anim: 'anim-duck-bounce', speech: 'Let\'s go!' },
      { label: '4 — I was born ready',   duck: 'celebrate', anim: 'anim-duck-spin',   speech: 'Respect.' },
    ],
  },
];

function renderStage1(app) {
  app.className = 'stage-1';
  renderQuestion(app, 0);
}

function renderQuestion(app, idx) {
  const q   = QUESTIONS[idx];
  const pct = Math.round(((idx) / QUESTIONS.length) * 100);

  app.innerHTML = `
    ${idx > 0 ? `
      <button class="back-btn" id="back-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back
      </button>` : ''}

    <div class="quiz-wrap anim-card-enter">
      <div class="card">
        <div class="question-meta">
          <span class="q-label">Question ${idx + 1} of ${QUESTIONS.length}</span>
          <div class="progress-bar" style="flex:1;margin:0 0 0 16px">
            <div class="progress-fill" id="prog-fill" style="width:${pct}%"></div>
          </div>
        </div>

        <h2 class="title-display title-sm question-text">${q.text}</h2>

        <div class="options-grid" id="options-grid">
          ${q.options.map((o, i) => `
            <button class="option-btn" data-idx="${i}">${o.label}</button>
          `).join('')}
        </div>

        <div class="quiz-duck-zone" id="duck-zone"></div>
      </div>
    </div>
  `;

  /* Back button */
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      STATE.answers.pop(); /* remove last answer */
      renderQuestion(app, idx - 1);
    });
  }

  /* Animate progress fill */
  setTimeout(() => {
    const fill = document.getElementById('prog-fill');
    if (fill) fill.style.width = Math.round(((idx + 1) / QUESTIONS.length) * 100) + '%';
  }, 100);

  /* Render idle duck */
  const zone = document.getElementById('duck-zone');
  renderDuck(zone, 'idle', 'sm', '');

  /* Option click handlers */
  let answered = false;
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      STATE.answers.push(parseInt(btn.dataset.idx));

      /* Highlight selected */
      document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
      btn.classList.add('selected');

      /* Duck reaction */
      const opt = q.options[parseInt(btn.dataset.idx)];
      duckReact(zone, opt.duck, opt.speech, opt.anim);

      /* Advance after delay */
      setTimeout(() => {
        if (idx + 1 < QUESTIONS.length) {
          /* Slide out, then render next question */
          const wrap = document.querySelector('.quiz-wrap');
          if (wrap) {
            wrap.style.transition = 'opacity 200ms ease, transform 200ms ease';
            wrap.style.opacity = '0';
            wrap.style.transform = 'translateY(-16px)';
          }
          setTimeout(() => renderQuestion(app, idx + 1), 220);
        } else {
          /* All done — transition to stage 2 */
          showTransition(app);
        }
      }, 1100);
    });
  });
}

function showTransition(app) {
  app.innerHTML = `
    <div class="stage-0-inner anim-card-enter" style="text-align:center">
      <div id="trans-duck"></div>
      <h2 class="title-display title-lg" style="margin:16px 0 8px">
        Quiz complete!
      </h2>
      <p class="text-body" style="color:var(--text-muted);max-width:340px">
        You have been officially certified: <strong>Babito</strong>.<br>
        Now for the real question...
      </p>
    </div>
  `;

  const td = document.getElementById('trans-duck');
  renderDuck(td, 'celebrate', 'md');
  const dw = td && td.querySelector('.duck-wrap');
  if (dw) dw.classList.add('anim-duck-bounce');

  setTimeout(() => goToStage(2), 2200);
}
