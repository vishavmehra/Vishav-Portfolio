'use client'

import { Suspense, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3, type Group } from 'three'

import { AssetBoundary } from '@/game/assets/AssetBoundary'
import { cameraView } from '@/game/camera/cameraState'
import { PLAYER, WORLD, WORLD_BOUNDS } from '@/game/config'
import { attachKeyboardInput, consumeJump, movementInput } from '@/input/movementInput'
import { playerMotion } from './playerState'
import { resolveMovement } from '@/game/world/collision/CollisionSystem'
import { groundHeightAt } from '@/game/world/bridge'
import { Player } from './Player'
import { PlayerModel } from './PlayerModel'
import { playerPosition } from './playerState'

// Reused every frame — allocating inside the loop is forbidden (CLAUDE.md §30).
const targetVelocity = new Vector3()
const resolved = { x: 0, z: 0 }

/** Largest frame step we integrate, so returning to a backgrounded tab cannot teleport the player. */
const MAX_DELTA = 0.1
/**
 * Fastest the player may rise and fall, in units per second. Terrain and the bridge
 * ramp ask for ~2.5 m/s at walking pace, so neither limit is felt in play; they exist
 * so that a step in the ground function can only ever become a short ramp.
 */
const MAX_GROUND_CLIMB = 6
const MAX_GROUND_DROP = 9

/**
 * Owns the player's transform. Reads the shared movement input, integrates
 * velocity, keeps the player on the ground disc, and turns the character toward
 * its direction of travel — all imperatively in the frame loop. Nothing here
 * touches React state.
 */
export function PlayerController() {
  const groupRef = useRef<Group>(null)
  const velocity = useRef(new Vector3())

  useEffect(() => attachKeyboardInput(), [])

  useFrame((_, rawDelta) => {
    const group = groupRef.current
    if (!group) return

    const delta = Math.min(rawDelta, MAX_DELTA)

    // Input is camera-relative (DD-28): forward is the camera's view direction
    // flattened onto the ground, right is that rotated a quarter turn. Built from
    // yaw alone, so pitch never tilts or slows ground movement, and a rotation
    // keeps the input's magnitude — walkSpeed is unchanged.
    const cameraSin = Math.sin(cameraView.yaw)
    const cameraCos = Math.cos(cameraView.yaw)
    const forward = movementInput.y
    const strafe = movementInput.x
    const dirX = strafe * cameraCos - forward * cameraSin
    const dirZ = -strafe * cameraSin - forward * cameraCos

    const isMoving = dirX !== 0 || dirZ !== 0
    targetVelocity.set(dirX, 0, dirZ).multiplyScalar(PLAYER.walkSpeed * movementInput.speedScale)

    // Frame-rate independent exponential approach toward the target velocity.
    const damping = isMoving ? PLAYER.accelDamping : PLAYER.decelDamping
    velocity.current.lerp(targetVelocity, 1 - Math.exp(-damping * delta))

    // Desired step, resolved against world colliders: the player slides along
    // anything solid instead of passing through it (CollisionSystem).
    resolveMovement(group.position, velocity.current.x * delta, velocity.current.z * delta, PLAYER.radius, resolved)
    group.position.x = resolved.x
    group.position.z = resolved.z

    // World bounds: the playable area is a rectangle (M4A). Clamping each axis
    // independently means the player slides along an edge rather than sticking.
    if (group.position.x < WORLD_BOUNDS.minX) group.position.x = WORLD_BOUNDS.minX
    else if (group.position.x > WORLD_BOUNDS.maxX) group.position.x = WORLD_BOUNDS.maxX
    if (group.position.z < WORLD_BOUNDS.minZ) group.position.z = WORLD_BOUNDS.minZ
    else if (group.position.z > WORLD_BOUNDS.maxZ) group.position.z = WORLD_BOUNDS.maxZ

    // --- vertical: ground following, or a ballistic arc while airborne ---------
    //
    // The same ground function serves both. Nothing here bypasses it, so a jump
    // that lands on the bridge deck lands on the deck, not through it.
    const ground = groundHeightAt(group.position.x, group.position.z)
    const motion = playerMotion

    if (motion.grounded && consumeJump()) {
      motion.verticalVelocity = PLAYER.jumpVelocity
      motion.grounded = false
    }

    if (motion.grounded) {
      // Eased rather than snapped so small bumps do not jolt the camera, which
      // reads this position every frame.
      //
      // Climbing is also rate-limited. Terrain and the bridge ramp never ask for more
      // than ~4 m/s of rise at walking speed, so the limit is invisible in play; what
      // it guarantees is that a discontinuity in the ground function — a deck edge, a
      // future prop, a teleport — can only ever become a short ramp, never a jump.
      const eased = group.position.y + (ground - group.position.y) * (1 - Math.exp(-18 * delta))
      const ceiling = group.position.y + MAX_GROUND_CLIMB * delta
      const floor = group.position.y - MAX_GROUND_DROP * delta
      group.position.y = eased > ceiling ? ceiling : eased < floor ? floor : eased
      // Walking off a ledge starts a fall rather than gluing the player to the slope.
      if (group.position.y - ground > PLAYER.groundedEpsilon) {
        motion.grounded = false
        motion.verticalVelocity = 0
      }
    } else {
      motion.verticalVelocity -= PLAYER.gravity * delta
      group.position.y += motion.verticalVelocity * delta
      if (group.position.y <= ground) {
        group.position.y = ground
        motion.verticalVelocity = 0
        motion.grounded = true
      }
    }

    motion.speed = Math.hypot(velocity.current.x, velocity.current.z)
    motion.sprinting = motion.speed > PLAYER.walkSpeed * 1.15

    // Face the direction of travel. Modelled facing -Z, so the target yaw is
    // measured from the negated direction vector.
    if (isMoving) {
      const targetYaw = Math.atan2(-dirX, -dirZ)
      let difference = targetYaw - group.rotation.y
      // Wrap to [-PI, PI] so the character always turns the short way around.
      difference = Math.atan2(Math.sin(difference), Math.cos(difference))
      group.rotation.y += difference * (1 - Math.exp(-PLAYER.turnDamping * delta))
    }

    playerPosition.copy(group.position)
  })

  return (
    <group ref={groupRef} position={[WORLD.spawnX, 0, WORLD.spawnZ]}>
      {/* The procedural proxy stands in while the GLB loads, and stays if it fails. */}
      <AssetBoundary label="Explorer Unit 7-B GLB" fallback={<Player />}>
        <Suspense fallback={<Player />}>
          <PlayerModel />
        </Suspense>
      </AssetBoundary>
    </group>
  )
}
