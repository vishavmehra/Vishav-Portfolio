/**
 * Destination guidance for the compass (DD-29, CLAUDE.md §10).
 *
 * Generic: it guides toward whichever of the given targets opt in with `navigable`
 * and are currently enabled — in the world, the registered destination
 * interactions, so a destination gains guidance by existing — and knows nothing
 * about what a destination is or how the compass looks.
 *
 * Each frame it picks the nearest target (with hysteresis, so two near-equal
 * destinations cannot flicker), measures the target's direction relative to
 * the camera, and decides how loudly to guide:
 *
 *   quiet   the target is in view, or the player has arrived — no arrow needed
 *   active  the target is out of view or behind, or the player has kept moving
 *           away from it for a while — point back clearly
 *
 * Plain vector maths, no pathfinding (CLAUDE.md §10), allocation-free.
 * Continuous values go to `navigationView`, written in place; React is told only
 * when the target, emphasis or edge changes.
 */

export type NavigationTarget = {
  id: string
  type: string
  position: readonly [x: number, y: number, z: number]
  /** Inside this XZ distance the player has arrived; the interaction prompt takes over. */
  interactionRadius: number
  /** Only targets that opt in are guided toward. */
  navigable?: boolean
}

export type NavigationSnapshot = {
  targetId: string | null
  targetType: string | null
  emphasis: 'quiet' | 'active'
  /** Beyond the compass field (roughly behind): -1 turn left, 1 turn right, 0 within it. */
  edge: -1 | 0 | 1
}

/** Continuous values for the HUD, written every frame. Never React state. */
export const navigationView = {
  /** Camera heading, radians clockwise from world north (−Z). */
  heading: 0,
  /** Target direction relative to the camera view: 0 ahead, positive right, ±π behind. */
  bearing: 0,
  /** XZ distance to the target. */
  distance: 0,
}

/** The compass shows ±90°; beyond that the marker pins to an edge. */
export const COMPASS_HALF_FIELD = Math.PI / 2

/** A different destination must be this much closer before guidance switches to it. */
const SWITCH_MARGIN = 2
/** Edge hysteresis around the compass field, and the arc behind where the side is held. */
const EDGE_ENTER = COMPASS_HALF_FIELD + 0.09
const EDGE_EXIT = COMPASS_HALF_FIELD - 0.09
const HOLD_SIDE_BEYOND = 2.6
/**
 * "In view": the target's screen offset (1 = the frame edge, on either axis) below
 * this, entering vs leaving — comfortably inside the frame, not grazing its edge.
 */
const VIEW_ENTER = 0.7
const VIEW_EXIT = 0.9
/** Walking away faster than this (units/s) for STRAY_AFTER seconds counts as wandering off. */
const AWAY_SPEED = 0.6
const STRAY_AFTER = 2.5
/** Approaching for this long ends it. */
const RETURN_AFTER = 0.8
const RADIAL_SMOOTHING = 6
/** A distance change faster than this is a teleport or spawn, not walking. */
const MAX_RADIAL_SPEED = 20

const SERVER_SNAPSHOT: NavigationSnapshot = { targetId: null, targetType: null, emphasis: 'quiet', edge: 0 }
let snapshot = SERVER_SNAPSHOT
const listeners = new Set<() => void>()

let target: NavigationTarget | null = null
let lastDistance = -1
let radialSpeed = 0
let awayTime = 0
let towardTime = 0
let strayed = false
let inView = false

function wrap(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle))
}

function publish(targetId: string | null, targetType: string | null, emphasis: NavigationSnapshot['emphasis'], edge: NavigationSnapshot['edge']) {
  if (snapshot.targetId === targetId && snapshot.emphasis === emphasis && snapshot.edge === edge) return
  snapshot = { targetId, targetType, emphasis, edge }
  for (const listener of listeners) listener()
}

