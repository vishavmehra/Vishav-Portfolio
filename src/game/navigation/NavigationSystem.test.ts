/**
 * Checks for destination guidance, against the real destination layout.
 * Run: node --test src/game/navigation/NavigationSystem.test.ts
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { DESTINATIONS } from '../world/worldConfig.ts'
import type { NavigationTarget } from './NavigationSystem.ts'

type Nav = typeof import('./NavigationSystem.ts')
/** A fresh module instance per test, since the system is module state. */
const fresh = (tag: string): Promise<Nav> => import(`./NavigationSystem.ts?${tag}`)

const RADIUS = { projects: 3, achievements: 5, experience: 5, education: 3 } as const
const TARGETS: NavigationTarget[] = Object.entries(DESTINATIONS).map(([id, d]) => ({
  id,
  type: d.contentKey,
  position: [d.position[0], 0, d.position[1]],
  interactionRadius: RADIUS[id as keyof typeof RADIUS],
  navigable: true,
}))
/** Desktop 1440x900 at 55° vertical FOV. */
const TAN_HALF_FOV = Math.tan((55 * Math.PI) / 360) * 1.6
const DT = 1 / 60
const deg = (r: number) => (r * 180) / Math.PI
/** Yaw that makes the camera look from (px, pz) straight at (tx, tz). */
const facing = (px: number, pz: number, tx: number, tz: number) => Math.atan2(px - tx, pz - tz)

type Options = { targets?: NavigationTarget[]; enabled?: (t: NavigationTarget) => boolean; vertical?: number }

/**
 * One frame. Screen offset is a pinhole stand-in for the camera: horizontal from the
 * target's position relative to the view, vertical supplied (e.g. looking steeply down).
 */
function step(n: Nav, x: number, z: number, yaw: number, { targets = TARGETS, enabled = () => true, vertical = 0 }: Options = {}) {
  const offset = (t: NavigationTarget) => {
    const dx = t.position[0] - x
    const dz = t.position[2] - z
    const ahead = -dx * Math.sin(yaw) - dz * Math.cos(yaw)
    if (ahead <= 0) return Infinity
    const right = dx * Math.cos(yaw) - dz * Math.sin(yaw)
    return Math.max(Math.abs(right / ahead) / TAN_HALF_FOV, vertical)
  }
  n.updateNavigation(x, z, yaw, DT, targets, enabled, offset)
}

test('at spawn the nearest destination is Projects, ahead-left, and guidance is active', async () => {
  const n = await fresh('spawn')
  step(n, 0, 0, 0)
  const s = n.getNavigationSnapshot()
  assert.equal(s.targetId, 'projects')
  assert.ok(Math.abs(deg(n.navigationView.bearing) + 31.6) < 0.1, `bearing ${deg(n.navigationView.bearing)}`)
  assert.equal(s.emphasis, 'active', 'at the frame edge, not clearly in view')
  assert.equal(s.edge, 0)
  assert.ok(Math.abs(n.navigationView.distance - 30.53) < 0.01)
})

test('bearing follows the camera through a full turn', async () => {
  const n = await fresh('turn')
  const ahead = facing(0, 0, -16, -26)
  for (let i = 0; i <= 36; i++) {
    const offset = (i / 36) * Math.PI * 2
    step(n, 0, 0, ahead + offset)
    // Turning the camera left (yaw increasing) moves the target right, and vice versa.
    const expected = Math.atan2(Math.sin(offset), Math.cos(offset))
    const error = Math.atan2(Math.sin(n.navigationView.bearing - expected), Math.cos(n.navigationView.bearing - expected))
    assert.ok(Math.abs(error) < 1e-9, `offset ${deg(offset)} gave ${deg(n.navigationView.bearing)}`)
  }
  step(n, 0, 0, ahead)
  assert.equal(n.getNavigationSnapshot().emphasis, 'quiet', 'dead ahead needs no arrow')
  assert.equal(n.getNavigationSnapshot().edge, 0)
  step(n, 0, 0, ahead + Math.PI / 2)
  assert.equal(n.getNavigationSnapshot().emphasis, 'active', 'to the side, out of view')
  assert.equal(n.getNavigationSnapshot().edge, 0, 'exactly 90° still sits on the dial')
  step(n, 0, 0, ahead + Math.PI)
  assert.equal(n.getNavigationSnapshot().emphasis, 'active')
  assert.notEqual(n.getNavigationSnapshot().edge, 0, 'behind pins to an edge')
  // Heading: yaw 0 looks north (0), a quarter turn right looks east (+π/2).
  step(n, 0, 0, -Math.PI / 2)
  assert.ok(Math.abs(n.navigationView.heading - Math.PI / 2) < 1e-9)
})

