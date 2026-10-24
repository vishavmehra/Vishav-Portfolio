# 05 — UI DESIGN BIBLE

> **Status:** Specification, not yet implemented (Milestones 5, 6, 7, 10)
> **Authority:** `CLAUDE.md` §5, §16–§19, §38–§41. Material and colour language inherited from [01_WORLD_DESIGN_BIBLE.md](01_WORLD_DESIGN_BIBLE.md).
> **Last updated:** 2026-08-29
> **Related:** [03_GAMEPLAY_AND_INTERACTION.md](03_GAMEPLAY_AND_INTERACTION.md) · [06_CONTENT_SYSTEM.md](06_CONTENT_SYSTEM.md)

---

## 1. UI philosophy

The UI belongs to the world. It is not a website layered over a canvas.

Guiding principles:

- **Quiet by default.** UI appears when needed and gets out of the way. At rest, the screen shows the world and almost nothing else.
- **Material continuity.** Panels borrow the world's material language — warm paper/parchment tones, weathered timber, soft edges. Not glass, not chrome, not neon.
- **Typography carries the hierarchy.** Not borders, not boxes, not shadows.
- **Restraint over decoration.** If an element can be removed without losing meaning, remove it.
- **One product across platforms.** Desktop and mobile share type, colour, spacing rhythm and component language. Only layout and input differ.

### Explicit prohibitions

Per `CLAUDE.md` §38, §39 and the design brief:

❌ Generic SaaS layouts · ❌ excessive glassmorphism · ❌ cyberpunk / terminal aesthetics · ❌ fake terminal commands · ❌ giant floating text · ❌ neon or glowing borders · ❌ generic gradients · ❌ excessive borders and card stacks · ❌ visual noise · ❌ 3D text in the world · ❌ animation for spectacle

## 1a. Figma's role and boundary

> **Recorded 2026-08-31.** Figma is a tool in the chain, never a link above it.

```
DOCUMENTATION  (CLAUDE.md + docs/ — the authority)
      ↓
FIGMA          (UI composition decisions)
      ↓
HAND-WRITTEN REACT
```

**Figma is for:** UI composition and layout · typography · component definition and variants · interaction and focus states · responsive desktop/mobile layouts · design tokens.

**Figma is not for:** 3D world geometry · terrain · vegetation · trees · the character · destination props · signposts, trail markers or any diegetic world object · lighting · time-of-day presets. Those are governed by [01](01_WORLD_DESIGN_BIBLE.md), [02](02_TIME_OF_DAY.md), [09](09_M4_WORLD_PLAN.md), [10](10_ART_ASSET_PIPELINE.md) and `design/references/`, and are produced as geometry and materials, never as frames.

**Precedence.** Where a Figma frame conflicts with `CLAUDE.md` or `docs/`, the document wins and the frame is wrong. Figma never silently amends an approved decision — a change of direction is a new entry in [08](08_DESIGN_DECISIONS.md) first, a frame second (`CLAUDE.md` §45).

**Code generation.** Frames are read and implemented by hand. Automated frame-to-component output is not used: it produces generic markup that works against `CLAUDE.md` §35, §39 and §61.

## 2. Design tokens

**All values are starting points for tuning, derived from the reference palette in [01](01_WORLD_DESIGN_BIBLE.md) §9.**

### Colour

| Token | Approx. | Use |
|---|---|---|
| `surface` | `#f2e9d8` | Panel background — warm parchment |
| `surface-raised` | `#faf4e8` | Inset content areas |
| `ink` | `#3a3128` | Primary text — warm near-black, never pure black |
| `ink-muted` | `#6f6151` | Secondary text, labels |
| `rule` | `#d9cbb2` | Hairline dividers |
| `timber` | `#8a7358` | Frame accents, control chrome |
| `accent` | `#f0932b` | **The signature amber.** Interaction affordances, active state, focus. |
| `accent-deep` | `#cf7f3c` | Pressed/hover state |
| `scrim` | `rgba(26,22,18,0.45)` | Dimming behind expanded windows |

The amber `accent` is the character's visor colour, promoted to the product's single attention colour. It should be the only saturated hue in the UI, used sparingly enough to remain meaningful.

**✅ APPROVED (DD-23) —** approximately `#F0932B` is the primary product accent. Used sparingly for the player's visor, interaction states, selected UI states and small important lighting accents. It must remain an accent, never the dominant colour (see [01](01_WORLD_DESIGN_BIBLE.md) §9).

### Typography

**ASSUMPTION — no typeface is specified by any reference. The following is a proposal and needs approval.**

