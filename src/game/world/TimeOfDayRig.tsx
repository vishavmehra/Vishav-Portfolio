'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  Fog,
  type DirectionalLight,
  type HemisphereLight,
  type Points,
  PointsMaterial,
} from 'three'

import { advanceTimeOfDay, timeOfDay } from './timeOfDay'

/**
 * The world's light rig, driven by the time of day.
 *
 * One hemisphere pair and one key light, exactly as before — this component only
 * animates their values. The interpolation runs here, in the frame loop, and every
 * consumer (fog, clear colour, sky tint, practicals) reads the same live struct.
 *
 * Stars are a single additive Points on the sky dome's radius, invisible by day.
 */
export function TimeOfDayRig() {
  const sun = useRef<DirectionalLight>(null)
  const ambient = useRef<HemisphereLight>(null)
  const stars = useRef<Points>(null)
  const scene = useThree((state) => state.scene)
  const gl = useThree((state) => state.gl)

  const starGeometry = useMemo(() => buildStars(420), [])
  const starMaterial = useMemo(
    () => new PointsMaterial({ size: 0.9, sizeAttenuation: true, color: '#e8eefc', transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending, fog: false }),
    [],
  )
  useEffect(() => {
    return () => {
      starGeometry.dispose()
      starMaterial.dispose()
    }
  }, [starGeometry, starMaterial])

  // Fog is owned here rather than declared on the canvas, so its colour and
  // distances can move with the light without remounting anything.
  useEffect(() => {
    const previous = scene.fog
    scene.fog = new Fog(timeOfDay.haze.getHex(), timeOfDay.fogNear, timeOfDay.fogFar)
    return () => {
      scene.fog = previous
    }
  }, [scene])

  useFrame((_, delta) => {
    advanceTimeOfDay(delta)

    if (sun.current) {
      sun.current.color.copy(timeOfDay.sunColor)
      sun.current.intensity = timeOfDay.sunIntensity
      sun.current.position.set(timeOfDay.sunPosition.x, timeOfDay.sunPosition.y, timeOfDay.sunPosition.z)
    }
    if (ambient.current) {
      ambient.current.color.copy(timeOfDay.skyColor)
      ambient.current.groundColor.copy(timeOfDay.groundColor)
      ambient.current.intensity = timeOfDay.ambientIntensity
    }
    if (scene.fog instanceof Fog) {
      scene.fog.color.copy(timeOfDay.haze)
      scene.fog.near = timeOfDay.fogNear
      scene.fog.far = timeOfDay.fogFar
    }
    gl.setClearColor(timeOfDay.haze)
    if (stars.current) {
      const material = stars.current.material as PointsMaterial
      material.opacity = timeOfDay.starOpacity * 0.85
      stars.current.visible = material.opacity > 0.01
    }
  })

  return (
    <>
      <hemisphereLight ref={ambient} args={['#bcd4e4', '#8a7d4a', 0.95]} />
      <directionalLight
        ref={sun}
        position={[54, 17, 34]}
        intensity={2.25}
        color="#ffcf95"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
        shadow-camera-far={220}
        shadow-bias={-0.0009}
        shadow-normalBias={0.035}
      />
      <points ref={stars} geometry={starGeometry} material={starMaterial} frustumCulled={false} renderOrder={-1} />
    </>
  )
}

/** Points scattered on the upper half of a sphere just inside the sky dome. */
function buildStars(count: number) {
  const positions = new Float32Array(count * 3)
  let seed = 0x9e3779b9
  const rand = () => {
    seed ^= seed << 13
    seed ^= seed >>> 17
    seed ^= seed << 5
    return ((seed >>> 0) % 100000) / 100000
  }
  for (let i = 0; i < count; i++) {
    const theta = rand() * Math.PI * 2
    // Biased toward the upper dome; nothing below the horizon where the terrain is.
    const height = 0.12 + rand() * 0.88
    const radius = Math.sqrt(1 - height * height) * 178
    positions[i * 3] = Math.cos(theta) * radius
    positions[i * 3 + 1] = height * 178
    positions[i * 3 + 2] = Math.sin(theta) * radius - 38
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  return geometry
}
