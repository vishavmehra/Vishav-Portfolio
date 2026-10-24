'use client'

import { Suspense, useEffect, useMemo } from 'react'
import type { BufferGeometry } from 'three'

import { AssetBoundary } from '@/game/assets/AssetBoundary'
import { useInstancedGLB } from '@/game/assets/instancing'
import { InstancedGroup } from './Instanced'
import type { WorldMaterials } from './materials'
import {
  buildClover,
  buildDaisy,
  buildGrassTuft,
  buildLupine,
  buildReed,
  buildRock,
  buildShrub,
} from './geometryLib'
import { DESTINATION_FRAMING, DESTINATIONS, MID_PATH_LANDMARK, WORLD_SEED } from './worldConfig'
import {
  clusteredPlacements,
  distanceToStream,
  fbm,
  heightAt,
  patchPlacements,
  type Placement,
} from './worldGen'

const BUSH_URLS = [
  '/assets/3d/bush-a.glb',
  '/assets/3d/bush-b.glb',
  '/assets/3d/bush-c.glb',
  '/assets/3d/bush-d.glb',
] as const

const GRASS_URLS = [
  '/assets/3d/vegetation/grass-clump-a.glb',
  '/assets/3d/vegetation/grass-clump-b.glb',
  '/assets/3d/vegetation/grass-clump-c.glb',
  '/assets/3d/vegetation/grass-clump-d.glb',
] as const
const LUPINE_URL = '/assets/3d/vegetation/flower-lupine.glb'
const DAISY_URL = '/assets/3d/vegetation/flower-daisy.glb'
const CLOVER_URL = '/assets/3d/vegetation/flower-clover.glb'

const ROCK_URLS = ['/assets/3d/rock-a.glb', '/assets/3d/rock-b.glb', '/assets/3d/rock-c.glb'] as const
/**
 * Per-variant size, because the three authored rocks are not the same rock at
 * three sizes. The slab is the largest of the three assets and was being scaled
 * down until it read as a plate lying on the grass; at this size it is an outcrop.
 */
const ROCK_SCALE = [0.62, 0.72, 1.15] as const

/** 0..1 with eased ends, for local density falloffs. */
const ramp = (t: number) => {
  const c = t < 0 ? 0 : t > 1 ? 1 : t
  return c * c * (3 - 2 * c)
}

/**
 * The meadow layer: grass, wildflowers, shrubs, reeds and rocks.
 *
 * A curated vocabulary of seven assets, all instanced. Placement is clustered
 * rather than uniform — patches with dense cores and thinning edges, keyed off
 * the paths and the stream — because uniform scatter is what makes generated
 * worlds look generated.
 */
