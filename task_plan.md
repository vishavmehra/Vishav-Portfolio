# Task Plan: Environment quality pass — rock family, then river

## Goal
Replace the rock asset family with five authored, geologically convincing GLBs
(A small rounded, B medium boulder, C large boulder, D low wide, E tall angular),
integrated through instancing at the existing instance count; then rebuild the
river as a genuinely flowing, GLB-animated stream (or remove it).

## Current Phase
Phase 13 (game to portfolio handoff)

## Next Step
Re-run the crossing and watch the reveal, once the peer session's fix to
`src/portfolio/threeui-reference/liquidMetal.ts` lands and `/portfolio` stops throwing.

### Phase 1: Audit
- [x] Back up current GLBs, blends and river sources (.backup/2026-09-22-env-quality)
- [x] Render old rocks/bushes/river stones from 4 angles on grass ground
- **Status:** complete

### Phase 2: Rock family in Blender
- [x] Shared stone palette + material (atlas, sRGB, roughness 0.92)
- [x] Rock A small rounded 0.38×0.27×0.24 m, 80 tris
- [x] Rock B medium boulder 0.75×0.67×0.72 m, 150 tris
- [x] Rock C large boulder 1.69×1.45×1.48 m, 228 tris
- [x] Rock D low wide 1.63×1.07×0.58 m, 160 tris
- [x] Rock E tall angular 0.65×0.53×1.24 m, 208 tris
- [x] 5 headings × 3 camera heights per rock + true-scale lineup (9 iterations, scratchpad/rocks-v1..v9)
- **Status:** complete

### Phase 3: Export + GLB verification
- [x] Export public/assets/3d/rock-a..e.glb (10.9/17.9/25.6/18.9/23.1 KB)
- [x] Inspect GLBs: 1 node, identity transform, origin at ground, unit normals, opaque single-sided stone mat
- **Status:** complete

### Phase 4: Runtime integration (rocks)
- [x] Vegetation.tsx: 5 URLs, ROCK_MIX weights, trim, same seed/draws; scatter kept out of channel (<2.6 m); seatOnSlope()
- [x] worldConfig framing/landmark: variant+scale remap only (positions unchanged)
- [x] HeroScene rock-b scale 0.6→1.17, 0.34→0.66 (new B is half the old size) — flag in report
- [x] Runtime screenshots rk-*/rk2-*: no errors, no failed requests
- [x] Perf: 108→91 instances, 6,350→12,898 rock tris, 3→5 draw calls (+shadow), GLBs 26.9→96.4 KB
- **Status:** complete

### Phase 5: Gameplay collision (user clarified: "volume" = collision volume)
- [x] Read CollisionSystem / worldColliders / player movement (XZ circle/box registry, slide response)
- [x] Audit: existing = destinations, trailhead, bridge rails, hero trees, birch. Missing = rocks, bushes, conifers, river stones
- [x] Capsule shape added (resolver + debug overlay + unit test); propPlacements.ts shared by render + colliders
- [x] Footprints measured (tools/collider-measure.mjs); 26 → 220 colliders
- [x] Runtime QA: 21 representatives × 8 directions, closed-loop steering: min clearance ≥ −0.01 m everywhere; profile contact shots fit
- [x] Cost 1.8 µs per resolve
- **Status:** complete

### Phase 6: Controls UI + distant trees (user, 23 Sep)
- [x] Controls card: viewport-aware max-height, fixed header, scrollable list, wrapping rows
- [x] Verified at 10 viewports incl. 1024×420 and 320×380: no clipping, no overflow, close button always visible
- [x] Distant trees: own hazed palette, shorter trunks/lower crowns, rebuilt GLBs (126/130 tris)
- [x] Backdrop stands moved inside the terrain rectangle (they were hanging off the ground edge east/west)
- [x] Sky dome now follows the camera (radius 150): fixed the black wedge of missing sky at the world edge
- **Status:** complete

### Phase 7: Bush family (authored) — user, 23 Sep
- [x] art/blender/bush-set/bush-a..d.blend + GLBs (218–258 tris, 20–23 KB)
- [x] Several overlapping foliage clusters on visible stems, ragged rims, dark interiors
- [x] Colliders re-measured for the new shapes; procedural buildShrub removed
- **Status:** complete

