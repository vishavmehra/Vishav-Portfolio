@AGENTS.md
# VISHAV MEHRA — 3D GAME PORTFOLIO
# Project Constitution & Engineering Guide

> This file is the persistent project-level instruction set for Claude Code.
> Read and follow it before making changes to the project.

---

# 1. PROJECT IDENTITY

This project is a personal portfolio presented as a small, polished,
playable 3D exploration game.

It is NOT a conventional portfolio website with 3D decorations.

The visitor enters a stylized 3D world, controls a character, explores
the environment, discovers locations, interacts with objects, and views
portfolio information through in-game interfaces.

The experience should feel like:
- a small indie exploration game
- an interactive personal world
- an engineering portfolio
- a carefully art-directed web experience

It should NOT feel like:
- an AI-generated portfolio template
- a SaaS landing page
- a generic Three.js demo
- a cyberpunk website
- a game overloaded with unnecessary mechanics
- a conventional portfolio with a 3D background

The 3D world is the primary navigation mechanism.
The portfolio content is the payload.
The interaction design should make the visitor curious enough to explore.

---

# 2. PRODUCT PHILOSOPHY

1. EXPERIENCE OVER DECORATION
Every animation, object and interaction should serve the experience.

2. SIMPLICITY OVER COMPLEXITY
Prefer the smallest implementation that solves the actual problem.

3. PERFORMANCE OVER EXCESS
A beautiful experience that runs poorly is a failed implementation.

4. CONTENT AND ENGINE MUST BE SEPARATE
The 3D engine should not know the details of individual projects,
companies, achievements or education entries.

5. DISCOVERABILITY WITHOUT HAND-HOLDING
The visitor should understand how to navigate without feeling like
they are following a website menu.

6. PERSONALITY WITHOUT GIMMICKS
Humor and personality should be subtle and intentional.

7. PROGRESSIVE COMPLEXITY
Build the simplest version first. Do not implement future systems early.

---

# 3. ROLES

DESIGNER / PRODUCT OWNER
- Determines visual direction
- Determines experience
- Determines what feels good
- Provides final design decisions

ARCHITECT / REASONING LAYER
- Defines architecture
- Defines system boundaries
- Reviews implementation decisions
- Optimizes complexity
- Provides implementation direction

CLAUDE CODE / IMPLEMENTATION ENGINEER
- Writes code
- Modifies files
- Runs tests
- Uses available tools and MCPs when appropriate
- Reports implementation status
- Does not independently redesign the product

When requirements are ambiguous:
1. Preserve existing architecture.
2. Prefer the simplest interpretation.
3. Do not invent major features.
4. Do not redesign the product without explicit direction.

---

# 4. CORE USER EXPERIENCE

LOADING SCREEN
        ↓
3D WORLD
        ↓
PLAYER SPAWNS
        ↓
EXPLORE
        ↓
APPROACH DESTINATION
        ↓
INTERACTION PROMPT
        ↓
INTERACT
        ↓
SMALL IN-GAME WINDOW
        ↓
VIEW / EXPLORE CONTENT
        ↓
EXPANDED WINDOW
        ↓
CLOSE
        ↓
RETURN TO WORLD

The world should remain the central experience.
Interfaces should feel like part of the game rather than unrelated webpage modals.

---

# 5. LOADING EXPERIENCE

The first screen should display:

VISHAV MEHRA

Loading...

[██████████████░░]

Looking for the
"professional" version of me...

Not found.

Proceeding anyway.

The tone is intentionally dry and understated.

Do not add additional jokes unless explicitly requested.

The loading process must correspond to actual asset/application loading where practical.

NEVER artificially delay the application simply to make the loading animation visible.

If loading completes quickly, transition immediately.

---

# 6. GAME WORLD

The world is a compact stylized outdoor field.

The visual reference is the approved concept art provided by the designer.

