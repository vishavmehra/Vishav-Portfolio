import { WORLD_COLLIDERS } from '../src/game/world/worldColliders.ts'
import { DESTINATIONS, PATHS } from '../src/game/world/worldConfig.ts'
import { distanceToPath, heightAt } from '../src/game/world/worldGen.ts'

const APPROACH: Record<string, [number, number]> = {
  // bearing the player arrives from, taken from the last path leg into each destination
  projects: [PATHS[1][2][0] - PATHS[1][3][0], PATHS[1][2][1] - PATHS[1][3][1]],
  achievements: [PATHS[2][2][0] - PATHS[2][3][0], PATHS[2][2][1] - PATHS[2][3][1]],
  experience: [PATHS[1][6][0] - PATHS[1][7][0], PATHS[1][6][1] - PATHS[1][7][1]],
  education: [PATHS[2][6][0] - PATHS[2][7][0], PATHS[2][6][1] - PATHS[2][7][1]],
}
function colliderClearance(x: number, z: number) {
  let min = 99
  for (const c of WORLD_COLLIDERS) {
    const dx = x - c.position[0], dz = z - c.position[2]
    const s = c.shape
    let d: number
    if (s.type === 'circle') d = Math.hypot(dx, dz) - s.radius
    else if (s.type === 'capsule') {
      const co = Math.cos(-s.rotation ?? 0), si = Math.sin(-(s.rotation ?? 0))
      const lx = dx * co + dz * si, lz = -dx * si + dz * co
      const cl = Math.max(-s.halfLength, Math.min(s.halfLength, lx))
      d = Math.hypot(lx - cl, lz) - s.radius
    } else {
      const co = Math.cos(-s.rotation), si = Math.sin(-s.rotation)
      const lx = dx * co + dz * si, lz = -dx * si + dz * co
      const ox = Math.abs(lx) - s.halfWidth, oz = Math.abs(lz) - s.halfDepth
      d = Math.max(ox, oz) < 0 ? Math.max(ox, oz) : Math.hypot(Math.max(ox, 0), Math.max(oz, 0))
    }
    if (d < min) min = d
  }
  return min
}
for (const id of Object.keys(APPROACH) as (keyof typeof DESTINATIONS)[]) {
  const [cx, cz] = DESTINATIONS[id].position
  const [ax, az] = APPROACH[id]
  const abear = Math.atan2(ax, az)
  const rows: string[] = []
  for (let deg = 0; deg < 360; deg += 15) {
    for (const dist of [3.6, 4.4, 5.2, 6.2]) {
      const a = (deg * Math.PI) / 180
      const x = cx + Math.sin(a) * dist
      const z = cz + Math.cos(a) * dist
      let off = Math.abs(Math.atan2(Math.sin(a - abear), Math.cos(a - abear))) * 180 / Math.PI
      const path = distanceToPath(x, z)
      const clear = colliderClearance(x, z)
      if (clear < 0.75 || path < 1.35) continue
      if (off < 22) continue // never in the approach sightline
      rows.push(`${String(deg).padStart(3)}deg ${dist}m  (${x.toFixed(1)}, ${z.toFixed(1)})  offApproach ${off.toFixed(0)}  path ${path.toFixed(2)}  clear ${clear.toFixed(2)}  h ${heightAt(x, z).toFixed(2)}`)
    }
  }
  console.log(`\n=== ${id}  approach bearing ${(abear * 180 / Math.PI).toFixed(0)}deg`)
  console.log(rows.join('\n'))
}
