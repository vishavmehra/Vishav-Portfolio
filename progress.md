# Progress

## 2026-09-22
- Backed up rock/bush/river GLBs, blends, river sources to .backup/2026-09-22-env-quality.
- Audit renders: scratchpad/audit/*.png (rocks, bushes, river stones × 4 angles).
- Runtime river shots taken (shot-*.png) for the later river pass.
- Started rock family rebuild.
- Rock family built (scratchpad/scripts/build_rock_family.py, embedded in each .blend). 9 review iterations; renders in scratchpad/rocks-v*.
- Exported rock-a..e.glb; old rock-set.blend removed from source (copy in .backup).
- Rocks integrated. Seating check: 1 rock (D on stream cut bank, 14,-9) still shows 6 cm edge gap; small stones on steep mounds up to 65% buried on the uphill side.
- Removed 17 scatter rocks that stood in/at the stream channel (existing placement defect).
- Runtime QA shots rk-*.png, rk2-*.png. Camera goes near top-down at some staging spots (canopy occlusion) — harness artefact.
- Collision: capsule shape; propPlacements.ts; colliders for rocks (A only ≥0.25 m tall), bushes, conifers (skirt at body height), bank river stones. In-water river stones and small stones deliberately step-over.
- Collision QA harness .playwright-mcp/env/collide-*.js (closed-loop steering, warm-up, bringToFront). All 21 families stop the player at contact from 8 directions.
- Projects approach rock (framing, on the trail edge) now narrows the trail to ~1.4 m — authored composition, flagged.

## 2026-09-23
- Controls card fixed (viewport-aware, scrollable list); verified at 10 viewports.
- Distant trees rebuilt with a hazed palette; stands moved inside the terrain; sky dome follows the camera.
- Bush family authored (art/blender/bush-set); colliders re-measured; procedural shrub removed.
- River rebuilt in world space as an authored animated GLB; runtime bend/ribbon deleted; bridge now sits over the water.
- Bridge QA after the new carve: 115/122 deck frames crossing, rails still block sideways entry, wading peaks at 4.99 m/s.
- Structures: supplied log cabin replaces the Education table, supplied stilt shack replaces the Projects desk (art/blender/education-cabin, art/blender/projects-shack; 12k/14k tris, 536/648 KB).
- Cabin rendered black: the supplied glTF material was metallic (metallicFactor unwritten = 1) with a 0.4 grey baseColorFactor. Metallic 0, factor removed, texture re-graded toward the world's timber. Shack's 2.0 specular tint normalised.
- Colliders: projects-desk/stool and education-desk/stool replaced by shack (1.49 x 1.38) and cabin (1.69 x 2.30) boxes. 6 approach directions each, all blocked at 0.000 m clearance.
- Interaction radius/prompt height raised for both (4.2/4.6 and 4.6/2.9) — they are buildings now, not tables.
- tools/placement-audit.ts (new) flagged 3 authored trees standing in the stream or inside the cabin; all three moved (hero oaks to -26,-19.5 and 27,-18; birch to 9.6,-65.6; the Education oak to 19.2,-70.2). Audit clear.
- tools/ts-resolve.mjs (new) lets node --experimental-strip-types load the app's extensionless/@ imports.
- Build, typecheck and the 7 node:test suites pass. Screenshots: st-*.png, cab2-*/cab3-*.png, sc-*.png.
- Night wayfinding: authored lamp-post.glb (196 tris, 16 KB) + trail markers sign-boards.glb / sign-text.glb (43 / 24 KB), sources in art/blender/lamp-post and art/blender/trail-signs.
- First sign pass rejected by the designer (rectangular board, glowing amber type, "UI label in 3D"); rebuilt from scratch: single hewn post, irregular split plank, pegs, brace, painted parchment lettering.
- Lanterns moved to the visitor's right of each marker (the marker was hiding the lamp); signs could not go left without standing on the trail.
- Pooled point lights (2 of 4 lanterns lit, intensity 34 x night factor), constant-size halo points, flame on its own emissive material so the shack/cabin practicals were not dragged brighter.
- New colliders: 4 lamp posts, 4 marker posts. Build, typecheck and node tests pass; placement audit clear.

