# 01 — WORLD DESIGN BIBLE

> **Status:** Visual language derived from the approved Gemini references
> **Authority:** `design/references/` is the visual source of truth. This document *reads* those references; it does not override them. Where a reference is silent, the item is marked **ASSUMPTION** and requires approval before implementation.
> **Last updated:** 2026-08-29
> **Related:** [02_TIME_OF_DAY.md](02_TIME_OF_DAY.md) · [07_PERFORMANCE_BIBLE.md](07_PERFORMANCE_BIBLE.md) · [08_DESIGN_DECISIONS.md](08_DESIGN_DECISIONS.md)

---

## 0. Reference index

Seven unique references. Short aliases used throughout this document.

**Filenames updated 2026-08-31.** The reference images were renamed to semantic filenames; the aliases below are unchanged and every citation elsewhere in this document still resolves. All files live in `design/references/`.

| Alias | File | Establishes |
|---|---|---|
| **REF-MASTER** | `environment-meadow-master-annotated.jpg` | Whole-world composition, destination placement, spawn, path/stream layout |
| **REF-FIELD** | `environment-meadow-field-reference.jpg` | Terrain, path, stream, vegetation, rocks, sky, distance treatment |
| **REF-PROJECTS** | `projects-workstation-early-concept.jpg` | Projects workstation |
| **REF-WORKSHOP** | `experience-workshop-early-concept.jpg` | Workshop / built structure under a tree |
| **REF-EDUCATION** | `education-study-early-concept.jpg` | Study desk |
| **REF-ACHIEVEMENTS** | `achievements-shrine-early-concept.jpg` | Achievement dais and shrine |
| **REF-CHARACTER** | `explorer-unit-7b-character-sheet.jpg` | Explorer Unit 7-B turnaround, palette, scale |

> `environment-meadow-master-annotated-duplicate.jpg` is a byte-identical duplicate of REF-MASTER (verified by hash). It carries no additional information.

**⚠️ Authority conflict — unresolved (O-18).** A later reference set of 20 production sheets and composition boards was added to the same folder and is catalogued in [docs/art/ASSET_REFERENCE_INDEX.md](art/ASSET_REFERENCE_INDEX.md). That index marks four of the aliases above as **superseded by production sheets**:

| Alias | Production sheet the index treats as current |
|---|---|
| REF-PROJECTS | `projects-workstation-production-sheet.png` |
| REF-WORKSHOP | `experience-cabin-production-sheet.png` |
| REF-EDUCATION | `education-study-production-sheet.png` |
| REF-ACHIEVEMENTS | `achievements-shrine-production-sheet.png` |

Sections §15–§18 below still cite the early concepts as *primary*. **That conflict is recorded, not resolved** — it needs a ruling on which set is authoritative for destination design. REF-MASTER, REF-FIELD and REF-CHARACTER are unaffected; REF-CHARACTER remains canonical for the player (DD-24). The contradictions the production sheets introduce are catalogued as C-1 … C-9 in the index and must not be resolved by inference.

**Updated 2026-09-18.** Three of them have since been ruled on, on the evidence rather than by inference: **C-1 → DD-30** (Experience keeps the enclosed A-frame with an open south threshold, interactable at the threshold — §16's "open-fronted" stands), **C-2 → DD-31** (Education stays the outdoor study desk, no structure — §17 stands), **C-3 → DD-32** (Achievements is the timber shrine; the Gothic variant is rejected under this document's no-funerary rule). **C-4 → DD-33** (the sheets are proportional references; §12's approved 1.4-unit Explorer and the documented dimensions govern size). **C-5 → DD-34** (palette base-colour map and scalar roughness only — no normal, AO or specular maps) and **C-6 → DD-35** (faceted, flat-shaded, palette-coloured geometry is the shipping target; "painterly" describes the references' value language, not texel detail). **C-7 … C-9 remain open**, none of them blocking, and O-18 itself is still unresolved.

