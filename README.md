# Vishav Mehra — Portfolio

A personal portfolio built as two connected 3D experiences in the browser: a small
exploration game, and a scroll-driven world that holds the portfolio itself.

**Live:** https://vishav-portfolio-five.vercel.app

---

## What's inside

### The world — `/`

A small third-person exploration game. You walk a stylised valley with paths, a
bridge, a river and trees, towards four destinations: **Projects**, **Experience**,
**Education** and **Achievements**. A compass points to destinations that are out
of view. A time-of-day selector switches between morning, afternoon, evening and
night. Holding **X** (or the **Exit** button on touch screens) leaves the world for
the portfolio.

### The portfolio — `/portfolio`

A WebGL scene of a procedural, moss-covered root system with instanced moss blades,
ferns, flowers and drifting motes. Scrolling moves one camera down it. Each chapter
(About, Experience, Projects, Education, Skills, Achievements) has a card standing
in the scene where the camera arrives. Opening a card shows that section as a
swipeable card carousel, and the **Explore** menu jumps straight to any chapter.

Both work on phones as well as desktops. The game has touch controls, the carousel
supports swiping, and the layouts fit screens down to 320 px wide.

## Controls

**World (`/`)**

| Action        | Desktop                     | Touch                  |
| ------------- | --------------------------- | ---------------------- |
| Enter         | Click, or press `X`         | Tap                    |
| Move          | `W` `A` `S` `D` / arrow keys | Joystick               |
| Sprint / jump | `Shift` / `Space`           | —                      |
| Look around   | Mouse (`Ctrl` pauses it)    | Drag on the right side |
| Interact      | `E`                         | Interact button        |
| Leave world   | Hold `X`                    | Exit button            |

**Portfolio (`/portfolio`)**

| Action                | How                                                  |
| --------------------- | ---------------------------------------------------- |
| Travel                | Scroll or swipe                                      |
| Jump to a chapter     | **Explore** menu, top left                           |
| Open a section        | Click or tap its card                                |
| Move between cards    | Swipe, the arrows, or `←` `→`                        |
| Close                 | `Esc`, the × button, or tap anywhere outside the card |

## How it's built

- **One renderer, one scene and one frame loop per route.** Anything that changes
  every frame (player, camera, scroll progress) stays outside React state, so
  React only re-renders when the interface actually changes.
- **HTML and WebGL share one coordinate system.** The portfolio camera's field of
  view is set so one world unit equals one CSS pixel at depth 0, and the cards use
  the same 1400 px CSS perspective. Plain HTML cards therefore sit inside the 3D
  scene and move with it, with no second renderer.
- **The journey is a single number.** Scroll position becomes a 0 → 1 progress
  value that drives the camera path. Every card's reveal is computed in CSS from
  that same value.
- **Adaptive quality.** A governor watches frame time and lowers render
  resolution, moss density and shader detail when a device falls behind. It raises
  them again when there is headroom.
- **One input path.** Keyboard and touch both feed the same movement logic in the
  game.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack), React 19, TypeScript
- [three.js](https://threejs.org), with [React Three Fiber](https://r3f.docs.pmnd.rs) for the game world
- [Tailwind CSS 4](https://tailwindcss.com)
- [Framer Motion](https://motion.dev) and [opentype.js](https://opentype.js.org) for the animated signature
- Hosted on [Vercel](https://vercel.com)

## Getting started

Requires **Node.js 20.9 or newer** (the minimum for Next.js 16) and npm.

```bash
git clone https://github.com/vishavmehra/Vishav-Portfolio.git
cd Vishav-Portfolio
npm install
npm run dev
```

Then open <http://localhost:3000> for the game or <http://localhost:3000/portfolio>
for the portfolio. No environment variables are needed.

| Script              | What it does                         |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Development server with hot reload   |
| `npm run build`     | Production build                     |
| `npm start`         | Serve the production build           |
| `npm run typecheck` | Type-check the project (`tsc --noEmit`) |

> Stop the dev server before running `npm run build`. Both write to `.next/`, and
> a dev server left running during a build serves pages without their CSS.

## Project structure

```
src/
  app/              routes (/ and /portfolio), root layout, global styles
  game/             the 3D world: terrain, vegetation, player, camera, collision, interaction
  input/            keyboard and touch input
  ui/               game HUD, loading screen, touch controls, world-to-portfolio transition
  portfolio/
    data/           all portfolio content
    world/          the WebGL scene and its stylesheet
    journey/        scroll progress, camera path, card placement
    ui/             cards, navigator, section carousel, signature
    state/          the current selection
  components/ui/    third-party UI components, vendored
public/
  assets/3d/        GLB models loaded by the game
  resume/           résumé PDF
```

### Editing the content

Every piece of text the portfolio shows comes from `src/portfolio/data/`: profile,
experience, projects, education, skills and achievements. Edit those files. The
scene and the interface only read them.

## Deployment

Any Next.js host works: run `npm run build`, then `npm start`. The live site is
deployed to Vercel from the project root with `vercel --prod`.

## Credits

- The portfolio's moss-root scene is adapted from
  [ThreeUI](https://threeui.com) by Meng To (MIT). The full licence is kept in the
  header of `src/portfolio/world/scene.ts`.
- The signature, text-repel and wheel-carousel components come from
  [Componentry](https://componentry.dev) and are vendored in `src/components/ui/`.
- The loading indicator uses [thinking-orbs](https://libraries.dev/orbs) by Jakub
  Antalik (MIT).

## License

© Vishav Mehra. All rights reserved. No licence is granted for this repository.
The third-party code credited above keeps its own licence.
