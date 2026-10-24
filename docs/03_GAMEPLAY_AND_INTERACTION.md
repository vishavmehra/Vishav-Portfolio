# 03 — GAMEPLAY AND INTERACTION

> **Status:** Specification, not yet implemented (Milestones 2, 3, 5)
> **Authority:** `CLAUDE.md` §11–§17 and the approved character sheet REF-CHARACTER.
> **Last updated:** 2026-08-29
> **Related:** [01_WORLD_DESIGN_BIBLE.md](01_WORLD_DESIGN_BIBLE.md) · [04_TECHNICAL_ARCHITECTURE.md](04_TECHNICAL_ARCHITECTURE.md) · [05_UI_DESIGN_BIBLE.md](05_UI_DESIGN_BIBLE.md)

---

## 1. The gameplay loop

```
SPAWN
  ↓
EXPLORE
  ↓
DISCOVER DESTINATION
  ↓
APPROACH INTERACTABLE
  ↓
INTERACTION PROMPT APPEARS
  ↓
E  /  MOBILE INTERACT BUTTON
  ↓
SMALL CONTEXTUAL WINDOW
  ↓
EXPAND
  ↓
EXPLORE PORTFOLIO INFORMATION
  ↓
CLOSE
  ↓
RETURN TO WORLD (same position, same state)
```

The loop is the entire game. It repeats four times, once per destination, in any order the visitor chooses.

## 2. What does not exist

Deliberately absent, permanently:

combat · enemies · health · damage · inventory · items · XP · levels · quests · objectives · skill trees · crafting · NPCs · dialogue trees · saves · scores · timers · fail states · jumping puzzles · vehicles · fast travel

If a feature request implies any of the above, it is out of scope by default.

---

# PLAYER

## 3. Character

**Explorer Unit 7-B** — the canonical character (REF-CHARACTER, DD-24).

> The brass/copper robot shown in the master scene reference is **obsolete** and must not be used as the player design.

- Small stylized explorer robot. Rounded cream helmet with a single warm-amber visor slot. Olive tunic, leather chest strap with a brass compass, belt pouches, chunky boots, expedition backpack with bedroll and coiled rope.
- **No facial features.** Gender-neutral. Reads by silhouette and by the amber visor.
- The character is the **visitor's avatar**, not a depiction of Vishav (`CLAUDE.md` §11).

**Scale: ~1.4 units tall** — approved initial target (DD-20). Stocky proportions, roughly 2.5–3 heads. Subject to adjustment after playtesting.

## 4. Movement

Movement must feel **smooth, immediate and calm**. Not floaty, not twitchy, not weighty.

| Property | Target | Notes |
|---|---|---|
| Walk speed | **~4 units/s** | **Approved initial target (DD-20)** — adjustable after playtesting |
| Acceleration | ~0.12–0.18 s to full speed | Short ramp; input feels responsive but not instant-snap |
| Deceleration | ~0.10–0.15 s to rest | Slightly faster than acceleration; stopping feels controlled |
| Turn rate | ~10–14 rad/s toward movement direction | Character rotates to face travel; never strafes |
| Input model | Normalised 2D vector, magnitude clamped to 1 | Diagonals are not faster |

Movement is **camera-relative**: "forward" means "away from the camera", regardless of which way the character faces.

Analogue input (joystick) preserves magnitude — a small joystick deflection produces a slow walk. Keyboard input is always magnitude 1.

**ASSUMPTION —** a single walk speed with no run/sprint. The world is small enough that a sprint would shrink it further. Needs approval.

## 5. Animation states

Two states only, for the initial build:

- **Idle** — subtle. Gentle vertical bob, occasional small head turn. The character is never perfectly still, never busy.
- **Walking** — simple cycle, feet planted, no exaggerated bounce.

Blending between them is a short cross-fade driven by current speed.

**ASSUMPTION —** the character will be authored as a simple rigged GLB with two clips. No IK, no procedural foot placement, no facial rig (there is no face). Needs approval.

## 6. Collision

Simple, cheap, and forgiving. The goal is "the player cannot walk through the desk", not physical simulation.

