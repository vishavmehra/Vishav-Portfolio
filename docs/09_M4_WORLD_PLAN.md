# M4 WORLD PLAN

> **Status:** Planning only. Nothing in `src/` was modified. No dependencies added.
> **Authority:** `design/references/` for visual language, `docs/01`, `docs/02`, `docs/07`, `docs/08` for rules and approved decisions.
> **Grounded in:** the measured M1–M3 build (values quoted below are read from `src/game/config.ts` and `src/game/GameCanvas.tsx`, not recalled).
> **Last updated:** 2026-08-29

---

## 0. Current state this plan builds on

| Thing | Current value | Source |
|---|---|---|
| Unit scale | 1 unit = 1 m | DD-20 |
| Player height / radius | 1.4 / 0.35 | `config.ts` |
| Walk speed | 4 u/s | `config.ts` (DD-20) |
| Camera offset | `(0, 4.2, 8.4)` → distance 9.39, pitch **26.6°** | `config.ts` |
| Camera yaw | **0** — always looks down −Z | `CAMERA_YAW` |
| FOV / near / far | 45 / 0.1 / **140** | `config.ts` |
| Narrow-aspect handling | offset × `sqrt(1.6/aspect)`, clamped **1.45** | `config.ts` |
| World bound | **circle r = 38.65** around spawn | `WORLD_BOUNDS_RADIUS` |
| Ground | circle r = 40, flat, `MeshLambertMaterial` | `GameCanvas.tsx` |
| Lights | 1 hemisphere + 1 directional (shadow, 1024, ortho ±30, far 70) | `GameCanvas.tsx` |
| Fog | `#d7e4e0`, near 45, far 95 | `GameCanvas.tsx` |
| Renderer | `dpr=[1,2]`, `PCFShadowMap` | `GameCanvas.tsx` |
| **Measured draw calls** | **36/frame** at spawn (21 meshes: 6 world + 15 player, colour + shadow pass) | M2 instrumentation |

Two of these are the hard constraints that shape everything below: **fixed yaw** and **the horizontal cone it produces**.

### The constraint nobody has costed yet

Horizontal FOV, computed as `2·atan(tan(22.5°)·aspect)`:

| Viewport | Aspect | **Horizontal FOV** | Half-angle |
|---|---|---|---|
| 1440 × 900 | 1.60 | 67.1° | ±33.5° |
| 16:9 desktop | 1.78 | 72.8° | ±36.4° |
| 768 × 1024 | 0.75 | 34.5° | ±17.3° |
| **390 × 844** | **0.46** | **21.7°** | **±10.8°** |

The M3 offset-scaling pulls the camera **back**, which shows more world at a given depth — but it does not widen the cone by a single degree. On a portrait phone the player can only ever see a **±10.8° wedge** ahead of them.

**Consequence:** the "see the whole world from spawn" establishing shot in the master reference is *not achievable* with this camera. That concept art implies a ~90–100° horizontal FOV. Planning the world as if that shot were reproducible would produce a world that reads correctly in screenshots and fails in play, especially on mobile.

This plan therefore designs for **sequential reveal along paths** rather than a single establishing view, and raises a camera proposal (§13) as an OPEN decision.

---

## 1. World Vision

One continuous meadow in warm low sun, closed by hills and haze, with four handmade places scattered through it that someone clearly still uses. Not a hub with four rooms — a field you walk across, where you keep noticing things.

The design targets, in order:

1. **Legible from a distance.** Every destination is identifiable by silhouette before any prop is readable.
2. **Sequentially revealed.** The world unfolds as you walk. Nothing is presented as a menu.
3. **Warm and unhurried.** Golden hour is the native state. Evening is the showpiece preset.
4. **Sparse in the right places.** Empty meadow between destinations is deliberate — it makes arrival feel like arrival.
5. **Cheap.** Everything above must hold at 60 FPS on a mid-range phone.

What it must not become: a prop museum, a symmetrical four-corner layout, a fantasy village, or a technically impressive scene with no hierarchy.

---

## 2. Spatial Layout

Fixed yaw means **−Z is "forward" for the entire game**. Content behind the player (+Z) is never seen while walking toward it. The layout is therefore a **fan opening northward from spawn**, which is also what the master reference actually depicts.

```
                     z = -85   ── hills, treeline, backdrop (no collision) ──

                              [ EDUCATION ]
              [ EXPERIENCE ]      birch grove, study desk
              A-frame cabin       (+14, -66)
              (-8, -58)               ·
                   ·                  ·
                    \                /
                     \              /
                      \    main    /
                       \   path   /
                        \        /
          [ PROJECTS ]   \      /        [ ACHIEVEMENTS ]
          hero oak, desk  \    /          dais + shrine
          (-16, -26) ······\··/·········· (+18, -34)
                            \/
                            /\
                           /  \
                    ~~~~~ stream ~~~~~~~~~~~~~~
                          [ PLANK BRIDGE ]
                            ( 0, 0 )
                             SPAWN
                               ▲
                          camera sits here (+Z)
                          and always looks −Z

              x = -50 ←──────────────────────────→ x = +50
```

Distances and bearings from spawn (bearing measured off the −Z axis):

| Destination | Position | Distance | Bearing | Walk time @ 4 u/s |
|---|---|---|---|---|
| **Projects** | (−16, −26) | 30.5 | 31.6° W | ~7.6 s |
| **Achievements** | (+18, −34) | 38.5 | 27.9° E | ~9.6 s |
| **Experience** | (−8, −58) | 58.5 | 7.9° W | ~14.6 s |
| **Education** | (+14, −66) | 67.5 | 12.0° E | ~16.9 s |

Nearest 30.5 and furthest 67.5 sit inside the ranges `docs/01` §12 proposed (25–35, 55–70).

### The reveal sequence this produces

- **At spawn (desktop):** the main path leading north, the stream and bridge underfoot, and the **Experience cabin roofline on the horizon at 7.9°** — dead ahead, small, hazed. Projects (31.6°) and Achievements (27.9°) sit right at the frame edges: partially visible, enough to pull the eye.
- **At spawn (mobile, ±10.8°):** only the path and the distant cabin. Projects and Achievements are off-frame. This is acceptable *because the path visibly forks* — but it means the fork must be visible early and must read as a fork.
- **~10 units north:** the fork resolves. Turning toward either branch swings its destination into the cone within a few steps.
- **Beyond the fork:** Experience and Education are far enough that fog gives them aerial perspective — they read as "there is more out there" long before they are reachable.

### Why this layout and not the alternatives

- **Four corners around spawn** — rejected. Half the destinations would sit behind the camera permanently.
- **Tight fan inside ±15°** — rejected. Everything visible at once, world reads as a corridor, no discovery.
- **Ring / loop path** — rejected. A loop means walking with destinations behind you for half the circuit.

The asymmetric fan gives each destination a distinct approach and keeps every one of them reachable while facing forward.

---

## 3. World Scale