export function Vegetation({ materials }: { materials: WorldMaterials }) {
  const geometries = useMemo(
    () => ({
      grass: buildGrassTuft(5),
      lupine: buildLupine(21),
      daisy: buildDaisy(23),
      clover: buildClover(27),
      shrub: buildShrub(31),
      reed: buildReed(37),
      rock0: buildRock(0),
      rock1: buildRock(1),
      rock2: buildRock(2),
    }),
    [],
  )

  useEffect(() => {
    const list = Object.values(geometries)
    return () => {
      for (const g of list) g.dispose()
    }
  }, [geometries])

  const placements = useMemo(() => {
    const bounds = { minX: -50, maxX: 50, minZ: -84, maxZ: 6 }

    // Grass gathers in drifts and leaves clearings; the painted ground carries the gaps.
    // Tufts stay under ~0.5 m so the Explorer's legs never disappear.
    //
    // Density is *lower* than the block-out's: each authored clump is a tuft of
    // 9-17 curved blades where the procedural one was a few spikes, so fewer
    // instances read as more grass (spec Part 1 — fewer better assets).
    const grass = patchPlacements({
      seed: WORLD_SEED + 1,
      patches: 150,
      bounds,
      radius: [1.8, 6.5],
      density: [0.3, 0.95],
      scale: [0.7, 1.35],
      lean: 0.2,
      variants: GRASS_URLS.length,
      zoneFloor: 0.35,
      minPathDistance: 1.35,
    })

    // Flowers keep off the trails, the destination pads and the spawn, and only root in
    // the lusher parts of the meadow. Lupines: the signature spike, in small stands.
    const flowerKeepOut = { minPathDistance: 2.6, minPadDistance: 9, avoidSpawn: 6, minStreamDistance: 2.5, zoneFloor: 0.15 }
    // Each authored flower asset is already a cluster of 7-9 blooms, so the counts
    // here fall by roughly that factor: the same amount of flower for a fraction of
    // the instances, and no repeated single-bloom stamp.
    const lupine = patchPlacements({
      seed: WORLD_SEED + 2,
      patches: 30,
      bounds,
      radius: [1, 2.6],
      density: [0.28, 0.72],
      scale: [0.8, 1.4],
      lean: 0.16,
      variants: 3,
      ...flowerKeepOut,
    })

    // Daisies stay within sight of the trails, where a walker would actually notice them.
    const daisy = patchPlacements({
      seed: WORLD_SEED + 3,
      patches: 22,
      bounds,
      radius: [0.8, 2.2],
      density: [0.38, 0.8],
      scale: [0.7, 1.15],
      lean: 0.14,
      variants: 3,
      ...flowerKeepOut,
      maxPathDistance: 10,
    })

    const clover = patchPlacements({
      seed: WORLD_SEED + 4,
      patches: 18,
      bounds,
      radius: [1, 3.5],
      density: [0.34, 0.7],
      scale: [0.9, 1.5],
      lean: 0.08,
      variants: 3,
      ...flowerKeepOut,
    })

    // The Experience cabin happens to sit in a trough of the meadow field, so its slope came
    // out bare while the rest of the world read as meadow. These local layers fill that slope
    // back in: they start outside the cleared pad, peak on the open ground around it and die
    // out into the meadow, with the falloff scaled by noise so no ring forms around the cabin.
    // They are concatenated into the existing arrays, so the meadow layout elsewhere and the
    // draw calls are both unchanged.
    const [ex, ez] = DESTINATIONS.experience.position
    const cabinSlope = (x: number, z: number) => {
      const d = Math.hypot(x - ex, z - ez)
      const rising = ramp((d - 9.5) / 5)
      const fading = ramp((23 - d) / 8)
      return Math.min(1, rising * fading * (0.5 + 0.8 * fbm(x * 0.085 + 4.2, z * 0.085 - 6.1, 2)))
    }
    const cabinBounds = { minX: -32, maxX: 16, minZ: -82, maxZ: -34 }
    const cabinGrass = patchPlacements({
      seed: WORLD_SEED + 11,
      patches: 18,
      bounds: cabinBounds,
      radius: [1.4, 4.2],
      density: [0.34, 0.9],
      scale: [0.7, 1.3],
      lean: 0.2,
      variants: GRASS_URLS.length,
      zone: cabinSlope,
      minPathDistance: 1.35,
      minPadDistance: 8,
    })
    const cabinFlowerKeepOut = { zone: cabinSlope, minPathDistance: 2.6, minPadDistance: 9.5 }
    const cabinLupine = patchPlacements({
      seed: WORLD_SEED + 12,
      patches: 3,
      bounds: cabinBounds,
      radius: [1, 2.2],
      density: [0.24, 0.5],
      scale: [0.8, 1.4],
      lean: 0.16,
      variants: 3,
      ...cabinFlowerKeepOut,
    })
    const cabinDaisy = patchPlacements({
      seed: WORLD_SEED + 13,
      patches: 3,
      bounds: cabinBounds,
      radius: [0.8, 2],
      density: [0.3, 0.62],
      scale: [0.55, 0.9],
      lean: 0.14,
      variants: 3,
      ...cabinFlowerKeepOut,
    })
    const cabinClover = patchPlacements({
      seed: WORLD_SEED + 14,
      patches: 3,
      bounds: cabinBounds,
      radius: [1, 2],
      density: [0.28, 0.54],
      scale: [0.8, 1.3],
      lean: 0.08,
      variants: 3,
      ...cabinFlowerKeepOut,
    })

    // Bushes: four authored silhouettes, clustered in thickets rather than dotted.
    // The four shapes are deliberately unlike each other — a low dome, an upright
    // clump, a wind-formed sprawl and a young ball — so a thicket reads as a group
    // of plants instead of one plant at four sizes.
    const shrubClusters = clusteredPlacements({
      seed: WORLD_SEED + 5,
      clusters: 26,
      perCluster: [2, 5],
      spread: 3.4,
      bounds,
      variants: BUSH_URLS.length,
      scale: [0.75, 1.6],
      minPathDistance: 2.6,
      minPadDistance: 8,
      avoidSpawn: 9,
    })

    // The authored framing around each destination, on the same instanced variants.
    const shrub = [
      ...shrubClusters,
      ...DESTINATION_FRAMING.bushes.map((b) => ({
        x: b.x,
        z: b.z,
        y: heightAt(b.x, b.z),
        scale: b.scale,
        rotation: b.rotation,
        variant: b.variant,
      })),
    ]

    // Reeds only where there is water to justify them.
    const reed = clusteredPlacements({
      seed: WORLD_SEED + 6,
      clusters: 60,
      perCluster: [4, 11],
      spread: 2.6,
      bounds: { minX: -50, maxX: 50, minZ: -26, maxZ: 0 },
      variants: 3,
      scale: [0.7, 1.3],
    }).filter((p) => {
      const d = distanceToStream(p.x, p.z)
      return d > 1.5 && d < 4.2
    })

    // Rocks: clustered, never a uniform sprinkle. Three sizes, one big two small.
    const rockRaw = clusteredPlacements({
      seed: WORLD_SEED + 7,
      clusters: 30,
      perCluster: [2, 5],
      spread: 2.6,
      bounds,
      variants: 3,
      scale: [0.3, 1.25],
      minPathDistance: 1.9,
      minPadDistance: 7,
      avoidSpawn: 8,
    })

    // The three authored rocks are a 2.5 m slab, a 1.5 m boulder and a 0.7 m cobble —
    // one shared placement scale would make the slab a monolith and the cobble a pebble,
    // so each variant carries its own factor. They are authored sitting slightly into
    // the ground already, so nothing is sunk here.
    const rocks: [Placement[], Placement[], Placement[]] = [[], [], []]
    for (const p of rockRaw) {
      // Scattered rocks never use the slab (variant 0). It is a flat-topped outcrop:
      // dropped at random into open grass, the gameplay camera sees only its top face
      // and it reads as a stone plinth. The slab stays in the world where it was placed
      // deliberately — the mid-path landmark, bedded among boulders that give it scale.
      const variant = p.variant % 3 === 0 ? 1 : p.variant % 3
      rocks[variant].push({ ...p, scale: p.scale * ROCK_SCALE[variant] })
    }

    for (const r of DESTINATION_FRAMING.rocks) {
      rocks[r.variant % 3].push({
        x: r.x,
        z: r.z,
        y: heightAt(r.x, r.z),
        scale: r.scale * ROCK_SCALE[r.variant % 3],
        rotation: r.rotation,
        variant: r.variant,
      })
    }

    // The authored landmark cluster on the Experience leg.
    const [lx, lz] = MID_PATH_LANDMARK.position
    for (const r of MID_PATH_LANDMARK.rocks) {
      const x = lx + r.offset[0]
      const z = lz + r.offset[1]
      rocks[r.variant % 3].push({
        x,
        z,
        y: heightAt(x, z),
        scale: r.scale * ROCK_SCALE[r.variant % 3],
        rotation: (r.offset[0] + r.offset[1]) * 1.3,
        variant: r.variant,
      })
    }

    return {
      grass: [...grass, ...cabinGrass],
      lupine: [...lupine, ...cabinLupine],
      daisy: [...daisy, ...cabinDaisy],
      clover: [...clover, ...cabinClover],
      shrub,
      reed,
      rocks,
    }
  }, [])

  return (
    <group>
      <Grass placements={placements.grass} fallbackGeometry={geometries.grass} materials={materials} />
      <Flowers
        placements={[placements.lupine, placements.daisy, placements.clover]}
        fallbackGeometries={[geometries.lupine, geometries.daisy, geometries.clover]}
        materials={materials}
      />
      <Bushes placements={placements.shrub} fallbackGeometry={geometries.shrub} materials={materials} />
      <InstancedGroup
        geometry={geometries.reed}
        material={materials.vegetation}
        placements={placements.reed}
        tiltAmount={0.2}
      />
      <Rocks
        placements={placements.rocks}
        fallbackGeometries={[geometries.rock0, geometries.rock1, geometries.rock2]}
        materials={materials}
      />
    </group>
  )
}

