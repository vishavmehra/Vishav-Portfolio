import { BRIDGE_AT } from './worldConfig'
import { heightAt } from './worldGen'

/**
 * The bridge as gameplay ground.
 *
 * The rendered bridge is the authored GLB. Walking on it does not raycast that
 * geometry: the deck is a shallow symmetric arch, so its profile is one curve and
 * the player's ground height over the deck footprint is an arithmetic expression.
 * Measured from `bridge.glb` itself — crown 1.133 above the asset's origin, falling
 * to 0.948 at each end (z = ±3.0), which `1.133 - 0.0205 z²` reproduces to ~0.013.
 *
 * The asset's origin is the stream-bed centre, so it sits at the terrain height
 * under BRIDGE_AT and the same constant places both the model and the walk surface.
 */
export const BRIDGE = {
  /** Stream-bed centre, where the trunk path crosses. The stream runs along X here,
   *  and the asset spans its own Z, so the placement needs no yaw. */
  x: BRIDGE_AT[0],
  z: BRIDGE_AT[1],
  rotation: 0,
  /** Deck top above the asset origin, at the crown. */
  crown: 1.133,
  /** Fall-off of the arch: y = crown - curve * z². */
  curve: 0.0205,
  /** Deck runs z ±3.147; walkable stops just inside so the player never hangs off the end. */
  halfLength: 3.05,
  /** Rails sit at x ±1.155; walkable stops inside them. */
  halfWidth: 1.02,
  /**
   * Ramp length at the deck *ends* only — the one edge a walker can cross. It is
   * measured along the crossing direction, where the deck and the bank meet within
   * a few centimetres of each other, so the blend is a slope rather than a step.
   */
  endFeather: 0.5,
  /**
   * Rail keep-out. The rails are solid, so the sides of the deck cannot be walked
   * across at all — which is what stops the deck height from ever being applied to
   * someone approaching from the stream. `worldColliders` places the matching boxes.
   */
  railHalfWidth: 0.1,
  railOffset: 1.14,
  railHalfLength: 3.3,
} as const

/** Terrain height at the bridge's own origin — the stream bed it stands in. */
export const BRIDGE_BASE = heightAt(BRIDGE.x, BRIDGE.z)

function smooth01(t: number) {
  const c = t < 0 ? 0 : t > 1 ? 1 : t
  return c * c * (3 - 2 * c)
}

/**
 * Deck height and how strongly it applies, or null away from the walkable deck.
 *
 * The footprint is the deck between the rails, in the bridge's own frame — not the
 * rendered mesh, which includes overhanging eaves, sills and stringers. Only the
 * *ends* are feathered: they are the single edge a walker can legitimately cross,
 * and there the deck meets the bank almost level. The sides get no feather at all,
 * because a lateral ramp would be a 1.5 m climb over a few centimetres of travel —
 * the snap this replaces. The rails make that approach impossible in the first
 * place, so the hard edge is never reached on foot.
 */
export function bridgeDeck(x: number, z: number): { y: number; weight: number } | null {
  const dx = x - BRIDGE.x
  const dz = z - BRIDGE.z
  // (the bridge stands at yaw 0; a rotated placement would need the inverse rotation here)
  if (Math.abs(dz) > BRIDGE.halfLength || Math.abs(dx) > BRIDGE.halfWidth) return null
  return {
    y: BRIDGE_BASE + BRIDGE.crown - BRIDGE.curve * dz * dz,
    weight: smooth01((BRIDGE.halfLength - Math.abs(dz)) / BRIDGE.endFeather),
  }
}

/**
 * What the player stands on: the terrain everywhere, the bridge deck where it is
 * higher. Taking the max means the approach ramps on and off without a seam — the
 * deck only takes over once it has risen above the bank.
 */
export function groundHeightAt(x: number, z: number) {
  const terrain = heightAt(x, z)
  const deck = bridgeDeck(x, z)
  if (!deck) return terrain
  const blended = terrain + (deck.y - terrain) * deck.weight
  return blended > terrain ? blended : terrain
}
