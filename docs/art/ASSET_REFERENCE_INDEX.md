# ASSET REFERENCE INDEX

> **Canonical map between reference image files and the world elements they define.**
> **Location:** all reference images live in `design/references/` — see the path note below.
> **Last updated:** 2026-09-18 — C-1 … C-6 closed (DD-30 … DD-35); scale and material/rendering rules added; three approach references assessed

---

## Path note

The brief specified `docs/art/references/`. The images are actually in **`design/references/`**, which is also the path cited as the visual authority throughout `docs/01`, `docs/08`, `docs/09` and `docs/10`.

I renamed them **in place** rather than relocating, because moving them would invalidate citations in four approved documents. Say the word and I'll move the folder and update every reference in one pass.

All files are in one flat directory, as requested.

**⚠️ Index is behind the folder (noted 2026-08-31, updated 2026-09-18).** `design/references/` holds **34 files**. This index catalogues **28** in the library below, plus **3** destination approach references assessed during the C-1…C-3 audit. **3 remain uncatalogued** and are deliberately not given a Priority, Importance or authority rating — that is a design ruling, not a documentation repair.

---

## Scale rule — read this before opening Blender

**DD-33.** One rule, no exceptions:

| | |
|---|---|
| **Authoritative scale** | Explorer Unit 7-B = **1.4 units**; **1 unit = 1 metre** (DD-20). No reference image changes this |
| **What the sheets give you** | Silhouette, construction, proportion, material, detail. **The human figures are visual reference figures, not measurements** — they fail `docs/10` §14's own spec ("Explorer Unit 7-B (1.4 units) beside the asset"), and they disagree with each other across the set (C-9) |
| **Where dimensions come from** | `docs/01` §12 · the block-out figures in `docs/09` §4 · the per-asset entries in `docs/10` §10–§11. Never from a sheet |
| **How to author** | At world scale. Origin at base centre on the ground plane, −Z forward, +Y up, **export at scale 1 — never rescale in code** (`docs/10` §15) |
| **How to check** | `docs/10` §18: "Scale correct against a 1.4-unit reference." Put a 1.4-unit stand-in beside the asset in Blender before export |
| **Fallback only** | If an asset has **no** documented dimension and a sheet is the only source: read it proportionally against that sheet's figure as **1.8 m**, then **world = sheet × (1.4 / 1.8) ≈ 0.78**. Round sensibly, then confirm the silhouette from the gameplay camera. A figure read as 1.7 m would instead give 0.82 — which is exactly why this is a last resort, not the normal path |

Worked example: the shrine is **2.8** because `docs/09` §4.4 says 2.8 — not because anything was measured off a sheet.

---

## Material and rendering rule — read this before opening Blender

**DD-34 and DD-35.** What every new asset ships with, and what it must never ship with:

| | |
|---|---|
| **Base colour** | **Required.** One palette atlas — the shipped set is **256 × 256, 8 × 8 cells, ~1.5 KB** — with per-face UV cells. All painted value lives here |
| **Materials** | **One per atlas family**, named for it: `bark-foliage`, `timber`, `stone`. A second only for a genuinely different surface (desk `screen`, Explorer `visor`/emissive) |
| **Roughness / metalness** | **Scalar constants only.** `metal = 0`, `rough ≈ 0.92` for matte world surfaces. **Never a map** |
| **Normal map** | ❌ **Never.** `docs/10` §5: "No normal maps … the style is painted, not lit-by-texture" |
| **AO map** | ❌ **Never.** Contact shading is painted into palette cells |
| **Specular / MR texture** | ❌ **Never.** "Universal rule: matte. Minimal specular. No plastic sheen anywhere" |
| **Alpha** | Not used. Every approved asset is `OPAQUE`. If ever needed: **alpha-tested, never blended** (`docs/10` §6) |
| **Geometry style** | **Faceted, flat-shaded, palette-coloured.** Silhouette complexity high, surface complexity low |
| **What "painterly" means** | The **way the sheets are drawn** and the **value language** to reproduce (base → highlight → shadow, warm light, cool shadow). **Not** a brief to paint texel detail. Grain, grooves and birch lens marks become **palette cells and geometry** |
| **Never drift to** | Photorealism · generic low-poly asset-pack styling · plastic materials · visual noise |

