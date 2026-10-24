MASTER_UPDATE_SPEC.md
VISHAV MEHRA — COMPLETE GAME + PORTFOLIO EXPERIENCE
============================================================
This is the single authoritative implementation specification for the entire
project. Claude Code must read this document completely before changing code.
The project consists of TWO connected experiences:
GAME WORLD
A playable third-person Explorer world used as the visual foundation.
PORTFOLIO WORLD
A cinematic, scroll-driven 3D personal website that evolves naturally from
the same universe.
The two experiences share art direction, assets, lighting language, palette,
Explorer character, environmental vocabulary, and day/night treatment, but they
DO NOT share one giant input/controller architecture.
============================================================
0. NON-NEGOTIABLE PROJECT RULES
============================================================
IMPLEMENT the requested work. Do not return an inspection-only report.
Inspect the existing code before editing it.
Reuse existing working architecture wherever possible.
Do not duplicate systems that already exist.
Do not silently remove working functionality.
Do not invent personal information.
Do not fabricate projects, companies, roles, dates, education, achievements,
skills, contact details, URLs, resume files, or biography text.
Keep personal/content data separate from scene/UI implementation.
Preserve all approved authored GLB assets.
Do not modify the finalized Experience Cabin asset.
Do not replace authored assets with procedural low-quality substitutes.
The visual quality must come from composition, lighting, silhouette,
materials, camera choreography, and authored assets — not effect overload.
No pointer lock anywhere in the project.
Desktop camera remains free-mouse; cursor remains visible.
Test actual browser behavior, not only TypeScript/build output.
Typecheck must pass.
Production build must pass.
Fix console/runtime errors before completion.
Verify desktop and mobile viewports.
Do not claim a behavior works unless it was actually tested.
If a requirement conflicts with an older implementation detail, this
document is the source of truth.
============================================================
1. GAME EXPERIENCE — SOURCE OF TRUTH
============================================================
The existing game is already the technical and visual foundation.
Do not redesign the game into a different product while rebuilding the
portfolio.
The game should remain:
playable
third-person
Explorer-centered
calm/adventurous
authored rather than procedural-looking
responsive on desktop and touch devices
The portfolio must later feel like this same world has become an interactive
personal website.
============================================================
2. GAME — DESKTOP INPUT
============================================================
Desktop movement:
W/A/S/D moves the Explorer.
Movement is camera-relative.
Base walking speed: approximately 4.0 units/second.
Holding Shift while moving enables sprint.
Sprint multiplier: approximately 1.8.
Sprint speed: approximately 7.2 units/second.
Space jumps.
Jump velocity: approximately 8.
Gravity: approximately 22.
No double jump.
Sprint + jump is supported.
The camera:
is controlled by the mouse
is free-look
does not use pointer lock
keeps the cursor visible
does not require RMB
does not hide the cursor
does not use Esc to release a pointer lock
must not introduce click-to-lock behavior
Mouse movement must affect camera yaw/pitch smoothly and predictably.
Movement direction must remain camera-relative.
============================================================
3. GAME — CTRL CAMERA-LOOK PAUSE
============================================================
Holding Left Ctrl temporarily freezes camera yaw/pitch.
While Ctrl is held:
mouse movement must not rotate the camera
cursor remains visible
UI can be clicked normally
player movement is not caused by Ctrl
no accumulated mouse delta should be applied on release
When Ctrl is released:
camera look resumes
there is no snap
there is no accumulated rotation jump
This behavior must not regress.
============================================================
4. GAME — MOBILE INPUT
============================================================
Mobile uses:
virtual movement joystick
touch camera drag on the right side
touch-safe UI
Joystick architecture:
keyboard and touch are separate input sources
both are combined through the existing normalized movement system
final movement vector is clamped to magnitude 1
joystick uses pointer events
pointer capture is used correctly
existing dead-zone behavior should be preserved
Touch-only devices:
do not activate desktop Shift sprint
do not activate desktop Space jump
use the existing mobile interaction model
Do not introduce browser horizontal scrolling.
============================================================
5. GAME — CAMERA
============================================================
Preserve the existing responsive follow-camera architecture.
Requirements:
responsive framing
camera-relative movement
smooth follow
no pointer lock
no hidden cursor
no abrupt camera snapping
no severe clipping through the environment
The existing aspect-ratio compensation should be retained where appropriate.
============================================================
6. GAME — EXPLORER
============================================================
Approved asset:
public/assets/3d/explorer-unit-7b.glb
The Explorer is:
15 bones
authored Idle/Walk animation
amber emissive visor
approximately 1.4 units tall
feet at z=0
forward direction -Z
Use SkeletonUtils.clone when multiple rendered instances are required.
Do not modify the source GLB.
Idle and Walk must be real authored animations.
Do not fake walking by translating a static model.
============================================================
7. GAME — WORLD ART
============================================================
Use the approved authored environment assets:
hero-tree-a.glb
hero-tree-b.glb
birch.glb
tree-conifer-a.glb
tree-conifer-b.glb
tree-conifer-c.glb
tree-distant-a.glb
tree-distant-b.glb
bush-a.glb
bush-b.glb
bush-c.glb
bush-d.glb
rock-a.glb
rock-b.glb
rock-c.glb
bridge.glb
river.glb
grass-clump-a.glb
grass-clump-b.glb
grass-clump-c.glb
grass-clump-d.glb
flower-lupine.glb
flower-daisy.glb
flower-clover.glb
experience-cabin.glb
projects-desk.glb
portfolio-platform.glb
Environment quality priorities:
lighting
silhouette
materials
composition
storytelling
density
Avoid:
spherical foliage
repetitive procedural vegetation
plastic materials
photorealistic textures
excessive saturation
generic AI landscape appearance
excessive fog
cinematic clutter
============================================================
8. GAME — FINALIZED EXPERIENCE CABIN
============================================================
public/assets/3d/experience-cabin.glb
The Experience Cabin is FINAL.
Do not:
edit its Blender source
re-export it
alter its geometry
alter its materials
change its culling configuration
change its palette
change its proportions
Compose it through:
position
rotation
scale only where explicitly safe
lighting
camera
surrounding environment
============================================================
9. GAME — RIVER / BRIDGE / ENVIRONMENT COMPOSITION
============================================================
The bridge and river are authored environment elements.
Bridge traversal must work correctly.
The river should remain visually integrated into the world rather than behaving
like a generic flat blue plane.
Use approved rock, bush, grass, flower, tree, and river variants to create
natural sightlines and environmental rhythm.
Do not clutter paths.
The Explorer must remain readable against the environment.
============================================================
10. GAME — PALETTE
============================================================
Authoritative visual palette:
--forest-950: #111814
--forest-900: #151D18
--forest-800: #1B241D
--parchment-100: #F2EBDD
--parchment-200: #E8DFC9
--parchment-300: #D4C8AF
--sage-500: #8F9B82
--sage-700: #687462
--bark-500: #5A4938
--stone-500: #77776B
--amber-500: #F0932B
--ember-500: #D97A32
Amber is an accent only.
Use amber mainly for:
Explorer visor
light sources
interaction states
active navigation
small emissive elements
environmental highlights
Do not make the entire world orange.
Do not let pale beige become the dominant website surface.
============================================================
11. GAME — CONTROLS / HUD
============================================================
Desktop controls:
WASD — Move
Shift + WASD — Sprint
Space — Jump
Mouse — Camera
E — Interact with portfolio destinations
E is ONLY for the four content destinations:
Projects
Experience
Education
Achievements
Do not reintroduce an exit InteractionType/contentKey.
============================================================
12. GAME — FINAL EXIT
============================================================
Final exit is DIRECT.
Desktop:
HOLD X TO EXIT
Mobile:
EXIT
There is NO E-before-X exit sequence.
There is NO proximity exit prompt.
The trailhead signpost is scenery only.
It is not:
an exit trigger
an interaction target
an exit content key
Desktop X behavior:
holding X begins exit
releasing before completion cancels
completion transitions to /portfolio
no E is required first
Mobile EXIT performs the same final transition directly.
Do not change this behavior while rebuilding the portfolio.
============================================================
13. GAME — TRANSITION TO PORTFOLIO
============================================================
The transition from game to portfolio should be short and intentional.
Do not return to the loading screen.
Do not create a second unrelated portfolio universe.
The portfolio should visually inherit:
Explorer
environment language
palette
lighting philosophy
day/night treatment
authored low-poly/faceted aesthetic
============================================================
14. APPROVED PORTFOLIO ASSETS
============================================================
The portfolio may reuse the same approved GLBs.
Required paths include:
public/assets/3d/explorer-unit-7b.glb
public/assets/3d/hero-tree-a.glb
public/assets/3d/hero-tree-b.glb
public/assets/3d/birch.glb
public/assets/3d/tree-conifer-a.glb
public/assets/3d/tree-conifer-b.glb
public/assets/3d/tree-conifer-c.glb
public/assets/3d/tree-distant-a.glb
public/assets/3d/tree-distant-b.glb
public/assets/3d/bush-a.glb
public/assets/3d/bush-b.glb
public/assets/3d/bush-c.glb
public/assets/3d/bush-d.glb
public/assets/3d/rock-a.glb
public/assets/3d/rock-b.glb
public/assets/3d/rock-c.glb
public/assets/3d/bridge.glb
public/assets/3d/river.glb
public/assets/3d/grass-clump-a.glb
public/assets/3d/grass-clump-b.glb
public/assets/3d/grass-clump-c.glb
public/assets/3d/grass-clump-d.glb
public/assets/3d/flower-lupine.glb
public/assets/3d/flower-daisy.glb
public/assets/3d/flower-clover.glb
public/assets/3d/experience-cabin.glb
public/assets/3d/projects-desk.glb
public/assets/3d/portfolio-platform.glb
Do not alter these assets to solve layout problems.
============================================================
15. PORTFOLIO — SINGLE CONTINUOUS WORLD
============================================================
The portfolio is ONE continuous scroll-driven 3D journey.
Architecture:
one primary R3F/WebGL scene
one primary portfolio camera
one JourneyController
one normalized journey-progress model
authored world waypoints
Explorer synchronized with journey progress
DOM content synchronized to world anchors
one coherent environment
The portfolio must NOT be implemented as unrelated static sections.
Do not make:
Hero -> static HTML section -> static HTML section -> static HTML section
Instead build:
ONE WORLD
Hero
↓
About clearing
↓
Experience cabin
↓
Projects desk
↓
Education area
↓
Skills landmark
↓
Achievements landmark
↓
Resume transition
↓
Contact clearing
The camera physically travels through this authored environment.
============================================================
16. PORTFOLIO — LOADING SCREEN
============================================================
Use Libraries.dev Thinking Orbs:
https://libraries.dev/orbs
Official package/library information identifies the Orb library as
`thinking-orbs`. Libraries.dev is designed to provide the install prompt,
package usage, and configuration vocabulary for coding agents.
Claude Code MUST inspect the actual current library prompt/source/API before
integrating it.
Do not approximate the orb with CSS.
The loader should be atmospheric rather than a generic spinner.
Sequence:
LOADING
↓
Thinking Orbs
↓
environment reveals
↓
Explorer resolves
↓
VISHAV MEHRA particle typography resolves
↓
hero stabilizes
↓
ENTER WORLD
The loader should visually belong to the world.
Palette:
forest dark
restrained amber
muted parchment
sage
subtle glow
No rainbow loader.
No generic circular progress ring.
No permanent loader render loop after loading.
Clean up:
animation loops
listeners
observers
temporary resources
Avoid a duplicate renderer where the library allows integration with the
existing architecture.
============================================================
17. PORTFOLIO — THRESHOLD / LANDING
============================================================
The initial portfolio state is a threshold, not a normal hero banner.
The visitor should feel:
"I am entering Vishav's world."
Use an atmospheric authored 3D composition.
Depth layers:
foreground:
foliage
grass
branches
rocks
midground:
Explorer
platform
small props
background:
trees
distant silhouettes
atmospheric depth
The scene must not look like a flat canvas with a model pasted into it.
============================================================
18. PORTFOLIO — HERO EXPLORER
============================================================
At the initial hero state:
Explorer faces the visitor
Explorer is grounded
Explorer uses the approved GLB
Explorer uses subtle authored Idle
visor is visible
proportions are intentional
lighting separates Explorer from the background
Explorer is the protagonist, not a decorative object.
============================================================
19. PORTFOLIO — MOUSE HEAD TRACKING
============================================================
Desktop only:
Explorer's head follows the user's cursor.
Cursor left:
head looks left
Cursor right:
head looks right
Cursor up:
head looks up
Cursor down:
head looks down
Requirements:
smooth interpolation
symmetric response
anatomical limits
no body rotation
no quaternion accumulation
no jitter
no drift
no snapping
no rest-pose corruption
Reuse the existing robust implementation where possible.
Mobile:
no cursor tracking
use subtle idle head movement instead
Reduced motion:
freeze or minimize head movement appropriately
============================================================
20. PORTFOLIO — DEPTH EFFECT
============================================================
The hero should have a multi-plane spatial depth effect inspired by the depth
behavior people recognize from modern device home-screen interfaces.
This is NOT an Apple clone.
Do not use Apple branding, copied UI, or copied visuals.
Create actual spatial layers:
foreground
Explorer
typography
midground
background
atmosphere
Pointer movement should create subtle differential parallax.
Foreground:
strongest movement
Midground:
medium movement
Background:
small movement
Explorer:
very subtle movement
Do not tilt the entire scene dramatically.
The goal is to make the visitor feel as if they are looking into a physical
space.
============================================================
21. PORTFOLIO — PARTICLE TYPOGRAPHY
============================================================
MANDATORY Componentry integration:
https://componentry.dev/docs/components/cursor-driven-particle-typography
Use the actual Componentry `CursorDrivenParticleTypography` implementation.
Current Componentry documentation describes it as particle-built typography
that disperses and reassembles under cursor interaction using spring physics.
Use it for:
VISHAV MEHRA
Do not replace it with homemade CSS particles.
Do not merely imitate the screenshot.
Inspect the actual install/source/API and integrate the real component.
The name must be:
large
readable
premium
spatially integrated
cursor-reactive
capable of subtle dispersion
capable of reforming naturally
It should look physically present in the hero rather than like a conventional
HTML heading.
============================================================
22. PORTFOLIO — HERO SCROLL START
============================================================
This is a critical authored moment.
Initial state:
Explorer faces visitor
VISHAV MEHRA is intact
camera is stable
hero has subtle idle motion
As scroll begins:
VISHAV MEHRA begins dispersing/fading
camera begins moving into the world
Explorer reacts to the change
Explorer turns away from the visitor
Explorer transitions Idle -> Walk
Explorer begins walking along the authored path
camera follows/choreographs the movement
world opens into the portfolio journey
Do not simply fade the hero and replace it with another section.
The transition must communicate:
"The journey has started."
============================================================
23. PORTFOLIO — WALK CYCLE QUALITY
============================================================
Use the authored Explorer Walk animation.
Requirements:
real animation playback
grounded feet
no sliding
no floating
no skating
no sudden direction changes
smooth Idle -> Walk
smooth Walk -> Idle
movement speed synchronized with animation
facing direction synchronized with path direction
The Explorer must actually walk through the world.
Do not translate a static pose and call it walking.
============================================================
24. PORTFOLIO — JOURNEY CONTROLLER
============================================================
Create/use a central JourneyController.
Conceptually:
scroll progress
↓
journey progress
↓
camera position
camera target
Explorer position
Explorer facing
Explorer animation
environment choreography
DOM anchors
section state
lighting
day/night
↓
render
Do not let each section independently manipulate the camera.
The JourneyController is the source of truth.
Use authored waypoints and interpolation.
============================================================
25. PORTFOLIO — WAYPOINTS
============================================================
Minimum authored destinations:
WAYPOINT 0 — HERO
WAYPOINT 1 — ABOUT CLEARING
WAYPOINT 2 — EXPERIENCE CABIN
WAYPOINT 3 — PROJECTS DESK
WAYPOINT 4 — EDUCATION AREA
WAYPOINT 5 — SKILLS AREA
WAYPOINT 6 — ACHIEVEMENTS LANDMARK
WAYPOINT 7 — RESUME
WAYPOINT 8 — CONTACT CLEARING
Each waypoint must have:
camera position
camera look target
Explorer position
Explorer facing direction
content anchor(s)
environment composition
lighting intent
entry/exit progress range
Do not use arbitrary DOM sections as the journey model.
============================================================
26. PORTFOLIO — ABOUT
============================================================
About is a physical world location.
Suggested composition:
forest clearing
negative space
authored vegetation
Explorer nearby
readable editorial typography
Use actual Componentry Text Repel:
https://componentry.dev/docs/components/text-repel
for:
ABOUT
The actual Text Repel component must be integrated rather than recreated.
Do not cover the world with a giant opaque card.
Long-form content may use ordinary DOM typography.
============================================================
27. PORTFOLIO — SIGNATURE
============================================================
At the end of About, use:
https://componentry.dev/docs/components/signature
Use the actual Componentry Signature implementation.
If no real signature asset/text is available:
do not fabricate a signature
keep the architecture ready for the real data
use a restrained placeholder state only if necessary
Do not turn the signature into a huge logo.
============================================================
28. PORTFOLIO — EXPERIENCE
============================================================
Experience is physically located around:
public/assets/3d/experience-cabin.glb
Do not modify the cabin.
The camera should approach it naturally.
Heading:
PROFESSIONAL EXPERIENCE
Use Text Repel:
https://componentry.dev/docs/components/text-repel
For multiple experience entries use:
https://componentry.dev/docs/components/orbit-card-stack
Inspect the actual Componentry implementation/API before installation.
Cards must feel like editorial objects within the environment.
Do not create a dashboard.
If experience data is empty, render the environment and structural heading
without fabricated jobs.
============================================================
29. PORTFOLIO — PROJECTS
============================================================
Projects are physically located around:
public/assets/3d/projects-desk.glb
Heading:
PERSONAL PROJECTS
Use Text Repel for the heading.
Use Orbit Card Stack for browsing project entries where appropriate.
Do not turn the destination into a grid of generic cards.
Cards should retain:
depth
tactile movement
readable typography
restrained surfaces
palette compatibility
connection to the 3D desk/world
If project data is empty, do not invent projects.
============================================================
30. PORTFOLIO — EDUCATION
============================================================
Education is a separate authored world location.
Heading:
EDUCATION
Use Text Repel where appropriate.
Data source:
src/data/education.ts
Do not fabricate education data.
Do not render education as another generic beige card.
============================================================
31. PORTFOLIO — SKILLS
============================================================
Skills must not become a generic grid of pills.
Use the environment and typography to create an editorial moment.
Data source:
src/data/skills.ts
If the file is empty, preserve the structural architecture without inventing
skills.
============================================================
32. PORTFOLIO — ACHIEVEMENTS
============================================================
Achievements get their own physical landmark.
Heading:
ACHIEVEMENTS
Use Text Repel where appropriate.
Data source:
src/data/achievements.ts
Do not fabricate achievements.
============================================================
33. PORTFOLIO — RESUME
============================================================
Resume is a destination/transition point rather than another card section.
Provide a clear Resume action only if a real resume file/link exists.
Do not fabricate a PDF, URL, or download path.
Keep the visual treatment minimal and consistent with the world.
============================================================
34. PORTFOLIO — CONTACT
============================================================
Contact is the final clearing.
Composition:
quiet environment
negative space
Explorer
subtle world motion
atmospheric lighting
restrained typography
Contact information must come only from actual data.
Never invent:
email
phone
GitHub
LinkedIn
social accounts
portfolio URLs
The ending should feel like reaching the end of a journey.
============================================================
35. PORTFOLIO — WHEEL NAVIGATION
============================================================
MANDATORY Componentry integration:
https://componentry.dev/docs/components/wheel-carousel
Use the actual Wheel Carousel component.
The visible navigation should initially be a subtle three-line control on the
RIGHT side.
Remove the old persistent left-side list.
Do not show:
START
ABOUT
EXPERIENCE
PROJECTS
EDUCATION
SKILLS
ACHIEVEMENTS
RÉSUMÉ
CONTACT
as a permanent large left-side navigation column.
The wheel contains destinations:
About
Experience
Projects
Education
Skills
Achievements
Resume
Contact
Selecting a destination must tell the JourneyController to move toward that
world waypoint.
Do not make `scrollIntoView()` the primary navigation mechanism.
The camera should travel through the world.
============================================================
36. PORTFOLIO — DAY / NIGHT
============================================================
Reuse the game's day/night visual language.
Do not build a generic website light/dark toggle.
Day:
warm natural light
forest palette
soft atmosphere
visible environmental detail
parchment accents
Night:
deeper forest
stronger silhouettes
cool ambient light
amber Explorer visor
amber world lights
subtle atmospheric contrast
The transition must affect:
ambient light
directional light
sky/background
fog/atmosphere
emissive elements
world appearance
The control should be small and unobtrusive.
============================================================
37. PORTFOLIO — DOM / WEBGL BOUNDARY
============================================================
Use WebGL for:
environment
Explorer
camera
landmarks
atmosphere
physical transitions
Use DOM for:
readable long-form content
project descriptions
experience details
education details
accessibility
navigation
controls
DOM must be synchronized with 3D world anchors.
DOM should feel attached to the world.
Do not use giant opaque cream rectangles over the viewport.
Prefer:
transparent composition
subtle surfaces
restrained borders
shadows where useful
world-aware placement
negative space
============================================================
38. PORTFOLIO — DATA ARCHITECTURE
============================================================
Keep personal content separate from the scene.
Existing files:
src/data/profile.ts
src/data/experience.ts
src/data/projects.ts
src/data/education.ts
src/data/achievements.ts
src/data/skills.ts
src/data/portfolio.ts
src/types/portfolio.ts
Do not hardcode personal content into:
HeroScene
JourneyController
navigation
section components
environment components
The scene must be able to support content changes by editing data files.
Current data may intentionally be empty except for the user's name.
Do not fill empty arrays with fake content.
============================================================
39. PORTFOLIO — COMPONENTRY REQUIREMENTS
============================================================
MANDATORY:
Text Repel:
https://componentry.dev/docs/components/text-repel
Use for section headings.
Particle Typography:
https://componentry.dev/docs/components/cursor-driven-particle-typography
Use for VISHAV MEHRA.
Orbit Card Stack:
https://componentry.dev/docs/components/orbit-card-stack
Use for Projects and Experience where multiple entries exist.
Wheel Carousel:
https://componentry.dev/docs/components/wheel-carousel
Use for primary journey navigation.
Signature:
https://componentry.dev/docs/components/signature
Use at the end of About.
Inspect each actual source/API before integration.
Do not replace them with homemade approximations.
Componentry's current MCP documentation also supports adding the registry to
components.json for AI-assisted installation:
https://componentry.dev/docs/mcp
If useful, use the project's existing Componentry/MCP setup instead of manually
recreating the components.
============================================================
40. PORTFOLIO — LOADING LIBRARY REQUIREMENTS
============================================================
Libraries.dev Orb:
https://libraries.dev/orbs
Use the actual `thinking-orbs` library/prompt.
Libraries.dev documents the Orb library as a standalone React effect library
with reduced-motion/accessibility behavior and an npm package.
Do not recreate it.
Loading must cleanly hand off to the main scene.
No permanent loader loop.
No duplicated expensive renderer if avoidable.
============================================================
41. VISUAL ART DIRECTION
============================================================
The portfolio must look substantially better than the current pale/static
implementation.
The main visual problems to eliminate are:
flat pale background
dominant beige cards
static Explorer
weak walking animation
disconnected sections
no meaningful scrolling choreography
generic navigation
lack of palette
excessive empty UI
GLBs simply placed into a scene without composition
Use:
deep forest base
parchment typography
sage environmental tones
bark/stone materials
amber only as accent
strong foreground/midground/background separation
atmospheric depth
authored composition
controlled contrast
negative space
environmental storytelling
The GLBs are assets, not the finished composition.
Compose them intentionally.
============================================================
42. ENVIRONMENT COMPOSITION QUALITY
============================================================
Every destination should have a visual reason to exist.
Hero:
strongest introduction
layered depth
Explorer
typography
About:
quiet clearing
personal/editorial feeling
Experience:
cabin destination
warm structural presence
Projects:
desk/workshop destination
technology/work feeling without becoming cyberpunk
Education:
quieter reflective area
Skills:
open editorial environment
Achievements:
landmark with visual significance
Resume:
transition/threshold
Contact:
quiet final clearing
Avoid repeating the same environment composition for every section.
============================================================
43. CAMERA CHOREOGRAPHY
============================================================
Camera movement must be authored.
For each waypoint define:
position
target
path/interpolation
easing
optional look behavior
Explorer relation
content anchor relation
Scroll should drive a smooth continuous path.
Avoid:
hard jumps
instant camera teleports
independent section camera systems
excessive camera shake
artificial cinematic wobble
Navigation selection may intentionally accelerate or scrub the journey to a
destination, but should still preserve the world-travel illusion.
============================================================
44. SCROLL BEHAVIOR
============================================================
Normal page scroll is the main portfolio input.
Do not require a game controller.
Scroll must:
move journey progress
move camera
choreograph Explorer
reveal landmarks
control content visibility
synchronize environmental motion
support reverse scrolling
Scrolling backward must work.
Explorer must transition appropriately when reversing:
Walk -> Idle/turn/reverse movement as required by the authored journey.
Do not permanently lock the user into one direction.
============================================================
45. MOBILE PORTFOLIO
============================================================
Required viewports:
320 × 568
390 × 844
393 × 852
430 × 932
Mobile is not a squeezed desktop.
Adapt:
camera
framing
Explorer scale
typography
world spacing
waypoint distances
card sizing
particle density
navigation
atmosphere
Mobile:
no cursor tracking
touch scrolling drives journey
subtle Explorer idle/auto look behavior
right-side navigation remains usable
day/night remains accessible
No horizontal overflow.
============================================================
46. DESKTOP PORTFOLIO
============================================================
Required viewports:
1366 × 768
1440 × 900
1920 × 1080
Verify:
hero depth
mouse head tracking
particle typography
smooth scrolling
Explorer walking
wheel navigation
day/night
readable content
no horizontal overflow
no clipped controls
no console errors
============================================================
47. REDUCED MOTION
============================================================
Respect:
prefers-reduced-motion: reduce
When enabled:
minimize camera movement
reduce/disable particle dispersion
reduce parallax
reduce Explorer movement
reduce decorative animation
keep content readable
keep navigation functional
Do not remove essential content.
============================================================
48. PERFORMANCE
============================================================
Preserve:
single GLB loading
SkeletonUtils cloning where required
offscreen rendering pause where appropriate
reduced-motion support
no pointer lock
no duplicate listeners
no duplicate asset fetching
no hidden animation loops
Use:
instancing where appropriate
frustum culling
sensible draw calls
restrained post-processing
optimized DOM
optimized particle counts
Do not add effects merely because they are technically possible.
The experience must remain responsive.
============================================================
49. CURRENT HERO IMPLEMENTATION — DO NOT REGRESS
============================================================
The existing HeroScene has important technical fixes.
Preserve where applicable:
robust head tracking
reduced-motion behavior
offscreen pause
SkeletonUtils cloning
captured rest-pose quaternion handling
single GLB loading
The visual composition may be substantially rebuilt around that technical base.
Do not throw away a working implementation merely to recreate the same behavior.
============================================================
50. NO GENERIC PORTFOLIO CARDS
============================================================
Do not build this:
+-----------------------------+
| PERSONAL PROJECTS           |
|                             |
| project title               |
| description                 |
| technologies                |
|                             |
| [VIEW PROJECT]              |
+-----------------------------+
repeated down the page.
Cards may exist only where they serve the editorial journey, especially inside
Orbit Card Stack.
The environment must remain visible.
============================================================
51. NO GENERIC WEBSITE SHELL
============================================================
Do not use:
large persistent left sidebar
generic navbar
giant hero banner
standard centered portfolio sections
generic SaaS cards
default gradient backgrounds
template-like footer
excessive pill buttons
The website should feel authored specifically for Vishav.
============================================================
52. NO JAPANESE VISUAL IDENTITY
============================================================
A continuous-scene reference may inspire:
choreography
spatial storytelling
transitions
scroll behavior
composition
But do not reproduce Japanese visual identity.
The final identity remains:
Explorer
forest
calm adventure
slightly nostalgic
editorial
faceted/painterly game world
restrained palette
============================================================
53. ACCESSIBILITY
============================================================
Interactive controls must remain real semantic controls.
Ensure:
keyboard focus
visible focus state
readable text
meaningful labels
accessible navigation
reduced motion behavior
no motion-only information
Decorative WebGL should not be the only source of important information.
============================================================
54. ROUTING / ENTRY ARCHITECTURE
============================================================
The game remains the entry world.
The final game exit transitions to:
/portfolio
The portfolio should not return to the game loading screen during normal
navigation.
The portfolio itself may contain an authored journey reset/replay mechanism only
if it is genuinely useful and does not create a confusing loop.
============================================================
55. FILE / CODE ORGANIZATION
============================================================
Keep content/data separate.
Expected conceptual structure:
src/
app/
page.tsx
portfolio/
page.tsx
data/
profile.ts
experience.ts
projects.ts
education.ts
achievements.ts
skills.ts
portfolio.ts
types/
portfolio.ts
game/
...
input/
...
ui/
controls/
portfolio/
HeroScene.tsx
JourneyController.tsx
PortfolioWorld.tsx
PortfolioNavigation.tsx
PortfolioAnchors.tsx
DayNightControl.tsx
...
Exact filenames may differ if the existing architecture has better equivalents.
Do not create duplicate parallel systems.
============================================================
56. IMPLEMENTATION ORDER
============================================================
Claude Code should implement in this order:
PHASE 1
Inspect current architecture and preserve working game.
PHASE 2
Integrate Libraries.dev Thinking Orbs loading experience.
PHASE 3
Rebuild the hero threshold:
depth
palette
Explorer
head tracking
particle typography
PHASE 4
Build the continuous 3D portfolio world.
PHASE 5
Implement JourneyController and authored waypoints.
PHASE 6
Implement Explorer Idle -> Walk choreography.
PHASE 7
Integrate About / Experience / Projects / Education / Skills / Achievements /
Resume / Contact into world anchors.
PHASE 8
Integrate actual Componentry components.
PHASE 9
Implement Wheel Carousel navigation.
PHASE 10
Implement day/night.
PHASE 11
Responsive/mobile adaptation.
PHASE 12
Performance and reduced-motion pass.
PHASE 13
Browser QA.
Do not stop after Phase 3.
============================================================
57. BROWSER QA
============================================================
Test actual browser behavior.
Desktop:
1366 × 768
1440 × 900
1920 × 1080
Mobile:
320 × 568
390 × 844
393 × 852
430 × 932
Check:
no console errors
no page errors
no horizontal overflow
loading completes
orbs appear and clean up
hero loads
Explorer faces visitor
head follows mouse
pitch works
particle typography reacts
depth/parallax works
scroll begins journey
name disperses at journey start
Explorer turns
Explorer walks
feet remain grounded
camera travels continuously
About appears at correct waypoint
Experience cabin appears correctly
Projects desk appears correctly
Education appears correctly
Skills appears correctly
Achievements appears correctly
Resume appears correctly
Contact appears correctly
wheel navigation selects destinations
destination navigation moves through the world
day/night works
reverse scrolling works
mobile touch scrolling works
reduced motion works
no pointer lock exists
no hidden cursor exists
============================================================
58. SPECIFIC REGRESSION CHECKS
============================================================
Do not regress existing game behavior:
WASD movement
sprint
jump
no double jump
camera-relative movement
free mouse camera
Ctrl camera pause
touch joystick
mobile camera drag
bridge traversal
final direct X exit
final direct mobile EXIT
no E exit
content E interactions remain content-only
Portfolio regression checks:
head tracking
reduced motion
offscreen pause
GLB single-load behavior
rest-pose handling
no pointer lock
============================================================
59. QUALITY BAR
============================================================
The final result must NOT look like:
a 3D model sitting behind HTML
a normal portfolio with a 3D background
a beige template
a generic AI-generated landscape
a collection of animated cards
a static hero followed by static sections
a game HUD pasted onto a website
The final result SHOULD look like:
a complete personal world
a cinematic editorial journey
a real 3D environment
Explorer physically travelling through the portfolio
content anchored to places
typography participating in the environment
scroll controlling the camera/world
navigation selecting destinations
day/night changing the atmosphere
a cohesive visual identity from first load to final contact
============================================================
60. DEFINITION OF DONE
============================================================
The task is NOT complete if only the hero is improved.
It is complete only when:
Loading screen uses the real Libraries.dev Thinking Orbs.
Landing has authored depth and atmosphere.
Explorer faces the visitor.
Explorer follows desktop mouse with head movement.
VISHAV MEHRA uses the real Componentry Particle Typography.
The palette is clearly visible and cohesive.
The environment no longer reads as pale/beige dominant.
Scroll controls one continuous 3D world.
The name disperses as the journey begins.
Explorer turns and uses the real Walk animation.
Explorer moves through authored waypoints.
About is integrated into the world.
Experience is integrated around the cabin.
Projects are integrated around the desk.
Education is integrated into the journey.
Skills are integrated into the journey.
Achievements are integrated into the journey.
Resume is integrated into the journey.
Contact is the final world destination.
Text Repel is actually used for relevant headings.
Orbit Card Stack is actually used where project/experience browsing exists.
Wheel Carousel is actually used for navigation.
Signature is actually used at About end when real signature data exists.
Day/night uses the game's visual language.
Mobile works without cursor assumptions.
Reduced motion works.
No pointer lock exists.
No horizontal overflow exists.
No fabricated personal information exists.
Game behavior has not regressed.
Typecheck passes.
Production build passes.
Browser QA passes at all required viewports.
Console/runtime errors are zero.
The final experience feels like one authored universe rather than a set of
unrelated sections.
============================================================
61. FINAL CLAUDE CODE INSTRUCTION
============================================================
Do not merely tell me what should be changed.
Actually change the repository.
Before coding:
inspect the current implementation
identify reusable systems
identify conflicts with this specification
inspect the real Componentry APIs
inspect the real Libraries.dev Orb prompt/API
Then implement the complete rebuild.
Do not stop at inspection.
Do not stop at a plan.
Do not stop at the hero.
Do not fabricate data.
Do not replace authored assets.
Do not modify finalized assets.
Do not introduce pointer lock.
After implementation:
run typecheck
run production build
run browser QA
test desktop
test mobile
test reduced motion
test day/night
test scroll forward and backward
test wheel navigation
test loading cleanup
test Explorer head tracking
test Explorer walking
Finally report:
files changed
systems implemented
Componentry components installed/used
Libraries.dev Orb integration
game functionality preserved
tests run
viewport QA results
any genuine remaining limitation
Do not report an item as complete unless it was actually verified.
MASTER PORTFOLIO REBUILD
LOADING → ENTRY → HERO → CONTINUOUS WORLD → CONTENT JOURNEY
You are rebuilding the entire portfolio experience.
This is NOT a small visual polish.
This is NOT a hero-only redesign.
This is NOT an inspection task.
The current portfolio needs to be substantially rebuilt so that the loading screen, entry experience, hero, navigation, scroll journey, environment, Explorer, typography, sections, and interactions all feel like one authored experience.
The existing GAME is the visual and technical foundation.
The portfolio must feel like the game has evolved into a cinematic personal website.
Do not create a generic portfolio template.
Do not create a collection of independent website sections.
Do not create a stack of beige cards.
Build one continuous, art-directed world.
============================================================
0. ABSOLUTE RULES
============================================================
Actually IMPLEMENT the redesign.
Do NOT merely inspect the existing implementation.
Do NOT stop after modifying HeroScene.
Do NOT redesign only the hero.
Do NOT replace the experience with a normal HTML portfolio.
Do NOT create a collection of disconnected section cards.
Do NOT invent personal information.
Do NOT populate empty portfolio data with fabricated projects, companies, dates, education, achievements, skills, links, etc.
Preserve existing working game functionality.
Do not modify approved GLB assets.
Do not replace authored assets with procedural approximations.
Use the existing game assets and visual language.
Use the actual Componentry components requested below.
Use the actual Libraries.dev orb implementation requested below.
Inspect the source/API of those libraries before integrating them.
Do not approximate their effects with generic CSS.
The final result must be tested in an actual browser.
Typecheck and production build must pass.
Fix runtime errors before finishing.
Do not claim something works without actually verifying it.
============================================================
1. DESIGN TARGET
============================================================
The current portfolio looks like a generic portfolio webpage.
The new experience should communicate:
> "I am entering Vishav's world."
Then:
> "I am travelling through Vishav's work."
The overall experience should feel:
premium
art-directed
calm
adventurous
slightly nostalgic
mysterious
tactile
editorial
game-like without becoming a game UI
visually connected to the existing Explorer world
Avoid:
generic portfolio templates
SaaS aesthetics
giant beige cards
excessive glassmorphism
purple gradients
cyberpunk
neon UI
photorealism
excessive cinematic effects
Japanese visual identity
generic AI-generated landscapes
excessive floating labels
excessive HUD elements
huge persistent navigation text
unrelated animation gimmicks
The game and portfolio must feel like the SAME UNIVERSE.
But they are different interaction experiences:
GAME:
keyboard/touch gameplay
movement
jump
interaction
exit
PORTFOLIO:
scroll-driven exploration
camera choreography
Explorer as narrator/protagonist
world landmarks
editorial content
interactive typography
navigation through the journey
Do NOT merge the two input systems into one giant controller.
============================================================
2. EXISTING GAME IS SOURCE OF VISUAL TRUTH
============================================================
Preserve the approved game art direction.
Palette:
--forest-950: #111814
--forest-900: #151D18
--forest-800: #1B241D
--parchment-100: #F2EBDD
--parchment-200: #E8DFC9
--parchment-300: #D4C8AF
--sage-500: #8F9B82
--sage-700: #687462
--bark-500: #5A4938
--stone-500: #77776B
--amber-500: #F0932B
--ember-500: #D97A32
Important:
Amber is an accent.
Use amber primarily for:
Explorer visor
light sources
interaction states
subtle emissive elements
active navigation state
tiny environmental highlights
Do NOT make the entire website orange.
The current pale beige background must NOT remain the dominant visual treatment.
============================================================
3. APPROVED ASSETS
============================================================
Use the existing authored assets.
Do NOT recreate or replace them.
Explorer:
art/blender/explorer-unit-7b/explorer-unit-7b.blend
public/assets/3d/explorer-unit-7b.glb
Hero trees:
public/assets/3d/hero-tree-a.glb
public/assets/3d/hero-tree-b.glb
Birch:
public/assets/3d/birch.glb
Conifers:
public/assets/3d/tree-conifer-a.glb
public/assets/3d/tree-conifer-b.glb
public/assets/3d/tree-conifer-c.glb
Distant trees:
public/assets/3d/tree-distant-a.glb
public/assets/3d/tree-distant-b.glb
Bushes:
public/assets/3d/bush-a.glb
public/assets/3d/bush-b.glb
public/assets/3d/bush-c.glb
public/assets/3d/bush-d.glb
Rocks:
public/assets/3d/rock-a.glb
public/assets/3d/rock-b.glb
public/assets/3d/rock-c.glb
Bridge:
public/assets/3d/bridge.glb
River:
public/assets/3d/river.glb
Grass:
public/assets/3d/grass-clump-a.glb
public/assets/3d/grass-clump-b.glb
public/assets/3d/grass-clump-c.glb
public/assets/3d/grass-clump-d.glb
Flowers:
public/assets/3d/flower-lupine.glb
public/assets/3d/flower-daisy.glb
public/assets/3d/flower-clover.glb
Experience cabin:
public/assets/3d/experience-cabin.glb
Projects desk:
public/assets/3d/projects-desk.glb
Portfolio platform:
public/assets/3d/portfolio-platform.glb
DO NOT modify the Experience Cabin asset.
DO NOT alter the GLBs to make the portfolio work.
Compose them through transforms, lighting, camera choreography, and environment layout.
============================================================
4. PORTFOLIO ARCHITECTURE
============================================================
The portfolio must be ONE continuous scroll-driven 3D journey.
There should be:
one primary WebGL scene
one primary portfolio camera
one journey controller
one scroll progress model
authored world waypoints
DOM content synchronized with world positions
Explorer synchronized with the journey
section landmarks positioned in the same world
Do NOT implement this as:
Section 1
↓
Section 2
↓
Section 3
↓
Section 4
with unrelated backgrounds.
Instead:
              ONE WORLD