**Superseded elements of REF-MASTER.** REF-MASTER remains authoritative for world composition and destination placement, but three of its elements are explicitly overridden:

| Element in REF-MASTER | Status |
|---|---|
| The brass/copper robot character | **Obsolete (DD-24).** REF-CHARACTER "Explorer Unit 7-B" is canonical. Do not use the master-scene robot as the player. |
| The gravestone-like Achievements markers | **Rejected.** REF-ACHIEVEMENTS supersedes — see §18. |
| Floating destination text labels | **Not design.** Concept-art annotation only — see §14, §20. |

**How to use these files:** extract the *visual language*. Do not model every object in them. Do not use any of them as a skybox, backdrop plane, or texture. The world is real 3D geometry.

---

## 1. Overall world style

Stylized premium indie game art. Formally, from REF-CHARACTER's own spec sheet:

- **Clean geometry** — readable, low-to-mid poly forms with deliberate silhouettes.
- **Flat-shaded textures** — large areas of even colour; no PBR realism, no photographic detail.
- **Hand-painted accents** — variation lives in painted colour, not in surface complexity.

Everything in the environment reads as slightly softened and hand-made: rounded rock forms, chunky timber, thick grass, canopies built from clustered leaf masses rather than individual leaves. Nothing is sharp, industrial, or precise. Nothing is photoreal.

The painterly quality of the references comes from **light and colour**, not from surface detail. That is the part to reproduce.

## 2. Terrain and hills

From REF-FIELD and REF-MASTER:

- Gently rolling meadow. Soft, rounded mounds — no cliffs, no ravines, no steep faces.
- Elevation change is modest and used for **composition**: raising a destination slightly so it reads against the sky, dipping a path so it disappears and re-emerges.
- Terrain is continuous and walkable everywhere the player can reach. Elevation never blocks movement; it shapes sightlines.
- The horizon is closed by layered hills and a conifer treeline, then distant rounded mountains, all fading into atmospheric haze.

**ASSUMPTION —** proposed elevation range across the playable area: roughly **0–4 units** of height variation, with destination pads within **±1.5 units** of the path they connect to. Needs approval.

**ASSUMPTION —** the distant mountains and far treeline are non-playable backdrop geometry (low-poly silhouettes, no collision, no shadow casting), placed beyond the fog band. Needs approval.

## 3. Paths

The strongest navigational element in every reference.

- **Warm tan / sienna packed dirt**, soft-edged, blending into grass at the margins rather than ending in a hard line.
- **Winding, never straight.** Curves are broad and lazy. Paths bend around trees, rocks and terrain rather than cutting through.
- Width **1.5–2.5 units** (approved, DD-20) — comfortably wider than the player, narrow enough to feel like a trail rather than a road.
- Small stones and pebbles are embedded along path edges (REF-FIELD, REF-ACHIEVEMENTS).
- Paths **fork**. REF-MASTER shows a main path from the spawn bridge splitting toward destinations.
- Every destination is **touched by a path** — the path either passes beside it (REF-PROJECTS, REF-EDUCATION) or terminates at it (REF-ACHIEVEMENTS, where it runs directly onto the dais).

Paths are the primary navigation system. If the pathing is composed correctly, explicit guidance UI becomes almost unnecessary.

## 4. Stream and water

From REF-FIELD, REF-MASTER, REF-PROJECTS, REF-WORKSHOP:

- A **shallow rocky brook**, not a river. Narrow, clear, slow.
- Colour: soft blue-green / pale teal, lighter than the sky, with visible bed through it.
- Bed and banks are lined with **smooth rounded grey river stones** of varied size.
- **Cattails and reeds** at the edges (REF-FIELD).
- Occasional lily pads (REF-MASTER).
- The stream **winds across the world** and is crossed by a **wooden plank bridge** at the spawn (REF-MASTER) — the bridge is the player's first object and an anchor landmark.

