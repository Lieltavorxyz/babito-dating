# Code Review Agent — babito-dating

## Role
Review every PR on this repo before merge. No exceptions.
Focus: correctness of game mechanics, mobile safety, no regressions.
Output: inline comments + summary verdict. Block merge on P0/P1. Approve on P2-only.

## What to Always Check

### 1. Button Evasion Integrity (P0 — merge blocker)
The game's core fun depends entirely on these mechanics being airtight.

**No button:**
- `mouseover` + `touchstart` both attached with `{ passive: false }` on touchstart
- `e.preventDefault()` called on touchstart (prevents ghost click)
- Teleport is instant (`transition: 'none'`) — never animated
- New position always within safe zone: `pad=70px` all sides, `padB=100px` bottom
- New position never overlaps Yes button (min `130px` hypot distance)
- New position never repeats previous position (min `90px` hypot distance)
- No click handler ever added to No button
- `pointer-events` on No button never disabled (it must be hoverable to teleport)

**Yes button — attempt 1 (slide):**
- `yesEvading` flag checked before firing
- `yesEvading = false` reset after animation completes (timeout chain)
- Slide clamped to viewport bounds
- Returns to original position via spring-back

**Yes button — attempt 2 (clone split):**
- Original Yes button gets `visibility: hidden` AND `pointer-events: none`
- Both restored in `clearClones()`
- Exactly 1 clone has `data-real="true"`, rest `data-real="false"`
- Fake click: clone fades + tooltip + duck shocked
- Real click: `clearClones()` → `yesConfirmed()`
- Clone positions clamped to viewport on all sides

**Yes button — attempt 3+ (modal):**
- Modal backdrop covers full screen (`position: fixed; inset: 0`)
- `body.overflow = 'hidden'` while modal open, restored on close
- [I'm sure] → `yesConfirmed()`
- [Let me think] → `STATE.yesAttempts = 2`, `yesEvading = false`
- Modal NOT dismissible via backdrop click

**State reset on stage entry:**
- `STATE.yesAttempts = 0` in `renderStage2`
- `STATE.noTeleports = 0` in `renderStage2`
- `yesEvading = false` in `renderStage2`
- `cloneEls = []` in `renderStage2`

### 2. Stage Transitions (P0)
- `goToStage(n)` always cleans up before rendering:
  - `querySelectorAll('.btn-clone').forEach(c => c.remove())`
  - `querySelectorAll('.clone-tooltip').forEach(c => c.remove())`
  - `querySelectorAll('#yes-modal').forEach(c => c.remove())`
  - `body.style.overflow = ''`
  - `clearFloatingDucks()`
- No DOM elements from previous stage leak into next stage
- `app.innerHTML = ''` always called before new stage renders

### 3. Mobile Touch Events (P1 — fun-breaking if wrong)
- `touchstart` with `{ passive: false }` on all interactive evasion buttons
- `e.preventDefault()` always called on touchstart for No and Yes buttons
- No tap-delay on buttons: `touch-action: manipulation` on `.btn`
- Clone buttons: both `click` AND `touchstart` handlers attached
- Floating ducks: `pointer-events: none` so they don't block touches

### 4. Animation / Transform Conflicts (P1)
- **Rule:** Never apply `scaleX(-1)` to `.duck-wrap` if that element also receives animation classes
- Apply directional flips to the `svg` element directly (child of `.duck-wrap`)
- `anim-duck-bounce`, `anim-duck-waddle`, `anim-duck-shake` all use `transform` on the element they're applied to — adding these to `.duck-wrap` that has inline `transform` clobbers the flip

### 5. No-Emoji Rule (P1)
- Zero emoji characters (U+1F000+) in any `.html`, `.css`, `.js`, `.md` file
- Favicon uses SVG data URI with duck SVG paths, not emoji text
- Decorative elements use SVG, CSS shapes, or text characters only
- Check: `grep -rn $'\U0001F' . --include="*.{html,css,js}"` should return nothing

### 6. Script Load Order (P1)
Scripts in `index.html` must load in this exact order:
```
ducks.js → confetti.js → stage0.js → stage1.js → stage2.js → stage3.js → app.js
```
`app.js` must be last — it defines `STATE` and `goToStage` which all other stages reference.
No `type="module"` — classic scripts only (avoids CORS/MIME edge cases on GitHub Pages).

### 7. Global Namespace Hygiene (P2)
Functions accessible across files (referenced by other scripts):
- `goToStage`, `STATE` — defined in `app.js`
- `renderDuck`, `duckReact`, `spawnFloatingDuck`, `clearFloatingDucks`, `DUCK_SVGS`, `animateDuck` — defined in `ducks.js`
- `launchConfetti`, `miniBurst` — defined in `confetti.js`
- `QUESTIONS` — defined in `stage1.js` (also read by `stage3.js` for answer rendering)

If a PR moves any of these to local scope (e.g., wraps in IIFE), cross-file calls break.

### 8. Confetti Safety (P2)
- `launchConfetti` clears canvas after 6000ms to avoid DOM bloat
- `ensureConfettiKeyframe` idempotent (checks `#confetti-kf-dynamic` before injecting)
- CSS custom properties (`--drift`, `--rot`) used in keyframe `transform` — supported Chrome 65+, Firefox 60+, Safari 12+

### 9. Answer Tracking (P2)
- `STATE.answers` accumulates answer indices from stage 1 questions
- `renderAnswers()` in stage3 cross-references `QUESTIONS` (from stage1.js) — both must be loaded
- Discord webhook: `DISCORD_WEBHOOK_URL` in `app.js` — must be empty string `''` by default (not hardcoded token)
- Webhook POST uses `fetch` with CORS — Discord webhook endpoint supports CORS, this is safe

### 10. CSS Design Token Compliance (P2)
- No hex colors outside of `:root {}` token block
- All new UI elements use `var(--*)` tokens
- No new fonts added without updating Google Fonts URL in `index.html`
- Current fonts: `Comfortaa` (display/headings), `Nunito` (body)
- No `!important` anywhere

---

## Review Checklist Template

Paste this in every PR review:

```
## Code Review — babito-dating

### P0 Blockers (merge blocked until resolved)
- [ ] Button evasion mechanics intact
- [ ] Stage transitions clean (no leaks)

### P1 Fun-Breaking (must fix, merge blocked)
- [ ] Mobile touch events correct
- [ ] No transform conflicts on duck elements
- [ ] No emojis in source files
- [ ] Script load order correct

### P2 Polish (nice to have, doesn't block)
- [ ] Global namespace intact
- [ ] Confetti safe
- [ ] Answers tracking working
- [ ] Design tokens used

### Verdict
[ ] Approved
[ ] Changes requested — see comments above
```

---

## Common Mistakes to Watch For

| Pattern | Problem | Fix |
|---|---|---|
| `dw.style.transform = 'scaleX(-1)'` on `.duck-wrap` | Clobbered by `anim-duck-bounce` | Apply to `svg` child |
| `touchstart` without `{ passive: false }` | `e.preventDefault()` silently fails | Always pass `{ passive: false }` |
| Missing `pointer-events: none` on hidden Yes btn | Ghost taps on invisible button | Set on hide, clear on restore |
| `yesEvading` not reset in `renderStage2` | Stage re-entry breaks Yes flow | Reset at top of `renderStage2` |
| Hardcoded webhook token in `app.js` | Security risk (public repo) | Must be empty string default |
| `transition` on No button teleport | Animated teleport kills the joke | Must be `'none'` always |
