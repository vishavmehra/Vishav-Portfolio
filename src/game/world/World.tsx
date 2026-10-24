'use client'

import { Suspense, useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  AnimationMixer,
  Color,
  Float32BufferAttribute,
  MeshStandardMaterial,
  SphereGeometry,
  type BufferGeometry,
  type Material,
  type Mesh,
} from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { AssetBoundary } from '@/game/assets/AssetBoundary'
import { useGLTF } from '@/game/assets/gltf'
import { useInstancedGLB } from '@/game/assets/instancing'
import { WORLD } from '@/game/config'
import { BRIDGE, BRIDGE_BASE } from './bridge'
import { timeOfDay } from './timeOfDay'
import { Destinations } from './Destinations'
import { InstancedGroup } from './Instanced'
import { Lamps } from './Lamps'
import { RIVER_STONE_PLACEMENTS, RIVER_STONE_URLS } from './riverStones'
import { Trees } from './Trees'
import { Vegetation } from './Vegetation'
import type { WorldMaterials } from './materials'
import { createWorldMaterials } from './materials'
import { buildTerrain } from './terrainGeometry'
import type { Placement } from './worldGen'

/**
 * The world.
 *
 * Terrain, water, backdrop and the four destinations. Paths are painted into
 * the terrain's vertex colours rather than laid on top as strips, so a trail
 * reads as worn ground instead of a decal.
 */
export function World() {
  const materials = useMemo(() => createWorldMaterials(), [])
  const sky = useRef<Mesh>(null)

  const geometries = useMemo(
    () => ({
      terrain: buildTerrain(WORLD.groundSize, WORLD.groundCenterZ, 132),
      sky: buildSky(),
    }),
    [],
  )

  useEffect(() => {
    const mats = Object.values(materials)
    const geos = Object.values(geometries)
    return () => {
      for (const m of mats) m.dispose()
      for (const g of geos) g.dispose()
    }
  }, [materials, geometries])

  return (
    <group>
      {/* sky dome — unlit, unfogged, drawn behind everything, and carried with the
          camera so no part of it ever falls past the far plane (which left a black
          wedge of missing sky when the player walked out toward the world's edge) */}
      <mesh ref={sky} geometry={geometries.sky} material={materials.sky} renderOrder={-1} frustumCulled={false} />

      <Mountains material={materials.distant} />

      <mesh geometry={geometries.terrain} material={materials.terrain} receiveShadow />

      <River />

      <TimeOfDayMaterials materials={materials} sky={sky} />

      <Bridge materials={materials} />
      {/* Trees block the orbit camera like structures do: it dollies in rather than entering a canopy or trunk. */}
      <group name="occluders">
        <Trees materials={materials} />
      </group>
      <Vegetation materials={materials} />
      {/* Lanterns sit outside the occluder group on purpose: a post is a thin
          thing to dolly the camera in for, and the light has to keep reaching
          the destination behind it. */}
      <Lamps />
      <Destinations materials={materials} />
    </group>
  )
}

/**
 * Ties the unlit materials to the time of day.
 *
 * The sky dome and the distant ring are `MeshBasicMaterial` — no light reaches
 * them, so without this they would stay at noon while the world went dark. Their
 * baked vertex colours are multiplied by a tint, which keeps every painted value
 * relationship and only changes the key. The amber practicals brighten as the
 * light falls, which is the only thing that should read as warm at night (DD-23).
 */
function TimeOfDayMaterials({
  materials,
  sky,
}: {
  materials: ReturnType<typeof createWorldMaterials>
  sky: React.RefObject<Mesh | null>
}) {
  const camera = useThree((state) => state.camera)
  useFrame(() => {
    if (sky.current) sky.current.position.copy(camera.position)
    materials.sky.color.copy(timeOfDay.skyTint)
    materials.distant.color.copy(timeOfDay.distantTint)
    materials.screen.emissiveIntensity = timeOfDay.practicalIntensity
  })
  return null
}

const BRIDGE_URL = '/assets/3d/bridge.glb'

const RIVER_URL = '/assets/3d/river.glb'

const MOUNTAINS_URL = '/assets/3d/mountains.glb'

/**
 * The horizon.
 *
 * Three authored ranges (art/blender/mountains) at 112, 132 and 152 units, each a
 * single continuous ridge rather than a scatter of domes — which is what the old
 * backdrop was, and why it drew bright seams wherever two domes overlapped and
 * fought for the depth buffer.
 *
 * They are drawn with the world's own `distant` material: unlit, vertex-coloured,
 * and tinted by the time of day, so the ranges move from sage morning through to
 * blue night with the sky ring and without a light touching them. The three
 * meshes merge into one geometry here because they never move apart: one draw
 * call for the whole horizon, the same as the domes cost.
 */
function Mountains({ material }: { material: Material }) {
  return (
    <AssetBoundary label="Mountains GLB" fallback={null}>
      <Suspense fallback={null}>
        <MountainRanges material={material} />
      </Suspense>
    </AssetBoundary>
  )
}