- **Player collider:** a vertical capsule or a 2D circle in the XZ plane. **ASSUMPTION —** radius ~0.35 units.
- **World colliders:** hand-placed primitive volumes (circles/boxes) around tree trunks, structures, desks, boulders and the shrine. **Not** mesh-accurate.
- **Terrain:** the player follows the ground height. Elevation never blocks movement.
- **World bounds:** a soft boundary that stops the player at the edge of the playable area. It must not feel like an invisible wall in open ground — the boundary should coincide with terrain, water, rock lines or dense vegetation so it reads as natural.
- **No physics engine.** Rapier is introduced only if collision requirements genuinely outgrow this, per `CLAUDE.md` §36. They should not.

Collision response is "slide along the surface", never "stop dead".

---

# CAMERA

## 7. Third-person follow camera

Framing target: REF-MASTER, which is composed from behind and slightly above the character.

| Property | Target | Notes |
|---|---|---|
| Distance behind player | ~7–9 units | **ASSUMPTION** |
| Height above player | ~3.5–4.5 units | **ASSUMPTION** |
| Look-at point | Player position + ~1.0 unit vertical offset | Frames the character in the lower third, world above |
| Field of view | 45–50° | Matches the reference's compressed, composed feel |
| Follow smoothing | Critically damped, ~0.15–0.25 s | Trails the player slightly; never rubber-bands or overshoots |
| Rotation | Fixed yaw by default | See §8 |

The camera should feel like a **considered composition that follows**, not a rig bolted to the character's back. Slight lag on movement is desirable — it makes the world feel like a place rather than a treadmill.

## 8. Camera rotation — ✅ APPROVED (DD-21)

**Fixed camera yaw. No player-controlled camera rotation in the first version.**

Reasoning:
- The world is composed. A fixed angle guarantees every destination reads from its intended approach (see [01](01_WORLD_DESIGN_BIBLE.md) §13).
- Removes an entire input surface from mobile, where camera control is the least comfortable interaction.
- Keeps controls at the minimum the experience needs.

The camera must still deliver **proper follow behaviour and correct framing on both desktop and mobile** — fixed yaw is not an excuse for a static or poorly framed camera.

**Known risk:** fixed yaw can hide objects behind trees or structures. Mitigations are in §9. **If playtesting shows significant occlusion problems, record it as an item for later review** — do not solve it by quietly adding free rotation.

If free rotation is ever approved, it must have a mobile equivalent (drag-to-orbit) and must not become a second thing to learn.

## 9. Camera collision

Minimal treatment. When something large comes between camera and player:

- Ease the camera **closer to the player** along its existing vector (dolly in), rather than swinging around.
- **ASSUMPTION —** alternatively, fade or dither the occluding object. Preferred where the occluder is a tree canopy. Needs approval.
- Never snap. Never rotate to solve occlusion.

## 10. Mobile framing

Mobile is not the desktop camera scaled down (`CLAUDE.md` §40).

- Portrait viewports lose horizontal coverage at a fixed vertical FOV. The camera must compensate — **ASSUMPTION —** by increasing distance and/or FOV as aspect ratio narrows, clamped so the world never distorts. Needs approval.
- The character must remain clearly visible above the joystick and interact button; those controls must not sit on top of the avatar.
- **This is a live issue from Milestone 1:** the current static camera crops all four placeholder markers on a portrait viewport. The follow camera built in Milestone 2 must solve it.

---

# CONTROLS

## 11. Desktop

| Input | Action |
|---|---|
| `W` / `↑` | Move forward (away from camera) |
| `A` / `←` | Move left |
| `S` / `↓` | Move backward (toward camera) |
| `D` / `→` | Move right |
| `E` | Interact — with the nearest valid interactable; also confirms/expands inside a window |
| `ESC` | Close the active interface; step back one level if a window is expanded |

Rules:
- Both WASD and arrow keys are always active. Neither is a "secondary" scheme.
- Key state is tracked, not key repeat — holding produces continuous movement.
- Keys are released correctly on window blur, so the player never keeps walking after tabbing away.
- No mouse input is required for movement or interaction. **ASSUMPTION —** windows may still be operated by mouse where natural (clicking a button, scrolling); nothing depends on it.

## 12. Mobile