| Element | Approved | Proposed | Reason |
|---|---|---|---|
| Unit scale | 1 unit = 1 m | — | DD-20 |
| Player height | 1.4 | — | DD-20 |
| Walk speed | 4 u/s | — | DD-20 |
| Path width | 1.5–2.5 | — | DD-20 |
| World envelope | ~120 × 120 | — | DD-20 |
| **Playable area** | — | x ∈ [−50, 50], z ∈ [−85, +10] (100 × 95) | Fits the 120 × 120 envelope with backdrop margin; asymmetric because the fan needs depth north, not south |
| **World bound shape** | — | Replace circle r=38.65 with a **rounded rectangle** | A circle centred on spawn wastes the entire southern half |
| Spawn → nearest | — | 30.5 | Inside `docs/01` proposed 25–35 |
| Spawn → furthest | — | 67.5 | Inside proposed 55–70 |
| Hero tree height | — | 9–12 | `docs/01` proposed 8–12; taller end for silhouette against sky |
| Secondary tree | — | 5–8 | |
| Cabin (Experience) | — | 6 W × 5 D × 4.5 H to ridge | Largest built mass; must read at 58 units |
| Desk (Projects) | — | 1.5 × 0.7 × 0.75 | `docs/01` proposed |
| Desk (Education) | — | 1.6 × 0.8 × 0.75 | Slightly larger, more ornate |
| Shrine + dais | — | dais Ø 5, shrine 2.8 H | `docs/01` proposed |
| Stream width | — | 2.5–4 | Crossable at the bridge only |
| Terrain elevation range | — | 0–5 | `docs/01` proposed 0–4; +1 for the Experience rise |
| Bridge | — | 4 L × 2.2 W | Wide enough not to feel like a balance beam |
| **Fog** | — | near 55, far 130 | Current 45/95 would bury Education (67.5) and Experience (58.5) |
| **Camera far** | — | 140 → 200 | Backdrop sits beyond 130 |

Everything in the **Proposed** column is an estimate to be tuned in-engine. None of it is approved.

---

## 4. Destination Designs

### 4.1 PROJECTS — (−16, −26)

*"This is where things get built."*

| | |
|---|---|
| **Silhouette** | Wide dark canopy; low horizontal desk mass beneath it; **one hard rectangle** (the CRT) — the only right-angled object in an organic landscape |
| **Structure** | None. Deliberately unbuilt — an open desk in the meadow |
| **Hero tree** | Hero Oak A — thick twisted trunk, heavy exposed mossy roots, broad canopy overhanging the desk |
| **Props** | Plank desk, CRT (code on screen), keyboard, open notebook with sketch, book stack, mug, jar, carved stool, crate |
| **Path** | Main path **passes directly beside** it — reachable without leaving the trail |
| **First sightline** | Frame-left at spawn on desktop (31.6°); on mobile it appears after ~8 units of walking. Canopy mass reads first, monitor rectangle second |
| **Camera risk** | **MEDIUM.** Canopy at 9–12 m will overhang the camera as the player stands at the desk. Approaching from the south-east puts the trunk between camera and player |
| **Mitigation** | Keep the trunk **north-west** of the desk so the southern approach stays clear; canopy base above 4.5 m so the camera passes under it |

### 4.2 EXPERIENCE — (−8, −58)

*"This is where things get engineered."* Per DD-19, kept firmly distinct from Projects.

| | |
|---|---|
| **Silhouette** | The **only roofline in the world.** A-frame gable with a stone chimney breaking the ridge, dark against sky, on a slight rise |
| **Structure** | Free-standing timber cabin, open front, exposed frame, pitched roof |
| **Hero tree** | Hero Oak B — set **behind and beside** the cabin, never in front. The cabin is the landmark; the tree is its backing |
| **Props** | Heavy workbench, CRT showing **schematics** (not code), shelving with blueprints, gears, spools, jars, tools, leather stool, canvas packs |
| **Path** | A branch **terminates at it** — a place you go to, not past |
| **First sightline** | Visible from spawn, dead ahead at 7.9°, hazed. The one thing the player can see from the start and walk toward |
| **Camera risk** | **HIGH.** The player will walk *into* the open front, putting a wall between camera and player |
| **Mitigation** | Orient the open face **south** (toward +Z, i.e. toward the camera) so the interaction position keeps the player visible through the opening; keep the interactable *at the threshold*, not deep inside. This is the destination that forces camera occlusion handling |

Distinction from Projects is carried by two things: **the roofline** and **schematics vs code**. If either weakens, the two read alike.

### 4.3 EDUCATION — (+14, −66)

*"This is where things were learned."* Explicitly **not** another computer workstation.

| | |
|---|---|
| **Silhouette** | Horizontal desk mass with a distinctive **cluster of small verticals** — globe sphere, astrolabe ring, upright books, quill. Framed by pale birch trunks. **No screen anywhere** |
| **Structure** | None |
| **Hero tree** | Hero Oak A (reused, rotated/scaled) **plus a birch stand of 5–7** — the birches are the distance identifier; no other destination has them |
| **Props** | Carved desk, draped cloth, leather book stack, open celestial-chart book, quill, inkwell, brass astrolabe, globe, magnifier, parchment, round stool, ground journals, scattered autumn leaves (unique to here), **oil lamp** (DD-22, for night) |
| **Path** | Passes to one side, like Projects |
| **First sightline** | Furthest at 67.5. Pale birch verticals read through haze long before any prop |
| **Camera risk** | **LOW.** Birch trunks are thin; canopies are high and airy |

### 4.4 ACHIEVEMENTS — (+18, −34)

*"This is what came of it."* No gravestones — the dedicated reference supersedes the master shot.

| | |
|---|---|
| **Silhouette** | The only **symmetrical architectural** form: a small gabled shrine on a raised circular dais. Instantly non-organic |
| **Structure** | Fitted stone + timber dais with steps; carved stone base, timber posts, gabled cap |
| **Hero tree** | Hero Oak B (reused), overhanging **from one side only** — asymmetric framing against a symmetric object |
| **Props** | Medals on blue/red/green ribbons, gold trophy cup, star and leaf emblems, carved benches, phoenix shield, scrolls, gloves, open book, medallion, **warm uplight** (DD-22) |
| **Path** | **Runs directly onto the dais** and terminates — the only destination the path physically enters |
| **First sightline** | Frame-right at spawn on desktop (27.9°). Ribbon colours are the only red+blue+green in the world — a small saturated accent against green |
| **Camera risk** | **MEDIUM.** The shrine is 2.8 m and central; a player standing behind it (north side) is occluded |
| **Mitigation** | Place the interactable on the **south face** so the natural approach keeps the player camera-side |

### Cross-check: are the four distinct?

| | Projects | Experience | Education | Achievements |
|---|---|---|---|---|
| Built structure | ✗ | **✓ roofline** | ✗ | **✓ shrine** |
| Screen | code | **schematics** | ✗ | ✗ |
| Form | organic/low | angular | organic/low | **symmetric** |
| Distance marker | oak canopy | roofline | **birches** | dais + ribbons |
| Path relation | passes | terminates | passes | **enters** |

Every pair differs on at least two axes. The riskiest pair remains Projects/Experience — mitigated by roofline and screen content.

---

## 5. Asset Inventory

