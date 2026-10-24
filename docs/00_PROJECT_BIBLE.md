# 00 — PROJECT BIBLE

> **Status:** Approved product vision
> **Authority:** This document defines *what the product is*. It sits under `CLAUDE.md` (the project constitution) and above all other docs in `docs/`.
> **Last updated:** 2026-08-29
> **Related:** [01_WORLD_DESIGN_BIBLE.md](01_WORLD_DESIGN_BIBLE.md) · [03_GAMEPLAY_AND_INTERACTION.md](03_GAMEPLAY_AND_INTERACTION.md) · [08_DESIGN_DECISIONS.md](08_DESIGN_DECISIONS.md)

---

## 1. What this is

A small, playable 3D exploration game that **is** the portfolio of Vishav Mehra.

The visitor loads a page, a stylized outdoor world appears, they take control of a character, and they walk through a meadow discovering places. Each place is a physical workspace built out of environmental storytelling — a desk under a tree, a workshop, a study, a monument. Walking up to one and interacting opens an in-world window containing real portfolio content.

The 3D world is not decoration around the portfolio. **The 3D world is the navigation.** There is no nav bar, no scroll-driven section reveal, no "hero section". Reaching the Projects content requires walking to the Projects workstation.

## 2. Why it is not a conventional portfolio

| Conventional portfolio | This |
|---|---|
| Nav menu / scroll sections | Physical traversal of a world |
| Content is immediately listed | Content is discovered |
| 3D is a background effect behind DOM | 3D is the primary layer; UI is summoned by it |
| Visitor reads | Visitor explores, then reads |
| Layout communicates hierarchy | Environment communicates hierarchy |
| Memorable because of visual effects | Memorable because of place |

The difference must be structural, not cosmetic. A conventional portfolio with a Three.js background bolted on is an explicit failure state (see §13).

## 3. Intended visitor experience

The emotional target, in order:

1. **Curiosity** — "wait, I can actually move?"
2. **Calm** — the world is peaceful, warm, unhurried. Nothing chases the visitor. Nothing is timed.
3. **Discovery** — "there's something over by that tree."
4. **Respect** — the content behind each destination is substantive engineering work, presented properly.
5. **Memory** — the visitor remembers the place, and therefore remembers the person.

The visitor should be able to get to real portfolio content within roughly **30–60 seconds** of the world loading, without instruction beyond a brief onboarding hint. Exploration is optional depth, never a tax.

**ASSUMPTION — the 30–60s target is a design goal derived from the "small world" rule in `CLAUDE.md` §7, not a measured requirement. Needs approval.**

## 4. Game philosophy

- It is a **game only to the extent that serves exploration.** Movement, camera, proximity, interaction. Nothing else.
- There is no failure state, no score, no timer, no combat, no enemies, no inventory, no XP, no quests, no skill tree, no NPC dialogue system.
- There is no tutorial beyond one short onboarding hint at spawn.
- The world is small and hand-composed. It is never procedurally generated, never infinite, never streamed.
- **Audio is deferred** (DD-27). No sound, no audio architecture, no audio dependencies during the gameplay and world milestones. Whether the world gets sound at all is a later decision.
- Complexity is spent on *composition and feel*, never on mechanics.

If a mechanic does not make finding or reading portfolio content better, it does not ship.

## 5. Visual philosophy

Established by the approved Gemini references in `design/references/` and documented in full in [01_WORLD_DESIGN_BIBLE.md](01_WORLD_DESIGN_BIBLE.md).

Summary of the direction:

- Stylized premium indie game art — clean geometry, flat-shaded surfaces, hand-painted accents.
- Warm natural light. Soft golden atmosphere. Muted, natural palette.
- Lush grass, rolling terrain, winding dirt paths, a stream, rounded mossy rocks, large expressive trees, controlled wildflowers.
- Handcrafted wooden structures, weathered and lived-in.
- Calm, slightly whimsical, never twee.
- Strong foreground / midground / background layering with atmospheric depth.
- One warm accent, `#F0932B`, used sparingly (DD-23) — the player's visor, interaction states, selected UI states, small lighting accents. It is a signal, never the dominant colour of the world.

Quality comes from **composition, silhouette, light and material** — not polygon count, not texture resolution, not post-processing.

## 6. Interaction philosophy

- **One generic interaction system.** The player knows only "I am near something interactable." It never knows what that thing represents.
- **Diegetic destinations.** A monitor means Projects because it is a workstation, not because a label says so.
- **Interfaces belong to the world.** Windows are in-game panels that grow out of the interaction, not web modals dropped on top of a canvas.
- **Discoverability without hand-holding.** Paths, landmarks, sightlines and terrain do the navigation work. Explicit guidance is temporary and minimal.
- **Every essential action works with keyboard and with touch.** Neither is a port of the other; both feed the same system.