/**
 * The grass layer: four authored clumps, one instanced draw call each.
 *
 * The block-out's procedural tuft stays as the fallback for all four at once, so
 * a failed download leaves a meadow rather than bare ground.
 */
function Grass({
  placements,
  fallbackGeometry,
  materials,
}: {
  placements: Placement[]
  fallbackGeometry: BufferGeometry
  materials: WorldMaterials
}) {
  const byVariant = useMemo(
    () => GRASS_URLS.map((_, v) => placements.filter((p) => p.variant % GRASS_URLS.length === v)),
    [placements],
  )
  const fallback = <InstancedGroup geometry={fallbackGeometry} material={materials.vegetation} placements={placements} />
  return (
    <AssetBoundary label="Grass GLBs" fallback={fallback}>
      <Suspense fallback={fallback}>
        {GRASS_URLS.map((url, v) => (
          <GlbInstances key={url} url={url} placements={byVariant[v]} />
        ))}
      </Suspense>
    </AssetBoundary>
  )
}

/**
 * Flowers: three authored clusters — lupine spikes, daisies, clover. Each asset is
 * a whole cluster with its own dense centre and sparse edge, which is why the
 * placement densities that feed it are a fraction of the block-out's.
 */
function Flowers({
  placements,
  fallbackGeometries,
  materials,
}: {
  placements: [Placement[], Placement[], Placement[]]
  fallbackGeometries: BufferGeometry[]
  materials: WorldMaterials
}) {
  const urls = [LUPINE_URL, DAISY_URL, CLOVER_URL]
  const fallback = (
    <>
      {fallbackGeometries.map((geometry, v) => (
        <InstancedGroup key={v} geometry={geometry} material={materials.vegetation} placements={placements[v]} />
      ))}
    </>
  )
  return (
    <AssetBoundary label="Flower GLBs" fallback={fallback}>
      <Suspense fallback={fallback}>
        {urls.map((url, v) => (
          <GlbInstances key={url} url={url} placements={placements[v]} />
        ))}
      </Suspense>
    </AssetBoundary>
  )
}

