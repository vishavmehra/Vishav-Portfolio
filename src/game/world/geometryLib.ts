import {
  BufferGeometry,
  ConeGeometry,
  CylinderGeometry,
  Color,
  Float32BufferAttribute,
  IcosahedronGeometry,
  Matrix4,
  SphereGeometry,
  Vector3,
} from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { fbm, makeRandom } from './worldGen'

/**
 * Procedurally authored asset geometry.
 *
 * There is no DCC tool in this project, so assets are authored here instead of
 * in Blender. "Authored" is the operative word: these are not primitives with a
 * colour on them. Trees get curved tapered trunks, real branches and layered
 * asymmetric foliage masses; every asset carries baked vertex colours that do
 * the job hand-painted textures would.
 *
 * Each builder returns ONE merged, non-indexed, flat-shaded geometry so a whole
 * tree is a single draw call and can be instanced.
 */

const tmpColor = new Color()

/** Flat-shaded, mergeable, with a colour attribute. */
function prepare(geometry: BufferGeometry) {
  const g = geometry.index ? geometry.toNonIndexed() : geometry
  g.deleteAttribute('uv')
  g.computeVertexNormals()
  return g
}

/** Push vertices along a noise field so nothing reads as a stock primitive. */
function deform(geometry: BufferGeometry, amount: number, frequency = 1.6, seed = 0) {
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const n =
      fbm((x + seed) * frequency, (z + seed * 1.7) * frequency, 2) - 0.5 +
      (fbm((y + seed * 3.1) * frequency, (x - seed) * frequency, 2) - 0.5)
    const len = Math.hypot(x, y, z) || 1
    const push = 1 + n * amount
    pos.setXYZ(i, x * push, y * push, z * push)
  }
  pos.needsUpdate = true
  geometry.computeVertexNormals()
  return geometry
}

/**
 * Vertical colour ramp with a little per-face jitter — the substitute for a
 * hand-painted texture. Foliage gets warm sunlit tops and cool dark undersides.
 */
function paint(
  geometry: BufferGeometry,
  low: string,
  high: string,
  jitter = 0.05,
  seed = 1,
) {
  const pos = geometry.attributes.position
  const colors = new Float32Array(pos.count * 3)
  const rand = makeRandom(seed * 9781 + 17)
  const c0 = new Color(low)
  const c1 = new Color(high)

  let minY = Infinity
  let maxY = -Infinity
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i)
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  const span = maxY - minY || 1

  // One jitter value per triangle keeps the faceted read clean.
  for (let i = 0; i < pos.count; i += 3) {
    const j = 1 + (rand() - 0.5) * jitter * 2
    for (let k = 0; k < 3; k++) {
      const idx = i + k
      const t = (pos.getY(idx) - minY) / span
      tmpColor.copy(c0).lerp(c1, t * t * (3 - 2 * t))
      colors[idx * 3] = Math.min(1, tmpColor.r * j)
      colors[idx * 3 + 1] = Math.min(1, tmpColor.g * j)
      colors[idx * 3 + 2] = Math.min(1, tmpColor.b * j)
    }
  }
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
  return geometry
}

function place(geometry: BufferGeometry, m: Matrix4) {
  geometry.applyMatrix4(m)
  return geometry
}

const mat = new Matrix4()
const mat2 = new Matrix4()
const up = new Vector3(0, 1, 0)
const dir = new Vector3()
const axis = new Vector3()

/** A tapered limb from `from` to `to`. Used for trunks and branches alike. */
function limb(
  from: Vector3,
  to: Vector3,
  radiusBottom: number,
  radiusTop: number,
  segments = 6,
) {
  dir.subVectors(to, from)
  const length = dir.length()
  const g = prepare(new CylinderGeometry(radiusTop, radiusBottom, length, segments, 1, true))
  dir.normalize()
  axis.crossVectors(up, dir)
  const angle = Math.acos(Math.max(-1, Math.min(1, up.dot(dir))))
  if (axis.lengthSq() < 1e-8) {
    mat.identity()
    if (dir.y < 0) mat.makeRotationX(Math.PI)
  } else {
    axis.normalize()
    mat.makeRotationAxis(axis, angle)
  }
  mat2.makeTranslation(
    (from.x + to.x) / 2,
    (from.y + to.y) / 2,
    (from.z + to.z) / 2,
  )
  mat2.multiply(mat)
  return place(g, mat2)
}

