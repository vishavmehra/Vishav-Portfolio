# 04 — TECHNICAL ARCHITECTURE

> **Status:** Intended architecture. **Documentation only — none of this is implemented beyond Milestone 1.**
> **Authority:** `CLAUDE.md` §20, §29–§31, §35–§37. Compatible with the existing Milestone 1 foundation.
> **Last updated:** 2026-08-29
> **Related:** [03_GAMEPLAY_AND_INTERACTION.md](03_GAMEPLAY_AND_INTERACTION.md) · [06_CONTENT_SYSTEM.md](06_CONTENT_SYSTEM.md) · [07_PERFORMANCE_BIBLE.md](07_PERFORMANCE_BIBLE.md)

---

## 1. Technology baseline

| Layer | Choice | Status |
|---|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) | Installed |
| Language | **TypeScript** (strict) | Installed |
| UI runtime | **React 19** | Installed |
| 3D | **Three.js** | Installed |
| React↔Three bridge | **React Three Fiber 9** | Installed |
| Styling | **Tailwind CSS v4** | Installed |
| Helpers | **Drei** | **Not installed.** Add only when a specific helper is genuinely needed (loaders, instancing utilities, performance monitors). Not as a blanket dependency. |
| Physics | **Rapier** | **Not installed, not planned.** Only if collision genuinely outgrows primitive volumes — it should not. |
| Animation | CSS transitions for UI; frame-loop interpolation for 3D. **GSAP only** if a complex coordinated UI transition justifies it. Never for player movement. | Not installed |
| Audio | **Deferred (DD-27).** No audio architecture, no audio dependencies, no `AudioListener`, no sound assets during the gameplay and world milestones (M2–M8) unless explicitly requested. | Not installed, not planned |

Before adding any dependency: *can the existing stack solve this cleanly?* If yes, do that (`CLAUDE.md` §36).

## 2. Current state (Milestone 1)

What exists today, which the architecture below must extend rather than replace:

```
src/
  app/
    layout.tsx        root layout, metadata, viewport
    page.tsx          server component → mounts <GameCanvas />
    globals.css       Tailwind import + no-scroll body, touch-action on canvas
    icon.svg
  game/
    GameCanvas.tsx    'use client' — <Canvas>, camera, lights, placeholder world
```

- Path alias `@/*` → `src/*`.
- `page.tsx` is a **server component**; `GameCanvas.tsx` is the client boundary. R3F's `Canvas` survives SSR, so no `dynamic({ ssr: false })` wrapper is needed — the page prerenders static.
- The placeholder world (ground disc, spawn pad, four boxes) is **throwaway**. Milestone 4 replaces it entirely.

## 3. Directory structure

Target layout. Directories are created when they are first genuinely needed, not scaffolded ahead of time (`CLAUDE.md` §35).

```
src/
  app/                  Next.js routing, layout, global CSS
  game/                 everything inside the R3F canvas
    GameCanvas.tsx      canvas root, renderer config
    world/              terrain, paths, water, vegetation, props, destinations
    player/             character, controller, movement, animation
    camera/             follow camera
    interaction/        interactable registry, proximity detection
    time/               TimeOfDayController + preset config
    loading/            asset loading and progress reporting
  ui/                   everything outside the canvas (DOM/React)
    loading/            loading screen
    hud/                prompt, onboarding, directional indicators, ToD control
    window/             generic window shell, expansion, scrolling
    sections/           Projects / Experience / Education / Achievements renderers
    controls/           mobile joystick, interact button
  input/                keyboard + touch → shared normalised input
  data/                 portfolio content
    projects/
    experience/
    education/
    achievements/
  types/                shared TypeScript types
  config/               tuning constants (world scale, camera, movement, presets)
```

**The rule that matters:** `game/` never imports from `data/`. Content flows to `ui/`, never into the scene graph (`CLAUDE.md` §20).

## 4. System boundaries

| System | Owns | Must not |
|---|---|---|
| **Game** | Canvas, renderer settings, frame loop, scene composition | Know about portfolio content |
| **UI** | Loading screen, HUD, windows, content rendering, mobile controls | Drive the frame loop or hold 3D transforms |
| **Input** | Keyboard listeners, touch/joystick, normalisation | Know about the player, camera, or game rules |
| **Player** | Character transform, movement integration, animation state, collision response | Contain object-specific interaction logic |
| **Camera** | Camera transform, follow smoothing, occlusion, aspect compensation | Be driven by React state |
| **Interaction** | Interactable registry, proximity, priority, active-interactable signal | Know what a destination *means* |
| **World** | Terrain, props, vegetation, destination set dressing, colliders | Contain content strings |
| **Time of Day** | Preset state, interpolation, application to lights/sky/fog/exposure/emissives | Rebuild or reload anything |
| **Content** | Typed portfolio data, loading of detail payloads | Import anything from `game/` |
| **Asset Loading** | Progressive loading, progress reporting, lazy detail assets | Block the world on non-essential assets |

