/* Date Picker — shown after Yes is confirmed, before victory screen */

/* Configurable time slots — edit these to match what works for you */
const AVAILABLE_HOURS = [
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '5:00 PM',  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM',
];

/* How many days ahead she can book */
const MAX_DAYS_AHEAD = 90;

let dpSelectedDate = null;
let dpSelectedTime = null;
let dpViewYear     = 0;
let dpViewMonth    = 0;

function showDatePicker() {
  const today   = new Date();
  dpViewYear    = today.getFullYear();
  dpViewMonth   = today.getMonth();
  dpSelectedDate = null;
  dpSelectedTime = null;

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
        Choose a day and a time that works for you
      </p>

      <div class="calendar" id="dp-calendar"></div>

      <div class="time-slots" id="dp-time-slots">
        <div class="time-slots-label">What time works?</div>
        <div class="time-grid" id="dp-time-grid"></div>
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

  renderTimePills(); /* render time pills once, toggle visibility */
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
  minDate.setDate(minDate.getDate() + 1); /* tomorrow minimum */

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + MAX_DAYS_AHEAD);

  const firstDay = new Date(dpViewYear, dpViewMonth, 1);
  const lastDay  = new Date(dpViewYear, dpViewMonth + 1, 0);
  const startDow = firstDay.getDay();

  const atMin = dpViewYear === minDate.getFullYear() && dpViewMonth === minDate.getMonth();

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

  /* Empty filler cells */
  for (let i = 0; i < startDow; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day cal-empty';
    grid.appendChild(empty);
  }

  /* Day cells */
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date       = new Date(dpViewYear, dpViewMonth, d);
    const isPast     = date < minDate;
    const isTooFar   = date > maxDate;
    const isToday    = date.getTime() === today.getTime();
    const isDisabled = isPast || isTooFar;
    const isSelected = dpSelectedDate && date.getTime() === dpSelectedDate.getTime();

    const btn = document.createElement('button');
    btn.className = [
      'cal-day',
      isDisabled ? 'cal-disabled' : '',
      isToday    ? 'cal-today'    : '',
      isSelected ? 'cal-selected' : '',
    ].filter(Boolean).join(' ');

    btn.textContent = d;
    btn.disabled    = isDisabled;

    if (!isDisabled) {
      btn.addEventListener('click', () => onDaySelect(date));
    }
    grid.appendChild(btn);
  }

  document.getElementById('cal-prev').addEventListener('click', () => {
    if (dpViewMonth === 0) { dpViewMonth = 11; dpViewYear--; }
    else dpViewMonth--;
    renderCalendar();
  });

  document.getElementById('cal-next').addEventListener('click', () => {
    if (dpViewMonth === 11) { dpViewMonth = 0; dpViewYear++; }
    else dpViewMonth++;
    renderCalendar();
  });
}

/* ── Time Slots ─────────────────────────────────── */
function renderTimePills() {
  const grid = document.getElementById('dp-time-grid');
  if (!grid) return;

  grid.innerHTML = '';
  AVAILABLE_HOURS.forEach(hour => {
    const pill = document.createElement('button');
    pill.className   = 'time-pill';
    pill.textContent = hour;
    pill.addEventListener('click', () => onTimeSelect(hour));
    grid.appendChild(pill);
  });

  /* Hide until a date is selected */
  const zone = document.getElementById('dp-time-slots');
  if (zone) zone.style.opacity = '0.35';
}

function onDaySelect(date) {
  dpSelectedDate = date;
  dpSelectedTime = null;

  renderCalendar();

  /* Reveal time slots */
  const zone = document.getElementById('dp-time-slots');
  if (zone) {
    zone.style.transition = 'opacity 250ms ease';
    zone.style.opacity    = '1';
  }

  /* Clear any previously selected time pill */
  document.querySelectorAll('.time-pill').forEach(p => p.classList.remove('selected'));

  updateConfirmBtn();
  zone && zone.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function onTimeSelect(time) {
  dpSelectedTime = time;
  document.querySelectorAll('.time-pill').forEach(p => {
    p.classList.toggle('selected', p.textContent === time);
  });
  updateConfirmBtn();
}

function updateConfirmBtn() {
  const btn = document.getElementById('dp-confirm');
  if (!btn) return;
  const ready = !!(dpSelectedDate && dpSelectedTime);
  btn.disabled = !ready;
  if (ready) {
    btn.textContent = `Lock it in: ${formatDate(dpSelectedDate)} at ${dpSelectedTime}`;
  } else {
    btn.textContent = 'Set our date!';
  }
}

/* ── Confirm ────────────────────────────────────── */
function onDateConfirm() {
  if (!dpSelectedDate || !dpSelectedTime) return;

  STATE.selectedDate = dpSelectedDate;
  STATE.selectedTime = dpSelectedTime;

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

function formatDateShort(date) {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
