# claude.md — babito-dating

## Project
Cute, playful multi-stage interactive quiz site for Liel's girlfriend.
Goal: make her laugh, frustrate her lovingly, end in a "Yes" to a date.

**Live target:** standalone static site (HTML + CSS + Vanilla JS, no build tools)
**Deploy target:** GitHub Pages or Cloudflare Pages (drop-in static)

---

## Nicknames
- Her: **Babito**, **Boobito**
- No emojis anywhere — SVG icons + CSS elements only

---

## Visual Identity
| Token | Value |
|---|---|
| `--bg` | `#fdf4f8` (blush white) |
| `--surface` | `#fff0f5` (soft pink) |
| `--surface-2` | `#ffe4f0` (medium pink) |
| `--accent` | `#f472b6` (hot pink) |
| `--accent-2` | `#c084fc` (lilac purple) |
| `--accent-3` | `#86efac` (mint, duck bill highlight) |
| `--text` | `#3b1f2b` (deep plum) |
| `--text-muted` | `#9d6b7e` (dusty rose) |
| Font body | `'Nunito', sans-serif` |
| Font display | `'Pacifico', cursive` |
| Border radius | 24px cards, 50px buttons |
| Shadow | `0 8px 32px rgba(244,114,182,0.2)` |

Aesthetic: cozy game, Studio Ghibli-adjacent pastel world. Clean, airy, no clutter.

---

## Duck Motif System
Ducks appear as inline SVG illustrations:
- `duck-idle.svg` — base duck, slightly tilted head
- `duck-happy.svg` — wings up, beak open
- `duck-shocked.svg` — eyes wide, wings out
- `duck-celebrate.svg` — bouncing with tiny confetti
- `duck-swim.svg` — used in loading / transition screens

Ducks placed at: loading screen, between stage transitions, victory screen.

---

## File Structure
```
babito-dating/
  claude.md               ← this file (master blueprint)
  agents/
    ui_ux_agent.md
    developer_agent.md
    qa_agent.md
  src/
    index.html            ← single-page app entry
    styles/
      main.css            ← design tokens + global styles
      animations.css      ← all keyframe animations
      stages.css          ← per-stage layout styles
    scripts/
      app.js              ← state machine + stage router
      stage1.js           ← warm-up quiz logic
      stage2.js           ← button evasion mechanics
      stage3.js           ← victory celebration
      ducks.js            ← duck SVG injection + reactions
      confetti.js         ← confetti particle system
    assets/
      icons/              ← SVG duck illustrations
```

---

## Stage Definitions

### Stage 0 — Loading / Intro Screen
- Animated duck swims across screen
- Text fades in: "A very important quiz for Babito"
- Subtext: "This may change your life. Or at least your evening."
- [Begin] button (pink, bounces gently on load)

### Stage 1 — Warm-Up Questions (3 questions)
Sequential multiple-choice. Any answer advances. Duck reacts per answer.

**Q1:** "How much do you love me today?"
- A: A normal amount (duck: shocked face)
- B: A lot, actually (duck: happy wiggle)
- C: More than I love ducks (duck: celebration)
- D: Truly an unreasonable amount (duck: faints off screen)

**Q2:** "A duck and I both want the last piece of bread. Who gets it?"
- A: The duck, obviously (duck: triumphant)
- B: You, because you're cute (duck: impressed nod)
- C: You split it (duck: accepts compromise)
- D: You fight for it (duck: puts on tiny boxing gloves)

**Q3:** "On a scale of 1–4, how ready are you for what's about to happen?"
- A: 1 — Totally not ready (duck: covers eyes)
- B: 2 — Somewhat ready (duck: shrugs)
- C: 3 — Pretty ready (duck: thumbs up, no thumbs so wing up)
- D: 4 — I was born ready (duck: sunglasses appear)

After Q3: "Perfect. You've been certified Babito. Let's proceed." → transition → Stage 2

### Stage 2 — The Proposal
"Will you go on a date with me, Boobito?"

**"No" button behavior:**
- Desktop: `mouseover` → instantly teleport to random safe position (stay in viewport, avoid overlapping Yes)
- Mobile: `touchstart` → teleport before tap registers
- Never clickable. No hover state ever reached.
- After 3 teleports: duck appears and shakes head disapprovingly at the button

**"Yes" button behavior:**
- Attempt 1: button slides away smoothly (CSS transition, 300ms ease-out)
- Attempt 2: button SPLITS into 3 fake clones + 1 real. Only real triggers next step.
  - Fakes: show duck shocked face + "Not that one!" tooltip, then fade
  - Real: random position among 4
