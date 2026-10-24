import { DESTINATIONS } from './worldConfig'
import { heightAt, type Placement } from './worldGen'

/**
 * The trail lanterns.
 *
 * Four of them, one per destination, and they exist for one reason: at night the
 * destinations are dark shapes among dark trees, and a visitor needs something to
 * walk toward. A lantern is the world's own answer to that — not a marker, not a
 * label, not a lift of the global ambient (which would just turn night into a grey
 * day). The light is small, warm and local; what carries across the meadow is the
 * lit lantern itself.
 *
 * Each one is composed for its own destination rather than dropped at a fixed
 * radius: they stand at different distances, on different sides, and none of them
 * sits in the approach sightline (all are ≥ 22° off the path's final bearing, so
 * the lantern is beside what it lights, never in front of it).
 */

/** Where the lantern hangs inside the asset, in its own frame (glTF Y-up), at scale 1. */
export const LANTERN_OFFSET = { x: 0.354, y: 1.83, z: -0.066 } as const

export type LampPost = {
  id: string
  /** the destination it belongs to, for the record */
  serves: keyof typeof DESTINATIONS
  x: number
  z: number
  scale: number
  /** the point the bracket arm reaches toward; the yaw is derived from it */
  aim: readonly [number, number]
  note: string
}

export const LAMP_POSTS: LampPost[] = [
  // --- one per destination, on the visitor's left as they arrive -------------
  {
    id: 'lamp-projects',
    serves: 'projects',
    x: -14.09,
    z: -21.47,
    scale: 1,
    aim: [-16, -26],
    note: 'left of the approach, 4.9 m out',
  },
  {
    id: 'lamp-experience',
    serves: 'experience',
    x: -8.37,
    z: -53.07,
    scale: 1.08,
    // taller: the cabin's roofline is the tallest thing here
    aim: [-8, -58],
    note: 'left of the approach, 4.9 m out',
  },
  {
    id: 'lamp-education',
    serves: 'education',
    x: 12.02,
    z: -61.49,
    scale: 0.94,
    aim: [14, -66],
    note: 'left of the approach, 4.9 m out',
  },
  {
    id: 'lamp-achievements',
    serves: 'achievements',
    x: 13.89,
    z: -31.27,
    scale: 1.12,
    // tallest, and set furthest back, so it reads across the open dais ground
    aim: [18, -34],
    note: 'left of the approach, 4.9 m out',
  },

  // --- the crossing: two at each end of the bridge, flanking the deck --------
  // The bridge is the first thing the visitor walks over and the darkest place
  // in the world at night — the water takes what little sky light there is. The
  // arms all reach in over the deck, so the light falls on the crossing itself.
  { id: 'lamp-bridge-nw', serves: 'projects', x: -1.7, z: -7.1, scale: 0.96, aim: [0, -11], note: 'bridge, north-west' },
  { id: 'lamp-bridge-ne', serves: 'projects', x: 1.7, z: -7.1, scale: 0.96, aim: [0, -11], note: 'bridge, north-east' },
  { id: 'lamp-bridge-sw', serves: 'projects', x: -2.8, z: -14.2, scale: 0.96, aim: [0, -11], note: 'bridge, south-west (clear of the fork)' },
  { id: 'lamp-bridge-se', serves: 'projects', x: 2.8, z: -14.2, scale: 0.96, aim: [0, -11], note: 'bridge, south-east (clear of the fork)' },
]

/** Yaw that swings the asset's +X (the bracket arm) toward a world point. */
function yawToward(x: number, z: number, aim: readonly [number, number]) {
  return Math.atan2(-(aim[1] - z), aim[0] - x)
}

/** One placement per post, for the instanced draw. */
export const LAMP_PLACEMENTS: Placement[] = LAMP_POSTS.map((lamp, i) => ({
  x: lamp.x,
  y: heightAt(lamp.x, lamp.z),
  z: lamp.z,
  scale: lamp.scale,
  rotation: yawToward(lamp.x, lamp.z, lamp.aim),
  variant: i,
}))

/**
 * World position of each hanging lantern — where the glow, the halo and the
 * local light all live. Derived from the placement, so moving a post moves its
 * light with it.
 */
export const LANTERN_POINTS = LAMP_PLACEMENTS.map((p) => {
  const c = Math.cos(p.rotation)
  const s = Math.sin(p.rotation)
  const lx = LANTERN_OFFSET.x * p.scale
  const lz = LANTERN_OFFSET.z * p.scale
  return {
    x: p.x + lx * c + lz * s,
    y: p.y + LANTERN_OFFSET.y * p.scale,
    z: p.z - lx * s + lz * c,
    scale: p.scale,
  }
})

/**
 * How lit the lanterns are, from the live practical intensity (0.25 by day,
 * 0.7 at evening, 1.5 at night). Zero through the day, a first flicker at
 * evening, full only at night — and it eases because the practical intensity
 * it reads is itself eased by the time-of-day transition.
 */
export function lampNightFactor(practicalIntensity: number) {
  return Math.min(1, Math.max(0, (practicalIntensity - 0.42) / 0.95))
}

/**
 * The trail signs.
 *
 * A lantern says "something is here"; the board says what. Each one stands about
 * 1.9 m from its lantern so the lamp light falls across the board, faces the
 * direction the visitor arrives from, and is set at least 1.5 m clear of the
 * worn path at both ends so nobody walks into it.
 *
 * `facing` is the direction the board looks — the bearing the player approaches
 * along, not the direction of the destination.
 */
export type SignPost = {
  id: string
  serves: keyof typeof DESTINATIONS
  /** the mesh names inside sign-boards.glb / sign-text.glb */
  word: 'PROJECTS' | 'EXPERIENCE' | 'EDUCATION' | 'ACHIEVEMENTS'
  x: number
  z: number
  facing: readonly [number, number]
}

export const SIGN_POSTS: SignPost[] = [
  { id: 'sign-projects', serves: 'projects', word: 'PROJECTS', x: -11.23, z: -24.81, facing: [0.76, 0.65] },
  { id: 'sign-experience', serves: 'experience', word: 'EXPERIENCE', x: -3.99, z: -55.08, facing: [0.38, 0.93] },
  { id: 'sign-education', serves: 'education', word: 'EDUCATION', x: 16.42, z: -61.71, facing: [0.05, 1] },
  { id: 'sign-achievements', serves: 'achievements', word: 'ACHIEVEMENTS', x: 18.06, z: -28.87, facing: [-0.5, 0.87] },
]

/** The board faces +Z in the asset, so the yaw is the facing direction's bearing. */
export const SIGN_PLACEMENTS: Placement[] = SIGN_POSTS.map((sign, i) => ({
  x: sign.x,
  y: heightAt(sign.x, sign.z),
  z: sign.z,
  scale: 1,
  rotation: Math.atan2(sign.facing[0], sign.facing[1]),
  variant: i,
}))

/**
 * The marker's post stands behind the plank, so its collider sits back from the
 * sign's own origin by this much along the facing direction.
 */
export const SIGN_POST_SETBACK = 0.15
export const SIGN_POST_RADIUS = 0.105