The reference establishes:
- rolling grassy terrain
- winding paths
- trees
- natural environmental elements
- warm atmospheric lighting
- distinct destinations
- peaceful exploration
- strong foreground/midground/background composition

The reference is ART DIRECTION, not a literal specification.

Do not blindly reproduce every object.
The final world must be optimized for WebGL.

---

# 7. WORLD SCALE

The world should remain intentionally small.

Do NOT create:
- huge landscapes
- infinite terrain
- procedural open worlds
- unnecessary distant geometry
- large empty walking distances

The visitor should be able to reach important destinations quickly.

The world should feel larger through:
- terrain composition
- camera framing
- sightlines
- elevation
- paths
- fog/atmosphere where appropriate
- environmental composition

NOT through excessive geometry.

---

# 8. WORLD DESTINATIONS

The initial world contains four primary destinations:

1. PROJECTS
2. EXPERIENCE
3. EDUCATION
4. ACHIEVEMENTS

Possible future destinations:
- Skills
- Contact
- About
- Experiments
- Other

Do not add these until requested.

---

# 9. DESTINATION DESIGN

Destinations should be DIEGETIC.

Examples:

PROJECTS
- developer workstation
- computer
- technical workspace

EXPERIENCE
- desk
- workshop
- professional workspace

EDUCATION
- books
- reading area
- study environment

ACHIEVEMENTS
- trophies
- medals
- achievement display
- monument / display area

Avoid giant floating text labels.
Avoid giant UI billboards.
Avoid "PROJECTS" written across the sky.

The environment should communicate purpose visually.

---

# 10. NAVIGATION GUIDANCE

The player should know where important locations are.

However, navigation guidance must remain subtle.

Preferred methods:
1. Physical signs/trail markers
2. Natural paths
3. Environmental landmarks
4. Temporary onboarding instructions
5. Directional indicator when a destination is outside the camera view

At spawn, the player may briefly see:

WASD / ARROWS
TO EXPLORE

Directional guidance may identify nearby destinations.

This guidance should fade or become less prominent after the player begins exploring.

If a destination is already clearly visible in the camera view, a directional arrow is unnecessary.

Directional arrows should only appear when useful.

Navigation calculations must remain cheap.
Do NOT implement pathfinding for this.
A destination direction can be calculated with simple vector math.

---

# 11. PLAYER

The player is the visitor's avatar.

The player does NOT represent Vishav literally.

The player should be a simple stylized character.

Required behavior:
- idle
- walking
- smooth movement
- third-person camera
- basic collision
- responsive controls

Avoid:
- complex character customization
- facial systems
- unnecessary skeletal complexity
- combat systems
- inventory
- quests
- NPC systems

This is an exploration portfolio, not a full game.

---

# 12. INPUT ARCHITECTURE

Desktop:
- W A S D
- Arrow keys
- E → interact
- ESC → close interface

Mobile:
- Virtual joystick → movement
- Contextual INTERACT button → interaction
- Touch/swipe → carousel navigation where appropriate
- Close button → close interfaces

IMPORTANT:
Keyboard and touch must share the same player-control logic.

Conceptually:

KeyboardInput ─────┐
                   ├──> PlayerController ──> Player
TouchInput ────────┘

Do NOT implement two independent movement systems.

Both inputs should produce a normalized movement representation.

---

# 13. MOBILE IS A FIRST-CLASS PLATFORM

Mobile support is NOT an afterthought.

The game must be designed for:
- phones
- tablets
- desktop

Touch controls must be comfortable.
The game should remain usable at narrow screen sizes.

Avoid requiring keyboard-only interactions.

Every essential desktop action needs a mobile equivalent.

The project must not depend on hover for essential functionality.

---

# 14. INTERACTION SYSTEM

Create ONE generic interaction system.

The player should not contain object-specific interaction logic.

Conceptually:

Interactable:
- id
- position
- interaction distance
- prompt
- interaction callback/action

The player only needs to know:
"I am near an interactable."

It should NOT know:
"this is the Projects computer."