**The board's "Roughness" row is not a map request.** Every cell on `material-reference-board.png` is a painted colour swatch; that row paints each material in its dulled state. `VISUAL_STYLE_EXTRACTION` §5 reads it correctly: the five-channel structure *is* the hand-painted language.

**Evidence:** the nine approved GLBs each carry exactly one 256 × 256 base-colour PNG, no normal map, no AO map, no MR texture, `metal = 0`, scalar roughness. Verified by reading the files.

---

## Library

**28 files, 27 unique.** 20 new production sheets and composition references, 8 earlier concepts.

| File | Category | Represents | Priority | Reference Type | Importance | Notes |
|---|---|---|---|---|---|---|
| `hero-tree-a-production-sheet.png` | Trees | Hero Tree A — broad spreading oak | P0 | Production Asset | **Critical** | Front/side/¾/silhouette, root-base detail, bark + foliage close-ups, palette, low-poly construction. Scale figure is a **1.73 m human**, not Explorer 7-B. Garbled AI label text — ignore wording, read intent. |
| `hero-tree-b-production-sheet.png` | Trees | Hero Tree B — leaning umbrella-crown oak | P0 | Production Asset | **Critical** | 5 views incl. rear + silhouette. Branch/bark/canopy close-ups. Explicit material guidance: *vertex colours for foliage variation, alpha masking on foliage planes, hand-paint trunk and large branches*. Character in "scale with Explorer Unit 7-B" panel is a **human boy**. |
| `birch-tree-production-sheet.png` | Trees | Birch — Education's distance identifier | P0 | Production Asset | High | **Only sheet with exact hex values:** bark `#F1EDEA`, markings `#6A6763`, foliage light `#C2E0AA`, foliage mid `#A8D18C`, branch `#8C7C6D`. Says *alpha blending* for foliage. |
| `conifer-set-production-sheet.png` | Trees | Conifer — small 3 m / medium 7 m / tall 12 m | P1 | Production Asset | High | Explicit LOD chain **1000→500→250 tris**. Shared bark+needle atlas. "Muted palette for subordination" — must not compete with hero trees. **Only sheet whose scale figure actually resembles Explorer Unit 7-B.** |
| `experience-cabin-production-sheet.png` | Experience | A-frame engineering workshop | P0 | Production Asset | **Critical** | 4 views, interior entrance, roof construction, timber, stone chimney, prop arrangement. **Depicts an ENCLOSED cabin with a door** — conflicts with the approved open-south-face requirement. See C-1. |
| `projects-workstation-production-sheet.png` | Projects | Outdoor developer desk + CRT | P0 | Production Asset | **Critical** | Pedestal desk with drawers, tower PC, mouse + mat, coiled cable, mug with painted "PROJECTS" logo. Contains a **Spider-Man action figure — third-party IP, do not reproduce**. |
| `education-study-production-sheet.png` | Education | Birch study workstation | P0 | Production Asset | **Critical** | Globe, astrolabe, oil lamp (lit), leather books, quill + inkwell. Birch is the hero tree here. Material note: *hand-painted diffuse maps only*. |
| `achievements-shrine-production-sheet.png` | Achievements | Timber shrine on stepped stone dais | P0 | Production Asset | **Critical** | Enclosed display niche with certificate, medals, trophy, astrolabe. Restrained carving, brass trim. Material note: *diffuse + AO/specular*. **This is the authoritative Achievements design.** |
| `bridge-production-sheet.png` | Props | Small wooden footbridge | P0 | Production Asset | **Critical** | Answers the M4B bridge weakness directly: underside cross-bracing, **river-bank connection**, irregular planks, single handrail, vegetation at both ends. Also a strong secondary water reference. |
| `rock-set-production-sheet.png` | Props | 8-form stylized rock set | P0 | Production Asset | High | Named forms (slab, tapered obelisk, jagged cluster). **~450–900 vertices per rock.** Explicit reuse strategy: instance small forms, combine large ones, vary moss per instance. |
| `vegetation-library-production-sheet.png` | Props | 10-species meadow vegetation library | P1 | Production Asset | High | **Per-species poly budgets:** grass tuft 120, tall grass 35, clover 15, daisy 12, lupine 25, meadow flower 75, low shrub 74, fern 15, stream grass 25, reed cluster 28. Adds fern, tall grass, stream grass, buttercup to our vocabulary. |
| `prop-library-production-sheet.png` | Props | 14 shared props + 3 example arrangements | P1 | Production Asset | High | Crate, barrel, rope, tools, gears, jars, books, notebook, papers, blueprints, lamp, mug, trophy, medal, plaque. States **player scale ≈ 1.8 m** and *hand-painted diffuse only, minimal specular*. |
| `stream-water-production-sheet.png` | Environment | Shallow stream — top, cross-section, ¾, details | P0 | Production Asset | **Critical** | Answers the M4B water weakness completely: irregular riverbed, visible submerged stones, varying depth, muddy banks, transparency showing bed, reed layering at waterline. |
| `material-reference-board.png` | Materials | 16 materials × 5 channels | P0 | Material Reference | **Critical** | Base / Highlight / Shadow / Roughness / Small-surface-detail for meadow grass, dry grass, soil, path dirt, warm timber, aged timber, bark, pale birch bark, stone, mossy stone, brass, aged metal, cloth, leather, water, dark interior wood. **The master material language.** |
| `distant-background-reference.png` | Environment | Horizon, hills, atmospheric layering | P1 | Composition Reference | High | Layered rolling hills, mountain silhouettes, distant forest clusters, two-tone haze (warm peachy near-horizon, cool blue far). "Minimal surface detail to prevent competition". |
| `environment-master-composition.png` | Composition | All four destinations in one scene | P0 | Composition Reference | **Critical** | Shows spatial relationships, stream + bridge, **a wooden signpost at the path junction**. Flat-faceted low-poly style — noticeably simpler than the painterly production sheets. See C-6. |
| `environment-golden-hour-mood.png` | Style | Golden-hour atmosphere, Projects in foreground | P0 | Style Reference | **Critical** | **The single best atmosphere reference.** Demonstrates that most of the "premium" quality comes from light and haze, not geometry. Low close camera, dense foreground vegetation, amber CRT glow as the only saturated accent. |
| `experience-environment-composition.png` | Experience | Cabin in environmental context | P1 | Composition Reference | High | Outdoor workbench with blueprint, "ENGINEERING SUPPLIES" crates, lit oil lamp, framing trees, **carved "EXPERIENCE" signpost**. |
| `education-environment-composition-cabin-variant.png` | Education | Education as an A-frame cabin | Reference-only | Composition Reference | **Contested** | **Conflicts with the approved design and with Experience.** Depicts Education as an A-frame cabin nearly identical to the Experience cabin. See C-2. Retained for its prop and framing language only. |
| `achievements-environment-composition-gothic-variant.png` | Achievements | Achievements as a Gothic stone chapel | Reference-only | Composition Reference | **Contested** | **Superseded by** `achievements-shrine-production-sheet.png`. Ornate Gothic mausoleum reads funerary; also wrongly reuses Education's desk/globe/astrolabe props. See C-3. |
| `explorer-unit-7b-character-sheet.jpg` | Character | Explorer Unit 7-B | P0 | Character Reference | **Critical** | **Authoritative for the player** (DD-24). Cream helmet, single amber visor slot, olive tunic, brass compass, expedition pack. Gender-neutral, no facial features. |
| `environment-meadow-master-annotated.jpg` | Composition | Original annotated world overview | P1 | Composition Reference | Medium | Establishes fan layout and destination placement. **Floating text labels are annotation, not design.** Its gravestone-like Achievements markers and brass robot character are both rejected. |
| `environment-meadow-master-annotated-duplicate.jpg` | — | Byte-identical duplicate | — | — | — | **Exact duplicate** (MD5 verified). Safe to delete; retained pending your call. |
| `environment-meadow-field-reference.jpg` | Environment | Pure meadow — terrain, path, stream, vegetation | P1 | Environment Composition | High | Still the best reference for terrain rolling, path meander and flower clustering. |
| `projects-workstation-early-concept.jpg` | Projects | Earlier Projects concept | P2 | Composition Reference | Medium | **Superseded by** the production sheet. Retained for the gnarled-tree and stream-adjacency framing. |
| `experience-workshop-early-concept.jpg` | Experience | Earlier workshop concept | P2 | Composition Reference | Medium | **Superseded by** the production sheet. Shed-built-into-roots idea already rejected by DD-19. |
| `education-study-early-concept.jpg` | Education | Earlier study concept | P2 | Composition Reference | Medium | **Superseded by** the production sheet. Retained for autumn-leaf ground detail and celestial-chart book. |
| `achievements-shrine-early-concept.jpg` | Achievements | Earlier shrine concept | P2 | Composition Reference | Medium | **Superseded by** the production sheet. Retained for the dais/bench arrangement and medal ribbons. |

