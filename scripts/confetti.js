/* Confetti particle system */

const CONFETTI_COLORS = ['#f472b6','#c084fc','#86efac','#ffffff','#fbbf24','#fb923c','#a5f3fc'];

function launchConfetti(count = 90) {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  canvas.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const size  = 7 + Math.random() * 9;
    const shape = Math.random() < 0.15 ? 'circle' : (Math.random() < 0.5 ? 'rect' : 'ribbon');
    const startX = Math.random() * 100; // vw %
    const delay  = Math.random() * 0.8;
    const dur    = 2.4 + Math.random() * 1.8;
    const drift  = (Math.random() - 0.5) * 160;
    const rot    = Math.random() * 720;

    let borderRadius = '2px';
    let width  = size + 'px';
    let height = size + 'px';
    if (shape === 'circle')  { borderRadius = '50%'; }
    if (shape === 'ribbon')  { width = (size * 0.4) + 'px'; height = (size * 2.2) + 'px'; }

    el.style.cssText = `
      position: absolute;
      left: ${startX}%;
      top: -20px;
      width: ${width};
      height: ${height};
      background: ${color};
      border-radius: ${borderRadius};
      opacity: 1;
      animation: confetti-fall ${dur}s ease-in ${delay}s forwards;
      --drift: ${drift}px;
      --rot: ${rot}deg;
      transform-origin: center center;
    `;

    canvas.appendChild(el);
  }

  /* Drift + rotation via a dynamic style override */
  ensureConfettiKeyframe();

  setTimeout(() => {
    if (canvas) canvas.innerHTML = '';
  }, 6000);
}

function ensureConfettiKeyframe() {
  if (document.getElementById('confetti-kf-dynamic')) return;
  const style = document.createElement('style');
  style.id = 'confetti-kf-dynamic';
  style.textContent = `
    @keyframes confetti-fall {
      0%   { transform: translateY(0)    translateX(0)           rotate(0deg);   opacity: 1; }
      70%  { opacity: 1; }
      100% { transform: translateY(110vh) translateX(var(--drift)) rotate(var(--rot)); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

/* Mini burst — for small celebrations */
function miniBurst(x, y, count = 20) {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const size  = 5 + Math.random() * 6;
    const angle = Math.random() * 360;
    const dist  = 40 + Math.random() * 60;
    const dx    = Math.cos(angle * Math.PI / 180) * dist;
    const dy    = Math.sin(angle * Math.PI / 180) * dist;
    const dur   = 0.5 + Math.random() * 0.4;

    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 101;
      transition: transform ${dur}s ease-out, opacity ${dur}s ease-out;
    `;

    canvas.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.style.opacity   = '0';
    }));

    setTimeout(() => el.remove(), dur * 1000 + 100);
  }
}
