# VISUAL STYLE EXTRACTION

> **The common visual language across all 27 unique references.**
> **Purpose:** define what "premium hand-authored" actually means here, concretely enough to build and to judge against.
> **Companion:** [ASSET_REFERENCE_INDEX.md](ASSET_REFERENCE_INDEX.md)
> **Last updated:** 2026-08-30

---

## 1. Premium quality — where it actually comes from

Ranked by contribution, from studying `environment-golden-hour-mood.png` against the current M4B build:

| Rank | Source | Weight |
|---|---|---|
| 1 | **Light and atmosphere** — low warm sun, heavy aerial perspective, value compression with distance | ~40 % |
| 2 | **Silhouette design** — every hero form is identifiable as a black shape | ~25 % |
| 3 | **Material differentiation** — bark, timber, stone, cloth, brass each read differently | ~15 % |
| 4 | **Compositional intent** — framing, negative space, depth layers | ~15 % |
| 5 | Polygon count | **~5 %** |

The golden-hour mood reference is not geometrically complex. Its trees are simpler than what M4B already renders. It looks premium because the **light does the work** and every shape was chosen.

### What separates these from generic AI/low-poly art

| Generic | These references |
|---|---|
| Uniform saturation everywhere | Saturation reserved for flowers, the amber lamp, medal ribbons |
| Every object equally detailed | Detail concentrated on hero forms; distance strips it aggressively |
| Symmetrical, evenly spaced | Deliberate asymmetry; leaning trunks; clustered props |
| One flat green | Grass has base / highlight / shadow with warm-to-cool range |
| Objects sit *on* the ground | Root flares, sunken rocks, bank mud, vegetation growing against structures |
| Filled uniformly | Empty meadow used as breathing space |
| Clean, new, undamaged | Weathering, moss, soot, scuffing, worn path centres |

---

## 2. Hand-authored quality

### Deliberate design

Every hero asset shows decisions no algorithm produces: Hero Tree A's five branches have *individually chosen* angles and lengths; Hero Tree B **leans**; the cabin's rafters are paired and the roof skin sits proud of them; the bridge's stringers are cut to the span and its posts are sunk into the bank.

### Asymmetry

Used everywhere and never as noise:

- Trunks lean; canopy mass is heavier on one side
- The cabin chimney sits off-centre on one flank
- Rock clusters are one large, two small — never three equal
- Vegetation clusters have a dense core and a thinning edge
- Hero Tree B's crown extends further one way than the other

**Asymmetry is a composition choice, not a random seed.**

### Silhouette control

Every production sheet includes a **dedicated silhouette panel**. That is the sheet telling us the test: *if the black shape is not identifiable, the asset has failed.* Hero Tree A's silhouette shows clear gaps between foliage masses. Hero Tree B's shows a distinct leaning trunk and an umbrella crown. Neither could be mistaken for the other.

### Negative space

The single biggest gap between the references and M4B. Canopies are **not solid** — daylight passes between foliage masses, branches are visible through gaps, and the crown breaks into 3–4 distinct masses with real voids. A solid lumpy sphere has zero negative space, which is exactly why it reads as procedural.

### Intentional vs random variation

Variation comes from: species choice, cluster density, scale within a range, rotation, moss amount per rock instance, and which props are grouped. Not from per-object geometry noise.

---

## 3. Stylization

**Premium stylized realism** — realistic *structure*, simplified *surface*, slightly exaggerated *proportion*.

| Exaggerated | Simplified | Kept realistic |
|---|---|---|
| Canopy mass relative to trunk | Individual leaves → grouped masses | Structural logic (branches carry canopy) |
| Root flare | Bark → painted grooves, not displacement | Material behaviour (wood grain follows form) |
| Roof pitch | Stone → faceted planes, not scanned rock | Light direction and shadow |
| Prop chunkiness | Grass → tufts, not blades | Proportional relationships |
| Rock facet size | Water → colour + transparency, no simulation | Weathering logic (moss on top, wear at edges) |

---

## 4. Geometry language

- **Faceted, flat-shaded**, with edges that read as deliberate planes
- Silhouette complexity is **high**; surface complexity is **low**
- **Branching:** trunk → 3–5 major branches → foliage mass at each terminus. Branches visibly *support* their mass. Secondary branches minimised (conifer sheet: "optimize polycount on secondary branches")
- **Foliage:** alpha-carded layered planes forming 3–4 grouped masses. Explicitly *not* spheres — Hero Tree A annotates "carefully de[lineated], not spheres or lumpy blobs"
- **Architecture:** visible structural members — paired rafters, ridge beam, posts, stringers. Construction is legible
- **Props:** chunky, generous, slightly oversized fittings; nothing thin or fragile

### Stated budgets