## 7. Personality

Dry, understated, confident. Present in three places and nowhere else:

1. The loading screen joke (§9).
2. The choice to build a world at all — the format *is* the personality.
3. Small environmental details: a mug on the desk, a bedroll on the character's pack, scattered notebooks.

The personality is **not** in the copy. There are no quips in the UI, no fake terminal commands, no winking microcopy. `CLAUDE.md` §5: *do not add additional jokes unless explicitly requested.*

## 8. The character

The visitor's avatar is **Explorer Unit 7-B** — canonical, per the dedicated character sheet `design/references/explorer-unit-7b-character-sheet.jpg` (DD-24). The brass/copper robot in the master scene reference is **obsolete** and is not the player design.

A small stylized explorer robot: rounded cream helmet with a single warm-amber visor slot, olive tunic, leather strap with a brass compass, chunky boots, expedition backpack with bedroll and rope. Gender-neutral. **No facial features.**

The character deliberately does not represent Vishav. It is the *visitor*, dressed as someone who explores and documents — which is exactly what they are doing.

## 9. Loading experience

Actual loading, never simulated. The bar reflects real asset/application progress. If loading finishes early, the transition happens immediately — never padded to let the animation play out (`CLAUDE.md` §5).

Approved copy, verbatim:

```
VISHAV MEHRA

Loading...

[██████████████░░]

Looking for the
"professional" version of me...

Not found.

Proceeding anyway.
```

Tone: deadpan. Delivered plainly, no animation flourishes on the punchline. Full treatment in [05_UI_DESIGN_BIBLE.md](05_UI_DESIGN_BIBLE.md).

## 10. Exploration flow

```
LOADING SCREEN
     ↓
WORLD FADES IN — player at spawn, brief onboarding hint
     ↓
EXPLORE — paths, sightlines and landmarks pull the player outward
     ↓
DESTINATION COMES INTO VIEW
     ↓
APPROACH → interaction prompt appears
     ↓
E / INTERACT
     ↓
SMALL IN-WORLD WINDOW — summary, carousel where relevant
     ↓
EXPAND
     ↓
FULL CONTENT — scrollable, section-driven
     ↓
CLOSE (ESC / close button)
     ↓
BACK IN THE WORLD, exactly where they left off
```

The world is never unloaded, never re-created, and never loses the player's position across this loop. Closing a window returns control instantly.

## 11. Portfolio sections

Four primary destinations exist in the initial world:

| Destination | Payload |
|---|---|
| **PROJECTS** | The deepest section. Carousel of projects, each expanding into a full technical case study. |
| **EXPERIENCE** | Professional history, sanitized for public disclosure (`CLAUDE.md` §26). |
| **EDUCATION** | Academic background, thesis, coursework. |
| **ACHIEVEMENTS** | Awards, recognitions, competitions. |

Possible later: Skills, Contact, About, Experiments. **Not built until requested** (`CLAUDE.md` §8).

## 12. Platform experience

### Desktop

- Full-viewport 3D world.
- WASD / arrow keys to move, `E` to interact, `ESC` to close.
- Third-person follow camera.
- Windows are large centred panels that deliberately leave the world visible around them — the visitor should never lose the sense of standing somewhere.

### Mobile — a first-class platform, not a fallback

- Virtual joystick for movement; contextual INTERACT button that appears only when something is in range.
- Swipe for carousels; a visible, obvious close control. No hidden gestures.
- Full-screen content panels, larger type, larger touch targets.
- Camera framing and traversal distances tuned for the narrower viewport — mobile is not the desktop layout scaled down.
- Nothing essential depends on hover.

The **data layer, interaction system and movement system are shared.** Only presentation and input differ.

## 13. What this must never become

Hard failure states. If the build starts resembling any of these, stop and correct:

- A conventional portfolio website with a 3D background.
- A generic Three.js demo — spinning objects, orbit controls, no place.
- An AI-generated portfolio template. Generic gradients, floating glass cards, "Hi, I'm X" hero.
- A SaaS landing page.
- Cyberpunk / neon / holographic / hacker-terminal aesthetics.
- A world plastered with giant floating text labels or sky-writing.
- A game with mechanics nobody asked for.
- A large open world with long empty walks.
- A beautiful experience that runs badly. Performance is product (`CLAUDE.md` §28).
- Anything factually indefensible — invented statistics, invented architecture, invented links (`CLAUDE.md` §62, §63).

## 14. The one-line test

> *"I've never seen a portfolio presented like this."*

Not:

> *"This is another AI-generated portfolio."*

Build less. Make it better.
