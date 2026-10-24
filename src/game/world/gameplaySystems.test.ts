/**
 * Checks for the collision resolver and interaction selection.
 * Run: node --test src/game/world/gameplaySystems.test.ts
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { registerCollider, resolveMovement, setColliderEnabled } from './collision/CollisionSystem.ts'
import { getActiveInteraction, interact, onInteraction, registerInteraction, updateInteractions } from './interaction/InteractionSystem.ts'

const R = 0.35
const EPS = 1e-6

function walk(from: { x: number; z: number }, dx: number, dz: number, steps: number) {
  const p = { x: from.x, z: from.z }
  for (let i = 0; i < steps; i++) resolveMovement(p, dx, dz, R, p)
  return p
}

test('circle: head-on approach stops at contact without penetrating', () => {
  const off = registerCollider({ id: 't-tree', position: [0, 0, 0], shape: { type: 'circle', radius: 1 } })
  const p = walk({ x: 0, z: 5 }, 0, -0.066, 200)
  assert.ok(Math.abs(Math.hypot(p.x, p.z) - (1 + R)) < 1e-3, `ended at ${p.x}, ${p.z}`)
  off()
})

test('circle: an off-centre approach slides around instead of sticking', () => {
  const off = registerCollider({ id: 't-tree', position: [0, 0, 0], shape: { type: 'circle', radius: 1 } })
  const p = { x: 0.2, z: 5 }
  for (let i = 0; i < 400; i++) {
    resolveMovement(p, 0, -0.066, R, p)
    assert.ok(Math.hypot(p.x, p.z) >= 1 + R - EPS, 'never inside the tree')
  }
  assert.ok(p.z < -1.5, `got past the tree (z=${p.z})`)
  off()
})

test('box: pushing into a wall keeps the parallel component (slide)', () => {
  const off = registerCollider({ id: 't-wall', position: [0, 0, 0], shape: { type: 'box', halfWidth: 3, halfDepth: 1 } })
  const p = walk({ x: -2, z: 3 }, 0.04, -0.04, 100)
  assert.ok(Math.abs(p.z - (1 + R)) < 1e-6, `held at the face (z=${p.z})`)
  assert.ok(p.x > 1.9, `slid along it (x=${p.x})`)
  off()
})

test('capsule: never entered from any side, and slides along its length', () => {
  const yaw = 0.8
  const hl = 1
  const rad = 0.5
  const off = registerCollider({ id: 't-rock', position: [0, 0, 0], shape: { type: 'capsule', halfLength: hl, radius: rad, rotation: yaw } })
  const distance = (p: { x: number; z: number }) => {
    const lx = p.x * Math.cos(yaw) - p.z * Math.sin(yaw)
    const lz = p.x * Math.sin(yaw) + p.z * Math.cos(yaw)
    return Math.hypot(lx - Math.max(-hl, Math.min(hl, lx)), lz)
  }
  // straight at it from eight directions, including dead centre on the core line
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2
    const p = { x: Math.cos(a) * 4, z: Math.sin(a) * 4 }
    for (let i = 0; i < 150; i++) {
      resolveMovement(p, -Math.cos(a) * 0.05, -Math.sin(a) * 0.05, R, p)
      assert.ok(distance(p) >= rad + R - 1e-6, `entered from ${k}: ${distance(p)}`)
    }
  }
  // pressed against its side while moving along it: keeps moving
  const p = { x: 0, z: 0 }
  // start beside the side face, in the capsule frame (0, rad + R + 0.01)
  p.x = (rad + R + 0.01) * Math.sin(yaw)
  p.z = (rad + R + 0.01) * Math.cos(yaw)
  const along = { x: Math.cos(yaw), z: -Math.sin(yaw) } // local +X in world
  const into = { x: -Math.sin(yaw), z: -Math.cos(yaw) } // toward the core
  for (let i = 0; i < 20; i++) resolveMovement(p, (along.x + into.x) * 0.03, (along.z + into.z) * 0.03, R, p)
  assert.ok(p.x * along.x + p.z * along.z > 0.5, 'slid along the side')
  off()
})

test('rotated box: result is never closer than the player radius', () => {
  const yaw = 0.6
  const off = registerCollider({ id: 't-rot', position: [2, 0, -1], shape: { type: 'box', halfWidth: 1.5, halfDepth: 0.5, rotation: yaw } })
  const p = { x: 2, z: 3 }
  for (let i = 0; i < 200; i++) {
    resolveMovement(p, 0, -0.05, R, p)
    // distance from the player centre to the box, measured in the box frame
    const ox = p.x - 2
    const oz = p.z + 1
    const lx = ox * Math.cos(yaw) - oz * Math.sin(yaw)
    const lz = ox * Math.sin(yaw) + oz * Math.cos(yaw)
    const qx = Math.max(Math.abs(lx) - 1.5, 0)
    const qz = Math.max(Math.abs(lz) - 0.5, 0)
    assert.ok(Math.hypot(qx, qz) >= R - 1e-6, 'no penetration')
  }
  off()
})

test('disabled colliders are ignored', () => {
  const off = registerCollider({ id: 't-gate', position: [0, 0, 0], shape: { type: 'circle', radius: 1 } })
  setColliderEnabled('t-gate', false)
  const p = walk({ x: 0, z: 3 }, 0, -0.1, 60)
  assert.ok(p.z < -2, 'walked straight through')
  off()
})

test('interaction: nearest wins, exit hysteresis holds, E-style trigger fires once', () => {
  const base = { prompt: 'Interact', interactionRadius: 3 } as const
  const offA = registerInteraction({ ...base, id: 'a', type: 'projects', position: [0, 0, 0] })
  const offB = registerInteraction({ ...base, id: 'b', type: 'education', position: [4, 0, 0] })
  let fired = 0
  const offListen = onInteraction(() => fired++)

  updateInteractions(10, 10)
  assert.equal(getActiveInteraction(), null)
  updateInteractions(1.5, 0) // inside both, closer to a
  assert.equal(getActiveInteraction()?.id, 'a')
  updateInteractions(2.6, 0) // now closer to b
  assert.equal(getActiveInteraction()?.id, 'b')

  offA()
  updateInteractions(7.2, 0) // outside b's radius (3) but inside its exit radius (3.5)
  assert.equal(getActiveInteraction()?.id, 'b')
  updateInteractions(7.6, 0) // beyond the exit radius
  assert.equal(getActiveInteraction(), null)
  assert.equal(interact(), false)

  updateInteractions(4, 0)
  assert.equal(interact(), true)
  assert.equal(fired, 1)

  offListen()
  offB()
})