Examples:
Computer → Projects
Desk → Experience
Bookshelf → Education
Trophy → Achievements

All use the same interaction mechanism.

---

# 15. INTERACTION PRIORITY

When multiple interactables are nearby:
Prefer the closest valid interactable.

The interaction system should:
1. detect nearby candidates
2. select the most relevant candidate
3. expose its prompt
4. allow interaction

Avoid expensive per-frame scans over large object lists.

For a small world, a simple spatial-distance check is sufficient.

If the number of interactables grows substantially, reassess the approach before introducing a complex spatial system.

---

# 16. IN-GAME WINDOW SYSTEM

Portfolio interfaces are in-game windows.
They are NOT standard webpage modals.

Interaction flow:

PLAYER
 ↓
approaches object
 ↓
E — INTERACT
 ↓
small contextual window
 ↓
E / action
 ↓
window expands
 ↓
detailed content

The window should visually transition from the small interaction interface into the large content interface.

Desktop:
- large centered panel
- retain some game-world context
- readable content
- internal scrolling

Mobile:
- large/full-screen panel
- optimized for touch
- readable typography
- internal scrolling

The window system must be generic.
It must not contain project-specific logic.

---

# 17. WINDOW BEHAVIOR

Windows should support:
- opening
- closing
- expansion
- internal scrolling
- responsive sizing
- keyboard navigation
- mobile touch interaction

Desktop:
ESC closes the active interface.

Mobile:
Provide an obvious close button.

Do not depend on hidden gestures.

Animation should be subtle and fast.
Do not use expensive visual effects.

---

# 18. PROJECT SYSTEM

Projects are the most detailed portfolio section.

When the player approaches the Projects interactable:

PROJECTS

◀ Project Name ▶

Preview

Short description

Tech stack

[ VIEW PROJECT ]

Multiple projects are navigated using a carousel.

Desktop:
- keyboard controls where appropriate

Mobile:
- swipe/touch navigation

If there are:
5 images → carousel
1 image → static image
0 images → no empty image container

The UI must adapt to content.

---

# 19. PROJECT VIEWER

When VIEW PROJECT is activated:
The project window expands.

The expanded project viewer may contain:
- Overview
- Description
- Story
- Images
- Architecture
- Folder Structure
- Data Flow
- Features
- Algorithms
- APIs
- Database
- Design Decisions
- Challenges
- Solutions
- Contribution
- Results
- Tech Stack
- Links
- Limitations
- Future Work

Not every project will contain every section.

EVERY SECTION IS OPTIONAL.

Missing data means:
DO NOT RENDER THE SECTION.

Never show:
- empty cards
- blank containers
- "N/A"
- "Information unavailable"
- placeholder paragraphs
- fake data

The remaining content must naturally reflow.

---

# 20. CONTENT-FIRST ARCHITECTURE

The game engine and portfolio content must be completely separated.

The game engine should not contain:
- project descriptions
- company descriptions
- achievement text
- education details
- technical case studies

Content belongs in the data layer.

Conceptually:

src/
  game/
  ui/
  data/
  types/

data/
  projects/
  experience/
  education/
  achievements/
  skills/

The game consumes data.
It does not define the data.

---

# 21. PROJECT DATA MODEL

The project schema must be flexible and extensible.

Conceptual structure:

Project
├── id
├── title
├── shortDescription
├── description
├── story
├── images
├── techStack
├── architecture
├── folderStructure
├── dataFlow
├── features
├── algorithms
├── APIs
├── database
├── designDecisions
├── challenges
├── solutions
├── contribution
├── results
├── limitations
├── futureWork
└── links

Fields should be optional where appropriate.

Do not require every project to conform to the maximum level of detail.

---

# 22. EXTENSIBLE CONTENT

The system should allow new project sections to be added without rewriting the entire application.

Possible future sections:
- Performance
- Security
- Testing
- Deployment
- Research
- Experiments
- Lessons Learned
- Future Improvements

