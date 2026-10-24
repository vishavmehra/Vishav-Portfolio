/**
 * Flags authored props (hero trees, the birch stand, destination framing) that
 * stand where they should not: inside the
 * stream channel, or inside a destination structure's footprint.
 *
 * A tree in the water or a trunk through a wall is a composition defect the
 * renderer cannot see, so it is checked against the same data the world is built
 * from rather than by eye.
 *
 * Run: node --experimental-strip-types tools/placement-audit.ts
 */
import { BIRCH_STAND, DESTINATIONS, DESTINATION_FRAMING, HERO_TREES } from '../src/game/world/worldConfig.ts'
import { distanceToStream } from '../src/game/world/worldGen.ts'

/** The two supplied structures, by the footprint their colliders use. */
const BOXES = {
  projects: { p: DESTINATIONS.projects, hw: 1.49, hd: 1.38 },
  education: { p: DESTINATIONS.education, hw: 1.69, hd: 2.3 },
}
const STREAM_HALF = 1.7

/** Distance from a point to a rotated box: negative inside, plan distance outside. */
function boxDist(id: keyof typeof BOXES, x: number, z: number) {
  const { p, hw, hd } = BOXES[id]
  const c = Math.cos(-p.rotation)
  const s = Math.sin(-p.rotation)
  const dx = x - p.position[0]
  const dz = z - p.position[1]
  const lx = dx * c + dz * s
  const lz = -dx * s + dz * c
  const ox = Math.abs(lx) - hw
  const oz = Math.abs(lz) - hd
  return Math.max(ox, oz) < 0 ? Math.max(ox, oz) : Math.hypot(Math.max(ox, 0), Math.max(oz, 0))
}

const rows: string[] = []
/** `radius` is the prop's own footprint: what has to clear the bank or the wall. */
function check(label: string, x: number, z: number, radius: number) {
  const stream = distanceToStream(x, z)
  const flags: string[] = []
  if (stream < STREAM_HALF + radius) flags.push(`stream ${stream.toFixed(2)} < ${(STREAM_HALF + radius).toFixed(2)}`)
  const pj = boxDist('projects', x, z)
  if (pj < radius) flags.push(`shack ${pj.toFixed(2)} < ${radius.toFixed(2)}`)
  const ed = boxDist('education', x, z)
  if (ed < radius) flags.push(`cabin ${ed.toFixed(2)} < ${radius.toFixed(2)}`)
  if (flags.length) rows.push(`${label.padEnd(30)} ${flags.join('   ')}`)
}

HERO_TREES.forEach((t, i) => check(`hero-${t.kind === 0 ? 'a' : 'b'}[${i}] ${t.x},${t.z}`, t.x, t.z, (t.kind === 0 ? 0.9 : 1.05) * t.scale))
BIRCH_STAND.forEach((t, i) => check(`birch[${i}] ${t.x},${t.z}`, t.x, t.z, 0.32 * t.scale))
DESTINATION_FRAMING.bushes.forEach((p, i) => check(`framing-bush[${i}] ${p.x},${p.z}`, p.x, p.z, 0.5 * p.scale))
DESTINATION_FRAMING.rocks.forEach((p, i) => check(`framing-rock[${i}] ${p.x},${p.z}`, p.x, p.z, 0.5 * p.scale))

console.log(rows.length ? rows.join('\n') : 'clear')
