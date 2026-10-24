# 02 — TIME OF DAY

> **Status:** System specification. **Scheduled for Milestone 4 — "World + Time of Day"** (DD-25). Not yet implemented.
> **Authority:** Visual targets derived from `design/references/`. All references are lit as late-afternoon / golden hour, so AFTERNOON and EVENING are grounded in reference material; MORNING and NIGHT are extrapolations and are marked as such.
> **Last updated:** 2026-08-29
> **Related:** [01_WORLD_DESIGN_BIBLE.md](01_WORLD_DESIGN_BIBLE.md) · [04_TECHNICAL_ARCHITECTURE.md](04_TECHNICAL_ARCHITECTURE.md) · [07_PERFORMANCE_BIBLE.md](07_PERFORMANCE_BIBLE.md)

---

## 1. What this system is

Four hand-authored **visual presets** applied to a single, permanently loaded world.

```
MORNING · AFTERNOON · EVENING · NIGHT
```

It is a **world-level lighting and atmosphere system**. It is explicitly **not**:

- a dark mode
- a real-time astronomical simulation
- a day/night cycle that advances on its own
- anything that rebuilds, reloads, or re-instantiates the world

The visitor chooses the mood of the place they are standing in. The world does not change — the light does.

### Naming rule

Never label this "dark mode", "theme", or "light/dark" in code, UI, or documentation. The concept is *time of day*, and the vocabulary must stay consistent everywhere: `TimeOfDay`, `morning`, `afternoon`, `evening`, `night`.

## 2. Hard constraints

| Constraint | Rule |
|---|---|
| **No rebuild** | Changing preset must not unmount, remount, dispose, or re-create any geometry, material, texture, or scene graph node. |
| **No reload** | No asset fetches on switch. Everything a preset needs is already in memory. |
| **No simulation** | No sun-position maths from latitude/date. No physical sky model. No real-time GI. |
| **Centralised** | One controller, one source of truth. Every affected system reads from it. Nothing keeps its own private copy of "what time is it". |
| **Consistent** | Switching must move the *entire* world together. A single object left on the old preset is a bug. |
| **Cheap** | The per-frame cost of this system when idle must be zero. Cost during a transition must be a handful of scalar/colour interpolations. |

## 3. What a preset controls

A preset is a plain data object. It may only touch presentation:

| Channel | Property |
|---|---|
| **Sky** | Background colour / gradient, cloud tint |
| **Ambient** | Hemisphere light: sky colour, ground colour, intensity |
| **Sun** | Directional light: colour, intensity, direction vector |
| **Shadow** | Shadow opacity/darkness, softness where affordable |
| **Fog** | Colour, near distance, far distance |
| **Exposure** | Renderer tone-mapping exposure |
| **Emissives** | A small, explicit set of materials that light up (monitor screens, workshop interior, lanterns, window glow) |
| **Water** | Surface tint and highlight strength |

A preset may **never** touch: geometry, object visibility (except the dedicated star field, §8), positions, scale, materials other than the listed emissive set, physics, collision, or gameplay values.

## 4. Default state

**AFTERNOON** on first visit.

Reason: maximum visibility and readability. A first-time visitor must be able to see the paths, read the destination silhouettes, and understand the world instantly. Afternoon is the clearest of the four.

**ASSUMPTION —** the chosen preset persists within a session only (in memory). Persisting across visits via `localStorage` is deferred and needs approval.

---

# THE FOUR PRESETS

Numeric values below are **starting points for tuning in engine**, not specifications. Colour values are approximate.

---

## 5. MORNING

**Feeling:** fresh start, peaceful, quiet, cool air. The world has just woken up.

**ASSUMPTION —** no reference image depicts morning. This preset is extrapolated from the established palette. Needs approval after first visual pass.