function MountainRanges({ material }: { material: Material }) {
  const gltf = useGLTF(MOUNTAINS_URL)

  const geometry = useMemo(() => {
    gltf.scene.updateMatrixWorld(true)
    const parts: BufferGeometry[] = []
    gltf.scene.traverse((object) => {
      const mesh = object as Mesh
      if (mesh.isMesh) parts.push(mesh.geometry.clone().applyMatrix4(mesh.matrixWorld))
    })
    const merged = mergeGeometries(parts)
    for (const part of parts) part.dispose()
    if (!merged) throw new Error('mountains: ranges cannot be merged')
    return merged
  }, [gltf])

  useEffect(() => () => geometry.dispose(), [geometry])

  // Authored about the origin; the played world sits at groundCenterZ, so the ring
  // is dropped onto it here. It surrounds the camera wherever it stands, so its
  // bounds are always in view: culling by them only costs a test that cannot pass.
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[0, 0, WORLD.groundCenterZ]}
      frustumCulled={false}
    />
  )
}

/**
 * The river.
 *
 * One authored asset, built in world space against this world's own stream (see
 * art/blender/river): the water body, and the flow marks that move over it. It is
 * placed exactly as authored — nothing is bent or generated here — which is why it
 * passes under the bridge: the bridge stands on the same centre-line the asset was
 * built along.
 *
 * Its single 24-second clip drives morph-target weights only. The flow marks travel
 * downstream and dissolve in twelve independently phased groups; the water body
 * carries a low swell. Flat shading comes from the material rather than from split
 * vertices, which is what keeps the morph data small enough to ship.
 */
function River() {
  return (
    <AssetBoundary label="River GLB" fallback={null}>
      <Suspense fallback={null}>
        <RiverChannel />
        <RiverStones />
      </Suspense>
    </AssetBoundary>
  )
}

function RiverChannel() {
  const gltf = useGLTF(RIVER_URL)

  // One uniform, read by the frame loop and by the shader — never by React.
  const flow = useMemo(() => ({ uTime: { value: 0 } }), [])

  const scene = useMemo(() => {
    const clone = gltf.scene.clone(true)
    // The clone shares the loader's material; the flow shader is ours, so take a
    // copy of it once and give it to both meshes — one material, one program.
    let water: MeshStandardMaterial | null = null
    clone.traverse((object) => {
      const mesh = object as Mesh
      if (!mesh.isMesh) return
      mesh.receiveShadow = true
      mesh.castShadow = false
      // Water and flow marks span the whole world; culling them by their bounds
      // would only risk popping the river out at the edge of the view.
      mesh.frustumCulled = false
      if (!water) water = makeFlowMaterial(mesh.material as MeshStandardMaterial, flow)
      mesh.material = water
    })
    return clone
  }, [gltf, flow])

  const mixer = useMemo(() => new AnimationMixer(scene), [scene])

  // The clip is started here rather than beside the mixer: an effect that stops
  // every action on cleanup has to be the same effect that starts them, or a
  // remount (React runs effects twice in development) leaves the mixer stopped
  // and the water frozen on the clip's first frame — which is exactly what it
  // looked like.
  useEffect(() => {
    for (const clip of gltf.animations) mixer.clipAction(clip).reset().play()
    return () => {
      mixer.stopAllAction()
    }
  }, [mixer, gltf])

  useFrame((_, delta) => {
    mixer.update(delta)
    // Wraps at the shortest common period of the two bands, so the surface never
    // jumps and the float never grows large enough to lose precision.
    flow.uTime.value = (flow.uTime.value + delta) % FLOW_PERIOD
  })

  return <primitive object={scene} />
}

/**
 * How the water moves.
 *
 * The asset already carries a morph clip — the flow marks travel downstream and
 * dissolve — but morphs alone move the *marks*, not the surface between them, and
 * from a standing player's distance that read as a still river.
 *
 * So the surface itself flows, in the shader: two sine bands of different
 * wavelength and speed, running along the channel, brightening and darkening the
 * water they pass over. The phase is world position projected onto the stream's
 * own direction — the centre-line runs from (-52, -22) to (52, -7) and drops
 * 0.42 units over that run, so downstream is +X with a slight southward lean —
 * which means every part of the river flows the same way at the same speed
 * without needing the geometry to know where it is.
 *
 * Nothing is added to the scene: no second mesh, no texture, no post effect. One
 * uniform, two sines, and both bands loop seamlessly.
 */
const FLOW_DIRECTION = [0.985, 0.17] as const
const FLOW_PERIOD = 2 * Math.PI / 0.24