Do not implement all of these now.
The architecture should simply not prevent them.

---

# 23. STRUCTURED ARCHITECTURE DATA

Architecture should ideally be represented as structured data rather than only as a paragraph.

Conceptually:

architecture:
  overview
  layers:
    - name
      technologies
      responsibilities
  components:
    - name
      responsibility
  relationships:
    - from
      to
      relationship

This allows the portfolio to eventually render:
- architecture diagrams
- component relationships
- data flows
- interactive technical explanations

Do not create architecture diagrams manually for every project if they can be generated from structured data.

---

# 24. REPOSITORY ANALYSIS

Project content will eventually be produced by analyzing real repositories.

The analysis may include:
- what the project does
- architecture
- folder structure
- data flow
- tech stack
- key components
- APIs
- databases
- algorithms
- design decisions
- challenges
- solutions
- contribution
- results
- limitations

The repository is the source of implementation truth.

Resumes and thesis documents are supporting sources.

Never invent technical details.

Never claim a feature exists simply because it sounds reasonable.

Distinguish between:
- implemented
- documented
- inferred
- unknown

When uncertain, prefer omission over fabrication.

---

# 25. SOURCE MATERIAL

The portfolio may use supporting material such as:
- resumes
- thesis documents
- thesis defense material
- project documentation
- repository source code
- project READMEs
- design documents

Source material should be treated as evidence.

If multiple sources conflict:
1. Prefer current verified project/repository information.
2. Prefer newer authoritative documents.
3. Do not silently choose a value when the conflict matters.
4. Flag the conflict for review.

---

# 26. PROFESSIONAL / CONFIDENTIAL INFORMATION

Never expose confidential, proprietary or internal company information in the public portfolio.

For professional work:
Use sanitized, high-level descriptions.

Do NOT publish:
- internal source code
- internal architecture diagrams
- proprietary APIs
- internal URLs
- license mechanisms
- confidential implementation details
- private company data
- internal tickets
- internal screenshots containing sensitive information

Only publish information that is appropriate for public disclosure.

When uncertain, ask for confirmation rather than exposing it.

---

# 27. 3D ASSET STRATEGY

3D assets must be selected with performance in mind.

Prefer:
- GLB/GLTF
- optimized geometry
- compressed textures
- reusable materials
- reusable meshes
- instancing for repeated objects

Avoid:
- unnecessary high-poly models
- massive textures
- duplicate geometry
- excessive unique materials
- unnecessary transparent materials
- huge texture atlases when not justified

The visual quality should come from composition and art direction, not brute-force polygon count.

---

# 28. RENDERING PERFORMANCE

Performance is a FIRST-CLASS CONSTRAINT.

Target:
- Desktop: ~60 FPS where practical
- Modern mobile: smooth 60 FPS where practical
- Lower-end devices: graceful quality reduction rather than unusable performance

Never sacrifice basic usability for visual effects.

---

# 29. GAME LOOP RULES

Do NOT use React state for values that change every frame.

Bad pattern:
setState(playerPosition) every frame.

Avoid per-frame React rendering.

Continuous game state belongs in:
- Three.js objects
- refs
- R3F frame loop
- appropriate imperative state

React should primarily manage:
- UI state
- window state
- selected project
- content state
- application-level state

Three.js/R3F should manage:
- player transform
- camera transform
- continuous movement
- animation
- rendering

---

# 30. MEMORY ALLOCATION

Avoid unnecessary allocations inside the render loop.

Do not repeatedly create:
- vectors
- arrays
- objects
- geometries
- materials

inside per-frame callbacks unless unavoidable.

Reuse temporary objects where practical.

Do not prematurely optimize everything.
Optimize actual hot paths.

---

# 31. DRAW CALLS

Minimize draw calls.

Prefer:
- shared materials
- shared geometries
- instancing
- merged static geometry where useful
- simple materials

Repeated environmental elements should be candidates for instancing.

