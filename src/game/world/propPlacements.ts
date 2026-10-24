import { DESTINATION_FRAMING, MID_PATH_LANDMARK, WORLD_SEED } from './worldConfig'
import { clusteredPlacements, distanceToStream, heightAt, type Placement } from './worldGen'

/**
 * Where the solid props stand: rocks, bushes and conifers.
 *
 * Plain data, computed once at import, so the renderer and the collision records
 * read the same list. A rock drawn in one place and blocking in another is the bug
 * this file exists to make impossible.
 */

const BOUNDS = { minX: -50, maxX: 50, minZ: -84, maxZ: 6 }

/**
 * Per-variant size trim for the rock family (Vegetation.tsx lists the assets). The
 * assets carry their own scale; this only keeps the three big shapes from towering
 * over the destinations when the scatter draws its largest sizes.
 */
export const ROCK_SCALE = [1, 1, 0.8, 0.85, 0.9] as const

/**
 * How often each shape turns up in the scatter, as twenty equal draws: mostly small
 * stones and medium boulders, the big and tall shapes as occasional accents — the
 * way loose rock actually lies in a meadow.
 */
const ROCK_MIX = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 3, 3, 3, 2, 2, 4, 4] as const

/** Rock placements, one list per variant (0 small stone … 4 tall angular rock). */
export const ROCK_PLACEMENTS: Placement[][] = (() => {
  // Clustered, never a uniform sprinkle. The seed and the number of draws are
  // unchanged from the three-rock set, so every rock stands where it stood; only the
  // shape drawn there and its size range changed with the new family.
  const raw = clusteredPlacements({
    seed: WORLD_SEED + 7,
    clusters: 30,
    perCluster: [2, 5],
    spread: 2.6,
    bounds: BOUNDS,
    variants: ROCK_MIX.length,
    scale: [0.6, 1.1],
    minPathDistance: 1.9,
    minPadDistance: 7,
    avoidSpawn: 8,
  })

  // Each rock is authored bedded slightly into the ground, so nothing is sunk here.
  // The scatter knows nothing about the stream, and a dozen meadow rocks were
  // landing in the channel itself; the river stones own the water, so these keep
  // to the banks and beyond.
  const rocks: Placement[][] = ROCK_SCALE.map(() => [])
  for (const p of raw) {
    if (distanceToStream(p.x, p.z) < 2.6) continue
    const variant = ROCK_MIX[p.variant]
    rocks[variant].push({ ...p, variant, scale: p.scale * ROCK_SCALE[variant] })
  }

  for (const r of DESTINATION_FRAMING.rocks) {
    rocks[r.variant].push({
      x: r.x,
      z: r.z,
      y: heightAt(r.x, r.z),
      scale: r.scale * ROCK_SCALE[r.variant],
      rotation: r.rotation,
      variant: r.variant,
    })
  }

  // The authored landmark cluster on the Experience leg.
  const [lx, lz] = MID_PATH_LANDMARK.position
  for (const r of MID_PATH_LANDMARK.rocks) {
    const x = lx + r.offset[0]
    const z = lz + r.offset[1]
    rocks[r.variant].push({
      x,
      z,
      y: heightAt(x, z),
      scale: r.scale * ROCK_SCALE[r.variant],
      rotation: (r.offset[0] + r.offset[1]) * 1.3,
      variant: r.variant,
    })
  }
  return rocks
})()

/**
 * Bushes: four authored silhouettes, clustered in thickets rather than dotted, plus
 * the authored framing around each destination on the same instanced variants.
 */
export const BUSH_PLACEMENTS: Placement[] = [
  ...clusteredPlacements({
    seed: WORLD_SEED + 5,
    clusters: 26,
    perCluster: [2, 5],
    spread: 3.4,
    bounds: BOUNDS,
    variants: 4,
    scale: [0.75, 1.6],
    minPathDistance: 2.6,
    minPadDistance: 8,
    avoidSpawn: 9,
  }),
  ...DESTINATION_FRAMING.bushes.map((b) => ({
    x: b.x,
    z: b.z,
    y: heightAt(b.x, b.z),
    scale: b.scale,
    rotation: b.rotation,
    variant: b.variant,
  })),
]

/** Conifers gather in stands rather than dotting the meadow. `variant % 3` picks the asset. */
export const CONIFER_PLACEMENTS: Placement[] = clusteredPlacements({
  seed: WORLD_SEED + 41,
  clusters: 9,
  perCluster: [3, 7],
  spread: 7,
  bounds: { minX: -50, maxX: 50, minZ: -84, maxZ: 4 },
  variants: 3,
  scale: [0.8, 1.35],
  minPathDistance: 8,
  minPadDistance: 13,
  avoidSpawn: 18,
  slopeLimit: 1.4,
})
