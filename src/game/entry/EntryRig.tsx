'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  AdditiveBlending,
  BufferGeometry,
  DataTexture,
  Float32BufferAttribute,
  MathUtils,
  Matrix4,
  Quaternion,
  RGBAFormat,
  SRGBColorSpace,
  Vector3,
  type PerspectiveCamera,
  type Points,
  type PointsMaterial,
} from 'three'

import { getLoadingSnapshot, subscribeLoading } from '@/game/loading/loadingState'

/**
 * The entry shot.
 *
 * Standing back down the trunk path, south of the bridge, looking north along it:
 * the crossing in the midground, the meadow and its trees beyond, the ranges on
 * the horizon. Chosen so the world reads as depth rather than as a backdrop, and
 * so the path itself points at the way in.
 */
const SHOT = {
  /** Where the camera starts while assets are still arriving. */
  from: new Vector3(2.9, 3.35, 19.5),
  /** Where the slow approach settles, and where the entry pose rests. */
  to: new Vector3(2.1, 2.85, 13.2),
  /** Aimed a little above the path, so the horizon sits high and the title has room below it. */
  lookAt: new Vector3(-0.4, 2.5, -14),
  /** Tighter than gameplay: a title shot, not a following shot. */
  fov: 41,
  /** Seconds the approach takes. Real loading usually outlasts it; it holds when it arrives. */
  approach: 14,
}

/** How far the pointer may push the shot, in world units. The title barely moves; this does. */
const PARALLAX = { x: 0.85, y: 0.5, damping: 2.6 }

/** Seconds the hand-over to the gameplay camera takes once the visitor enters. */
const HANDOVER = 1.7

/** Motes: enough to read as air, few enough to cost nothing. */
const MOTE_COUNT = 190
const MOTE_FIELD = { radius: 16, height: 9, drift: 0.34 }

const scratchPosition = new Vector3()
const scratchQuaternion = new Quaternion()
const scratchTarget = new Vector3()
const entryQuaternion = new Quaternion()
const lookMatrix = new Matrix4()
const UP = new Vector3(0, 1, 0)

/**
 * The entry camera and its air.
 *
 * While the world loads and waits, this owns the camera: an authored shot of the
 * real world, drifting slowly forward, with a damped pointer parallax under it.
 * When the visitor enters, it blends from that shot into whatever pose the
 * gameplay camera has computed for this frame and then lets go — so there is no
 * cut, no flash, and no second scene to load.
 *
 * It is mounted after `FollowCamera` on purpose. That camera runs first and leaves
 * the gameplay pose on the camera; this one reads that pose as its blend target,
 * which is why the hand-over needs no changes to the gameplay rig at all.
 */