**ASSUMPTION —** water is a simple flat translucent surface with a subtle scrolling normal or UV offset. No reflections, no refraction, no simulation. Reflections are considered only for NIGHT and only if measured to be affordable (see [02_TIME_OF_DAY.md](02_TIME_OF_DAY.md)). Needs approval.

## 5. Rocks

- **Rounded granite boulders**, cool blue-grey, with **moss caps** on their upper surfaces — a consistent signature across every reference.
- Sizes range from pebbles to boulders roughly player-height or slightly above (REF-MASTER foreground).
- Placed in clusters, often part-buried, never floating on the surface.
- Used as: framing elements at the edges of the composition, stream bed and banks, path margins, and natural boundary markers.

Rocks are a prime instancing candidate — a small set of shapes (**ASSUMPTION:** 3–4 base meshes) rotated and scaled.

## 6. Vegetation

### Grass

- Thick, bladed, saturated green with warm yellow-green highlights where lit.
- Taller and more detailed near the camera; shorter turf in the midground; a flat lit tone in the distance.
- Grass responds to light strongly — backlit grass in REF-MASTER and REF-FIELD is what creates the golden feel.

**ASSUMPTION —** grass is implemented as a base terrain material plus instanced/billboard grass tufts in a limited radius around the player or in hand-placed clusters, not as full-world geometry. Density and radius are a mobile quality-scaling knob. Needs approval.

### Bushes and shrubs

Rounded clumped forms, mid-green, used to break up ground planes, soften the base of trees, and mask transitions. Present in every reference.

### Flowers

Controlled and clustered — never uniformly scattered. Observed species:

- **Purple/blue lupines** — tall spikes, the signature flower, in every field reference
- **White daisies** with yellow centres
- **Red poppies** (REF-EDUCATION, REF-ACHIEVEMENTS)
- **Pink clover**
- Small yellow and orange blooms

Flowers appear in patches at path edges, around rocks, and around destinations. They are accent colour against green, used sparingly enough to stay special.

## 7. Trees

Three distinct types, all present in the references:

| Type | Description | Role |
|---|---|---|
| **Large gnarled broadleaf** | Thick twisted trunk, heavy exposed mossy roots, broad layered canopy. Warm brown bark with deep vertical grooves. | **Hero trees.** Every destination sits at the base of one. These are landmarks. |
| **Birch** | Slender white/pale trunks, light airy canopy, often in small stands. | Midground texture, framing, Education area (REF-MASTER). |
| **Conifer / spruce** | Dark green, conical, layered. | Background treeline, hill silhouettes, depth. |

Canopies are built from **clustered leaf masses**, not individual leaves — chunky, readable, slightly stylized shapes.

**The hero tree is the single most important landmark type in the world.** Each destination is legible from a distance primarily because of the distinctive tree above it.

## 8. Handcrafted structures

Everything built by hand in this world is **timber**, weathered grey-brown, with visible joinery:

- Chunky plank tops with visible board seams and end grain
- Thick square or slightly tapered legs
- Carved decoration on the more "personal" pieces (Education desk apron, Achievement benches and posts)
- Wooden crates, stools, benches, shelving units
- The spawn bridge: plain planks on log supports, no railing

Structures look built by someone who cared, decades ago, and have been sitting in the weather since. No paint, no polish, no metal fabrication.

## 9. Colour palette

Derived by eye from the references. **All hex values are approximate starting points to be tuned in engine — they are not exact specifications.**

### Environment

| Role | Approx. | Notes |
|---|---|---|
| Sky (upper) | `#b9c9d4` | Cool pale blue, desaturated |
| Sky (horizon) | `#f2e6ce` | Warm cream, sun-side |
| Grass (lit) | `#93a85c` | Warm yellow-green |
| Grass (shadow) | `#5c7040` | Cool deep green |
| Distant hills | `#9fb08e` → `#b4bfc4` | Desaturates and cools with distance |
| Distant mountains | `#a8b3bd` | Nearly flat, hazed |
| Dirt path | `#c2a172` | Warm tan |
| Path (shadowed) | `#9a7e58` | |
| Rock | `#8d949b` | Cool blue-grey |
| Rock moss | `#7d9152` | |
| Timber | `#8a7358` | Weathered grey-brown |
| Timber (dark/aged) | `#5f4a36` | |
| Tree bark | `#6b5340` | |
| Water | `#a8ccc9` | Pale blue-green, translucent |
| Sunlight | `#ffe4bb` | Warm |