function makeFlowMaterial(source: MeshStandardMaterial, flow: { uTime: { value: number } }) {
  const material = source.clone()
  material.flatShading = true
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = flow.uTime
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
        varying vec3 vFlowWorld;`)
      // after every deformation, including the morph targets the clip drives
      .replace(
        '#include <project_vertex>',
        `vFlowWorld = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;
        #include <project_vertex>`,
      )
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform float uTime;
        varying vec3 vFlowWorld;`)
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        float flowCoord = vFlowWorld.x * ${FLOW_DIRECTION[0]} + vFlowWorld.z * ${FLOW_DIRECTION[1]};
        float fast = sin( flowCoord * 0.85 - uTime * 1.35 );
        float slow = sin( flowCoord * 0.24 - uTime * 0.62 + vFlowWorld.z * 0.4 );
        // cross-channel break-up, so the bands are never straight across the water
        float across = sin( vFlowWorld.z * 2.4 + flowCoord * 0.12 + uTime * 0.5 );
        float ripple = fast * 0.55 + slow * 0.45;
        diffuseColor.rgb *= 1.0 + ripple * ( 0.16 + 0.05 * across );`,
      )
  }
  // Every river mesh shares this one program.
  material.customProgramCacheKey = () => 'river-flow'
  // so a test can read the clock the water is running on
  material.userData.flowUniform = flow.uTime
  material.needsUpdate = true
  return material
}

/**
 * The stones in and beside the water: four authored shapes on the stone palette,
 * one instanced draw call each. They load beside the channel rather than inside
 * it so a stone failure cannot take the river down with it.
 */
function RiverStones() {
  return (
    <AssetBoundary label="River stone GLBs" fallback={null}>
      <Suspense fallback={null}>
        {RIVER_STONE_URLS.map((url, v) => (
          <RiverStone key={url} url={url} placements={RIVER_STONE_PLACEMENTS[v]} />
        ))}
      </Suspense>
    </AssetBoundary>
  )
}

function RiverStone({ url, placements }: { url: string; placements: Placement[] }) {
  const { geometry, material } = useInstancedGLB(url)
  return <InstancedGroup geometry={geometry} material={material} placements={placements} castShadow receiveShadow />
}

/**
 * The crossing where the trunk path meets the stream.
 *
 * The authored bridge stands at the stream-bed centre — its own origin — so the
 * placement is the terrain height there, with no yaw: the stream runs along X at
 * this point and the asset spans its own Z. `bridge.ts` derives the walk surface
 * from the same asset, so what the player stands on is what is drawn.
 */
function Bridge({ materials: m }: { materials: ReturnType<typeof createWorldMaterials> }) {
  const fallback = <PlankBridge materials={m} />
  return (
    <group position={[BRIDGE.x, BRIDGE_BASE, BRIDGE.z]} rotation={[0, BRIDGE.rotation, 0]}>
      <AssetBoundary label="Bridge GLB" fallback={fallback}>
        <Suspense fallback={fallback}>
          <BridgeGlb />
        </Suspense>
      </AssetBoundary>
    </group>
  )
}

function BridgeGlb() {
  const { geometry, material } = useInstancedGLB(BRIDGE_URL)
  return <mesh geometry={geometry} material={material} castShadow receiveShadow />
}

/** Procedural stand-in, held at the deck height the GLB would occupy. */
function PlankBridge({ materials: m }: { materials: ReturnType<typeof createWorldMaterials> }) {
  return (
    <group position={[0, BRIDGE.crown, 0]}>
      {[-1.6, -0.8, 0, 0.8, 1.6].map((dz, i) => (
        <mesh key={i} position={[0, 0, dz]} rotation={[0, (i % 2 ? 1 : -1) * 0.012, 0]} material={m.propTimber} castShadow receiveShadow>
          <boxGeometry args={[2.6, 0.11, 0.72]} />
        </mesh>
      ))}
      {[-1.15, 1.15].map((dx, i) => (
        <mesh key={i} position={[dx, -0.16, 0]} material={m.propTimber} castShadow>
          <boxGeometry args={[0.22, 0.24, 4.3]} />
        </mesh>
      ))}
      {[[-1.2, -1.9], [1.2, -1.9], [-1.2, 1.9], [1.2, 1.9]].map(([dx, dz], i) => (
        <mesh key={i} position={[dx, -0.55, dz]} material={m.propTimber} castShadow>
          <cylinderGeometry args={[0.13, 0.15, 0.9, 6]} />
        </mesh>
      ))}
    </group>
  )
}

/** Vertical gradient sky: warm at the horizon, cool overhead. */
function buildSky() {
  const geometry = new SphereGeometry(150, 24, 16).toNonIndexed()
  geometry.deleteAttribute('uv')
  geometry.deleteAttribute('normal')
  const pos = geometry.attributes.position
  const colors = new Float32Array(pos.count * 3)
  const horizon = new Color('#f2e2c6')
  const mid = new Color('#cfdfe0')
  const zenith = new Color('#a8c2d4')
  const c = new Color()
  for (let i = 0; i < pos.count; i++) {
    const t = Math.max(0, Math.min(1, (pos.getY(i) / 150) * 0.5 + 0.5))
    if (t < 0.52) c.copy(horizon).lerp(mid, Math.min(1, t / 0.52))
    else c.copy(mid).lerp(zenith, (t - 0.52) / 0.48)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
  return geometry
}
