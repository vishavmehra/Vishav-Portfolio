import {
  BoxGeometry,
  BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Euler,
  Float32BufferAttribute,
  Matrix4,
  Quaternion,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { makeRandom } from './worldGen'

/**
 * Destination props, authored as merged geometry.
 *
 * Each destination collapses to ONE geometry with its colour baked into
 * vertices, so a workshop full of blueprints, tools and shelving costs a single
 * draw call instead of forty. This is the same approach the trees use.
 */

type Part = { geometry: BufferGeometry; color: string; shade?: number }

const matrix = new Matrix4()
const quat = new Quaternion()
const euler = new Euler()
const vec = new Vector3()
const scaleVec = new Vector3(1, 1, 1)

class Builder {
  parts: Part[] = []

  private push(g: BufferGeometry, color: string, p: number[], r: number[] | undefined, shade?: number) {
    const flat = g.index ? g.toNonIndexed() : g
    flat.deleteAttribute('uv')
    euler.set(r?.[0] ?? 0, r?.[1] ?? 0, r?.[2] ?? 0)
    quat.setFromEuler(euler)
    vec.set(p[0], p[1], p[2])
    matrix.compose(vec, quat, scaleVec)
    flat.applyMatrix4(matrix)
    flat.computeVertexNormals()
    this.parts.push({ geometry: flat, color, shade })
    return this
  }

  box(size: [number, number, number], pos: number[], color: string, rot?: number[], shade?: number) {
    return this.push(new BoxGeometry(size[0], size[1], size[2]), color, pos, rot, shade)
  }

  cyl(rt: number, rb: number, h: number, seg: number, pos: number[], color: string, rot?: number[], shade?: number) {
    return this.push(new CylinderGeometry(rt, rb, h, seg), color, pos, rot, shade)
  }

  cone(r: number, h: number, seg: number, pos: number[], color: string, rot?: number[], shade?: number) {
    return this.push(new ConeGeometry(r, h, seg), color, pos, rot, shade)
  }

  sphere(r: number, pos: number[], color: string, shade?: number) {
    return this.push(new SphereGeometry(r, 10, 7), color, pos, undefined, shade)
  }

  torus(r: number, tube: number, pos: number[], color: string, rot?: number[], shade?: number) {
    return this.push(new TorusGeometry(r, tube, 5, 12), color, pos, rot, shade)
  }

  build(seed: number) {
    const rand = makeRandom(seed)
    const c = new Color()
    const painted = this.parts.map(({ geometry, color, shade }) => {
      const pos = geometry.attributes.position
      const colors = new Float32Array(pos.count * 3)
      c.set(color)
      if (shade) c.multiplyScalar(shade)
      // Per-face jitter: the substitute for hand-painted value variation.
      for (let i = 0; i < pos.count; i += 3) {
        const j = 1 + (rand() - 0.5) * 0.13
        for (let k = 0; k < 3; k++) {
          colors[(i + k) * 3] = Math.min(1, c.r * j)
          colors[(i + k) * 3 + 1] = Math.min(1, c.g * j)
          colors[(i + k) * 3 + 2] = Math.min(1, c.b * j)
        }
      }
      geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
      return geometry
    })
    return mergeGeometries(painted, false)!
  }
}

// Warm earthy palette. Nothing saturated, nothing shiny.
const TIMBER = '#9b7d59'
const TIMBER_DARK = '#6d5537'
const TIMBER_WARM = '#ab8a60'
const STONE = '#a7a294'
const STONE_DARK = '#8a8578'
const PAPER = '#d8d0ba'
const BRASS = '#b8944e'
const CLOTH = '#b0725c'
const LEATHER = '#7d5a3c'
const BLUEPRINT = '#5b7f9e'

/** Plank table with an apron and four legs. */
function table(b: Builder, w: number, d: number, h = 0.74) {
  b.box([w, 0.09, d], [0, h, 0], TIMBER)
  b.box([w * 0.84, 0.11, d * 0.68], [0, h - 0.1, 0], TIMBER_DARK)
  const inset = 0.17
  for (const [lx, lz] of [
    [-w / 2 + inset, -d / 2 + inset],
    [w / 2 - inset, -d / 2 + inset],
    [-w / 2 + inset, d / 2 - inset],
    [w / 2 - inset, d / 2 - inset],
  ]) {
    b.box([0.11, h - 0.12, 0.11], [lx, h / 2 - 0.06, lz], TIMBER_DARK)
  }
}

function stool(b: Builder, x: number, z: number, r = 0.23) {
  b.cyl(r, r * 0.95, 0.08, 10, [x, 0.46, z], TIMBER)
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2
    b.cyl(0.035, 0.045, 0.44, 5, [x + Math.cos(a) * r * 0.6, 0.22, z + Math.sin(a) * r * 0.6], TIMBER_DARK, [
      Math.cos(a) * 0.12,
      0,
      -Math.sin(a) * 0.12,
    ])
  }
}