## 2026-09-24
- Markers rebuilt again to the designer's reference sheet: arrow-cut plank (chevron points at the destination), cross timber on the post head, brace, pegs at the joint, parchment #E8DFC9 lettering. 132 + ~115 tris each.
- Composition swapped to the designer's call: marker on the visitor's RIGHT, lantern on their LEFT, both ~4.9 m from the destination, every plank end >= 1.45 m off the worn path.
- Four lamps added at the bridge: north pair at (+-1.7, -7.1), south pair at (+-2.8, -14.2) — the south pair is wider because the trail forks at z -14 and the deck-corner spots stood in the branches.
- Pooled lights raised 2 -> 3 so both lamps at a bridge end light the crossing.
- Peg on the chevron side was landing on the first letter; moved below the text band and re-exported.
- QA: no console errors, 73-75 draw calls, lights 32.6 each at night / 0 by day, placement audit clear, 7/7 node tests.
- Backdrop trees: tree-distant-a/b.glb dropped from the world, buildDistantTree deleted. The treeline is now the same hero/birch/conifer GLBs as the near world (246 backdrop trees, conifer-heavy), stands walked along the terrain edge because the playable rect leaves only a 12-15 m band.
- Mountains: art/blender/mountains -> mountains.glb, three continuous ridges (112/132/152, 768 tris each) replacing the 26 overlapping domes that drew the white seams. Rendered with materials.distant, merged to one draw call. Two build errors caught and fixed: authored Y-up when Blender is Z-up (exported sideways, invisible), then too tall/dark (read as a wall behind the trees).
- River: the mixer was frozen on frame 0 — actions were played in a useMemo but stopped by an effect cleanup, so React's double-invoke left them stopped. Start and stop now live in the same effect. Added a shader flow (two sine bands along the stream direction, onBeforeCompile on a cloned water material) so the surface moves, not just the marks.
- Verified: 562k tris, 59-63 draw calls, 73-95 fps desktop, 0 console errors; flow vertex travels 1.74 m downstream in 2.4 s.
- Entry screen rebuilt: EntryRig (src/game/entry) owns the camera during loading/landing with an authored shot of the real world, 14 s forward drift, pointer parallax, 190 drifting motes; it blends out into the gameplay camera's own pose over 1.7 s, so there is no cut and no second scene.
- LoadingScreen rewritten as a layer over that shot: scrim opening with real progress, wordmark, hairline progress + small percentage, ENTER WORLD on dark glass. Beige surface, cell bar and the three loading lines removed; body background now deep forest so the first paint is never pale.
- WhenEntered gates the HUD (compass, joystick, interact, controls, exit) on 'ready' — with the world in frame they would otherwise sit on the title.
- Fixed a latent flake found in QA: if the fade's transitionend never fired the overlay stayed mounted invisibly; a 1.2 s fallback timer now removes it. Re-ran 393x852 three times, clean.
- QA: 3 desktop + 4 mobile sizes, 0 errors, 0 failed requests, no overflow, reduced motion, build passes.


## 2026-09-25
- Traced the beige frame between the game and the portfolio to `.exit-wash` in globals.css: a parchment sheet (#f2e9d8, the game's own loading colour) faded over the game on a fixed 520 ms timer in ExitHud before `router.push('/portfolio')`. It had no idea whether anything was ready behind it, so a slow first portfolio frame showed through as an unpainted page. No timing value fixes that — the cover has to wait.
- Replaced it with a shared handoff layer above both routes: `src/ui/transition/handoff.ts` (idle/covering/holding/revealing, four transitions per crossing, nothing published per frame) and `WorldHandoff.tsx`, mounted in `app/layout.tsx` after `{children}` so the route change happens underneath it. `body`, `themeColor` and GameCanvas's first-frame HAZE all set to #0d1310.
- Readiness gate: `reportWorldReady()` for a scene that wants to say so, plus a rAF watcher that needs no cooperation. First version of the watcher matched the game's own canvas and opened the cover before the route had changed; it now holds the leaving canvas and requires `location.pathname === destination` plus a different canvas with real size. 3.2 s backstop so a visitor is never trapped behind the cover.
- The cover drew a hard rectangle across the middle of the screen — twice. Scaling the element shrank the dark along with the hole; moving `background-size` left a seam where gradient-over-fill met fill alone. Both are the same bug: the green was painted in a box smaller than the viewport. Rebuilt with no box at all — one radial gradient covering the whole element, animated through a registered `@property --iris` radius, so the aperture closes from the edges with nothing to butt against. Cover lengthened 460 -> 620 ms; the radius eases near-linearly so it reads as air closing rather than a snap.
- Verified the aperture against a high-contrast checkerboard at 1440x900, where any seam shows as a straight line across the squares: clean at every point in the close.
- Crossing QA at 1366x768, 1440x900, 1920x1080, 390x844, 430x932 — on all five the cover is still up when the route changes (`phase: holding`), never more than one loader on screen, and the layer removes itself afterwards.
- Could not watch the reveal: `/portfolio` throws at runtime in the peer session's `src/portfolio/threeui-reference/liquidMetal.ts:26` (missing semicolon before an IIFE -> `TypeError: [] is not a function`), and the Next dev error overlay renders above every layer. Also flagged to them: the threeui-reference scene logs `THREE.WebGLProgram: Can not resolve #include <encodings_fragment>` ~2000x per load (that chunk was removed in three r152; the project is on 0.185), and `body:has(.threeui-reference-root)` is rgb(56,59,52), noticeably lighter than the cover.
- `npx tsc --noEmit` clean.
