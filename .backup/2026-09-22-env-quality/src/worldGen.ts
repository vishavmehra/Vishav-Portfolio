import { RIVER_PROFILE } from './riverProfile'
import {
  PATHS,
  DESTINATIONS,
  STREAM,
  STREAM_DEPTH,
  type Vec2,
} from './worldConfig'

/**
 * Deterministic world generation helpers.
 *
 * Everything here is seeded and pure, so the world is identical every session
 * and props, terrain and the player all agree on where the ground is.
 */

/** Small, fast, seedable PRNG (mulberry32). */
export function makeRandom(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// --- value noise -----------------------------------------------------------

function hash2(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return n - Math.floor(n)
}

function smooth(t: number) {
  return t * t * (3 - 2 * t)
}

function valueNoise(x: number, y: number) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = smooth(xf)
  const v = smooth(yf)
  const a = hash2(xi, yi)
  const b = hash2(xi + 1, yi)
  const c = hash2(xi, yi + 1)
  const d = hash2(xi + 1, yi + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}

export function fbm(x: number, y: number, octaves = 3) {
  let sum = 0
  let amp = 1
  let freq = 1
  let norm = 0
  for (let i = 0; i < octaves; i++) {
    sum += valueNoise(x * freq, y * freq) * amp
    norm += amp
    amp *= 0.5
    freq *= 2.07
  }
  return sum / norm
}

// --- terrain ---------------------------------------------------------------

/**
 * Hand-placed mounds. The meadow is not noise — noise only breaks up the
 * surface between deliberate landforms.
 */
const MOUNDS: { x: number; z: number; radius: number; height: number }[] = [
  { x: -34, z: -30, radius: 26, height: 3.4 }, // west shoulder, frames Projects
  { x: 30, z: -20, radius: 22, height: 2.6 }, // east shoulder
  { x: -10, z: -64, radius: 30, height: 4.2 }, // rise the Experience cabin sits on
  { x: 26, z: -70, radius: 26, height: 3.0 }, // behind Education
  { x: 4, z: -40, radius: 18, height: -1.5 }, // shallow hollow mid-meadow
  { x: -44, z: -66, radius: 24, height: 3.8 },
  { x: 44, z: -44, radius: 22, height: 3.2 },
]

/** Flatten radius around each destination so structures sit level. */
const PAD_RADIUS = 7
const PAD_FALLOFF = 6

const PATH_SEGMENTS: { ax: number; az: number; bx: number; bz: number }[] = []
for (const line of PATHS) {
  for (let i = 0; i < line.length - 1; i++) {
    PATH_SEGMENTS.push({
      ax: line[i][0],
      az: line[i][1],
      bx: line[i + 1][0],
      bz: line[i + 1][1],
    })
  }
}

/** Distance from a point to the nearest path centre-line. */
export function distanceToPath(x: number, z: number) {
  let best = Infinity
  for (const s of PATH_SEGMENTS) {
    const dx = s.bx - s.ax
    const dz = s.bz - s.az
    const lenSq = dx * dx + dz * dz || 1
    let t = ((x - s.ax) * dx + (z - s.az) * dz) / lenSq
    t = t < 0 ? 0 : t > 1 ? 1 : t
    const px = s.ax + dx * t
    const pz = s.az + dz * t
    const d = Math.hypot(x - px, z - pz)
    if (d < best) best = d
  }
  return best
}

/** Samples inserted between each authored stream vertex when smoothing. */
const STREAM_SMOOTHING = 6

/**
 * The stream's centre-line, rounded through the authored vertices.
 *
 * Catmull-Rom interpolates its control points, so the curve still passes through
 * every authored vertex — including the bridge crossing — while the 20-30 degree
 * corners between them become bends.
 *
 * This is the single definition of where the stream runs. The terrain carves its
 * channel around it and the river asset is bent along it, which is what keeps the
 * water inside the ground it was cut for: when the two disagreed, the outside of
 * every bend showed a sliver of the channel's underside.
 */
export const STREAM_PATH: { x: number; z: number }[] = (() => {
  const at = (i: number) => STREAM[Math.min(Math.max(i, 0), STREAM.length - 1)]
  const points: { x: number; z: number }[] = []
  for (let i = 0; i < STREAM.length - 1; i++) {
    const [p0x, p0z] = at(i - 1)
    const [p1x, p1z] = at(i)
    const [p2x, p2z] = at(i + 1)
    const [p3x, p3z] = at(i + 2)
    for (let s = 0; s < STREAM_SMOOTHING; s++) {
      const t = s / STREAM_SMOOTHING
      const t2 = t * t
      const t3 = t2 * t
      points.push({
        x: 0.5 * (2 * p1x + (-p0x + p2x) * t + (2 * p0x - 5 * p1x + 4 * p2x - p3x) * t2 + (-p0x + 3 * p1x - 3 * p2x + p3x) * t3),
        z: 0.5 * (2 * p1z + (-p0z + p2z) * t + (2 * p0z - 5 * p1z + 4 * p2z - p3z) * t2 + (-p0z + 3 * p1z - 3 * p2z + p3z) * t3),
      })
    }
  }
  points.push({ x: STREAM[STREAM.length - 1][0], z: STREAM[STREAM.length - 1][1] })
  return points
})()

const STREAM_SEGMENTS: { ax: number; az: number; bx: number; bz: number }[] = []
for (let i = 0; i < STREAM_PATH.length - 1; i++) {
  STREAM_SEGMENTS.push({
    ax: STREAM_PATH[i].x,
    az: STREAM_PATH[i].z,
    bx: STREAM_PATH[i + 1].x,
    bz: STREAM_PATH[i + 1].z,
  })
}

function distanceToPolyline(
  x: number,
  z: number,
  segments: { ax: number; az: number; bx: number; bz: number }[],
) {
  let best = Infinity
  for (const s of segments) {
    const dx = s.bx - s.ax
    const dz = s.bz - s.az
    const lenSq = dx * dx + dz * dz || 1
    let t = ((x - s.ax) * dx + (z - s.az) * dz) / lenSq
    t = t < 0 ? 0 : t > 1 ? 1 : t
    const d = Math.hypot(x - (s.ax + dx * t), z - (s.az + dz * t))
    if (d < best) best = d
  }
  return best
}

/** Distance from a point to the stream centre-line. */
export function distanceToStream(x: number, z: number) {
  return distanceToPolyline(x, z, STREAM_SEGMENTS)
}

/** Cumulative length of the smoothed centre-line at each segment start, and in total. */
const STREAM_START: number[] = []
let STREAM_LENGTH = 0
for (const s of STREAM_SEGMENTS) {
  STREAM_START.push(STREAM_LENGTH)
  STREAM_LENGTH += Math.hypot(s.bx - s.ax, s.bz - s.az)
}

/** Where a point sits relative to the stream. Reused, never allocated per call. */
const hit = { d: 0, s: 0, t: 0, cx: 0, cz: 0 }

/**
 * Nearest point on the stream centre-line, with the point's signed lateral offset
 * and the fraction along the stream it falls at.
 *
 * The sign follows the same left-hand normal river.ts bends the channel along, so
 * "negative" here is the same bank the river asset calls negative.
 */
function nearestOnStream(x: number, z: number) {
  let best = Infinity
  for (let i = 0; i < STREAM_SEGMENTS.length; i++) {
    const s = STREAM_SEGMENTS[i]
    const dx = s.bx - s.ax
    const dz = s.bz - s.az
    const len = Math.hypot(dx, dz) || 1
    let u = ((x - s.ax) * dx + (z - s.az) * dz) / (len * len)
    u = u < 0 ? 0 : u > 1 ? 1 : u
    const cx = s.ax + dx * u
    const cz = s.az + dz * u
    const d = Math.hypot(x - cx, z - cz)
    if (d < best) {
      best = d
      hit.d = d
      // left-hand normal of the direction of travel: (-dz, dx) / len
      hit.s = (-(x - cx) * dz + (z - cz) * dx) / len
      hit.t = (STREAM_START[i] + u * len) / STREAM_LENGTH
      hit.cx = cx
      hit.cz = cz
    }
  }
  return hit
}

/** Bank profile at a fraction along the stream, interpolated between stations. Reused. */
const bankRow = { negWater: 0, negLip: 0, negLift: 0, posWater: 0, posLip: 0, posLift: 0 }
function bankProfileAt(t: number) {
  const f = Math.min(Math.max(t, 0), 1) * (RIVER_PROFILE.length - 1)
  const i = Math.min(Math.floor(f), RIVER_PROFILE.length - 2)
  const k = f - i
  const a = RIVER_PROFILE[i]
  const b = RIVER_PROFILE[i + 1]
  bankRow.negWater = a[1] + (b[1] - a[1]) * k
  bankRow.negLip = a[2] + (b[2] - a[2]) * k
  bankRow.negLift = a[3] + (b[3] - a[3]) * k
  bankRow.posWater = a[4] + (b[4] - a[4]) * k
  bankRow.posLip = a[5] + (b[5] - a[5]) * k
  bankRow.posLift = a[6] + (b[6] - a[6]) * k
  return bankRow
}

/** How far the water surface sits above the channel bed at the centre-line. */
const WATER_DEPTH = STREAM_DEPTH * 0.55
/** The ground is held this far under the water where it meets the waterline. */
const UNDER_WATERLINE = 0.04
/** And this far over the bank lip, so the lip beds into the ground instead of standing on it. */
const LIP_COVER = 0.06
/** Beyond the lip, how steeply a natural bank may be cut back, and how gently a raised one falls away. */
const BANK_CUT_SLOPE = 0.9
const BANK_FILL_SLOPE = 0.35
/** Past this distance from the centre-line the channel no longer shapes the ground at all. */
const CHANNEL_REACH = 12

const PAD_POINTS: Vec2[] = Object.values(DESTINATIONS).map((d) => d.position)

/** Distance to the nearest destination centre. */
export function distanceToPad(x: number, z: number) {
  let best = Infinity
  for (const [px, pz] of PAD_POINTS) {
    const d = Math.hypot(x - px, z - pz)
    if (d < best) best = d
  }
  return best
}

/**
 * Ground height. The single source of truth — terrain mesh, prop placement,
 * the player and the camera all read this.
 *
 * Near the stream the ground is shaped to the river asset's own channel (see
 * streamChannel): the bed sits under the water, the ground rises to meet the
 * bank lip exactly, and where the natural ground is lower than the lip a gentle
 * bank is built up to it. Everywhere else it is the natural ground.
 */
export function heightAt(x: number, z: number) {
  const natural = naturalHeightAt(x, z)
  const s = nearestOnStream(x, z)
  if (s.d > CHANNEL_REACH) return natural
  return streamChannel(natural, s.d, s.s, s.t, s.cx, s.cz)
}

/**
 * The ground as it would be without the stream: mounds, undulation, and the
 * flattening around pads, paths and the spawn.
 */
function naturalHeightAt(x: number, z: number) {
  let h = 0

  for (const m of MOUNDS) {
    const d = Math.hypot(x - m.x, z - m.z) / m.radius
    if (d < 1) {
      const f = Math.cos(d * Math.PI) * 0.5 + 0.5
      h += m.height * f * f
    }
  }

  // Broad undulation, then a finer break-up pass.
  h += (fbm(x * 0.014, z * 0.014, 3) - 0.5) * 3.2
  h += (fbm(x * 0.06, z * 0.06, 2) - 0.5) * 0.7

  // Flatten destination pads.
  const padD = distanceToPad(x, z)
  if (padD < PAD_RADIUS + PAD_FALLOFF) {
    const t = Math.min(1, Math.max(0, (padD - PAD_RADIUS) / PAD_FALLOFF))
    h *= smooth(t)
  }

  // Settle the path corridor so trails do not climb over every bump.
  const pathD = distanceToPath(x, z)
  if (pathD < 6) {
    const t = smooth(Math.min(1, pathD / 6))
    h *= 0.45 + 0.55 * t
  }

  // Spawn sits at exactly zero.
  const spawnD = Math.hypot(x, z)
  if (spawnD < 10) h *= smooth(Math.min(1, spawnD / 10))

  return h
}

/** The water surface at the stream centre nearest a point, from the natural ground there. */
function surfaceAtCentre(cx: number, cz: number) {
  return naturalHeightAt(cx, cz) - STREAM_DEPTH + WATER_DEPTH
}

/**
 * The ground inside and beside the river channel.
 *
 * The profile comes from the river asset itself (riverProfile.ts), so the ground
 * is cut for exactly the channel that is drawn in it:
 *
 *   centre ──► waterline   a bowl under the water, just below the surface at the edge
 *   waterline ──► lip      rising under the asset's damp bank to meet the lip exactly
 *   beyond the lip         the natural ground — cut back where it is steeper than a
 *                          bank, built up gently where it is lower than the lip
 *
 * The centre-line depth is unchanged from the block-out carve, so the water height
 * and everything seated on it — the bridge, the stones — stay where they were.
 *
 * What this replaced was a fixed-width trough from before the river was authored.
 * It knew nothing about the channel's width, so wherever the channel was narrow
 * or the ground fell away, the bank lip stood in the air and the dark underside
 * of the channel showed beneath it.
 */
function streamChannel(natural: number, d: number, s: number, t: number, cx: number, cz: number) {
  const surface = surfaceAtCentre(cx, cz)
  const bank = bankProfileAt(t)
  const waterline = s < 0 ? bank.negWater : bank.posWater
  const lip = s < 0 ? bank.negLip : bank.posLip
  const lipHeight = surface + (s < 0 ? bank.negLift : bank.posLift) + LIP_COVER

  if (d <= waterline) {
    const k = d / waterline
    return surface - WATER_DEPTH + (WATER_DEPTH - UNDER_WATERLINE) * k * k
  }
  if (d <= lip) {
    const k = (d - waterline) / Math.max(lip - waterline, 1e-3)
    return surface - UNDER_WATERLINE + (lipHeight - surface + UNDER_WATERLINE) * k
  }
  // Beyond the lip: keep the natural ground unless it is steeper than a bank or
  // lower than the lip, and let it return to itself with distance.
  const out = d - lip
  const cutBack = lipHeight + out * BANK_CUT_SLOPE
  const builtUp = lipHeight - out * BANK_FILL_SLOPE
  return natural > cutBack ? cutBack : natural < builtUp ? builtUp : natural
}

/**
 * Water surface height at the stream, level across the channel.
 *
 * Measured at the centre-line nearest the point, so a stone standing in the
 * shallows or on the bank reads the same water as the river drawn beside it.
 */
export function streamSurfaceAt(x: number, z: number) {
  const s = nearestOnStream(x, z)
  return surfaceAtCentre(s.cx, s.cz)
}

// --- placement -------------------------------------------------------------

export type Placement = {
  x: number
  z: number
  y: number
  scale: number
  rotation: number
  variant: number
  /** Per-instance tilt in radians, in a random direction. Overrides InstancedGroup's tiltAmount. */
  lean?: number
}

/**
 * Clustered scatter.
 *
 * Uniform random placement is the thing that makes procedural worlds read as
 * generated. Real meadows grow in patches, so items are drawn around a small
 * number of cluster centres with a falloff, and the whole set is rejected
 * against paths, destination pads and the spawn.
 */
export function clusteredPlacements(options: {
  seed: number
  clusters: number
  perCluster: [min: number, max: number]
  spread: number
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number }
  variants: number
  scale: [min: number, max: number]
  minPathDistance?: number
  maxPathDistance?: number
  minPadDistance?: number
  avoidSpawn?: number
  slopeLimit?: number
}): Placement[] {
  const rand = makeRandom(options.seed)
  const out: Placement[] = []
  const { bounds } = options
  const minPath = options.minPathDistance ?? 0
  const maxPath = options.maxPathDistance ?? Infinity
  const minPad = options.minPadDistance ?? 0
  const avoidSpawn = options.avoidSpawn ?? 0

  for (let c = 0; c < options.clusters; c++) {
    const cx = bounds.minX + rand() * (bounds.maxX - bounds.minX)
    const cz = bounds.minZ + rand() * (bounds.maxZ - bounds.minZ)
    const count =
      options.perCluster[0] +
      Math.floor(rand() * (options.perCluster[1] - options.perCluster[0] + 1))

    for (let i = 0; i < count; i++) {
      // Bias toward the cluster centre so patches have a dense core.
      const r = options.spread * Math.pow(rand(), 0.65)
      const a = rand() * Math.PI * 2
      const x = cx + Math.cos(a) * r
      const z = cz + Math.sin(a) * r

      if (x < bounds.minX || x > bounds.maxX || z < bounds.minZ || z > bounds.maxZ) continue
      const pathD = distanceToPath(x, z)
      if (pathD < minPath || pathD > maxPath) continue
      if (distanceToPad(x, z) < minPad) continue
      if (avoidSpawn > 0 && Math.hypot(x, z) < avoidSpawn) continue

      if (options.slopeLimit) {
        const h = heightAt(x, z)
        const slope =
          Math.max(
            Math.abs(heightAt(x + 1, z) - h),
            Math.abs(heightAt(x, z + 1) - h),
          )
        if (slope > options.slopeLimit) continue
      }

      out.push({
        x,
        z,
        y: heightAt(x, z),
        scale: options.scale[0] + rand() * (options.scale[1] - options.scale[0]),
        rotation: rand() * Math.PI * 2,
        variant: Math.floor(rand() * options.variants),
      })
    }
  }

  return out
}