| Channel | Target |
|---|---|
| **Sky** | Cool pale blue `#c4d6e0` at zenith, soft pink-cream `#f5e0d4` at the horizon on the sun side. Light, high, thin. |
| **Sun direction** | Low, from the **east side** of the world, roughly 15–20° elevation. Opposite side from EVENING. |
| **Sun colour** | Pale warm white, slightly pink — `#ffeede`. Less saturated than evening. |
| **Sun intensity** | Moderate — around 70–80% of afternoon. |
| **Ambient** | Cool and relatively strong. Sky term `#b8ccd8`, ground bounce `#7a8a5e`. Fills shadows so the world reads soft rather than contrasty. |
| **Colour temperature** | Cool overall with a warm horizon. Cooler than every other preset except night. |
| **Shadows** | Long (low sun) but **soft and light**. Low opacity — morning shadows are hazy, not defined. |
| **Fog** | The heaviest of the daytime presets — light morning haze. Near band pulled closer, tinted toward the pale sky. Distance reads misty. |
| **Exposure** | Slightly raised — bright, airy, slightly washed. |
| **Environment** | Grass reads cooler and fresher. Flowers slightly desaturated. Water is bright and cool. Distant hills nearly dissolve into haze. |
| **Water** | Pale, bright, cool-tinted. Highest sky reflection tint of any preset. |
| **Destinations** | Lit naturally. **No emissives active** — screens are off or dim, no interior lights. |

---

## 6. AFTERNOON — default

**Feeling:** clear exploration, maximum visibility, an open and generous world.

Grounded in REF-FIELD and REF-PROJECTS, which sit closest to a bright natural daylight read.

| Channel | Target |
|---|---|
| **Sky** | The reference sky: cool desaturated blue `#b9c9d4` at zenith warming to cream `#f2e6ce` near the horizon. Soft painterly clouds. |
| **Sun direction** | High-ish but not overhead — roughly **40–50° elevation**. High enough for clear visibility, angled enough to keep forms modelled. |
| **Sun colour** | Warm natural white `#ffe4bb`. |
| **Sun intensity** | The baseline — **1.0**. Every other preset is expressed relative to this. |
| **Ambient** | Balanced. Sky term `#cfe3ef`, ground bounce `#6c7f4a`. Enough fill that shadowed areas stay readable. |
| **Colour temperature** | Neutral-warm. The most colour-accurate of the four — this is where the palette in [01](01_WORLD_DESIGN_BIBLE.md) §9 is "true". |
| **Shadows** | Moderate length, moderate softness, clearly directional. Readable but not dramatic. |
| **Fog** | Lightest of all four. Present only to close the horizon and compress the distance. Far band pushed out. |
| **Exposure** | Neutral baseline. |
| **Environment** | Strong but natural colour. **Paths are at their most readable** — this is the preset a lost visitor should be able to fall back to. Grass at full warm green. Flowers at full saturation. |
| **Water** | Clear, blue-green, bright. Bed stones visible. |
| **Destinations** | Fully lit and legible by daylight. **No emissives active.** |

**Requirement:** every destination must be identifiable by silhouette from its intended discovery point *in this preset*. If it only reads at night because a screen is glowing, the composition is wrong.

---

## 7. EVENING

**Feeling:** golden hour. Warm, long, nostalgic. The most beautiful preset.

This is the preset the references are actually painted in — REF-MASTER, REF-EDUCATION and REF-ACHIEVEMENTS are all golden-hour. **This preset has the strongest reference grounding of the four and should be treated as the visual showpiece.**

| Channel | Target |
|---|---|
| **Sky** | Deep warm gradient — soft blue-grey `#9db0bd` high, through cream, to a strong warm gold `#f7dcae` at the horizon behind the sun. Clouds catch warm light on their undersides. |
| **Sun direction** | Very low — **5–12° elevation**, from the **west/background** side, matching REF-MASTER where the sun sits behind the distant hills. |
| **Sun colour** | Saturated warm gold-orange `#ffc987`. |
| **Sun intensity** | Slightly below afternoon (~85–90%) but far more saturated, so it *reads* stronger. |
| **Ambient** | Warm and low. Sky term `#c9bfc4` (warm-neutral), ground bounce `#8a7444`. Shadows fall warm, never blue. |
| **Colour temperature** | The warmest of the four by a wide margin. |
| **Shadows** | **Long, dramatic, directional** — the defining feature. Trees and structures throw shadows far across the grass. Soft-edged, warm-tinted, never black. |
| **Fog** | Warm-tinted haze. Moderate density, gold-shifted. Creates strong aerial perspective — hills stack in visible layers. |
| **Exposure** | Slightly raised to let the horizon bloom naturally without post-processing. |
| **Environment** | **Backlit and rim-lit grass** — the signature effect from the references. Canopy edges glow. Everything facing the sun is gold; everything facing away is warm shadow. Maximum depth. |
| **Water** | Warm gold highlights on the surface, cool in shadow. Highest contrast of any preset. |
| **Destinations** | Warm side-light modelling every form. **Emissives begin to activate at low strength** — the Projects monitor and workshop interior read faintly, hinting at the night state. |