| Control | Behaviour |
|---|---|
| **Virtual joystick** | Bottom-left. Analogue — deflection controls speed. Fixed position by default. **ASSUMPTION —** it may be authored as "appears where the thumb lands" within a zone; needs approval. |
| **INTERACT button** | Bottom-right. **Contextual** — appears only when an interactable is in range, fades out when not. Minimum 56 px target. |
| **Swipe** | Carousel navigation inside windows only. Never used for world navigation or camera. |
| **Close button** | Always visible on any open window. Minimum 44 px. Never a hidden gesture. |

Rules:
- Controls sit within comfortable thumb reach and inside safe areas (notch, home indicator).
- Controls are hidden while a window is open — the window has its own controls.
- Nothing essential requires hover, long-press, multi-touch, or a gesture the visitor must discover (`CLAUDE.md` §13, §41).

## 13. Shared input — the hard rule

```
Keyboard ──┐
           ├──► normalised { x, y } vector ──► PlayerController ──► Player
Touch ─────┘
```

Both input sources produce the **same normalised movement representation**. `PlayerController` has no knowledge of which device produced it. There is exactly one movement implementation (`CLAUDE.md` §12).

Two independent movement systems is an explicit architecture failure.

**Combination rule (implemented in M3):** the two source vectors are **summed, then the resulting magnitude is clamped to 1**. Using both at once blends the directions and can never exceed walk speed; opposing inputs cancel, exactly as pressing `A` and `D` together does. Neither source overrides the other.

---

# INTERACTION

## 14. Generic interactable system

One system serves all destinations. The player knows only *"I am near something interactable"* — never what it represents (`CLAUDE.md` §14).

An interactable declares:

```
id
position
interactionDistance
prompt          // e.g. "Examine workstation"
onInteract      // callback — opens a window with a content key
```

Mapping is data, not logic:

| Object | Opens |
|---|---|
| CRT monitor | Projects |
| Workbench | Experience |
| Open book / study desk | Education |
| Shrine | Achievements |

Adding a fifth destination later means adding a fifth interactable record. It must require **zero** changes to the player, the camera, or the interaction system.

## 15. Proximity detection and priority

- **Distance check only.** No raycasts, no physics triggers, no pathfinding (`CLAUDE.md` §10, §15).
- Squared-distance comparison against each interactable's `interactionDistance`. With four to eight interactables this is trivially cheap.
- **ASSUMPTION —** the check runs on a throttled interval (every 3–5 frames) rather than every frame. Needs approval, though it is unlikely to matter at this scale.
- **Priority: nearest valid candidate wins.** No other weighting.
- Result is exposed as a single "active interactable" value. Only when that value *changes* does React learn about it — never per frame (`CLAUDE.md` §29).

**ASSUMPTION —** default `interactionDistance` of ~3 units, tuned per object so larger destinations (the shrine, the workshop) have a slightly wider radius. Needs approval.

Hysteresis: the exit radius is slightly larger than the entry radius, so the prompt does not flicker when the player stands on the boundary.

## 16. Interaction prompt

- Appears when an interactable becomes active; disappears when it does not.
- Shows the interactable's own `prompt` text plus the input affordance — `E` on desktop, nothing extra on mobile (the button *is* the affordance).
- **ASSUMPTION —** the prompt is screen-space UI anchored near the object's projected position, not a world-space 3D label. This keeps text crisp and avoids 3D text entirely (`CLAUDE.md` §38). Needs approval.
- Small, quiet, warm. Not a giant floating banner. Full treatment in [05_UI_DESIGN_BIBLE.md](05_UI_DESIGN_BIBLE.md).

## 17. Interaction flow

```
in range  →  prompt appears
   ↓  E / tap INTERACT
small contextual window opens        ← player movement locked
   ↓  E / tap [ VIEW PROJECT ]
window expands to full content
   ↓  ESC / close button
back to small window                 ← ASSUMPTION, see below
   ↓  ESC / close button
window closes, control returns, prompt still showing
```

**ASSUMPTION —** `ESC` from the expanded state returns to the small window rather than closing outright. One `ESC` per level. Needs approval — closing straight to the world is the alternative.

**Movement is locked while any window is open.** The character stands still; the world keeps rendering behind the panel.

## 18. Returning to the world

- Player position, camera position, and time-of-day preset are **exactly as they were**. Nothing resets.
- The world was never unloaded and is never reloaded.
- Control returns immediately. No transition the player has to wait through.
- If the player is still in range, the interaction prompt reappears — they can immediately re-open it.