Do not blindly instance objects where it makes the architecture more complex without meaningful performance benefit.

---

# 32. LIGHTING

Keep lighting intentionally simple.

Prefer:
- ambient/environment lighting
- a small number of important lights
- baked/static approaches where appropriate
- simple shadows

Avoid large numbers of dynamic shadow-casting lights.

Do not introduce expensive global illumination systems unless there is a clear reason.

---

# 33. POST-PROCESSING

Post-processing is NOT the default.

Do not add:
- bloom
- heavy depth of field
- excessive motion blur
- expensive screen-space effects

unless explicitly justified by visual design and tested for performance.

The world should look good without relying on expensive effects.

---

# 34. ASSET LOADING

Use progressive/lazy loading.

Initial load should contain only what is required to enter the world.

Do not load every:
- project screenshot
- architecture image
- detailed model
- project asset

during initial page load.

Load detailed content when the user opens it.

---

# 35. CODE SIZE

Do not write code merely because code can be written.

Prefer:
- small functions
- clear data structures
- direct logic
- reusable components where reuse exists

Avoid:
- unnecessary design patterns
- unnecessary factories
- unnecessary managers
- excessive dependency injection
- abstraction layers for hypothetical requirements
- hundreds of lines for simple behavior

If a feature can be implemented cleanly in 30 lines instead of 200, prefer the simpler solution.

---

# 36. DEPENDENCY POLICY

Preferred baseline:
- Next.js
- TypeScript
- React
- Three.js
- React Three Fiber
- Drei
- Tailwind CSS

Rapier may be introduced when collision/physics requirements justify it.

Before adding a dependency, ask:
"Can the existing stack solve this cleanly?"

If yes:
DO NOT add the dependency.

Do not add libraries simply because they are popular.

---

# 37. ANIMATION

Use the simplest suitable animation system.

Use:
- CSS transitions for simple UI transitions
- Three.js interpolation for simple 3D motion
- R3F animation mechanisms for 3D
- GSAP only when it provides meaningful value for complex coordinated UI transitions

Do not use a large animation system for a simple interpolation.

Player movement should NOT depend on GSAP.

---

# 38. DESIGN LANGUAGE

The visual language should be:
- stylized
- calm
- premium
- slightly whimsical
- minimal
- atmospheric
- intentional

Avoid:
- generic gradients
- excessive glassmorphism
- glowing neon borders
- cyberpunk aesthetics
- excessive floating cards
- generic SaaS layouts
- "AI portfolio" visual clichés
- unnecessary 3D text

The environment should carry most of the personality.

---

# 39. UI LANGUAGE

UI should feel like it belongs to the game.

It should not look like an unrelated web application layered on top.

Windows should have:
- clear hierarchy
- restrained decoration
- strong typography
- readable spacing
- subtle transitions

Do not make every interface look like a hacker terminal.

Do not use fake terminal commands unless explicitly requested.

---

# 40. RESPONSIVE DESIGN

The game must work across:
- desktop
- tablet
- mobile

Do not simply scale the desktop interface down.

Mobile may require:
- larger touch targets
- full-screen project viewer
- simplified UI
- fewer simultaneous controls
- adjusted camera
- shorter traversal distances

The underlying data and interaction systems should remain shared.

---

# 41. ACCESSIBILITY

Essential interactions must not depend solely on:
- hover
- color
- tiny text
- hidden gestures

Provide:
- keyboard controls
- touch controls
- readable UI
- visible close controls
- adequate touch targets
- sensible focus behavior for UI

Respect prefers-reduced-motion.

When reduced motion is requested, reduce nonessential animation while preserving functionality.

---

# 42. ERROR HANDLING

The application should fail gracefully.

If:
- a project image fails
- optional content is missing
- an asset fails to load
- a project field is absent

the rest of the portfolio should remain usable.

Do not allow optional content to crash the entire application.

---

# 43. TESTING

Test every meaningful milestone.