| Asset | Unique | Reuse | Geometry | Material | Instancing | Priority |
|---|---|---|---|---|---|---|
| Player (Explorer 7-B) | 1 | — | GLB, rigged | 1 (atlas) | no | **P0** |
| Terrain | 1 | — | procedural heightfield | 1–2 vertex-coloured | no | **P0** |
| Path surface | 1 | — | procedural ribbon | 1 (shares terrain atlas) | no | **P0** |
| Stream surface | 1 | — | procedural ribbon | 1 custom | no | P1 |
| Hero tree | **2** | ~6 placements | GLB | 1 shared (bark+leaf atlas) | InstancedMesh per part | **P0** |
| Birch | 1 | 5–7 | GLB | shares tree atlas | InstancedMesh | P1 |
| Conifer (mid) | 1 | 20–30 | GLB, low | shares tree atlas | InstancedMesh | P1 |
| Backdrop treeline | 1 | 60–100 | billboard/simple cone | 1 unlit | InstancedMesh | P2 |
| Background hills | 1 | — | procedural, no collision | 1 | no | P1 |
| Rocks | **3** | 40–60 | GLB | 1 shared | InstancedMesh | P1 |
| Grass tuft | **2** | 3–8 k | procedural card/blade | 1 (alpha-tested) | InstancedMesh | P1 |
| Flowers | **4** (lupine, daisy, poppy, clover) | 400–900 | procedural cards | 1 shared with grass | InstancedMesh | P2 |
| Bushes | 2 | 30–50 | GLB low | shares foliage | InstancedMesh | P2 |
| Reeds/cattails | 1 | 40–80 | cards | shares grass | InstancedMesh | P2 |
| Bridge | 1 | — | GLB | 1 timber | no | P1 |
| **Projects set** | desk, CRT, keyboard, stool, crate, props | GLB, one file | 1–2 | BatchedMesh | **P0** |
| **Experience cabin** | 1 | — | GLB | 1–2 | no | **P0** |
| Experience props | shelf, bench, tools, packs | GLB, one file | shares cabin | BatchedMesh | P1 |
| **Education set** | desk, books, globe, astrolabe, quill, lamp | GLB, one file | 1–2 | BatchedMesh | **P0** |
| **Achievements set** | dais, shrine, medals, trophy, shield, benches | GLB, one file | 1–2 | BatchedMesh | **P0** |
| Trail markers | 1 | 3–5 | GLB small | shares timber | InstancedMesh | P2 |

**Totals: ~22 unique authored assets, 8–12 materials.** That is the whole world. Everything else is transform variation.

**Rule of thumb applied throughout:** same geometry + many transforms → `InstancedMesh`. Different geometries + shared material → `BatchedMesh` (confirmed available in current Three via its documented multi-draw path). Neither → plain mesh, and only if the object is unique and important.

---

## 6. Terrain Strategy

**Procedural heightfield generated at load, not an authored mesh.**

- A single `PlaneGeometry` subdivided to roughly **1 unit per quad** over the playable area — about **100 × 95 quads ≈ 19 k triangles**. Displace vertices from a small set of hand-placed Gaussian mounds plus one low-frequency noise octave.
- **Why procedural:** an authored terrain GLB at this size is a large download for data that is a few hundred bytes of parameters. Procedural also means the path and destination pads can query the same height function, guaranteeing props sit exactly on the ground.
- **One mesh, not chunks.** At 19 k triangles chunking buys nothing and costs draw calls. Revisit only if measurement says otherwise.
- **Vertex colours, not textures.** Grass green, path tan, dirt, rock — blended per-vertex. Kills a texture fetch and matches the flat-shaded reference style.
- **Flat-shaded normals** for the faceted low-poly read.
- **Height query** exposed as a pure function so the player controller can follow the ground and props can be placed. This replaces the current flat `y = 0` assumption.
- **Destination pads:** flatten a radius around each destination so desks and the dais sit level. Within ±1.5 of the connecting path (`docs/01` A1).
- **Background hills** are separate, beyond the fog band, no collision, no shadow.

**Deliberately not doing:** terrain LOD, tessellation, splatmaps, displacement textures, chunk streaming. A 19 k-triangle mesh does not need any of it.

---

## 7. Path Strategy

**Authored spline → generated ribbon mesh at load.**

- Author 4–6 **Catmull-Rom splines** as arrays of control points in config. Generate a triangle ribbon along each, sampling the terrain height function so the path lies on the ground.
- **Width 1.5–2.5** (DD-20), varied along the spline — narrower on straights, wider at forks and destination approaches.
- **Organic edges:** perturb the ribbon's edge vertices with low-amplitude noise so it never reads as an extruded strip. This is the single most important detail for avoiding the "generic low-poly demo" look.
- **Vertical offset** of ~2 cm above terrain with `polygonOffset` to avoid z-fighting, rather than cutting the terrain.
- **Topology:** one trunk north from the bridge, forking at ~(−2, −14) into a west branch (Projects → Experience) and an east branch (Achievements → Education). Projects and Education are *passed*; Experience and Achievements are *terminated at*.
- **Vertex-colour blend** at the edges into grass, so there is no hard boundary line.

**Why splines and not a general road system:** four paths need four curves. A procedural road network with intersections, junction meshing and priority rules would be a hundred times the code for the same picture. Splines are authored data, editable by hand, cheap to regenerate.

**Rejected:** decal projection (needs a second render or complex UV projection), texture-painted paths on terrain (loses edge control at this vertex density).

---

## 8. Water Strategy

**One translucent ribbon mesh with a scrolling normal, no reflections.**

- Same spline-ribbon generator as paths — the stream is a path with a different material and a slightly sunken bed.
- **Width 2.5–4**, running roughly east–west in front of spawn then curving north-east between spawn and Achievements.
- **Depth impression** comes from geometry and colour, not from refraction: sink the terrain 0.3–0.5 under the ribbon, place rounded bed stones, and use a shallow depth-based colour ramp toward the banks.
- **Material:** `MeshLambertMaterial`-class with transparency ~0.75 and a single scrolling normal map. Optionally a cheap depth-fade at the banks.
- **Animation:** a UV offset advanced in the frame loop. Two float writes per frame — trivial. This is the one animated material in the world and it earns its place: still water in a stylized meadow reads as dead.
- **Rocks in water:** the same instanced rock set, scaled small, partially submerged. The intersection sells the depth.

| Technique | Verdict |
|---|---|
| Scrolling normal + transparency | **KEEP** |
| Depth-fade at banks | **CONSIDER** — cheap, big readability win |
| Real-time reflection (cube/planar) | **AVOID** — a second render pass for a stream 3 units wide |
| Refraction / screen-space | **AVOID** |
| Physical water simulation | **AVOID** |
| Caustics | **AVOID** |

Night reflections stay perf-gated and optional (`docs/02` B6).

---

## 9. Vegetation Strategy

Lush appearance, controlled cost. The rule: **lush ≠ thousands of unique meshes.**

| Layer | Technique | Count (high tier) | Notes |
|---|---|---|---|
| Ground colour | Terrain vertex colour | 0 objects | The base "grass" is the terrain itself |
| Grass tufts | `InstancedMesh`, 2 card variants | 3 000–8 000 | Placed in a radius around the player, or hand-seeded clusters |
| Flowers | `InstancedMesh`, 4 variants | 400–900 | **Clustered, never uniform** — patches at path edges, around rocks and destinations |
| Bushes | `InstancedMesh` low-poly | 30–50 | Break up ground planes, soften tree bases |
| Reeds | `InstancedMesh` cards | 40–80 | Stream banks only |

Key decisions:

- **Placement is seeded and deterministic**, computed at load from a fixed seed + density map. No authored transform lists to maintain, identical every session.
- **Density map** derived from terrain: no grass on paths, none on destination pads, dense near the stream, sparse in the open meadow (the deliberate emptiness from §1).
- **Alpha-tested, never alpha-blended.** Blended vegetation means sorting and overdraw; tested is one shader branch.
- **Shared material** across grass/flowers/reeds via one small atlas — one draw call per instanced group, not per species.
- **Grass is the primary mobile quality knob** (§17). It is the only thing in the world whose count changes by an order of magnitude between tiers.
- **No wind animation in M4.** A vertex-shader sway is genuinely cheap and would add a lot, but it is polish, not world-building — propose for M10.

**Rejected:** per-blade geometry, GPU compute placement, vegetation LOD chains, `BatchedMesh` for vegetation (instancing is strictly better for identical geometry).

