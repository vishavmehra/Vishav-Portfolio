'use client'

import { Suspense, useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  DataTexture,
  Float32BufferAttribute,
  Matrix4,
  MeshLambertMaterial,
  PointsMaterial,
  RGBAFormat,
  SRGBColorSpace,
  type PointLight,
} from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { AssetBoundary } from '@/game/assets/AssetBoundary'
import { useInstancedGLB } from '@/game/assets/instancing'
import { InstancedGroup } from './Instanced'
import { TrailSigns } from './TrailSigns'
import { LAMP_PLACEMENTS, LANTERN_POINTS, lampNightFactor } from './lampPosts'
import { timeOfDay } from './timeOfDay'

const LAMP_URL = '/assets/3d/lamp-post.glb'

/** Local light: how many lanterns may be lit at once, and how far their pool reaches. */
const ACTIVE_LIGHTS = 3
const LIGHT_RANGE = 13
const LIGHT_INTENSITY = 34
/** Emissive strength of the flame itself, day and night. */
const FLAME_EMISSIVE = { day: 0.4, night: 2.8 }
/** Beyond this the pool is doing nothing a visitor can see, so it is faded out. */
const LIGHT_FADE_START = 20
const LIGHT_FADE_END = 32

/**
 * Night wayfinding.
 *
 * Eight authored lanterns: one per destination, and four more flanking the two
 * ends of the bridge, which is the darkest ground in the world at night (see
 * lampPosts.ts for where each stands and why). Four parts, each with a job:
 *
 * - the posts, one instanced draw call for all four;
 * - the flame, amber and emissive, brightening and dimming on the same time-of-day
 *   curve as the world's other practicals;
 * - a small halo held at a constant few pixels on screen, which is what stays
 *   readable when the lantern itself is a couple of pixels across;
 * - and the trail signs beside them, which say which destination this is.
 *
 * Local light is pooled: however many lanterns exist, only the three nearest the
 * camera carry a point light — enough that both lamps at a bridge end light the
 * crossing together — and the lights are never added or removed. They move and
 * fade instead, because changing a scene's light count recompiles every shader
 * in it.
 */
export function Lamps() {
  return (
    <>
      <AssetBoundary label="Lamp post GLB" fallback={null}>
        <Suspense fallback={null}>
          <LampPosts />
        </Suspense>
      </AssetBoundary>
      <LanternGlow />
      <LanternHalos />
      <LanternLights />
      <TrailSigns />
    </>
  )
}

function LampPosts() {
  const { geometry, material } = useInstancedGLB(LAMP_URL)
  return <InstancedGroup geometry={geometry} material={material} placements={LAMP_PLACEMENTS} castShadow receiveShadow />
}

/**
 * The flame inside each cage: one merged geometry with its own amber material.
 *
 * It is not the shared `screen` practical, because a lantern has to out-burn a
 * lit window — this one runs several times hotter at night — and pushing the
 * shared material that far would have taken the shack window and the cabin lamp
 * with it. The colour is the same amber, so the language is unchanged (DD-23).
 */
function LanternGlow() {
  const material = useMemo(
    () => new MeshLambertMaterial({ color: '#c47a22', emissive: '#ff9526', emissiveIntensity: FLAME_EMISSIVE.day }),
    [],
  )

  const geometry = useMemo(() => {
    const parts = LANTERN_POINTS.map((point, i) => {
      const box = new BoxGeometry(0.15 * point.scale, 0.23 * point.scale, 0.15 * point.scale)
      box.applyMatrix4(new Matrix4().makeRotationY(LAMP_PLACEMENTS[i].rotation))
      box.translate(point.x, point.y, point.z)
      return box
    })
    const merged = mergeGeometries(parts)
    for (const part of parts) part.dispose()
    return merged as BufferGeometry
  }, [])

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  useFrame(() => {
    const night = lampNightFactor(timeOfDay.practicalIntensity)
    material.emissiveIntensity = FLAME_EMISSIVE.day + (FLAME_EMISSIVE.night - FLAME_EMISSIVE.day) * night
  })

  return <mesh geometry={geometry} material={material} />
}

