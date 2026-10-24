'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AnimationClip, AnimationMixer, MathUtils, type Mesh, type Object3D } from 'three'
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js'

import { useGLTF } from '@/game/assets/gltf'
import { playerPosition } from './playerState'

const EXPLORER_UNIT_7B_URL = '/assets/3d/explorer-unit-7b.glb'

/** Ground speed the in-place Walk cycle was authored at: 0.5 stride per 0.8 s cycle. */
const WALK_NATIVE_SPEED = 0.625
/**
 * Playback-rate ceiling. PLAYER.walkSpeed is 6.4x the authored gait, and matching
 * it would be a frantic scurry, so at full speed the feet slide until walkSpeed is
 * revisited (DD-20). Movement slower than WALK_NATIVE_SPEED * WALK_MAX_RATE is
 * foot-locked.
 */
const WALK_MAX_RATE = 1.5
const WALK_MIN_RATE = 0.6
/** Speed hysteresis (units/s) so the blend cannot chatter at a standstill. */
const WALK_ENTER_SPEED = 0.3
const WALK_EXIT_SPEED = 0.15
/** Idle/Walk crossfade: settles in roughly a quarter of a second. */
const BLEND_RATE = 12
/** Frame-to-frame position deltas are noisy; this smooths the measured speed. */
const SPEED_SMOOTHING = 14
/** A jump faster than this is a spawn or teleport, not walking. */
const TELEPORT_SPEED = 20
const MAX_DELTA = 0.1

/**
 * Explorer Unit 7-B, the production GLB. Purely visual, like the proxy it replaces:
 * PlayerController still owns position, velocity, bounds and facing, and the
 * collision footprint stays PLAYER.radius.
 *
 * The model is authored facing -Z and exactly 1.4 units tall, so it is used
 * unrotated and unscaled.
 *
 * Idle and Walk are blended from the speed the character actually travels, measured
 * from playerPosition rather than from input, so pushing against a world edge
 * settles into Idle instead of walking on the spot.
 */
export function PlayerModel() {
  const gltf = useGLTF(EXPLORER_UNIT_7B_URL)

  // Skeleton-aware clone keeps the cached GLB pristine and gives each mount its own bones.
  const model = useMemo(() => {
    const root = cloneSkinned(gltf.scene)
    root.traverse((object: Object3D) => {
      if ((object as Mesh).isMesh) {
        object.castShadow = true
        // The sun's shadow map spans ±70 units; at that texel size self-shadowing
        // on a 1.4-unit character reads as acne, not detail.
        object.receiveShadow = false
      }
    })
    return root
  }, [gltf])

  const rig = useMemo(() => {
    const idleClip = AnimationClip.findByName(gltf.animations, 'EU7B_Idle')
    const walkClip = AnimationClip.findByName(gltf.animations, 'EU7B_Walk')
    if (!idleClip || !walkClip) {
      // Thrown during render so AssetBoundary falls back to the proxy.
      throw new Error(`${EXPLORER_UNIT_7B_URL} is missing EU7B_Idle or EU7B_Walk`)
    }
    const mixer = new AnimationMixer(model)
    return { mixer, idle: mixer.clipAction(idleClip), walk: mixer.clipAction(walkClip) }
  }, [gltf, model])

  useEffect(() => {
    const { mixer, idle, walk } = rig
    idle.setEffectiveWeight(1).play()
    walk.setEffectiveWeight(0).play()
    return () => {
      mixer.stopAllAction()
    }
  }, [rig])

  const motion = useRef({ x: 0, z: 0, primed: false, speed: 0, weight: 0, walking: false })

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, MAX_DELTA)
    if (delta <= 0) return
    const m = motion.current
    const { mixer, idle, walk } = rig

    if (!m.primed) {
      m.x = playerPosition.x
      m.z = playerPosition.z
      m.primed = true
    }
    const dx = playerPosition.x - m.x
    const dz = playerPosition.z - m.z
    m.x = playerPosition.x
    m.z = playerPosition.z

    const instant = Math.sqrt(dx * dx + dz * dz) / delta
    if (instant < TELEPORT_SPEED) {
      m.speed += (instant - m.speed) * (1 - Math.exp(-SPEED_SMOOTHING * delta))
    }

    if (m.walking ? m.speed < WALK_EXIT_SPEED : m.speed > WALK_ENTER_SPEED) {
      m.walking = !m.walking
      // Start a fresh stride from its contact pose rather than wherever it last stopped.
      if (m.walking && m.weight < 0.05) walk.time = 0
    }

    m.weight += ((m.walking ? 1 : 0) - m.weight) * (1 - Math.exp(-BLEND_RATE * delta))
    walk.setEffectiveWeight(m.weight)
    idle.setEffectiveWeight(1 - m.weight)
    walk.timeScale = MathUtils.clamp(m.speed / WALK_NATIVE_SPEED, WALK_MIN_RATE, WALK_MAX_RATE)

    mixer.update(delta)
  })

  return <primitive object={model} />
}