/**
 * @param yaw           camera yaw: the camera sits at (sin yaw, cos yaw) from the player
 * @param dt            seconds since the last update
 * @param isEnabled     whether a target is currently enabled (runtime state lives with its owner)
 * @param screenOffset  how far off-centre the target appears: max(|ndc x|, |ndc y|), so 1 is
 *                      the frame edge on either axis, Infinity when behind the camera. The
 *                      caller owns the camera; asked once per frame, for the chosen target only.
 */
export function updateNavigation<T extends NavigationTarget>(
  px: number,
  pz: number,
  yaw: number,
  dt: number,
  targets: readonly T[],
  isEnabled: (target: T) => boolean,
  screenOffset: (target: T) => number,
) {
  navigationView.heading = wrap(-yaw)

  // Nearest eligible target, keeping the current one unless another is clearly closer.
  let best: T | null = null
  let bestDistance = Infinity
  let current: T | null = null
  let currentDistance = Infinity
  for (let i = 0; i < targets.length; i++) {
    const t = targets[i]
    if (t.navigable !== true || !isEnabled(t)) continue
    const d = Math.hypot(t.position[0] - px, t.position[2] - pz)
    if (t === target) {
      current = t
      currentDistance = d
    }
    if (d < bestDistance) {
      best = t
      bestDistance = d
    }
  }
  if (current && bestDistance > currentDistance - SWITCH_MARGIN) {
    best = current
    bestDistance = currentDistance
  }

  if (!best) {
    target = null
    publish(null, null, 'quiet', 0)
    return
  }
  if (best !== target) {
    target = best
    lastDistance = -1
    radialSpeed = 0
    awayTime = 0
    towardTime = 0
    strayed = false
    inView = false
  }

  // Direction relative to the camera, on the ground plane only.
  const dx = best.position[0] - px
  const dz = best.position[2] - pz
  const sin = Math.sin(yaw)
  const cos = Math.cos(yaw)
  const bearing = Math.atan2(dx * cos - dz * sin, -dx * sin - dz * cos)
  navigationView.bearing = bearing
  navigationView.distance = bestDistance

  // Sustained movement away from the target.
  if (lastDistance >= 0 && dt > 0) {
    const instant = (bestDistance - lastDistance) / dt
    if (Math.abs(instant) < MAX_RADIAL_SPEED) radialSpeed += (instant - radialSpeed) * (1 - Math.exp(-RADIAL_SMOOTHING * dt))
  }
  lastDistance = bestDistance
  if (radialSpeed > AWAY_SPEED) {
    awayTime += dt
    towardTime = 0
  } else {
    awayTime = Math.max(0, awayTime - dt * 0.5)
    towardTime = radialSpeed < -AWAY_SPEED ? towardTime + dt : 0
  }
  if (awayTime >= STRAY_AFTER) strayed = true
  if (towardTime >= RETURN_AFTER) strayed = false

  const arrived = bestDistance <= best.interactionRadius
  if (arrived) {
    strayed = false
    awayTime = 0
  }

  // Both axes: a destination above or below the frame (looking steeply down) is not in view.
  inView = screenOffset(best) < (inView ? VIEW_EXIT : VIEW_ENTER)

  const absBearing = Math.abs(bearing)

  let edge = snapshot.targetId === best.id ? snapshot.edge : 0
  if (edge === 0) {
    if (absBearing > EDGE_ENTER) edge = bearing > 0 ? 1 : -1
  } else if (absBearing < EDGE_EXIT) {
    edge = 0
  } else if (absBearing < HOLD_SIDE_BEYOND) {
    // Near straight behind the side is held, so the chevron does not swap sides.
    edge = bearing > 0 ? 1 : -1
  }

  const emphasis = !arrived && (strayed || !inView) ? 'active' : 'quiet'
  publish(best.id, best.type, emphasis, edge)
}

export function getNavigationSnapshot(): NavigationSnapshot {
  return snapshot
}

export function getServerNavigationSnapshot(): NavigationSnapshot {
  return SERVER_SNAPSHOT
}

export function subscribeNavigation(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