function bookStack(b: Builder, x: number, y: number, z: number, n: number, rot: number) {
  const cols = [CLOTH, '#6b7f5c', LEATHER, '#7a6a8c']
  for (let i = 0; i < n; i++) {
    b.box([0.26, 0.052, 0.19], [x + i * 0.012, y + 0.028 + i * 0.055, z + i * 0.01], cols[i % cols.length], [
      0,
      rot + i * 0.14 - 0.1,
      0,
    ])
  }
}

function openBook(b: Builder, x: number, y: number, z: number, rot: number, s = 1) {
  const cs = Math.cos(rot)
  const sn = Math.sin(rot)
  const off = (dx: number, dz: number): number[] => [x + dx * cs - dz * sn, y, z + dx * sn + dz * cs]
  b.box([0.22 * s, 0.016, 0.17 * s], off(-0.11 * s, 0), PAPER, [0, rot, 0.07])
  b.box([0.22 * s, 0.016, 0.17 * s], off(0.11 * s, 0), PAPER, [0, rot, -0.07])
  b.box([0.035 * s, 0.02, 0.17 * s], off(0, 0), LEATHER, [0, rot, 0])
}

/** PROJECTS — an outdoor developer's desk, mid-use. */
export function buildProjects() {
  const b = new Builder()
  table(b, 1.9, 0.92)
  // CRT
  b.box([0.62, 0.52, 0.5], [-0.16, 1.06, -0.12], TIMBER_WARM)
  b.box([0.54, 0.44, 0.04], [-0.16, 1.07, 0.13], TIMBER_DARK)
  b.cyl(0.12, 0.17, 0.09, 8, [-0.16, 0.8, -0.12], TIMBER_DARK)
  // keyboard, mug, notebook, papers, pen pot
  b.box([0.56, 0.035, 0.19], [-0.16, 0.79, 0.33], STONE, [0, 0.05, 0])
  b.cyl(0.055, 0.048, 0.1, 9, [0.42, 0.82, 0.26], PAPER)
  b.torus(0.032, 0.009, [0.487, 0.83, 0.26], PAPER, [0, 0, Math.PI / 2])
  bookStack(b, 0.66, 0.785, -0.16, 3, 0.3)
  openBook(b, 0.28, 0.79, 0.02, -0.25)
  b.box([0.2, 0.006, 0.15], [0.02, 0.795, -0.3], PAPER, [0, 0.4, 0])
  b.box([0.17, 0.006, 0.13], [-0.62, 0.795, 0.2], PAPER, [0, -0.5, 0])
  b.cyl(0.05, 0.05, 0.12, 7, [0.86, 0.83, 0.14], TIMBER_DARK)
  for (let i = 0; i < 3; i++) {
    b.cyl(0.008, 0.008, 0.16, 4, [0.86 + i * 0.02 - 0.02, 0.92, 0.14 + i * 0.015], BRASS, [0.1 * i, 0, 0.12 * i - 0.1])
  }
  stool(b, 0.1, 0.95)
  // crate and coiled cable
  b.box([0.44, 0.44, 0.44], [1.18, 0.22, -0.1], TIMBER_DARK, [0, 0.4, 0])
  b.box([0.4, 0.06, 0.4], [1.18, 0.46, -0.1], TIMBER, [0, 0.4, 0])
  b.torus(0.22, 0.017, [-0.55, 0.03, -0.5], '#4a4038', [-Math.PI / 2, 0, 0.6])
  return b.build(101)
}