/**
 * The distance cue.
 *
 * Points with size attenuation off, so each halo holds the same few pixels at
 * 60 m as at 6 m: close up the lantern itself carries the read and the halo is
 * just its hot core; far away the halo is all that is left of it, and that is
 * the point. It is deliberately small — a warm speck in the dark, not an orb.
 */
function LanternHalos() {
  const dpr = useThree((state) => state.viewport.dpr)
  const material = useRef<PointsMaterial>(null)

  const geometry = useMemo(() => {
    const positions: number[] = []
    for (const point of LANTERN_POINTS) positions.push(point.x, point.y, point.z)
    const g = new BufferGeometry()
    g.setAttribute('position', new Float32BufferAttribute(positions, 3))
    return g
  }, [])

  const texture = useMemo(() => radialTexture(), [])

  useEffect(() => {
    return () => {
      geometry.dispose()
      texture.dispose()
    }
  }, [geometry, texture])

  useFrame(() => {
    const m = material.current
    if (!m) return
    m.opacity = lampNightFactor(timeOfDay.practicalIntensity) * 0.95
    m.visible = m.opacity > 0.01
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        ref={material}
        map={texture}
        color="#ffbe72"
        size={16 * dpr}
        sizeAttenuation={false}
        transparent
        opacity={0}
        depthWrite={false}
        blending={AdditiveBlending}
        fog={false}
      />
    </points>
  )
}

/**
 * Two point lights that follow whichever lanterns the camera is nearest, so the
 * ground under a lantern is lit without the world carrying four dynamic lights.
 * Intensity is the night factor, faded down again once the visitor is too far
 * away for the pool to read.
 */
function LanternLights() {
  const camera = useThree((state) => state.camera)
  const lights = useRef<(PointLight | null)[]>([])
  const order = useMemo(() => LANTERN_POINTS.map((_, i) => i), [])

  useFrame(() => {
    const night = lampNightFactor(timeOfDay.practicalIntensity)
    // nearest-first, on four elements — an insertion sort of distances, no allocation
    order.sort((a, b) => distanceTo(camera.position, a) - distanceTo(camera.position, b))

    for (let slot = 0; slot < ACTIVE_LIGHTS; slot++) {
      const light = lights.current[slot]
      if (!light) continue
      const point = LANTERN_POINTS[order[slot]]
      if (!point || night <= 0.001) {
        light.intensity = 0
        continue
      }
      light.position.set(point.x, point.y, point.z)
      light.distance = LIGHT_RANGE * point.scale
      const d = Math.sqrt(distanceTo(camera.position, order[slot]))
      const fade = 1 - Math.min(1, Math.max(0, (d - LIGHT_FADE_START) / (LIGHT_FADE_END - LIGHT_FADE_START)))
      light.intensity = night * fade * LIGHT_INTENSITY * point.scale
    }
  })

  return (
    <>
      {Array.from({ length: ACTIVE_LIGHTS }, (_, i) => (
        <pointLight
          key={i}
          ref={(node) => {
            lights.current[i] = node
          }}
          color="#ffb46a"
          intensity={0}
          distance={LIGHT_RANGE}
          decay={2}
        />
      ))}
    </>
  )
}

/** Squared distance from a camera position to a lantern. */
function distanceTo(position: { x: number; y: number; z: number }, index: number) {
  const point = LANTERN_POINTS[index]
  const dx = position.x - point.x
  const dy = position.y - point.y
  const dz = position.z - point.z
  return dx * dx + dy * dy + dz * dz
}

/** A soft round falloff, built in code so the halo needs no image request. */
function radialTexture(size = 32) {
  const data = new Uint8Array(size * size * 4)
  const centre = (size - 1) / 2
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - centre, y - centre) / centre
      const falloff = Math.max(0, 1 - d)
      const alpha = falloff * falloff * falloff
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