## 5. React-driven vs frame-loop-driven

The single most important architectural rule (`CLAUDE.md` §29):

> **Never use React state for values that change every frame.**
> `setState(playerPosition)` every frame is an explicit failure.

### Frame-loop / imperative — inside `useFrame`, written to refs and Three.js objects

- Player position, velocity, rotation
- Camera position and look-at
- Animation mixer / blend weights
- Time-of-day interpolation while a transition is running
- Proximity distance calculations
- Water surface animation, any ambient motion

These values live in `useRef` and on Three.js object transforms. They never enter React state. They never trigger a render.

### React state — discrete, event-driven, low-frequency

- Loading complete / progress bucket
- Active interactable **id** (changes on enter/exit, not per frame)
- Which window is open, and whether it is expanded
- Selected project index in the carousel
- Current time-of-day preset **name** (the target, not the interpolated values)
- Onboarding hint visible
- Viewport class (mobile / desktop)

### The boundary

The frame loop **may** call a React setter, but only when a discrete value genuinely changes:

```
useFrame:  compute nearest interactable
           if (nearestId !== lastNearestIdRef.current) {
             lastNearestIdRef.current = nearestId
             setActiveInteractable(nearestId)      // ← at most a few times per session
           }
```

That is the pattern for every frame-loop → React transition. A ref holds the last value; React is told only about changes.

Similarly, React → frame loop is one-directional and cheap: React sets a target (e.g. `timeOfDay = 'evening'`), the frame loop reads it and interpolates toward it.

## 6. Input architecture

```
   KeyboardInput ──┐
                   ├──►  Shared Input  ──►  PlayerController  ──►  Player transform
   TouchInput ─────┘     { x, y } ∈ [-1,1]      (frame loop)         (Three.js object)
                         magnitude ≤ 1
```

- Both sources write into **one mutable module-level input object**. No React state, no events per frame.
- Each source keeps its own vector; the shared vector is the **sum of the sources with its magnitude clamped to 1**. Blending is therefore predictable, opposing inputs cancel, and combined input can never exceed walk speed.
- Keyboard writes discrete ±1 values; touch writes analogue values. Both are clamped to magnitude ≤ 1 so diagonals are not faster.
- The joystick lives in the UI layer (`src/ui/controls/`) and only calls `setTouchInput` / `clearTouchInput`. It contains no movement logic, and `PlayerController` never imports it.
- `PlayerController` reads that object each frame. It cannot tell which device produced the values, and must never be able to.
- Listeners are registered once and cleaned up on unmount. Key state clears on window blur.

**There is exactly one movement implementation** (`CLAUDE.md` §12). Two parallel systems is an architecture failure, not an optimisation.

## 7. Interaction architecture

```
   Player position (ref, per frame)
            │
            ▼
   Interaction System  ──  reads Interactable registry
            │              (id, position, distance, prompt, onInteract)
            │
            │  nearest valid candidate; nearest wins
            ▼
   activeInteractableId  ──── changes only ────►  React state
            │
            ▼
        UI: prompt  ──  E / tap  ──►  onInteract()  ──►  window opens with a content key
```

- Registry is a plain array or map, registered at world build time.
- Distance check only — squared distance, no raycasts, no physics (`CLAUDE.md` §15).
- The interactable carries a **content key** (`'projects'`, `'experience'`, …), not content. The UI resolves the key against `data/`.
- The player and interaction system never import from `data/` and never contain a project name.

Adding a destination = adding one registry entry + one content file. No engine changes.

## 8. Time of Day architecture

```
                React state: timeOfDay = 'evening'   (target only)
                                 │
                                 ▼
                      TimeOfDayController
                (frame loop — interpolates current → target)
                                 │
        ┌────────────┬───────────┼────────────┬──────────────┐
        ▼            ▼           ▼            ▼              ▼
   Sky colour   Sun light   Ambient     Fog + exposure   Emissive
   /background  (colour,    /hemisphere                  materials
                intensity,                               (registered set)
                direction)
```

- Preset **definitions** live in `config/` as plain data. Tuning values never requires touching behaviour code.
- The controller owns current values, target values, and transition progress. Everything else **reads**; nothing keeps a private copy.
- Interpolation happens in the frame loop, mutating Three.js light/fog/material properties directly — **no React renders during a transition**.
- Objects that must respond (a monitor screen, the workshop interior light) **register** with the controller. Adding one must never mean writing a second lighting path.
- Zero per-frame cost when idle. Pre-allocated colour/vector temporaries during transitions (`CLAUDE.md` §30).

Full behaviour spec: [02_TIME_OF_DAY.md](02_TIME_OF_DAY.md). **Built in Milestone 4, alongside the world** (DD-25) — the preset system and the environment it drives land together.

## 9. Content architecture

