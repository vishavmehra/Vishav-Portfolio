/**
 * Exports the world's stream to Blender, so the river is authored against the real
 * thing rather than guessed and bent into place afterwards.
 *
 *   samples  the smoothed centre-line resampled every 0.5 m, each with its unit
 *            normal and the water surface height the terrain gives it there. The
 *            run continues past both ends of the stream, so the water can leave
 *            the world into the fog instead of stopping at a cut edge.
 *   stones   every river stone as (distance along, offset across, footprint
 *            radius), so flow can break around the ones standing in the water
 *   bridge   where the crossing sits along the run
 *
 * Run: node --import ./tools/ts-resolve.mjs tools/river-data.mjs
 * Writes art/blender/river/river-data.json.
 */
import fs from 'node:fs'
import { RIVER_STONE_PLACEMENTS } from '../src/game/world/riverStones.ts'
import { STREAM_PATH, streamCoordinates, streamSurfaceAt } from '../src/game/world/worldGen.ts'
import { BRIDGE_AT } from '../src/game/world/worldConfig.ts'

/** Metres of river beyond each end of the stream, where it runs off into the fog. */
const OVERRUN = 14
const STEP = 0.5

const distance = [0]
for (let i = 1; i < STREAM_PATH.length; i++) {
  distance.push(distance[i - 1] + Math.hypot(STREAM_PATH[i].x - STREAM_PATH[i - 1].x, STREAM_PATH[i].z - STREAM_PATH[i - 1].z))
}
const length = distance[distance.length - 1]

/** Point and unit tangent at a distance along the run; past either end it carries straight on. */
function frameAt(a) {
  if (a < 0 || a > length) {
    const edge = a < 0 ? 0 : length
    const [x, z, tx, tz] = frameAt(edge)
    const over = a - edge
    return [x + tx * over, z + tz * over, tx, tz]
  }
  let i = 1
  while (i < distance.length - 1 && distance[i] < a) i++
  const p = STREAM_PATH[i - 1]
  const q = STREAM_PATH[i]
  const k = (a - distance[i - 1]) / (distance[i] - distance[i - 1] || 1)
  // Central difference across the neighbours: a continuous tangent on a smoothed path.
  const before = STREAM_PATH[Math.max(i - 2, 0)]
  const after = STREAM_PATH[Math.min(i + 1, STREAM_PATH.length - 1)]
  const tx = after.x - before.x
  const tz = after.z - before.z
  const len = Math.hypot(tx, tz) || 1
  return [p.x + (q.x - p.x) * k, p.z + (q.z - p.z) * k, tx / len, tz / len]
}

const samples = []
for (let a = -OVERRUN; a <= length + OVERRUN + 1e-6; a += STEP) {
  const [x, z, tx, tz] = frameAt(Math.min(Math.max(a, -OVERRUN), length + OVERRUN))
  // The water sits on the terrain's own surface height; past the ends it holds the end value,
  // which is where the terrain's channel carve holds too.
  const [sx, sz] = frameAt(Math.min(Math.max(a, 0), length))
  samples.push({
    a: +a.toFixed(3),
    x: +x.toFixed(4),
    z: +z.toFixed(4),
    // left-hand normal, the same side convention the world uses for "negative bank"
    nx: +(-tz).toFixed(5),
    nz: +tx.toFixed(5),
    h: +streamSurfaceAt(sx, sz).toFixed(4),
  })
}

// Footprint radius of each river stone at scale 1 (tools/collider-measure.mjs, max at the base).
const STONE_RADIUS = [0.46, 0.49, 0.55, 0.58]
const stones = []
RIVER_STONE_PLACEMENTS.forEach((list, variant) => {
  for (const p of list) {
    const { t, s } = streamCoordinates(p.x, p.z)
    stones.push({ variant, a: +(t * length).toFixed(3), s: +s.toFixed(3), r: +(STONE_RADIUS[variant] * p.scale).toFixed(3) })
  }
})

const bridge = streamCoordinates(BRIDGE_AT[0], BRIDGE_AT[1])
const data = {
  length: +length.toFixed(3),
  overrun: OVERRUN,
  step: STEP,
  samples,
  stones,
  bridge: { a: +(bridge.t * length).toFixed(3) },
}
fs.writeFileSync('art/blender/river/river-data.json', JSON.stringify(data))
console.log(`length ${data.length} m, ${samples.length} samples (${-OVERRUN}..${(length + OVERRUN).toFixed(1)} m), ${stones.length} stones, bridge at ${data.bridge.a} m`)