- Attempt 3+: popup modal — "Are you sure you're ready for this level of romance?"
  - [I'm sure] → YES counted. Celebration begins.
  - [Let me think] → modal closes, button returns (attempt counter resets to 2)
- After YES: button pulses gold, stage 3 fires

### Stage 3 — Victory
- Full-screen confetti burst (pink, purple, mint, white particles)
- 3 ducks bounce in from bottom, wings up
- Message fades in: "I knew you'd say yes, Babito."
- Subtext: "You've made a duck very happy. And me. Mostly me."
- Small card below: date details (placeholder — Liel fills in)
- [Share the joy] button: copies a sweet message to clipboard

---

## Button Evasion Technical Spec

### No Button — Teleport
```
safeZone = {
  padding: 60px from any edge,
  minDistFromYes: 120px,
  minDistFromNo: 80px (no overlap with previous pos)
}
newPos = random point in safeZone satisfying constraints
button.style.left = newPos.x + 'px'
button.style.top  = newPos.y + 'px'
button.style.position = 'fixed'
transition: 'none' (instant, not animated — feels snappier / more evil)
```

### Yes Button — Slide Away (Attempt 1)
```
direction = random of [left, right, up, down]
offset = 180px in direction (clamped to viewport)
button.style.transform = translate(dx, dy)
transition: 'transform 280ms ease-out'
after 800ms: slide back to center
```

### Yes Button — Clone Split (Attempt 2)
```
create 4 buttons total, 1 flagged real (data-real="true")
positions: quadrant-spread (top-left, top-right, bottom-left, bottom-right) relative to center
each clone has identical appearance
click on fake: duck shocked + "Oops! Wrong one." flash → fade clone out
click on real: advance to modal
```

### Yes Button — Modal (Attempt 3+)
```
backdrop: semi-transparent blush
card: surface-2, border-radius 24px, duck-idle centered
title: "Are you sure?"
body: "Romance at this level is legally binding in 3 countries."
buttons: [I'm sure] [Let me think]
```

---

## Animation Inventory
| Name | Target | Behavior |
|---|---|---|
| `duck-waddle` | duck SVGs | 3-frame waddle loop |
| `duck-bounce` | stage transitions | scale 1→1.12→1 loop |
| `button-pulse` | [Begin] on load | shadow breathe 2s loop |
| `card-enter` | stage cards | translateY(20px)→0 + fade, 400ms |
| `confetti-fall` | confetti particles | random angle, spin, fade |
| `clone-fade` | fake Yes buttons | opacity 1→0, scale 1→0.8, 400ms |
| `yes-win` | Yes button on click | gold pulse, scale up, disappear |

---

## Build Phases

### Phase 1 — Foundation ⬜
- [ ] P1-1: `src/index.html` — single HTML shell, Google Fonts, script/style links
- [ ] P1-2: `src/styles/main.css` — all design tokens, reset, typography, button base
- [ ] P1-3: `src/styles/animations.css` — all keyframes
- [ ] P1-4: Duck SVG assets (5 states) in `src/assets/icons/`
- [ ] P1-5: Stage 0 (intro) rendered and interactive

### Phase 2 — Quiz Logic ⬜
- [ ] P2-1: `src/scripts/app.js` — state machine (currentStage, questionIndex, yesAttempts)
- [ ] P2-2: `src/scripts/stage1.js` — Q1–Q3 render + duck reactions
- [ ] P2-3: `src/styles/stages.css` — per-stage layouts
- [ ] P2-4: Stage 1 complete with duck reactions per answer

### Phase 3 — Button Evasion ⬜
- [ ] P3-1: `src/scripts/stage2.js` — No button teleport (desktop + mobile)
- [ ] P3-2: Yes button attempt 1 (slide away)
- [ ] P3-3: Yes button attempt 2 (clone split)
- [ ] P3-4: Yes button attempt 3+ (modal)
- [ ] P3-5: Duck reactions to button behavior

### Phase 4 — Victory + Polish ⬜
- [ ] P4-1: `src/scripts/confetti.js` — particle system
- [ ] P4-2: `src/scripts/stage3.js` — victory layout + ducks
- [ ] P4-3: `src/scripts/ducks.js` — centralized duck SVG injection
- [ ] P4-4: Mobile QA pass (all evasion mechanics)
- [ ] P4-5: Date card placeholder (Liel fills in details)
- [ ] P4-6: Final polish + deploy

---

## Current Status
**Active phase:** Phase 1 — Foundation
**Agent on deck:** Developer Agent (Opus)