export function EntryRig() {
  const camera = useThree((state) => state.camera) as PerspectiveCamera
  const motes = useRef<Points>(null)

  const rig = useRef({
    phase: getLoadingSnapshot().phase,
    /** Seconds since the shot began. */
    elapsed: 0,
    /** 1 while the entry camera owns the shot, easing to 0 across the hand-over. */
    hold: 1,
    pointer: { x: 0, y: 0, targetX: 0, targetY: 0 },
    gameplayFov: 0,
    done: false,
  })

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  useEffect(() => {
    const sync = () => {
      rig.current.phase = getLoadingSnapshot().phase
    }
    sync()
    return subscribeLoading(sync)
  }, [])

  // Pointer parallax, desktop only: a coarse pointer gets the drift instead.
  useEffect(() => {
    if (reducedMotion || window.matchMedia('(pointer: coarse)').matches) return
    const onMove = (event: PointerEvent) => {
      const p = rig.current.pointer
      p.targetX = (event.clientX / window.innerWidth) * 2 - 1
      p.targetY = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reducedMotion])

  const moteGeometry = useMemo(() => buildMotes(), [])
  const moteTexture = useMemo(() => radialTexture(), [])
  useEffect(() => {
    return () => {
      moteGeometry.dispose()
      moteTexture.dispose()
    }
  }, [moteGeometry, moteTexture])

  useFrame((_, delta) => {
    const r = rig.current
    if (r.done) return

    const entering = r.phase === 'loading' || r.phase === 'landing'
    r.elapsed += delta

    // The gameplay camera has already written this frame's pose; keep it as the
    // thing to blend toward, and its fov with it.
    scratchPosition.copy(camera.position)
    scratchQuaternion.copy(camera.quaternion)
    if (r.gameplayFov === 0) r.gameplayFov = camera.fov

    if (entering) {
      r.hold = 1
    } else {
      // Ease out rather than run down linearly: the last third of the move is the
      // part a visitor reads as arriving.
      r.hold = Math.max(0, r.hold - delta / HANDOVER)
      if (r.hold <= 0.0001) {
        camera.fov = r.gameplayFov
        camera.updateProjectionMatrix()
        r.done = true
        if (motes.current) motes.current.visible = false
        return
      }
    }

    // --- the shot ----------------------------------------------------------
    const approach = reducedMotion ? 1 : MathUtils.clamp(r.elapsed / SHOT.approach, 0, 1)
    scratchTarget.copy(SHOT.from).lerp(SHOT.to, smooth(approach))

    const p = r.pointer
    const k = 1 - Math.exp(-PARALLAX.damping * Math.min(delta, 0.1))
    p.x += (p.targetX - p.x) * k
    p.y += (p.targetY - p.y) * k
    // The world moves against the pointer, which is what reads as depth.
    scratchTarget.x -= p.x * PARALLAX.x
    scratchTarget.y += p.y * PARALLAX.y

    if (!reducedMotion) {
      // A slow breath, so a held frame is never quite still.
      scratchTarget.y += Math.sin(r.elapsed * 0.25) * 0.06
    }

    const blend = ease(r.hold)
    camera.position.lerpVectors(scratchPosition, scratchTarget, blend)

    // Aim: build the entry orientation, then slerp back toward gameplay's.
    camera.quaternion.copy(scratchQuaternion).slerp(aimAt(scratchTarget, SHOT.lookAt), blend)

    camera.fov = MathUtils.lerp(r.gameplayFov, SHOT.fov, blend)
    camera.updateProjectionMatrix()

    // --- the air -----------------------------------------------------------
    const mote = motes.current
    if (mote) {
      const material = mote.material as PointsMaterial
      // Motes belong to the entry, and they fade out with it.
      material.opacity = 0.5 * blend
      mote.visible = material.opacity > 0.01
      mote.position.set(camera.position.x, camera.position.y - 2.4, camera.position.z)
      if (!reducedMotion) {
        const attribute = mote.geometry.attributes.position as Float32BufferAttribute
        const array = attribute.array as Float32Array
        for (let i = 1; i < array.length; i += 3) {
          array[i] += delta * MOTE_FIELD.drift * (0.35 + ((i * 37) % 100) / 100)
          if (array[i] > MOTE_FIELD.height) array[i] -= MOTE_FIELD.height * 2
        }
        attribute.needsUpdate = true
      }
    }
  })

  return (
    <points ref={motes} geometry={moteGeometry} frustumCulled={false} renderOrder={2}>
      <pointsMaterial
        map={moteTexture}
        color="#d9e4c6"
        size={0.085}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        blending={AdditiveBlending}
        fog={false}
      />
    </points>
  )
}

/** Smoothstep, for the approach. */
function smooth(t: number) {
  return t * t * (3 - 2 * t)
}

/** Hand-over easing: holds the shot, then releases it quickly at the end. */
function ease(t: number) {
  return t * t * (3 - 2 * t)
}

/** The orientation a camera at `from` would have looking at `to`. Allocation-free. */
function aimAt(from: Vector3, to: Vector3) {
  lookMatrix.lookAt(from, to, UP)
  return entryQuaternion.setFromRotationMatrix(lookMatrix)
}

/** Motes in a cylinder around the shot, denser low down where the light is. */
function buildMotes() {
  const positions = new Float32Array(MOTE_COUNT * 3)
  let seed = 0x2f6e2b1
  const rand = () => {
    seed ^= seed << 13
    seed ^= seed >>> 17
    seed ^= seed << 5
    return ((seed >>> 0) % 100000) / 100000
  }
  for (let i = 0; i < MOTE_COUNT; i++) {
    const angle = rand() * Math.PI * 2
    const radius = Math.sqrt(rand()) * MOTE_FIELD.radius
    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = (rand() * 2 - 1) * MOTE_FIELD.height
    positions[i * 3 + 2] = Math.sin(angle) * radius
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  return geometry
}

/** A soft round falloff, built in code so the entry needs no extra request. */
function radialTexture(size = 32) {
  const data = new Uint8Array(size * size * 4)
  const centre = (size - 1) / 2
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - centre, y - centre) / centre
      const alpha = Math.max(0, 1 - d) ** 3
      const o = (y * size + x) * 4
      data[o] = 255
      data[o + 1] = 255
      data[o + 2] = 255
      data[o + 3] = Math.round(alpha * 255)
    }
  }
  const texture = new DataTexture(data, size, size, RGBAFormat)
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true
  return texture
}