### Accents (from REF-CHARACTER swatch strip)

`#7d8f52` olive · `#efe9dc` cream · `#cf7f3c` tan-orange · `#6b4a2f` dark brown · `#d9d9d9` light grey · `#f0932b` amber

### ✅ APPROVED — primary warm accent (DD-23)

**`#F0932B` is the approved primary warm accent** for the whole product — the one warm point of saturation the eye is trained to follow.

Used **sparingly**, for:

- the player's visor
- interaction states (prompt affordance, active interactable)
- selected UI states
- small important lighting accents

**It must remain an accent, never a dominant world colour.** If amber starts reading as a theme rather than a signal, it is being overused. The world's dominant colours stay the muted greens, tans and timber browns above.

### Palette rules

- Muted and natural throughout. Saturation is reserved for: flowers, the character's visor, and light itself.
- No pure black, no pure white anywhere in the world.
- No neon, no glow beyond warm practical light sources.
- Cool colours push back, warm colours come forward — this is the depth mechanism.

## 10. Lighting philosophy

The references are all lit as **low warm sun** — late afternoon / early golden hour.

- **One dominant directional light** (the sun), low in the sky, warm.
- **Soft ambient/hemisphere fill** — cool from the sky, warm bounce from the ground.
- Grass and canopy edges are **rim-lit / backlit** by the low sun. This is the signature effect and the main reason the references feel warm and expensive.
- Shadows are **soft, long and directional**, never hard-edged, never black — they read as cooler colour rather than absence of light.
- Light does most of the art direction. Materials are simple; the light makes them look good.

Deliberately excluded: global illumination, area lights, many dynamic shadow casters, and post-processing as a default (`CLAUDE.md` §32, §33). The world must look correct with plain lighting.

Time-varying behaviour is specified in [02_TIME_OF_DAY.md](02_TIME_OF_DAY.md).

## 11. Atmosphere and depth

The references are built in clean layers, and this must be reproduced:

```
FOREGROUND    tall grass, flowers, boulders, the framing tree
MIDGROUND     the path, the stream, the destinations, the player
BACKGROUND    hills, treeline, mountains — flattened and hazed
```

Mechanisms:

- **Fog / atmospheric haze** that desaturates and lightens with distance, tinted toward the sky colour. This is what closes the world and lets it stay small (`CLAUDE.md` §7).
- **Value compression** in the distance — far geometry loses contrast.
- **Overhanging canopy** in the near field to frame the composition.
- **Scale cues** — a boulder near the camera against a treeline far away.

The world feels larger than it is because of layering, not because of size.

## 12. World scale

- **1 world unit = 1 metre.**

### ✅ APPROVED initial targets (DD-20)

Approved as **initial implementation targets**, subject to adjustment after playtesting:

| Element | Target |
|---|---|
| **Playable area** | **~120 × 120 units**, irregular, closed by terrain and fog |
| **Player height** | **~1.4 units** |
| **Walk speed** | **~4 units/s** |
| **Path width** | **~1.5–2.5 units** |

### Derived figures — still assumptions

These follow from the approved targets but were not themselves approved. **ASSUMPTION — needs approval or playtest confirmation:**

| Element | Proposed |
|---|---|
| Spawn → nearest destination | ~25–35 units (≈ 6–9 s walk) |
| Spawn → furthest destination | ~55–70 units (≈ 14–18 s walk) |
| Hero tree height | 8–12 units |
| Desk height | ~0.75 units |
| Boulder (large) | 1.5–2.5 units |

The world must feel composed and complete, never sparse. Compact is the point.

## 13. Camera composition