/** EXPERIENCE — the only roofline in the world. Timber, inhabited, engineering. */
export function buildExperienceStructure() {
  const b = new Builder()
  const slope = 0.6
  b.box([6.6, 0.24, 5.6], [0, 0.12, 0], STONE_DARK)
  b.box([6.2, 0.14, 5.2], [0, 0.3, 0], TIMBER_DARK)
  // paired rafters, then the roof skin proud of them
  for (const z of [-2.3, -1.15, 0, 1.15, 2.3]) {
    b.box([0.17, 5.25, 0.3], [-1.52, 2.52, z], TIMBER_DARK, [0, 0, -slope])
    b.box([0.17, 5.25, 0.3], [1.52, 2.52, z], TIMBER_DARK, [0, 0, slope])
  }
  b.box([0.11, 5.2, 5.3], [-1.62, 2.52, 0], TIMBER, [0, 0, -slope])
  b.box([0.11, 5.2, 5.3], [1.62, 2.52, 0], TIMBER, [0, 0, slope])
  b.box([0.34, 0.22, 5.4], [0, 4.68, 0], TIMBER_WARM)
  // boarded back wall, south face left open
  for (let i = 0; i < 7; i++) {
    b.box([0.8, 2.9, 0.14], [-2.4 + i * 0.8, 1.75, -2.62], i % 2 ? TIMBER : TIMBER_DARK)
  }
  // tapered stone chimney
  b.box([0.78, 3.0, 0.78], [-2.45, 1.5, -1.5], STONE)
  b.box([0.62, 0.5, 0.62], [-2.45, 3.1, -1.5], STONE_DARK)
  b.box([0.86, 0.16, 0.86], [-2.45, 3.42, -1.5], STONE)
  return b.build(202)
}

/** Experience interior: blueprints, shelving, tools, half-built mechanisms. */
export function buildExperienceProps() {
  const b = new Builder()
  // workbench
  b.box([3.0, 0.12, 0.78], [0.2, 0.85, -1.5], TIMBER)
  b.box([0.13, 0.62, 0.13], [-0.95, 0.5, -1.5], TIMBER_DARK)
  b.box([0.13, 0.62, 0.13], [1.35, 0.5, -1.5], TIMBER_DARK)
  // blueprint board
  b.box([2.0, 1.25, 0.07], [0.4, 1.95, -2.5], TIMBER_DARK)
  const sheets: number[][] = [[-0.5, 0.2], [0.35, 0.32], [0.55, -0.22], [-0.35, -0.3]]
  sheets.forEach(([dx, dy], i) => {
    b.box([0.52, 0.4, 0.012], [0.4 + dx, 1.95 + dy, -2.44], BLUEPRINT, [0, 0, i * 0.06 - 0.09])
  })
  // shelving with jars, gears, spools
  b.box([1.5, 0.08, 0.42], [2.3, 1.5, -1.9], TIMBER, [0, Math.PI / 2, 0])
  b.box([1.5, 0.08, 0.42], [2.3, 1.02, -1.9], TIMBER, [0, Math.PI / 2, 0])
  b.box([0.1, 0.62, 0.42], [2.3, 1.26, -2.6], TIMBER_DARK)
  b.box([0.1, 0.62, 0.42], [2.3, 1.26, -1.2], TIMBER_DARK)
  ;[-0.45, -0.1, 0.28, 0.55].forEach((dz, i) => {
    b.cyl(0.075, 0.075, 0.19, 8, [2.3, 1.63, -1.9 + dz], i % 2 ? PAPER : '#7f8f7a')
  })
  ;[-0.35, 0.1, 0.42].forEach((dz) => {
    b.torus(0.11, 0.035, [2.3, 1.14, -1.9 + dz], BRASS, [Math.PI / 2, 0, 0])
  })
  // tools and a half-built mechanism on the bench
  b.torus(0.16, 0.05, [-0.5, 0.95, -1.45], BRASS, [Math.PI / 2, 0, 0.3])
  b.cyl(0.055, 0.055, 0.22, 7, [-0.15, 0.98, -1.5], '#6f7a80')
  b.box([0.36, 0.05, 0.07], [0.75, 0.95, -1.42], '#6f7a80', [0, 0.5, 0.1])
  b.box([0.3, 0.04, 0.05], [0.95, 0.94, -1.62], BRASS, [0, 0.9, 0])
  openBook(b, 1.25, 0.92, -1.5, 0.4, 1.1)
  // crates, barrel, stool
  b.box([0.62, 0.62, 0.62], [2.05, 0.62, 1.15], TIMBER_DARK, [0, 0.35, 0])
  b.box([0.46, 0.46, 0.46], [2.35, 0.53, 0.45], TIMBER, [0, 0.9, 0])
  b.cyl(0.38, 0.34, 0.82, 10, [-2.15, 0.72, 1.5], TIMBER_DARK)
  b.torus(0.37, 0.03, [-2.15, 0.95, 1.5], BRASS, [Math.PI / 2, 0, 0])
  stool(b, 0.35, -0.55)
  // lantern bracket at the opening
  b.box([0.07, 0.5, 0.07], [1.75, 2.35, 2.2], TIMBER_DARK)
  return b.build(303)
}

