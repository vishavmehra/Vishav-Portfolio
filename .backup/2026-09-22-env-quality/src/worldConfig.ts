/**
 * Authored world layout.
 *
 * Destination coordinates and path topology were validated in M4A and are not
 * to be redesigned. Everything else here is composition: hand-placed trees and
 * landmarks that frame those destinations.
 */

export type Vec2 = readonly [x: number, z: number]

/**
 * `rotation` is the destination's yaw (Object3D.rotation.y). It lives here, beside
 * the position, so the rendered set and its gameplay colliders cannot drift apart.
 */
export const DESTINATIONS = {
  projects: { position: [-16, -26] as Vec2, rotation: 0.22, contentKey: 'projects' },
  achievements: { position: [18, -34] as Vec2, rotation: 0.1, contentKey: 'achievements' },
  experience: { position: [-8, -58] as Vec2, rotation: -0.14, contentKey: 'experience' },
  education: { position: [14, -66] as Vec2, rotation: -0.32, contentKey: 'education' },
} as const

/**
 * The trailhead marker, beside the start of the path and behind the spawn, so it
 * is the first thing in view when the visitor turns around and never stands
 * between them and the world. It is where the world is left (CLAUDE.md §13 brief).
 */
export const TRAILHEAD = { position: [2.2, 3.1] as Vec2, rotation: -0.55 } as const

export const PATH_FORK: Vec2 = [0, -14]

export const PATHS: readonly Vec2[][] = [
  [
    [0, 2],
    [0, -6],
    [0, -14],
  ],
  [
    [0, -14],
    [-6, -18],
    [-13, -23],
    [-16, -26],
    [-17, -33],
    [-15, -42],
    [-11, -51],
    [-8, -58],
  ],
  [
    [0, -14],
    [7, -19],
    [14, -27],
    [18, -34],
    [19, -43],
    [17, -53],
    [14, -60],
    [14, -66],
  ],
]

export const PATH_WIDTH = 2.15

/**
 * The stream. Crosses the trunk path just north of spawn, so the first thing
 * the player does is walk over the bridge — as in the master reference.
 */
export const STREAM: readonly Vec2[] = [
  [-52, -22],
  [-36, -17],
  [-22, -14],
  [-10, -11.5],
  [0, -11],
  [12, -11.5],
  [26, -13.5],
  [40, -12],
  [52, -7],
]

export const STREAM_WIDTH = 3.4
export const STREAM_DEPTH = 0.85
export const BRIDGE_AT: Vec2 = [0, -11]

/** Boulder cluster breaking the long Experience leg. Validated in M4A. */
export const MID_PATH_LANDMARK = {
  position: [-18.5, -42] as Vec2,
  rocks: [
    { offset: [0, 0] as Vec2, scale: 1.5, variant: 0 },
    { offset: [1.9, 1.0] as Vec2, scale: 0.85, variant: 1 },
    { offset: [-1.3, 1.5] as Vec2, scale: 0.6, variant: 2 },
    { offset: [0.9, -1.6] as Vec2, scale: 0.45, variant: 1 },
  ],
} as const

/**
 * Hand-placed hero trees. Each frames a destination without standing between
 * it and the approaching player. `kind` 0 = broad oak, 1 = tall oak.
 * `glb` renders the placement from the production asset instead of the procedural
 * builder (Hero Tree A: one validation placement so far).
 */
export const HERO_TREES: { x: number; z: number; kind: 0 | 1; scale: number; rotation: number; glb?: true }[] = [
  // Projects — broad canopy north-west of the desk, southern approach clear
  { x: -19.5, z: -29.5, kind: 0, scale: 1.12, rotation: 0.6, glb: true },
  { x: -12.4, z: -30.6, kind: 1, scale: 0.82, rotation: 2.4 },
  // Experience — backs the cabin, never in front of it
  { x: -12.5, z: -62.5, kind: 1, scale: 1.15, rotation: 1.1 },
  { x: -3.0, z: -63.5, kind: 0, scale: 0.9, rotation: 3.9 },
  // Achievements — overhangs from the east only
  { x: 23.0, z: -32.0, kind: 1, scale: 1.05, rotation: 5.1 },
  // Education — broad oak beside the desk, birch stand carries the distance read
  { x: 17.5, z: -69.0, kind: 0, scale: 1.08, rotation: 2.0 },
  // framing trees along the routes
  { x: -26.0, z: -14.0, kind: 0, scale: 0.95, rotation: 1.7 },
  { x: 27.5, z: -12.0, kind: 1, scale: 0.88, rotation: 4.2 },
  { x: -24.0, z: -50.0, kind: 0, scale: 0.86, rotation: 0.3 },
  { x: 30.0, z: -56.0, kind: 1, scale: 0.92, rotation: 2.9 },
]