REF-MASTER is framed from behind and slightly above the character — essentially the intended third-person gameplay camera. That framing is the target.

Compositional requirements the world layout must satisfy:

- From spawn, **at least two destinations are visible** or strongly implied by path direction.
- Destinations read against **contrasting backdrops** — a silhouette against sky, or a dark tree mass against light grass.
- Paths lead **into** the frame, drawing the eye toward destinations.
- Foreground framing elements (canopy edge, boulders) sit at the edges of the composition.
- No destination is hidden behind terrain from every approach angle.

Camera parameters live in [03_GAMEPLAY_AND_INTERACTION.md](03_GAMEPLAY_AND_INTERACTION.md).

## 14. Environmental storytelling

Every destination communicates its meaning through objects alone. The rules:

- **No floating text labels in the world.** REF-MASTER shows `PROJECTS` / `EXPERIENCE` / `EDUCATION` / `ACHIEVEMENTS` as floating captions — those are **annotations on the concept art for communication purposes only**. They are explicitly not part of the design (`CLAUDE.md` §9). See §20.
- Objects are **left mid-use**: an open notebook, a mug, a backpack on the ground, scattered papers, a blanket over a chair. Someone was just here.
- Wear tells time: moss, weathering, autumn leaves on the ground at Education.
- Small physical signs or trail markers are permitted as navigation aids, at world scale, made of wood.

---

# THE FOUR DESTINATIONS

Layout in REF-MASTER, read from the spawn bridge:

```
        EXPERIENCE                                EDUCATION
     (mid-left, background)                  (right, background)

  PROJECTS                                      ACHIEVEMENTS
(left, foreground)                          (right, midground)

                    ~~~ stream ~~~
                    [ spawn bridge ]
                         PLAYER
```

Main path runs from the bridge forward and forks; the stream runs to the right of the spawn and separates the right-hand destinations from the left.

---

## 15. PROJECTS

**Reference:** REF-PROJECTS (primary), REF-MASTER (placement)

### Purpose
The deepest section of the portfolio. Carousel of projects, each expanding into a full technical case study.

### Visual identity
A working developer's outdoor workstation, sitting in the open at the base of a large gnarled tree, with the path running past it and the stream close by. It reads as *someone's actual desk that happens to be in a meadow* — deliberately incongruous, completely unremarked upon.

**Projects is the software/developer station** — code on screen, books and notebooks, no built structure. It must stay clearly distinct from Experience (DD-19); see the comparison table in §16.

### Major objects
- **Hero tree** — heavy twisted trunk, exposed roots, canopy overhanging the desk
- **Weathered plank desk**, chunky legs, ~1.2–1.5 units wide
- **CRT monitor** — beige/sage-green cased, screen showing coloured code on dark background
- **Mechanical keyboard**, cream keycaps, visible cabling
- **Open notebook** with a technical sketch and a red bookmark ribbon
- **Stack of books**, small jar, pens and tools
- **Ceramic mug**
- **Carved wooden stool** with a cushion
- **Wooden crate** beneath the desk

### Silhouette
Low horizontal desk mass, a single boxy monitor form on top, under a wide dark canopy. The monitor is the only rectangular hard-edged object in the natural surroundings — that contrast is what makes it read at distance.

### Environmental context
Open meadow, lupines and clover in the near grass, dirt path passing immediately beside the desk, stream with rounded stones to one side, conifer treeline behind.

### Interaction object
**The CRT monitor.** It is the tallest, most distinct, most obviously "usable" object.

### Approximate scale
Desk ~1.4 × 0.7 × 0.75 units. Monitor ~0.5 units tall. Tree 8–12 units.

### Relationship to paths
The main path **passes directly beside** the desk — the player can reach it without leaving the trail.

### Discovery
Nearest destination to spawn, on the left. Visible from the spawn area in REF-MASTER. Its hero tree is the largest visual mass on the left of the composition and pulls the eye immediately.

