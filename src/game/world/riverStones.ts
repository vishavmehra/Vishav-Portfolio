import { distanceToStream, heightAt, makeRandom, streamSurfaceAt, type Placement } from './worldGen'
import { STREAM, WORLD_SEED } from './worldConfig'

/**
 * Stones in and beside the river.
 *
 * They are their own authored assets on the stone palette, not lumps inside the
 * water mesh — sharing the river's material was what made them read as green.
 *
 * Placement is intentional rather than scattered: stones gather where a stream
 * actually drops them — on the insides of bends, in the shallows at the edge, and
 * on the banks — and the bridge approach is deliberately left clear so the
 * crossing stays readable (spec Part 6).
 */

export const RIVER_STONE_URLS = [
  '/assets/3d/river-stones/river-stone-a.glb',
  '/assets/3d/river-stones/river-stone-b.glb',
  '/assets/3d/river-stones/river-stone-c.glb',
  '/assets/3d/river-stones/river-stone-d.glb',
] as const

/** Keep this much clear space around the bridge's centre. */
const BRIDGE_CLEARANCE = 4.4
const BRIDGE = { x: 0, z: -11 }

/**
 * How far each variant sits relative to the waterline when it stands in the
 * water. The submerged ones drop below it so only their tops break the surface.
 */
const SEATING = [-0.1, -0.16, -0.09, 0.04] as const
/** A stone on dry ground beds into it by this much, so it never reads as resting on top. */
const BANK_BED = -0.05

/**
 * Where a stone's base goes.
 *
 * In the water it is seated against the water surface (never below the bed); on
 * the bank it sits on the ground. Measuring every stone from the water was what
 * left bank stones either floating over the ground or buried in it, depending on
 * how the bank rose.
 */
function seat(x: number, z: number, variant: number) {
  const ground = heightAt(x, z)
  const water = streamSurfaceAt(x, z)
  return ground < water - 0.02 ? Math.max(water + SEATING[variant], ground) : ground + BANK_BED
}

function buildStones(): Placement[][] {
  const rand = makeRandom(WORLD_SEED + 91)
  const out: Placement[][] = [[], [], [], []]

  // Walk the stream and drop clusters where the bank turns — the inside of a bend
  // is where gravel actually collects.
  for (let i = 1; i < STREAM.length - 1; i++) {
    const [ax, az] = STREAM[i - 1]
    const [bx, bz] = STREAM[i]
    const [cx, cz] = STREAM[i + 1]
    const inTangent = Math.atan2(bz - az, bx - ax)
    const outTangent = Math.atan2(cz - bz, cx - bx)
    let turn = outTangent - inTangent
    turn = Math.atan2(Math.sin(turn), Math.cos(turn))
    // Bend sharpness decides how many stones gather here; a straight reach gets few.
    const count = 2 + Math.floor(Math.abs(turn) * 7 + rand() * 2.5)

    for (let n = 0; n < count; n++) {
      // Along the reach either side of the vertex, biased to the inside of the turn.
      const along = (rand() - 0.5) * 9
      const t = Math.atan2(cz - az, cx - ax)
      const px = bx + Math.cos(t) * along
      const pz = bz + Math.sin(t) * along
      const side = turn === 0 ? (rand() < 0.5 ? 1 : -1) : Math.sign(turn) * (rand() < 0.72 ? 1 : -1)
      // Across the channel: some in the shallows, some up on the bank.
      const across = side * (0.9 + rand() * 2.1)
      const x = px + Math.cos(t + Math.PI / 2) * across
      const z = pz + Math.sin(t + Math.PI / 2) * across

      if (Math.hypot(x - BRIDGE.x, z - BRIDGE.z) < BRIDGE_CLEARANCE) continue
      const d = distanceToStream(x, z)
      if (d > 3.4) continue

      // Submerged stones in the water, angular bank stones out of it.
      const variant = d < 1.5 ? (rand() < 0.5 ? 0 : 2) : rand() < 0.45 ? 1 : 3
      out[variant].push({
        x,
        z,
        y: seat(x, z, variant),
        scale: 0.6 + rand() * 0.85,
        rotation: rand() * Math.PI * 2,
        variant,
      })
    }
  }

  // Two deliberate groups either side of the crossing, set back from the approach,
  // so the bridge reads as a place rather than as a plank over a strip of water.
  for (const [sx, sz] of [
    [-5.6, -10.4],
    [-6.4, -12.1],
    [5.3, -11.9],
    [6.6, -10.7],
  ]) {
    const variant = rand() < 0.5 ? 1 : 3
    out[variant].push({
      x: sx,
      z: sz,
      y: seat(sx, sz, variant),
      scale: 0.85 + rand() * 0.7,
      rotation: rand() * Math.PI * 2,
      variant,
    })
  }

  return out
}

export const RIVER_STONE_PLACEMENTS = buildStones()
