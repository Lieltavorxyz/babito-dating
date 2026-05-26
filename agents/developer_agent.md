# Developer Agent — babito-dating

## Role
All JS logic, state management, DOM manipulation, event handling, evasion mechanics.
Output: `app.js`, `stage1.js`, `stage2.js`, `stage3.js`, `ducks.js`, `confetti.js`.
Never invent new styles — apply CSS classes defined by UI/UX Agent.

## Stack
- Vanilla JS (ES2022, modules via `type="module"`)
- No frameworks, no build tools, no dependencies
- Browser target: last 2 versions Chrome/Firefox/Safari/Edge + iOS Safari 15+

## State Machine

```js
// Global state object — single source of truth
const state = {
  stage: 0,            // 0=intro, 1=quiz, 2=proposal, 3=victory
  questionIndex: 0,    // 0–2 for Stage 1 questions
  answers: [],         // user's selected answers (for duck reactions)
  yesAttempts: 0,      // how many times Yes button has been evaded
  noTeleports: 0,      // how many times No button has teleported
  realCloneId: null,   // which clone is the real Yes button (attempt 2)
};

function goToStage(n) {
  state.stage = n;
  renderStage(n);
}
```

## Stage 1 — Quiz Logic

```js
const QUESTIONS = [
  {
    text: "How much do you love me today?",
    options: [
      { label: "A normal amount", duck: "shocked", speech: "...normal?!" },
      { label: "A lot, actually", duck: "happy", speech: "I'll take it." },
      { label: "More than I love ducks", duck: "celebrate", speech: "Wow." },
      { label: "Truly an unreasonable amount", duck: "celebrate", speech: "*faints*" },
    ],
  },
  {
    text: "A duck and I both want the last piece of bread. Who gets it?",
    options: [
      { label: "The duck, obviously", duck: "celebrate", speech: "Correct." },
      { label: "You, because you're cute", duck: "happy", speech: "Acceptable." },
      { label: "You split it", duck: "idle", speech: "Fine, I guess." },
      { label: "You fight for it", duck: "shocked", speech: "BOXING GLOVES ON." },
    ],
  },
  {
    text: "On a scale of 1–4, how ready are you for what's about to happen?",
    options: [
      { label: "1 — Totally not ready", duck: "shocked", speech: "Same." },
      { label: "2 — Somewhat ready", duck: "idle", speech: "Okay." },
      { label: "3 — Pretty ready", duck: "happy", speech: "Let's go!" },
      { label: "4 — I was born ready", duck: "celebrate", speech: "Respect." },
    ],
  },
];

// On answer select:
// 1. Show duck reaction (500ms)
// 2. Wait 900ms total
// 3. If questionIndex < 2: advance to next question with card-enter animation
// 4. If questionIndex === 2: show transition text, then goToStage(2)
```

## Stage 2 — Button Evasion

### No Button Teleport
```js
function teleportNo(btn) {
  state.noTeleports++;
  const pad = 60;
  const minDistFromYes = 120;
  const yesBounds = yesBtnEl.getBoundingClientRect();

  let x, y, attempts = 0;
  do {
    x = pad + Math.random() * (window.innerWidth - pad * 2 - btn.offsetWidth);
    y = pad + Math.random() * (window.innerHeight - pad * 2 - btn.offsetHeight);
    attempts++;
  } while (
    attempts < 30 &&
    Math.hypot(x - yesBounds.left, y - yesBounds.top) < minDistFromYes
  );

  btn.style.position = 'fixed';
  btn.style.left = x + 'px';
  btn.style.top = y + 'px';
  btn.style.transition = 'none'; // instant — no animation, that's the joke

  if (state.noTeleports === 3) {
    spawnDuck('shocked', x, y - 60); // duck appears near No button, shakes head
  }
}

// Attach to both mouseover (desktop) AND touchstart (mobile)
noBtnEl.addEventListener('mouseover', () => teleportNo(noBtnEl));
noBtnEl.addEventListener('touchstart', (e) => {
  e.preventDefault();
  teleportNo(noBtnEl);
}, { passive: false });
```