/** A foliage mass: a squashed, noise-deformed icosahedron. */
function foliageBlob(
  x: number,
  y: number,
  z: number,
  radius: number,
  squash: number,
  seed: number,
  detail = 1,
) {
  const g = prepare(new IcosahedronGeometry(radius, detail))
  deform(g, 0.26, 1.1, seed)
  mat.makeScale(1, squash, 1)
  place(g, mat)
  mat.makeRotationY(seed * 1.37)
  place(g, mat)
  mat.makeTranslation(x, y, z)
  return place(g, mat)
}

const BARK_LOW = '#4a3726'
const BARK_HIGH = '#7d6448'
const LEAF_LOW = '#3d5227'
const LEAF_HIGH = '#8fa855'

/**
 * Hero oak — broad and low, the tree that shelters a desk.
 *
 * Curved tapered trunk, five asymmetric branches, eight overlapping foliage
 * masses of differing size. The canopy boundary is deliberately irregular and
 * the whole silhouette leans, so no two placements read as copies once rotated.
 */
export function buildHeroOakBroad(seed = 3) {
  const rand = makeRandom(seed)
  const parts: BufferGeometry[] = []

  // Trunk: three stacked segments with a lean, so it is never a straight pole.
  const p0 = new Vector3(0, 0, 0)
  const p1 = new Vector3(0.22, 1.9, -0.12)
  const p2 = new Vector3(0.05, 3.7, 0.25)
  const p3 = new Vector3(0.3, 5.4, 0.1)
  parts.push(paint(limb(p0, p1, 0.72, 0.56, 8), BARK_LOW, BARK_HIGH, 0.07, seed))
  parts.push(paint(limb(p1, p2, 0.56, 0.44, 8), BARK_LOW, BARK_HIGH, 0.07, seed + 1))
  parts.push(paint(limb(p2, p3, 0.44, 0.33, 7), BARK_LOW, BARK_HIGH, 0.07, seed + 2))

  // Root flare — the trees in the references all sit into the ground.
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + rand() * 0.5
    const r = 0.85 + rand() * 0.4
    parts.push(
      paint(
        limb(
          new Vector3(Math.cos(a) * r, -0.15, Math.sin(a) * r),
          new Vector3(Math.cos(a) * 0.25, 1.0 + rand() * 0.3, Math.sin(a) * 0.25),
          0.3,
          0.16,
          5,
        ),
        BARK_LOW,
        BARK_HIGH,
        0.08,
        seed + 10 + i,
      ),
    )
  }

  // Branches: asymmetric spread, varied length and lift.
  const branches: { a: number; len: number; lift: number; from: Vector3 }[] = [
    { a: 0.4, len: 3.1, lift: 1.5, from: new Vector3(0.2, 4.2, 0.1) },
    { a: 1.9, len: 2.6, lift: 1.9, from: new Vector3(0.1, 4.8, 0.2) },
    { a: 3.1, len: 3.4, lift: 1.2, from: new Vector3(0.15, 3.9, 0.15) },
    { a: 4.4, len: 2.3, lift: 2.1, from: new Vector3(0.25, 5.1, 0.1) },
    { a: 5.4, len: 2.9, lift: 1.6, from: new Vector3(0.2, 4.5, 0.05) },
  ]
  const tips: Vector3[] = []
  for (let i = 0; i < branches.length; i++) {
    const b = branches[i]
    const mid = new Vector3(
      b.from.x + Math.cos(b.a) * b.len * 0.55,
      b.from.y + b.lift * 0.62,
      b.from.z + Math.sin(b.a) * b.len * 0.55,
    )
    const tip = new Vector3(
      b.from.x + Math.cos(b.a) * b.len,
      b.from.y + b.lift,
      b.from.z + Math.sin(b.a) * b.len,
    )
    parts.push(paint(limb(b.from, mid, 0.26, 0.18, 5), BARK_LOW, BARK_HIGH, 0.08, seed + 20 + i))
    parts.push(paint(limb(mid, tip, 0.18, 0.1, 5), BARK_LOW, BARK_HIGH, 0.08, seed + 30 + i))
    tips.push(tip)
  }

  // Foliage: one mass per branch tip plus a crown, sizes deliberately uneven.
  const masses: [Vector3, number, number][] = [
    [new Vector3(0.2, 6.5, 0.1), 2.5, 0.74],
    [tips[0], 1.95, 0.72],
    [tips[1], 1.7, 0.78],
    [tips[2], 2.15, 0.7],
    [tips[3], 1.55, 0.8],
    [tips[4], 1.85, 0.74],
    [new Vector3(-1.1, 5.6, 1.3), 1.5, 0.76],
    [new Vector3(1.4, 5.9, -1.2), 1.35, 0.8],
  ]
  masses.forEach(([p, r, sq], i) => {
    parts.push(
      paint(
        foliageBlob(p.x, p.y + 0.35, p.z, r, sq, seed + 40 + i),
        LEAF_LOW,
        LEAF_HIGH,
        0.09,
        seed + 40 + i,
      ),
    )
  })

  return mergeGeometries(parts, false)!
}

