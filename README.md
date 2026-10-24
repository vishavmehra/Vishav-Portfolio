# Vishav Mehra's portfolio

My personal portfolio. It has two parts that run in the browser: a small 3D
exploration game, and a scroll-driven 3D scene that holds the portfolio itself.

Live site: https://vishav-portfolio-five.vercel.app

## What's inside

### The game (`/`)

A small third-person exploration game. You walk through a valley with paths, a
bridge, a river and trees. There are four places to visit: Projects, Experience,
Education and Achievements. Walk up to one and press E (or the Interact button on
a phone) to open a window with that part of the portfolio. A compass at the top
points to places that are off screen, and a selector on the left switches between
morning, afternoon, evening and night. Hold X (or tap Exit on a phone) to leave
the game and go to the portfolio.

### The portfolio (`/portfolio`)

A WebGL scene of tree roots covered in moss, ferns and small flowers. Scrolling
moves the camera down through it. Each section (About, Experience, Projects,
Education, Skills, Achievements) has a card in the scene at the point where the
camera stops. Click a card to open that section, then swipe or use the arrows to
go through its entries. The Explore menu in the top left jumps straight to any
section.

Both parts work on phones and desktops, down to 320 px wide screens.

## Controls

The game:

| Action        | Desktop                      | Phone                  |
| ------------- | ---------------------------- | ---------------------- |
| Enter         | Click, or press `X`          | Tap                    |
| Move          | `W` `A` `S` `D` or arrow keys | Joystick               |
| Sprint, jump  | `Shift`, `Space`             | Not available          |
| Look around   | Mouse (hold `Ctrl` to pause) | Drag on the right side |
| Interact      | `E`                          | Interact button        |
| Close window  | `Esc` or the × button        | The × button           |
| Leave         | Hold `X`                     | Exit button            |

The portfolio:

| Action             | How                                              |
| ------------------ | ------------------------------------------------ |
| Move through it    | Scroll or swipe                                  |
| Go to a section    | Explore menu, top left                           |
| Open a section     | Click or tap its card                            |
| Next or previous   | Swipe, the arrow buttons, or `←` `→`             |
| Close              | `Esc`, the × button, or tap outside the card     |

## How it works

Each page has one renderer, one scene and one animation loop. Values that change
every frame, like the player's position, the camera and the scroll position, are
kept outside React state, so React only re-renders when the interface changes.

In the portfolio, the HTML cards and the 3D scene line up without a second
renderer. The camera's field of view is set so that one unit in the scene is one
CSS pixel at depth 0, and the cards use the same 1400 px CSS perspective as the
camera.

The scroll position becomes one number between 0 and 1. That number moves the
camera along its path, and CSS uses the same number to fade each card in and out.

If a device can't keep up, the scene lowers its resolution, the amount of moss and
the shader detail, and raises them again when there is room.

In the game, the keyboard and the touch joystick feed the same movement code.

## Built with

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- three.js, with React Three Fiber for the game
- Tailwind CSS 4
- Framer Motion and opentype.js for the animated signature
- Vercel for hosting

## Running it locally

You need Node.js 20.9 or newer and npm.

```bash
git clone https://github.com/vishavmehra/Vishav-Portfolio.git
cd Vishav-Portfolio
npm install
npm run dev
```

Open http://localhost:3000 for the game or http://localhost:3000/portfolio for
the portfolio. No environment variables are needed.

| Command             | What it does                        |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Starts the dev server               |
| `npm run build`     | Builds for production               |
| `npm start`         | Serves the production build         |
| `npm run typecheck` | Checks types with `tsc --noEmit`    |

Stop the dev server before you run `npm run build`. Both use the `.next/` folder,
and if the dev server keeps running during a build, its pages load without CSS.

## Folders

```
src/
  app/              the two pages, the root layout and global styles
  game/             the 3D game: terrain, plants, player, camera, collision, interaction
  input/            keyboard and touch input
  ui/               game interface: loading screen, HUD, touch controls, windows, page transition
  portfolio/
    data/           all portfolio text
    world/          the 3D scene and its styles
    journey/        scroll position, camera path, card positions
    ui/             cards, menu, section carousel, signature
    state/          which section is open
  components/ui/    UI components from other projects
public/
  assets/3d/        3D models used by the game
  resume/           résumé PDF
```

All the text in the portfolio and in the game's windows comes from
`src/portfolio/data/`. To change what it says, edit those files.

## Deploying

It's a normal Next.js app, so any host that runs Next.js works: run
`npm run build`, then `npm start`. The live site is on Vercel and is deployed with
`vercel --prod` from the project folder.

## Credits

- The moss scene in the portfolio is adapted from [ThreeUI](https://threeui.com) by
  Meng To, under the MIT licence. The licence text is at the top of
  `src/portfolio/world/scene.ts`.
- The signature, text repel and wheel menu components come from
  [Componentry](https://componentry.dev). They are in `src/components/ui/`.
- The loading animation uses [thinking-orbs](https://libraries.dev/orbs) by Jakub
  Antalik (MIT).

## Licence

© Vishav Mehra. All rights reserved. This repository has no licence. The
third-party code listed above keeps its own licence.