### Phase 8: River rebuild — KEEP flowing or REMOVE
- [x] DECISION: KEEP. Authored in WORLD space from the game's own stream (tools/river-data.mjs → Blender)
- [x] river.blend + river.glb: water 5,980 tris, flow 3,804 tris, 26+2 sparse morph targets, 605 KB
- [x] GLB verified independently (tools/glb-animation.mjs): one 24 s clip, 577 keys, loop gap 0
- [x] Runtime: plain load + AnimationMixer; river.ts, buildRibbon and the water material deleted
- [x] Terrain: gentle banks cut to the asset's waterline, carve extended past both ends, shore painted from the waterline
- [x] QA 5/10/20/30 m, bridge approach/centre/side, upstream/downstream; bridge crossing re-tested
- **Status:** complete

### Phase 7: Bushes visual rebuild (audit proved defective) — after river
- **Status:** pending

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Rocks first, river second | Latest brief: "Do not change the river yet" |
| Build rocks by plane-cutting an irregular mass, not by deforming an icosphere | Brief bans icosphere/radial topology; plane cuts give large primary planes |
| Keep existing placements, remap variants only | Brief: keep instance count, no composition change |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| Blender `result` must be dict | 1 | wrap lists in dict |
| bpy.context.object missing after read_homefile in same exec | 1 | build ground via data API |
| glTF export: context has no active_object after read_homefile | 1 | clear data manually + temp_override, no read_homefile |
| Rock v1–v8 visual fails (triangle soup, snowman lobes, die-like facets, sawn faces, boxy C, jitter starbursts) | 8 | iterated: plane faceting, fused masses, random skewed cuts, companion planes, non-orthogonal cuts, no jitter |

### Phase 9: Supplied structures (designer-supplied GLBs)
- [x] education-cabin.glb replaces the Education table; projects-shack.glb replaces the Projects desk
- [x] Materials re-authored (cabin was metallic + 0.4 grey = black; shack specular tint 2.0)
- [x] Cabin texture re-graded toward the world's timber palette
- [x] Colliders and interaction radii/prompt heights replaced for both destinations
- [x] Placement audit tool; 3 trees moved out of the stream and out of the cabin
- [x] Runtime QA: 6 approach directions blocked each, screenshots at Morning/Afternoon/Auto, 0 errors
- **Status:** complete

### Phase 10: Night wayfinding (lanterns + trail markers)
- [x] Authored lamp-post.glb in Blender (hewn post, iron bracket, hanging cage)
- [x] Authored trail markers, rebuilt once after designer rejection
- [x] Runtime: pooled lights, halo cue, night-factor curve off timeOfDay
- [x] Marker left / lantern right composition; colliders; placement audit clear
- [x] QA: night + day at 7/16/30 m per destination, mobile, transitions, build
- **Status:** complete

### Phase 11: Backdrop and water (targeted fix)
- [x] Distant trees replaced by the production tree GLBs at full detail
- [x] Blender-authored mountain ranges replace the procedural domes
- [x] River flow: mixer restart bug fixed + shader-driven surface flow
- [x] QA: horizon day/night from four headings, river motion measured, build passes
- **Status:** complete

### Phase 12: Entry / title screen
- [x] EntryRig owns the camera during loading/landing; blends into the gameplay pose, no cut
- [x] Beige loader removed; scrim opens on real progress over the live world
- [x] Name as Componentry particle typography in the Signature face, fitted responsively
- [x] Entry by click, tap or X; circular indicator; HUD gated on `ready`
- [x] QA: 3 desktop + 4 mobile sizes, reduced motion, 0 errors
- **Status:** complete

### Phase 13: Game to portfolio handoff
- [x] Found the beige: `.exit-wash`, the game's own loading colour on a fixed 520 ms timer
- [x] Shared handoff layer above both routes (`src/ui/transition/`), mounted in the root layout
- [x] Readiness gate: route changes under the cover, cover holds until the arriving world paints
- [x] Cover rebuilt as a `@property` aperture after two box-based attempts drew a visible rectangle
- [x] `body`, `themeColor` and the canvas's first-frame haze aligned to `#0d1310`
- [x] QA: 5 viewports — covered at route change, one loader, layer self-removes
- [ ] Watch the reveal in the browser (blocked: `/portfolio` throws in `threeui-reference/liquidMetal.ts`)
- **Status:** in_progress