---

## 10. Hero Tree Strategy

**Two unique hero trees. Not four.**

| Asset | Used at | Why |
|---|---|---|
| **Hero Oak A** — broad, low, wide canopy | Projects, Education | The "shelter a desk" tree |
| **Hero Oak B** — taller, narrower, more upright | Experience, Achievements | Backs a structure without competing with its roofline |

Each placement varies by **rotation, non-uniform scale (±15%) and mirroring**, so no two read as copies. Two assets at six placements is the right ratio — four unique heroes would quadruple the modelling budget for a difference nobody perceives at 30+ units.

Tier structure:

1. **Hero** (2 assets, ~6 placements) — full detail, cast shadows, define destination identity
2. **Secondary** (birch, conifer — 2 assets, 25–37 placements) — mid detail, cast shadows selectively
3. **Backdrop** (1 simple form, 60–100) — silhouette only, **no shadow, no collision**, beyond fog
4. **Procedural vegetation** — §9

**Composition rules:**

- A hero tree **frames** its destination; it never stands between the destination and the approaching player.
- Canopy underside stays **above 4.5 m** so the follow camera (4.2 m at scale 1, up to 6.1 m at 1.45) passes beneath rather than clipping into leaves.
- Trunks sit **on the far side** of each destination from the approach path.
- Backdrop trees never break the horizon line where a destination silhouette needs to read against sky.

---

## 11. Time-of-Day Strategy

One world, four presets, zero geometry change (DD-16). Everything below drives the existing single directional + single hemisphere rig, plus fog, exposure and a registered emissive set.

### Morning
Cool sky, warm horizon, sun low from the **east** (opposite Evening) at 15–20°, intensity ~0.75×, soft light shadows, **heaviest daytime fog** — the world dissolves into haze at distance. Emissives **off**. Water bright and cool. Feeling: quiet, fresh, unhurried.

### Afternoon — default
Sun at 40–50°, intensity **1.0 (the baseline)**, balanced ambient, moderate shadows, **lightest fog**, neutral exposure. Paths at maximum readability. Emissives **off**.

**Hard requirement:** every destination must be identifiable by silhouette from its intended discovery point *in this preset*. If a destination only reads because a screen is glowing, the composition is wrong.

### Evening — the showpiece
This is what the references are actually painted in, so it gets the most tuning attention. Sun very low (5–12°) from the **west/north-west**, saturated gold-orange, warm ambient with warm-tinted shadows, **long dramatic shadows** across the meadow, gold-shifted fog producing visible hill layering. **Backlit and rim-lit grass and canopy edges** — the signature effect and the main reason the references look expensive. Emissives begin to lift at low strength.

Practical consequence for asset work: **place hero trees and the cabin so their long evening shadows fall across paths**, not away from them. Shadow direction is a composition tool here, not a side effect.

### Night
Deep blue sky (never black), moonlight from high (55–65°) at ~0.2–0.25×, cool ambient kept high enough that paths remain walkable, highest shadow contrast but softest edges, dark blue fog pulling the horizon in, static star field.

**Emissive set (the complete list, per DD-22):**

| Source | Treatment |
|---|---|
| Projects CRT | Emissive screen + warm amber spill on the desk. Brightest small source |
| Experience cabin interior | Warm amber from the open front. Largest warm mass |
| Education lamp | Warm candle-gold — **the lamp prop is added for this** |
| Achievements dais | Warm gold uplight — **the light source is added for this** |
| Path lanterns | **NOT PLANNED.** Remains open (`docs/02` B9). Not silently added |

Emissive materials first; non-shadow-casting local lights only where emissives alone do not read. **Shadow-caster count stays at exactly 1 in all four presets.**

### Asset implications

- Materials must look correct across a 5× lighting range and both warm and cool ambient. **This forbids baked lighting in albedo** — no painted-in highlights or shadows on textures.
- The emissive set is a **registered list**, not a material scan.
- Preset values live in config as plain data; interpolation runs in the frame loop.

---

## 12. Lighting Strategy

| Light | Role | Shadows |
|---|---|---|
| 1 × directional | Sun / moon. Colour, intensity, direction all preset-driven | **Yes — the only caster** |
| 1 × hemisphere | Sky/ground ambient fill | No |
| ≤ 4 local (night only) | Destination warmth | **No** |

Shadow configuration needs to change: the current ortho frustum is **±30 with far 70**, sized for the 40-unit placeholder disc. A 100 × 95 world needs either a much larger frustum (which destroys shadow resolution) or a **frustum that follows the player**.

**Proposal:** keep the 1024 map, keep a tight ±25–30 frustum, and **move the shadow camera with the player** each frame. Distant geometry loses shadows, which fog hides anyway. Cost: a few vector writes per frame.

**Shadow casting is selective** — hero trees, cabin, shrine, destination props and the player cast. Grass, flowers, small clutter, backdrop trees and background hills do **not**.

| Technique | Verdict |
|---|---|
| Single shadow-casting directional | **KEEP** |
| Player-following shadow frustum | **KEEP** — required by world size |
| Cascaded shadow maps | **AVOID** — multiple passes for a 100-unit world |
| Baked lightmaps | **AVOID** — cannot serve four presets |
| Light probes / GI | **AVOID** |
| Many dynamic lights | **AVOID** |
| Contact-hardening shadows | **AVOID** |

---

## 13. Camera / Occlusion Plan

### Per-destination risk

| Destination | Risk | Cause | Mitigation |
|---|---|---|---|
| **Experience** | **HIGH** | Player walks into the cabin; a wall lands between camera and player | Open face south; interactable at the threshold; **occlusion handling required** |
| Projects | MEDIUM | Hero canopy over the camera; trunk on some approaches | Trunk NW of desk; canopy base > 4.5 m |
| Achievements | MEDIUM | Shrine occludes a player standing north of it | Interactable on the south face |
| Education | LOW | Thin birch trunks, high canopies | Watch trunk clustering on the approach |
| Bridge/stream | LOW | Terrain dips below camera near the bank | Keep banks shallow near the crossing |

### Recommendation

Camera occlusion handling has been deferred since M2 (`docs/03` §9, §23b). **M4 is where it stops being deferrable** — the Experience cabin makes it a functional requirement, not a polish item.

Cheapest sufficient approach, in order of preference:

1. **Fade the occluder.** A short ray from camera to player; anything hit that is tagged fadeable (canopies, cabin walls) drops to ~0.25 opacity. Preferred for foliage — it is what the reference art implies anyway.
2. **Dolly in.** Ease the camera along its existing vector toward the player. Never rotate — that would violate DD-21.

Both are cheap. A single raycast per frame against a small tagged set is nothing.

### The narrow-cone problem — OPEN DECISION

Restating §0: portrait mobile gets a **±10.8°** horizontal cone. The M3 pull-back does not widen it. This is the largest unresolved risk to M4's visual payoff on phones.

Three options, none yet approved:

| Option | Effect | Cost |
|---|---|---|
| **A. Raise FOV on narrow aspects** — vfov 45 → ~62 clamped | hfov 21.7° → ~30° | Mild wide-angle distortion; composition changes |
| **B. Raise camera pitch on narrow aspects** — e.g. `(0, 7.5, 6.0)` = 51° instead of 26.6° | Converts a horizontal-cone limit into a wider ground footprint; world reads more plan-view | Changes composition materially; DD-21 approved offset *scaling*, not re-pitching |
| **C. Accept it** | Mobile is a narrow forward corridor; rely entirely on sequential reveal | Free; mobile visual payoff is materially weaker |