/**
 * Hand-placed framing around the four destinations.
 *
 * Composition, not decoration. Each destination is approached along a known path,
 * and these entries do three jobs on that approach: a foreground element set to
 * one side of the sightline so the eye has something to read past, grounding at
 * the base of the set so it does not look dropped onto the grass, and a flank that
 * closes the space without crowding it.
 *
 * The approach corridor itself is deliberately empty. Nothing here sits between
 * the path and the destination it leads to, and nothing is closer to a set than
 * its own collider — the rule that keeps a destination readable is negative space,
 * not more objects (spec Part 3).
 *
 * These are appended to the procedural meadow arrays, so they cost no extra draw
 * calls: the same instanced bush and rock variants carry them.
 *
 * Rocks here are boulders and cobbles, never the slab. The slab is a flat-topped
 * outcrop; placed as a foreground element on an approach, the gameplay camera sees
 * only its top face and it reads as a stone plinth rather than as a rock.
 */
export type FramingPlacement = { x: number; z: number; scale: number; rotation: number; variant: number }

export const DESTINATION_FRAMING: { bushes: FramingPlacement[]; rocks: FramingPlacement[] } = {
  bushes: [
    // PROJECTS — approached from the south-east along the path through (-13, -23).
    // A thicket left of the sightline; the corridor to the desk stays open.
    { x: -10.9, z: -28.4, scale: 1.35, rotation: 0.7, variant: 0 },
    { x: -9.8, z: -29.6, scale: 1.0, rotation: 2.4, variant: 3 },
    { x: -19.8, z: -22.6, scale: 1.15, rotation: 4.1, variant: 2 },

    // EXPERIENCE — approached from the north. The cabin's south opening and the
    // whole northern sightline are left clear; these close the sides only.
    { x: -13.2, z: -61.4, scale: 1.4, rotation: 1.2, variant: 1 },
    { x: -3.4, z: -53.8, scale: 1.1, rotation: 3.6, variant: 0 },

    // EDUCATION — a pocket around the study desk, open to the north approach.
    { x: 17.8, z: -63.2, scale: 1.2, rotation: 0.4, variant: 3 },
    { x: 10.2, z: -64.6, scale: 1.05, rotation: 2.9, variant: 0 },
    { x: 16.4, z: -70.2, scale: 1.3, rotation: 4.6, variant: 1 },

    // ACHIEVEMENTS — the shrine keeps open ground; the flanks sit well outside the dais.
    { x: 22.6, z: -30.4, scale: 1.25, rotation: 1.9, variant: 2 },
    { x: 22.0, z: -37.8, scale: 1.1, rotation: 3.3, variant: 0 },
  ],
  rocks: [
    // PROJECTS — grounding beside the desk, and one foreground stone on the approach.
    { x: -18.6, z: -24.2, scale: 0.8, rotation: 0.9, variant: 2 },
    { x: -14.0, z: -29.0, scale: 0.62, rotation: 2.2, variant: 1 },
    { x: -12.2, z: -21.4, scale: 1.05, rotation: 4.4, variant: 1 },

    // EXPERIENCE — the cabin sits on worked ground; stone reads as foundation.
    { x: -12.8, z: -56.4, scale: 0.9, rotation: 1.4, variant: 1 },
    { x: -3.8, z: -59.8, scale: 0.7, rotation: 3.1, variant: 2 },

    // EDUCATION — a low outcrop the study area is tucked against.
    { x: 18.8, z: -68.0, scale: 0.95, rotation: 2.6, variant: 1 },
    { x: 10.0, z: -68.4, scale: 0.68, rotation: 5.2, variant: 2 },

    // ACHIEVEMENTS — a foreground boulder on the approach, off the sightline, and
    // two set back so the dais reads as placed rather than dropped.
    { x: 13.0, z: -30.2, scale: 1.2, rotation: 0.5, variant: 1 },
    { x: 21.4, z: -34.6, scale: 0.85, rotation: 2.0, variant: 1 },
    { x: 15.6, z: -38.4, scale: 0.75, rotation: 3.8, variant: 2 },
  ],
}

/** Birch stand — Education's distance identifier. No other destination has them. */
export const BIRCH_STAND: { x: number; z: number; scale: number; rotation: number }[] = [
  { x: 10.2, z: -69.0, scale: 1.0, rotation: 0.4 },
  { x: 11.9, z: -71.4, scale: 0.86, rotation: 1.9 },
  { x: 8.6, z: -72.0, scale: 0.93, rotation: 3.3 },
  { x: 12.8, z: -66.4, scale: 0.78, rotation: 5.0 },
  { x: 7.4, z: -67.6, scale: 0.88, rotation: 2.2 },
  { x: 15.6, z: -73.2, scale: 0.72, rotation: 4.4 },
]

export const WORLD_SEED = 20260829
