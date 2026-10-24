'use client'

import { Suspense, useEffect, useMemo } from 'react'
import type { BufferGeometry, MeshStandardMaterial } from 'three'

import { AssetBoundary } from '@/game/assets/AssetBoundary'
import { useInstancedGLB } from '@/game/assets/instancing'
import type { WorldMaterials } from './materials'
import {
  buildAchievementsProps,
  buildAchievementsStructure,
  buildEducation,
  buildExperienceProps,
  buildExperienceStructure,
  buildProjects,
  buildTrailhead,
} from './destinationGeometry'
import { DESTINATIONS, TRAILHEAD } from './worldConfig'
import { heightAt } from './worldGen'

/**
 * The four destinations.
 *
 * Each is one merged geometry with baked vertex colour, so a workshop full of
 * blueprints, gears and shelving is a single draw call. Only the emissive
 * accents — a screen, a lamp, a lantern — are separate, because they need a
 * different material.
 *
 * Structures sit in a group named `occluders`; the follow camera raycasts
 * against that group and dollies in rather than letting a wall hide the player.
 */
const EXPERIENCE_CABIN_URL = '/assets/3d/experience-cabin.glb'
const EDUCATION_CABIN_URL = '/assets/3d/education-cabin.glb'
const PROJECTS_SHACK_URL = '/assets/3d/projects-shack.glb'

/** The production cabin, authored at world scale with its base at y = 0 and its opening on +Z. */
function ExperienceCabin() {
  const { geometry, material } = useInstancedGLB(EXPERIENCE_CABIN_URL)
  return <mesh geometry={geometry} material={material} castShadow receiveShadow />
}

/**
 * A supplied structure: base at y = 0, opening on +Z, one textured material.
 *
 * These two arrive from outside the palette pipeline — they carry a photographic
 * texture instead of the palette atlas — so they are flat-shaded here to sit with
 * the faceted world instead of reading as a photograph dropped into it. Shading
 * flat at runtime also keeps the shipped file small: smooth-shaded vertices are
 * shared, and this world never sees the smooth normals anyway.
 */
function SuppliedStructure({ url }: { url: string }) {
  const { geometry, material } = useInstancedGLB(url)
  useEffect(() => {
    const m = material as MeshStandardMaterial
    if (!m.flatShading) {
      m.flatShading = true
      m.needsUpdate = true
    }
  }, [material])
  return <mesh geometry={geometry} material={material} castShadow receiveShadow />
}

/** The procedural cabin holds the place while the GLB loads, and for good if it fails. */
function experienceFallback(
  g: { experienceStructure: BufferGeometry; experienceProps: BufferGeometry },
  m: WorldMaterials,
) {
  return (
    <>
      <mesh geometry={g.experienceStructure} material={m.propsBaked} castShadow receiveShadow />
      <mesh geometry={g.experienceProps} material={m.propsBaked} castShadow receiveShadow />
    </>
  )
}

export function Destinations({ materials: m }: { materials: WorldMaterials }) {
  const g = useMemo(
    () => ({
      projects: buildProjects(),
      experienceStructure: buildExperienceStructure(),
      experienceProps: buildExperienceProps(),
      education: buildEducation(),
      achievementsStructure: buildAchievementsStructure(),
      achievementsProps: buildAchievementsProps(),
      trailhead: buildTrailhead(),
    }),
    [],
  )

  useEffect(() => {
    const list = Object.values(g)
    return () => {
      for (const geo of list) geo.dispose()
    }
  }, [g])

  const at = (id: keyof typeof DESTINATIONS): [number, number, number] => {
    const [x, z] = DESTINATIONS[id].position
    return [x, heightAt(x, z), z]
  }

  return (
    <group>
      {/* PROJECTS — a workshop shack on stilts, its pole and lines carrying the
          "wired up" read the desk used to carry. The desk remains the stand-in
          while the asset loads, and for good if it fails. */}
      <group position={at('projects')} rotation={[0, DESTINATIONS.projects.rotation, 0]} userData={{ contentKey: 'projects' }}>
        <group name="occluders">
          <AssetBoundary
            label="Projects Shack GLB"
            fallback={<mesh geometry={g.projects} material={m.propsBaked} castShadow receiveShadow />}
          >
            <Suspense fallback={<mesh geometry={g.projects} material={m.propsBaked} castShadow receiveShadow />}>
              <SuppliedStructure url={PROJECTS_SHACK_URL} />
            </Suspense>
          </AssetBoundary>
        </group>
        {/* the amber practical, now a lit window in the shack's open front */}
        <mesh position={[-0.35, 2.25, 0.62]} material={m.screen}>
          <boxGeometry args={[0.42, 0.34, 0.03]} />
        </mesh>
      </group>

      {/* EXPERIENCE — built, engineering, the only roofline in the world.
          The authored cabin is one mesh: shell, doors, interior and outdoor work area.
          It is authored with its opening on +Z, the same way the procedural stand-in was,
          so the destination's own yaw still points the threshold at the approach. */}
      <group position={at('experience')} rotation={[0, DESTINATIONS.experience.rotation, 0]} userData={{ contentKey: 'experience' }}>
        <group name="occluders">
          <AssetBoundary label="Experience Cabin GLB" fallback={experienceFallback(g, m)}>
            <Suspense fallback={experienceFallback(g, m)}>
              <ExperienceCabin />
            </Suspense>
          </AssetBoundary>
        </group>
        {/* the amber accent, sitting in the cabin's own bench lamp */}
        <mesh position={[0.14, 1.02, -2.2]} material={m.screen}>
          <boxGeometry args={[0.15, 0.16, 0.1]} />
        </mesh>
      </group>

      {/* EDUCATION — a log cabin study. No screen: the only light is the lamp on
          its porch. The scholar's table remains the stand-in while the asset loads. */}
      <group position={at('education')} rotation={[0, DESTINATIONS.education.rotation, 0]} userData={{ contentKey: 'education' }}>
        <group name="occluders">
          <AssetBoundary
            label="Education Cabin GLB"
            fallback={<mesh geometry={g.education} material={m.propsBaked} castShadow receiveShadow />}
          >
            <Suspense fallback={<mesh geometry={g.education} material={m.propsBaked} castShadow receiveShadow />}>
              <SuppliedStructure url={EDUCATION_CABIN_URL} />
            </Suspense>
          </AssetBoundary>
        </group>
        <mesh position={[0.62, 1.05, 1.45]} material={m.screen}>
          <sphereGeometry args={[0.08, 7, 5]} />
        </mesh>
      </group>

      {/* ACHIEVEMENTS — symmetrical shrine on a stepped dais */}
      <group position={at('achievements')} rotation={[0, DESTINATIONS.achievements.rotation, 0]} userData={{ contentKey: 'achievements' }}>
        <group name="occluders">
          <mesh geometry={g.achievementsStructure} material={m.propsBaked} castShadow receiveShadow />
        </group>
        <mesh geometry={g.achievementsProps} material={m.propsBaked} castShadow receiveShadow />
      </group>

      {/* TRAILHEAD — scenery at the start of the path. Purely decorative: the way
          out is the HUD's hold-X / EXIT, never an object to walk to. */}
      <group
        position={[TRAILHEAD.position[0], heightAt(TRAILHEAD.position[0], TRAILHEAD.position[1]), TRAILHEAD.position[1]]}
        rotation={[0, TRAILHEAD.rotation, 0]}
      >
        <mesh geometry={g.trailhead} material={m.propsBaked} castShadow receiveShadow />
      </group>
    </group>
  )
}
