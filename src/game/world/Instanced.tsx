'use client'

import { useLayoutEffect, useRef } from 'react'
import {
  Euler,
  InstancedMesh,
  Matrix4,
  Quaternion,
  Vector3,
  type BufferGeometry,
  type Material,
} from 'three'

import type { Placement } from './worldGen'

const matrix = new Matrix4()
const position = new Vector3()
const quaternion = new Quaternion()
const euler = new Euler()
const scale = new Vector3()

/**
 * One draw call for many copies of an authored asset.
 *
 * Variation comes entirely from the transform — scale, rotation, position —
 * which is how a small vocabulary of assets fills a meadow without either
 * repeating visibly or costing a draw call each.
 */
export function InstancedGroup({
  geometry,
  material,
  placements,
  castShadow = false,
  receiveShadow = false,
  tiltAmount = 0,
}: {
  geometry: BufferGeometry
  material: Material
  placements: Placement[]
  castShadow?: boolean
  receiveShadow?: boolean
  /** small random lean, so vegetation does not stand to attention */
  tiltAmount?: number
}) {
  const ref = useRef<InstancedMesh>(null)

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    for (let i = 0; i < placements.length; i++) {
      const p = placements[i]
      if (p.lean !== undefined) {
        // Tilt first, then yaw: every instance leans its own way instead of along one world axis.
        euler.set(p.lean, p.rotation, p.lean * 0.5, 'YXZ')
      } else {
        const lean = tiltAmount > 0 ? (p.variant / 3 - 0.5) * tiltAmount : 0
        euler.set(lean, p.rotation, lean * 0.6, 'XYZ')
      }
      quaternion.setFromEuler(euler)
      position.set(p.x, p.y, p.z)
      scale.setScalar(p.scale)
      matrix.compose(position, quaternion, scale)
      mesh.setMatrixAt(i, matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [placements, tiltAmount])

  if (placements.length === 0) return null

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, placements.length]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      frustumCulled
    />
  )
}
