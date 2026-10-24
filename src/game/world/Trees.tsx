'use client'

import { Suspense, useEffect, useMemo } from 'react'

import { AssetBoundary } from '@/game/assets/AssetBoundary'
import { useInstancedGLB } from '@/game/assets/instancing'
import { InstancedGroup } from './Instanced'
import type { WorldMaterials } from './materials'
import {
  buildBirch,
  buildConifer,
  buildHeroOakBroad,
  buildHeroOakTall,
} from './geometryLib'
import { WORLD, WORLD_BOUNDS } from '@/game/config'
import { BIRCH_STAND, HERO_TREES, WORLD_SEED } from './worldConfig'
import { CONIFER_PLACEMENTS } from './propPlacements'
import { heightAt, makeRandom, type Placement } from './worldGen'

/**
 * How far outside the playable rectangle a backdrop tree must stand.
 *
 * Far enough that it reads as horizon rather than as scenery the player is walking
 * past, and comfortably clear of the near fog plane at 48 units. The stands
 * themselves sit 82-134 m out, where the haze baked into the backdrop palette and
 * the scene fog both do their work.
 */
const DISTANT_STANDOFF = 24

/** Distance from a point to the nearest place the player can actually stand. */
function distanceToPlayable(x: number, z: number) {
  const cx = Math.min(Math.max(x, WORLD_BOUNDS.minX), WORLD_BOUNDS.maxX)
  const cz = Math.min(Math.max(z, WORLD_BOUNDS.minZ), WORLD_BOUNDS.maxZ)
  return Math.hypot(x - cx, z - cz)
}

/**
 * Every tree in the world, in three tiers:
 *
 *   hero     2 authored assets, hand-placed, frame the destinations
 *   birch    Education's distance identifier (production GLB)
 *   conifer  mid-distance depth
 *
 * and then the same five assets again, further out, as the backdrop forest.
 *
 * The backdrop is not a separate kind of tree. It used to be — two cheap silhouette
 * meshes that read as a different game's forest the moment you looked past the
 * playable edge. Now the horizon is the production trees at production detail,
 * standing 24 m or more beyond anywhere the player can walk: the only thing that
 * changes with distance is the transform and the fact that they cast no shadow.
 *
 * Five assets across every tree in the world. Variation is rotation and scale, not
 * new geometry.
 */
