/**
 * Primitive world collision shapes on the XZ plane (docs/03 §6).
 *
 * Collision here means "the player cannot walk through the desk", not physical
 * simulation: numeric footprints only, never meshes. Extend the union (e.g. a
 * capsule) when an asset genuinely needs it.
 */
export type CollisionShape =
  | {
      type: 'circle'
      radius: number
    }
  | {
      type: 'box'
      halfWidth: number
      halfDepth: number
      /**
       * Yaw in radians about +Y, same convention as Object3D.rotation.y.
       * 0 = axis-aligned. Every destination in the world is authored slightly
       * yawed, and an axis-aligned box around a rotated desk would noticeably
       * inflate its footprint.
       */
      rotation?: number
    }
  | {
      /**
       * A circle swept along a segment on its local X axis, from -halfLength to
       * +halfLength: the footprint of anything longer than it is wide and rounded
       * at the ends — a low rock, a sprawling bush. A box would put hard corners
       * where the asset has none.
       */
      type: 'capsule'
      halfLength: number
      radius: number
      /** Yaw in radians about +Y, as for the box. */
      rotation?: number
    }

export type WorldCollider = {
  /** Stable, unique. Re-registering an id replaces the previous collider. */
  id: string
  /** World position. Only x and z are used; y is carried for debug drawing. */
  position: readonly [x: number, y: number, z: number]
  shape: CollisionShape
  /** Defaults to true. */
  enabled?: boolean
}

/** A position the resolver reads and writes. THREE.Vector3 satisfies this. */
export type PlanarPosition = { x: number; z: number }
