/* Date Picker — shown after Yes is confirmed, before victory screen */

/* Configurable time slots */
const AVAILABLE_HOURS = [
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '5:00 PM',  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM',
];

/* Activity suggestions */
const ACTIVITIES = [
  {
    id:    'picnic',
    label: 'Picnic',
    sub:   'Blanket, snacks, good vibes',
    icon:  `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/>
              <line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>`,
    evil: false,
  },
  {
    id:    'tlv',
    label: 'Date in Tel Aviv',
    sub:   'City energy, good food, us',
    icon:  `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="22" x2="21" y2="22"/>
              <rect x="2" y="9" width="4" height="13"/><rect x="10" y="5" width="4" height="17"/>
              <rect x="18" y="13" width="4" height="9"/>
              <line x1="6" y1="14" x2="10" y2="14"/>
            </svg>`,
    evil: false,
  },
  {
    id:    'jerusalem',
    label: 'Date in Jerusalem',
    sub:   'History, magic, and you',
    icon:  `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2 L16 8 L22 8 L17 13 L19 20 L12 16 L5 20 L7 13 L2 8 L8 8 Z"/>
            </svg>`,
    evil: false,
  },
  {
    id:    'haifa',
    label: 'Date in Haifa',
    sub:   'Sea, mountain, Bahai gardens',
    icon:  `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 17 L7 11 L11 14 L15 7 L21 17 Z"/>
              <path d="M2 20 Q6 17 10 20 Q14 23 18 20 Q21 18 22 20"/>
            </svg>`,
    evil: false,
  },
  {
    id:    'bed',
    label: 'Date in my bed',
    sub:   'No further questions.',
    icon:  `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9V19H21V9"/><path d="M3 9H21"/>
              <path d="M3 13H21"/><path d="M7 9V7A5 5 0 0 1 17 7V9"/>
              <circle cx="9" cy="6" r="1" fill="currentColor"/>
              <circle cx="15" cy="6" r="1" fill="currentColor"/>
              <path d="M10 8 Q12 10 14 8" stroke-linecap="round"/>
            </svg>`,
    evil: true,
  },
];

const MAX_DAYS_AHEAD = 90;

let dpSelectedDate     = null;
let dpSelectedTime     = null;
let dpSelectedActivity = null;
let dpViewYear         = 0;
let dpViewMonth        = 0;