/** EDUCATION — a scholar's outdoor study. No screen anywhere. */
export function buildEducation() {
  const b = new Builder()
  table(b, 1.95, 1.0)
  // globe on a brass stand
  b.cyl(0.11, 0.13, 0.05, 9, [0.6, 0.84, -0.13], BRASS)
  b.sphere(0.2, [0.6, 1.07, -0.13], '#7f9aa8')
  b.torus(0.235, 0.018, [0.6, 1.07, -0.13], BRASS, [0.4, 0, 0.25])
  b.cyl(0.014, 0.014, 0.42, 5, [0.6, 1.0, -0.13], BRASS, [0.4, 0, 0.25])
  // astrolabe
  b.cyl(0.07, 0.09, 0.05, 8, [-0.62, 0.82, -0.1], BRASS)
  b.torus(0.21, 0.016, [-0.62, 1.07, -0.1], BRASS, [0.35, 0.4, 0])
  b.torus(0.17, 0.014, [-0.62, 1.07, -0.1], BRASS, [0.35, 0.4 + Math.PI / 2, 0])
  b.cyl(0.012, 0.012, 0.3, 4, [-0.62, 0.94, -0.1], BRASS)
  // upright books
  const spines = [CLOTH, '#5f7a58', LEATHER, '#6a6488']
  ;[-0.13, -0.04, 0.05, 0.15].forEach((dx, i) => {
    b.box([0.075, 0.42, 0.29], [-0.05 + dx, 1.0, -0.33], spines[i], [0, 0, i === 3 ? 0.28 : 0])
  })
  openBook(b, 0.1, 0.79, 0.22, 0.1, 1.35)
  // inkwell, quill, loose papers, journals on the grass
  b.cyl(0.05, 0.055, 0.08, 8, [-0.42, 0.83, 0.28], '#3f4a55')
  b.cyl(0.005, 0.017, 0.3, 4, [-0.4, 0.95, 0.3], PAPER, [0.2, 0, 0.5])
  b.box([0.24, 0.006, 0.18], [0.62, 0.795, 0.3], PAPER, [0, 0.5, 0])
  bookStack(b, -0.78, 0.785, 0.16, 4, -0.3)
  // reading lamp — the approved night light position (DD-22)
  b.cyl(0.07, 0.085, 0.05, 8, [0.88, 0.83, 0.06], BRASS)
  b.cyl(0.014, 0.014, 0.34, 5, [0.88, 1.01, 0.06], BRASS)
  b.cone(0.14, 0.16, 9, [0.88, 1.24, 0.06], BRASS)
  stool(b, -0.15, 0.95)
  openBook(b, -1.5, 0.02, 0.75, 0.8, 1.15)
  bookStack(b, 1.45, 0.02, 0.6, 2, 0.5)
  b.box([0.62, 0.16, 0.44], [1.15, 0.09, -0.75], CLOTH, [0, 0.6, 0])
  return b.build(404)
}

/** ACHIEVEMENTS — symmetrical shrine on a stepped dais. Five supporting props. */
export function buildAchievementsStructure() {
  const b = new Builder()
  b.cyl(3.25, 3.4, 0.2, 24, [0, 0.1, 0], STONE_DARK)
  b.cyl(2.75, 2.85, 0.18, 24, [0, 0.28, 0], STONE)
  b.cyl(2.35, 2.42, 0.16, 24, [0, 0.44, 0], STONE)
  b.box([1.5, 0.62, 1.1], [0, 0.82, 0], STONE)
  b.box([1.66, 0.1, 1.24], [0, 1.16, 0], STONE_DARK)
  for (const [px, pz] of [[-0.68, -0.44], [0.68, -0.44], [-0.68, 0.44], [0.68, 0.44]]) {
    b.box([0.15, 1.22, 0.15], [px, 1.82, pz], TIMBER_DARK)
  }
  b.box([1.9, 0.14, 1.45], [0, 2.5, 0], TIMBER)
  b.box([0.12, 1.28, 1.5], [-0.44, 2.82, 0], TIMBER, [0, 0, -0.72])
  b.box([0.12, 1.28, 1.5], [0.44, 2.82, 0], TIMBER, [0, 0, 0.72])
  b.box([0.2, 0.14, 1.6], [0, 3.28, 0], TIMBER_WARM)
  return b.build(505)
}