### At a distance
Big dark canopy, a horizontal desk silhouette beneath it, one small hard rectangle (the monitor). At NIGHT, the monitor screen is a warm glow visible from far away.

### Close up
Legible code on the screen, sketch detail in the notebook, wood grain, cables, the mug. Detail rewards approach.

### Note on variance
REF-MASTER shows this station with a **laptop and a large wooden corkboard of pinned technical sketches**; REF-PROJECTS shows a **CRT and a notebook**. Both are the same idea. **ASSUMPTION —** REF-PROJECTS (the dedicated close-up) is treated as authoritative for object detail; the corkboard from REF-MASTER may be added as an optional secondary prop for silhouette mass. Needs approval.

---

## 16. EXPERIENCE

**Reference:** REF-WORKSHOP (primary), REF-MASTER (placement)

### Purpose
Professional history. Sanitized for public disclosure — no internal details, no proprietary information (`CLAUDE.md` §26).

### Visual identity
A personal engineering workshop, **not a corporate office**. A free-standing timber cabin with a pitched A-frame roof and a stone chimney, open-fronted, full of tools and half-finished work, set against a large tree. The character of someone who builds things.

### Major objects
- **Free-standing A-frame timber cabin** — pitched roof, exposed frame, stone chimney, open front, dark interior with tools and shelving visible; a **large tree** behind and beside it
- **Heavy workbench**
- **CRT monitor showing a technical schematic** — flowchart and graphs, not code
- Keyboard, open **technical notebook with engineering sketches**
- **Wooden shelf unit**: books, jars, gears, spools of wire, mechanical parts, **blueprint sheets** (blue paper, pinned)
- **Leather-topped stool**
- **Canvas/leather backpacks** on the ground
- Enamel mug, hand tools, scattered small components

REF-MASTER additionally shows **a workbench with maps and a globe** inside the cabin.

### Silhouette
The only destination with a **built roofline**. A dark A-frame mass against the sky with a chimney breaking the ridge, backed by a large tree. The largest constructed silhouette in the world, and the single strongest architectural landmark.

### Environmental context
Set back from the path, slightly elevated, backed by trees, with the path curving up to it. Stream nearby.

### Interaction object
**The workbench / schematic monitor.**

### Approximate scale
Structure ~4–6 units wide, ~3–4 units tall. Larger than any other destination's built mass.

### Relationship to paths
A path **branches off the main route and terminates** at the workshop — it is a destination you go *to*, not one you pass.

### Discovery
Middle distance from spawn, up the main path. Its roofline against the sky is the strongest architectural landmark in the world.

### At a distance
Angular roof silhouette against sky — the one hard geometric shape in a landscape of organic forms. At NIGHT, warm interior light spills from the open front.

### Close up
Blueprints, gears, tool detail, timber joinery, dark interior depth.

### ✅ APPROVED — structure and prop language

The two references showed different structures. This is now settled (DD-19):

- **Structure: the free-standing A-frame cabin / workshop** from REF-MASTER — timber frame, pitched roof, stone chimney, open front. Not a shed built into tree roots.
- **Prop language: from REF-WORKSHOP** — blueprints, gears, tools, shelving, schematics and engineering objects.

**Experience must remain visually distinct from Projects.** The separation is enforced on every axis:

| | PROJECTS | EXPERIENCE |
|---|---|---|
| Domain | Software / developer workstation | Professional engineering / workshop |
| Structure | Open desk in the meadow | Free-standing built cabin with a roofline |
| Screen content | **Code** | **Schematics and diagrams** |
| Props | Books, notebook, mug, crate | Blueprints, gears, tools, shelving, spools, components |
| Silhouette | Low horizontal desk under a canopy | Angular roofline against sky |

If the two ever start reading as the same place, the Experience cabin has lost its roofline or its screen has lost its schematics. Those two elements carry the distinction.

---

## 17. EDUCATION

**Reference:** REF-EDUCATION (primary), REF-MASTER (placement)

### Purpose
Academic background, thesis, coursework.