---

## Uncatalogued — present on disk, not yet assessed

Six files added after this index was written. Filenames suggest their subject; **no authority, priority or supersession status has been assigned, and none should be inferred.** Until they are ruled on, the catalogued references above remain the operative ones.

| File | Filename suggests | Status |
|---|---|---|
| `environment-master-art-direction-board.png` | Master art-direction board | **Uncatalogued.** May overlap or conflict with `environment-master-composition.png` (see C-6) |
| `environment-master-art-direction-board-variant-b.png` | Variant B of the above | **Uncatalogued.** Two boards labelled "master" is itself a conflict to rule on |
| `projects-environment-approach.png` | Projects approach view | **Uncatalogued.** Would bear on M8 (destination approach shots). Not examined in the C-1…C-3 audit — Projects carries no open contradiction |

**Action needed:** confirm what these three are and how they rank against the catalogued set.

---

## Approach references — assessed 2026-09-18

Three of the six uncatalogued files were examined as evidence for C-1, C-2 and C-3. They are rated here **only** for what that audit established; nothing else about them is ruled on.

| File | Represents | Reference Type | Weight | Finding |
|---|---|---|---|---|
| `experience-environment-approach.png` | Workshop seen from the approach path | Composition Reference | **Partial** | **Resolves** the opening question — doors fully open, lit interior legible from the path. **Adds a third massing** — a gabled barn with vertical walls, not the DD-19 A-frame, which DD-30 does **not** adopt. Despite the filename it is a **full art-direction board**, not an approach shot: same template as the file below, titled "Explorer Unit 7-B — Master Art-Direction Reference Board", with tree, material and prop panels. Its figure is a stand-in human (C-9) |
| `education-environment-approach.png` | Study desk beneath birches, from the approach | Composition Reference | **Confirming** | **Resolves** C-2 in favour of the desk: no structure anywhere in the scene, and its own props panel labels the destination "Education desk". Same board template and same stand-in human as above |
| `achievements-environment-approach.png` | Timber shrine on its dais, from the approach | Composition Reference | **Confirming** | **Resolves** C-3 in favour of the timber shrine, and is a genuine approach view — no board furniture. Shows the **actual Explorer Unit 7-B** (cream helmet, amber visor, olive tunic, pack) on the path, the only reference in the library that does. Satisfies **M8 for Achievements** |