/**
 * Hero oak — taller and narrower. Backs a structure without competing with its
 * roofline, so the canopy sits higher and gathers rather than spreads.
 */
export function buildHeroOakTall(seed = 7) {
  const rand = makeRandom(seed)
  const parts: BufferGeometry[] = []

  const p0 = new Vector3(0, 0, 0)
  const p1 = new Vector3(-0.18, 2.4, 0.15)
  const p2 = new Vector3(0.1, 4.9, -0.1)
  const p3 = new Vector3(-0.12, 7.2, 0.18)
  parts.push(paint(limb(p0, p1, 0.6, 0.48, 8), BARK_LOW, BARK_HIGH, 0.07, seed))
  parts.push(paint(limb(p1, p2, 0.48, 0.36, 8), BARK_LOW, BARK_HIGH, 0.07, seed + 1))
  parts.push(paint(limb(p2, p3, 0.36, 0.26, 7), BARK_LOW, BARK_HIGH, 0.07, seed + 2))

  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + rand() * 0.6
    const r = 0.7 + rand() * 0.3
    parts.push(
      paint(
        limb(
          new Vector3(Math.cos(a) * r, -0.15, Math.sin(a) * r),
          new Vector3(Math.cos(a) * 0.2, 1.1, Math.sin(a) * 0.2),
          0.26,
          0.14,
          5,
        ),
        BARK_LOW,
        BARK_HIGH,
        0.08,
        seed + 10 + i,
      ),
    )
  }

  const branches: { a: number; len: number; lift: number; from: Vector3 }[] = [
    { a: 0.9, len: 2.2, lift: 1.8, from: new Vector3(0, 5.6, 0) },
    { a: 2.6, len: 1.9, lift: 2.2, from: new Vector3(0.05, 6.3, 0.05) },
    { a: 4.1, len: 2.4, lift: 1.6, from: new Vector3(-0.05, 5.9, 0.1) },
    { a: 5.6, len: 1.7, lift: 2.0, from: new Vector3(0, 6.6, 0) },
  ]
  const tips: Vector3[] = []
  branches.forEach((b, i) => {
    const tip = new Vector3(
      b.from.x + Math.cos(b.a) * b.len,
      b.from.y + b.lift,
      b.from.z + Math.sin(b.a) * b.len,
    )
    parts.push(paint(limb(b.from, tip, 0.22, 0.11, 5), BARK_LOW, BARK_HIGH, 0.08, seed + 20 + i))
    tips.push(tip)
  })

  const masses: [Vector3, number, number][] = [
    [new Vector3(0, 8.6, 0), 2.2, 0.85],
    [tips[0], 1.65, 0.8],
    [tips[1], 1.45, 0.85],
    [tips[2], 1.8, 0.78],
    [tips[3], 1.4, 0.88],
    [new Vector3(0.9, 7.4, 1.0), 1.3, 0.82],
    [new Vector3(-1.0, 7.8, -0.8), 1.25, 0.84],
  ]
  masses.forEach(([p, r, sq], i) => {
    parts.push(
      paint(
        foliageBlob(p.x, p.y + 0.3, p.z, r, sq, seed + 40 + i),
        LEAF_LOW,
        LEAF_HIGH,
        0.09,
        seed + 40 + i,
      ),
    )
  })

  return mergeGeometries(parts, false)!
}