- **Display / headings:** a warm humanist sans with real character — slightly geometric, not neutral. Used for destination titles and the loading screen wordmark.
- **Body:** a highly readable humanist sans at comfortable size. Long-form technical content must be genuinely pleasant to read.
- **Mono:** only where content is genuinely code (tech stack chips, folder structures, code snippets). Never for decoration, never for "tech feel".

Scale (desktop → mobile): display 32→26 · title 22→20 · body 16→16 · caption 13→13. Body never drops below 16 px on mobile.

Line length capped around 70–75 characters in expanded content.

### Shape, spacing, motion

- Corner radius: 4–8 px. Soft, not pill-shaped, not sharp.
- Spacing rhythm on a 4 px base: 4 / 8 / 12 / 16 / 24 / 32 / 48.
- Elevation: one soft warm-tinted shadow. Never stacked shadows, never glow.
- Motion: 150–250 ms, eased. Window expansion up to 300 ms. Nothing longer.
- `prefers-reduced-motion`: transitions collapse to ~80 ms opacity changes. All functionality preserved (`CLAUDE.md` §41).

---

## 2a. Token source of truth — required migration

> **Status: documented, not implemented (2026-08-31).** No source file was changed while writing this. This section defines the target so Figma and code can share one vocabulary before either grows.

### The two colour systems are separate

| System | Lives in | Consumed by | Source doc |
|---|---|---|---|
| **Environment palette** | `src/game/world/materials.ts`, geometry vertex colours, light/fog config | Three.js materials and lights inside the canvas | [01](01_WORLD_DESIGN_BIBLE.md) §9 |
| **UI tokens** | CSS custom properties | DOM elements outside the canvas | §2 above |

They share a family resemblance because both came from the same references. **They are not the same set and must never be unified into one table.** A world material changing does not change a panel; a panel token changing does not change the grass. Anything needing both (the amber accent) is *duplicated deliberately*, not shared through one variable.

### Current state — drift

The only UI in the build is the joystick, and it hardcodes token values as `rgba()` literals in [`src/app/globals.css`](../src/app/globals.css):

| Literal in `globals.css` | Hex | Token |
|---|---|---|
| `rgba(242, 233, 216, …)` | `#f2e9d8` | `surface` ✅ |
| `rgba(58, 49, 40, 0.14)` | `#3a3128` | `ink` ✅ |
| `rgba(240, 147, 43, …)` | `#f0932b` | `accent` ✅ |
| `rgba(207, 127, 60, 0.9)` | `#cf7f3c` | `accent-deep` ✅ |
| `rgba(107, 94, 82, 0.35)` | `#6b5e52` | **⚠️ No token.** Nearest is `ink-muted` `#6f6151`, but it is not that value |

Four of five values are approved tokens written by hand. The fifth is an unrecorded colour.

### Minimum safe migration

Smallest change that establishes one source of truth without touching a rendered pixel:

1. Declare the §2 colour tokens once in a Tailwind v4 `@theme` block in `globals.css`. No new file, no config, no dependency.
2. Rewrite the `.joystick` rules to reference those tokens, applying alpha with `color-mix(in srgb, var(--color-…) N%, transparent)` — which resolves to the identical `rgba()` the rules already produce.
3. **Leave `#6b5e52` as a literal with a comment**, or promote it to a token — a decision, below. Do not round it to `ink-muted`: that would change the rendered colour, and this migration must not.
4. Type, spacing, radius, elevation and motion tokens land when the first component that needs them lands — not before (`CLAUDE.md` §35).

**Not part of the migration:** building the full token system, adding a font, restyling the joystick, or touching anything in `src/game/`.

### `themeColor: #d7e4e0` — recorded, not changed

[`src/app/layout.tsx`](../src/app/layout.tsx) sets `themeColor: '#d7e4e0'`, matching the `body` background in `globals.css`. That value:

- is **not** a UI token from §2;
- is **not** an environment colour from [01](01_WORLD_DESIGN_BIBLE.md) §9 either — nearest are sky-upper `#b9c9d4` and water `#a8ccc9`, neither of which it is;
- was chosen as the pre-canvas paint so the first frame is sky-ish rather than white.

It therefore sits in neither system, and it colours mobile browser chrome — DOM surface, not world surface. Once the loading screen exists, §3 says the **first thing anyone sees is a full-screen warm parchment ground (`surface`)**, so browser chrome tinted pale blue-green would frame it wrongly.

**Not changed here.** Two candidate resolutions, both requiring approval:

| Option | Effect |
|---|---|
| (a) `themeColor` and `body` background both become `surface` `#f2e9d8` | Browser chrome matches the loading screen, the actual first paint. Costs a brief warm flash before the canvas rather than a cool one |
| (b) Keep `#d7e4e0`, record it as an intentional third value | Pre-canvas flash keeps matching the sky. Requires admitting one colour that belongs to neither system |

Logged as **O-19** in [08](08_DESIGN_DECISIONS.md) §2.

---

# COMPONENTS

## 3. Loading screen

The first thing anyone sees. It sets the tone for everything after it.

### Approved copy — verbatim, do not alter

```
VISHAV MEHRA

Loading...

[██████████████░░]

Looking for the
"professional" version of me...

Not found.

Proceeding anyway.
```

### Treatment

- Full-screen, warm off-white ground (`surface`). Not black, not a gradient.
- `VISHAV MEHRA` in display type, generously letter-spaced, centred. The only large text.
- `Loading...` small, `ink-muted`.
- The **progress bar is literal** — a blocky filled/unfilled bar in the spirit of `[██████████████░░]`, drawn as real elements rather than text characters, tracking **actual load progress**.
- The joke lines are set small and quiet, in `ink-muted`, appearing in sequence as loading proceeds. **Deadpan delivery — no animation flourish on the punchline.** The comedy is in the flatness.
- No spinner, no percentage number, no logo animation, no fake stages.

### Behaviour

- Real progress only. **Never artificially delayed** to let the animation play (`CLAUDE.md` §5).
- **Gameplay input is closed while it is up** — movement, camera look and interaction all ignore input, on keyboard and on touch, and the screen itself swallows drags so nothing scrolls. Input returns the moment the world is revealed, including keys still held.
- If loading completes before all lines have shown, **transition immediately.** The joke is expendable; the wait is not.
- Transition to world: a short cross-fade (~400 ms) into the scene, with the onboarding hint appearing after.
- Do not add further jokes without approval.

**ASSUMPTION —** the joke lines reveal progressively against load progress rather than on fixed timers, so a fast load simply skips them. Needs approval.

## 4. Interaction prompt

Appears when an interactable is in range; disappears when it is not.

- **Screen-space**, anchored near the object's projected screen position, offset above it. Not world-space 3D text (`CLAUDE.md` §38).
- Small: a single line of the interactable's `prompt`, with the input affordance.
- Desktop: a small key cap glyph — `E` — in `accent`, followed by the prompt text.
- Mobile: prompt text only. The INTERACT button is the affordance.
- Background: a soft warm scrim pill, low opacity, just enough for legibility over grass or sky. No hard border.
- Fade in/out over ~150 ms. Never slides, never bounces, never pulses.
- Hysteresis on the range check prevents flicker at the boundary.

## 5. Destination guidance

### Onboarding hint

```
WASD / ARROWS
TO EXPLORE
```

- Centred low on screen, small, `ink-muted` over a soft scrim.
- Mobile shows the touch equivalent.
- Fades on first movement or after a short timeout. Once per session, never returns.

### Directional indicator

- A small chevron or arrow at the screen edge, pointing toward an off-screen undiscovered destination.
- `accent` coloured, small, low opacity.
- **Only when useful** — never when the destination is already visible in frame; never as a permanent set of four (`CLAUDE.md` §10).
- No distance readout, no label, no minimap.

### Trail markers

Physical wooden signs in the world, not UI. Specified in [01](01_WORLD_DESIGN_BIBLE.md) and [03](03_GAMEPLAY_AND_INTERACTION.md).

## 6. Small contextual window

Opens on interaction. Compact, summary-level, sits over the world without hiding it.

### Desktop

- Centred, roughly 380–460 px wide, auto height, capped at ~55% of viewport height.
- World remains visible and lit around it — **no full-screen scrim at this level.** A very light vignette at most.
- Structure:

```
  DESTINATION TITLE            (small, letter-spaced, ink-muted)
  ─────────────────────────    (hairline rule)

  ◀   Item Name   ▶            (carousel control, only if >1 item)

  [ preview image ]            (only if images exist)

  Short description

  tech · stack · chips         (only if present)

  [ VIEW PROJECT ]   ESC to close
```

- Every block is conditional. No image → no image container. One item → no carousel arrows (`CLAUDE.md` §18).

### Mobile

- Bottom sheet, full width, up to ~60% of viewport height, rounded top corners.
- Same content, larger touch targets, larger preview.
- Visible close control in the top-right of the sheet.

### Motion

Grows from the interaction point — a short scale-and-fade (~200 ms) that reads as the world producing the panel, not a modal dropping in.

## 7. Expanded window

The small window **expands into** the full viewer. It must read as continuous growth of the same object, not as one panel closing and another opening (`CLAUDE.md` §16).