**Two filenames are wrong.** The Experience and Education files are master art-direction boards whose hero panel happens to show that destination. Treat them as boards, not as approach shots — the M8 "destination approach shots" gap is still open for Projects, Experience and Education.

---

## Duplicates and supersession

| Relationship | Files |
|---|---|
| **Exact duplicate** | `environment-meadow-master-annotated-duplicate.jpg` = `environment-meadow-master-annotated.jpg` (MD5 identical) |
| Superseded by production sheet | `projects-workstation-early-concept.jpg`, `experience-workshop-early-concept.jpg`, `education-study-early-concept.jpg`, `achievements-shrine-early-concept.jpg` |
| **Rejected** (2026-09-18, DD-32) | `achievements-environment-composition-gothic-variant.png` — rejected on the no-funerary rule, not merely superseded. Do not use for form, props or framing |
| **Reference-only** (2026-09-18, DD-31) | `education-environment-composition-cabin-variant.png` — its structure is not adopted; retained for prop and framing language only (bench, stacked books, lamp, signpost) |

**Nothing was deleted.** All originals retained.

---

## P0 asset coverage

Judged on whether a reference conveys silhouette, proportions, construction, materials, detail and scale — not on whether the asset merely appears somewhere.

| # | P0 Asset | Status | Assessment |
|---|---|---|---|
| 1 | **Explorer Unit 7-B** | **COMPLETE** | Formal turnaround with palette and spec panel. |
| 2 | **Hero Tree A** | **COMPLETE** | 4 views + silhouette + root base + bark/foliage close-ups + palette + construction. Only gap: scale figure is a human. |
| 3 | **Hero Tree B** | **COMPLETE** | 5 views + silhouette + three close-ups + explicit material guidance. |
| 4 | **Experience Cabin** | **COMPLETE** | Views, interior, roof, chimney, timber and props are all covered. **C-1 closed by DD-30** — enclosed A-frame, south opening with doors standing open, interactable at the threshold. Form is settled; the only remaining blocker is C-4, which affects every asset equally. |
| 5 | **Projects Workstation** | **COMPLETE** | 4 views, CRT close-up, desktop surface, prop arrangement, materials, palette. Remove the IP action figure. |
| 6 | **Education Study Area** | **COMPLETE** | The desk sheet is complete and excellent. **C-2 closed by DD-31** — outdoor desk, no structure; the cabin variant is Reference-only. Form is settled; the only remaining blocker is C-4. |
| 7 | **Achievements Shrine** | **COMPLETE** | Production sheet is thorough: 4 views, dais, niche, props, carving, materials. Gothic variant explicitly rejected. |
| 8 | **Bridge** | **COMPLETE** | Views, underside construction, bank connection, wood material detail. |
| 9 | **Rock Set** | **COMPLETE** | 8 forms, three detailed with 3 views each, vertex budget, reuse strategy. |