**Recommendation: A + C.** A modest FOV widening plus designing the layout for sequential reveal (which §2 already does). Option B changes the game's look on mobile enough that it should be a designer decision, not an engineering one.

**This needs a decision before the world is composed**, because it determines how wide the fan can be.

---

## 14. Asset Production Pipeline

```
Reference (design/references/)
      ↓  extract silhouette + palette, not pixels
Block-out in engine (primitives, correct scale)      ← validate composition FIRST
      ↓
Model (external DCC)
      ↓  decimate, weld, flat-shade
Optimize (poly budget, single material, no baked light)
      ↓
Export GLB  (Draco or meshopt)
      ↓
public/assets/…
      ↓
Load → share geometry/material → instance/batch
      ↓
World
```

**Block-out first is the important step.** Composition, silhouette and sightlines can all be validated with boxes and cylinders at correct scale, in the real camera, before a single asset is modelled. Getting this backwards is how projects end up with beautiful assets in a world that does not read.

### Conventions

| Convention | Rule |
|---|---|
| Units | 1 unit = 1 metre. Export at scale 1 — never rescale in code |
| Orientation | **−Z is forward** (matches the player and camera) |
| Origin | At the **base centre**, on the ground plane. Trees at trunk centre, desks at footprint centre |
| Up axis | +Y |
| Naming | `category/name.glb` — `trees/hero-oak-a.glb`, `destinations/experience-cabin.glb` |
| Node naming | Stable, lowercase-kebab. Sub-meshes needing instancing get explicit names |
| Materials | Named, shared, minimal. **No baked lighting in albedo** (§11) |
| Textures | Power-of-two, ≤ 1024 for hero assets, ≤ 512 for props, atlassed per category |
| Animation | **Player only.** Nothing else in the world is animated in M4 |
| Collision | Not exported. Authored as primitive volumes in config |

### Poly budgets (proposed)

| Asset | Triangles |
|---|---|
| Hero tree | 2 500–4 000 |
| Birch / conifer | 400–900 |
| Cabin | 1 500–2 500 |
| Shrine + dais | 1 200–2 000 |
| Desk sets (each) | 1 500–2 500 total |
| Rock | 80–200 |
| Bush | 100–250 |
| Grass tuft | 8–16 |
| Player | 3 000–5 000 |

---

## 15. Performance Architecture

| Technique | Verdict | Reasoning |
|---|---|---|
| `InstancedMesh` for vegetation/rocks | **KEEP** | The single highest-leverage decision in M4 |
| `BatchedMesh` for destination prop sets | **KEEP** | Different geometries, shared material → one draw call per set |
| Shared materials across categories | **KEEP** | Every unique material is a state change |
| Procedural terrain + paths + water | **KEEP** | Smaller download, guaranteed alignment |
| Vertex colours over textures | **KEEP** | Matches the flat-shaded style, saves fetches and memory |
| Player-following shadow frustum | **KEEP** | Required by world size |
| Alpha-**test** vegetation | **KEEP** | No sorting, no blend overdraw |
| Frustum culling | **KEEP** (default) | Do not defeat it with one world-spanning instanced mesh — **partition instances into spatial groups** |
| Fog to justify a near far-plane | **KEEP** | Art direction and performance in one |
| Depth-fade at water banks | **CONSIDER** | Cheap, real readability gain |
| Vertex-shader wind | **CONSIDER** (M10) | Cheap and lovely, but not world-building |
| Texture atlasing per category | **CONSIDER** | Do it if material count exceeds ~12 |
| Draco/meshopt compression | **CONSIDER** | Measure first; may not matter at these poly counts |
| Terrain chunking / LOD | **AVOID** for now | 19 k triangles does not need it |
| Cascaded shadow maps | **AVOID** | |
| Post-processing (bloom, DoF, SSAO) | **AVOID** | `CLAUDE.md` §33. The world must look good without it |
| Real-time water reflection | **AVOID** | |
| Baked lightmaps | **AVOID** | Incompatible with four presets |
| Alpha-blended foliage | **AVOID** | Sorting + overdraw |
| Physics engine | **AVOID** | Primitive volumes suffice |
| Streaming / chunk loading | **AVOID** | The world is 100 × 95 |

**Two specific traps to avoid:**

1. **One giant instanced mesh spanning the world defeats frustum culling.** Partition vegetation instances into spatial groups so off-screen groups cull.
2. **Transparency count.** Water plus faded occluders is the entire transparent budget. Nothing else gets to be transparent.

---

## 16. Proposed Performance Budgets

Anchored to the one real measurement available: **36 draw calls with 21 meshes** in M1–M3. Everything else is a target to validate, not a benchmark.

| Metric | Proposed budget | Basis |
|---|---|---|
| **Draw calls (desktop)** | **≤ 120** | ~15 terrain/path/water/backdrop + ~25 instanced groups + ~20 destination batches + player, roughly doubled for the shadow pass |
| **Draw calls (mobile low)** | **≤ 70** | Fewer vegetation groups, shorter draw distance |
| **Triangles (visible)** | 150 k–350 k | Terrain ~19 k + vegetation dominant + assets. Wide range because grass density dominates and is untuned |
| **Materials** | ≤ 12 | Terrain, path, water, bark, foliage, timber, stone, metal, cloth, player, emissive, backdrop |
| **Textures** | ≤ 10 | Atlassed per category |
| **Texture memory** | ≤ 24 MB | ~10 textures ≤ 1024², mipmapped |
| **Shadow map** | 1024 high / 512 low | Unchanged from current |
| **Visible vegetation** | 3 000–8 000 high, 800–1 500 low | The main quality knob |
| **World asset count** | ~22 unique GLB/procedural | §5 |
| **Initial load** | ≤ 6 MB compressed | Terrain/path/water are parameters; GLBs dominate |
| **Time to playable** | ≤ 3 s on broadband desktop | Perceptual target |

**Honest caveats:**

- The M2/M3 FPS numbers (17.8 idle / 18.8 moving) were software WebGL in headless Chromium with no GPU. They are **not** a hardware baseline and must not be compared against M4 numbers.
- **No real-device measurement exists yet.** Every mobile budget above is reasoned, not observed. The first genuine mobile profile should happen at the block-out stage, not at the end.
- Triangle and draw-call budgets are starting ceilings for measurement to refute.

---

## 17. Mobile Quality Strategy

Two tiers. Same world, same geometry, same art direction — one is simply less dense.

| Knob | High | Low |
|---|---|---|
| `dpr` cap | `[1, 2]` | `[1, 1.5]` |
| Grass instances | 3 000–8 000 | 800–1 500 |
| Flower instances | 400–900 | 150–300 |
| Bushes / reeds | Full | ~40% |
| Shadow map | 1024 | 512 |
| Shadow frustum | ±30 | ±20 |
| Fog far | 130 | ~90 (shorter draw distance) |
| Backdrop trees | 60–100 | 30–40 |
| Water animation | Scrolling normal | Static surface |
| Night local lights | Real lights | Emissive only |
| Texture resolution | Full | Half via mip bias |

- **Tier chosen by measured frame time**, not user-agent sniffing (`docs/07` G5).
- **Degradation preserves art direction.** Low tier looks *simpler*, never differently art-directed. Silhouettes, palette, light and composition are identical.
- Tier is selected once after a short warm-up and may step down; it does not thrash.
- No manual quality control in the UI (`docs/07` G6, still open).

---

## 18. Loading Strategy

Three groups, one gate.

