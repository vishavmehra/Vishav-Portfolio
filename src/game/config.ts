/**
 * Central tuning constants for the game layer.
 * Approved initial targets come from docs/08_DESIGN_DECISIONS.md (DD-20, DD-28).
 * These are targets, not final values — expect them to move after playtesting.
 */

export const PLAYER = {
  /** DD-20 approved target. */
  height: 1.4,
  /** Ground footprint: world-bound clamping and the XZ collision circle (docs/03 §6). */
  radius: 0.35,
  /** DD-20 approved target, world units per second. */
  walkSpeed: 4,
  /** Left Shift. Clearly faster, still controllable at this world's scale. */
  sprintMultiplier: 1.8,
  /**
   * Touch walks faster than the keyboard does. A thumb on a joystick covers ground
   * more slowly than a held key in practice — there is no sprint on mobile, so the
   * base pace absorbs it.
   */
  touchMultiplier: 1.5,
  /** Exponential damping toward target velocity. Higher = snappier. */
  accelDamping: 16,
  decelDamping: 20,
  /** Exponential damping of facing toward movement direction. */
  turnDamping: 14,
  /** Take-off speed, world units per second. With `gravity`, a ~1.45 unit arc. */
  jumpVelocity: 8,
  /** Units per second squared. Tuned for a short, weighty hop rather than a float. */
  gravity: 22,
  /** Within this distance of the ground the player counts as standing on it. */
  groundedEpsilon: 0.06,
} as const

export const CAMERA = {
  /**
   * Rest framing: the camera's offset from the player's feet at the start of play
   * (distance ~9.4, height 4.2). The orbit camera (DD-28) re-expresses this as a
   * distance and pitch around the look-at point, so at rest the shot is exactly
   * the M4A composition, and the spawn heading is derived from it (CAMERA_YAW).
   */
  offsetX: 0,
  offsetY: 4.2,
  offsetZ: 8.4,
  /**
   * Look-at point is the player position raised by this much.
   *
   * M4A raised this from 1.0. At 1.0 the view axis sat 20.85 deg below
   * horizontal, leaving only 1.65 deg of sky in frame — an 8.8 m hero tree
   * needed to be 160 units away for its top to be visible, and the world is
   * 95 deep. Every canopy and roofline was clipped at every reachable distance.
   * The camera rig itself is unchanged; only its aim moved.
   */
  lookAtHeight: 2.4,
  fov: 55,
  near: 0.1,
  far: 140,
  /**
   * Exponential damping. Position trails slightly; target tracks a little tighter.
   * positionDamping also eases the camera back out after an occluder clears.
   */
  positionDamping: 7,
  targetDamping: 10,

  // Orbit look (DD-28, DD-36): cursor movement over the viewport, or a drag on the
  // right half of a touch screen. No button, no pointer lock.
  /** Yaw radians per pixel of mouse movement. Raised 1.5x in the controls pass. */
  lookSensitivity: 0.006,
  /** Pitch radians per pixel of mouse movement. Mouse up looks up. */
  pitchSensitivity: 0.0048,
  /** Touch drags cover fewer pixels than a mouse sweep, so they turn further per pixel. */
  touchLookScale: 2,
  /**
   * Camera elevation above the look-at point, in radians. Rest is ~0.21 on desktop.
   * The floor stops just short of level (looking up at canopies without a worm's-eye
   * view); the ceiling stops well before overhead so the camera can never flip.
   */
  minPitch: -0.15,
  maxPitch: 0.9,
  /** Damping from look input to the rendered yaw/pitch. High: responsive, never floaty. */
  lookDamping: 28,
  /** The camera never sits closer than this above the terrain. */
  groundClearance: 0.35,
} as const

/** Spawn heading, derived from the rest offset: the camera sits at (sin yaw, cos yaw) from the player. */
export const CAMERA_YAW = Math.atan2(CAMERA.offsetX, CAMERA.offsetZ)

/**
 * Responsive framing. A fixed vertical field of view loses horizontal coverage
 * as the viewport narrows, so narrow screens see almost no world beside the
 * player. Scaling the whole camera offset pulls the camera back along the same
 * vector — the viewing angle and composition are preserved exactly, there is
 * just more world in frame.
 *
 * At or above the reference aspect the scale is exactly 1, so the desktop
 * framing established in milestone 2 is unchanged.
 */
export const CAMERA_FRAMING = {
  /** 1440 x 900 — the desktop test viewport. */
  referenceAspect: 1.6,
  maxOffsetScale: 1.45,
} as const

export function cameraOffsetScale(aspect: number) {
  if (!Number.isFinite(aspect) || aspect <= 0) return 1
  if (aspect >= CAMERA_FRAMING.referenceAspect) return 1
  // Square root keeps the pull-back gentle rather than tracking aspect linearly.
  const scale = Math.sqrt(CAMERA_FRAMING.referenceAspect / aspect)
  return Math.min(scale, CAMERA_FRAMING.maxOffsetScale)
}

/**
 * Responsive field of view (M4A).
 *
 * Pulling the camera back shows more world at a given depth but does not widen
 * the viewing cone by a single degree. At 390x844 the horizontal cone is only
 * ~21.7 degrees, which makes a portrait phone a forward corridor. Widening the
 * vertical FOV is the only thing that actually opens the cone.
 *
 * Orbit yaw and pitch are untouched — this changes the lens, not the shot.
 */
export const CAMERA_FOV = {
  /** Desktop baseline (raised from 45 in M4A — see CAMERA.lookAtHeight). */
  base: 55,
  /** Chosen in M4A block-out testing — see docs/09 §M4A. */
  max: 64,
  /** Below this aspect the FOV is fully widened. */
  narrowAspect: 0.5,
} as const

export function cameraFov(aspect: number) {
  if (!Number.isFinite(aspect) || aspect <= 0) return CAMERA_FOV.base
  const { base, max, narrowAspect } = CAMERA_FOV
  const wide = CAMERA_FRAMING.referenceAspect
  if (aspect >= wide) return base
  if (aspect <= narrowAspect) return max
  const t = (wide - aspect) / (wide - narrowAspect)
  return base + (max - base) * t
}

export const WORLD = {
  spawnX: 0,
  spawnZ: 0,
  /**
   * Playable rectangle (M4A block-out, proposal P2). The fan opens north, so the
   * area is deliberately asymmetric — depth toward -Z, little behind the spawn.
   */
  minX: -50,
  maxX: 50,
  minZ: -85,
  maxZ: 10,
  /** Flat block-out ground. Replaced by the terrain heightfield in M4B. */
  groundSize: 170,
  groundCenterZ: -38,
} as const

/** Keep the player's whole footprint inside the playable rectangle. */
export const WORLD_BOUNDS = {
  minX: WORLD.minX + PLAYER.radius,
  maxX: WORLD.maxX - PLAYER.radius,
  minZ: WORLD.minZ + PLAYER.radius,
  maxZ: WORLD.maxZ - PLAYER.radius,
} as const
