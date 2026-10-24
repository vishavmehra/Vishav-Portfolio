# 06 — CONTENT SYSTEM

> **Status:** Specification, not yet implemented (Milestones 7, 8, 9)
> **Authority:** `CLAUDE.md` §19–§26, §62, §63.
> **Last updated:** 2026-08-29
> **Related:** [04_TECHNICAL_ARCHITECTURE.md](04_TECHNICAL_ARCHITECTURE.md) · [05_UI_DESIGN_BIBLE.md](05_UI_DESIGN_BIBLE.md)

---

## 1. The rule

**The renderer must never depend on specific content.**

No component may contain a project name, a company name, a school name, or a description. Grep the whole of `src/game/` and `src/ui/` for any real project title — the result must be empty. Content lives in `src/data/`, typed by `src/types/`, and flows one way into generic renderers.

Consequences:

- A new project is a new data file. Zero component changes.
- A fifth destination is a data file plus one interactable registration. Zero engine changes.
- A project with three fields and a project with twenty fields render through the same code path.

## 2. Data flow

```
   src/types/          schema — every optional field marked optional
        │
        ▼
   src/data/           content, one file per entry
     projects/
     experience/
     education/
     achievements/
        │
        ▼
   ui/sections/        generic section renderers, presence-driven
        │
        ▼
   ui/window/          generic window shell — open, expand, scroll, close
```

`src/game/` never appears in this diagram. It never imports content (`CLAUDE.md` §20).

## 3. Project schema

Conceptual shape. **Only `id` and `title` are required.** Everything else is optional.

| Field | Type | Notes |
|---|---|---|
| `id` | string | **Required.** Stable key. |
| `title` | string | **Required.** |
| `shortDescription` | string | One line for the small window |
| `description` | string / rich | Full overview |
| `story` | string / rich | Narrative — why it exists, what happened |
| `images` | array | 0 → no container · 1 → static · 2+ → carousel |
| `techStack` | array | Rendered as chips |
| `architecture` | structured | See §4 |
| `folderStructure` | structured / text | Tree representation |
| `dataFlow` | structured / text | |
| `features` | array | |
| `algorithms` | array | |
| `apis` | array | |
| `database` | structured / text | |
| `designDecisions` | array | Decision + reasoning pairs |
| `challenges` | array | |
| `solutions` | array | |
| `contribution` | string / rich | What *Vishav* did, specifically |
| `results` | array / structured | Only verifiable outcomes |
| `limitations` | array | |
| `futureWork` | array | |
| `links` | array | Typed: github · demo · thesis · article · docs |
| `meta` | object | Dates, role, status, confidence — see §7 |

Field names above are conceptual. Exact TypeScript naming is settled at implementation time.

Schemas for **experience**, **education** and **achievements** follow the same pattern: a small required core, everything else optional. They reuse the same section renderers wherever the shape allows (`CLAUDE.md` §55 — do not create incompatible UI systems).

## 4. Structured architecture data

Architecture should be **structured data, not only a paragraph** (`CLAUDE.md` §23), so the portfolio can eventually render diagrams rather than hand-drawing one per project:

```
architecture:
  overview: string
  layers:
    - name, technologies[], responsibilities[]
  components:
    - name, responsibility
  relationships:
    - from, to, relationship
```

This enables later rendering of architecture diagrams, component relationship maps, data-flow visualisations and interactive technical explanations — from data, generated once, for every project.

**ASSUMPTION —** the initial implementation renders this structure as clean typographic blocks. Diagram rendering is deferred until the structured data exists for real projects. Needs approval.

## 5. Optional sections — the hard rule

A missing field renders **nothing**. Not an empty card, not a heading with no body, not a placeholder.

**Never render:**

❌ empty cards · ❌ blank containers · ❌ `N/A` · ❌ "Information unavailable" · ❌ "Coming soon" · ❌ placeholder paragraphs · ❌ lorem ipsum · ❌ invented descriptions · ❌ greyed-out disabled sections

**Required behaviour:**

