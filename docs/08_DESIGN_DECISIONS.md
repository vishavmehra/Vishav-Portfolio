# 08 — DESIGN DECISIONS

> **Status:** Initial approved decision record
> **Purpose:** The durable list of product decisions that are settled. Anything not on this list is not decided.
> **Last updated:** 2026-09-25 (DD-47 — the crossing to the portfolio waits for the arriving world)

**Status values:** `Approved` — settled, build against it · `Superseded` — replaced by a later decision · `Open` — not decided (open items are recorded in §2, deliberately *not* as decisions)

---

## 1. Approved decisions

### DD-01 — The portfolio is a playable 3D exploration game

**Decision.** The portfolio is delivered as a small playable 3D exploration game. It is not a website with 3D decoration.

**Reason.** The format itself is the differentiator. A conventional portfolio cannot be distinguished from thousands of others; a world the visitor walks through is remembered. The presentation demonstrates engineering capability directly rather than describing it.

**Status.** Approved.

---

### DD-02 — The 3D world is the primary navigation mechanism

**Decision.** Navigation happens by moving a character through the world. There is no nav bar, no scroll-driven section reveal, no menu of portfolio sections.

**Reason.** If a menu existed, nobody would walk. The world would become decoration and DD-01 would collapse. Traversal is what makes discovery meaningful.

**Status.** Approved.

---

### DD-03 — The world is real 3D geometry, not a 2D background

**Decision.** The environment is actual Three.js geometry — terrain, props, structures. Reference images are never used as backdrop planes, skyboxes, or textures.

**Reason.** A 2D backdrop cannot be explored, cannot be lit by the time-of-day system, and cannot support traversal or interaction. It would reduce the product to a parallax website.

**Status.** Approved.

---

### DD-04 — Gemini concept art is the current visual reference authority

**Decision.** The files in `design/references/` are the visual source of truth. They are not replaced, reinterpreted into a different art direction, or supplemented with alternative references. Where a reference is silent, the gap is recorded as an assumption requiring approval — never filled by invention.

**Reason.** A single consistent visual authority prevents drift across milestones and across sessions. Assumptions are made explicit so the designer decides, not the implementer.

**Note.** One element of the master reference is explicitly overridden — see DD-06 and §2.1.

**Status.** Approved.

---

### DD-05 — Four primary destinations

**Decision.** The initial world contains exactly four destinations: **Projects · Experience · Education · Achievements**. Skills, Contact, About and Experiments are possible later and are not built until requested.

**Reason.** Four fits a small world without long empty walks, covers the substance of the portfolio, and keeps scope controlled. Additional destinations dilute the composition and lengthen traversal.

**Status.** Approved.

---

### DD-06 — Destination identity comes from environmental storytelling

**Decision.** Each destination communicates its meaning through objects, materials and composition. No floating text labels, no UI billboards, no 3D text in the world.

**Reason.** A monitor on a weathered desk under a tree reads as "someone's work" without a caption. A floating label would announce that the world is a menu in disguise, breaking DD-01 and DD-02.

**Note.** The `PROJECTS` / `EXPERIENCE` / `EDUCATION` / `ACHIEVEMENTS` captions visible in the master reference are **annotations on the concept art for communication purposes only**. They are not part of the design.

**Status.** Approved.

---

### DD-07 — Navigation guidance is subtle

**Decision.** Guidance comes, in priority order, from paths, landmarks, terrain and sightlines, then small physical signs, then temporary onboarding, then conditional directional indicators. No permanent on-screen arrows, no minimap, no waypoint list. Directional indicators appear only when genuinely useful and never for a destination already visible in frame.

**Reason.** Discoverability without hand-holding. Persistent UI guidance turns exploration into task completion. If the visitor gets lost, the correct fix is the world composition, not more UI.

**Status.** Approved; partly superseded by DD-29 (the compass).

---

### DD-08 — Desktop uses keyboard controls

**Decision.** WASD and arrow keys for movement, `E` to interact, `ESC` to close. No mouse input is required for movement or interaction.

**Reason.** Immediately familiar to anyone who has played a game, requires no instruction beyond a one-line hint, and keeps the control surface minimal.

**Status.** Approved.

---

### DD-09 — Mobile uses touch controls

**Decision.** Virtual joystick for movement, a contextual INTERACT button, swipe for carousels, and an always-visible close control. Mobile is a first-class platform, not a scaled-down desktop layout.

**Reason.** A large share of visitors arrive on a phone. An experience that is unusable there fails for those visitors entirely. Nothing essential may depend on hover or on hidden gestures.

**Status.** Approved.

---

### DD-10 — Keyboard and touch share one movement architecture

**Decision.** Both input sources produce the same normalised movement vector, consumed by a single `PlayerController`. There is exactly one movement implementation.

**Reason.** Two implementations drift. A tuning change to feel, speed or acceleration would have to be made twice and would eventually be made once. Parity is guaranteed structurally rather than by discipline.

**Status.** Approved.

---

### DD-11 — Project information is data-driven

**Decision.** All portfolio content lives in a typed data layer. No component contains a project name, company name, or description. `src/game/` never imports content.

**Reason.** The engine and the content have completely different rates of change. Adding a project must be a data edit, not a code change. It also keeps the rendering path identical for every project, so a new entry cannot break the layout.

**Status.** Approved.

---

### DD-12 — Missing project information does not create empty UI

**Decision.** Every content section is optional. A missing field renders nothing at all — no empty card, no `N/A`, no "information unavailable", no placeholder. Remaining content reflows naturally.

**Reason.** Empty scaffolding advertises what is missing and makes a project look unfinished. A concise project should read as deliberately concise. Placeholders are also a route to fabricated content, which DD-13 and the truth discipline forbid.

**Status.** Approved.

---

### DD-13 — Professional information must be sanitized for public disclosure

**Decision.** No internal source code, internal architecture, proprietary APIs, internal URLs, confidential implementation details, private company data, internal tickets, or sensitive screenshots. Professional work is described at a sanitized, high level. When uncertain, ask before publishing.

**Reason.** Legal and ethical obligation to past and current employers. A portfolio that leaks internal information damages the person it is meant to represent.

**Status.** Approved.

---

### DD-14 — Time of Day has four presets

**Decision.** **Morning · Afternoon · Evening · Night.** Four discrete, visitor-selectable states. No continuous slider, no automatic advance, no real-world clock binding.

**Reason.** Four hand-authored moods can each be art-directed properly. A continuous cycle would mean infinite states, none tuned, and would move the world without the visitor asking.

**Status.** Approved.

---

### DD-15 — Time of Day is a visual preset system, not a simulation

**Decision.** Presets modify sky, ambient light, directional light and its direction, shadows, fog, exposure and a defined set of emissive materials. No astronomical simulation, no physical sky model, no real-time global illumination.

**Reason.** The visual goal is four beautiful moods, which hand-authored presets achieve better and far more cheaply than simulation. Simulation would add cost and complexity while producing a less art-directed result.

**Status.** Approved.

---

### DD-16 — Changing Time of Day does not rebuild or reload the world

**Decision.** Switching presets must not unmount, dispose, re-create or re-fetch anything. The same geometry stays loaded; only light, colour, fog, exposure and registered emissives interpolate. The player keeps position and control throughout.

**Reason.** A rebuild would stutter, could drop the player's position, and would re-download assets. The switch must feel like light changing in a place the visitor is standing in — because that is what it is.

**Status.** Approved.

---

### DD-17 — Performance is a first-class product requirement

**Decision.** Performance constrains every milestone, not a phase at the end. Mobile first in priority. No React state for per-frame values, no allocation in the frame loop, no post-processing by default, one shadow-casting light, shared geometry and materials, real progressive loading.

**Reason.** A beautiful experience that runs poorly is a failed implementation. On mobile, poor performance is not a degraded experience — it is no experience. Optimisation must follow measurement, and must never buy frame time with architectural complexity.

**Status.** Approved.

---

### DD-18 — The loading screen uses the approved "professional version" joke

**Decision.** The approved copy is used verbatim:

```
VISHAV MEHRA

Loading...

[██████████████░░]

Looking for the
"professional" version of me...

Not found.

Proceeding anyway.
```

Loading is real. It is never artificially delayed to display the animation — if loading finishes early, the transition happens immediately and the joke is cut short. No additional jokes without approval.

**Reason.** It sets a dry, confident tone in four lines and signals immediately that this is not a template. Padding the wait to protect a joke would trade the visitor's time for a gag, which is the wrong trade.

**Status.** Approved.

---

### DD-19 — Experience is a free-standing A-frame cabin, distinct from Projects

**Decision.** The Experience destination is the **free-standing A-frame cabin / workshop** — timber frame, pitched roof, stone chimney, open front. It uses the **workshop visual language from the dedicated references**: blueprints, gears, tools, shelves, schematics and engineering objects.

**Experience must remain visually distinct from Projects:**

- **Projects** = software / developer workstation — open desk, **code** on screen, books and notebooks
- **Experience** = professional engineering / workshop environment — **built structure with a roofline**, **schematics** on screen, tools and blueprints

**Reason.** The two references overlapped — the workshop reference contained a desk and monitor, which read as Projects. Resolving it in favour of the cabin gives Experience the only built roofline in the world, which is also its distance-read landmark. The screen contents (code vs schematics) carry the distinction at close range.

**Supersedes.** Open item O-3.

**Status.** Approved.

---

### DD-20 — World scale initial targets

**Decision.** Initial implementation targets:

| Element | Target |
|---|---|
| World | ~120 × 120 units |
| Player height | ~1.4 units |
| Walk speed | ~4 units/s |
| Path width | ~1.5–2.5 units |

**These are initial targets and may be adjusted after playtesting.**

**Reason.** Every other spatial figure in the project depends on these four; without them, world building, camera framing and traversal timing cannot be authored. Fixing them as targets rather than as final values keeps the door open for tuning against how the world actually feels to walk through.

**Note.** Derived figures — spawn-to-destination distances, tree heights, prop dimensions — follow from these but are **not** themselves approved. See [01](01_WORLD_DESIGN_BIBLE.md) §12.

**Supersedes.** Open item O-14 (in part).

**Status.** Approved.

---

### DD-21 — Third-person follow camera with fixed yaw

**Decision.** A third-person follow camera with **fixed camera yaw**. **No free camera rotation in the first version.** The camera must still provide proper follow behaviour and correct framing on both desktop and mobile.

**Reason.** The world is composed to be read from particular angles; a fixed yaw guarantees every destination is framed as intended. It also removes camera control from mobile, where it is the least comfortable interaction, and keeps the control surface minimal.

**Known risk and handling.** Fixed yaw can cause occlusion behind trees and structures. **If playtesting shows significant occlusion problems, record it as an item for later review** — it is not resolved by silently adding free rotation.

**Supersedes.** Open item O-11.

**Status.** Superseded by DD-28.

---

### DD-22 — Night uses small warm local lights at destinations

**Decision.** Night may use small warm local light sources at important destinations.

**Prefer:** non-shadow-casting local lights · emissive materials where appropriate · subtle warm illumination.

**Avoid:** excessive glow · neon · expensive post-processing · large numbers of shadow-casting lights.

This approves adding a lamp/lantern prop at Education and a light source at Achievements, neither of which exists in the references.

**Reason.** Night's whole idea is contrast between a dark cool world and warm pools of light at the destinations — which also makes destinations findable in the dark, so it is navigational as well as atmospheric. Restricting the lights to non-shadow-casting keeps the shadow-caster count at exactly one at all times of day.

**Scope note.** This covers lights **at destinations**. Path lanterns are outside it and remain open.

**Supersedes.** Open item O-15 (in part).

**Status.** Approved.

---

### DD-23 — `#F0932B` is the primary warm accent

**Decision.** Approximately **`#F0932B`** is the primary warm accent, used **sparingly** for:

- the player's visor
- interaction states
- selected UI states
- small important lighting accents

**It must remain an accent, not the dominant world colour.**

**Reason.** It is already the character's visor colour in the approved character sheet, so it arrives with meaning attached — the eye learns to follow it. Making it the single saturated hue in an otherwise muted natural palette keeps it functioning as a signal rather than decoration.

**Supersedes.** Open item O-13.

**Status.** Approved.

---

### DD-24 — Explorer Unit 7-B is the canonical player

**Decision.** The dedicated **"Explorer Unit 7-B"** character reference is canonical. The brass/copper robot shown in the master scene reference is **obsolete and must not be used** as the player design.

**Reason.** The character sheet is a formal turnaround with front/side/back views, a palette strip, and an explicit spec panel — it is a design document, not a scene illustration. Its stated properties (gender-neutral, no facial features, distinctive silhouette, optimised for WebGL) are direct build requirements.

**Supersedes.** Open item O-6.

**Status.** Approved.

---

### DD-25 — Time of Day belongs to Milestone 4; roadmap updated

**Decision.** Time of Day is officially part of **Milestone 4**. The roadmap is:

| | Milestone |
|---|---|
| **M1** | Foundation |
| **M2** | Player + Camera |
| **M3** | Mobile Controls |
| **M4** | **World + Time of Day** |
| **M5** | Interaction |
| **M6** | Window System |
| **M7** | Projects |
| **M8** | Experience / Education / Achievements |
| **M9** | Content Pipeline |
| **M10** | Polish |
| **M11** | Performance |
| **M12** | Deployment |

**Reason.** Time of Day had a full specification but no milestone home. It belongs with the world because the presets and the environment they drive have to be authored and tuned against each other — building the world first and lighting it later would mean re-tuning every material.

**Note.** This roadmap differs from `CLAUDE.md` §47 in three places: M2 now explicitly includes Camera, M4 now includes Time of Day, and M9 is named "Content Pipeline". `CLAUDE.md` has not been modified.

**Supersedes.** Open item O-7.

**Status.** Approved.

---

### DD-26 — WebGL fallback is a deployment-stage requirement

**Decision.** A fallback for browsers or devices without working WebGL is a **Milestone 12 (Deployment)** requirement. **Do not implement it now.**

**Reason.** It is genuinely required before the site is public, but designing it early would mean building a second content presentation path in parallel with the primary one, before the primary one exists. Deferring it keeps the gameplay milestones focused.

**Supersedes.** Open item O-10.

**Status.** Approved.

---

### DD-27 — Audio is deferred

**Decision.** Audio is deferred. **No audio architecture and no audio dependencies during the initial gameplay and world milestones (M2–M8)** unless explicitly requested.

**Reason.** Audio is a whole subsystem — loading, mixing, spatialisation, autoplay policy, mute controls, mobile behaviour — and none of it improves movement, world building or interaction, which are what those milestones are for. Adding it early costs bundle size, memory and complexity for no gain. Whether the world gets sound at all stays an open product question.

**Status.** Approved.

---

### DD-28 — Player-controlled orbit camera

**Decision.** The third-person camera orbits the player under visitor control, with the control feel of a modern third-person exploration game:

- **Desktop:** hold the right mouse button and move the mouse. Horizontal movement turns the camera around the player; vertical movement changes pitch. Pointer lock is used while the button is held and released afterwards. The context menu is suppressed only for that gesture.
- **Mobile:** dragging on the right half of the screen looks around. The movement joystick stays on the left; both work at the same time.
- **Movement is camera-relative:** `W` / joystick-up moves toward where the camera looks, flattened onto the ground. The character turns to face its direction of travel, not the camera.
- Pitch is clamped (about −9° to +52°), distance is fixed apart from occlusion, and there is no zoom. The camera never rotates on its own — not toward destinations, not behind the player.
- Opening UI through an interaction ends any camera look and returns the cursor.
- No camera look while the loading screen is up; it returns the moment the world is revealed.

**Reason.** Requested directly by the product owner. Free orbit lets visitors look at the world they are walking through, and resolves the occlusion that fixed yaw could only work around.

