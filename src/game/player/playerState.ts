import { Vector3 } from 'three'

/**
 * The player's current world position, written by PlayerController each frame
 * and read by FollowCamera.
 *
 * A single shared Vector3 rather than React state or context: it changes every
 * frame, and passing it through React would re-render the tree continuously
 * (CLAUDE.md §29). It is mutated in place, so it never allocates.
 */
export const playerPosition = new Vector3()

/**
 * The player's movement state, written by PlayerController each frame.
 *
 * Shared the same way and for the same reason as `playerPosition`: the character
 * animation and anything else that cares about idle / walk / sprint / airborne
 * reads it in the frame loop, never through React.
 */
export const playerMotion = {
  grounded: true,
  /** Vertical velocity, units per second. Positive is rising. */
  verticalVelocity: 0,
  /** Ground speed, units per second. */
  speed: 0,
  sprinting: false,
}