---

## 8. NIGHT

**Feeling:** quiet, mysterious, cozy. The world is asleep; the workspaces are awake.

**ASSUMPTION —** no reference image depicts night. Extrapolated from the palette and the "warm lights in a dark world" intent stated in the brief. Needs approval after first visual pass.

The core idea: **contrast between a dark cool environment and warm pools of light at every destination.** At night the destinations become the brightest things in the world, which makes them findable — night is a navigational mood, not just an aesthetic one.

| Channel | Target |
|---|---|
| **Sky** | Deep desaturated blue `#1b2740` at zenith, lifting slightly to `#2d3d55` near the horizon. Never black. |
| **Moonlight direction** | High, roughly 55–65° elevation. **ASSUMPTION —** direction chosen for even soft coverage rather than drama; needs approval. |
| **Moonlight colour** | Cool pale blue-white `#aec4e0`. |
| **Moonlight intensity** | Low — roughly **20–25%** of afternoon. Enough to keep terrain and paths navigable. |
| **Ambient** | Low and cool. Sky term `#33465e`, ground bounce `#2a3527`. Deliberately dim, but never so dark the player cannot see where to walk. |
| **Colour temperature** | Coolest of the four, contrasted against warm practical lights. |
| **Shadows** | **Highest contrast, but softest edges.** Moon shadows are diffuse. Shadow opacity raised. |
| **Fog** | Dark blue-tinted, moderately dense. Pulls the horizon in and makes the world feel enclosed and intimate. |
| **Exposure** | Lowered. |
| **Stars** | A star field, faint and static. **ASSUMPTION —** implemented as a single points object or a sky texture, made visible only in this preset. This is the one exception to the "presets never change visibility" rule, and it is deliberate. Needs approval. |
| **Environment** | Grass reads deep blue-green. Flowers lose saturation except where lit. Rocks catch cool moonlight on their upper faces. |
| **Water** | Dark, with cool moon highlights. **ASSUMPTION —** a cheap reflection or specular highlight here is desirable but strictly optional and only if measured to be affordable. Needs approval. |
| **Destinations** | **The set-piece.** Warm emissive light at every station: |

### ✅ APPROVED — night local lighting (DD-22)

Night **may use small warm local light sources at important destinations.**

**Prefer:**
- non-shadow-casting local lights
- emissive materials where appropriate
- subtle warm illumination

**Avoid:**
- excessive glow
- neon
- expensive post-processing
- large numbers of shadow-casting lights

The intent is *cozy warmth in a dark world*, not a light show. If a destination reads as glowing rather than lit, the effect is too strong.

### Night emissive set

The complete, explicit list of things that light up. Nothing else does.

| Source | Colour | Status |
|---|---|---|
| **Projects — CRT screen** | Cool screen glow with warm `#F0932B` spill on the desk | Approved. Brightest small source; visible across the world. |
| **Experience — cabin interior** | Warm amber `#F0932B` | Approved. Spills from the open front. The largest warm mass. |
| **Education — desk lamp / lantern** | Warm candle-gold | **Approved (DD-22).** A lantern or candle prop is **added** to the Education set dressing; none exists in REF-EDUCATION. |
| **Achievements — dais lighting** | Warm gold uplight on the shrine | **Approved (DD-22).** A light source is **added**; none exists in REF-ACHIEVEMENTS. |
| **Path lanterns** | Warm gold | **STILL OPEN.** DD-22 covers lights *at destinations*; lanterns along the path are outside that scope. Not in any reference. Needs approval. |

**Implementation preference:** emissive materials and baked glow first. Real point lights only where genuinely required, and never more than a small handful (`CLAUDE.md` §32). **Shadow-casting is disabled on every local night light** — the single directional light remains the only shadow caster at all times of day.

---

## 9. Transition behaviour

