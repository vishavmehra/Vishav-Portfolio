# 07 — PERFORMANCE BIBLE

> **Status:** Standing constraint across every milestone
> **Authority:** `CLAUDE.md` §27–§34, §64.
> **Last updated:** 2026-08-29
> **Related:** [01_WORLD_DESIGN_BIBLE.md](01_WORLD_DESIGN_BIBLE.md) · [04_TECHNICAL_ARCHITECTURE.md](04_TECHNICAL_ARCHITECTURE.md)

---

## 1. Performance is product

A beautiful experience that runs poorly is a **failed implementation** (`CLAUDE.md` §2). Performance is not a phase at the end — it is a constraint on every decision from the first commit.

### Priority order

1. **Mobile performance** — the hardest target, and a first-class platform
2. **Smooth movement** — input latency and frame consistency matter more than peak frame rate
3. **Low memory** — mobile browsers kill tabs
4. **Fast initial load** — time to playable
5. **Controlled draw calls**
6. **Optimised assets**
7. **Minimal React re-rendering**

### Targets

| Platform | Target |
|---|---|
| Desktop | ~60 FPS where practical |
| Modern mobile | Smooth 60 FPS where practical |
| Lower-end devices | Graceful quality reduction — never unusable |

**ASSUMPTION —** no specific device matrix, load-time budget, or draw-call ceiling has been set. Concrete budgets should be established from measurement during Milestone 4, when real world geometry exists. Needs approval.

## 2. The measurement rule

> **Measure → identify the bottleneck → fix that bottleneck → measure again.**

- **Do not optimise by adding complexity without measured benefit** (`CLAUDE.md` §64).
- Do not blindly rewrite working systems (`CLAUDE.md` §58).
- Do not pre-optimise cold paths. Optimise hot ones.
- An optimisation that makes the architecture worse and the frame time the same is a regression.

Tools available: Chrome DevTools MCP for runtime/performance/memory, Playwright for regression, `renderer.info` for draw calls and triangle counts.

## 3. Geometry reuse

- **Share geometries** across every instance of a repeated object. A rock type is one geometry, used many times.
- Merge static geometry where it is genuinely static and shares a material — terrain decoration, path stones, ground clutter.
- Keep poly counts driven by **silhouette**, not detail. The reference style is clean low-poly; visual quality comes from composition and light (`CLAUDE.md` §27).
- No high-poly assets. No subdivision. No decorative geometry that does not change the silhouette.

## 4. Material reuse

- A small, shared material palette across the whole world — timber, rock, foliage, grass, water, path, metal accents.
- **Reuse material instances.** Do not create a new material per mesh.
- Prefer the cheapest material that achieves the look. The reference style is flat-shaded — `MeshLambertMaterial` or an equivalently cheap model is usually correct. `MeshStandardMaterial` only where its cost is justified.
- Avoid unnecessary transparency — transparent materials cost sorting and overdraw.
- Avoid a large count of unique materials. Every unique material is a state change.

## 5. Instancing

Prime candidates, in expected order of impact:

| Element | Notes |
|---|---|
| Grass tufts | Highest count by far; the main mobile quality knob |
| Flowers | Clustered, several species |
| Rocks | 3–4 base meshes, varied by rotation/scale |
| Trees | Per type; canopies are heavy |
| Bushes | |
| Path stones | |

Rules:

- Instance where the count is genuinely high. **Do not instance where it complicates the architecture without meaningful benefit** (`CLAUDE.md` §31).
- Instanced counts are a per-quality-tier setting (§13).
- Frustum culling must remain effective — avoid one giant instanced mesh spanning the whole world if it defeats culling.

## 6. Textures

- **Smallest resolution that looks correct.** The flat-shaded style needs far less texture data than realism.
- Prefer vertex colours and flat material colour over textures wherever the look allows — the cheapest texture is no texture.
- Compressed formats (KTX2 / Basis) where textures are genuinely needed. **ASSUMPTION —** compression tooling is not yet set up; needs approval when asset production begins.
- No 4K textures. No large atlases unless measurably justified (`CLAUDE.md` §27).
- Mipmaps on. Anisotropy conservative.
- Dispose textures that are genuinely no longer needed — but note that the world is never unloaded, so most world textures live for the session by design.

## 7. Models and assets

- **GLB/GLTF**, Draco or meshopt compressed where it helps.
- One file per logical asset; avoid monolithic scene files that force loading everything.
- Strip unused data on export — cameras, lights, extra UV sets, unused animation tracks.
- Character: a single rigged GLB with two clips (idle, walk). No IK, no extra rigs (see [03](03_GAMEPLAY_AND_INTERACTION.md) §5).

## 8. Loading strategy

```
INITIAL  ──  only what is needed to enter the world
             terrain · character · destination props · core materials
                        ↓
             real progress → loading screen
                        ↓
             world visible, player in control
                        ↓
ON DEMAND ─► project screenshots · architecture imagery · detail assets
```

- **Nothing project-specific loads during initial page load** (`CLAUDE.md` §34).
- Detail content is fetched when a window opens.
- Progress is **real**. Never padded to display the animation (`CLAUDE.md` §5).
- A failed non-essential asset must not block entry to the world.

## 9. Shadow strategy

- **Exactly one shadow-casting light** — the sun/moon directional light. This does not increase at any time of day, including night (DD-22).
- Tight orthographic shadow frustum around the playable area. Milestone 1 currently uses ±30 units with `far` 70.
- Modest shadow map size — 1024 is the current baseline. **ASSUMPTION —** 512 on the low-quality tier; needs approval.
- `PCFShadowMap` explicitly (Three r185 deprecated the `PCFSoftShadowMap` default).
- Shadow casting is **selective**: hero trees, structures, destination props and the player cast. Grass, flowers, small clutter and distant backdrop geometry do **not**.
- Night's local warm lights **never cast shadows**.