test('ahead but above or below the frame is not in view', async () => {
  const n = await fresh('vertical')
  const yaw = facing(0, 0, -16, -26)
  step(n, 0, 0, yaw)
  assert.equal(n.getNavigationSnapshot().emphasis, 'quiet')
  step(n, 0, 0, yaw, { vertical: 1.3 })
  assert.equal(n.getNavigationSnapshot().emphasis, 'active', 'looking steeply down past it')
  step(n, 0, 0, yaw, { vertical: 0.5 })
  assert.equal(n.getNavigationSnapshot().emphasis, 'quiet')
  assert.ok(Math.abs(n.navigationView.bearing) < 1e-9, 'the marker stays centred either way')
})

test('the nearest target switches only when another is clearly closer', async () => {
  const n = await fresh('switch')
  // Walk from Projects toward Achievements along z = -30.
  const seen: string[] = []
  for (let x = -16; x <= 18; x += 0.25) {
    step(n, x, -30, 0)
    const id = n.getNavigationSnapshot().targetId!
    if (seen[seen.length - 1] !== id) seen.push(id)
  }
  assert.deepEqual(seen, ['projects', 'achievements'], 'one clean switch, no flicker')
})

test('walking away for a while points back; approaching again quiets it', async () => {
  const n = await fresh('stray')
  // Stand 12 units south of Projects looking at it, then back away at walking speed.
  let z = -14
  for (let t = 0; t < 1; t += DT) step(n, -16, z, 0)
  assert.equal(n.getNavigationSnapshot().emphasis, 'quiet', 'in view, standing still')
  for (let t = 0; t < 1.5; t += DT) step(n, -16, (z += 4 * DT), 0)
  assert.equal(n.getNavigationSnapshot().emphasis, 'quiet', 'a short step back is not wandering off')
  for (let t = 0; t < 2; t += DT) step(n, -16, (z += 4 * DT), 0)
  assert.equal(n.getNavigationSnapshot().emphasis, 'active', 'sustained retreat')
  assert.equal(n.getNavigationSnapshot().targetId, 'projects')
  for (let t = 0; t < 0.4; t += DT) step(n, -16, (z -= 4 * DT), 0)
  assert.equal(n.getNavigationSnapshot().emphasis, 'active', 'held until clearly returning')
  for (let t = 0; t < 1.2; t += DT) step(n, -16, (z -= 4 * DT), 0)
  assert.equal(n.getNavigationSnapshot().emphasis, 'quiet')
})

test('arriving quiets guidance even when the target is behind', async () => {
  const n = await fresh('arrive')
  step(n, -16, -24, Math.PI)
  assert.equal(n.getNavigationSnapshot().targetId, 'projects')
  assert.equal(n.getNavigationSnapshot().emphasis, 'quiet')
})

test('eligibility: opt-in navigable, runtime-disabled targets skipped, new ones need no code', async () => {
  const n = await fresh('eligibility')
  const contact: NavigationTarget = { id: 'contact', type: 'contact', position: [4, 0, -6], interactionRadius: 3, navigable: true }
  step(n, 0, 0, 0, { targets: [...TARGETS, contact] })
  assert.equal(n.getNavigationSnapshot().targetType, 'contact', 'a new destination is guided toward')

  step(n, 0, 0, 0, { targets: [...TARGETS, contact], enabled: (t) => t.id !== 'contact' })
  assert.equal(n.getNavigationSnapshot().targetId, 'projects', 'disabled at runtime, even while it was the target')

  const sign: NavigationTarget = { id: 'sign', type: 'contact', position: [1, 0, -1], interactionRadius: 2 }
  step(n, 0, 0, 0, { targets: [...TARGETS, sign] })
  assert.equal(n.getNavigationSnapshot().targetId, 'projects', 'an interaction without navigable is not a destination')

  step(n, 0, 0, 0, { targets: [] })
  assert.equal(n.getNavigationSnapshot().targetId, null)
})