| Group | Contents | When |
|---|---|---|
| **Critical** | Player GLB, terrain params, path/water generation, hero tree ×2, 4 destination structures, shared materials | **Blocks entry.** Progress bar reflects this and only this |
| **Secondary** | Secondary trees, rocks, bushes, destination props, bridge, trail markers | After entry, progressively; world is playable meanwhile |
| **Deferred** | Backdrop trees, distant hills, night-only assets | Idle time |

- **Nothing project-specific loads at any point in M4** — no screenshots, no case-study imagery (`CLAUDE.md` §34).
- Terrain, paths and water are **generated, not downloaded** — a few hundred bytes of parameters.
- Progress is real. If it finishes early, transition immediately (`CLAUDE.md` §5).
- A failed secondary asset must not block entry or crash the world (`CLAUDE.md` §42).

**No streaming system.** A 100 × 95 world with ~22 assets does not need chunk streaming, and adding one would be exactly the kind of complexity `CLAUDE.md` §35 forbids.

---

## 19. World Data Architecture

The invariant holds: **`src/game/` must not import `src/data/`.**

```
config/world.ts          spline control points, destination transforms,
                         vegetation density, terrain params
        ↓
src/game/world/          terrain, paths, water, vegetation, props
        ↓
Destination descriptor   { id, position, contentKey, interactionDistance,
                           prompt, approachBearing }
        ↓
        └──► contentKey: 'projects' | 'experience' | ...
                    ↓
             (M5+) interaction system → UI → src/data/
```

The world knows a location **represents Projects**. It never knows what a project is. The `contentKey` is a string; resolving it to content is the UI layer's job, and that layer does not exist yet.

**Fifth-destination test:** adding one should require a new descriptor entry, a spline branch, and a prop set. **Zero engine changes.** If the design ever fails that test, it is wrong.

Proposed structure:

```
src/game/world/
  Terrain.tsx         heightfield + height query
  Paths.tsx           spline → ribbon
  Water.tsx           stream ribbon + scroll
  Vegetation.tsx      instanced groups, seeded placement
  Scenery.tsx         rocks, bushes, backdrop
  destinations/       one component per destination set
  worldConfig.ts      all authored numbers
src/game/time/
  TimeOfDayController.tsx
  presets.ts
public/assets/
  characters/ trees/ destinations/ props/ textures/
```

---

## 20. M4 Implementation Order

Dependency-driven, not category-driven. **The block-out gate is deliberately early** — it is where the plan gets falsified cheaply.

| # | Step | Prerequisites | Risk | Visual importance | Perf risk | Validation |
|---|---|---|---|---|---|---|
| **1** | **Terrain heightfield + height query + new world bounds** | none | MED | HIGH | LOW | Player walks a 100×95 world following ground; bounds hold; no z-fighting |
| **2** | **Paths (spline → ribbon)** | 1 | MED | HIGH | LOW | Paths sit on terrain, edges organic, fork reads |
| **3** | **BLOCK-OUT GATE — primitives at destination positions, correct scale** | 1, 2 | **LOW cost, HIGH value** | — | — | **Walk the whole world. Are sightlines right? Is the fan too wide? Does mobile work? Decide §13 here.** |
| **4** | Camera occlusion handling | 3 | MED | MED | LOW | Player never hidden behind blockout masses |
| **5** | Water | 1, 2 | LOW | MED | LOW | Stream reads as depth; bridge crossing works |
| **6** | Hero trees ×2 + placement | 3 | MED | **HIGH** | MED | Destinations identifiable by silhouette at 30+ units |
| **7** | Destination structures (cabin, shrine, 2 desk sets) | 3, 6 | **HIGH** | **HIGH** | MED | All four distinct per §4 cross-check |
| **8** | Secondary trees, rocks, backdrop | 6 | LOW | MED | MED | Horizon closes; world feels enclosed |
| **9** | Vegetation (grass, flowers, bushes, reeds) | 1, 2, 8 | MED | **HIGH** | **HIGH** | Lush without exceeding draw-call budget |
| **10** | Destination props + interactable anchors | 7 | MED | MED | MED | Props readable close up; `contentKey` wired, no content |
| **11** | Lighting rig + shadow frustum follow | 6, 7 | MED | HIGH | MED | Shadows correct across the world, 1 caster |
| **12** | **Time of Day (4 presets + transitions)** | 11 | MED | **HIGH** | LOW | All four presets; no rebuild; Afternoon readable, Evening beautiful |
| **13** | Night emissives + local lights | 12 | LOW | HIGH | LOW | 4 destinations warm; shadow-casters still 1 |
| **14** | Mobile quality tiers | 9, 12 | MED | MED | **HIGH** | Low tier holds frame rate, art direction intact |
| **15** | Loading groups | 7, 9 | LOW | LOW | MED | Real progress; secondary loads without blocking |
| **16** | **Performance pass — measure, then fix** | all | MED | — | — | Budgets in §16 met or consciously revised |

**Step 3 is the most valuable step in the list.** It costs almost nothing and can invalidate the layout, the fan width and the camera decision before any asset is modelled.

---

## 21. Risks

### HIGH

1. **Portrait mobile's ±10.8° cone.** Structural, unresolved, and it caps how good this can look on phones. §13 needs a decision before composition is locked.
2. **Projects and Experience reading alike.** Both are "desk with a screen under a tree". Separation rests entirely on the roofline and on schematics-vs-code. If either is weakened during modelling, two of four destinations collapse into one.
3. **Camera occlusion at the Experience cabin.** The player walking inside a building with a fixed camera is a functional break, not a cosmetic one. Deferred twice already.
4. **Asset production is the real bottleneck.** ~22 assets in a consistent stylized language is a large art task, and this plan cannot make it smaller. Quality here dominates the outcome.
5. **No real-device performance data exists.** Every mobile budget is reasoned, not measured.

### MEDIUM

6. **Vegetation density is where frame budget gets spent silently.** Needs a hard cap enforced from the start.
7. **Style drift across ~22 assets** — inconsistency will read as "asset pack", the exact "AI slop" failure mode to avoid.
8. **Evening carries the visual promise.** If rim-lighting does not land, the whole art direction underdelivers.
9. **Terrain/path/prop alignment.** Procedural terrain plus authored props means anything mis-sampled floats or sinks.
10. **World bound change** from circle to rounded rectangle touches working M2 code.
11. **Fog range change** (45/95 → 55/130) alters the current look and needs re-tuning against every preset.

### LOW

12. Water scroll being distracting rather than alive.
13. Backdrop trees breaking a destination's silhouette against sky.
14. Instanced groups defeating frustum culling if not spatially partitioned.

---

## 22. Design Critique

Answering the fifteen questions honestly.