### Desktop

- Large centred panel, roughly 60–70% viewport width (capped ~1100 px), 75–85% viewport height.
- A soft `scrim` appears behind it at this level — the world stays visible but recedes.
- **Internal scrolling only.** The page never scrolls; body scroll stays disabled.
- Sticky header carrying the title and a visible close control.
- Content column capped at a readable measure; section stack with generous vertical rhythm.

### Mobile

- Full-screen panel.
- Sticky header with title and a large close control.
- Full internal scrolling, momentum enabled.

### Section rendering

- Section headings small, letter-spaced, `ink-muted`, above a hairline rule.
- **A section with no data does not render.** No empty card, no "N/A", no placeholder paragraph (`CLAUDE.md` §19). Remaining content reflows naturally.
- Long technical content is broken with clear headings and comfortable spacing. This is where the actual engineering depth lives — it must be genuinely readable, not a wall.

### Motion

~300 ms expansion. Position and size interpolate; content cross-fades in.

## 8. Carousel

- Used only when a section has **more than one** item, or more than one image (`CLAUDE.md` §18).
- 1 image → static image. 0 images → **no image container at all**.
- Desktop: `◀` `▶` controls, plus arrow-key navigation while the window has focus.
- Mobile: horizontal swipe, plus visible arrow controls — swipe is never the only route.
- Position indicator: small dots or `2 / 5`. Quiet.
- Wraps at both ends. No infinite auto-advance, ever.

## 9. Buttons

Three levels only:

| Level | Treatment |
|---|---|
| **Primary** (`[ VIEW PROJECT ]`) | Filled `accent`, `ink`-dark label, soft radius. One per view at most. |
| **Secondary** (external links) | Outlined in `rule`, `ink` label, transparent ground. |
| **Quiet** (carousel arrows, close) | Icon or glyph only, `ink-muted`, `accent` on hover/focus. |

- Minimum touch target 44 px; 56 px for the mobile interact button.
- Visible focus ring in `accent` — never `outline: none`.
- Hover is an enhancement only. Nothing depends on it (`CLAUDE.md` §13, §41).

## 10. Close controls

- **Desktop:** `ESC` closes. A visible close glyph is also always present — the keyboard route is never the only route.
- **Mobile:** an obvious close control, always visible, in a consistent position (top-right of the panel).
- Never a hidden gesture. Never swipe-to-dismiss as the only mechanism (`CLAUDE.md` §17).
- `ESC` steps back one level: expanded → small → closed (**ASSUMPTION**, see [03](03_GAMEPLAY_AND_INTERACTION.md) C13).

## 11. Mobile world controls

### Virtual joystick

- Bottom-left, within thumb reach, inside safe areas.
- Visual: a soft warm ring with an inner knob. Timber/parchment tones, low opacity at rest.
- Analogue — deflection maps to speed.
- Hidden while any window is open.

### Interact button

- Bottom-right, minimum 56 px.
- **Contextual** — fades in only when an interactable is in range.
- `accent` fill, world-material framing.
- Hidden while any window is open.

Neither control may overlap the character. Camera framing accounts for their footprint (see [03](03_GAMEPLAY_AND_INTERACTION.md) §10).

## 12. Time of Day control

Behaviour specified in [02_TIME_OF_DAY.md](02_TIME_OF_DAY.md) §11. Visual requirements:

- Four discrete options: MORNING · AFTERNOON · EVENING · NIGHT.
- **Must read as part of the game.** Warm timber framing, small hand-drawn-feeling marks, world palette. **Not** a sun/moon toggle, not a segmented control from a UI kit, not a settings gear.
- Small and quiet at a screen corner. Never competes with the world.
- Current preset clearly indicated — `accent` marker or a warmer fill on the active option.
- Desktop: four small labelled marks in a row.
- Mobile: **ASSUMPTION —** collapses to a single icon that expands on tap. Needs approval.
- 44 px minimum targets; keyboard reachable with visible focus.
- Dimmed or hidden while a window is open.
- **Never labelled "theme", "dark mode", or "appearance".**

---

## 13. Responsive behaviour

| | Desktop | Mobile |
|---|---|---|
| Small window | Centred panel, world visible around it | Bottom sheet |
| Expanded window | Large centred panel over a scrim | Full-screen |
| Movement | WASD / arrows | Virtual joystick |
| Interact | `E` | Contextual button |
| Close | `ESC` + visible glyph | Large visible control |
| Carousel | Arrows + arrow keys | Swipe + arrows |
| Time of Day | Four inline marks | Collapsed icon *(assumption)* |
| Body text | 16 px | 16 px — never smaller |

