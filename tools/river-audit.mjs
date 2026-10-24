/**
 * River/terrain fit audit.
 *
 * Runs the game's own code — the terrain height function and the exact function
 * that bends `river.glb` onto the stream — and compares the channel against the
 * terrain *as rendered*: the 132x132 grid, interpolated across the same triangles
 * the GPU draws, not the analytic height (which can sit above a triangle's face).
 *
 * The water surface is supposed to sit above its bed. What must never show is the
 * channel's *outside*: the bank lip standing proud of the ground exposes the dark
 * skirt beneath it, and a skirt vertex above ground shows the underside directly.
 * Those are the two things measured here.
 *
 * Run: node --import ./tools/ts-resolve.mjs tools/river-audit.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

import { heightAt } from '../src/game/world/worldGen.ts'
import { bendRiverToStream } from '../src/game/world/river.ts'
import { WORLD, WORLD_BOUNDS } from '../src/game/config.ts'

// ---------------------------------------------------------------- GLB positions
const buf = fs.readFileSync(path.join(process.cwd(), 'public/assets/3d/river.glb'))
const jsonLen = buf.readUInt32LE(12)
const json = JSON.parse(buf.slice(20, 20 + jsonLen).toString('utf8'))
let bin = null
for (let off = 20 + jsonLen; off < buf.length; ) {
  const len = buf.readUInt32LE(off)
  if (buf.readUInt32LE(off + 4) === 0x004e4942) bin = buf.slice(off + 8, off + 8 + len)
  off += 8 + len + ((4 - (len % 4)) % 4)
}
const prim = json.meshes[0].primitives[0]
function accessor(index) {
  const acc = json.accessors[index]
  const view = json.bufferViews[acc.bufferView]
  const start = bin.byteOffset + (view.byteOffset ?? 0) + (acc.byteOffset ?? 0)
  return new Float32Array(bin.buffer.slice(start, start + acc.count * 12))
}
const ribbon = accessor(prim.attributes.POSITION)
const normals = accessor(prim.attributes.NORMAL)

// A minimal stand-in for BufferGeometry: just enough surface for the real bend code.
function attribute(array) {
  return {
    array,
    count: array.length / 3,
    needsUpdate: false,
    getX: (i) => array[i * 3],
    getY: (i) => array[i * 3 + 1],
    getZ: (i) => array[i * 3 + 2],
    setXYZ: (i, x, y, z) => { array[i * 3] = x; array[i * 3 + 1] = y; array[i * 3 + 2] = z },
  }
}
const world = new Float32Array(ribbon)
const geometry = {
  attrs: { position: attribute(world), normal: attribute(new Float32Array(normals)) },
  getAttribute(name) { return this.attrs[name] },
  computeBoundingSphere() {},
  computeBoundingBox() {},
}
bendRiverToStream(geometry)

// ---------------------------------------------------------------- rendered terrain
const SIZE = WORLD.groundSize
const SEG = 132
const STEP = SIZE / SEG
const X0 = -SIZE / 2
const Z0 = -SIZE / 2 + WORLD.groundCenterZ
const grid = (ix, iz) => heightAt(X0 + ix * STEP, Z0 + iz * STEP)

/** Height of the terrain mesh, interpolated on the same triangle split three.js uses. */
function renderedTerrain(x, z) {
  const fx = (x - X0) / STEP
  const fz = (z - Z0) / STEP
  const ix = Math.min(Math.max(Math.floor(fx), 0), SEG - 1)
  const iz = Math.min(Math.max(Math.floor(fz), 0), SEG - 1)
  const u = fx - ix
  const v = fz - iz
  const ha = grid(ix, iz)          // (x0, z0)
  const hb = grid(ix, iz + 1)      // (x0, z1)
  const hc = grid(ix + 1, iz + 1)  // (x1, z1)
  const hd = grid(ix + 1, iz)      // (x1, z0)
  // PlaneGeometry splits each cell along b-d.
  if (u + v <= 1) return ha + u * (hd - ha) + v * (hb - ha)
  return hc + (1 - u) * (hb - hc) + (1 - v) * (hd - hc)
}