/** One authored asset, instanced. Vegetation casts no shadows — it is too small to read. */
function GlbInstances({ url, placements }: { url: string; placements: Placement[] }) {
  const { geometry, material } = useInstancedGLB(url)
  return <InstancedGroup geometry={geometry} material={material} placements={placements} />
}

/**
 * The rock layer. The three authored rocks — slab, boulder, cobble — shipped with
 * the asset set but the world was still drawing the block-out's procedural lumps;
 * this is the one-line-per-asset swap the pipeline was built for (docs/10 §1).
 */
function Rocks({
  placements,
  fallbackGeometries,
  materials,
}: {
  placements: [Placement[], Placement[], Placement[]]
  fallbackGeometries: BufferGeometry[]
  materials: WorldMaterials
}) {
  const fallback = (
    <>
      {fallbackGeometries.map((geometry, v) => (
        <InstancedGroup
          key={v}
          geometry={geometry}
          material={materials.stone}
          placements={placements[v]}
          castShadow
          receiveShadow
        />
      ))}
    </>
  )
  return (
    <AssetBoundary label="Rock GLBs" fallback={fallback}>
      <Suspense fallback={fallback}>
        {ROCK_URLS.map((url, v) => (
          <Rock key={url} url={url} placements={placements[v]} />
        ))}
      </Suspense>
    </AssetBoundary>
  )
}

function Rock({ url, placements }: { url: string; placements: Placement[] }) {
  const { geometry, material } = useInstancedGLB(url)
  return <InstancedGroup geometry={geometry} material={material} placements={placements} castShadow receiveShadow />
}

/**
 * The bush layer: one instanced draw call per authored silhouette.
 *
 * The four assets share one material, so four shapes cost four draw calls however
 * many thickets there are. The procedural shrub that stood here through the
 * block-out remains the fallback for every variant at once — a failed download
 * leaves thickets in the meadow rather than bare ground.
 */
function Bushes({
  placements,
  fallbackGeometry,
  materials,
}: {
  placements: Placement[]
  fallbackGeometry: BufferGeometry
  materials: WorldMaterials
}) {
  const byVariant = useMemo(
    () => BUSH_URLS.map((_, v) => placements.filter((p) => p.variant % BUSH_URLS.length === v)),
    [placements],
  )
  const fallback = (
    <InstancedGroup geometry={fallbackGeometry} material={materials.foliage} placements={placements} castShadow />
  )
  return (
    <AssetBoundary label="Bush GLBs" fallback={fallback}>
      <Suspense fallback={fallback}>
        {BUSH_URLS.map((url, v) => (
          <Bush key={url} url={url} placements={byVariant[v]} />
        ))}
      </Suspense>
    </AssetBoundary>
  )
}

function Bush({ url, placements }: { url: string; placements: Placement[] }) {
  const { geometry, material } = useInstancedGLB(url)
  return <InstancedGroup geometry={geometry} material={material} placements={placements} castShadow receiveShadow />
}