## 10. Lighting strategy

- One directional light + one hemisphere light. That is the whole daytime rig.
- **Night (DD-22):** a strictly limited set of **small warm local lights at important destinations**. Preference order — emissive materials first, then **non-shadow-casting** local lights where emissives alone do not read. Avoid excessive glow, neon, expensive post-processing, and any growth in shadow-casting light count (see [02](02_TIME_OF_DAY.md) §8).
- No global illumination, no light probes, no area lights, no many-light setups (`CLAUDE.md` §32).
- Baked/static approaches preferred wherever they hold up across four time-of-day presets — which is the real constraint on baking here.

## 11. Fog

Fog is doing double duty and must be tuned deliberately:

- **Art direction** — atmospheric depth, the layered look of the references.
- **Performance** — it justifies pulling the far plane in and closing the world without a visible edge.

Fog colour is time-of-day driven. Far distance should sit close enough that distant geometry can be simple, cheap, and few.

## 12. Frame loop rules

Non-negotiable (`CLAUDE.md` §29, §30):

- ❌ **No React state for per-frame values.** `setState(playerPosition)` every frame is a defect.
- ❌ **No allocation inside `useFrame`** — no `new Vector3()`, no `new Color()`, no array literals, no object literals. Pre-allocate module-level or ref-held temporaries and mutate them.
- ❌ No per-frame `console.log`.
- ❌ No per-frame material or geometry mutation that forces re-upload.
- ✅ Frame-loop → React only when a **discrete value changes** (active interactable id, window state), guarded by a ref holding the last value.
- ✅ Time-of-day interpolation runs in the frame loop, never through React.
- ✅ Proximity checks use squared distance, and may be throttled to every few frames.

## 13. Mobile quality scaling

Graceful degradation, not a separate build (`CLAUDE.md` §28).

**ASSUMPTION — the following tiering is a proposal and needs approval:**

| Knob | High | Low |
|---|---|---|
| `dpr` cap | `[1, 2]` | `[1, 1.5]` |
| Grass instance count / radius | Full | Reduced |
| Flower / clutter density | Full | Reduced |
| Shadow map | 1024 | 512, or shadows off |
| Water animation | On | Static surface |
| Night local lights | Real lights | Emissive only |

- Tier selection should be based on **measured frame time**, not user-agent sniffing.
- **ASSUMPTION —** no manual quality control is exposed in the UI. Needs approval.
- Degradation must preserve the art direction. A low tier looks simpler; it never looks broken or differently art-directed.

## 14. Post-processing

**Not the default** (`CLAUDE.md` §33).

- No bloom, no depth of field, no motion blur, no SSAO, no screen-space effects.
- **The world must look good without them.** The references achieve their quality through composition, light and colour — all of which are free.
- Any effect proposed later requires explicit visual justification *and* a measured mobile cost.

## 15. Draw calls

- Minimise via shared materials, shared geometries, instancing, and merged static geometry.
- Watch `renderer.info.render.calls` during Milestone 4 as real geometry lands.
- Milestone 1 baseline for reference: **7 draw calls**.
- **ASSUMPTION —** no target ceiling set. Establish one from measurement once the real world exists. Needs approval.

## 16. Memory

- Reuse geometries, materials and textures — the single biggest lever.
- Dispose anything genuinely discarded; note that the world itself is never discarded by design.
- **No leaks:** every event listener, animation subscription, timer, observer and loader callback is cleaned up on unmount (`CLAUDE.md` §28, item 20).
- Windows opening and closing repeatedly must not accumulate memory. This is a specific thing to test.
- Time-of-day switching allocates nothing.

## 17. Bundle size and code splitting

- Next.js App Router with Turbopack; static prerender for the entry route (already the case).
- Import from Three.js selectively — avoid pulling in unused subsystems.
- **Code-split the portfolio UI** away from the game bundle where it helps time-to-playable: the window system and section renderers are not needed until the first interaction.
- Every dependency is a bundle cost. `CLAUDE.md` §36 applies as much to bytes as to complexity.
- **No audio library, audio runtime or sound assets are loaded** during the gameplay and world milestones — audio is deferred (DD-27), which keeps both the bundle and the memory footprint smaller through M2–M8.
- **ASSUMPTION —** no bundle-size budget set. Needs approval.

## 18. Pre-merge performance review

Before considering any significant feature complete (`CLAUDE.md` §64), answer:

- [ ] Did this introduce unnecessary rendering?
- [ ] Did this introduce unnecessary React state?
- [ ] Did this add a dependency?
- [ ] Did this increase draw calls?
- [ ] Did this create per-frame allocations?
- [ ] Did this increase initial load?
- [ ] Does it work on mobile?
- [ ] Can the implementation be simpler?

Any "yes" that is not justified means simplify before finishing.

## 19. Open assumptions requiring approval

| # | Assumption |
|---|---|
| G1 | No device matrix, load-time budget or draw-call ceiling set — establish from measurement in Milestone 4 |
| G2 | Texture compression tooling (KTX2/Basis) not yet set up |
| G3 | Shadow map drops to 512 on the low tier |
| G4 | The quality-tier table in §13 |
| G5 | Tier selection by measured frame time, not user-agent |
| G6 | No manual quality control exposed in the UI |
| G7 | No bundle-size budget set |