### Yes Button — Attempt 1 (Slide)
```js
function yesAttempt1(btn) {
  const dirs = [
    { dx: -200, dy: 0 }, { dx: 200, dy: 0 },
    { dx: 0, dy: -180 }, { dx: 0, dy: 180 },
  ];
  const d = dirs[Math.floor(Math.random() * dirs.length)];
  // clamp to viewport
  btn.style.transition = 'transform 280ms ease-out';
  btn.style.transform = `translate(${d.dx}px, ${d.dy}px)`;
  setTimeout(() => {
    btn.style.transition = 'transform 500ms ease-in-out';
    btn.style.transform = 'translate(0,0)';
  }, 900);
}
```

### Yes Button — Attempt 2 (Clone Split)
```js
function yesAttempt2() {
  // Remove original Yes button from layout (hide, keep in DOM for reference)
  // Create 4 buttons with identical text/style
  // Position: 4 quadrants relative to viewport center
  // Pick 1 as real (data-real="true"), mark rest data-real="false"
  // Real click → advance to modal
  // Fake click → duck shocked + "Oops! Not that one." → fade clone
  // If all 3 fakes clicked without finding real → re-create set
  const positions = [
    { left: '20%', top: '30%' },
    { left: '60%', top: '30%' },
    { left: '20%', top: '60%' },
    { left: '60%', top: '60%' },
  ];
  const realIdx = Math.floor(Math.random() * 4);
  state.realCloneId = realIdx;
  // inject 4 buttons into body (fixed position)
}
```

### Yes Button — Attempt 3+ (Modal)
```js
function showYesModal() {
  // Inject modal markup into body
  // [I'm sure] → cleanupClones() → yesConfirmed()
  // [Let me think] → closeModal(), state.yesAttempts = 2 (reset to clone stage)
}

function yesConfirmed() {
  // pulse Yes button gold (add class .yes-win)
  setTimeout(() => goToStage(3), 800);
}
```

### Yes Button — Entry Point
```js
function onYesHover() {
  state.yesAttempts++;
  if (state.yesAttempts === 1) yesAttempt1(yesBtnEl);
  else if (state.yesAttempts === 2) yesAttempt2();
  else showYesModal();
}
// mouseenter + touchstart both call onYesHover
// On touchstart: e.preventDefault() to block ghost click
```

## Stage 3 — Victory
```js
function renderVictory() {
  // 1. Clear stage 2 content
  // 2. Start confetti (confetti.js)
  // 3. Animate 3 ducks bouncing in from bottom (staggered 150ms each)
  // 4. Fade in message text
  // 5. Fade in date card (after 1200ms)
}
```

## Duck System API
```js
// ducks.js exports:
import { spawnDuck, reactionDuck, clearDucks } from './ducks.js';

spawnDuck(state, x, y);
// state: 'idle'|'happy'|'shocked'|'celebrate'|'swim'
// x, y: optional fixed coords; if omitted, uses default placement

reactionDuck(state, speech);
// updates the persistent stage duck (bottom-right of card)

clearDucks();
// removes all spawned ducks from DOM
```

## Confetti Particle Spec
```js
// confetti.js
// 80–120 particles on trigger
// Colors: ['#f472b6','#c084fc','#86efac','#fff','#fde68a']
// Each particle:
//   - random start X across top 20% of screen
//   - random size: 6–14px, random shape: circle|rect|duck-silhouette
//   - random fall duration: 2500–4000ms
//   - random horizontal drift: -80px to +80px
//   - random rotation: 0–720deg
//   - opacity fades from 1 → 0 in last 30% of animation
// Duck-silhouette: 12px SVG clip-path, 10% of particles
```

## Error Handling
- No try/catch theatrics — this is a static fun site
- If confetti RAF fails: degrade silently (no confetti, rest works)
- If clone positioning overflows viewport: clamp to safe zone

## Mobile-First Event Handling
- All interactive elements handle both mouse + touch events
- `touchstart` with `{ passive: false }` + `e.preventDefault()` where needed
- No hover-only mechanics without touch fallback
- Test at 375px (iPhone SE) and 390px (iPhone 14) viewport widths
