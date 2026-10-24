import { useEffect, useMemo } from 'react'
import type { BufferGeometry, Material, Mesh } from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { useGLTF } from './gltf'

/**
 * GLB → InstancedMesh adapter (docs/10 §7).
 *
 * Bakes every mesh node of a GLB into one geometry so an authored asset instances
 * through the same InstancedGroup as a procedural one: one draw call per placement
 * set, however many objects it was authored as. The asset's own material is kept.
 *
 * An asset whose meshes do not share a single material, or cannot be merged, is an
 * authoring error: it throws during render so the nearest AssetBoundary falls back.
 */
export function useInstancedGLB(url: string): { geometry: BufferGeometry; material: Material } {
  const gltf = useGLTF(url)

  const asset = useMemo(() => {
    const meshes: Mesh[] = []
    gltf.scene.updateMatrixWorld(true)
    gltf.scene.traverse((object) => {
      if ((object as Mesh).isMesh) meshes.push(object as Mesh)
    })

    const material = meshes[0]?.material
    if (!material || meshes.some((m) => m.material !== material)) {
      throw new Error(`${url}: expected every mesh to share one material`)
    }

    // Clones, so the cached GLTF stays untouched for any other consumer.
    const parts = meshes.map((m) => m.geometry.clone().applyMatrix4(m.matrixWorld))
    const geometry = mergeGeometries(parts)
    for (const part of parts) part.dispose()
    if (!geometry) throw new Error(`${url}: mesh attributes differ and cannot be merged`)

    return { geometry, material: material as Material }
  }, [gltf, url])

  // The merged geometry is ours; the material and its texture belong to the loader cache.
  useEffect(() => () => asset.geometry.dispose(), [asset])

  return asset
}

/**
 * The same adapter for an asset that ships several interchangeable variants in one
 * file — river tiles, bushes — where merging them all into one geometry would weld
 * the variants together. Each mesh node becomes its own geometry, in file order, and
 * they still share the one material, so a set of variants is still one draw call per
 * variant rather than one per object.
 */
export function useInstancedGLBVariants(url: string): { geometries: BufferGeometry[]; material: Material } {
  const gltf = useGLTF(url)

  const asset = useMemo(() => {
    const meshes: Mesh[] = []
    gltf.scene.updateMatrixWorld(true)
    gltf.scene.traverse((object) => {
      if ((object as Mesh).isMesh) meshes.push(object as Mesh)
    })

    const material = meshes[0]?.material
    if (!material || meshes.some((m) => m.material !== material)) {
      throw new Error(`${url}: expected every mesh to share one material`)
    }

    // Clones, so the cached GLTF stays untouched for any other consumer.
    const geometries = meshes.map((m) => m.geometry.clone().applyMatrix4(m.matrixWorld))
    return { geometries, material: material as Material }
  }, [gltf, url])

  useEffect(() => () => { for (const g of asset.geometries) g.dispose() }, [asset])

  return asset
}
