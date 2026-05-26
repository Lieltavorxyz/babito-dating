# QA Agent — babito-dating

## Role
Break the game before she does. Verify every mechanic works across devices/sizes.
Output: test checklists, bug reports, edge case findings. Does not write production code.

## Priority Order
1. Button evasion mechanics (core fun — must be airtight)
2. Mobile touch handling (she will likely use phone)
3. Stage transitions (no stuck states)
4. Visual polish (no overflow, no clipping, no font fallback ugliness)

---

## Test Checklist — Stage 0 (Intro)
- [ ] Page loads under 1s on slow 3G (Lighthouse sim)
- [ ] Duck swim animation plays on load, doesn't stutter
- [ ] [Begin] button pulse animation runs continuously
- [ ] Title text doesn't overflow on 320px width
- [ ] Google Fonts loaded — Pacifico + Nunito render correctly (not system fallback)

---

## Test Checklist — Stage 1 (Quiz)
- [ ] All 3 questions render in correct order
- [ ] Selecting any option advances to next question (no stuck state)
- [ ] Duck reaction fires within 100ms of answer select
- [ ] Duck speech bubble appears, reads correctly
- [ ] Q3 → transition text → Stage 2 (no double-fire)
- [ ] Answer options don't overflow card on 375px viewport
- [ ] No option is pre-selected on question render (no default state)
- [ ] Clicking same option twice doesn't double-advance
- [ ] Keyboard: Enter/Space on focused option selects it

---

## Test Checklist — Stage 2 (No Button Evasion)

### Desktop
- [ ] Hover over No button: teleports BEFORE click registers (not after)
- [ ] New position always within viewport (no partial overflow)
- [ ] New position never overlaps Yes button (min 120px distance)
- [ ] New position never overlaps previous No position (min 80px distance)
- [ ] After 3 teleports: duck appears near No button
- [ ] No button is NEVER clickable (zero chance of accidental click)
- [ ] Moving mouse extremely fast: still teleports (no race condition)

### Mobile (375px)
- [ ] touchstart on No button: teleports before tap registers
- [ ] `e.preventDefault()` fires — no ghost click follows teleport
- [ ] New position reachable on small screen (not behind virtual keyboard area)
- [ ] New position not in bottom 100px (OS swipe gesture zone)

---

## Test Checklist — Stage 2 (Yes Button Evasion)

### Attempt 1 (Slide)
- [ ] Hover/touch on Yes: button slides away smoothly (280ms)
- [ ] Slide direction is random (not always same direction)
- [ ] Slide stays within viewport (no off-screen clip)
- [ ] Button returns to center after 900ms
- [ ] yesAttempts counter increments exactly once per hover event
- [ ] Rapidly re-hovering doesn't stack multiple animations

### Attempt 2 (Clone Split)
- [ ] 4 clones appear at correct quadrant positions
- [ ] Clones are visually identical to original Yes button
- [ ] Only 1 clone is real (data-real="true")
- [ ] Clicking fake: duck shocked + tooltip fires, clone fades
- [ ] Clicking real: modal opens
- [ ] Clones don't overflow viewport on 375px
- [ ] If screen too small for 4-quadrant layout: clones stack safely (no overlap with No button)
- [ ] After clones appear, original Yes button is hidden (not double-clickable)
- [ ] No button still teleports during clone phase

### Attempt 3+ (Modal)
- [ ] Modal backdrop covers full screen
- [ ] Modal card centered on all viewports (375px → 1440px)
- [ ] [I'm sure] → modal closes → victory fires
- [ ] [Let me think] → modal closes → state resets to attempt 2 (clone stage re-enters)
- [ ] Modal not dismissible by clicking backdrop (she must choose)
- [ ] No scroll behind modal (body scroll locked)

---

## Test Checklist — Stage 3 (Victory)
- [ ] Confetti fires on Yes confirm — starts within 100ms
- [ ] 80–120 particles visible (not 0, not 5)
- [ ] Duck celebrate animations play for all 3 ducks
- [ ] Ducks stagger in (not all at once)
- [ ] Victory text fades in after ducks
- [ ] Date card visible (not off-screen on mobile)
- [ ] [Share the joy] copies correct string to clipboard
- [ ] Confetti doesn't freeze/lag on low-end mobile (throttle if >100ms frame time)

---

## Edge Cases to Verify

### No Button
- Very fast cursor movement across No button: still teleports
- No button teleports to area where Yes button just moved to: position recalculated
- Viewport resize mid-game: No button position clamped correctly (not off-screen)
- Infinite teleport loop (if no valid position found): fallback to bottom-center after 30 tries

### Yes Button
- User clicks Yes before hover triggers attempt 1: should it fire? No — hover must precede click (mouseenter/touchstart gate)
- Screen reader: Yes button should have aria-label="Yes button — it might run away"
- No button click somehow registers (impossible by design — verify zero click handlers on No)

### General
- Browser back button mid-quiz: behavior undefined (acceptable — just restart)
- Very slow network: fonts not loaded → fallback fonts don't break layout
- iOS Safari: `position: fixed` buttons behave correctly when virtual keyboard open
- Android Chrome: touch events fire in correct order (touchstart → preventDefault → no click)
- Safari 15: CSS `gap` + `place-items` used in grid — verify no layout bug

---

## Regression Check After Each Phase
Run through full flow:
Intro → Q1 → Q2 → Q3 → transition → No teleport × 3 → Yes slide → Yes clone → Yes modal → Victory

Time full run: should take 2–4 min for a "normal" player.

---

## Bug Report Template
```
BUG: [short title]
Stage: [0/1/2/3]
Device: [desktop/mobile, browser, viewport]
Steps to reproduce:
  1.
  2.
Expected: 
Actual: 
Severity: [P0-blocker / P1-fun-breaking / P2-visual]
```