DESKTOP
- movement
- camera
- interaction
- keyboard controls
- project navigation
- window opening
- window closing

MOBILE
- joystick
- movement
- interaction button
- carousel swipe
- expanded project viewer
- close button
- scrolling

Also check:
- console errors
- failed network requests
- build errors
- memory leaks
- obvious frame-rate problems

---

# 44. BROWSER / DEVELOPMENT TOOLS

Use available development tools when useful.

Potential tools include:
- Playwright
- Chrome DevTools MCP
- Context7
- Sentry
- Vercel
- Figma MCP
- Supabase MCP
- other installed project skills/MCPs

Do NOT invoke every tool for every task.

Use a tool only when it provides meaningful value.

Examples:

Context7:
Use when current library/API documentation is important.

Playwright:
Use for browser interaction and regression testing.

Chrome DevTools:
Use for performance/network/runtime investigation.

Figma:
Use when designing or inspecting UI layouts.

Sentry:
Use after deployment or when investigating production runtime issues.

Vercel:
Use for deployment/hosting tasks.

Supabase:
Use only if the application actually requires Supabase.

---

# 45. SKILL USAGE

Installed skills may include tools related to:
- planning
- design
- animation
- React/Next.js
- GSAP
- code review
- performance
- browser testing
- repository analysis

Use them selectively.

Do not blindly apply design skills to already-approved designs.

Do not blindly apply animation skills to simple interactions.

Do not allow a skill/tool to override the project's architecture.

The project constitution takes precedence over generic tool suggestions.

---

# 46. PLANNING

For substantial features:

1. Understand the existing architecture.
2. Inspect relevant files.
3. Identify the smallest implementation.
4. Plan the change.
5. Implement.
6. Test.
7. Review for unnecessary complexity.
8. Report the result.

Do not immediately rewrite large portions of the project.

---

# 47. MILESTONE DISCIPLINE

The project is developed in milestones.

MILESTONE 1
Foundation

MILESTONE 2
Player

MILESTONE 3
Mobile controls

MILESTONE 4
World/environment

MILESTONE 5
Interaction

MILESTONE 6
Window system

MILESTONE 7
Projects

MILESTONE 8
Experience/Education/Achievements

MILESTONE 9
Project repository analysis

MILESTONE 10
Polish

MILESTONE 11
Performance optimization

MILESTONE 12
Deployment

Do NOT implement future milestones unless explicitly requested.

---

# 48. MILESTONE 1

Implement:
- Next.js foundation
- TypeScript
- R3F
- Three.js canvas
- camera
- simple placeholder environment
- basic lighting

Do NOT implement:
- final environment
- final character
- project viewer
- portfolio content
- complex physics
- audio
- advanced effects

The purpose is simply to prove the 3D foundation works.

---

# 49. MILESTONE 2

Implement:
- placeholder player
- WASD
- arrow keys
- smooth movement
- third-person camera
- basic collision

Do NOT implement mobile controls yet.

---

# 50. MILESTONE 3

Implement:
- virtual joystick
- touch movement
- responsive mobile controls
- shared keyboard/touch movement architecture

Do not duplicate movement logic.

---

# 51. MILESTONE 4

Implement the actual field environment.

Use the approved concept art as visual direction.

Implement:
- terrain
- paths
- trees
- environmental objects
- four destination areas

Keep geometry and assets optimized.

---

# 52. MILESTONE 5

Implement:
- generic interactable system
- proximity detection
- contextual prompt
- E interaction
- mobile interaction button
- placeholder interaction response

---

# 53. MILESTONE 6

Implement:
- compact in-game window
- expansion
- close
- internal scrolling
- responsive mobile layout
- generic window architecture

---

# 54. MILESTONE 7

Implement:
- project schema
- project data
- project carousel
- project preview
- expanded project viewer
- optional sections
- links

---

# 55. MILESTONE 8

Implement:
- Experience
- Education
- Achievements
- Skills
- Contact

