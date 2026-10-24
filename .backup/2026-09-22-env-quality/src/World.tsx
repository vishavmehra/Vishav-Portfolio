'use client'

import { Suspense, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, Float32BufferAttribute, IcosahedronGeometry, SphereGeometry, type BufferGeometry } from 'three'

import { AssetBoundary } from '@/game/assets/AssetBoundary'
import { useInstancedGLB } from '@/game/assets/instancing'
import { WORLD } from '@/game/config'
import { BRIDGE, BRIDGE_BASE } from './bridge'
import { timeOfDay } from './timeOfDay'
import { Destinations } from './Destinations'
import { InstancedGroup } from './Instanced'
import { bendRiverToStream } from './river'
import { RIVER_STONE_PLACEMENTS, RIVER_STONE_URLS } from './riverStones'
import { Trees } from './Trees'
import { Vegetation } from './Vegetation'
import type { WorldMaterials } from './materials'
import { createWorldMaterials } from './materials'
import { buildRibbon, buildTerrain } from './terrainGeometry'
import { STREAM, STREAM_WIDTH, WORLD_SEED } from './worldConfig'
import { makeRandom, streamSurfaceAt, type Placement } from './worldGen'

/**
 * The world.
 *
 * Terrain, water, backdrop and the four destinations. Paths are painted into
 * the terrain's vertex colours rather than laid on top as strips, so a trail
 * reads as worn ground instead of a decal.
 */
export function World() {
  const materials = useMemo(() => createWorldMaterials(), [])

  const geometries = useMemo(
    () => ({
      terrain: buildTerrain(WORLD.groundSize, WORLD.groundCenterZ, 132),
      water: buildRibbon(STREAM, STREAM_WIDTH, streamSurfaceAt, '#2f6a6b', '#6fa8a2'),
      sky: buildSky(),
      hills: buildHills(),
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
      {/* sky dome â€” unlit, unfogged, drawn behind everything */}
      <mesh geometry={geometries.sky} material={materials.sky} renderOrder={-1} frustumCulled={false} />

      <mesh geometry={geometries.hills} material={materials.distant} position={[0, -1.5, -30]} />

      <mesh geometry={geometries.terrain} material={materials.terrain} receiveShadow />

      <River geometry={geometries.water} materials={materials} />

      <TimeOfDayMaterials materials={materials} />

      <Bridge materials={materials} />
      {/* Trees block the orbit camera like structures do: it dollies in rather than entering a canopy or trunk. */}
      <group name="occluders">
        <Trees materials={materials} />
      </group>
      <Vegetation materials={materials} />
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
function TimeOfDayMaterials({ materials }: { materials: ReturnType<typeof createWorldMaterials> }) {
  useFrame(() => {
    materials.sky.color.copy(timeOfDay.skyTint)
    materials.distant.color.copy(timeOfDay.distantTint)
    materials.water.color.copy(timeOfDay.distantTint)
    materials.screen.emissiveIntensity = timeOfDay.practicalIntensity
  })
  return null
}

const BRIDGE_URL = '/assets/3d/bridge.glb'

const RIVER_URL = '/assets/3d/river.glb'

/**
 * The river.
 *
 * One authored channel, bent onto the stream centre-line at load and seated on the
 * terrain's own water height (see river.ts). One mesh, one draw call, no tiles and
 * therefore no seams; the bridge needs no special case because the deck and the
 * water are derived from the same heightfield.
 *
 * The flat ribbon that stood here through the block-out is the fallback, so a
 * failed download leaves water in the channel rather than a dry trench.
 */
function River({ geometry, materials: m }: { geometry: BufferGeometry; materials: WorldMaterials }) {
  const fallback = <mesh geometry={geometry} material={m.water} renderOrder={1} />
  return (
    <AssetBoundary label="River GLB" fallback={fallback}>
      <Suspense fallback={fallback}>
        <RiverChannel />
      </Suspense>
    </AssetBoundary>
  )
}

function RiverChannel() {
  const { geometry, material } = useInstancedGLB(RIVER_URL)
  // The loader hands out a private clone, so bending it cannot disturb the cache.
  const bent = useMemo(() => bendRiverToStream(geometry), [geometry])
  return (
    <>
      <mesh geometry={bent} material={material} receiveShadow />
      <RiverStones />
    </>
  )
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
  const geometry = new SphereGeometry(190, 24, 16).toNonIndexed()
  geometry.deleteAttribute('uv')
  geometry.deleteAttribute('normal')
  const pos = geometry.attributes.position
  const colors = new Float32Array(pos.count * 3)
  const horizon = new Color('#f2e2c6')
  const mid = new Color('#cfdfe0')
  const zenith = new Color('#a8c2d4')
  const c = new Color()
  for (let i = 0; i < pos.count; i++) {
    const t = Math.max(0, Math.min(1, (pos.getY(i) / 190) * 0.5 + 0.5))
    if (t < 0.52) c.copy(horizon).lerp(mid, Math.min(1, t / 0.52))
    else c.copy(mid).lerp(zenith, (t - 0.52) / 0.48)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
  return geometry
}

/**
 * Distant hills. Cheap deformed domes ringed beyond the playable area, fogged
 * into the sky so the horizon closes and the meadow never reads as infinite.
 */
function buildHills() {
  const rand = makeRandom(WORLD_SEED + 101)
  const positions: number[] = []
  const colors: number[] = []
  const near = new Color('#8fa47e')
  const far = new Color('#aebdc4')
  const c = new Color()

  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2 + rand() * 0.2
    const dist = 118 + rand() * 62
    const cx = Math.cos(a) * dist
    const cz = Math.sin(a) * dist
    const radius = 26 + rand() * 40
    const height = 9 + rand() * 22

    const dome = new IcosahedronGeometry(1, 1).toNonIndexed()
    const p = dome.attributes.position
    const depth = Math.min(1, (dist - 110) / 80)
    c.copy(near).lerp(far, depth * 0.85 + rand() * 0.1)

    for (let v = 0; v < p.count; v++) {
      const x = p.getX(v) * radius * (0.8 + rand() * 0.05)
      const y = Math.max(0, p.getY(v)) * height
      const z = p.getZ(v) * radius * (0.75 + rand() * 0.05)
      positions.push(cx + x, y - 2, cz + z)
      const shade = 1 + (p.getY(v) > 0.2 ? 0.07 : -0.05)
      colors.push(c.r * shade, c.g * shade, c.b * shade)
    }
    dome.dispose()
  }

  const geometry = new IcosahedronGeometry(1, 0).toNonIndexed()
  geometry.deleteAttribute('uv')
  geometry.deleteAttribute('normal')
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
  return geometry
}