| Asset | Budget | Source |
|---|---|---|
| Conifer | 1000 → 500 → 250 tris LOD chain | conifer sheet |
| Rock | ~450–900 vertices | rock sheet |
| Grass tuft | 120 polys | vegetation sheet |
| Tall grass | 35 · Clover 15 · Daisy 12 · Lupine 25 | vegetation sheet |
| Meadow flower | 75 · Low shrub 74 · Fern 15 · Stream grass 25 · Reed 28 | vegetation sheet |

---

## 5. Materials

From `material-reference-board.png` — every material is defined as **base / highlight / shadow / roughness / small surface detail**. That five-channel structure *is* the hand-painted language.

| Material | Characteristic treatment |
|---|---|
| **Wood (warm timber)** | Orange-brown, visible grain lines following form, lighter edges, dark joints |
| **Aged timber** | Grey-brown, split and cracked, weathered silver highlights |
| **Bark** | Deep vertical grooves, warm brown, moss in crevices |
| **Pale birch bark** | Near-white `#F1EDEA` with dark horizontal lens marks `#6A6763`, cool grey shadow |
| **Foliage** | Warm yellow-green top → mid green → cool dark shadow. Three-tone, always |
| **Grass** | Warm golden-green, lighter tips, darker base, occasional dry-straw variation |
| **Soil / path dirt** | Warm tan with embedded pebbles, darker damp patches |
| **Stone** | Cool grey with warm gold highlight on sunlit planes, blue-grey cracks |
| **Mossy stone** | Same, with green only on upper surfaces |
| **Brass** | Warm gold with aged patina, soft gradient not mirror |
| **Aged metal** | Desaturated grey-brown, rust flecks, worn edges |
| **Cloth** | Matte cream, visible weave at close range, soft folds |
| **Leather** | Warm mid-brown, soft sheen, worn edges |
| **Water** | Transparent blue-green, bed visible through it, warm surface glints |
| **Dark interior wood** | Near-black brown — used to make lit interiors read |

**Universal rule:** matte. Minimal specular. No plastic sheen anywhere.

---

## 6. Colour

### Relationships

- **Warm dominates**; cool is used for recession and contrast
- **Greens** run warm-yellow in light → mid → cool-dark in shadow. Never one flat green
- **Browns** carry all built objects and paths, tying the world together
- **Stone** is the only cool mid-tone in the near field
- **Sky** is warm peach at the horizon, cooling upward to pale blue
- **Distance** desaturates *and* cools — with a distinct **purple** band in the far hills

### Extracted palette

| Role | Values |
|---|---|
| Foliage light / mid / shadow | `#C2E0AA` · `#A8D18C` · dark cool green |
| Birch bark / markings | `#F1EDEA` · `#6A6763` |
| Branch | `#8C7C6D` |
| Warm timber | orange-brown |
| Aged timber | grey-brown |
| Stone / mossy stone | cool grey · green upper faces |
| Brass | warm gold, patina |
| Path dirt | warm tan |
| Water | transparent blue-green |
| Horizon haze | warm peach |
| Distant haze | cool blue, then purple |

### The amber accent — `#F0932B`

The references handle this **exactly as approved**. Amber appears only as:

- the lit oil lamp at Education
- warm interior light spilling from the cabin
- the CRT screen glow at Projects
- brass fittings catching low sun

It is **never a surface colour.** In the golden-hour mood shot the CRT glow is the only saturated warm point in the entire frame, and it draws the eye straight to the destination. That is the mechanism to preserve.

**Rule: amber belongs to light sources and interaction states. Never paint an object amber.**

---

## 7. Detail density

| Zone | Treatment |
|---|---|
| **Foreground** | Dense — individual grass tufts, scattered flowers, pebbles, prop detail readable |
| **Midground** | Moderate — destination props read as shapes; vegetation as clusters |
| **Background** | Silhouette only — "minimal surface detail to prevent competition" |

Detail is spent where the player stops, not spread evenly. Destination pockets are dense; the meadow between them is deliberately sparse.

---

## 8. Vegetation

From `vegetation-library-production-sheet.png` and the composition references:

- **Clustered, never scattered.** Every species is shown as an individual *and* as a natural clump
- **Layered by height** — ground cover (clover, small flowers) → mid (grass tufts) → tall (lupine, reeds)
- **Zoned by context:**

| Zone | Species |
|---|---|
| Path edge | short grass, daisies, clover, buttercups |
| Stream bank | reeds/cattails, stream grass, damp grass, submerged pebbles |
| Tree base | darker grass, fallen leaves, moss, small rocks |
| Open meadow | low grass with occasional flower clusters |
| Destination | curated, integrated with props |

- **Variation from transform only** — the sheet states it plainly: *"same assets can be reused with different scale, rotations and clustering for varied meadow coverage"*
- **Density falls off from a cluster core** — patches have a dense middle and a thinning edge

---

## 9. Composition