/** Birch — slender, pale, airy. Education's distance identifier. */
export function buildBirch(seed = 11) {
  const parts: BufferGeometry[] = []
  const p0 = new Vector3(0, 0, 0)
  const p1 = new Vector3(0.12, 3.2, -0.08)
  const p2 = new Vector3(-0.05, 6.4, 0.14)
  parts.push(paint(limb(p0, p1, 0.24, 0.19, 7), '#9e9a8c', '#ded9c9', 0.06, seed))
  parts.push(paint(limb(p1, p2, 0.19, 0.13, 7), '#a8a394', '#e6e1d2', 0.06, seed + 1))

  const masses: [number, number, number, number][] = [
    [0, 7.3, 0, 1.35],
    [0.9, 6.5, 0.6, 1.0],
    [-0.8, 6.9, -0.5, 0.9],
    [0.3, 8.1, -0.7, 0.85],
  ]
  masses.forEach(([x, y, z, r], i) => {
    parts.push(
      paint(
        foliageBlob(x, y, z, r, 0.8, seed + 20 + i),
        '#5c7a34',
        '#a8c46a',
        0.1,
        seed + 20 + i,
      ),
    )
  })
  return mergeGeometries(parts, false)!
}

/** Conifer — background depth, stacked deformed cones. */
export function buildConifer(seed = 13) {
  const parts: BufferGeometry[] = []
  parts.push(
    paint(limb(new Vector3(0, 0, 0), new Vector3(0, 2.0, 0), 0.28, 0.18, 6), BARK_LOW, BARK_HIGH, 0.06, seed),
  )
  const tiers: [number, number, number][] = [
    [1.2, 1.9, 2.3],
    [2.6, 1.55, 2.1],
    [3.9, 1.15, 1.9],
    [5.0, 0.75, 1.6],
  ]
  tiers.forEach(([y, r, h], i) => {
    const g = prepare(new ConeGeometry(r, h, 7))
    deform(g, 0.12, 1.4, seed + i)
    mat.makeTranslation(0, y + h / 2, 0)
    place(g, mat)
    parts.push(paint(g, '#2f4526', '#5f7d38', 0.08, seed + 30 + i))
  })
  return mergeGeometries(parts, false)!
}

export function buildRock(variant: number) {
  const g = prepare(new IcosahedronGeometry(1, 1))
  deform(g, 0.34, 1.5 + variant * 0.4, variant * 7 + 3)
  mat.makeScale(1, 0.62 + variant * 0.12, 0.85 + variant * 0.1)
  place(g, mat)
  return paint(g, '#6f747a', '#9aa39f', 0.09, variant + 2)
}

/** Grass tuft — tapered blades, dark at the base and sunlit at the tip. */
export function buildGrassTuft(seed = 5) {
  const rand = makeRandom(seed)
  const parts: BufferGeometry[] = []
  const blades = 7
  for (let i = 0; i < blades; i++) {
    const a = (i / blades) * Math.PI * 2 + rand() * 0.9
    // Mostly upright with a small splay — a tuft, not a starburst.
    const lean = 0.05 + rand() * 0.14
    const h = 0.24 + rand() * 0.22
    parts.push(
      limb(
        new Vector3(Math.cos(a) * 0.035, 0, Math.sin(a) * 0.035),
        new Vector3(Math.cos(a) * lean, h, Math.sin(a) * lean),
        0.026,
        0.003,
        3,
      ),
    )
  }
  const merged = mergeGeometries(parts, false)!
  return paint(merged, '#4a6127', '#9dba5e', 0.14, seed)
}