---

# NAVIGATION

## 19. The environment does the work

In priority order (`CLAUDE.md` §10):

1. **Paths** — the primary system. Every destination is on or beside a path. Following any path leads somewhere.
2. **Landmarks** — hero trees, the workshop roofline, the shrine silhouette, the spawn bridge. Each destination has a distinct distance-read (see [01](01_WORLD_DESIGN_BIBLE.md) §15–§18).
3. **Terrain and sightlines** — elevation and framing put destinations in view at the right moments.
4. **Physical signs / trail markers** — small wooden markers at path forks. World objects, at world scale, in world material. **ASSUMPTION —** exact wording and placement not yet specified; needs approval.
5. **Temporary onboarding** — a brief hint at spawn (§20).
6. **Directional indicators** — last resort, conditional (§21).

If the visitor gets lost, the failure is in the world composition, not in the absence of UI.

## 20. Onboarding

At spawn, briefly:

```
WASD / ARROWS
TO EXPLORE
```

- Mobile shows the touch equivalent instead.
- Fades once the player begins moving, or after a short timeout.
- Shown once per session. Never returns.
- No tutorial sequence, no forced camera pan, no gated first step.

## 21. Directional indicators

Conditional and quiet.

- Shown **only when useful** — that is, when a destination is undiscovered *and* off-screen.
- **Not shown** when the destination is already visible in frame (`CLAUDE.md` §10).
- Never a permanent HUD of four arrows.
- Computed with simple vector maths — direction from player to destination, projected to screen edge. **No pathfinding, ever.**

**ASSUMPTION —** indicators appear only after a period of apparent aimlessness (e.g. the player has been moving without approaching any destination for some time), rather than by default. Needs approval — the alternative is showing them for undiscovered destinations from the start.

## 22. Destination discovery

- A destination becomes "discovered" the first time the player interacts with it. **ASSUMPTION —** approaching without interacting does not count. Needs approval.
- Discovery affects only navigation guidance (a discovered destination no longer gets an indicator).
- **No progress bar, no completion percentage, no checklist, no reward.** Discovery is not a game mechanic and must never be surfaced as one.
- Nothing is gated. All four destinations are reachable from the first second, in any order.

## 23. Accessibility

Per `CLAUDE.md` §41:

- Every essential action has a keyboard route and a touch route.
- Nothing essential depends on hover, colour alone, tiny text, or hidden gestures.
- Windows are keyboard navigable with visible focus; close controls are always visible.
- `prefers-reduced-motion` reduces or removes non-essential animation — window transitions shorten, idle bob and camera easing are reduced — while all functionality remains.

**ASSUMPTION —** no alternative non-spatial navigation (a menu that jumps to a section without walking) is planned. This is a real accessibility consideration for visitors who cannot comfortably use spatial controls, and it needs a decision. Needs approval.

## 23b. Implementation status (M2 + M3)

Limitations of the current build, not design changes.