// ---------------------------------------------------------------- measure
const TOLERANCE = 0.03
const inPlay = (x, z) => x >= WORLD_BOUNDS.minX - 25 && x <= WORLD_BOUNDS.maxX + 25 && z >= WORLD_BOUNDS.minZ - 25 && z <= WORLD_BOUNDS.maxZ + 25

const report = { lip: { worst: -Infinity, at: null, exposed: 0, checked: 0 }, skirt: { worst: -Infinity, at: null, exposed: 0, checked: 0 } }
for (let i = 0; i < world.length / 3; i++) {
  const lift = ribbon[i * 3 + 1]
  const x = world[i * 3]
  const y = world[i * 3 + 1]
  const z = world[i * 3 + 2]
  if (!inPlay(x, z)) continue
  const kind = lift < -0.5 ? 'skirt' : lift > 0.15 ? 'lip' : null
  if (!kind) continue
  const above = y - renderedTerrain(x, z)
  const r = report[kind]
  r.checked++
  if (above > r.worst) { r.worst = above; r.at = [+x.toFixed(1), +z.toFixed(1)] }
  if (above > TOLERANCE) r.exposed++
}
for (const r of Object.values(report)) r.worst = +r.worst.toFixed(3)

console.log(JSON.stringify({
  note: 'lip: outer bank vertices, must not stand proud of the ground (that exposes the skirt). skirt: must be underground.',
  tolerance: TOLERANCE,
  ...report,
}, null, 1))

// ---------------------------------------------------------------- distribution
// Where along the stream, and by how much, does the lip stand proud — and is the
// water surface itself higher than the ground beside it (a stream on a ridge)?
const buckets = { '0.03-0.1': 0, '0.1-0.2': 0, '0.2-0.4': 0, '>0.4': 0 }
const byX = {}
for (let i = 0; i < world.length / 3; i++) {
  const lift = ribbon[i * 3 + 1]
  if (lift <= 0.15) continue
  const x = world[i * 3], y = world[i * 3 + 1], z = world[i * 3 + 2]
  if (!inPlay(x, z)) continue
  const above = y - renderedTerrain(x, z)
  if (above <= TOLERANCE) continue
  if (above < 0.1) buckets['0.03-0.1']++
  else if (above < 0.2) buckets['0.1-0.2']++
  else if (above < 0.4) buckets['0.2-0.4']++
  else buckets['>0.4']++
  const key = Math.round(x / 10) * 10
  byX[key] = Math.max(byX[key] ?? 0, +above.toFixed(2))
}
// Analytic vs rendered: is the gap the heightfield itself, or the 1.29 m grid failing to resolve the bank?
let analyticWorst = -Infinity
for (let i = 0; i < world.length / 3; i++) {
  if (ribbon[i * 3 + 1] <= 0.15) continue
  const x = world[i * 3], y = world[i * 3 + 1], z = world[i * 3 + 2]
  if (!inPlay(x, z)) continue
  analyticWorst = Math.max(analyticWorst, y - heightAt(x, z))
}
console.log(JSON.stringify({ lipExposureBuckets: buckets, worstByX: byX, lipAboveAnalyticHeightWorst: +analyticWorst.toFixed(3) }, null, 1))

// ---------------------------------------------------------------- conform feasibility
// If the lip were lowered to meet the ground, would it ever have to go below the
// water surface? That would mean the land beside the stream is lower than the water
// — a perched stream — and conforming alone could not fix it.
let below = 0
let belowWorst = Infinity
let belowAt = null
let lipsChecked = 0
for (let i = 0; i < world.length / 3; i++) {
  const lift = ribbon[i * 3 + 1]
  if (lift <= 0.15) continue
  const x = world[i * 3], y = world[i * 3 + 1], z = world[i * 3 + 2]
  if (!inPlay(x, z)) continue
  lipsChecked++
  const surface = y - lift // the water surface at this station
  const margin = renderedTerrain(x, z) - surface
  if (margin < belowWorst) { belowWorst = margin; belowAt = [+x.toFixed(1), +z.toFixed(1)] }
  if (margin < 0.02) below++
}
console.log(JSON.stringify({ lipsChecked, groundBelowWaterAtLip: below, worstGroundMinusWater: +belowWorst.toFixed(3), at: belowAt }, null, 1))