**9 COMPLETE · 0 PARTIAL · 0 MISSING** (was 7 · 2 · 0 — the two PARTIAL cases were blocked by design contradictions, not missing artwork, and those contradictions closed on 2026-09-18).

**No P0 asset is blocked.** Everything that gated production closed on 2026-09-18: form (DD-30 … DD-32), scale (DD-33, *Scale rule* above), materials and rendering target (DD-34, DD-35, *Material and rendering rule* above). What remains open — C-7 alpha (moot today), C-8 signposts (a product call), C-9 scale figures (artifact) — gates nothing.

---

## P1 coverage

| Asset | Status |
|---|---|
| Birch | **COMPLETE** — with exact hex values |
| Conifer | **COMPLETE** — with LOD chain and heights |
| Vegetation library (10 species) | **COMPLETE** — with per-species poly budgets |
| Prop library (14 props) | **COMPLETE** — with arrangements |
| Stream / water | **COMPLETE** |
| Distant background | **COMPLETE** |
| Material board | **COMPLETE** |
| Workshop interior props | **COMPLETE** — within the Experience sheet |
| Shrub / fern | **COMPLETE** — within the vegetation library |

---

## Contradictions

Recorded, **not resolved**. Approved project decisions take priority over any image.

### C-1 — Enclosed cabin vs open south face `HIGH` · ✅ **CLOSED 2026-09-18 by DD-30**

- **Reference A:** `experience-cabin-production-sheet.png` (titled "ENCLOSED ENGINEERING WORKSHOP", front view with a solid door) and `experience-environment-composition.png`.
- **Reference B:** `docs/01` §16 ("open-fronted … dark interior with tools and shelving visible"), `docs/09` §4.2 (open face south, interactable at the threshold), `docs/10` §10.3 ("South face open … interior depth must be readable from outside"), and `docs/09` finding F4.
- **What the images actually show.** Read rather than summarised, the two sides converge. The production sheet's own **panel 5** draws the door **standing open** with the workbench and blueprint visible through it. `experience-environment-composition.png` draws the door open and puts the working props — workbench, blueprint, crates, lamp — **outside** at the threshold. `experience-environment-approach.png` draws the workshop from the player's approach with its doors fully open and the interior legible at approach distance. "Enclosed" describes the massing; the docs describe the opening.
- **Decision (DD-30).** Enclosed A-frame massing, **full-height south opening with doors modelled standing open**, interactable at the threshold on the meadow side. Interpretations (a) and (b) together; (c) is not needed.
- **Not adopted.** `experience-environment-approach.png` draws a **gabled barn with vertical walls**, not the DD-19 A-frame. That massing is rejected; the board counts as evidence for the opening only.
- **Camera note.** F4 is closed (`docs/09` §23d), but that 80-sample re-walk was taken around the **currently open-fronted** cabin. Rays are cast outward from the player, so standing deep inside a closed room pulls the camera into the room at very short range. The threshold rule, not the occlusion fix, is what protects the framing.