/** Lupine — the signature tall spike from the references, in a dusty, sun-faded violet. */
export function buildLupine(seed = 21) {
  const parts: BufferGeometry[] = []
  parts.push(
    paint(limb(new Vector3(0, 0, 0), new Vector3(0.03, 0.42, 0.02), 0.022, 0.016, 3), '#4a6127', '#6f8a3c', 0.1, seed),
  )
  const spike = prepare(new ConeGeometry(0.075, 0.42, 6))
  deform(spike, 0.22, 3.2, seed)
  mat.makeTranslation(0.03, 0.63, 0.02)
  place(spike, mat)
  parts.push(paint(spike, '#5d5676', '#a59db8', 0.1, seed + 3))
  return mergeGeometries(parts, false)!
}

/** Daisy — white petals, warm centre. */
export function buildDaisy(seed = 23) {
  const parts: BufferGeometry[] = []
  parts.push(
    paint(limb(new Vector3(0, 0, 0), new Vector3(0, 0.24, 0), 0.016, 0.012, 3), '#4a6127', '#7a9440', 0.1, seed),
  )
  const head = prepare(new CylinderGeometry(0.085, 0.05, 0.03, 7))
  mat.makeTranslation(0, 0.26, 0)
  place(head, mat)
  parts.push(paint(head, '#e8e2cf', '#fbf7ec', 0.05, seed + 1))
  const centre = prepare(new SphereGeometry(0.032, 5, 4))
  mat.makeTranslation(0, 0.28, 0)
  place(centre, mat)
  parts.push(paint(centre, '#c98f2a', '#f0c04f', 0.06, seed + 2))
  return mergeGeometries(parts, false)!
}

/** Clover / low ground flower — reads as texture at the path edge. */
export function buildClover(seed = 27) {
  const rand = makeRandom(seed)
  const parts: BufferGeometry[] = []
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + rand()
    const g = prepare(new SphereGeometry(0.07, 5, 4))
    mat.makeScale(1, 0.45, 1)
    place(g, mat)
    mat.makeTranslation(Math.cos(a) * 0.07, 0.1, Math.sin(a) * 0.07)
    place(g, mat)
    parts.push(paint(g, '#4c6b2c', '#83a349', 0.1, seed + i))
  }
  const bloom = prepare(new SphereGeometry(0.045, 5, 4))
  mat.makeTranslation(0, 0.19, 0)
  place(bloom, mat)
  parts.push(paint(bloom, '#a8788a', '#d9b7c1', 0.08, seed + 9))
  return mergeGeometries(parts, false)!
}

export function buildReed(seed = 37) {
  const rand = makeRandom(seed)
  const parts: BufferGeometry[] = []
  for (let i = 0; i < 4; i++) {
    const a = rand() * Math.PI * 2
    const lean = 0.06 + rand() * 0.14
    const h = 0.7 + rand() * 0.5
    parts.push(
      paint(
        limb(
          new Vector3(Math.cos(a) * 0.04, 0, Math.sin(a) * 0.04),
          new Vector3(Math.cos(a) * lean, h, Math.sin(a) * lean),
          0.03,
          0.012,
          3,
        ),
        '#4f6330',
        '#93a95a',
        0.1,
        seed + i,
      ),
    )
    if (i < 2) {
      const head = prepare(new CylinderGeometry(0.035, 0.035, 0.18, 5))
      mat.makeTranslation(Math.cos(a) * lean, h + 0.08, Math.sin(a) * lean)
      place(head, mat)
      parts.push(paint(head, '#5b442a', '#8a6a41', 0.07, seed + 20 + i))
    }
  }
  return mergeGeometries(parts, false)!
}