**Consequences.** Occlusion handling is now essential rather than optional: structures *and trees* are registered occluders (a `group` named `occluders`), and the camera dollies in without ever passing a surface. Two parallel rays run out toward the desired position, one from the orbit centre and one from chest height — the orbit centre sits above the head, so on its own its ray clears a roof edge or branch that still hides the body. The camera stops short of the nearer hit and never beyond it, and eases back out once the way is clear. At rest, the camera reproduces the approved M4A framing exactly on desktop and mobile. Mouse look is optional — DD-08 still holds, because nothing requires the mouse. Camera look via touch drag replaces the "never used for camera" rule in [03](03_GAMEPLAY_AND_INTERACTION.md) §12.

**Supersedes.** DD-21.

**Status.** Approved.

---

### DD-29 — A quiet compass guides toward the nearest destination

**Decision.** A small compass dial sits at the top centre of the screen. Cardinal marks slide with the camera heading; a single marker shows the **nearest** destination's direction relative to the camera — centred when it is dead ahead, pinned to the dial's edge as a turn chevron when it is behind. No minimap, no distance readout, no list of destinations.

- **Quiet** while the destination is in view or the visitor has arrived: ink marker, no name.
- **Active** only when guidance is useful — the destination is out of view or behind, or the visitor has kept walking away from it for a few seconds: amber marker and the destination's name.
- No flashing, pulsing or notifications. Guidance never restricts movement; the world bounds remain the only limit.
- **In view** means the destination actually projects inside the frame, on both axes: looking steeply down past a destination counts as out of view, not in it.
- Targets are the interactions that opt in as destinations (`navigable`) and are enabled at that moment, so a new destination (e.g. Contact) is guided toward as soon as it exists in the world, while an incidental interactable — a sign, a switch — never becomes a compass target.
- **No visited state.** Guidance always points at the nearest destination, whether or not it has been opened; destination discovery ([03](03_GAMEPLAY_AND_INTERACTION.md) §22) is still an unapproved assumption and nothing in the build tracks it. A future enhancement, not a gap in this decision.

**Reason.** Requested directly by the product owner, to help visitors reach the destinations quickly without wandering off.

**Relationship to earlier decisions.** Amends DD-07's "no permanent on-screen arrows": the dial is persistent, but it stays quiet whenever the destination is already visible, which keeps DD-07's intent. Replaces the screen-edge chevron sketched in [05](05_UI_DESIGN_BIBLE.md) §5 and the "only after aimlessness" assumption in [03](03_GAMEPLAY_AND_INTERACTION.md) §21 (C15). The name label departs from 05 §5's "no label"; it appears only in the active state.

**Status.** Approved.

---

### DD-30 — The Experience cabin is enclosed, with an open south threshold

**Decision.** The cabin keeps the enclosed A-frame of `experience-cabin-production-sheet.png` — timber frame, pitched roof, stone chimney, boarded walls. Its **south face carries a full-height opening**: a wide doorway or double doors modelled **standing fully open**, with the lit interior readable from outside. The **interactable sits at the threshold**, on the meadow side of the opening, never deep in the interior. Nothing the visitor must read is placed where it can only be seen from indoors.

**Reason.** The two readings turned out not to be in opposition once the references were examined rather than summarised. `experience-cabin-production-sheet.png` panel 5 ("Interior Entrance") already draws the door **standing open** with the workbench and blueprint visible through it; `experience-environment-composition.png` draws the same cabin with the door open and the working props — workbench, blueprint, crates, lamp — placed **outside** at the threshold; `experience-environment-approach.png` draws the workshop from the player's approach with its doors fully open and the interior legible at approach distance. The approved documents already say the same thing from the gameplay side: [01](01_WORLD_DESIGN_BIBLE.md) §16 "open-fronted … open front, dark interior with tools and shelving visible", [09](09_M4_WORLD_PLAN.md) §4.2 "orient the open face south … keep the interactable *at the threshold*, not deep inside", and [10](10_ART_ASSET_PIPELINE.md) §10.3 "South face open … interior depth must be readable from outside". The sheet's word "ENCLOSED" describes the massing; the docs describe the opening. Both hold.

**Camera.** F4 is closed (DD-28, [09](09_M4_WORLD_PLAN.md) §23d) and the camera no longer passes a surface, but that evidence was gathered around the **currently open-fronted** cabin and does not license an enclosed interior. Rays are cast outward from the player, so a player standing deep inside a closed room pulls the camera *into the room* at very short range — no longer F4's black screen, but not the approved framing either. The threshold rule is what keeps the 8.59 desktop / 12.73 mobile rest framing intact.

**What this does not decide.** `experience-environment-approach.png` draws the workshop as a **gabled barn with vertical walls**, not an A-frame carried to the ground. That massing is **not adopted** — DD-19's A-frame stands, and the board is evidence for the opening only. **Enterability is also not decided here:** because the interaction lives at the threshold, nothing in this decision requires the interior to be walkable, and nothing forbids it. Whether the cabin gets a solid collider or an enterable interior is a separate call, and no reference or approved document currently speaks to it.

**Closes.** C-1.

**Status.** Approved.

---

### DD-31 — Education is an outdoor study desk; no structure

**Decision.** Education is the outdoor birch study desk of `education-study-production-sheet.png`. It has **no built structure**. `education-environment-composition-cabin-variant.png` is **Reference-only**, retained for its prop and framing language — bench, stacked books, lamp, carved signpost — and contributes no silhouette.

**Reason.** `education-environment-approach.png` shows Education from the approach as the desk beneath birches with globe, books, star chart, quill and lamp, and no structure; its own props panel labels the destination "Education desk". The cabin variant does not actually propose replacing the desk — it draws the **same desk** standing in front of a cabin, so no reference asks for the desk to be removed. The cabin it adds is the **Experience A-frame**, near-identical to `experience-environment-composition.png`: adopting it would collapse two of the five distinctness axes in [09](09_M4_WORLD_PLAN.md) §4 (built structure, silhouette) and take away the "only roofline in the world" role DD-19 gives Experience. [09](09_M4_WORLD_PLAN.md) §4.3 already records "Structure: None" with camera risk LOW, and [10](10_ART_ASSET_PIPELINE.md) §10.6 specifies the desk.

**Closes.** C-2.

**Status.** Approved.

---

### DD-32 — Achievements is the timber shrine; the Gothic chapel is rejected

**Decision.** `achievements-shrine-production-sheet.png` is authoritative: a small timber shrine with restrained carving and brass trim, an open display niche, on a stepped circular stone dais. `achievements-environment-composition-gothic-variant.png` is **rejected on the standing no-funerary rule** — not merely superseded by a later sheet. Education's globe, desk and quill appear in that image as an AI artifact and never belong at Achievements.

**Reason.** The Gothic variant draws a spired stone chapel with flanking turrets and an arched niche over a plinth, which reads as a mausoleum. That collides with a rule that predates every production sheet: [01](01_WORLD_DESIGN_BIBLE.md) §18 "explicitly **not** funerary" and §20's prohibition on "gravestone / headstone / funerary forms", [10](10_ART_ASSET_PIPELINE.md) §10.5 "No headstone or funerary forms", and O-1. `achievements-environment-approach.png` independently confirms the timber reading at the distance that matters — shrine, shingled gable, stepped dais, open display bay, path running onto it — and is the **only reference in the whole set that shows the actual canonical Explorer Unit 7-B** on the approach rather than a stand-in human.

**Closes.** C-3.

**Status.** Approved.

---

### DD-33 — Reference sheets are proportional; world dimensions come from the documents

**Decision.** One scale rule, in force for every asset:

1. **DD-20 is authoritative and unchanged.** Explorer Unit 7-B is **1.4 units**, and **1 unit = 1 metre**. No reference image may change this.
2. **The human figures on the production sheets are visual reference figures, not measurements.** They carry no world units and are never to be read as dimensions.
3. **Dimensions come from the documents, not from the sheets** — [01](01_WORLD_DESIGN_BIBLE.md) §12, the block-out figures in [09](09_M4_WORLD_PLAN.md) §4, and the per-asset entries in [10](10_ART_ASSET_PIPELINE.md) §10–§11. Sheets supply silhouette, construction, proportion, material and detail; the documents supply size.
4. **Author at world scale.** [10](10_ART_ASSET_PIPELINE.md) §15 already governs: "+Y up. 1 unit = 1 metre. Export at scale 1 — never rescale in code", origin at base centre, −Z forward. Validate with [10](10_ART_ASSET_PIPELINE.md) §18: "Scale correct against a 1.4-unit reference".
5. **Fallback, only where no documented dimension exists** and a sheet is the sole source: read the asset proportionally against that sheet's own figure, taking the figure as the **1.8 m** the prop sheet states, and convert **world = sheet × (1.4 / 1.8) ≈ 0.78**. Round to a sensible number and confirm the silhouette from the gameplay camera. This is a last resort, not the normal path.

**Reason.** The contradiction dissolved once the pipeline was read rather than the sheets. [10](10_ART_ASSET_PIPELINE.md) §14 **already specifies what a scale panel must contain**: "Scale reference — Explorer Unit 7-B (1.4 units) beside the asset, same scale." The human figures do not meet that spec; they are generation artifacts, already catalogued as C-9, and they disagree with each other — four different humans across the set, with only the conifer sheet showing anything close to the robot. A figure that is inconsistent between sheets cannot be a measurement on any of them.

The sheets were never the source of size in the first place. Every dimension the world actually uses is already written down and already Explorer-scaled: [01](01_WORLD_DESIGN_BIBLE.md) §12 sets the approved targets, [09](09_M4_WORLD_PLAN.md) §4 carries the block-out figures that were walked and judged against the 1.4 player (O-G: "cabin at 6.2 × 5.2 × 4.6 and desks at ~1.7 wide read correctly against the 1.4 player"; shrine 2.8), and [10](10_ART_ASSET_PIPELINE.md) §10 carries the per-asset entries. [01](01_WORLD_DESIGN_BIBLE.md) §21 orders the translation the same way — composition and silhouette first, never measurement — and [VISUAL_STYLE_EXTRACTION](art/VISUAL_STYLE_EXTRACTION.md) §3 states the sheets deliberately exaggerate proportion (canopy mass, root flare, roof pitch, prop chunkiness), which a metric drawing could not do.

**Confirmed in practice.** Every approved GLB so far — both hero trees, birch, bridge, Projects desk, rock set — was authored directly at world scale and validated in the running world. None needed rescaling, and no sheet dimension was ever converted. The rule describes what already works.

**What this does not change.** The per-asset figures in [01](01_WORLD_DESIGN_BIBLE.md) §12 that are marked assumptions (hero tree height, desk height, boulder size) remain assumptions; this decides how scale is *derived*, not which derived numbers are approved. C-9 is unaffected — the figures stay artifacts.

**Closes.** C-4.

**Status.** Approved.

---

### DD-34 — Palette-only materials: one base-colour map, scalar roughness, nothing else

**Decision.** Every authored asset ships with:

| Channel | Status | Rule |
|---|---|---|
| **Base colour map** | **Required** | One small palette atlas (the shipped set is **256 × 256, an 8 × 8 cell grid**, ~1.5 KB compressed), per-face UV cells. This is where all painted value lives |
| **Material count** | **Required** | One per atlas family, named for it — `bark-foliage`, `timber`, `stone`. A second material only for a genuinely different surface (the Projects desk's `screen`, the Explorer's `visor` and emissive) |
| **Roughness / metalness** | **Scalar only** | Constants on the material (`metal = 0`, `rough ≈ 0.92` matte, lower only for glass, visor and screen). **Never a map** |
| **Normal map** | **Unnecessary** | Prohibited unless a specific asset proves it needs one (`docs/10` §5) — none has |
| **AO map** | **Unnecessary** | Prohibited. Value and contact shading are painted into the palette cells |
| **Specular / metalness-roughness texture** | **Unnecessary** | Prohibited. "Universal rule: matte. Minimal specular. No plastic sheen anywhere" ([VISUAL_STYLE_EXTRACTION](art/VISUAL_STYLE_EXTRACTION.md) §5) |
| **Alpha** | **Not used today** | Every approved asset is `OPAQUE`. If alpha is ever needed, [10](10_ART_ASSET_PIPELINE.md) §6 governs: **alpha-tested, never blended**. See C-7 |

Brass, patina and worn metal are **painted into palette cells**, not shaded — the board's brass is "warm gold with aged patina, **soft gradient not mirror**". **Water is out of scope here**: it is not an authored destination asset, its transparency budget is separately reserved by [10](10_ART_ASSET_PIPELINE.md) §6, and its material rework is an open engineering item.

**Reason.** The documents already decided this; the sheets simply disagreed with them, and [VISUAL_STYLE_EXTRACTION](art/VISUAL_STYLE_EXTRACTION.md) §12's reference authority order puts approved design documents (3) above production sheets (4). [10](10_ART_ASSET_PIPELINE.md) §5 states "**No normal maps** … **No metalness/roughness maps.** Lambert-class materials; the look comes from painted value, not PBR response", and [07](07_PERFORMANCE_BIBLE.md) §6 states "Prefer vertex colours and flat material colour over textures wherever the look allows — the cheapest texture is no texture."

The `material-reference-board.png` "Roughness" row is not a map request. Every cell on that board is a **painted colour swatch**, and the roughness row paints each material in its dulled state — [VISUAL_STYLE_EXTRACTION](art/VISUAL_STYLE_EXTRACTION.md) §5 reads it correctly: "that five-channel structure *is* the hand-painted language."

