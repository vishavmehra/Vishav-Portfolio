'use client'

import { useEffect, useMemo } from 'react'
import { MeshLambertMaterial } from 'three'

/**
 * FALLBACK PROXY for Explorer Unit 7-B.
 *
 * Built from primitives to match the approved character sheet's silhouette,
 * proportions and palette — cream helmet with a single warm amber visor slot,
 * olive tunic, brown chest strap with a brass compass, expedition backpack with
 * bedroll and rope, chunky boots. No facial features (there is no face).
 *
 * The production character is PlayerModel (the GLB). This proxy is shown only
 * while that loads, and kept if it fails, so the player is never invisible.
 * Unmounting it disposes its materials; R3F disposes its geometries.
 *
 * Modelled facing -Z (away from the default camera), origin at the feet,
 * total height ≈ 1.4 units (DD-20).
 */
export function Player() {
  const materials = useMemo(
    () => ({
      cream: new MeshLambertMaterial({ color: '#efe9dc' }),
      olive: new MeshLambertMaterial({ color: '#7d8f52' }),
      leather: new MeshLambertMaterial({ color: '#6b4a2f' }),
      canvas: new MeshLambertMaterial({ color: '#cf7f3c' }),
      boot: new MeshLambertMaterial({ color: '#6b5e52' }),
      brass: new MeshLambertMaterial({ color: '#c9a44a' }),
      // The one saturated accent in the whole character (DD-23).
      visor: new MeshLambertMaterial({
        color: '#3a2a14',
        emissive: '#f0932b',
        emissiveIntensity: 1,
      }),
    }),
    [],
  )

  useEffect(() => {
    const created = Object.values(materials)
    return () => {
      for (const material of created) material.dispose()
    }
  }, [materials])

  return (
    <group>
      {/* boots */}
      <mesh position={[-0.17, 0.09, -0.03]} material={materials.boot} castShadow>
        <boxGeometry args={[0.22, 0.18, 0.34]} />
      </mesh>
      <mesh position={[0.17, 0.09, -0.03]} material={materials.boot} castShadow>
        <boxGeometry args={[0.22, 0.18, 0.34]} />
      </mesh>

      {/* legs */}
      <mesh position={[-0.15, 0.32, 0]} material={materials.olive} castShadow>
        <cylinderGeometry args={[0.09, 0.1, 0.3, 8]} />
      </mesh>
      <mesh position={[0.15, 0.32, 0]} material={materials.olive} castShadow>
        <cylinderGeometry args={[0.09, 0.1, 0.3, 8]} />
      </mesh>

      {/* tunic — flares outward toward the hem */}
      <mesh position={[0, 0.69, 0]} material={materials.olive} castShadow>
        <cylinderGeometry args={[0.24, 0.31, 0.48, 10]} />
      </mesh>

      {/* cream shoulder band under the helmet */}
      <mesh position={[0, 0.98, 0]} material={materials.cream} castShadow>
        <cylinderGeometry args={[0.23, 0.24, 0.14, 10]} />
      </mesh>

      {/* arms */}
      <mesh
        position={[-0.28, 0.8, 0]}
        rotation={[0, 0, 0.12]}
        material={materials.cream}
        castShadow
      >
        <cylinderGeometry args={[0.075, 0.075, 0.44, 8]} />
      </mesh>
      <mesh
        position={[0.28, 0.8, 0]}
        rotation={[0, 0, -0.12]}
        material={materials.cream}
        castShadow
      >
        <cylinderGeometry args={[0.075, 0.075, 0.44, 8]} />
      </mesh>

      {/* helmet */}
      <mesh position={[0, 1.16, 0]} material={materials.cream} castShadow>
        <sphereGeometry args={[0.26, 16, 12]} />
      </mesh>

      {/* visor — the single warm amber slot, front face (-Z) */}
      <mesh position={[0, 1.17, -0.225]} material={materials.visor}>
        <boxGeometry args={[0.2, 0.11, 0.06]} />
      </mesh>

      {/* chest strap */}
      <mesh
        position={[0, 0.82, -0.2]}
        rotation={[0, 0, 0.55]}
        material={materials.leather}
        castShadow
      >
        <boxGeometry args={[0.5, 0.07, 0.06]} />
      </mesh>

      {/* brass compass on the strap */}
      <mesh
        position={[0.13, 0.72, -0.24]}
        rotation={[Math.PI / 2, 0, 0]}
        material={materials.brass}
      >
        <cylinderGeometry args={[0.055, 0.055, 0.03, 10]} />
      </mesh>

      {/* backpack */}
      <mesh position={[0, 0.84, 0.26]} material={materials.leather} castShadow>
        <boxGeometry args={[0.34, 0.38, 0.2]} />
      </mesh>

      {/* bedroll strapped across the top of the pack */}
      <mesh
        position={[0, 1.04, 0.29]}
        rotation={[0, 0, Math.PI / 2]}
        material={materials.canvas}
        castShadow
      >
        <cylinderGeometry args={[0.075, 0.075, 0.38, 8]} />
      </mesh>

      {/* coiled rope */}
      <mesh
        position={[0, 0.66, 0.3]}
        rotation={[Math.PI / 2, 0, 0]}
        material={materials.canvas}
        castShadow
      >
        <torusGeometry args={[0.085, 0.028, 6, 12]} />
      </mesh>
    </group>
  )
}