- **Framing:** large trees at the frame edges, arching inward. Used in every composition reference
- **Paths lead the eye** into the frame toward destinations, meandering rather than straight
- **Depth layers:** foreground vegetation → midground destination → background hills → hazed mountains. Always three or more
- **Negative space is intentional** — open meadow between destinations makes arrival feel like arrival
- **Destinations sit against contrasting backdrops** — dark roof against pale sky, pale birch against dark foliage
- **Props cluster around a focal object** rather than spreading evenly

---

## 10. Environmental storytelling

Each destination communicates through objects alone, with a distinct *verb*:

| Destination | Verb | Evidence |
|---|---|---|
| **Projects** | *building* | CRT with live code, keyboard, notebook of sketches, mug mid-use, tower PC, coiled cable, crates |
| **Experience** | *engineering* | Blueprints pinned and on the bench, gears, tools, jars of parts, "ENGINEERING SUPPLIES" crates, a half-built mechanism |
| **Education** | *studying* | Open book with diagrams, globe, astrolabe, quill and inkwell, leather-bound stacks, lit lamp |
| **Achievements** | *commemorating* | Framed certificate, ribboned medals, trophy, plaque, display niche, benches to sit and look |

The strongest device across all four: **objects left mid-use.** An open book, a lit lamp, a mug beside a keyboard. Someone was just here — that is what makes a place feel inhabited rather than decorated.

No floating labels anywhere. Carved wooden signposts appear in three references (see C-8 in the index).

---

## 11. Why the current procedural world looks worse

An honest comparison against M4B. **None of these are polygon-count problems.**

| # | Issue | What M4B does | What the references do |
|---|---|---|---|
| 1 | **Repeated silhouettes** | One tree algorithm; rotation and scale are the only variation | Two hero trees with genuinely different crown architecture, each individually designed |
| 2 | **No negative space** | Canopies are solid deformed spheres | 3–4 grouped masses with daylight and branches visible between them |
| 3 | **Procedural foliage** | Icosahedra converge on "lumpy sphere" | Alpha-carded layered planes with designed outer contour |
| 4 | **Uniform materials** | Zero textures; bark, timber, stone all read as the same flat plastic | 16 materials each with base/highlight/shadow/roughness/detail |
| 5 | **One flat green** | Vertex ramps give value variation but no hue variation | Three-tone foliage, warm top to cool shadow, per species |
| 6 | **No surface variation** | Flat facets with per-face jitter | Painted grain, grooves, moss, weathering, soot |
| 7 | **Weak prop storytelling** | Props present but generic; nothing reads as *used* | Open book, lit lamp, mug mid-use, labelled crates |
| 8 | **Repetitive vegetation** | One grass asset, one density rule | 10 species, zoned by context, layered by height |
| 9 | **No intentional asymmetry** | Symmetric primitives with random rotation | Leaning trunks, off-centre chimney, one-large-two-small rock groups |
| 10 | **Overly clean geometry** | Everything new and undamaged | Weathering, moss, wear, cracks, split planks |
| 11 | **Objects sit on the ground** | Props placed at sampled height | Root flares, sunken rocks, bank mud, vegetation growing against structures |
| 12 | **Weak water** | Opaque teal strip | Transparent, visible bed stones, muddy banks, reed layering, varying depth |
| 13 | **Bridge floats** | Sampled one height | Cut stringers, bank abutments, cross-bracing, vegetation at both ends |
| 14 | **Flat lighting** | Even directional + hemisphere | Strong aerial perspective, rim light, warm/cool separation, value compression |
| 15 | **Uniform detail density** | Same treatment everywhere | Dense foreground, moderate midground, silhouette-only background |

### The three that matter most

If only three things change, change these:

1. **Light and atmosphere** — the biggest single contributor, and it is *engineering*, not art. Stronger aerial perspective, warm/cool separation, value compression with distance.
2. **Negative space in canopies** — the difference between "authored tree" and "green blob", and it costs nothing.
3. **Material differentiation** — five textured materials would do more than doubling every polygon budget.

---

## 12. Art direction guardrails

**The target:** premium stylized realism · storybook exploration · hand-authored indie game art · low-poly geometry · hand-painted material language.

**Must not drift toward:** generic AI art · generic low-poly asset packs · asset-store visual mismatch · mobile-game aesthetics · voxel art · photorealism · visual noise · plastic materials · procedural repetition.

### The seven-question test, before adding anything

1. Why is this here?
2. Does it improve composition?
3. Does it belong to this environment?
4. Does it match the reference art direction?
5. Does it create useful depth?
6. Is it repeated too mechanically?
7. **Does it look procedurally generated?**

If 7 is yes — **redesign it.**

### Reference authority order

1. Explicit user decisions
2. `CLAUDE.md`
3. Approved project design documents
4. Dedicated production reference sheets
5. Environment composition references
6. General style references
7. AI-generated incidental details — **never authoritative**

An approved decision is never silently overridden by an image.