| Item | Status |
|---|---|
| **Player mesh** | **Temporary gameplay proxy.** Explorer Unit 7-B is built from primitives matching the reference silhouette, proportions and palette. There is no GLB asset yet. It is purely visual, so replacing it needs no change to `PlayerController` or `FollowCamera`. |
| **Animation** | **None.** No idle bob, no walk cycle — the proxy has no rig. §5's two-state spec is unimplemented and waits on the real asset. |
| **Camera collision / occlusion** | **Implemented; docs/09 F4 closed 2026-09-18.** Structures *and* the whole tree layer are registered occluders. Two parallel rays — from the orbit centre and from chest height — dolly the camera in, and it never ends up past the surface it hit. Re-walked around the cabin: 80/80 samples keep the player visible with the camera outside all geometry ([09](09_M4_WORLD_PLAN.md) §23d). **Fade-the-occluder (§9, docs/09 P11) is still not implemented** — dolly-in covers the failure case, so fade is polish. Hugging a wide trunk and orbiting into it pulls the camera very close. The row below records what this replaced. |
| **Camera collision — previous status** | **Superseded 2026-09-18.** Kept for history: **Partially implemented — status corrected 2026-08-31.** This row previously read "Not implemented", which is stale. `FollowCamera` now casts a ray from the look-at point toward the desired camera position and, on a hit, **dollies in** along the same vector (floor 2.4 units, 0.55 stand-off). Yaw is never touched, so DD-21 holds. **What is *not* implemented:** the preferred **fade-the-occluder** treatment (§9, docs/09 P11 — dolly-in is the documented *fallback*); and only the Experience and Achievements structures are registered as occluders — **tree canopies are not**, so docs/09 F3/F6 canopy occlusion is unhandled. **docs/09 F4 is therefore not closed** — see docs/09 §23c. |
| **Frame-time clamp** | Movement integrates at most **0.1 s per frame**, so a hidden tab or a device dropping below 10 FPS moves the player slower than wall-clock rather than teleporting on return. Deliberate; it only engages below 10 FPS. |
| **Mobile framing** | **Solved in M3.** The camera offset is scaled by a clamped factor derived from viewport aspect (see §10 and `docs/04` §11a), so narrow screens pull back and gain world context. Desktop framing at 1.6 aspect is byte-for-byte unchanged. |
| **Virtual joystick** | **Implemented (M3).** Bottom-left, fixed base, pointer events, analogue. Shown when the device reports a coarse primary pointer, or after a genuine touch is seen. |
| **Interact button** | **Implemented (M5).** Bottom-right, contextual, 56 px. It activates on **pointer release over the button**, not on a synthesised `click`: mobile Chromium sends no click for a tap made while another finger is already down, so a thumb on the joystick or dragging the camera would otherwise swallow it. Keyboard and assistive-technology activation (`click` with `detail === 0`) still works, and pointer-generated clicks are ignored so nothing fires twice. |
| **Multi-touch** | **Verified in emulation, not on a real device.** Joystick + interact, camera look + interact, joystick + camera look, and all three at once each fire exactly one interaction with the other fingers still down; the joystick keeps driving movement through the tap, and interacting ends the camera look. Measured in Chromium touch emulation at 390 × 844 and 320 × 568 — **no physical phone or iOS/Safari testing exists** (§24 C18). |
| **Input while loading** | **Implemented.** A single input gate is closed until the world is revealed: movement, camera look and interaction all ignore input from keyboard and touch, and the loading screen swallows drags so nothing scrolls. Sources keep tracking physical state, so a key still held when the gate opens moves the player immediately (measured 69 ms). The same gate is what a window will use to lock movement in M6 (§17). |
| **Joystick placement rule** | Fixed base position, not thumb-placed (§12 C9 remains an open assumption; the fixed base is what shipped). |

## 24. Open assumptions requiring approval

| # | Assumption |
|---|---|
| C1 | ~~Player height 1.4 units~~ → **APPROVED (DD-20)**, with walk speed ~4 u/s |
| C2 | Single walk speed, no sprint |
| C3 | Character is a rigged GLB with idle + walk clips only |
| C4 | Player collider radius ~0.35 units; hand-placed primitive world colliders |
| C5 | Camera distance/height/FOV figures |
| C6 | ~~Fixed camera yaw~~ → ~~APPROVED (DD-21)~~ → **SUPERSEDED by DD-28.** Player-controlled orbit camera, right mouse button on desktop and a right-side drag on touch. |
| C7 | Camera occlusion solved by dolly-in and/or fading the occluder |
| C8 | Mobile camera compensates for narrow aspect by distance/FOV adjustment |
| C9 | Mobile joystick is fixed-position (vs. thumb-placed) |
| C10 | Proximity check throttled rather than per-frame |
| C11 | Default interaction distance ~3 units, tuned per object |
| C12 | Interaction prompt is screen-space, not world-space 3D |
| C13 | `ESC` steps back one level (expanded → small → closed) |
| C14 | Trail marker wording and placement unspecified |
| C15 | ~~Directional indicators appear only after apparent aimlessness~~ → **SUPERSEDED by DD-29.** A quiet compass is always present; it only becomes prominent when the destination is out of view or the visitor is walking away from it. |
| C16 | Discovery requires interaction, not proximity — **still unapproved, and nothing tracks it.** The compass therefore guides to the nearest destination whether or not it has been visited (DD-29) |
| C17 | **No non-spatial fallback navigation for accessibility** |
| C18 | **Touch behaviour is verified only in Chromium emulation.** Multi-touch interaction, the joystick, camera-look drags and the compass layout have had no real-device or iOS/Safari testing |
