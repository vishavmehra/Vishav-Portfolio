'use client'

import { Suspense, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  Matrix4,
  MeshLambertMaterial,
  Quaternion,
  Vector3,
  type BufferGeometry,
  type Mesh,
  type MeshStandardMaterial,
} from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { AssetBoundary } from '@/game/assets/AssetBoundary'
import { useGLTF } from '@/game/assets/gltf'
import { SIGN_PLACEMENTS, SIGN_POSTS, lampNightFactor } from './lampPosts'
import { timeOfDay } from './timeOfDay'

const BOARDS_URL = '/assets/3d/sign-boards.glb'
const TEXT_URL = '/assets/3d/sign-text.glb'

/**
 * The paint is paint, not a light. By day it has no emissive at all; after dark
 * it gets a trace — enough that the word holds together at distance next to the
 * lantern, far too little to read as a glowing sign.
 */
const LETTER_EMISSIVE = { day: 0, night: 0.85 }

/**
 * Trail markers.
 *
 * Four authored markers — one hewn post carrying a split plank with pegged
 * corners, cut to fit its own word — each standing to the left of its lantern
 * and facing the way the visitor arrives (see lampPosts.ts). This is the
 * navigation the brief asks for: a physical sign found in the world, not a label
 * drawn over it.
 *
 * The lettering is its own mesh so the paint can be handled separately from the
 * timber: parchment by day, with a trace of emissive after dark so the word still
 * holds at distance. The light on a marker at night comes from its lantern, not
 * from the sign itself.
 *
 * Both files are merged into one geometry each, in world space, because the signs
 * never move: four boards and four words cost two draw calls between them.
 */
export function TrailSigns() {
  return (
    <AssetBoundary label="Trail sign GLBs" fallback={null}>
      <Suspense fallback={null}>
        <Signs />
      </Suspense>
    </AssetBoundary>
  )
}

function Signs() {
  const boards = useGLTF(BOARDS_URL)
  const text = useGLTF(TEXT_URL)

  const assembled = useMemo(() => {
    const boardGeometry = mergeNamed(boards.scene, (sign) => `Sign_${sign.word}`)
    const textGeometry = mergeNamed(text.scene, (sign) => `Word_${sign.word}`)

    // the timber is the asset's own, flat-shaded like everything else out there
    const source = findMesh(boards.scene, `Sign_${SIGN_POSTS[0].word}`).material as MeshStandardMaterial
    const boardMaterial = source.clone()
    boardMaterial.flatShading = true
    boardMaterial.needsUpdate = true

    // parchment paint (spec §10 parchment-300), lit by the world and the lantern
    const letterMaterial = new MeshLambertMaterial({
      color: '#d4c8af',
      emissive: '#e8dfc9',
      emissiveIntensity: LETTER_EMISSIVE.day,
    })

    return { boardGeometry, textGeometry, boardMaterial, letterMaterial }
  }, [boards, text])

  useEffect(() => {
    const { boardGeometry, textGeometry, boardMaterial, letterMaterial } = assembled
    return () => {
      boardGeometry.dispose()
      textGeometry.dispose()
      boardMaterial.dispose()
      letterMaterial.dispose()
    }
  }, [assembled])

  useFrame(() => {
    const night = lampNightFactor(timeOfDay.practicalIntensity)
    assembled.letterMaterial.emissiveIntensity = LETTER_EMISSIVE.day + (LETTER_EMISSIVE.night - LETTER_EMISSIVE.day) * night
  })

  return (
    <group name="trail-signs">
      <mesh geometry={assembled.boardGeometry} material={assembled.boardMaterial} castShadow receiveShadow />
      <mesh geometry={assembled.textGeometry} material={assembled.letterMaterial} />
    </group>
  )
}

function findMesh(scene: { getObjectByName: (name: string) => unknown }, name: string): Mesh {
  const mesh = scene.getObjectByName(name) as Mesh | undefined
  if (!mesh?.isMesh) throw new Error(`trail signs: no mesh named ${name}`)
  return mesh
}

/**
 * Pulls one mesh per sign out of a loaded file and bakes each into its world
 * placement, so the four end up as a single static geometry.
 */
function mergeNamed(scene: Parameters<typeof findMesh>[0] & { updateMatrixWorld: (force: boolean) => void }, name: (sign: (typeof SIGN_POSTS)[number]) => string) {
  scene.updateMatrixWorld(true)
  const position = new Vector3()
  const quaternion = new Quaternion()
  const scale = new Vector3()
  const matrix = new Matrix4()

  const parts = SIGN_POSTS.map((sign, i) => {
    const mesh = findMesh(scene, name(sign))
    const placement = SIGN_PLACEMENTS[i]
    const geometry = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld)
    position.set(placement.x, placement.y, placement.z)
    quaternion.setFromAxisAngle(UP, placement.rotation)
    scale.setScalar(placement.scale)
    geometry.applyMatrix4(matrix.compose(position, quaternion, scale))
    return geometry
  })

  const merged = mergeGeometries(parts)
  for (const part of parts) part.dispose()
  if (!merged) throw new Error('trail signs: sign meshes cannot be merged')
  return merged as BufferGeometry
}

const UP = new Vector3(0, 1, 0)