Reuse existing systems.
Do not create incompatible UI systems.

---

# 56. MILESTONE 9

Analyze real repositories and source material.

Produce structured project information.

Do not invent technical information.

Convert validated results into portfolio data.

---

# 57. MILESTONE 10

Polish:
- loading screen
- transitions
- environmental details
- subtle animations
- navigation guidance
- optional sound

Do not add effects simply for visual spectacle.

---

# 58. MILESTONE 11

Perform actual performance profiling.

Investigate:
- FPS
- draw calls
- memory
- React re-renders
- WebGL rendering
- asset loading
- texture sizes
- geometry
- materials
- network
- bundle size
- mobile performance

Optimize measured bottlenecks.

Do not blindly rewrite working systems.

---

# 59. MILESTONE 12

Production:
- production build
- deployment
- desktop testing
- mobile testing
- error monitoring
- performance validation

---

# 60. CHANGE MANAGEMENT

Before modifying an existing system:

1. Understand why it exists.
2. Check what depends on it.
3. Avoid breaking existing behavior.
4. Make the smallest appropriate change.

Do not rewrite working architecture simply because a different approach looks cleaner.

If a rewrite is genuinely justified, explain why before doing it.

---

# 61. NO UNNECESSARY REFACTORING

When implementing a feature:

DO NOT:
- rename unrelated files
- rewrite unrelated components
- change the entire state architecture
- introduce new libraries
- reformat the entire repository
- redesign unrelated UI

Keep changes scoped.

---

# 62. NO PLACEHOLDER TECHNICAL CLAIMS

Never create fake:
- project statistics
- architecture
- performance numbers
- algorithms
- company responsibilities
- achievements
- technologies
- links

If real information is not available:
leave it absent.

The portfolio must be factually defensible.

---

# 63. EXTERNAL LINKS

Project links such as:
- GitHub
- live demo
- thesis
- article
- documentation

must come from validated project data.

Do not invent URLs.

---

# 64. PERFORMANCE REVIEW BEFORE MERGE

Before considering a significant feature complete, ask:

- Did this introduce unnecessary rendering?
- Did this introduce unnecessary React state?
- Did this add a dependency?
- Did this increase draw calls?
- Did this create per-frame allocations?
- Did this increase initial loading?
- Does it work on mobile?
- Can the implementation be simpler?

If yes, simplify before finishing.

---

# 65. DEFINITION OF DONE

A feature is not complete merely because the code compiles.

A feature is complete when:
- intended behavior works
- desktop works
- mobile works where relevant
- no obvious console errors
- no unnecessary complexity
- architecture remains clean
- performance remains acceptable
- optional data does not break UI
- existing functionality still works

---

# 66. CLAUDE WORKING STYLE

When asked to implement a task:

1. Inspect the repository.
2. Read this file.
3. Identify relevant existing systems.
4. Make a concise implementation plan.
5. Implement only the requested scope.
6. Test it.
7. Review the implementation for unnecessary complexity.
8. Report what changed.

Do not continue into unrelated future work.

Do not assume that "while you're here" means redesign everything.

---

# 67. RESPONSE FORMAT AFTER IMPLEMENTATION

After completing a meaningful task, report:

## Implemented
What was added.

## Changed
Files modified.

## Dependencies
Any dependencies added and why.

## Tested
What was tested.

## Performance
Any relevant performance considerations.

## Known limitations
Anything intentionally deferred.

Then STOP.

Do not automatically start the next milestone.

---

# 68. FINAL PRODUCT PRINCIPLE

The final website should make a visitor think:

"I've never seen a portfolio presented like this."

Not:

"This is another AI-generated portfolio."

The experience should be memorable because of:
- exploration
- art direction
- interaction
- storytelling
- engineering depth
- personality
- performance

NOT because of:
- excessive effects
- visual noise
- unnecessary technology
- huge amounts of code
- generic 3D gimmicks

Build less.

Make it better.