1. **Does this look like a real game world?** On desktop, plausibly yes — fan layout, sequential reveal, silhouette-first landmarks are how real exploration games are composed. On portrait mobile, honestly, less so: a ±10.8° cone reads as a corridor no matter what is in it.
2. **Does it avoid AI slop?** The plan does. Whether the *result* does depends almost entirely on asset execution consistency, which no plan can guarantee.
3. **Clear visual hierarchy?** Yes. Hero trees and structures > paths > rocks/bushes > vegetation > backdrop. The one weak point is that Experience is both the most distant and the most important landmark — it has to survive heavy fog to do its job.
4. **Can someone understand where to explore?** Yes on desktop — the path forks visibly and two destinations sit at frame edges. Mobile leans entirely on the path being read as a fork. **That is a single point of failure and should be explicitly validated at the block-out gate.**
5. **Are the four visually distinct?** Three clearly. Projects vs Experience is the weak pair and is called out as HIGH risk.
6. **Does the world feel cohesive?** Shared palette, shared material language, one continuous terrain and one path network — yes, structurally. The risk is asset-level drift, not layout.
7. **Too empty?** Possibly between spawn and Experience — 58 units is ~15 seconds of walking, and the plan deliberately keeps the meadow sparse. This needs a mid-path landmark (a boulder cluster, a trail marker, a bend) or it becomes a commute.
8. **Too busy?** Not at the planned densities. Destination pockets are the only dense areas, which is correct.
9. **Overusing props?** Borderline at Achievements — medals, trophy, shield, scrolls, gloves, book, medallion, benches is a lot for one 5-unit dais. Recommend trimming to the strongest five.
10. **Does the character belong?** Yes — an explorer with a compass, bedroll and rope in a meadow of handmade workplaces is coherent. The 1.4 m proxy already reads at correct scale against the placeholder.
11. **Palette restrained?** Yes, if the four destinations resist gaining individual accent colours. The current placeholder markers are orange/blue/yellow/purple, and that habit must not carry over.
12. **Does amber stay special?** At risk. It is the visor, the joystick active state, the CRT glow, the cabin interior, the lamp, and the dais uplight. That is six uses. At night, four of them are on screen at once. **Recommend: amber is the accent of *light sources and interaction only*, never a surface colour anywhere in the world.**
13. **Does Evening feel beautiful?** It is the best-supported preset — every reference is golden hour. It should be tuned first, with the others derived from it.
14. **Is Night readable without neon?** Planned carefully: ambient deliberately kept above true darkness, emissives preferred over lights, one shadow caster. The failure mode is over-brightening the four warm sources until the world looks like a fairground. Keep them dim and let contrast do the work.
15. **Will it work on mobile?** Geometrically and performance-wise, probably — the budgets are conservative and the tier strategy is sound. **Compositionally, unresolved.** That is the honest answer, and §13 is where it gets decided.

**Biggest weakness overall:** this plan is stronger on systems than on the mobile viewing experience, and mobile is a first-class platform per `CLAUDE.md` §13.

---

## 23. Decisions Needed Before Coding

### APPROVED (already decided, carried into this plan)

- Playable 3D exploration game; world is the navigation (DD-01, DD-02, DD-03)
- References are visual authority (DD-04); master-shot robot obsolete (DD-24); no gravestones
- Four destinations (DD-05); identity from environmental storytelling, no floating labels (DD-06)
- Subtle navigation guidance (DD-07)
- Player 1.4, walk 4 u/s, path 1.5–2.5, world ~120 × 120 (DD-20)
- Third-person follow camera, fixed yaw (DD-21)
- Night uses small warm local lights at destinations; Education lamp and Achievements light approved (DD-22)
- `#F0932B` accent, used sparingly (DD-23)
- Time of Day = 4 presets, no world rebuild, in M4 (DD-14, DD-15, DD-16, DD-25)
- Performance first-class (DD-17)
- Experience = free-standing A-frame cabin with workshop props, distinct from Projects (DD-19)

### PROPOSED (this plan's recommendations — need approval)

| # | Proposal |
|---|---|
| P1 | **Fan layout and the four positions** in §2 |
| P2 | Playable area x ∈ [−50, 50], z ∈ [−85, +10]; **world bound becomes a rounded rectangle** |
| P3 | **Sequential reveal** instead of a spawn establishing shot |
| P4 | Fog 55/130, camera far 200 |
| P5 | Procedural terrain, ~1 unit/quad, vertex-coloured, single mesh |
| P6 | Spline-generated paths and stream with noise-perturbed edges |
| P7 | Water = translucent ribbon + scrolling normal, no reflections |
| P8 | **Two hero trees**, reused across four destinations |
| P9 | ~22 unique assets, ≤ 12 materials; InstancedMesh + BatchedMesh strategy |
| P10 | Player-following shadow frustum, 1024/±30 |
| P11 | Occlusion = fade occluder, fallback dolly-in; **implement in M4** |
| P12 | Budgets in §16 |
| P13 | Two mobile quality tiers (§17) |
| P14 | Three loading groups (§18) |
| P15 | Implementation order in §20, **with the block-out gate at step 3** |
| P16 | Trim Achievements props to the strongest five |
| P17 | Add a mid-path landmark on the long Experience approach |
| P18 | **Amber restricted to light sources and interaction only — never a world surface colour** |

### OPEN (genuinely undecided — must not be assumed)

| # | Question | Why it blocks |
|---|---|---|
| **O-A** | **Narrow-aspect camera: widen FOV (A), re-pitch (B), or accept (C)?** Recommendation: A + C | Determines how wide the fan can be. **Blocks composition** |
| O-B | Path lanterns for night navigation (`docs/02` B9) | Still open; not silently added |
| O-C | Wind animation on vegetation — M4 or M10? | Recommend M10 |
| O-D | Grass placement: player-radius or hand-seeded clusters? | Affects density map and mobile tiers |
| O-E | Draco/meshopt compression — worth it at these poly counts? | Measure at step 7 |
| O-F | Does the player need ground-following now, or stay flat until terrain lands? | Step 1 dependency |
| O-G | Derived scale figures in §3 (tree heights, cabin size, stream width) | Estimates only |
| O-H | Manual quality control in UI (`docs/07` G6) | Still open |
| O-I | Real-device performance targets — no hardware data exists | Blocks meaningful budget validation |

---

## 23b. M4A BLOCK-OUT RESULTS (2026-08-29)

The block-out was built and walked. Status of everything the plan proposed:

### ✅ VALIDATED