export function Trees({ materials }: { materials: WorldMaterials }) {
  const geometries = useMemo(
    () => ({
      oakBroad: buildHeroOakBroad(3),
      oakTall: buildHeroOakTall(7),
      birch: buildBirch(11),
      conifer: buildConifer(13),
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
    const toPlacement = (
      t: { x: number; z: number; scale: number; rotation: number },
      variant = 0,
    ): Placement => ({
      x: t.x,
      z: t.z,
      y: heightAt(t.x, t.z) - 0.25,
      scale: t.scale,
      rotation: t.rotation,
      variant,
    })

    // Both hero tiers are authored assets now; the procedural builders remain as fallbacks.
    const broadGlb = HERO_TREES.filter((t) => t.kind === 0).map((t) => toPlacement(t))
    const tall = HERO_TREES.filter((t) => t.kind === 1).map((t) => toPlacement(t))
    const birch = BIRCH_STAND.map((t) => toPlacement(t))

    // Conifers gather in stands (propPlacements.ts, shared with their colliders).
    const conifer = CONIFER_PLACEMENTS

    // The backdrop forest: a forest edge rather than a ring. Trees arrive in
    // stands with gaps between them, because an even ring at a constant radius is
    // the thing that reads as a procedural skirt around the world (spec Part 2).
    //
    // Every one of them stands on the ground, in the band between the playable
    // rectangle and the edge of the terrain, and every one of them is one of the
    // five production tree assets. Stands are single-species — a conifer stand or a
    // broadleaf stand — because a real treeline grows in patches, and because it is
    // what keeps the horizon reading as depth rather than as texture.
    const rand = makeRandom(WORLD_SEED + 77)
    const backdrop: Record<TreeSpecies, Placement[]> = {
      oakBroad: [],
      oakTall: [],
      birch: [],
      coniferA: [],
      coniferB: [],
      coniferC: [],
    }
    const CONIFERS: TreeSpecies[] = ['coniferA', 'coniferB', 'coniferC']
    const BROADLEAF: TreeSpecies[] = ['birch', 'birch', 'birch', 'birch', 'oakBroad', 'oakTall']
    // The band is narrow — the played world fills most of the terrain, and nothing
    // may stand closer than DISTANT_STANDOFF to it — so stands are walked along the
    // terrain's edge rather than thrown at the whole rectangle and mostly rejected,
    // which is what left the old backdrop as a thin scatter of silhouettes.
    const half = WORLD.groundSize / 2 - 5
    const inTerrain = (x: number, z: number) =>
      Math.abs(x) <= half && Math.abs(z - WORLD.groundCenterZ) <= half
    /** A point on the terrain's edge, `t` running 0-4 once round it. */
    const onEdge = (t: number) => {
      const side = Math.floor(t) % 4
      const k = (t % 1) * 2 - 1
      if (side === 0) return { x: k * half, z: WORLD.groundCenterZ - half }
      if (side === 1) return { x: half, z: WORLD.groundCenterZ + k * half }
      if (side === 2) return { x: -k * half, z: WORLD.groundCenterZ + half }
      return { x: -half, z: WORLD.groundCenterZ - k * half }
    }
    for (let t = 0; t < 4; t += 0.019 + rand() * 0.024) {
      const edge = onEdge(t)
      // step inward off the edge, into the band, by a random depth
      const depth = 1.5 + rand() * 13
      const cx = edge.x - Math.sign(edge.x) * (Math.abs(edge.x) > half - 1 ? depth : rand() * depth)
      const cz = edge.z - Math.sign(edge.z - WORLD.groundCenterZ) * (Math.abs(edge.z - WORLD.groundCenterZ) > half - 1 ? depth : rand() * depth)
      if (distanceToPlayable(cx, cz) < DISTANT_STANDOFF) continue
      // Conifer stands outnumber broadleaf ones: they are the cheaper asset and the
      // one whose silhouette survives being small on the horizon.
      const conifers = rand() < 0.85
      const count = 2 + Math.floor(rand() * (conifers ? 5 : 3))
      for (let i = 0; i < count; i++) {
        const spread = 3 + rand() * 6
        const x = cx + (rand() - 0.5) * spread * 2
        const z = cz + (rand() - 0.5) * spread * 2
        // Backdrop trees must stay backdrop. Measured: the old ring let a 12 m
        // broadleaf stand 3.3 m outside the playable rectangle, where it loomed
        // over the walkable world at full detail — the fog does not start until
        // 48 m, so nothing was hiding it. This keeps every one of them at least
        // DISTANT_STANDOFF from anywhere the player can stand.
        if (distanceToPlayable(x, z) < DISTANT_STANDOFF || !inTerrain(x, z)) continue
        const species = conifers
          ? CONIFERS[Math.floor(rand() * CONIFERS.length)]
          : BROADLEAF[Math.floor(rand() * BROADLEAF.length)]
        backdrop[species].push({
          x,
          z,
          y: heightAt(x, z) - 0.4,
          // Distant trees run a little larger than their near cousins: at 80-130 m
          // a 9 m conifer is a few pixels of silhouette, and the treeline has to
          // hold the horizon.
          scale: (conifers ? 0.95 : 0.8) + rand() * 0.75,
          rotation: rand() * Math.PI * 2,
          variant: 0,
        })
      }
    }

    return { broadGlb, tall, birch, conifer, backdrop }
  }, [])

  // Procedural stand-ins hold the GLB placements while an asset loads, and for good if it fails.
  const broadGlbFallback = (
    <InstancedGroup
      geometry={geometries.oakBroad}
      material={materials.foliage}
      placements={placements.broadGlb}
      castShadow
    />
  )
  const tallGlbFallback = (
    <InstancedGroup
      geometry={geometries.oakTall}
      material={materials.foliage}
      placements={placements.tall}
      castShadow
    />
  )
  const birchFallback = (
    <InstancedGroup
      geometry={geometries.birch}
      material={materials.foliage}
      placements={placements.birch}
      castShadow
    />
  )
  const coniferFallback = (
    <InstancedGroup
      geometry={geometries.conifer}
      material={materials.foliage}
      placements={placements.conifer}
      castShadow
    />
  )

  return (
    <group>
      <AssetBoundary label="Hero Tree A GLB" fallback={broadGlbFallback}>
        <Suspense fallback={broadGlbFallback}>
          <GlbTrees url={TREE_URLS.oakBroad} placements={placements.broadGlb} />
          <GlbTrees url={TREE_URLS.oakBroad} placements={placements.backdrop.oakBroad} shadows={false} />
        </Suspense>
      </AssetBoundary>
      <AssetBoundary label="Hero Tree B GLB" fallback={tallGlbFallback}>
        <Suspense fallback={tallGlbFallback}>
          <GlbTrees url={TREE_URLS.oakTall} placements={placements.tall} />
          <GlbTrees url={TREE_URLS.oakTall} placements={placements.backdrop.oakTall} shadows={false} />
        </Suspense>
      </AssetBoundary>
      <AssetBoundary label="Birch GLB" fallback={birchFallback}>
        <Suspense fallback={birchFallback}>
          <GlbTrees url={TREE_URLS.birch} placements={placements.birch} />
          <GlbTrees url={TREE_URLS.birch} placements={placements.backdrop.birch} shadows={false} />
        </Suspense>
      </AssetBoundary>
      {/* Conifers: three authored silhouettes, near and far, one instanced draw call each. */}
      <AssetBoundary label="Conifer GLBs" fallback={coniferFallback}>
        <Suspense fallback={coniferFallback}>
          {CONIFER_SPECIES.map((species, v) => (
            <GlbTrees
              key={species}
              url={TREE_URLS[species]}
              placements={placements.conifer.filter((p) => p.variant % 3 === v)}
            />
          ))}
          {CONIFER_SPECIES.map((species) => (
            <GlbTrees key={`${species}-far`} url={TREE_URLS[species]} placements={placements.backdrop[species]} shadows={false} />
          ))}
        </Suspense>
      </AssetBoundary>
    </group>
  )
}

/**
 * Every tree asset in the world. The backdrop forest draws from exactly this list:
 * there is no "distant tree" asset any more, and no reduced-detail copy of one.
 */
type TreeSpecies = 'oakBroad' | 'oakTall' | 'birch' | 'coniferA' | 'coniferB' | 'coniferC'

const TREE_URLS: Record<TreeSpecies, string> = {
  oakBroad: '/assets/3d/hero-tree-a.glb',
  oakTall: '/assets/3d/hero-tree-b.glb',
  birch: '/assets/3d/birch.glb',
  coniferA: '/assets/3d/environment-trees/tree-conifer-a.glb',
  coniferB: '/assets/3d/environment-trees/tree-conifer-b.glb',
  coniferC: '/assets/3d/environment-trees/tree-conifer-c.glb',
}

const CONIFER_SPECIES = ['coniferA', 'coniferB', 'coniferC'] as const

/**
 * A production tree GLB, instanced. Tree GLBs are authored at world scale with their
 * base at y = 0, so placements use the same transforms as the procedural trees they replace.
 */
function GlbTrees({ url, placements, shadows = true }: { url: string; placements: Placement[]; shadows?: boolean }) {
  const { geometry, material } = useInstancedGLB(url)
  return <InstancedGroup geometry={geometry} material={material} placements={placements} castShadow={shadows} />
}
