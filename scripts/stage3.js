/* Stage 3 — Victory Screen */

function renderStage3(app) {
  app.className = 'stage-3';
  clearFloatingDucks();

  app.innerHTML = `
    <div class="victory-wrap">

      <div class="victory-ducks" id="victory-ducks">
        <div class="victory-duck-item" id="vd-0" style="width:88px;height:88px"></div>
        <div class="victory-duck-item" id="vd-1" style="width:120px;height:120px"></div>
        <div class="victory-duck-item" id="vd-2" style="width:88px;height:88px"></div>
      </div>

      <div class="victory-message">
        <h1 class="title-display title-xl">I knew you'd say yes,</h1>
        <h1 class="title-display title-xl" style="background:linear-gradient(135deg,#f472b6,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
          Babito.
        </h1>
      </div>

      <p class="victory-sub">
        You've made a duck very happy.<br>
        And me. Mostly me.
      </p>

      <div class="date-card" id="date-card">
        <div class="date-card-title">Our Date Details</div>

        <div class="date-card-row">
          <div class="date-card-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f472b6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div>
            <div class="date-card-label">When</div>
            <div class="date-card-value" id="dc-when">
              ${STATE.selectedDate && STATE.selectedTime
                ? `${formatDate(STATE.selectedDate)} at ${STATE.selectedTime}`
                : 'TBD — something wonderful'}
            </div>
          </div>
        </div>

        <div class="date-card-row">
          <div class="date-card-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f472b6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div>
            <div class="date-card-label">Where</div>
            <div class="date-card-value" id="dc-where">Somewhere you'll love — TBD</div>
          </div>
        </div>

        <div class="date-card-row">
          <div class="date-card-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f472b6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <div>
            <div class="date-card-label">Vibe</div>
            <div class="date-card-value" id="dc-vibe">Cozy, fun, and very us</div>
          </div>
        </div>

        <div class="date-card-row" style="margin-bottom:0">
          <div class="date-card-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f472b6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div>
            <div class="date-card-label">Dress Code</div>
            <div class="date-card-value" id="dc-dress">Whatever makes you feel amazing</div>
          </div>
        </div>
      </div>

      <div class="date-card" id="answers-card" style="animation: card-enter 500ms ease 1800ms both; border-color: rgba(192,132,252,0.3);">
        <div class="date-card-title" style="color: var(--accent-2)">Her answers</div>
        <div id="answers-list"></div>
      </div>

      <div class="share-btn-wrap">
        <button class="btn btn-primary" id="share-btn">Share the joy</button>
        <div class="share-confirm" id="share-confirm"></div>
      </div>

    </div>
  `;

  /* Pop in ducks with stagger */
  const duckStates = ['happy', 'celebrate', 'happy'];
  const sizes      = [88, 120, 88];
  [0, 1, 2].forEach(i => {
    const el = document.getElementById(`vd-${i}`);
    if (!el) return;
    renderDuck(el, duckStates[i], sizes[i]);
    /* Flip via SVG not wrap — bounce anim uses transform on wrap, would clobber scaleX */
    const svg = el.querySelector('svg');
    if (svg) {
      if (i === 0) svg.style.transform = 'scaleX(1)';   /* left duck faces right (toward center) */
      if (i === 2) svg.style.transform = 'scaleX(-1)';  /* right duck faces left (toward center) */
    }
    setTimeout(() => {
      el.classList.add('popped-in');
      const duckWrap = el.querySelector('.duck-wrap');
      if (duckWrap) duckWrap.classList.add('anim-duck-bounce');
    }, i * 180);
  });

  /* Render her quiz answers */
  renderAnswers();

  /* Big confetti burst */
  launchConfetti(110);

  /* Share button */
  document.getElementById('share-btn').addEventListener('click', () => {
    const msg = 'I said yes to a date! This is a very important announcement. A duck witnessed it.';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(msg).then(() => {
        const confirm = document.getElementById('share-confirm');
        if (confirm) {
          confirm.textContent = 'Copied! Now tell everyone.';
          setTimeout(() => { if (confirm) confirm.textContent = ''; }, 3000);
        }
      });
    }
  });

  /* Second confetti wave after 3s */
  setTimeout(() => launchConfetti(60), 3200);
}

function renderAnswers() {
  const list = document.getElementById('answers-list');
  if (!list || !STATE.answers.length) return;

  const rows = STATE.answers.map((ansIdx, qIdx) => {
    const q   = QUESTIONS[qIdx];
    const opt = q ? q.options[ansIdx] : null;
    if (!q || !opt) return '';
    return `
      <div class="date-card-row" style="align-items:flex-start">
        <div class="date-card-icon" style="margin-top:3px">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c084fc" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div>
          <div class="date-card-label" style="color:var(--accent-2)">${q.text}</div>
          <div class="date-card-value" style="font-size:0.88rem">${opt.label}</div>
        </div>
      </div>
    `;
  }).join('');

  list.innerHTML = rows;

  /* Optional: POST to Discord webhook if configured */
  if (typeof DISCORD_WEBHOOK_URL === 'string' && DISCORD_WEBHOOK_URL.startsWith('http')) {
    const lines = STATE.answers.map((ansIdx, qIdx) => {
      const q   = QUESTIONS[qIdx];
      const opt = q && q.options[ansIdx];
      return q && opt ? `**${q.text}**\n> ${opt.label}` : null;
    }).filter(Boolean).join('\n\n');

    const dateStr = STATE.selectedDate && STATE.selectedTime
      ? `${formatDate(STATE.selectedDate)} at ${STATE.selectedTime}`
      : 'not selected';

    const payload = {
      username: 'Babito Quiz',
      content: `Babito said YES!\n\n${lines}\n\n**She picked a date:** ${dateStr}`,
    };

    fetch(DISCORD_WEBHOOK_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    }).catch(() => { /* silently ignore — not critical */ });
  }
}