```
   data/projects/*.ts        typed, optional-field content
   data/experience/*.ts
   data/education/*.ts
   data/achievements/*.ts
            │
            ▼
   types/  ── schema definitions with optional fields
            │
            ▼
   ui/sections/  ── section renderers; skip anything undefined
            │
            ▼
   ui/window/    ── generic window shell (open, expand, scroll, close)
```

Hard rules:

- **`game/` never imports `data/`.** Not once. A grep for a project name inside `src/game/` must return nothing.
- The window shell is generic — it knows about opening, expanding, scrolling and closing, and nothing about projects (`CLAUDE.md` §16).
- Section renderers are driven by the presence of data. A missing field renders nothing at all — no empty card, no "N/A" (`CLAUDE.md` §19).

Full spec: [06_CONTENT_SYSTEM.md](06_CONTENT_SYSTEM.md).

## 10. Asset loading

```
   INITIAL LOAD  ──  only what is needed to enter the world
                     terrain, character, destination props, core materials
                            │
                            ▼
                     progress → loading screen (real progress, never faked)
                            │
                            ▼
                     world visible, player in control
                            │
   ON DEMAND  ─────────────►│  project screenshots, architecture diagrams,
                            │  detail imagery — fetched when a window opens
```

- Nothing in `data/` detail payloads is fetched during initial load (`CLAUDE.md` §34).
- Progress reporting reflects actual asset loading. If it finishes fast, the transition happens immediately — never padded (`CLAUDE.md` §5).
- Image loading failures degrade gracefully: the image is omitted, the rest of the window stays usable (`CLAUDE.md` §42).

## 11. Rendering configuration

Established in Milestone 1 and carried forward:

- `dpr={[1, 2]}` — caps device pixel ratio cost on retina/mobile.
- `shadows={{ type: PCFShadowMap }}` — set explicitly; Three r185 deprecated R3F's `PCFSoftShadowMap` default.
- Single shadow-casting directional light with a tight orthographic frustum.
- Fog matched to the sky colour.
- `<Canvas>` fills a `fixed inset-0` main element; `globals.css` disables body scroll, overscroll and canvas touch actions.

### 11a. Responsive camera framing (M3)

One camera system with responsive configuration — not a separate mobile camera.

A fixed vertical field of view loses horizontal coverage as the viewport narrows, so a phone in portrait sees the player and almost no world. The fix is to scale the **whole camera offset vector** by a factor derived from viewport aspect: the camera pulls back along its existing vector, so the viewing angle and composition are preserved exactly and only the amount of world in frame changes.

- `cameraOffsetScale(aspect)` lives in `game/config.ts` with the rest of the camera constants. No mobile-specific values are scattered through components.
- At or above the reference aspect (1.6) the scale is exactly **1**, so desktop framing is unchanged — verified byte-for-byte against the M2 baseline screenshot.
- Below it, the scale is `sqrt(reference / aspect)` clamped to **1.45**, keeping the pull-back gentle and bounded.
- Evaluated inside `useFrame` from the frame state, so a resize causes no React render.
- Yaw stays fixed (DD-21). This changes distance only, never rotation.

**ASSUMPTION —** the frame loop stays on R3F's default `always`. Switching to `demand` is not viable once the world has continuous motion (water, idle animation), but it may be worth evaluating for the paused state while a window is open. Needs approval.

## 12. Error handling

Per `CLAUDE.md` §42 — optional content must never take down the experience:

- An image that fails to load is omitted; the window reflows.
- A missing optional field renders nothing.
- A failed non-essential asset does not block entry to the world.
- An error boundary around the UI layer prevents a content-rendering fault from killing the canvas.

**WebGL unavailable — deferred to deployment (DD-26).** A fallback for browsers or devices without working WebGL is a **Milestone 12 (Deployment) requirement**. It is deliberately not designed or implemented during the gameplay and world milestones. The form it takes (a static message, or a minimal non-3D content view) is settled at that point.

## 13. What must not happen

- ❌ React state driving any per-frame value
- ❌ Two movement implementations
- ❌ Project content inside `src/game/`
- ❌ The interaction system knowing what a destination represents
- ❌ Time of Day rebuilding, reloading, or re-instantiating anything
- ❌ Allocation inside `useFrame` (new Vector3, new Color, new arrays) (`CLAUDE.md` §30)
- ❌ Dependencies added for convenience rather than need
- ❌ **Audio architecture, audio dependencies or sound assets before they are requested** (DD-27)
- ❌ Abstraction layers built for hypothetical future requirements (`CLAUDE.md` §35)
- ❌ Managers, factories, or dependency-injection scaffolding for a world with four destinations

## 14. Open assumptions requiring approval

| # | Assumption |
|---|---|
| D1 | Frame loop stays `always`; possible `demand` evaluation while a window is open |
| D2 | ~~No WebGL-unavailable fallback specified~~ → **RESOLVED (DD-26): deployment-stage requirement, Milestone 12. Not built now.** |
| D3 | Directories created on first genuine need rather than scaffolded up front |