**The evidence that settles it is the shipped set.** Nine approved GLBs — Explorer, Hero Tree A, Hero Tree B, Birch, Bridge, Projects Desk, Rock A/B/C — carry **one 256 × 256 base-colour PNG each, no normal map, no AO map, no metallic-roughness texture**, `metallicFactor = 0` and a scalar roughness of 0.92 (0.82 / 0.22 / 0.40 / 0.60 on the Explorer's palette, visor, emissive and the desk screen). Their material names already match the documented atlas families. They passed visual QA at every distance in the running world. The minimum feature set is not a proposal; it is what is already shipping.

**Known divergences, recorded not changed.** Each asset carries **its own** palette rather than the five shared atlas files of [10](10_ART_ASSET_PIPELINE.md) §5, and §6's "GLB-authored materials are replaced at ingest" is not implemented — assets keep their own material. Draw calls measured 52–71 across the world, so neither costs anything today. Consolidating the per-asset palettes into shared atlases stays an available optimisation, not a blocker, and the 8 × 8 cell grids make it mechanical.

**Closes.** C-5.

**Status.** Approved.

---

### DD-35 — Faceted palette geometry is the shipping target; "painterly" describes the references

**Decision.** New Blender assets are **faceted, flat-shaded, palette-coloured geometry**, exactly as the seven approved environment assets are built. Identity comes from **silhouette and painted value relationships**, not from surface texture detail.

- "Painterly" describes **how the reference sheets are drawn** and **the value language to reproduce** — base → highlight → shadow, warm light and cool shadow, three-tone foliage. It is **not** a requirement to paint literal texel detail.
- The sheets remain authoritative for silhouette, construction, proportion, colour relationships and detail placement (DD-33 already settles that they are not authoritative for size).
- Where a sheet shows painted grain, grooves or lens marks, reproduce them as **palette cells and geometry** — a birch's dark lens marks are cells, not a texture; a beam's dark joint is a cell, not a normal map.
- **Do not** drift to photorealism, and **do not** drift to generic low-poly either: [VISUAL_STYLE_EXTRACTION](art/VISUAL_STYLE_EXTRACTION.md) §12 bans both, and its §1 separates this world from generic low-poly by designed silhouette, negative space, asymmetry and value control — all of which are geometry and palette decisions.
- Added texture detail beyond the palette is a **per-asset exception**, allowed only where silhouette and palette provably cannot carry the identity, and only against measurement.

**Reason.** The two sides of C-6 were never the same kind of statement. [VISUAL_STYLE_EXTRACTION](art/VISUAL_STYLE_EXTRACTION.md) §4 already defines the geometry language as "**Faceted, flat-shaded**, with edges that read as deliberate planes … Silhouette complexity is **high**; surface complexity is **low**", and §3 sets "realistic *structure*, simplified *surface*". [01](01_WORLD_DESIGN_BIBLE.md) §21 orders the translation composition → silhouette → lighting → materials → landmarks → props. [07](07_PERFORMANCE_BIBLE.md) §3 puts it plainly: "Keep poly counts driven by **silhouette**, not detail."

**The shipped assets are the answer to the question C-6 asked.** Hero Tree A (4,424 tris), Hero Tree B (4,956), Bridge (1,436), Projects Desk (1,898), Birch (1,300), Rock Set (120/70/34) were each built faceted with a palette atlas, reviewed against the painterly sheets, and approved. They read as authored rather than procedural because of grouped foliage masses, negative space, asymmetry and per-face value — not because anything was painted at texel level. §11's criticism of the old procedural world ("uniform materials … flat plastic") is answered by palette cells, which is what changed between that critique and the approved assets.

**Note on foliage.** [VISUAL_STYLE_EXTRACTION](art/VISUAL_STYLE_EXTRACTION.md) §4 describes foliage as "alpha-carded layered planes", but both approved hero trees ship as **faceted masses with no alpha at all** and passed QA. Geometry beat cards here. That is recorded as the established practice; it does not by itself decide C-7, whose premise is currently moot.

**Closes.** C-6.

**Status.** Approved.

---

### DD-36 — Mouse look has no pointer lock, no button and no hidden cursor

**Decision.** Desktop camera look is driven by **cursor movement over the game viewport alone**. There is no pointer lock, no click-to-lock, no held mouse button, no hidden cursor and no Esc-to-release.

- While the cursor is over the canvas, its travel turns the camera. Leaving the canvas ends the look; re-entering starts a fresh measurement, so the camera never jumps by the distance the cursor travelled away.
- `movementX/movementY` is used where the browser supplies it; the difference between consecutive positions is the fallback.
- **The game viewport owns camera movement.** A pointer over a HUD control belongs to that control and does not rotate the camera.
- Esc is free for UI. It has no camera meaning.
- Touch look is unchanged: one finger dragging from the right half of the screen.

**Reason.** Pointer lock hides the cursor and swallows Esc, which puts the camera in conflict with every HTML control the HUD already has — the time-of-day selector, the interact button, and every window the content milestones will add. Holding a button to look is a console convention that a visitor arriving at a portfolio has no reason to guess. Neither is needed: the world is a viewport inside a page, not a full-screen shooter, and hover-to-look is immediately discoverable without instruction. It is also testable — headless Chromium refuses pointer lock outright, so the locked implementation could not be regression-tested at all.

**Supersedes** the look-input half of DD-28 (the orbit camera itself — yaw/pitch, two-ray occlusion, dolly-in — is unchanged and still approved).

**Measured.** Cursor sweep of 216 px turns the camera 0.864 rad (216 × 0.004, exact). `document.pointerLockElement` stays `null`; `requestPointerLock` is called 0 times on desktop and 0 times on mobile; canvas `cursor` computes to `auto`. Moving 24 px across a HUD button changes yaw by 0.0000. Esc changes yaw by 0.0000. WASD stays camera-relative: travel heading opposes camera yaw to within 0.001 rad.

**Status.** Approved.

---

### DD-37 — The world is entered deliberately, from a landing card

**Decision.** Real asset loading is unchanged. When it finishes, the loading screen becomes a **landing card** — wordmark, "Interactive 3D Portfolio", and one control (X on a keyboard, an ENTER WORLD button on touch). The world renders behind it but **takes no input at all** until the visitor enters.

- The loading store gains a `landing` phase between `loading` and `ready`. `ready` now means *entered*, so the input gate, the HUD and every consumer keep their existing condition unchanged.
- Nothing is padded. A fast load reaches the landing card immediately; only the visitor's own keypress moves past it.

**Reason.** The world used to start the instant loading finished, which handed the visitor a character mid-frame with no idea what the controls were. A landing card gives the world a threshold and gives the first frame somewhere to settle. It also makes X a single consistent verb: X enters the world at the start and leaves it at the trailhead.

**Measured.** Behind the card, holding W for 1.2 s moves the player 0.00 units and a 200 px cursor sweep changes camera yaw by 0.0000.

**Status.** Approved.

---

### DD-38 — Leaving the world is a destination, and it is one-way

**Decision.** A **trailhead signpost** stands beside the start of the path, behind the spawn. It is an ordinary interactable: approach → *Interact* prompt → E (or the touch button) → a card offering **PRESS X TO EXIT** (touch: **EXIT WORLD**) or **Stay** → a short fade → the portfolio page at `/portfolio`.

- The signpost is **not** a compass destination. It stands at the spawn, so it needs no guidance, and a compass pointing at the exit would read as the way on.
- Gameplay input is closed while the card is open, so the player cannot walk out from under it. Staying gives input straight back.
- **There is no link back.** A visitor who wants the world again loads the site again.

**Reason.** A 3D world is a wonderful way to explore a portfolio and a poor way to *read* one — a recruiter with four minutes needs the text. The exit is diegetic (a trail marker, which [03](03_GAMEPLAY_AND_INTERACTION.md) §10 already uses for guidance) rather than a browser chrome button, so leaving stays inside the fiction. It is one-way because a return loop turns two coherent experiences into a toggle, and because nothing on the page benefits from being read half-way and abandoned.

**Status.** Approved.

---

### DD-39 — The river is an authored tile laid by the terrain, not an authored course

**Decision.** The river ships as `river.glb`, **three faceted water tiles** (4.2 × 3.16, flow on local +X, water surface at y = 0). The runtime lays them along the stream centre-line, sampling `streamSurfaceAt` for every placement.

- The **heightfield stays the single source of truth**. The asset supplies the look; the terrain supplies the course and the height. The two cannot drift apart.
- Each tile is seated at the **lowest** water height over its own footprint, then the sequence is smoothed along the run. An edge can only sink into the bank, never float over it — water disappearing into a bank is invisible, water lying on top of one is the first thing you see.
- Tiles overlap by 28 % and carry **no end caps**: a cap is never what closes the run, only a dark vertical seam where one tile sits lower than the next.

**Reason.** A single authored mesh for a 104-unit curve would have to reproduce `heightAt` — fbm, mounds, path settling, pad flattening — in Blender, duplicating the source of truth and guaranteeing eventual drift. A tile placed by the real function cannot drift. Instancing also keeps the whole river at three draw calls.

**Measured.** 36 instances, 171/166/190 triangles per tile, 48 KB, 3 draw calls, +6,452 scene triangles. Bridge grounding over the new water is unchanged (deck range −0.867 … −0.471, identical to the pre-river measurement).

**Status.** Approved.

---

### DD-40 — Leaving the world is a HUD action, never an interaction

**Decision.** The final exit is **completely independent of the E interaction system**.

- **Desktop:** holding **X** exits, from anywhere in the world. Releasing before the hold completes cancels it.
- **Touch:** tapping the persistent **EXIT** button exits. 
- **No E is involved, ever.** No proximity trigger, no prompt to walk to, no confirmation step before X.
- The **trailhead signpost is scenery only**: geometry and a post collider, nothing else. It is not an exit trigger, not a destination, not an interaction target, and has no `contentKey`.
- **E stays reserved** for the four world content destinations: Projects, Experience, Education, Achievements.

**Explicitly forbidden, permanently:** an `E → X` exit flow · an `exit` member of `InteractionType` · an `exit` `contentKey` on the signpost · any proximity-based exit prompt.

**Reason.** The exit is the one action whose whole job is to be available — a visitor who wants the text should never have to find a particular spot in a 3D world first. Tying it to proximity makes leaving a puzzle, and routing it through E puts the way out in the same vocabulary as the content, where it competes with the four things E is actually for. The deliberateness that a proximity trigger would provide is supplied by the hold instead, which costs nothing to cancel.

**Supersedes** the exit half of DD-38 (the trailhead as an interactable gate). The signpost's *placement* and its role as scenery at the trailhead are unchanged.

**Measured.** Standing at the signpost: prompt not visible, E does nothing. From the Experience cabin, 58 units away: hint reads `X Hold to exit world`; a 0.4 s hold reaches 0.463 and falls back to 0 on release with the player still in the world; a full hold leaves. Touch: EXIT tapped at spawn leaves with no prior interaction. 0 console errors on both.

**Status.** Approved.

---

### DD-41 — The terrain is carved to the river asset's own channel

**Decision.** Near the stream, `heightAt` shapes the ground to the exact channel `river.glb` describes, read from a compiled profile table (`src/game/world/riverProfile.ts`, generated by `tools/river-profile.mjs`): a bowl under the water, rising under the asset's damp bank to meet the bank lip exactly, then the natural ground — cut back where it is steeper than a bank, built up gently where it is lower than the lip. The centre-line depth is unchanged, so the water height, the bridge and everything seated on the water stay where they were.

- The stream centre-line (`STREAM_PATH`, Catmull-Rom through the authored vertices) is defined once in `worldGen` and used by both the terrain and the river bend.
- The river's outer edge is an earth-coloured **apron** sloping 1.6 m outward and down into the ground, replacing a vertical dark skirt.
- **Regenerate the profile whenever the river is re-exported:** `node tools/river-profile.mjs`.

**Reason.** The old carve was a fixed-width trough from before the river was authored. Measured against the rendered ground, 1,140 of 1,324 bank-lip vertices stood proud (worst 0.75 m), and at 863 of them the ground beside the stream was *below the water surface* — so the dark skirt showed along the banks, and conforming the bank downward would only have perched the water on a ridge. The heightfield had to learn the channel. The apron exists because the terrain mesh samples every 1.29 m while the bank rises in about 0.3 m: between samples the rendered ground can dip under the lip, and a sloped earth apron shows that as bank rather than as the channel's underside.

**Measured.** Every lip is now buried under the analytic ground (worst −0.055 m). Apron outer edge: 0 of 538 vertices above the rendered ground (worst −0.46 m). Largest ground step across the stream at 1 cm resolution: 1.65 cm — steep bank, no seam. Bridge deck crown unchanged at −0.471; north/south/diagonal crossings clean, sideways runs still stopped by the rails. Wading straight through the stream now climbs its banks at ~4.9 m/s, inside the 6 m/s climb limit.

**Status.** Approved.

---

### DD-42 — Everything a visitor can walk into blocks them

**Decision.** Every environment object with real mass carries a gameplay collider: rocks, bushes, conifers, the bank river stones, the hero trees and birches, the destinations and the bridge rails. The colliders are lightweight XZ primitives in the existing registry (`worldColliders.ts`) — circle, box, and a new capsule for long low shapes — never the rendered mesh, and no physics engine. Each footprint is **measured** from its own GLB at the player's body height (0.4–1.5 m) by `tools/collider-measure.mjs`, at the dense mass rather than the outermost leaf or the root flare.

- Two things are deliberately *not* solid: stones under 0.25 m (stepped over, not walked into) and the in-water river stones, which are seated so only their tops break the surface.
- Renderer and colliders read the **same** placement arrays (`propPlacements.ts`), so a moved prop cannot leave its collider behind.
- `tools/placement-audit.ts` flags authored props that stand inside the stream channel or inside a destination footprint — a defect no collider can fix, because it is a composition error.

**Reason.** The brief: *"when I say the environment assets need VOLUME, I mean GAMEPLAY COLLISION VOLUME."* Walking through a boulder reads as a prototype, however good the boulder looks.

**Measured.** 26 → 220 colliders. 21 representative props × 8 approach directions with closed-loop steering: minimum clearance ≥ −0.01 m everywhere, i.e. never entered. Resolve cost 1.8 µs per frame-step with the full registry.

**Status.** Approved.

---

### DD-43 — Projects and Education are supplied buildings, re-authored onto the world's palette

**Decision.** The Projects desk and the Education desk are replaced by two buildings the designer supplied: a stilt workshop shack (`projects-shack.glb`) and a log cabin (`education-cabin.glb`). Both are optimised and **re-finished** before they ship — a supplied asset is evidence of intent, not a drop-in:

- decimated to the world's budget (14,000 and 12,000 tris; 648 KB and 536 KB),
- materials normalised — the cabin arrived metallic with its texture multiplied by a 0.4 grey, which rendered it black in this world's light; the shack carried a 2.0 specular tint,
- the cabin's photographic wood re-graded toward the world's timber (`#8a7358` family): value ramp tinted to the palette, a quarter of the original chroma kept so the grain still reads,
- flat-shaded at runtime, like every other world asset.

Each keeps the procedural desk as its `AssetBoundary`/`Suspense` fallback, sits inside the destination's `occluders` group, and takes the destination's own yaw, so its collider and its geometry cannot drift. The amber practical moved into each building — the shack's lit window, the cabin's porch lamp.

**Reason.** The designer supplied the assets and asked for them in place of the tables. Buildings also read as destinations from much further away than a desk does, which is what the approach shots were missing.

**Measured.** Footprints from the GLBs at body height: shack 1.49 × 1.38 (its platform), cabin 1.69 × 2.30 (its sill). Blocked from 6 directions each, minimum clearance 0.000 m — the player stops on the wall and never inside it. Interaction radius 4.2 / 4.6 with prompts at 4.6 / 2.9 m, so the prompt clears each roofline. Three authored trees stood where the new footprints and the stream are: a birch inside the cabin (−0.43 m), and two framing oaks in the water (0.79 m and 1.50 m from the centre-line); all three moved, audit now clear. 0 console errors, 0 failed requests.

**Status.** Approved.

---

### DD-44 — Night wayfinding is a lantern and a trail marker, never a HUD marker

**Decision.** Each of the four destinations gets two authored objects framing the approach — **the marker on the visitor's right, the lantern on their left** — with the arrow on the plank pointing across at the destination between them:

- **A trail marker** (`sign-boards.glb` + `sign-text.glb`, source `art/blender/trail-signs`): one hewn five-sided post carrying a split plank **cut as an arrow**, pointing at the destination it names — irregular outline, crowned top, chamfered butt, pegged at the joint, a brace underneath and a cross timber lashed across the post head. 132 tris of timber and ~115 of lettering each, plank 1.56–1.82 m wide (the designer's sheet), total height 2.03–2.05 m. The word is **painted**, parchment `#D4C8AF` (spec §10) standing 4 mm proud of the face, with no emissive by day and a trace (0.85) after dark.
- **A lantern** (`lamp-post.glb`, source `art/blender/lamp-post`): a hand-hewn post with an iron bracket and a hanging four-sided cage, 196 tris, 16 KB. **Eight of them**: one per destination, and four more flanking the two ends of the bridge, which is the darkest ground in the world after dark. Inside it, an amber flame on its own emissive material, and one halo point held at a constant 16 px on screen — which is what still reads when the lantern itself is two pixels across.

Local light is **pooled**: only the three lanterns nearest the camera carry a point light (three, so both lamps at a bridge end light the crossing together) (`distance` 13, decay 2, intensity 34 × night factor, faded out past 20–32 m). The lights are never added or removed, only moved and dimmed, because changing a scene's light count recompiles every shader in it.

Everything keys off `timeOfDay.practicalIntensity`, so day → night → day eases over the existing 1.6 s transition. By day the lanterns are dark and the paint is just paint. **No global ambient was raised**, and there are no HUD markers, waypoints, beams or rings.

**Reason.** At night the destinations were unfindable: dark shapes among dark trees. The brief's answer — and the world's own navigation language ([01](01_WORLD_DESIGN_BIBLE.md), CLAUDE.md §10 "physical signs / trail markers") — is an environmental one. A first pass with a rectangular board and glowing amber type was rejected by the designer as "a UI label converted into 3D" and rebuilt from scratch against the timber language.

**Measured.** Night: lights 34/26 on the two nearest lanterns, 0 by day; flame emissive 0.4 → 2.8; halo opacity 0 → 0.95; letter emissive 0 → 0.85. Word readable at 7 m and 16 m on approach, lantern readable past 40 m. 70 → 80 draw calls with signs and lanterns, 111–113 fps desktop, and the same asset budget on mobile (390 × 844 verified). Every post blocks: lamp and marker posts stopped the player at 0.00 m clearance from three approach directions each. Placement audit clear — no marker or lantern in the stream, in a structure, or within 1.45 m of a worn path.

**Status.** Approved.

---

### DD-45 — The horizon is the same forest, in front of authored ranges, beside water that moves

**Decision.** Three changes to the backdrop, and nothing else in the world:

- **The distant trees are the production trees.** `tree-distant-a/b.glb` (126 tris of silhouette each) are gone from the world, and so is `buildDistantTree`. The treeline is now `hero-tree-a`, `hero-tree-b`, `birch` and the three conifers — the identical GLBs the near world uses, at identical detail. Only the transform differs, plus `castShadow={false}`. Backdrop stands are walked along the terrain's edge rather than scattered over it and mostly rejected, because the played world fills most of the terrain and the usable band is a 12–15 m ring; the mix is conifer-heavy (85% of stands) since a 440-tri conifer buys the most silhouette per triangle.
- **The hills are authored ranges.** `mountains.glb` (art/blender/mountains): three continuous ridges at 112, 132 and 152 units, crests from three sine harmonics plus a few narrow summits, four rings up each face, 768 tris apiece. They replace 26 deformed icosahedron domes whose overlaps fought for the depth buffer and drew the bright seams the designer flagged. Drawn with the world's own `distant` material — unlit, vertex-coloured, tinted by the time of day — so they follow morning to night with the sky ring. One merged draw call, exactly what the domes cost.
- **The river flows.** The water carried a morph clip already, but the actions were started in a `useMemo` while an effect's cleanup stopped them, so after React's development double-invoke the mixer sat on the clip's first frame — the river was frozen, which is what "the river looks static" was. Starting and stopping the actions in the *same* effect fixes it. On top of that the surface itself now flows: two sine bands of different wavelength and speed, injected into the water material with `onBeforeCompile`, phased on world position projected onto the stream's direction (downstream is +X, the centre-line's own fall). No second mesh, no texture, no post effect.

**Reason.** The designer's note: the distant trees "look like cheap/procedural substitutes", the mountains show "visible white seam/line artifacts", the river is static. The first two were true by construction — they *were* different, cheaper assets — and the brief's instruction was to place the real ones further away instead.

**Measured.** Backdrop 246 trees, all production assets: 230 conifers, 9 birch, 3 hero oaks. Scene 510k → 562k triangles, 59–63 draw calls (down from 61–80: the domes and the two distant-tree draws are gone), 73–95 fps desktop at 1280 × 800. Mountains: 2,304 triangles, 178 KB, every face normal verified pointing inward before shipping. River: the flow uniform advances 1.0/s, morph influences change every sample, and a tracked flow vertex travels 1.74 m downstream in 2.4 s. 0 console errors, 0 failed requests, day and night.

**Status.** Approved.

---

### DD-46 — The first screen is the world, seen from outside it

**Decision.** The parchment loading card is gone — surface, wordmark block, cell bar and the three deadpan lines with it (this supersedes the loading-copy half of DD-18). In its place the canvas draws an authored shot of the real world from the first frame, and the DOM holds only a scrim, the wordmark, a hairline of real progress and the way in.

- **`EntryRig`** (`src/game/entry/`) owns the camera while the phase is `loading` or `landing`: a composition standing back down the trunk path, south of the bridge, looking north along it — crossing in the midground, meadow and treeline beyond, ranges on the horizon. It drifts forward over 14 s, carries a damped pointer parallax on desktop, and a field of 190 motes drifts through it.
- **The hand-over is a blend, not a cut.** The rig is mounted *after* `FollowCamera`, so the gameplay camera has already written its pose for the frame; the entry rig reads that pose as its blend target and eases out of the shot into it over 1.7 s. The gameplay rig is untouched — it does not know the entry exists.
- **The scrim opens with real progress** (`--entry-reveal`), so the world arrives in view while it loads rather than being unveiled at the end. `body` is deep forest, so the first paint is never pale and neither end of the experience flashes.
- **The HUD waits at the threshold** (`WhenEntered`): compass, joystick, interact, controls card and exit hint mount on `ready`. They used to be hidden by an opaque card; with the world in frame they would otherwise sit on top of the title — and X, which enters, is the key that later leaves.
- Copy is one line: **ENTER WORLD**, on dark glass with a thin sage border, a green lift on hover and an arrow that steps right. `or press X` underneath on pointer-fine devices.

**Reason.** The designer's note: it "looks like a generic portfolio website loader… It does NOT communicate that the user is about to enter a 3D interactive world." The world was already built and drawing behind the card; the fix was to stop covering it.

**Measured.** 0 console errors and 0 failed requests at 1366×768, 1440×900, 1920×1080 and at 320×568, 390×844, 393×852, 430×932; no overflow in either axis at any size; tap target 219×58; entry works by click, tap and X; reduced motion holds the shot still and shortens the fade. No second scene, no duplicate asset load, one frame loop. Gameplay after entry is unchanged.

**Status.** Approved.

---

### DD-47 — The crossing to the portfolio is one layer above both worlds, and it waits

**Decision.** `.exit-wash` is gone. Leaving the world no longer fades a parchment sheet over the game on a fixed 520 ms timer and then pushes the route; the crossing is owned by a single layer that sits above both routes and holds until the arriving world has actually painted.

- **`src/ui/transition/handoff.ts`** is the state: `idle → covering → holding → revealing → idle`, four transitions per crossing and nothing published per frame. `beginHandoff(navigate, to)` covers the screen first, calls `navigate()` only once it is covered, then waits. `reportWorldReady()` lets a scene say it is drawing; a `requestAnimationFrame` watcher is there so nothing has to. The watcher holds the canvas that was on screen when the crossing began and requires both `location.pathname === destination` and a *different* canvas with real size — without that it matched the game's own canvas and opened again before the route had changed. `READY_TIMEOUT_MS` (3.2 s) is the backstop: a visitor is never held behind the cover.
- **`WorldHandoff`** renders it, mounted in `app/layout.tsx` after `{children}`, so the route change happens underneath it and is never seen. It returns `null` when idle.
- **The cover is an aperture, not a wipe.** One radial gradient paints the whole element and what moves is its own radius, animated through a registered `@property --iris`. Past its last stop a radial gradient extends that stop to the element's edges, so a shrinking radius closes the frame from the outside in with nothing to butt against. Two earlier attempts drew a hard rectangle across the middle of the screen for the same reason — the green was painted in a *box* smaller than the viewport (first by scaling the element, then by moving `background-size`), and a box edge is always visible. Matching colours across that seam does not fix it; removing the box does.
- **The two ends match.** `body`, `themeColor` and the game canvas's first-frame haze are all `#0d1310`, so neither end of the crossing can flash pale.
- **Reduced motion keeps every step** — cover, wait, reveal — and only shortens them. The readiness gate is what prevents the flash, so it is never skipped.

**Reason.** The beige frame between the two worlds was the game's own loading colour, shown over a page that had not painted yet. A timer cannot know when the portfolio is ready, so no timing value would have fixed it; the cover had to learn to wait.

**Measured.** Five viewports — 1366×768, 1440×900, 1920×1080, 390×844, 430×932. On every one: the cover is still up at the moment the route changes (`phase: holding`), never more than one loader on screen at a time, and the layer removes itself afterwards. The aperture was checked separately against a high-contrast plate at 1440×900, where any seam would read as a straight line across the squares: none at any point in the close.

**Not yet confirmed.** The reveal itself has not been watched in the browser. `/portfolio` currently throws at runtime (`src/portfolio/threeui-reference/liquidMetal.ts`), and the Next dev error overlay renders above every layer, so the arriving side of the crossing cannot be seen until that is fixed.

**Status.** Approved; reveal pending re-check.

---

## 2. Open items — NOT decisions

Recorded here so they are visible. **None of these are approved.** They require a decision from the designer/product owner before the affected work begins.

### 2.1 Reference contradictions

| # | Item | State |
|---|---|---|
| **O-1** | **Achievements shown as gravestone-like stone markers** in the master reference, contradicting the brief's explicit "no gravestones". | **Resolved by brief.** The dedicated achievements reference (dais + shrine) supersedes it. No headstone forms anywhere. Recorded for traceability. |
| **O-2** | **Floating destination labels** in the master reference, contradicting `CLAUDE.md` §9. | **Resolved by DD-06.** Treated as concept-art annotation, not design. |
| **O-3** | **Experience destination is ambiguous.** | ✅ **Closed by DD-19.** Free-standing A-frame cabin + workshop prop language, kept distinct from Projects. |
| **O-4** | **Projects station varies** — laptop and corkboard in the master reference, CRT and notebook in the dedicated reference. | **Open.** Proposed: dedicated reference is authoritative; corkboard optional secondary prop ([01](01_WORLD_DESIGN_BIBLE.md) A8). |
| **O-5** | **Education varies** — round bookshelf and armchair in the master reference, outdoor scholar's desk in the dedicated reference. | **Open.** Proposed: dedicated reference is authoritative; bookshelf optional secondary prop ([01](01_WORLD_DESIGN_BIBLE.md) A10). |
| **O-6** | **Character varies** — the master reference shows a brass/copper robot; the character sheet defines "Explorer Unit 7-B". | ✅ **Closed by DD-24.** Character sheet is canonical; master-scene robot obsolete. |

### 2.2 Process and scope

| # | Item | State |
|---|---|---|
| **O-7** | **Time of Day has no milestone.** | ✅ **Closed by DD-25.** Milestone 4 — "World + Time of Day". Roadmap updated. |
| **O-8** | **Drei status.** `CLAUDE.md` §36 lists Drei in the preferred baseline; the current brief says "Drei only if later justified". | **Open.** Documented in [04](04_TECHNICAL_ARCHITECTURE.md) as not installed, added only for a specific need. |
| **O-9** | **No non-spatial accessibility route** to portfolio content for visitors who cannot use spatial controls. | **Open — needs a decision** ([03](03_GAMEPLAY_AND_INTERACTION.md) C17). |
| **O-10** | **No WebGL-unavailable fallback** specified. | ✅ **Closed by DD-26.** Deployment-stage requirement, Milestone 12. Not built now. |
| **O-11** | **Camera rotation.** | ✅ **Closed by DD-21.** Fixed yaw. Occlusion problems logged for later review. |
| **O-12** | **Typography.** No typeface is specified by any reference. | **Open** ([05](05_UI_DESIGN_BIBLE.md) E2). |
| **O-13** | **Accent colour.** | ✅ **Closed by DD-23.** `#F0932B`, used sparingly, never dominant. |
| **O-14** | **World scale figures.** | ✅ **Partly closed by DD-20** — world size, player height, walk speed, path width approved as initial targets. **Still open:** derived spawn-to-destination distances, hero tree height, prop dimensions ([01](01_WORLD_DESIGN_BIBLE.md) §12). |
| **O-15** | **Night lighting requires new props** not present in any reference. | ✅ **Partly closed by DD-22** — lamp at Education and light source at Achievements approved. **Still open:** path lanterns ([02](02_TIME_OF_DAY.md) B9). |
| **O-16** | **Performance budgets** — no device matrix, load-time budget, draw-call ceiling, or bundle budget set. | **Open — establish from measurement in Milestone 4** ([07](07_PERFORMANCE_BIBLE.md) G1). |
| **O-17** | **Whether the world gets audio at all.** DD-27 defers implementation through M2–M8; it does not decide that audio eventually ships. | **Open — revisit at Milestone 10 (Polish).** |

### 2.3 Added 2026-08-31 — pre-Figma consistency pass

Recorded during a documentation-only consistency pass. No source file and no design meaning was changed. **None of these are decisions.**

| # | Item | State |
|---|---|---|
| **O-18** | **Which reference set is authoritative for destination design.** [01](01_WORLD_DESIGN_BIBLE.md) §15–§18 cite the early concepts (REF-PROJECTS / REF-WORKSHOP / REF-EDUCATION / REF-ACHIEVEMENTS) as *primary*; [ASSET_REFERENCE_INDEX](art/ASSET_REFERENCE_INDEX.md) marks all four **superseded by production sheets**. Both statements are currently live. | **Open — needs a ruling.** Recorded in [01](01_WORLD_DESIGN_BIBLE.md) §0. REF-MASTER, REF-FIELD and REF-CHARACTER are unaffected |
| **O-19** | **`themeColor: #d7e4e0`** in `layout.tsx` belongs to neither the UI token set ([05](05_UI_DESIGN_BIBLE.md) §2) nor the environment palette ([01](01_WORLD_DESIGN_BIBLE.md) §9). It tints mobile browser chrome, which will frame a parchment loading screen. | **Open — needs a decision.** Two options in [05](05_UI_DESIGN_BIBLE.md) §2a. **Not changed** |
| **O-20** | **Six reference images are uncatalogued.** `design/references/` holds 34 files; the index catalogues 28. Four of the six are destination approach views bearing directly on C-1, C-2 and C-3. | **Partly closed 2026-09-18.** The three destination approach views used as evidence for DD-30 … DD-32 are catalogued in [ASSET_REFERENCE_INDEX](art/ASSET_REFERENCE_INDEX.md) *Approach references*. **Still open:** `projects-environment-approach.png` and the two files labelled "master art-direction board", which remain unassessed and unrated |
| **O-21** | **Production-sheet contradictions C-1 … C-9** (enclosed vs open cabin · Education as cabin · Gothic vs timber shrine · player scale · material workflow · painterly vs faceted · alpha blend vs test · named signposts · scale figures) are catalogued in the art index but were never surfaced in this decision record. | **Mostly closed 2026-09-18.** C-1 → DD-30, C-2 → DD-31, C-3 → DD-32, C-4 → DD-33, C-5 → DD-34, C-6 → DD-35. **Nothing in C-1 … C-6 blocks asset production.** Still open: **C-7** (alpha blend vs test — premise currently moot, no approved asset uses alpha; [10](10_ART_ASSET_PIPELINE.md) §6 governs if it ever does), **C-8** (named signposts — a product call, not an art conflict), **C-9** (scale figures — artifact, no action needed). Full text in [ASSET_REFERENCE_INDEX](art/ASSET_REFERENCE_INDEX.md) *Contradictions* |
| **O-22** | **`#6b5e52`** is used in the joystick border and maps to no token. Nearest is `ink-muted` `#6f6151` — a different value. | **Open.** Promote to a token, or keep as a documented literal. Rounding it to `ink-muted` would change rendered colour ([05](05_UI_DESIGN_BIBLE.md) §2a) |
| **O-23** | **docs/09 F4 — Experience cabin occlusion.** Dolly-in shipped; the preferred fade did not; canopies are not registered as occluders; the failure case has not been re-walked. | ✅ **Closed 2026-09-18.** Trees are registered occluders, a second chest-height ray was added, and the camera never passes a surface. Re-walked: 80/80 samples around the cabin keep the player visible and unobstructed with the camera outside all geometry. Evidence in [09](09_M4_WORLD_PLAN.md) §23d |

Full assumption tables live at the end of each document: [01](01_WORLD_DESIGN_BIBLE.md) §22 · [02](02_TIME_OF_DAY.md) §13 · [03](03_GAMEPLAY_AND_INTERACTION.md) §24 · [04](04_TECHNICAL_ARCHITECTURE.md) §14 · [05](05_UI_DESIGN_BIBLE.md) §15 · [06](06_CONTENT_SYSTEM.md) §12 · [07](07_PERFORMANCE_BIBLE.md) §19.

---

## 3. Amending this record

- A decision changes only by adding a new entry that marks the old one `Superseded`. Existing entries are not edited in place — the history is the point.
- An open item becomes a decision only when the designer/product owner approves it explicitly.
- Nothing gets added here by inference.