### C-2 — Education as a cabin `HIGH` · ✅ **CLOSED 2026-09-18 by DD-31**

- **Reference A:** `education-study-production-sheet.png` — outdoor desk beneath a birch. Matches all approved documentation.
- **Reference B:** `education-environment-composition-cabin-variant.png` — an A-frame cabin **nearly identical to the Experience cabin**.
- **Correction to the original framing.** Reference B does **not** propose a cabin *instead of* the desk. It draws the **same desk**, with globe, astrolabe and quill, standing in front of a cabin. No reference asks for the desk to be removed; the variant only adds a structure.
- **New evidence.** `education-environment-approach.png` shows Education from the approach as the desk beneath birches, no structure, and labels it "Education desk" in its own props panel.
- **Decision (DD-31).** Outdoor study desk, **no structure**. Cabin variant stays Reference-only for prop and framing language (bench, stacked books, lamp, signpost) and contributes no silhouette. The A-frame it adds is the Experience cabin, and adopting it would cost two of the five distinctness axes in `docs/09` §4.

### C-3 — Gothic chapel vs timber shrine `HIGH` · ✅ **CLOSED 2026-09-18 by DD-32**

- **Reference A:** `achievements-shrine-production-sheet.png` — modest timber shrine, restrained carving, brass trim, open display niche, stepped circular stone dais.
- **Reference B:** `achievements-environment-composition-gothic-variant.png` — spired stone chapel with flanking turrets and an arched niche over a plinth.
- **New evidence.** `achievements-environment-approach.png` confirms the timber reading at the distance that matters — shrine, shingled gable, stepped dais, open display bay, path running onto it — and is the **only reference in the set showing the actual canonical Explorer Unit 7-B** on the approach rather than a stand-in human.
- **Decision (DD-32).** Production sheet authoritative. The Gothic variant is **rejected on the standing no-funerary rule** (`docs/01` §18 "explicitly not funerary" and §20's prohibited-forms list, `docs/10` §10.5, O-1) — not merely superseded by a later sheet. Education's globe, desk and quill in that image are an AI artifact and never appear at Achievements.

### C-4 — Player scale `HIGH` · ✅ **CLOSED 2026-09-18 by DD-33**

- **Reference A:** every new sheet uses a **1.7–1.8 m human** as the scale figure (prop sheet states "Player Scale approx 1.8 m").
- **Reference B:** DD-20 — Explorer Unit 7-B is **1.4 units**, and it is a stocky ~2.5-head robot, not a human.
- **Why this was never a real conflict.** `docs/10` §14 already specifies what a scale panel must contain — "Scale reference — **Explorer Unit 7-B (1.4 units)** beside the asset, same scale". The human figures fail the pipeline's own spec, disagree with each other across the set (C-9), and therefore cannot be measurements on any sheet. The sheets were never the source of size: `docs/01` §12, `docs/09` §4 and `docs/10` §10 carry the world dimensions, already Explorer-scaled and walked against the 1.4 player.
- **Decision (DD-33).** Sheets are **proportional**; documents supply dimensions; assets are authored at world scale and validated against a 1.4-unit reference. Option (b) — revisiting player height — is rejected; DD-20 stands. Option (a)'s ×0.78 survives only as a **fallback** where no documented dimension exists.
- **Confirmed in practice.** Both hero trees, birch, bridge, Projects desk and the rock set were all authored directly at world scale and validated in the running world. None needed rescaling.

### C-5 — Material workflow, four-way conflict `MEDIUM` · ✅ **CLOSED 2026-09-18 by DD-34**

| Reference | Says |
|---|---|
| `hero-tree-a-production-sheet.png` | diffuse + **roughness** + **normal** + alpha |
| `rock-set-production-sheet.png` | diffuse + **normal/AO** |
| `achievements-shrine-production-sheet.png` | diffuse + **AO/specular** |
| `education-study-production-sheet.png` | **hand-painted diffuse maps only** |
| `prop-library-production-sheet.png` | **hand-painted diffuse only, minimal specular** |
| `material-reference-board.png` | includes a **Roughness** row for all 16 materials |
| `docs/10` §5 (mine) | diffuse only, no normal, no roughness |

**Decision (DD-34): palette base-colour map + scalar roughness, nothing else.** `docs/10` §5 already said it ("No normal maps … No metalness/roughness maps"), and `VISUAL_STYLE_EXTRACTION` §12's authority order puts approved documents above sheets. The board's "Roughness" row is a **painted swatch**, not a map request.

**Verified against the shipped set** — Explorer, Hero Tree A, Hero Tree B, Birch, Bridge, Projects Desk, Rock A/B/C: one 256 × 256 base-colour PNG each (~1.3–1.7 KB), **zero** normal / AO / metallic-roughness textures, `metallicFactor = 0`, scalar roughness 0.92 (0.82 / 0.22 / 0.40 palette / visor / emissive; 0.60 desk screen). Material names already match the documented atlas families.

**Required · Optional · Unnecessary:** required = base-colour palette + scalar roughness; optional = a second material for a genuinely different surface (screen, visor, emissive), and per-asset texture detail only where silhouette and palette provably cannot carry identity; unnecessary = normal, AO, specular, metallic-roughness maps, and alpha of any kind at present.

**Brass** is painted, not shaded — the board itself says "soft gradient not mirror". **Water is out of scope**: not an authored destination asset, transparency already reserved by `docs/10` §6, material rework still an open engineering item.

**Recorded divergences, not changed:** each asset carries its own palette rather than the five shared atlas files of `docs/10` §5, and §6's "materials replaced at ingest" is unimplemented. Neither costs anything at the measured 52–71 draw calls; consolidation stays an optimisation, not a blocker.

### C-6 — Painterly sheets vs faceted composite `MEDIUM` · ✅ **CLOSED 2026-09-18 by DD-35**

- The production sheets are **painterly and detailed**; `environment-master-composition.png` is **flat-faceted low-poly** and noticeably simpler.
- **The two were never the same kind of statement.** The original interpretation was right: sheets are the *modelling brief*, the faceted composite is the *in-engine target*.
- **Decision (DD-35): faceted, flat-shaded, palette-coloured geometry is the shipping target.** Identity comes from silhouette and painted value relationships, not surface texture. "Painterly" describes how the sheets are drawn and the value language to reproduce — base → highlight → shadow, warm light, cool shadow — not a brief to paint texel detail. Grain, grooves and birch lens marks become **palette cells and geometry**.
- **Supported by** `VISUAL_STYLE_EXTRACTION` §4 ("Faceted, flat-shaded … silhouette complexity **high**, surface complexity **low**") and §3 ("realistic *structure*, simplified *surface*"), `docs/01` §21's translation order, `docs/07` §3 ("poly counts driven by **silhouette**, not detail").
- **Proven by the shipped set.** Hero Tree A (4,424 tris), Hero Tree B (4,956), Bridge (1,436), Projects Desk (1,898), Birch (1,300), Rock Set (120/70/34) were all built faceted with palette atlases, reviewed against the painterly sheets, and approved. §11's "uniform materials … flat plastic" criticism of the old procedural world is answered by **palette cells**, not by PBR maps.
- **Guardrail:** neither photorealism nor generic low-poly (`VISUAL_STYLE_EXTRACTION` §12 bans both). Added texture detail beyond the palette is a per-asset exception, allowed only where silhouette and palette provably cannot carry identity, and only against measurement.

### C-7 — note added 2026-09-18

C-7 stays **open but currently moot**: every approved asset is `OPAQUE`, and both hero trees ship as **faceted foliage masses with no alpha at all**, despite `VISUAL_STYLE_EXTRACTION` §4 describing alpha-carded planes. Geometry beat cards. If alpha is ever adopted, `docs/10` §6 already governs — alpha-**tested**, never blended.

### C-7 — Alpha blending vs alpha testing `LOW`

- `birch-tree-production-sheet.png` says "alpha blending for foliage"; `hero-tree-b-production-sheet.png` says "alpha masking".
- Blending costs sorting and overdraw; `docs/07` and `docs/10` mandate alpha **testing** only.
- **Recommendation:** alpha-test everywhere. Low impact on the look, meaningful on mobile.

### C-8 — Signposts with destination names `LOW`

- Three composition references show carved wooden signposts reading "EXPERIENCE", "EDUCATION", "ACHIEVEMENTS".
- DD-06 bans **floating** labels; `docs/01` §14 and `docs/03` §19 explicitly **permit physical signs and trail markers**.
- Not strictly a contradiction, but it does place destination names in the world. **Confirm** that carved signposts are wanted — they would materially help navigation, which `docs/09` flagged as a mobile risk.

### C-9 — Character depiction on the scale panels `LOW`

- Panels labelled "Scale with Explorer Unit 7-B" depict at least four different humans (hiker, boy in scarf, bearded man, woman in safari hat). Only `conifer-set-production-sheet.png` shows something close to the actual robot.
- **Artifact, not a design signal.** `explorer-unit-7b-character-sheet.jpg` remains authoritative (DD-24). Ignore the figures except as rough size indicators, subject to C-4.

---

## AI artifacts — do not reproduce

| Artifact | Where |
|---|---|
| Garbled label text ("dellagene", "apheres", "cluates", "noot fhorck", "GASSET", "ROJIET", "Pen hiïnden action figur") | Tree A, Projects, several others |
| **Spider-Man action figure** — third-party IP | `projects-workstation-production-sheet.png` |
| Inconsistent scale figures | All new sheets (C-9) |
| Education's props appearing at Achievements | Gothic variant |
| Panel numbering that does not match panel order | Experience sheet |
| Decorative sparkle/star glints | Several sheets — a rendering flourish, not geometry |

---

## Missing / Required References

### P0 — Must have before asset production

| # | Needed | What the next Gemini generation should show |
|---|---|---|
| ~~M1~~ | ~~**Explorer Unit 7-B scale strip**~~ | ✅ **No longer blocking (2026-09-18).** C-4 is closed by DD-33 on evidence already in the documents — the pipeline states the mapping, and the world dimensions are written down and Explorer-scaled. A scale strip (the robot at 1.4 units beside hero tree A, hero tree B, birch, conifer ×3, the cabin, the shrine, the bridge and a 1 m cube) would still be a useful convenience anchor, but no asset waits on it. |
| ~~M2~~ | ~~**Experience cabin — camera-visibility variant**~~ | ✅ **No longer required (2026-09-18).** DD-30 settles the opening from references already in hand — the production sheet's own panel 5, `experience-environment-composition.png` and `experience-environment-approach.png` all draw the door standing open with the interior readable. A confirming sheet would be nice, not blocking. |
| ~~M3~~ | ~~**Education destination — final form ruling**~~ | ✅ **Closed by DD-31 (2026-09-18).** Outdoor birch desk, no structure. `education-environment-approach.png` supplied the missing confirmation. |
| M4 | **Terrain and path material sheet** | Ground-level ¾ view of a dirt trail meeting meadow: worn centre, scuffed edge, grass encroachment, embedded pebbles, and the transition from path to grass. Purpose: paths are painted into terrain vertex colour and currently have no dedicated reference. |

### P1 — Needed later

| # | Needed | What it should show |
|---|---|---|
| M5 | **Time-of-day set** | The same composition (ideally the golden-hour mood shot) rendered at morning, afternoon, evening and night. Night must show the four warm destination lights without neon. Purpose: `docs/02` morning and night are pure extrapolation with zero reference. |
| M6 | **Vegetation zoning sheet** | Four labelled panels — path edge, stream bank, tree base, open meadow — showing which species cluster where and at what density. Purpose: the vegetation library covers *what*, nothing covers *where*. |
| M7 | **Signpost / trail marker** | Turnaround of the carved wooden signpost seen in the composition shots, with the icon treatment. Purpose: C-8, and navigation support. |
| M8 | **Destination approach shots** | Each destination as seen from ~30 units along its approach path at the game's actual camera height. Purpose: validates silhouette-at-distance, which is the single test every destination must pass. **Partly satisfied 2026-09-18:** `achievements-environment-approach.png` is a genuine approach view and covers Achievements. Projects, Experience and Education are still outstanding — the two files named `*-environment-approach.png` for Experience and Education are art-direction boards, not approach shots. |

### P2 — Can remain procedural, no reference needed

Terrain heightfield · path ribbon geometry · sky gradient · distant hill forms · backdrop tree ring · small pebbles · collision volumes · water surface geometry (material is covered by M-sheet above).