### Visual identity
A scholar's outdoor study. Quiet, warm, contemplative. Deliberately older and more ornate than the other stations — this is about knowledge that predates the career.

### Major objects
- **Large gnarled oak** with mossy exposed roots; **autumn leaves scattered on the ground** (unique to this destination)
- **Carved wooden study desk** — decorative carving on legs and apron, noticeably more ornate than the Projects desk
- **Cloth/blanket draped** over one end
- **Stack of leather-bound books**
- **Large open illustrated book** showing celestial charts and constellation diagrams
- **Quill pen** with feather, **inkwell**
- **Brass astrolabe / orrery instrument**
- **Globe**
- **Magnifying glass**, loose parchment with sketches
- **Small round wooden stool**
- **Open journals on the ground** with botanical and architectural sketches
- Folded blanket and an open book resting on the grass

### Silhouette
Horizontal desk mass with a distinctive **cluster of small vertical objects** on top — globe sphere, astrolabe ring, upright books, quill. Reads as "study" purely by shape. No screen anywhere.

### Environmental context
Set in a meadow of tall grasses, lupines, poppies and daisies, beneath the oak. REF-MASTER places it among **birch trees** on the right side of the world, with a **round bookshelf structure and an armchair with a blanket** in the same area.

### Interaction object
**The open book on the desk** (or the desk as a whole).

### Approximate scale
Desk ~1.5 × 0.8 × 0.75 units. Comparable footprint to Projects, more vertical clutter.

### Relationship to paths
The path **passes to one side** of the desk, similar to Projects.

### Discovery
Right side of the world, in the background, across or beyond the stream. Reached by following the path past Achievements. The pale birch trunks are its distance marker.

### At a distance
Warm desk mass under a dark canopy, framed by pale birch verticals. The birches are the identifying cue — no other destination has them.

### Close up
Celestial chart detail in the open book, brass instrument, quill, botanical sketches, autumn leaves.

### Note on variance
REF-MASTER's Education area (round bookshelf, armchair, rug, blanket) is a **cozy reading nook**; REF-EDUCATION is an **outdoor scholar's desk**. **ASSUMPTION —** REF-EDUCATION (the dedicated close-up) is authoritative; the round bookshelf may appear as a secondary prop within the same area to build silhouette mass and reinforce "books" at distance. Needs approval.

---

## 18. ACHIEVEMENTS

**Reference:** REF-ACHIEVEMENTS (primary)

### Purpose
Awards, recognitions, competitions.

### Visual identity
A small commemorative shrine on a raised circular platform — celebratory and dignified. Warm, honoured, alive. Explicitly **not** funerary.

### Major objects
- **Circular raised dais** of fitted stone and timber, with **steps** leading up
- **Central shrine structure**: carved stone base with relief panels, timber posts, decorative gabled cap; carved emblems (star, leaf, compass rose)
- **Medals on coloured ribbons** — blue, red, green — hanging from the crossbeams
- **Small gold trophy cup**
- **Star and leaf emblems** mounted on the posts
- **Carved wooden benches** flanking the dais
- **Heraldic shield**, blue and gold, with a phoenix emblem, leaning against the structure
- **Scrolls**, gloves, an open book on a bench, a medallion resting on the dais
- **Large gnarled tree** overhanging from one side

### Silhouette
The only **vertical, symmetrical, architectural** silhouette in the world — a small gabled shrine on a raised circular base. Instantly distinct from every organic form around it.

### Environmental context
Open sunlit meadow with poppies, lupines and daisies. Rolling hills behind. Deliberately more open and exposed than the other destinations — it is meant to be seen.

### Interaction object
**The central shrine structure.**

### Approximate scale
Dais ~4–5 units diameter. Shrine ~2.5–3 units tall. Small enough to be intimate, tall enough to be a landmark.

### Relationship to paths
The path **runs directly onto the dais** and terminates there. It is the only destination the path physically enters.

### Discovery
Right side of the world, midground, nearer than Education. Its symmetry and raised platform make it the most obviously "placed" object in the landscape.

