# Findings

## Old asset audit (Blender renders, grass-green ground, 4 angles)
- rock-a slab: 120 tris, 2.52×1.8×1.11 m. Layered slab with a tan/sand top face — reads as a stone plinth from above.
- rock-b boulder: 70 tris, 1.46×1.24×1.06. Two-piece, tan top on one piece, grass-green moss cap on the other — green top merges with terrain.
- rock-c cobble: 34 tris, 0.73×0.63×0.54. Single faceted lump, D20-like.
- bushes a–d: 62–96 tris each, one faceted green polyhedron cluster; leaf_mid #4d6a2c ≈ terrain green. Read as green rocks. FAIL.
- river stones a–d: 48–72 tris, neutral grey, readable; c is deliberately flat (submerged). Retained (river brief: do not touch).
- grass/flowers: blade/cluster assets, read fine.

## User reference image (stone arch bridge over a shallow stream)
- Water: shallow and clear. Lighter (sky/sand-tinted) in the shallows, deeper blue-teal in the channel. A visible ripple/caustic network, with the surface pattern stretched along the flow.
- Stones in the water: many small rounded pebbles scattered through the shallows, plus a few larger rounded boulders breaking the surface. Grass tufts grow in the shallows.
- Banks: pale sandy/gravel ground, rounded boulders clustered at the edges, shrubs. No walls: ground slopes into the water.
- Rocks: ROUNDED, weathered granite-like boulders, pale warm grey with darker crevices and a few broad flat faces. No sharp crystal chunks. This is the target read for the rock family: rounded masses with broad soft planes and occasional fractures.
- The bridge in the reference is stone arches (ours is the approved timber bridge; do not change it).
- Stylized adaptation: keep our muted palette (no bright cyan); take from the reference the shallow-edge lightening, scattered pebbles, rounded boulders and flow-aligned ripples.

## Pipeline
- Palette atlas 256², 8×8 cells, sRGB, Closest, roughness 0.92, metallic 0, backface culling.
- Rocks instanced via useInstancedGLB (merges all meshes; single material required).
- Vegetation.tsx: ROCK_URLS[3], ROCK_SCALE [0.62,0.72,1.15]; scatter maps variant 0 (slab) → 1.
- worldConfig: DESTINATION_FRAMING.rocks variants 1/2; MID_PATH_LANDMARK slab(0)+boulders.

## River terrain facts
- Stream length 106.67 m (STREAM_PATH, 49 pts).
- Water surface is NOT monotonic: -0.28 (t0) → +0.15 (t.16) → -1.74 (t.45) → -1.14 (bridge t.5) → -1.86 (t.55) → +0.16 (t.75–.81) → -0.7 (t1).
- 0.6 m hump at the bridge from path-corridor flattening in naturalHeightAt.
- A monotone surface would need ~1.3–2 m cuts (canyon) — rejected by brief. Plan: flow speed follows local slope (riffles downhill, near-still pools uphill).
- BRIDGE_BASE = heightAt(bridge) → tied to water surface at bridge.

## River design decisions (for Phase 6, recorded before the collision interrupt)
- Replace brown bank strips + apron with gentle terrain banks; water sheet extends ~0.8 m under the bank; shoreline = terrain ∩ water.
- GLB animation via morph targets: water mesh = 2 quadrature swell pairs (travelling wave); flow mesh = 12 groups × (travel, shrink) + stone foam pulse. Loop T = 24 s, periods divide T.
- Flow W→E (+t). Speed = base × width factor × smoothed slope factor (clamped 0.3–2.0), smoothed ±4 m so the bridge hump does not switch speed abruptly.
- Vertex colours for water (shared verts keep morph data small), flatShading at runtime.
- Terrain: world ground 170 m square centred z −38 → x ±85; stream ends at x ±52 inside the terrain; fog near 66–74 m. The river ends are inside the terrain and need a treatment (sink under the bank).