Rules:

- **Not a scaled-down desktop layout** (`CLAUDE.md` §40). Mobile gets its own layout with the same design language.
- Data, interaction and movement systems are shared. Only presentation and input differ.
- Safe-area insets respected on all fixed-position controls.
- Landscape mobile: **ASSUMPTION —** treated as a narrow desktop layout with touch controls. Needs approval.

## 14. Accessibility

- Every essential action reachable by keyboard and by touch.
- Visible focus states throughout; logical tab order; focus trapped inside open windows and restored on close.
- Nothing conveyed by colour alone.
- Minimum 44 px targets.
- Text contrast meets WCAG AA against `surface`.
- `prefers-reduced-motion` honoured across every transition (`CLAUDE.md` §41).
- Windows announced appropriately to assistive technology.

**ASSUMPTION —** the 3D world itself has no assistive-technology equivalent. If a non-spatial content route is required, it needs a decision (see [03](03_GAMEPLAY_AND_INTERACTION.md) C17). Needs approval.

## 15. Open assumptions requiring approval

| # | Assumption |
|---|---|
| E1 | ~~Amber as the single product accent colour~~ → **APPROVED (DD-23)**: approximately `#F0932B`, used sparingly, never dominant |
| E2 | All typography choices — no typeface is specified anywhere |
| E3 | Loading joke lines reveal against real progress; skipped on fast load |
| E4 | Panel colour tokens (parchment/warm ink palette) |
| E5 | Small window sits over the world with no full scrim; scrim appears only when expanded |
| E6 | Time-of-day control collapses to one icon on mobile |
| E7 | Landscape mobile treated as narrow desktop with touch controls |
| E8 | No assistive-technology equivalent for spatial navigation |

### Classification (recorded 2026-08-31 — proposed, none decided)

Triaged before Figma work so it is clear which items are actually waiting on a person. **Nothing below was approved by this pass.**

| # | Classification | Basis |
|---|---|---|
| **E2** Typography | **NEEDS DECISION — blocking** | No document, reference or source file specifies a typeface. Blocks the Figma component library; every other UI decision is downstream of it. Already [08](08_DESIGN_DECISIONS.md) O-12 |
| **E3** Loading reveal | **PARTLY DERIVED** | The *skip-on-fast-load* half is already fixed by `CLAUDE.md` §5 ("never artificially delay… if loading completes quickly, transition immediately"), [00](00_PROJECT_BIBLE.md) §9 and §3 above. Only the reveal *mechanism* — progress-keyed vs timer, both cut short — remains open, and it is an implementation choice, not a design one |
| **E4** Panel tokens | **OPEN** | §2 values are stated as "starting points for tuning". Tuning happens against the real panel in Figma |
| **E5** Small-window scrim | **DERIVED — confirm** | `CLAUDE.md` §4 ("the world remains the central experience"), §16 ("retain some game-world context") and [00](00_PROJECT_BIBLE.md) §12 ("never lose the sense of standing somewhere") already rule out dimming the world at the *summary* level. The residual choice — nothing at all, or a very light vignette — is a Figma judgement, not a decision |
| **E6** Mobile ToD control | **NEEDS DECISION** | [02](02_TIME_OF_DAY.md) §11's "must never compete with the world" and `CLAUDE.md` §40 point toward collapsing, but neither determines it. Four inline marks may fit a 390 px viewport; that is a layout question Figma answers, then you rule |
| **E7** Landscape mobile | **PARTLY DERIVED** | Camera and input are already resolved: [04](04_TECHNICAL_ARCHITECTURE.md) §11a scales framing continuously by aspect, so a landscape phone at ~1.9 already gets desktop framing, and the joystick keys off `(pointer: coarse)`, not width. **Still open:** whether the *window layout* switches on viewport width (bottom sheet vs centred panel) or on pointer type |
| **C13** `ESC` step-back | **NEEDS DECISION** | `CLAUDE.md` §12 ("ESC → close interface") and §17 ("ESC closes the active interface") do not disambiguate whether "the active interface" when expanded is the expanded panel or the whole window. Both readings are consistent with the constitution. Changes the shape of the window state machine, so it is wanted before M6 |
| **C17** Non-spatial a11y route | **NEEDS DECISION** | The one item here with real user impact beyond aesthetics. `CLAUDE.md` §41 mandates keyboard and touch routes for essential actions but is silent on visitors who cannot use spatial navigation at all. Already [08](08_DESIGN_DECISIONS.md) O-9. Scope-shaping — a content route that bypasses walking is a second navigation surface, so it should be settled before the window system is built, not retrofitted |