function showDatePicker() {
  const today        = new Date();
  dpViewYear         = today.getFullYear();
  dpViewMonth        = today.getMonth();
  dpSelectedDate     = null;
  dpSelectedTime     = null;
  dpSelectedActivity = null;

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.id        = 'date-picker-modal';

  backdrop.innerHTML = `
    <div class="modal-card datepicker-card">
      <div id="dp-duck" style="width:72px;height:72px;margin:0 auto 12px"></div>

      <h3 class="title-display title-sm" style="text-align:center;margin-bottom:4px">
        Pick our date, Babito
      </h3>
      <p class="text-muted" style="text-align:center;margin-bottom:20px;font-size:0.85rem">
        Choose a day, a time, and what we're doing
      </p>

      <div class="calendar" id="dp-calendar"></div>

      <div class="time-slots dp-section" id="dp-time-slots">
        <div class="time-slots-label">What time works?</div>
        <div class="time-grid" id="dp-time-grid"></div>
      </div>

      <div class="activity-section dp-section" id="dp-activity-section">
        <div class="time-slots-label">What are we doing?</div>
        <div class="activity-grid" id="dp-activity-grid"></div>
      </div>

      <button class="btn btn-yes" id="dp-confirm" disabled style="width:100%;margin-top:20px">
        Set our date!
      </button>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.style.overflow = 'hidden';

  renderDuck(document.getElementById('dp-duck'), 'idle', 72);
  const dw = document.querySelector('#dp-duck .duck-wrap');
  if (dw) dw.classList.add('anim-duck-float');

  renderTimePills();
  renderActivityCards();
  renderCalendar();

  document.getElementById('dp-confirm').addEventListener('click', onDateConfirm);
}

/* ── Calendar ───────────────────────────────────── */
function renderCalendar() {
  const cal = document.getElementById('dp-calendar');
  if (!cal) return;

  const MONTH_NAMES = ['January','February','March','April','May','June',
                       'July','August','September','October','November','December'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + 1);

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + MAX_DAYS_AHEAD);

  const firstDay = new Date(dpViewYear, dpViewMonth, 1);
  const lastDay  = new Date(dpViewYear, dpViewMonth + 1, 0);
  const startDow = firstDay.getDay();
  const atMin    = dpViewYear === minDate.getFullYear() && dpViewMonth === minDate.getMonth();

  cal.innerHTML = `
    <div class="cal-header">
      <button class="cal-nav" id="cal-prev" ${atMin ? 'disabled' : ''}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <span class="cal-month-label">${MONTH_NAMES[dpViewMonth]} ${dpViewYear}</span>
      <button class="cal-nav" id="cal-next">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>
    <div class="cal-weekdays">
      <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span>
      <span>Thu</span><span>Fri</span><span>Sat</span>
    </div>
    <div class="cal-days" id="cal-days-grid"></div>
  `;

  const grid = document.getElementById('cal-days-grid');

  for (let i = 0; i < startDow; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day cal-empty';
    grid.appendChild(empty);
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date       = new Date(dpViewYear, dpViewMonth, d);
    const isPast     = date < minDate;
    const isTooFar   = date > maxDate;
    const isToday    = date.getTime() === today.getTime();
    const isSelected = dpSelectedDate && date.getTime() === dpSelectedDate.getTime();
    const isDisabled = isPast || isTooFar;

    const btn = document.createElement('button');
    btn.className = ['cal-day',
      isDisabled ? 'cal-disabled' : '',
      isToday    ? 'cal-today'    : '',
      isSelected ? 'cal-selected' : '',
    ].filter(Boolean).join(' ');
    btn.textContent = d;
    btn.disabled    = isDisabled;
    if (!isDisabled) btn.addEventListener('click', () => onDaySelect(date));
    grid.appendChild(btn);
  }

  document.getElementById('cal-prev').addEventListener('click', () => {
    if (dpViewMonth === 0) { dpViewMonth = 11; dpViewYear--; } else dpViewMonth--;
    renderCalendar();
  });
  document.getElementById('cal-next').addEventListener('click', () => {
    if (dpViewMonth === 11) { dpViewMonth = 0; dpViewYear++; } else dpViewMonth++;
    renderCalendar();
  });
}

/* ── Time Slots ─────────────────────────────────── */
function renderTimePills() {
  const grid = document.getElementById('dp-time-grid');
  if (!grid) return;
  AVAILABLE_HOURS.forEach(hour => {
    const pill = document.createElement('button');
    pill.className   = 'time-pill';
    pill.textContent = hour;
    pill.addEventListener('click', () => onTimeSelect(hour));
    grid.appendChild(pill);
  });
  const zone = document.getElementById('dp-time-slots');
  if (zone) zone.style.opacity = '0.3';
}

function onDaySelect(date) {
  dpSelectedDate = date;
  dpSelectedTime = null;
  renderCalendar();
  document.querySelectorAll('.time-pill').forEach(p => p.classList.remove('selected'));
  const zone = document.getElementById('dp-time-slots');
  if (zone) { zone.style.transition = 'opacity 250ms ease'; zone.style.opacity = '1'; }
  updateConfirmBtn();
  zone && zone.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function onTimeSelect(time) {
  dpSelectedTime = time;
  document.querySelectorAll('.time-pill').forEach(p => {
    p.classList.toggle('selected', p.textContent === time);
  });
  /* Reveal activity section */
  const actSection = document.getElementById('dp-activity-section');
  if (actSection) {
    actSection.style.transition = 'opacity 250ms ease';
    actSection.style.opacity    = '1';
    setTimeout(() => actSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
  }
  updateConfirmBtn();
}

/* ── Activity Cards ─────────────────────────────── */
function renderActivityCards() {
  const grid = document.getElementById('dp-activity-grid');
  if (!grid) return;

  ACTIVITIES.forEach(act => {
    const card = document.createElement('button');
    card.className        = 'activity-card' + (act.evil ? ' activity-evil' : '');
    card.dataset.id       = act.id;
    card.innerHTML = `
      <span class="activity-icon">${act.icon}</span>
      <span class="activity-label">${act.label}</span>
      <span class="activity-sub">${act.sub}</span>
    `;
    card.addEventListener('click', () => onActivitySelect(act.id));
    grid.appendChild(card);
  });

  const section = document.getElementById('dp-activity-section');
  if (section) section.style.opacity = '0.3';
}

function onActivitySelect(id) {
  dpSelectedActivity = id;
  document.querySelectorAll('.activity-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.id === id);
  });
  /* Duck reacts to the bed option */
  const dpDuck = document.getElementById('dp-duck');
  if (id === 'bed' && dpDuck) {
    renderDuck(dpDuck, 'celebrate', 72);
    const dw = dpDuck.querySelector('.duck-wrap');
    if (dw) dw.classList.add('anim-duck-spin');
  } else if (dpDuck) {
    renderDuck(dpDuck, 'happy', 72);
    const dw = dpDuck.querySelector('.duck-wrap');
    if (dw) dw.classList.add('anim-duck-bounce');
  }
  updateConfirmBtn();
}

/* ── Confirm ────────────────────────────────────── */
function updateConfirmBtn() {
  const btn   = document.getElementById('dp-confirm');
  if (!btn) return;
  const ready = !!(dpSelectedDate && dpSelectedTime && dpSelectedActivity);
  btn.disabled = !ready;
  if (ready) {
    const act = ACTIVITIES.find(a => a.id === dpSelectedActivity);
    btn.textContent = `Lock it in: ${formatDate(dpSelectedDate)} at ${dpSelectedTime}`;
    if (act && act.evil) btn.textContent += ' (evil smile included)';
  } else {
    btn.textContent = 'Set our date!';
  }
}

function onDateConfirm() {
  if (!dpSelectedDate || !dpSelectedTime || !dpSelectedActivity) return;

  STATE.selectedDate     = dpSelectedDate;
  STATE.selectedTime     = dpSelectedTime;
  STATE.selectedActivity = ACTIVITIES.find(a => a.id === dpSelectedActivity) || null;

  const backdrop = document.getElementById('date-picker-modal');
  if (backdrop) {
    backdrop.style.transition = 'opacity 200ms ease';
    backdrop.style.opacity    = '0';
    setTimeout(() => backdrop.remove(), 210);
  }
  document.body.style.overflow = '';
  setTimeout(() => goToStage(3), 220);
}

/* ── Helpers ────────────────────────────────────── */
function formatDate(date) {
  const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  return `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}`;
}
