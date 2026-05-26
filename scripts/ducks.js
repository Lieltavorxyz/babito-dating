/* Duck SVG system — all inline SVGs, no external files */

const DUCK_SVGS = {
  idle: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- tail -->
  <ellipse cx="19" cy="62" rx="11" ry="7" fill="#E8B400" transform="rotate(-30 19 62)"/>
  <!-- body -->
  <ellipse cx="50" cy="68" rx="30" ry="21" fill="#FFD93D"/>
  <!-- wing -->
  <ellipse cx="35" cy="70" rx="15" ry="9" fill="#E8B400" transform="rotate(-12 35 70)"/>
  <!-- head -->
  <circle cx="68" cy="44" r="20" fill="#FFD93D"/>
  <!-- eye -->
  <circle cx="75" cy="39" r="5" fill="#2D1B00"/>
  <circle cx="76.5" cy="37.5" r="2" fill="white"/>
  <!-- beak top -->
  <polygon points="88,44 78,40 78,44" fill="#FF9140"/>
  <!-- beak bottom -->
  <polygon points="88,44 78,44 78,48" fill="#E07820"/>
  <!-- nostril -->
  <circle cx="84" cy="43" r="1.2" fill="#CC6010" opacity="0.6"/>
</svg>`,

  happy: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- tail -->
  <ellipse cx="18" cy="60" rx="11" ry="7" fill="#E8B400" transform="rotate(-40 18 60)"/>
  <!-- body -->
  <ellipse cx="50" cy="70" rx="30" ry="20" fill="#FFD93D"/>
  <!-- wing left (up) -->
  <ellipse cx="24" cy="56" rx="13" ry="8" fill="#E8B400" transform="rotate(-55 24 56)"/>
  <!-- wing right (up) -->
  <ellipse cx="68" cy="62" rx="13" ry="8" fill="#E8B400" transform="rotate(20 68 62)"/>
  <!-- head -->
  <circle cx="50" cy="38" r="20" fill="#FFD93D"/>
  <!-- eyes happy (curved) -->
  <path d="M 39 36 Q 42 32 45 36" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M 55 36 Q 58 32 61 36" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- beak open smile -->
  <path d="M 43 46 Q 50 54 57 46" fill="#FF9140"/>
  <path d="M 43 46 Q 50 44 57 46" fill="#FFB366"/>
  <!-- blush -->
  <circle cx="36" cy="44" r="6" fill="#FFB3C6" opacity="0.55"/>
  <circle cx="64" cy="44" r="6" fill="#FFB3C6" opacity="0.55"/>
</svg>`,

  shocked: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- tail -->
  <ellipse cx="18" cy="62" rx="10" ry="7" fill="#E8B400" transform="rotate(-25 18 62)"/>
  <!-- body -->
  <ellipse cx="50" cy="70" rx="30" ry="20" fill="#FFD93D"/>
  <!-- wing left (out) -->
  <ellipse cx="20" cy="68" rx="14" ry="7" fill="#E8B400" transform="rotate(15 20 68)"/>
  <!-- wing right (out) -->
  <ellipse cx="80" cy="68" rx="14" ry="7" fill="#E8B400" transform="rotate(-15 80 68)"/>
  <!-- head slightly tilted back -->
  <circle cx="50" cy="37" r="20" fill="#FFD93D"/>
  <!-- eyes wide -->
  <circle cx="40" cy="34" r="7" fill="white"/>
  <circle cx="60" cy="34" r="7" fill="white"/>
  <circle cx="41" cy="35" r="4" fill="#2D1B00"/>
  <circle cx="61" cy="35" r="4" fill="#2D1B00"/>
  <circle cx="42.5" cy="33.5" r="1.8" fill="white"/>
  <circle cx="62.5" cy="33.5" r="1.8" fill="white"/>
  <!-- beak open O -->
  <ellipse cx="50" cy="48" rx="6" ry="5.5" fill="#FF9140"/>
  <ellipse cx="50" cy="49" rx="4" ry="3.8" fill="#CC6010"/>
</svg>`,

  celebrate: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- sparkles -->
  <circle cx="12" cy="20" r="3.5" fill="#c084fc" opacity="0.8"/>
  <circle cx="88" cy="18" r="2.5" fill="#f472b6" opacity="0.8"/>
  <circle cx="90" cy="82" r="3"   fill="#86efac" opacity="0.7"/>
  <circle cx="10" cy="80" r="2"   fill="#fbbf24" opacity="0.8"/>
  <path d="M 20 10 L 22 16 L 28 16 L 23 20 L 25 26 L 20 22 L 15 26 L 17 20 L 12 16 L 18 16 Z"
        fill="#fbbf24" opacity="0.7" transform="scale(0.55) translate(14,8)"/>
  <path d="M 80 8 L 82 14 L 88 14 L 83 18 L 85 24 L 80 20 L 75 24 L 77 18 L 72 14 L 78 14 Z"
        fill="#f472b6" opacity="0.6" transform="scale(0.55) translate(-30,5)"/>
  <!-- tail -->
  <ellipse cx="18" cy="58" rx="11" ry="7" fill="#E8B400" transform="rotate(-40 18 58)"/>
  <!-- body raised -->
  <ellipse cx="50" cy="65" rx="28" ry="20" fill="#FFD93D"/>
  <!-- wing left high -->
  <ellipse cx="22" cy="48" rx="13" ry="7" fill="#E8B400" transform="rotate(-65 22 48)"/>
  <!-- wing right high -->
  <ellipse cx="78" cy="48" rx="13" ry="7" fill="#E8B400" transform="rotate(65 78 48)"/>
  <!-- head -->
  <circle cx="50" cy="34" r="20" fill="#FFD93D"/>
  <!-- eyes very happy -->
  <path d="M 37 32 Q 41 27 45 32" stroke="#2D1B00" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M 55 32 Q 59 27 63 32" stroke="#2D1B00" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <!-- beak wide open -->
  <path d="M 41 43 Q 50 54 59 43" fill="#FF9140"/>
  <path d="M 41 43 Q 50 41 59 43" fill="#FFB366"/>
  <!-- blush -->
  <circle cx="35" cy="42" r="7" fill="#FFB3C6" opacity="0.6"/>
  <circle cx="65" cy="42" r="7" fill="#FFB3C6" opacity="0.6"/>
</svg>`,

  swim: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- water waves -->
  <path d="M 0 72 Q 12 65 25 72 Q 38 79 50 72 Q 62 65 75 72 Q 88 79 100 72 L 100 100 L 0 100 Z"
        fill="#86efac" opacity="0.35"/>
  <path d="M 0 78 Q 12 71 25 78 Q 38 85 50 78 Q 62 71 75 78 Q 88 85 100 78"
        stroke="#86efac" stroke-width="2.5" fill="none" opacity="0.6"/>
  <!-- tiny ripple -->
  <ellipse cx="50" cy="74" rx="32" ry="5" fill="none" stroke="#86efac" stroke-width="1.5" opacity="0.4"/>
  <!-- neck -->
  <ellipse cx="55" cy="62" rx="10" ry="14" fill="#FFD93D"/>
  <!-- head -->
  <circle cx="60" cy="48" r="20" fill="#FFD93D"/>
  <!-- eye -->
  <circle cx="68" cy="43" r="5" fill="#2D1B00"/>
  <circle cx="69.5" cy="41.5" r="2" fill="white"/>
  <!-- beak -->
  <polygon points="80,48 70,44 70,52" fill="#FF9140"/>
  <!-- small wake lines -->
  <path d="M 18 76 Q 22 73 26 76" stroke="white" stroke-width="1.5" fill="none" opacity="0.5"/>
  <path d="M 70 78 Q 74 75 78 78" stroke="white" stroke-width="1.5" fill="none" opacity="0.5"/>
</svg>`
};

/* Duck size presets */
const DUCK_SIZES = {
  sm:   64,
  md:   96,
  lg:  128,
  xl:  160
};

/* Create a duck element */
function createDuck(state = 'idle', size = 'md') {
  const px = typeof size === 'number' ? size : (DUCK_SIZES[size] || 96);
  const wrap = document.createElement('div');
  wrap.className = 'duck-wrap';
  wrap.style.width  = px + 'px';
  wrap.style.height = px + 'px';
  wrap.innerHTML = DUCK_SVGS[state] || DUCK_SVGS.idle;
  const svg = wrap.querySelector('svg');
  if (svg) { svg.style.width = '100%'; svg.style.height = '100%'; }
  return wrap;
}

/* Inject duck into a container, with optional speech */
function renderDuck(container, state = 'idle', size = 'md', speech = '') {
  container.innerHTML = '';
  const duck = createDuck(state, size);

  if (speech) {
    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    bubble.textContent = speech;
    container.appendChild(bubble);
    requestAnimationFrame(() => requestAnimationFrame(() => bubble.classList.add('visible')));
  }

  container.appendChild(duck);
  return duck;
}

/* Animate a duck with a CSS animation class */
function animateDuck(duckEl, animClass, duration = 0) {
  const svg = duckEl.querySelector ? duckEl.querySelector('svg') : duckEl;
  const target = svg || duckEl;
  target.classList.remove(...Array.from(target.classList).filter(c => c.startsWith('anim-')));
  void target.offsetWidth;
  target.classList.add(animClass);
  if (duration) setTimeout(() => target.classList.remove(animClass), duration);
}

/* Spawn a floating duck (fixed positioned) */
function spawnFloatingDuck(state = 'idle', x, y, size = 'md', animClass = '') {
  const container = document.getElementById('floating-ducks');
  if (!container) return null;
  const px = typeof size === 'number' ? size : (DUCK_SIZES[size] || 96);
  const el = document.createElement('div');
  el.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${px}px;height:${px}px;pointer-events:none;`;
  el.innerHTML = DUCK_SVGS[state] || DUCK_SVGS.idle;
  const svg = el.querySelector('svg');
  if (svg) { svg.style.width = '100%'; svg.style.height = '100%'; }
  if (animClass) el.classList.add(animClass);
  container.appendChild(el);
  return el;
}

/* Clear all floating ducks */
function clearFloatingDucks() {
  const c = document.getElementById('floating-ducks');
  if (c) c.innerHTML = '';
}

/* React duck in a zone: updates state + speech, plays animation */
function duckReact(zone, state, speech, animClass) {
  if (!zone) return;
  renderDuck(zone, state, 'sm', speech);
  const duck = zone.querySelector('.duck-wrap');
  if (duck && animClass) {
    setTimeout(() => {
      duck.classList.add(animClass);
    }, 50);
  }
}