Hero
↓
About clearing
↓
Experience cabin
↓
Projects desk
↓
Education area
↓
Achievements landmark
↓
Resume
↓
Contact clearing
The camera physically travels through this world.
Scrolling should feel like moving through a long cinematic environment.
============================================================
5. LOADING SCREEN
============================================================
Use the Libraries.dev Orb system:
https://libraries.dev/orbs
Inspect the actual library/API/source before implementation.
Do NOT create a fake CSS replacement.
The orb system is the loading experience.
The loading screen should NOT be:
generic spinner
progress bar
circular loader
plain text on beige background
Instead:
The visitor initially sees a dark atmospheric version of the portfolio world.
The orb system appears as a subtle energy phenomenon.
Suggested sequence:
LOADING
↓
orbs appear
↓
environment begins revealing itself
↓
Explorer becomes visible
↓
particle typography appears
↓
hero reaches stable state
↓
ENTER WORLD
The orb effect should feel like it exists inside the environment.
It should NOT look like a UI widget sitting on top of the page.
Use:
restrained amber
muted cream
sage
subtle glow
Do not overdo particles.
When loading completes:
stop unnecessary loader animation
remove listeners
release resources
do not keep a second expensive render loop alive
============================================================
6. LANDING / THRESHOLD EXPERIENCE
============================================================
The landing screen is the THRESHOLD into the portfolio.
It is not a normal portfolio hero.
The visitor should feel:
"I am about to enter a world."
Use a small authored environment.
Composition:
foreground:
foliage
branches
grass
rocks
midground:
Explorer
platform
small environmental props
background:
trees
atmospheric haze
distant silhouettes
The scene must have obvious depth.
Do not make the environment flat.
============================================================
7. EXPLORER — INITIAL STATE
============================================================
Explorer Unit 7-B is the protagonist.
At the initial landing state:
Explorer faces the visitor
Explorer is grounded
Explorer uses the existing authored model
subtle Idle animation
visor visible
scale feels intentional
The Explorer should NOT feel like a decorative 3D model placed behind HTML.
The environment should be composed around Explorer.
============================================================
8. EXPLORER HEAD TRACKING
============================================================
Desktop:
Explorer's head should follow the mouse.
Mouse left:
head looks left.
Mouse right:
head looks right.
Mouse up:
head looks up.
Mouse down:
head looks down.
Requirements:
smooth interpolation
symmetric response
anatomical limits
no entire-body rotation
no quaternion accumulation
no jitter
no drift
no snapping
Use the already-working head tracking architecture where possible.
Preserve reduced-motion support.
Mobile:
No cursor tracking.
Use subtle idle head motion instead.
============================================================
9. DEPTH / PARALLAX
============================================================
The landing and hero should have a multi-plane depth effect inspired by modern device depth interfaces.
Do NOT copy Apple's visual design or branding.
Create actual spatial layers:
foreground
↓
Explorer
↓
typography
↓
midground environment
↓
background environment
↓
atmosphere
Cursor movement creates subtle differential parallax.
Foreground:
strongest response.
Midground:
medium response.
Background:
very subtle response.
Explorer:
very subtle response.
Do NOT rotate the entire scene dramatically.
No gimmicky 3D tilt.
The result should feel like the visitor is looking into a real space.
============================================================
10. NAME TYPOGRAPHY
============================================================
Use the actual Componentry component:
https://componentry.dev/docs/components/cursor-driven-particle-typography
Inspect its actual implementation/API.
Use it for:
VISHAV MEHRA
Do NOT recreate it using generic CSS particles.
The typography should:
be large
be readable
feel premium
react to cursor
disperse subtly
reform naturally
integrate with the environment
The name should feel physically present in the scene.
Not like a giant HTML banner.
============================================================
11. DO NOT USE THIS PHRASE
============================================================
Do NOT use:
"INTERACTIVE 3D PORTFOLIO"
as visible portfolio branding.
The user explicitly does not want that phrase in the portfolio.
The interaction itself should communicate the concept.
============================================================
12. ENTER WORLD
============================================================
Replace the current generic:
PRESS X TO ENTER
visual treatment.
The interaction may remain X on desktop if that is already part of the architecture.
Mobile should retain its appropriate Enter interaction.
But visually:
Do NOT use a large generic rectangular HTML button.
Use the game's interaction language.
Example direction:
small amber interaction marker
+
subtle text
+
minimal key hint
The interaction should feel like something in the world.
It must remain understandable.
============================================================
13. ENTRY TRANSITION
============================================================
When the visitor enters:
DO NOT simply route to a static page.
Create a short cinematic transition:
landing
↓
particle typography reacts
↓
Explorer begins turning
↓
environment shifts
↓
camera moves
↓
continuous portfolio journey begins
The transition should feel like crossing a threshold.
Keep it short.
No long cinematic.
No loading screen between landing and portfolio.
============================================================
14. HERO AFTER ENTRY
============================================================
The first portfolio state continues from the landing scene.
Do NOT abruptly replace the environment.
The visitor should feel:
"I entered the same place I was looking at."
Initial hero:
Explorer
forest
atmospheric depth
particle typography
authored environment
day/night lighting
subtle motion
Then scroll begins the journey.
============================================================
15. SCROLL JOURNEY
============================================================
The portfolio is controlled primarily by scroll.
Build a central JourneyController.
Conceptually:
scroll progress
↓
journey progress
↓
camera position
camera look target
Explorer position
Explorer animation
environment choreography
DOM anchors
section visibility
lighting changes
↓
render
Do NOT make every section independently scroll itself.
One central journey state must control the experience.
Use authored waypoints.
Example:
WAYPOINT 0
Hero
WAYPOINT 1
About clearing
WAYPOINT 2
Experience cabin
WAYPOINT 3
Projects desk
WAYPOINT 4
Education area
WAYPOINT 5
Achievements landmark
WAYPOINT 6
Resume
WAYPOINT 7
Contact clearing
Use smooth interpolation.
No abrupt snapping unless navigation intentionally requests a destination.
============================================================
16. HERO → SCROLL TRANSITION
============================================================
This is extremely important.
At the beginning:
Explorer faces the visitor.
VISHAV MEHRA is visible.
When scrolling starts:
typography begins to disperse
camera starts moving
Explorer reacts
Explorer turns
Explorer starts walking
camera begins following
world opens into the journey
The Explorer must actually use the authored Walk animation.
Do not fake walking by simply translating the model while standing.
The transition should make the user understand:
"The journey has begun."
============================================================
17. EXPLORER WALKING
============================================================
Use the existing Explorer Walk animation.
Requirements:
feet remain grounded
correct animation playback
no sliding
no floating
no sudden direction changes
smooth transition Idle → Walk
smooth transition Walk → Idle
movement speed synchronized with animation
Explorer should be a character travelling through the portfolio.
============================================================
18. ABOUT SECTION
============================================================
The About section is a physical location in the world.
Example:
forest clearing / small authored area.
The camera arrives naturally.
Do NOT display a giant opaque card.
Use typography integrated into the composition.
Use:
https://componentry.dev/docs/components/text-repel
for:
ABOUT
and/or
relevant About heading.
Inspect and use the actual component.
Text should react to cursor.
The surrounding environment should remain visible.
Use negative space.
The world is still present behind/around the content.
============================================================
19. ABOUT SIGNATURE
============================================================
At the end of About use:
https://componentry.dev/docs/components/signature
Inspect the actual component.
Use it for the user's signature treatment.
The signature should appear as a subtle authored detail.
Do NOT turn it into a huge decorative logo.
If an actual signature asset/data is not available, do not fabricate one.
Leave a proper data-driven placeholder.
============================================================
20. EXPERIENCE
============================================================
Experience should physically exist near the Experience Cabin.
Use:
public/assets/3d/experience-cabin.glb
Do NOT modify the cabin.
The camera should approach it naturally.
Experience content should appear as part of the environment.
Use:
https://componentry.dev/docs/components/text-repel
for:
PROFESSIONAL EXPERIENCE
The content presentation should feel editorial.
Do NOT use giant beige rectangular cards.
If experience data is empty:
show only the authored heading/environment structure.
Do not fabricate jobs.
============================================================
21. EXPERIENCE CAROUSEL
============================================================
For multiple experience entries, use:
https://componentry.dev/docs/components/orbit-card-stack
Inspect the actual component/API.
Use it only where appropriate.
The cards must feel like physical editorial objects within the scene.
Do NOT create generic dashboard cards.
Do NOT recolor the component excessively.
Maintain the portfolio palette.
If no experience data exists, do not create fake cards.
============================================================
22. PROJECTS
============================================================
Projects should physically exist around:
public/assets/3d/projects-desk.glb
The desk should feel like an actual destination.
Use:
https://componentry.dev/docs/components/text-repel
for:
PERSONAL PROJECTS
Project content should appear around the desk/environment.
Use:
https://componentry.dev/docs/components/orbit-card-stack
for project browsing where appropriate.
Cards should:
preserve depth
feel tactile
use subtle shadows
remain readable
integrate with environment
Do NOT turn the scene into a card grid.
If project data is empty:
show the structural destination only.
Never invent projects.
============================================================
23. EDUCATION
============================================================
Education should have its own authored location in the journey.
It should NOT look like another card section.
Use environment, typography, and spatial composition.
Heading:
EDUCATION
Use Text Repel where appropriate.
Education entries must come from:
src/data/education.ts
If empty:
do not fabricate data.
============================================================
24. ACHIEVEMENTS
============================================================
Achievements should be another world landmark.
Use a meaningful physical/environmental composition.
Heading:
ACHIEVEMENTS
Use Text Repel where appropriate.
Achievements should be data-driven.
Do not fabricate achievements.
============================================================
25. RESUME
============================================================
Resume should be treated as a transition point in the journey.
It should feel like reaching a destination rather than another webpage section.
Keep it visually minimal.
Provide a clear Resume action if an actual resume asset/link exists.
Do not fabricate a file.
============================================================
26. CONTACT
============================================================
The final destination should feel like a clearing / quiet ending.
Use:
environment
atmospheric lighting
negative space
Explorer
subtle world animation
Contact should feel like the end of the journey.
Not:
CONTACT
[giant form]
[giant card]
Instead create a calm final composition.
Only display actual contact information from the data source.
Do not invent:
email
phone
LinkedIn
GitHub
social accounts
============================================================
27. WHEEL NAVIGATION
============================================================
Use:
https://componentry.dev/docs/components/wheel-carousel
Inspect the actual implementation/API.
The navigation should be represented by a subtle three-line control on the RIGHT side.
Do NOT use the existing permanent left-side list:
START
ABOUT
EXPERIENCE
PROJECTS
EDUCATION
SKILLS
ACHIEVEMENTS
RÉSUMÉ
CONTACT
Remove that visual treatment.
The right-side control opens the wheel navigation.
Wheel destinations:
About
Experience
Projects
Education
Skills
Achievements
Resume
Contact
Clicking a destination should move the central journey controller to that world waypoint.
This must NOT use simple:
scrollIntoView()
as the primary mechanism.
The camera should travel through the authored world.
The navigation is effectively selecting a destination in the journey.
============================================================
28. SKILLS
============================================================
Skills should not become a generic grid of pills.
Use the world and typography.
Skills can be presented as an editorial moment in the journey.
Use actual data from:
src/data/skills.ts
If empty:
do not invent skills.
============================================================
29. DAY / NIGHT
============================================================
Use the same day/night visual system as the game.
Do NOT implement a generic website light/dark toggle.
Day:
warm natural light
forest tones
soft atmosphere
parchment accents
Night:
deeper forest
stronger silhouettes
cool ambient lighting
amber visor
amber world lights
subtle atmospheric contrast
The transition should affect the world:
ambient lighting
directional lighting
sky/background
fog
emissive accents
environment appearance
The toggle should be subtle.
Place it in the portfolio HUD without overwhelming the scene.
============================================================
30. HTML / DOM CONTENT
============================================================
DOM is allowed.
But DOM must be synchronized with the 3D world.
Use DOM for:
readable long-form text
project details
experience descriptions
education details
accessibility
navigation
controls
Use WebGL for:
world
Explorer
camera
environmental landmarks
atmosphere
physical transitions
The DOM should feel attached to the world.
Do not put huge opaque cream rectangles over the entire viewport.
Use:
transparent backgrounds
subtle surfaces
typography
shadows
restrained borders
world-aware positioning
============================================================
31. DATA-DRIVEN ARCHITECTURE
============================================================
Keep portfolio data separate from scene code.
Use existing files:
src/data/profile.ts
src/data/experience.ts
src/data/projects.ts
src/data/education.ts
src/data/achievements.ts
src/data/skills.ts
src/data/portfolio.ts
src/types/portfolio.ts
Do NOT hardcode personal content inside:
HeroScene
JourneyController
navigation
section components
3D environment components
The world should be able to support new content by changing data files.
Do not invent missing data.
Current data intentionally may be blank except for the user's name.
Build the architecture even if sections have no content yet.
============================================================
32. COMPONENTRY INTEGRATION
============================================================
These are required references.
TEXT REPEL:
https://componentry.dev/docs/components/text-repel
Use for section headings such as:
ABOUT
PROFESSIONAL EXPERIENCE
PERSONAL PROJECTS
EDUCATION
ACHIEVEMENTS
CURSOR DRIVEN PARTICLE TYPOGRAPHY:
https://componentry.dev/docs/components/cursor-driven-particle-typography
Use for:
VISHAV MEHRA
ORBIT CARD STACK:
https://componentry.dev/docs/components/orbit-card-stack
Use for:
Projects
Experience
WHEEL CAROUSEL:
https://componentry.dev/docs/components/wheel-carousel
Use for:
main portfolio navigation
SIGNATURE:
https://componentry.dev/docs/components/signature
Use at:
end of About
Do not replace these with homemade approximations.
Inspect their actual source/API.
If a component requires a specific dependency or setup, integrate it correctly into the existing project.
============================================================
33. LOADING ORBS
============================================================
Libraries.dev:
https://libraries.dev/orbs
Use the actual orb implementation.
The loading system should be architecturally separate from the main portfolio scene but visually transition into it.
Requirements:
no duplicate WebGL renderer if avoidable
no permanent loader loop
cleanup after loading
no memory leaks
no listener leaks
no layout shift
no blank flash
============================================================
34. PERFORMANCE
============================================================
Maintain the existing performance improvements.
Preserve:
reduced motion
offscreen rendering pause where appropriate
single GLB loading
SkeletonUtils cloning where required
no duplicate asset fetching
no pointer lock
no unnecessary event listeners
no hidden expensive animation loops
Use:
instancing where appropriate
frustum culling
low-poly authored assets
sensible draw-call count
restrained post-processing
optimized DOM
Do not sacrifice the continuous-world feeling for unnecessary effects.
============================================================
35. ACCESSIBILITY / REDUCED MOTION
============================================================
Respect:
prefers-reduced-motion
Reduced motion should:
minimize camera movement
disable unnecessary particle dispersion
reduce Explorer animation
reduce parallax
keep content usable
keep navigation functional
Do not completely remove the website experience.
============================================================
36. MOBILE
============================================================
The portfolio must work on:
320 × 568
390 × 844
393 × 852
430 × 932
Mobile should not simply be desktop squeezed into a small viewport.
Adapt:
camera framing
Explorer scale
world composition
typography
navigation
cards
journey distance
particle count
atmosphere
Mobile:
no cursor interaction
subtle idle Explorer motion
touch scrolling drives journey
right-side navigation remains usable
day/night control remains accessible
Do not introduce horizontal overflow.
============================================================
37. DESKTOP
============================================================
Verify:
1366 × 768
1440 × 900
1920 × 1080
Desktop requirements:
full environment
cursor head tracking
depth/parallax
particle typography
continuous journey
wheel navigation
day/night
readable DOM content
============================================================
38. RESPONSIVE COMPOSITION
============================================================
The camera must adapt to aspect ratio.
Do not simply use:
camera.position = fixed
for every viewport.
Use responsive composition.
Maintain:
Explorer visibility
landmark readability
typography readability
visual hierarchy
environmental depth
============================================================
39. CURRENT HERO QUALITY REQUIREMENTS
============================================================
The existing HeroScene already has important improvements.
Preserve:
head tracking
reduced motion behavior
offscreen pause
proper skeleton cloning
rest-pose quaternion handling
GLB loading behavior
Do not regress them.
However, the existing visual composition is not sufficient.
Use the same robust implementation as a foundation while completely changing the surrounding art direction.
============================================================
40. NO GENERIC CARDS
============================================================
This is a major requirement.
Do NOT create:
```text
┌─────────────────────────────┐
│ PERSONAL PROJECTS           │
│                             │
│ project title               │
│ description                 │
│ technology                  │
│                             │
│ [VIEW PROJECT]              │
└─────────────────────────────┘

============================================================
# 62. CARD / CONTENT PRESENTATION GUARDRAILS
============================================================

Orbit Card Stack is an interaction primitive, not a license to turn the page
into a card grid.

When cards are used:

- keep them sparse
- preserve environmental visibility
- maintain the forest palette
- use typography hierarchy
- avoid excessive borders
- avoid oversized shadows
- avoid glassmorphism
- avoid neon
- avoid dashboard layouts
- avoid automatic card animation when it does not communicate anything

The 3D world remains the primary composition.

============================================================
# 63. TRANSITIONS BETWEEN DESTINATIONS
============================================================

Every transition must have a beginning, middle, and destination state.

For example:

About -> Experience:

- camera leaves About clearing
- Explorer resumes movement
- cabin becomes visible
- camera settles
- Experience heading/content becomes readable

Experience -> Projects:

- Explorer/camera continues along the authored path
- desk becomes visible before content appears
- content resolves as the camera reaches its anchor

Do not pop sections into existence at arbitrary screen coordinates.

Content should be staged by journey progress.

============================================================
# 64. WORLD ANCHOR SYSTEM
============================================================

Create a reusable world-anchor model.

Each content anchor should define:

- world position
- orientation
- section id
- enter progress
- focus progress
- exit progress
- preferred camera offset
- responsive offset
- DOM placement rules

DOM projection must be calculated from the same world anchor used by the 3D
scene.

This prevents the content from feeling detached from the environment.

============================================================
# 65. NAVIGATION / SCROLL SYNCHRONIZATION
============================================================

There must be one source of truth for journey position.

If the user scrolls:

- update journey progress
- update camera
- update Explorer
- update content anchors
- update active navigation

If the user selects Wheel Carousel destination:

- update target journey progress
- smoothly travel the journey toward it
- synchronize actual scroll position where needed
- do not create a second camera state

Do not allow navigation state and scroll state to fight each other.

============================================================
# 66. HERO TYPOGRAPHY / WORLD LAYERING
============================================================

The particle name must be layered intentionally.

Recommended ordering:

1. distant atmosphere
2. distant trees
3. midground trees
4. Explorer
5. particle name
6. foreground foliage
7. minimal interaction/navigation

Do not allow the name to cover Explorer's face.

Do not allow foreground objects to randomly occlude the entire name.

The typography should feel embedded in depth rather than simply positioned
over a canvas.

============================================================
# 67. HERO INITIAL CAMERA
============================================================

The first stable hero frame must clearly show:

- Explorer
- enough environment to establish place
- VISHAV MEHRA
- visible depth
- enough negative space for the name
- no dominant beige rectangle
- no oversized UI panel

Explorer's face/visor must be readable.

The camera should be close enough to establish character presence but far enough
to show environmental depth.

============================================================
# 68. POINTER INTERACTION SAFETY
============================================================

Pointer interactions must never break UI controls.

When pointer is over:

- day/night toggle
- navigation control
- Wheel Carousel
- buttons
- links

the Explorer's head tracking may continue only if it does not interfere with
the control.

UI controls must remain clickable.

Do not implement global pointer handlers that swallow UI pointer events.

============================================================
# 69. MOBILE INTERACTION SAFETY
============================================================

On mobile:

- do not attempt to simulate a desktop mouse
- do not require hover to reveal essential information
- do not require cursor tracking
- do not depend on pointer proximity effects for readability
- ensure the Wheel Carousel can be opened and used by touch
- ensure day/night can be toggled by touch
- ensure scrolling remains native and responsive

Componentry hover effects should degrade gracefully on touch.

============================================================
# 70. LOADING / HYDRATION SAFETY
============================================================

The portfolio is a Next.js application.

Avoid:

- accessing window during server render
- accessing document during server render
- WebGL initialization during SSR
- hydration mismatches
- random initial values that differ between server/client
- layout shifts caused by late font/component sizing

Client-only effects must initialize inside the appropriate client lifecycle.

The loader must remain visible until the minimum required portfolio assets are
ready.

Do not show a half-loaded Explorer/world and then suddenly replace it.

============================================================
# 71. ASSET LOADING
============================================================

Do not fetch the same GLB repeatedly.

Where the same asset is used multiple times:

- load once
- clone/reuse safely
- preserve animation behavior
- avoid mutating the shared source scene

For animated Explorer clones:

- use SkeletonUtils where appropriate
- use independent AnimationMixers
- avoid cross-instance animation state

============================================================
# 72. LIGHTING
============================================================

Lighting is one of the main quality levers.

Use a restrained hierarchy:

- ambient/fill
- directional/key
- local amber sources
- subtle environmental contribution

Do not use:

- excessive bloom
- overexposed lights
- neon strips
- unrealistic colored lighting
- huge emissive surfaces

The Explorer visor should read as an intentional light/accent, not a giant
orange glow.

============================================================
# 73. MATERIALS
============================================================

Preserve the authored palette/material language.

Avoid:

- glossy plastic
- high metallic response
- photorealistic roughness variation
- normal-map-heavy rendering
- generic PBR realism

The target is faceted, authored, painterly value language.

The environment should feel cohesive even when individual assets come from
different authored sets.

============================================================
# 74. ATMOSPHERE
============================================================

Atmosphere should provide depth, not hide the world.

Use subtle:

- fog
- background haze
- distant value compression

Do not turn the entire scene into a foggy cinematic effect.

Foreground/midground/background must remain legible.

============================================================
# 75. AUDIO
============================================================

Do not add audio merely to make the site feel cinematic.

If audio is introduced later:

- it must be opt-in
- it must not autoplay unexpectedly
- it must respect reduced-motion/user preferences where applicable
- it must not block loading
- it must have an obvious mute control

For this implementation, audio is not required.

============================================================
# 76. CONTENT EMPTY-STATE BEHAVIOR
============================================================

The repository may contain intentionally empty data files.

Empty content is NOT permission to invent content.

If a section has no entries:

- retain the world destination
- retain the heading if appropriate
- preserve the visual composition
- avoid fake cards
- avoid "coming soon" marketing copy unless explicitly provided
- avoid placeholder companies/projects
- avoid fake links

The result can be visually complete even when content is empty.

============================================================
# 77. PERSONAL DATA SOURCE OF TRUTH
============================================================

When real content is eventually added, it belongs in the data layer.

Examples:

profile.ts
experience.ts
projects.ts
education.ts
achievements.ts
skills.ts

Do not duplicate the same content across multiple components.

Navigation labels and section IDs may be static because they are structural,
but personal details must remain data-driven.

============================================================
# 78. EXISTING PERSONAL CONTENT
============================================================

Use only information already present in the repository/data files or explicitly
provided by the user in the current task.

Do not infer:

- employers
- dates
- project descriptions
- links
- achievements
- contact information
- skill levels

from unrelated code or assumptions.

If the data layer is intentionally blank, leave it blank.

============================================================
# 79. PORTFOLIO ENTRY / EXIT SEMANTICS
============================================================

The game exit is the only required transition into the portfolio.

Portfolio does not need to behave like a second game.

The visitor enters the portfolio and then uses:

- scroll
- touch scroll
- Wheel Carousel
- day/night control
- ordinary links/buttons

Do not reintroduce game movement controls into the portfolio.

============================================================
# 80. TESTING — FUNCTIONAL MATRIX
============================================================

GAME:

[ ] WASD
[ ] sprint
[ ] jump
[ ] no double jump
[ ] camera-relative movement
[ ] free mouse camera
[ ] visible cursor
[ ] no pointer lock
[ ] Ctrl camera pause
[ ] touch joystick
[ ] touch camera
[ ] bridge traversal
[ ] E content interactions
[ ] direct X exit
[ ] direct mobile EXIT

PORTFOLIO:

[ ] loading orbs
[ ] clean loader exit
[ ] hero environment
[ ] Explorer faces visitor
[ ] mouse head tracking
[ ] pitch
[ ] particle typography
[ ] depth/parallax
[ ] scroll journey
[ ] name dispersal
[ ] Explorer turn
[ ] Explorer walk
[ ] About
[ ] Experience
[ ] Projects
[ ] Education
[ ] Skills
[ ] Achievements
[ ] Resume
[ ] Contact
[ ] Text Repel
[ ] Orbit Card Stack
[ ] Wheel Carousel
[ ] Signature
[ ] day/night
[ ] reverse scrolling
[ ] mobile
[ ] reduced motion

============================================================
# 81. TESTING — PERFORMANCE
============================================================

Measure/inspect:

- console errors
- console warnings relevant to implementation
- duplicate GLB requests
- render-loop leaks
- event-listener leaks
- obvious excessive draw calls
- excessive DOM reflow
- large layout shifts
- mobile responsiveness

Do not optimize prematurely by destroying the authored visual composition.

Optimize actual bottlenecks.

============================================================
# 82. TESTING — VISUAL
============================================================

At each required viewport verify:

1. Hero composition
2. Depth
3. Explorer readability
4. Typography
5. Navigation
6. World continuity
7. Section landmarks
8. Lighting
9. Day/night
10. Mobile adaptation

Take screenshots during QA if useful.

Do not rely on a single desktop viewport.

============================================================
# 83. TESTING — REDUCED MOTION
============================================================

Run browser QA with prefers-reduced-motion enabled.

Verify:

- no uncontrolled camera animation
- particle effect is reduced/disabled appropriately
- Explorer animation is reduced appropriately
- content remains visible
- navigation remains functional
- day/night remains functional
- no information depends only on motion

============================================================
# 84. TESTING — OFFSCREEN
============================================================

For expensive WebGL effects that support visibility pausing:

- verify offscreen behavior
- verify rendering resumes when visible
- verify no state corruption occurs

Do not keep hidden canvases rendering indefinitely.

============================================================
# 85. TESTING — NAVIGATION
============================================================

Test every Wheel Carousel destination.

For each:

- select destination
- verify journey target
- verify camera travels
- verify Explorer relation
- verify content arrives at correct waypoint
- verify active navigation state
- verify user can resume scrolling afterward

Then test reverse navigation.

============================================================
# 86. TESTING — DAY/NIGHT
============================================================

Test:

DAY -> NIGHT
NIGHT -> DAY

Verify:

- world lighting
- Explorer visor
- ambient values
- fog/atmosphere
- active control state

The world should change, not merely a CSS class.

============================================================
# 87. TESTING — ENTRY SEQUENCE
============================================================

Verify the complete sequence from a fresh load:

1. loading begins
2. Thinking Orbs render
3. loader resolves
4. hero appears
5. Explorer faces visitor
6. name is present
7. mouse moves Explorer's head
8. visitor starts scrolling
9. name begins dispersing
10. Explorer turns
11. Explorer walks
12. camera enters the world
13. About appears
14. continuous journey continues

No hard cut should make the experience feel like separate websites.

============================================================
# 88. TESTING — NO FABRICATED DATA
============================================================

Inspect rendered sections and data files.

Confirm that empty data does not cause invented content.

The implementation should be visually rich without fake personal information.

============================================================
# 89. DEFINITION OF VISUAL SUCCESS
============================================================

A successful implementation should immediately correct the current visual
complaints:

CURRENT PROBLEM:
"The world looks pale and has no palette."

REQUIRED RESULT:
A clear forest/sage/bark/stone/parchment palette with restrained amber accents.

CURRENT PROBLEM:
"The GLBs are present but the page still looks static."

REQUIRED RESULT:
GLBs become composed environmental landmarks in a moving continuous world.

CURRENT PROBLEM:
"The walk is not good."

REQUIRED RESULT:
Explorer uses the real authored Walk animation with grounded movement and
correct orientation.

CURRENT PROBLEM:
"It is not scrolling."

REQUIRED RESULT:
Scroll physically drives one continuous 3D journey.

CURRENT PROBLEM:
"The hero does not look at my mouse."

REQUIRED RESULT:
Explorer head follows desktop mouse left/right/up/down smoothly.

CURRENT PROBLEM:
"The hero is generic."

REQUIRED RESULT:
Multi-plane depth, particle typography, authored environment, and Explorer
create a distinct threshold.

CURRENT PROBLEM:
"The navigation is generic."

REQUIRED RESULT:
Right-side three-line control + actual Componentry Wheel Carousel.

CURRENT PROBLEM:
"The portfolio feels like separate cards."

REQUIRED RESULT:
World anchors, camera choreography, environmental landmarks, and one journey
controller.

CURRENT PROBLEM:
"There is no day/night."

REQUIRED RESULT:
The same game-native day/night system changes the portfolio world.

============================================================
# 90. FINAL RESPONSE FORMAT FROM CLAUDE CODE
============================================================

After implementation, Claude Code must provide a concise report with:

IMPLEMENTED
- major systems
- changed files
- Componentry components
- Libraries.dev integration
- journey architecture
- day/night

PRESERVED
- game functionality
- approved GLBs
- finalized Experience Cabin
- existing head tracking foundations
- reduced-motion support

VERIFIED
- typecheck
- production build
- browser QA
- desktop viewports
- mobile viewports
- reduced motion
- navigation
- day/night
- entry transition
- Explorer walk

REMAINING
- only genuine blockers or limitations

Do not hide failed tests.
Do not claim unverified success.

============================================================
# END OF MASTER_UPDATE_SPEC.md
============================================================