### At a distance
Symmetrical gabled shape on a pale circular base, catching sun. The ribbon colours are small saturated accents against green — the only place in the world with red/blue/green together.

### Close up
Carved relief detail, individual medals, the phoenix shield, scrolls, the trophy.

### Resolved contradiction — gravestones
REF-MASTER shows the Achievements area as **two rounded-top stone slabs with laurel wreaths and engraved plaques** — visually reading as headstones. This is explicitly rejected by the design brief: *do not use gravestones or anything suggesting death.*

**Resolution: REF-ACHIEVEMENTS supersedes REF-MASTER for this destination.** The dais-and-shrine treatment is authoritative. No headstone forms, no rounded-top slabs, no grave-like arrangements anywhere in the world.

---

## 19. Environmental density

Density is **graded, not uniform**:

| Zone | Treatment |
|---|---|
| **Destination pockets** | Highest detail. Props, flowers, rocks, moss, scattered objects. The player will stand still here. |
| **Path margins** | Moderate. Flowers, pebbles, occasional bush and rock. Keeps travel interesting. |
| **Open meadow** | Low. Grass and occasional flower cluster. Breathing room; makes destinations feel like arrivals. |
| **Boundary / distance** | Silhouette only. Trees, hills, mountains. No detail, no collision. |

Empty space is a design tool. Uniform clutter would destroy the composition and the frame rate simultaneously.

## 20. Explicit visual prohibitions

Drawn from `CLAUDE.md` §9, §38 and the design brief:

- ❌ Floating text labels over destinations *(the labels in REF-MASTER are concept-art annotations only)*
- ❌ Giant UI billboards, sky-writing, 3D text of any kind
- ❌ Gravestone / headstone / funerary forms
- ❌ Cyberpunk, neon, holograms, glowing outlines
- ❌ Generic gradients, glassmorphism, floating cards in world space
- ❌ Particle effects for their own sake
- ❌ Reference images used as backdrop planes or skyboxes
- ❌ Photoreal or high-poly assets
- ❌ Post-processing as a default (`CLAUDE.md` §33)

## 21. Translation rules — reference to game asset

When building any part of the world, prioritise in this order:

1. **Composition** — where things sit relative to each other and the camera
2. **Silhouette** — is it identifiable as a dark shape at 40 units?
3. **Lighting** — does it catch the warm light the way the references do?
4. **Materials** — flat colour, correct value, warm/cool relationship
5. **Major landmarks** — hero trees, roofline, shrine, bridge
6. *Only then* — small decorative props

A destination that has the right composition, silhouette and light with six props will beat one with forty props and the wrong shape. Build the shape first.

---

## 22. Open assumptions requiring approval

| # | Assumption | Impact |
|---|---|---|
| A1 | Elevation range 0–4 units; destination pads within ±1.5 units of path | Terrain authoring |
| A2 | Distant mountains/treeline are non-playable backdrop geometry | Scene structure, perf |
| A3 | Water is a flat translucent scrolling surface; no reflections except possibly NIGHT | Water implementation |
| A4 | Grass is instanced/billboard tufts in a limited radius, not full-world geometry | Perf, mobile scaling |
| A5 | 3–4 base rock meshes, instanced | Asset budget |
| A6 | ~~All §12 scale figures~~ → **APPROVED (DD-20)** for world size, player height, walk speed and path width. Derived distances and object heights remain assumptions. | Everything |
| A7 | ~~Visor amber promoted to product accent~~ → **APPROVED (DD-23)** as `#F0932B`, used sparingly | UI + world |
| A8 | PROJECTS: REF-PROJECTS authoritative; corkboard optional secondary prop | Asset list |
| A9 | ~~EXPERIENCE structure ambiguous~~ → **APPROVED (DD-19)**: free-standing A-frame cabin + workshop prop language, kept distinct from Projects | Resolved |
| A10 | EDUCATION: REF-EDUCATION authoritative; round bookshelf optional secondary prop | Asset list |