/**
 * Where the meadow grows thick (1) or stays open (0): one broad field (~22 m) shared by
 * every patch layer, so flowers and grass gather in the same places and leave the same
 * clearings instead of each species scattering independently.
 */
export function meadowZone(x: number, z: number) {
  const n = fbm(x * 0.045 + 31.7, z * 0.045 - 17.3, 2)
  const t = Math.min(1, Math.max(0, (n - 0.36) / 0.3))
  return smooth(t)
}

/**
 * Irregular vegetation patches.
 *
 * Each patch is one to three overlapping, randomly oriented ellipses (never a disc),
 * with its own density, a dense core and a thinning edge. Patch sizes skew small, a few
 * are large, and patches only take root where the meadow zone allows — which is what
 * leaves real clearings. Items are taller in the core, and lean more toward the edge.
 */
export function patchPlacements(options: {
  seed: number
  patches: number
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number }
  radius: [min: number, max: number]
  /** Items per square metre, chosen per patch. */
  density: [min: number, max: number]
  scale: [min: number, max: number]
  /** Largest tilt in radians. */
  lean: number
  variants: number
  /** Chance a patch takes root where the zone field is 0. 1 ignores the zone. */
  zoneFloor?: number
  /** Where this layer may gather, 0..1. Defaults to the shared meadow field. */
  zone?: (x: number, z: number) => number
  minPathDistance?: number
  maxPathDistance?: number
  minPadDistance?: number
  avoidSpawn?: number
  minStreamDistance?: number
}): Placement[] {
  const rand = makeRandom(options.seed)
  const out: Placement[] = []
  const { bounds } = options
  const floor = options.zoneFloor ?? 0
  const zone = options.zone ?? meadowZone
  const minPath = options.minPathDistance ?? 0
  const maxPath = options.maxPathDistance ?? Infinity
  const minPad = options.minPadDistance ?? 0
  const avoidSpawn = options.avoidSpawn ?? 0
  const minStream = options.minStreamDistance ?? 0

  const allowed = (x: number, z: number) => {
    if (x < bounds.minX || x > bounds.maxX || z < bounds.minZ || z > bounds.maxZ) return false
    const pathD = distanceToPath(x, z)
    if (pathD < minPath || pathD > maxPath) return false
    if (minPad > 0 && distanceToPad(x, z) < minPad) return false
    if (avoidSpawn > 0 && Math.hypot(x, z) < avoidSpawn) return false
    if (minStream > 0 && distanceToStream(x, z) < minStream) return false
    return true
  }

  for (let p = 0; p < options.patches; p++) {
    let cx = 0
    let cz = 0
    let rooted = false
    for (let attempt = 0; attempt < 12 && !rooted; attempt++) {
      cx = bounds.minX + rand() * (bounds.maxX - bounds.minX)
      cz = bounds.minZ + rand() * (bounds.maxZ - bounds.minZ)
      rooted = allowed(cx, cz) && rand() < floor + (1 - floor) * zone(cx, cz)
    }
    if (!rooted) continue

    const radius = options.radius[0] + (options.radius[1] - options.radius[0]) * Math.pow(rand(), 1.8)
    const density = options.density[0] + (options.density[1] - options.density[0]) * rand()
    const lobes = 1 + Math.floor(rand() * 3)

    for (let l = 0; l < lobes; l++) {
      const offsetAngle = rand() * Math.PI * 2
      const offset = l === 0 ? 0 : radius * (0.35 + 0.45 * rand())
      const lx = cx + Math.cos(offsetAngle) * offset
      const lz = cz + Math.sin(offsetAngle) * offset
      const ra = radius * (0.55 + 0.45 * rand()) * (l === 0 ? 1 : 0.7)
      // Keep lobes only mildly elliptical; a thin one reads as a planted hedgerow.
      const rb = ra * (0.7 + 0.3 * rand())
      const theta = rand() * Math.PI
      const ct = Math.cos(theta)
      const st = Math.sin(theta)
      // At least a small clump: a lone stem is exactly the scattered look this replaces.
      const count = Math.max(3, Math.round(density * Math.PI * ra * rb))

      for (let i = 0; i < count; i++) {
        // r = u^0.75 packs more items toward the centre than area-uniform sampling (u^0.5).
        const r = Math.pow(rand(), 0.75)
        const a = rand() * Math.PI * 2
        const ex = Math.cos(a) * ra * r
        const ez = Math.sin(a) * rb * r
        const x = lx + ex * ct - ez * st
        const z = lz + ex * st + ez * ct
        if (!allowed(x, z)) continue
        out.push({
          x,
          z,
          y: heightAt(x, z),
          scale: options.scale[0] + (options.scale[1] - options.scale[0]) * (0.35 * (1 - r) + 0.65 * rand()),
          rotation: rand() * Math.PI * 2,
          variant: Math.floor(rand() * options.variants),
          lean: options.lean * (rand() * 2 - 1) * (0.45 + 0.55 * r),
        })
      }
    }
  }

  return out
}
