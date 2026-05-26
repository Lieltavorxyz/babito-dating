# UI/UX Agent — babito-dating

## Role
Own every pixel. Color, spacing, animation timing, duck placement, button feel.
Output: CSS, SVG, keyframe specs. Never touch JS logic.

## Personality of the Site
Cozy, soft, slightly mischievous. Like a hand-drawn Valentine's card that went to art school.
References: Stardew Valley menus, Kirby UI, Studio Ghibli color palettes.

## Design Tokens (Source of Truth)
See `claude.md` → Visual Identity table. Never invent new colors — pull from tokens.

## Typography Rules
- Display (stage titles, "Will you go on a date with me?"): `Pacifico`, 2.5–4rem
- Body (question text, answers): `Nunito`, 1.1rem, weight 600
- Captions / duck speech: `Nunito`, 0.9rem, italic, `--text-muted`
- Line height: 1.6 body, 1.2 display
- Letter spacing: -0.01em display, 0 body

## Button Design Spec
```css
/* Base button */
border-radius: 50px;
padding: 14px 36px;
font: 700 1rem 'Nunito';
border: none;
cursor: pointer;
box-shadow: 0 4px 16px rgba(244,114,182,0.3);
transition: transform 120ms ease, box-shadow 120ms ease;

/* Yes button */
background: linear-gradient(135deg, #f472b6, #c084fc);
color: white;

/* No button */
background: #ffe4f0;
color: #9d6b7e;
border: 2px solid #f9a8d4;

/* Hover (Yes only — No button never reaches hover) */
transform: scale(1.05);
box-shadow: 0 8px 28px rgba(244,114,182,0.45);
```

## Card / Stage Container
```css
max-width: 560px;
margin: auto;
background: var(--surface);
border-radius: 24px;
padding: 48px 40px;
box-shadow: 0 8px 32px rgba(244,114,182,0.15);
border: 1.5px solid rgba(244,114,182,0.2);
```

## Animation Timing Doctrine
- Entries: 400ms ease-out (snappy, not sluggish)
- Duck waddle: 600ms loop (lively but not seizure-inducing)
- Button pulse: 2000ms ease-in-out infinite (breathing)
- No evasion: 0ms (instant — that's the joke)
- Yes slide: 280ms ease-out (smooth escape)
- Clone fade: 400ms (quick embarrassment)
- Confetti fall: 2500–4000ms randomized per particle

## Duck Placement Rules
- Always bottom-right of stage card OR centered below text
- Never overlap interactive elements
- Size: 96px default, 64px in answer-reaction, 140px in victory
- Duck speaks via CSS `::after` speech bubble, not a DOM element
- Speech bubble: border-radius 12px, background surface-2, border 1.5px accent, padding 8px 14px

## Answer Reaction Map
| Answer character | Duck state | Speech |
|---|---|---|
| Lovey/positive | `duck-happy` | wiggle animation |
| Funny/self-aware | `duck-celebrate` | bounce |
| Cheeky/wrong | `duck-shocked` | eyes-wide + shake |
| Duck wins | `duck-celebrate` | spin |
| Duck loses | `duck-idle` → sad tilt | droops |

## Mobile Breakpoints
- `max-width: 600px`: card padding → 28px 20px, title → 2rem, buttons full-width stacked
- `max-width: 380px`: duck size → 72px, font-size body → 1rem

## No-Emoji Rule
Zero emoji characters in HTML, CSS content strings, or JS strings rendered to DOM.
Replace with: SVG icons, CSS shapes, styled spans, or duck illustrations.
The word "duck" typed in text is fine. The emoji 🦆 is not.

## Deliverables Per Phase
- Phase 1: `main.css`, `animations.css`, all 5 duck SVGs
- Phase 2: `stages.css` (Q&A layout, answer grid, duck reaction zone)
- Phase 3: Clone button styling, modal styling, evasion visual feedback
- Phase 4: Victory layout, confetti particle CSS, final polish pass