| Item | Evidence |
|---|---|
| **Fan layout and the four positions** (P1) | All four reachable; each has a distinct approach and a clear onward sightline to the next |
| **Playable rectangle + rectangular bound** (P2) | x ∈ [−50,50], z ∈ [−85,+10] contains everything; player slides along edges |
| **Path topology and the fork** (P6 partial) | The fork is unmistakable at spawn on **every** tested viewport, including 390 × 844 — this was the flagged single point of failure and it holds |
| **Four distinct silhouettes** | Open desk / A-frame roofline / birch verticals + instrument cluster / symmetric shrine on a dais. Distinguishable at block-out fidelity |
| **Projects vs Experience** (HIGH risk #2) | Clearly separate. Roofline vs open desk carries it even with untextured primitives |
| **Sequential reveal** (P3) | Standing at Projects, the Experience roofline reads clearly ahead; standing at Achievements, Education reads ahead |
| **Mid-path landmark** (P17) | Boulder cluster breaks the long leg and reads as scenery, not a destination |
| **Experience threshold framing** | Stopping at the south threshold gives a perfect composition: player visible, roofline against sky, interior legible |
| **Fog 55/130, camera far 220** (P4) | Destinations at 58 and 67 units stay legible |

### ⚠️ FAILED / CHANGED

| # | Finding | Change made |
|---|---|---|
| **F1** | **The camera could not show sky.** At `lookAtHeight` 1.0 the view axis sat 20.85° below horizontal against a 22.5° half-FOV, leaving **1.65° of sky**. An 8.8-unit hero tree needed to be **160 units** away for its top to be in frame; the world is 95 deep. Every canopy and roofline was clipped at every reachable distance, breaking `docs/01` §13 ("silhouette against sky"). | `lookAtHeight` **1.0 → 2.4**, `fov` **45 → 55**. Camera position, distance, height and yaw all unchanged — only the aim and the lens. Horizon moved from 3% to ~33% of frame height. |
| **F2** | **Portrait FOV**, as predicted (O-A). | `cameraFov(aspect)` added: 55 at aspect ≥ 1.6, ramping to **64** at ≤ 0.5. Horizontal cone at 390 × 844 goes **21.7° → 32.2°**. 70 was also tested and was not needed — 64 is the smallest value at which the fork and both far destinations still read. |
| **F3** | **Hero tree canopies swallowed the frame.** Canopy underside at ~3.0 sat below the camera's 4.2, so the camera flew *through* foliage at Projects and Education; the canopy filled a third of the frame and Education's "LOW" occlusion rating was wrong. | Trunks raised: A 5.2 → **6.4**, B 6.6 → **7.4**; canopy offset removed. Undersides now ~5.0 and ~6.8. |
| **F4** | **Total occlusion failure at Experience.** Walking past the cabin put the camera *inside* the roof — the player was 100% invisible, a full-screen wall of geometry. The plan's mitigation ("open face south, interactable at threshold") works only if the player stops at the threshold, which cannot be assumed. | None in M4A. **Confirms P11 is mandatory, not optional.** |
| **F5** | **The block-out already draws 128 calls** at 1440 × 900 with **zero vegetation**, against a proposed final budget of ≤ 120. ~70 individual meshes, no instancing or batching anywhere. | None. Confirms instancing/batching (P9) is load-bearing, not an optimisation. |
| **F6** | **Canopy clearance cannot be solved by geometry alone.** The mobile camera rises to 6.09 at the 1.45 offset scale, so canopy undersides would need to exceed ~6.5 — which makes trees leggy and fights the references' low spreading canopies. | None. Reinforces F4: fade the occluder. |

### Measured

| Metric | 1440 × 900 | 390 × 844 |
|---|---|---|
| Draw calls (colour + shadow) | **128** | **105** |
| FPS in this browser | 18.4 | 56.1 |
| Console errors | **0** | **0** |

FPS figures are **software WebGL in headless Chromium with no GPU** and are not a hardware baseline. The two numbers differ mainly by pixel count, not by scene cost.

### Observed walk times

Driven through the joystick at exact bearings, full deflection. "Held" includes ~0.9–1.4 s of test-harness scheduling overhead, which is why each run overshot its destination.

| Route | Distance | Expected @ 4 u/s | Held (out) | Held (return) |
|---|---|---|---|---|
| Projects | 30.5 | 7.6 s | 8.65 s | 9.30 s |
| Achievements | 38.5 | 9.6 s | 10.54 s | 11.28 s |
| Experience | 58.5 | 14.6 s | 16.02 s | 16.42 s |
| Education | 67.5 | 16.9 s | 17.72 s | 18.50 s |

Travel speed is consistent with 4 u/s; the overshoot is harness latency, not a movement error.

### Still OPEN after M4A

- **O-B** path lanterns — untouched
- **O-D** grass placement strategy — no vegetation in the block-out
- **O-G** derived scale figures — cabin at 6.2 × 5.2 × 4.6 and desks at ~1.7 wide read correctly against the 1.4 player, but this is a visual judgement, not a validation
- **O-I** real-device performance — still no hardware data
- **New:** does the ≤ 120 draw-call budget survive, or does it need revising upward once instancing lands?

---

## 23c. F4 STATUS (recorded 2026-08-31 — documentation only)

**F4 is OPEN.** No implementation was changed while recording this.

What exists in the build today:

| Element | State |
|---|---|
| Occlusion ray | **Implemented.** `src/game/camera/FollowCamera.tsx` casts from the look-at point toward the desired camera position each frame |
| Response | **Dolly-in only.** Camera eases closer along the same vector; floor `MIN_CAMERA_DISTANCE` 2.4, `OCCLUDER_MARGIN` 0.55. Yaw untouched — DD-21 intact |
| Registered occluders | **Experience structure and Achievements structure only** (`<group name="occluders">` in `Destinations.tsx`) |
| Fade the occluder (**P11's preferred treatment**) | **Not implemented.** Dolly-in is the documented *fallback*, and it is what shipped |
| Tree canopies as occluders | **Not registered.** F3 raised trunk heights instead; F6 concluded geometry alone cannot solve canopy clearance and called for fade |
| Re-walk validation against the F4 failure case | **Not recorded.** The walk that produced F4 has not been repeated since the ray landed |

Why this does not close F4:

- The F4 failure was the camera ending up **inside the cabin roof**. A 2.4-unit floor means that when the player stands deep inside a structure, the camera can still be pulled to a position that is itself inside the geometry — dolly-in bounds the distance, it does not guarantee an unobstructed sightline.
- F6 explicitly concluded that **fade**, not geometry or distance, is what F4 needs.
- No measured evidence exists either way. "Implemented" is not "verified".

**F4 stays open until the cabin approach is walked again and the player is confirmed visible throughout.** Nothing here authorises that work.

---

## 23d. F4 CLOSED (2026-09-18)

The orbit camera (DD-28) made occlusion a functional requirement rather than a deferred one, and F4 was re-walked against it.

What changed since §23c:

| Element | State |
|---|---|
| Registered occluders | **Structures and trees.** `World.tsx` wraps the whole tree layer in a `group` named `occluders`, so hero trees, birches, conifers and the backdrop all block the camera — F3/F6's canopies included |
| Occlusion rays | **Two, parallel.** One from the orbit centre (above the head), one from chest height. The orbit centre's ray alone cleared the cabin's roof edge while the roof still hid the body |
| Response | Dolly in immediately, ease back out. The camera stops short of the nearer hit and **never past it**: the old 2.4-unit floor, which is what put the camera inside the cabin, is gone |
| Cost | ~0.03 ms per ray measured against 262 instanced trees plus the structures; two rays per frame |

**Re-walk evidence.** Eight positions around the cabin, a full 360° orbit at each in 45° steps, plus a raised-pitch sweep from the two positions behind it — 80 samples. At every one: the player's chest projected inside the frame, no occluder face lay between the camera and either the chest or the head, and no camera position was inside geometry (tested against front *and* back faces). Failures: 0. Partial occlusion: 0.

**Fade the occluder (P11's preferred treatment) is still not implemented.** Dolly-in now covers the failure F4 described, so the fade is a polish item rather than a correctness one.

**Known limitation.** Standing hard against a wide trunk and orbiting into it pulls the camera right in (measured 0.13 units in the worst case beside Hero Tree A). That is the honest result of "never pass a surface" with no fade: the alternative is the camera inside the trunk. Procedural trees without colliders make it easier to reach than it should be. Fade (P11) or trunk colliders on the remaining procedural trees are the fixes.

---

## 24. Recommended Next Action

> **Superseded by §23b — the block-out has been built and walked.** The next action is now **M4B step 4: camera occlusion handling**, which finding F4 upgraded from deferred polish to a blocking requirement. The original recommendation is kept below for context.

**Build the block-out (step 3), not the terrain.**

Concretely: place primitive stand-ins — boxes and cylinders at the proposed dimensions — at the four destination positions on the existing flat placeholder ground, extend the world bound to the proposed rectangle, and walk it at 1440 × 900 and 390 × 844.

That single session answers the questions that actually gate M4:

- Is the fan too wide for the camera cone?
- Does the path fork read on a phone?
- Is the Experience approach a pleasant walk or a commute?
- Does the layout survive **O-A**, and which option does it need?
- Do Projects and Experience read as different places from their block-out silhouettes alone?

It costs a few hours, touches no assets, and can invalidate §2 before anything expensive is built. Modelling ~22 assets against an unvalidated layout is the single most expensive mistake available here.

**Do not start terrain, assets or Time of Day until the block-out has been walked and O-A is decided.**