export function buildAchievementsProps() {
  const b = new Builder()
  // medals on ribbons
  const ribbons: [number, number, string][] = [
    [-0.44, 0.42, '#7c5b8e'],
    [-0.08, 0.56, '#8e5b5b'],
    [0.3, 0.36, '#5b7b8e'],
  ]
  ribbons.forEach(([x, len, col]) => {
    b.box([0.075, len, 0.014], [x, 2.42 - len / 2, 0.5], col)
    b.cyl(0.075, 0.075, 0.022, 10, [x, 2.42 - len - 0.06, 0.5], BRASS)
  })
  // 1 trophy
  b.cyl(0.14, 0.17, 0.09, 10, [0, 1.27, 0], BRASS)
  b.cyl(0.05, 0.05, 0.14, 8, [0, 1.38, 0], BRASS)
  b.cyl(0.19, 0.09, 0.24, 10, [0, 1.53, 0], BRASS)
  // 2 plaque
  b.box([0.72, 0.4, 0.045], [0, 0.86, 0.57], BRASS, [0.22, 0, 0])
  // 3 shield
  b.box([0.52, 0.68, 0.07], [1.45, 0.85, 0.95], '#4f6a86', [0.3, -0.5, 0.1])
  b.cone(0.16, 0.3, 3, [1.45, 0.9, 0.99], BRASS, [0.3, -0.5, 0.1])
  // 4 and 5 benches
  for (const s of [-1, 1]) {
    const bx = s * 2.0
    b.box([1.35, 0.11, 0.42], [bx, 0.72, 0.95], TIMBER, [0, -s * 0.55, 0])
    b.box([0.13, 0.34, 0.36], [bx - 0.45 * s, 0.55, 0.95 - 0.25 * s], TIMBER_DARK, [0, -s * 0.55, 0])
    b.box([0.13, 0.34, 0.36], [bx + 0.45 * s, 0.55, 0.95 + 0.25 * s], TIMBER_DARK, [0, -s * 0.55, 0])
  }
  b.cyl(0.055, 0.055, 0.42, 8, [-2.05, 0.81, 0.9], PAPER, [0, 0.4, Math.PI / 2])
  openBook(b, 2.0, 0.78, 0.9, -0.5)
  return b.build(606)
}

/**
 * TRAILHEAD — the marker at the start of the path, where the visitor arrived.
 *
 * Weathered post, two arrow boards and a pinned notice: the same trail-marker
 * language docs/03 §10 already uses for guidance, so it reads as part of the
 * world rather than an exit button. The boards carry no lettering — the prompt
 * says what it does (CLAUDE.md §9: no floating text in the world).
 */
export function buildTrailhead() {
  const b = new Builder()
  // post, leaning a touch, with a shingle cap
  b.cyl(0.072, 0.085, 2.3, 7, [0, 1.15, 0], TIMBER_DARK, [0.015, 0.4, 0.02])
  b.cone(0.13, 0.15, 7, [0.02, 2.32, 0.01], TIMBER_DARK)
  // two arrow boards, pointing down the path and back out of the world
  b.box([0.8, 0.2, 0.045], [0.31, 1.88, 0.02], TIMBER, [0, 0.16, 0.02])
  b.cone(0.14, 0.2, 3, [0.74, 1.88, 0.02], TIMBER, [0, 0.16, -Math.PI / 2])
  b.box([0.62, 0.17, 0.045], [-0.25, 1.54, 0.04], TIMBER_WARM, [0, -0.23, -0.02])
  b.cone(0.12, 0.17, 3, [-0.58, 1.54, 0.04], TIMBER_WARM, [0, -0.23, Math.PI / 2])
  // a notice pinned at eye height, and stones packed round the foot
  b.box([0.3, 0.23, 0.03], [0.04, 1.17, 0.07], PAPER, [0, 0.12, 0.05])
  b.sphere(0.17, [0.24, 0.05, 0.16], STONE)
  b.sphere(0.13, [-0.21, 0.04, -0.13], STONE_DARK)
  b.sphere(0.1, [-0.05, 0.03, 0.26], STONE)
  return b.build(707)
}