- Absent field → section omitted entirely.
- Remaining content **reflows naturally**. No gaps, no orphaned rules, no broken rhythm.
- Empty array is treated as absent.
- `images: []` → no image container at all (`CLAUDE.md` §18).

A project with four populated fields must look **deliberately concise**, never unfinished. If a sparse project looks broken, the renderer is wrong — not the data.

## 6. Content pipeline

```
   RESUME
   THESIS
   PROJECT DOCUMENTATION
   GITHUB REPOSITORY
            ↓
      CLAUDE ANALYSIS
            ↓
   STRUCTURED PROJECT DATA
            ↓
        PORTFOLIO
```

Source hierarchy (`CLAUDE.md` §24, §25):

1. **The repository is the source of implementation truth.** What the code does is what the project does.
2. Resumes, theses and documentation are **supporting evidence**.
3. On conflict: prefer current verified repository information, then newer authoritative documents. **Never silently pick a value when the conflict matters — flag it for review.**

## 7. Truth discipline

**Never invent technical details.** Never claim a feature exists because it sounds plausible (`CLAUDE.md` §24, §62).

Every claim must be classifiable:

| Level | Meaning | Publishable |
|---|---|---|
| **Verified** | Confirmed in the repository source | Yes |
| **Documented** | Stated in a README, thesis, or project doc | Yes, attributed as documented |
| **Inferred** | Reasonable deduction from evidence | Only if marked, and only where useful |
| **Unknown** | Not determinable | **No — omit the field** |

**ASSUMPTION —** confidence is tracked in `meta` on each entry, kept in the source data as an authoring aid, and not surfaced in the UI. Needs approval.

Never fabricate: statistics · performance numbers · architecture · algorithms · responsibilities · achievements · technologies · dates · URLs.

When information is unavailable, **omission beats fabrication**. A shorter, true portfolio is the goal.

## 8. Links

Every link comes from validated project data (`CLAUDE.md` §63). **URLs are never invented, never guessed, never constructed from a pattern.**

Typed link kinds: `github` · `demo` · `thesis` · `article` · `docs`.

- A link with no verified URL is simply absent.
- Dead links are a factual defect — links are verified when content is authored.
- External links open in a new tab with `rel="noopener noreferrer"`.

## 9. Professional and confidential information

For anything relating to employment (`CLAUDE.md` §26):

**Never publish:** internal source code · internal architecture diagrams · proprietary APIs · internal URLs · licensing mechanisms · confidential implementation details · private company data · internal tickets · screenshots containing sensitive information.

**Publish instead:** sanitized, high-level descriptions of responsibility, domain and technology — the kind of thing that appears on a public résumé.

When uncertain, **ask for confirmation rather than publishing** (`CLAUDE.md` §26). This applies to Experience most, but also to any project done under an employer or a client.

## 10. Extensibility

New section types must be addable **without rewriting the project viewer** (`CLAUDE.md` §22). Possible future sections: Performance · Security · Testing · Deployment · Research · Experiments · Lessons Learned.

- None of these are built now.
- The architecture must simply not prevent them: a section renderer is chosen by data shape, and the viewer iterates a section list rather than hard-coding an ordered sequence of named blocks.
- **No abstraction is built ahead of need** (`CLAUDE.md` §35). "Not prevented" is the requirement, not "already supported".

## 11. Content loading

- Content **metadata** (titles, short descriptions, tech stacks) is small and may load with the world.
- **Detail payloads** — full descriptions, screenshots, architecture imagery — load on demand when a window opens (`CLAUDE.md` §34).
- Nothing project-specific is fetched during the initial page load.
- Failures degrade gracefully: a missing image is omitted, the window stays usable, the world is unaffected (`CLAUDE.md` §42).

## 12. Open assumptions requiring approval

| # | Assumption |
|---|---|
| F1 | Architecture data renders as typographic blocks initially; diagrams deferred |
| F2 | Confidence level tracked in `meta`, not surfaced in the UI |
| F3 | Experience / Education / Achievements reuse the project section renderers wherever shapes allow |