- **Smooth but short.** Target **600–900 ms**, eased.
- Interpolate: sun/ambient colour and intensity, sky colour, fog colour and distances, exposure, emissive strength, shadow opacity, water tint.
- Interpolate the **sun direction vector** too — the light should visibly swing, not cut.
- The transition runs in the **frame loop**, not through React state. No component re-renders during it (`CLAUDE.md` §29).
- The player retains **full control throughout** — movement and interaction are never blocked by a transition.
- Starting a new transition mid-transition retargets from the current interpolated values. No queueing, no snapping.
- **`prefers-reduced-motion`:** shorten to a near-instant cross-fade (~150 ms). Never animate the sun sweeping across the sky (`CLAUDE.md` §41).

## 10. Central control

```
                    TimeOfDayController
                 (single source of truth)
                            │
        ┌───────────┬───────┴───────┬────────────┐
        ▼           ▼               ▼            ▼
      Sky /      Sun +          Fog +        Emissive
   Background   Ambient        Exposure      Materials
                                                 │
                                    ┌────────────┴────────────┐
                                    ▼                         ▼
                             Destination props            Water
```

Rules:

- **One controller.** It owns the current preset, the target preset, and the interpolation state.
- Consumers **read** from it. They never store their own copy of the current preset.
- Adding a new object that must respond to time of day means **registering it with the controller**, not writing a second lighting path.
- The preset definitions live in a **config module**, separated from the controller logic, so tuning values never requires touching behaviour code.

Full placement in the system architecture: [04_TECHNICAL_ARCHITECTURE.md](04_TECHNICAL_ARCHITECTURE.md).

## 11. UI control

Full visual treatment in [05_UI_DESIGN_BIBLE.md](05_UI_DESIGN_BIBLE.md). Behavioural requirements:

- Four discrete options: MORNING · AFTERNOON · EVENING · NIGHT. No slider, no continuous time, no auto-advance.
- Persistently accessible but **visually quiet** — a small in-world-feeling control at a screen corner. It must never compete with the world.
- Must read as **part of the game**: wooden/handcrafted, warm, matching the world's material language. Not a website widget, not a sun/moon toggle icon pair, not a segmented control from a UI kit.
- The current preset is clearly indicated.
- Touch targets of at least 44 px on mobile.
- Keyboard accessible: reachable by Tab, operable by Enter/Space or arrow keys.
- **ASSUMPTION —** the control collapses to a single icon that expands on tap/click on mobile, to preserve screen space. Needs approval.
- Hidden or dimmed while a portfolio window is open.

**ASSUMPTION —** no keyboard shortcut is assigned for cycling presets. `E` and `ESC` are reserved (`CLAUDE.md` §12) and adding more key bindings works against the "few mechanics" principle. Needs approval if a shortcut is wanted.

## 12. Performance rules

- Idle cost: **zero**. When no transition is running, this system does no per-frame work.
- Transition cost: a small fixed number of scalar and colour lerps. No allocation inside the loop — reuse pre-allocated colour/vector temporaries (`CLAUDE.md` §30).
- **No preset may increase the shadow-casting light count.** Night uses the same single directional light (as moonlight) plus a strictly limited set of non-shadow-casting local lights (DD-22).
- **No preset may enable post-processing.** The four moods must be achieved with lighting, colour, fog and exposure alone (`CLAUDE.md` §33).
- Night's local lights are the only place where light count grows. If measurement shows a cost, emissive-only fallback is the mobile quality tier.

## 13. Open assumptions requiring approval

| # | Assumption |
|---|---|
| B1 | Preset choice persists for the session only; no `localStorage` |
| B2 | MORNING preset values (no reference exists) |
| B3 | NIGHT preset values (no reference exists) |
| B4 | Moonlight direction chosen for coverage, not drama |
| B5 | Star field as a visibility-toggled object — the one exception to the no-visibility-change rule |
| B6 | Night water reflection/specular is optional and perf-gated |
| B7 | ~~Lantern/lamp prop added to Education~~ → **APPROVED (DD-22)** |
| B8 | ~~Light source added to Achievements~~ → **APPROVED (DD-22)** |
| B9 | **Path lanterns for night navigation — still open.** DD-22 approves lights at destinations only. |
| B10 | Time-of-day control collapses to a single icon on mobile |
| B11 | No keyboard shortcut for switching presets |
| B12 | ~~Which milestone owns this system~~ → **RESOLVED (DD-25): Milestone 4 — "World + Time of Day"** |
