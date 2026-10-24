'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { BufferGeometry, Float32BufferAttribute, Vector3, type LineLoop } from 'three'

import { cameraView } from '@/game/camera/cameraState'
import { PLAYER } from '@/game/config'
import { updateNavigation } from '@/game/navigation/NavigationSystem'
import { playerPosition } from '@/game/player/playerState'
import { attachInteractKey } from '@/input/interactInput'
import { releaseLook } from '@/input/lookInput'
import { getColliders, registerCollider } from './collision/CollisionSystem'
import type { WorldCollider } from './collision/CollisionTypes'
import {
  activePromptScreen,
  getActiveInteraction,
  getInteractions,
  interact,
  isInteractionEnabled,
  onInteraction,
  registerInteraction,
  updateInteractions,
} from './interaction/InteractionSystem'
import type { WorldInteraction } from './interaction/InteractionTypes'
import { WORLD_INTERACTIONS } from './interaction/worldInteractions'
import { WORLD_COLLIDERS } from './worldColliders'
import { heightAt } from './worldGen'

/**
 * Draw colliders, interaction radii and the player's collision circle.
 * Development only: ignored in production builds regardless of this value.
 * Also switchable per page load with `?debugCollision` in the URL.
 */
const DEBUG_WORLD_COLLISION = false

const DEFAULT_PROMPT_HEIGHT = 1.8
/** Guidance timers integrate at most this much per frame, like the player controller. */
const MAX_DELTA = 0.1
/** The compass judges a destination visible by this point: roughly the middle of a set, above its base. */
const VIEW_POINT_HEIGHT = 1.2

const anchor = new Vector3()
const viewPoint = new Vector3()

function debugEnabled() {
  if (process.env.NODE_ENV === 'production') return false
  return DEBUG_WORLD_COLLISION || new URLSearchParams(window.location.search).has('debugCollision')
}

/**
 * Connects the world's gameplay records to the generic systems: registers the
 * colliders and interactions, runs the proximity check each frame, guides the
 * compass toward the nearest interaction, projects the active prompt's anchor to
 * the screen, and attaches the interact key.
 *
 * It renders nothing except the optional debug overlay.
 */
export function WorldGameplay() {
  const camera = useThree((state) => state.camera)
  const [registered, setRegistered] = useState(false)
  const [debug] = useState(debugEnabled)

  // Created once per camera, so the frame loop passes it without allocating.
  const screenOffset = useMemo(
    () => (interaction: WorldInteraction) => {
      const [x, y, z] = interaction.position
      viewPoint.set(x, y + VIEW_POINT_HEIGHT, z).project(camera)
      return viewPoint.z > 1 ? Infinity : Math.max(Math.abs(viewPoint.x), Math.abs(viewPoint.y))
    },
    [camera],
  )

  useEffect(() => {
    const cleanups = [...WORLD_COLLIDERS.map(registerCollider), ...WORLD_INTERACTIONS.map(registerInteraction)]
    setRegistered(true)
    return () => {
      for (const cleanup of cleanups) cleanup()
    }
  }, [])

  useEffect(() => attachInteractKey(interact), [])

  // Interacting opens UI (M6), which needs the mouse: end any camera look and free the cursor.
  useEffect(() => onInteraction(() => releaseLook()), [])

  // No destination window exists yet (M6); make interactions visible in development.
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    return onInteraction((i) => console.info(`[interaction] ${i.type} (${i.id})`))
  }, [])

  useFrame((state, delta) => {
    updateInteractions(playerPosition.x, playerPosition.z)

    // The compass guides toward the navigable interactions, so it needs no destination list of its own.
    updateNavigation(
      playerPosition.x,
      playerPosition.z,
      cameraView.yaw,
      Math.min(delta, MAX_DELTA),
      getInteractions(),
      isInteractionEnabled,
      screenOffset,
    )
    const { width, height } = state.size

    const active = getActiveInteraction()
    if (!active) {
      activePromptScreen.visible = false
      return
    }
    anchor.set(active.position[0], active.position[1] + (active.promptHeight ?? DEFAULT_PROMPT_HEIGHT), active.position[2])
    anchor.project(camera)
    // Raw projected position. The DOM prompt clamps it to the viewport, because
    // only it knows its own rendered size.
    activePromptScreen.x = (anchor.x * 0.5 + 0.5) * width
    activePromptScreen.y = (-anchor.y * 0.5 + 0.5) * height
    activePromptScreen.visible = anchor.z < 1
  })

  return debug && registered ? <GameplayDebug /> : null
}

// ---------------------------------------------------------------------------
// Debug overlay (development only)
// ---------------------------------------------------------------------------

const DEBUG_LIFT = 0.07
const RING_SEGMENTS = 48

function ringInto(out: number[], cx: number, cz: number, r: number) {
  for (let i = 0; i < RING_SEGMENTS; i++) {
    const a0 = (i / RING_SEGMENTS) * Math.PI * 2
    const a1 = ((i + 1) / RING_SEGMENTS) * Math.PI * 2
    const x0 = cx + Math.cos(a0) * r
    const z0 = cz + Math.sin(a0) * r
    const x1 = cx + Math.cos(a1) * r
    const z1 = cz + Math.sin(a1) * r
    out.push(x0, heightAt(x0, z0) + DEBUG_LIFT, z0, x1, heightAt(x1, z1) + DEBUG_LIFT, z1)
  }
}

function colliderLines(colliders: WorldCollider[]) {
  const pts: number[] = []
  for (const { position, shape } of colliders) {
    const [cx, , cz] = position
    if (shape.type === 'circle') {
      ringInto(pts, cx, cz, shape.radius)
      continue
    }
    const c = Math.cos(shape.rotation ?? 0)
    const s = Math.sin(shape.rotation ?? 0)
    if (shape.type === 'capsule') {
      // The stadium outline: a half circle round each end of the core segment.
      const outline: number[][] = []
      for (const end of [1, -1]) {
        for (let i = 0; i <= RING_SEGMENTS / 2; i++) {
          const a = -Math.PI / 2 + (i / (RING_SEGMENTS / 2)) * Math.PI + (end < 0 ? Math.PI : 0)
          outline.push([end * shape.halfLength + Math.cos(a) * shape.radius, Math.sin(a) * shape.radius])
        }
      }
      const world = outline.map(([lx, lz]) => {
        const x = cx + lx * c + lz * s
        const z = cz - lx * s + lz * c
        return [x, heightAt(x, z) + DEBUG_LIFT, z]
      })
      for (let i = 0; i < world.length; i++) pts.push(...world[i], ...world[(i + 1) % world.length])
      continue
    }
    const corners = [
      [-shape.halfWidth, -shape.halfDepth],
      [shape.halfWidth, -shape.halfDepth],
      [shape.halfWidth, shape.halfDepth],
      [-shape.halfWidth, shape.halfDepth],
    ].map(([lx, lz]) => {
      const x = cx + lx * c + lz * s
      const z = cz - lx * s + lz * c
      return [x, heightAt(x, z) + DEBUG_LIFT, z]
    })
    for (let i = 0; i < 4; i++) pts.push(...corners[i], ...corners[(i + 1) % 4])
  }
  return geometryFrom(pts)
}

function interactionLines(interactions: WorldInteraction[]) {
  const pts: number[] = []
  for (const { position, interactionRadius } of interactions) ringInto(pts, position[0], position[2], interactionRadius)
  return geometryFrom(pts)
}

function geometryFrom(points: number[]) {
  const g = new BufferGeometry()
  g.setAttribute('position', new Float32BufferAttribute(points, 3))
  return g
}

function GameplayDebug() {
  const colliders = useMemo(() => colliderLines(getColliders()), [])
  const interactions = useMemo(() => interactionLines(getInteractions()), [])
  const playerRing = useMemo(() => {
    const pts: number[] = []
    for (let i = 0; i < RING_SEGMENTS; i++) {
      const a = (i / RING_SEGMENTS) * Math.PI * 2
      pts.push(Math.cos(a) * PLAYER.radius, DEBUG_LIFT, Math.sin(a) * PLAYER.radius)
    }
    return geometryFrom(pts)
  }, [])
  const ringRef = useRef<LineLoop>(null)

  useEffect(
    () => () => {
      colliders.dispose()
      interactions.dispose()
      playerRing.dispose()
    },
    [colliders, interactions, playerRing],
  )

  useFrame(() => {
    ringRef.current?.position.copy(playerPosition)
  })

  return (
    <group renderOrder={999}>
      <lineSegments geometry={colliders}>
        <lineBasicMaterial color="#e5484d" depthTest={false} transparent />
      </lineSegments>
      <lineSegments geometry={interactions}>
        <lineBasicMaterial color="#f0932b" depthTest={false} transparent opacity={0.85} />
      </lineSegments>
      <lineLoop ref={ringRef} geometry={playerRing}>
        <lineBasicMaterial color="#4cc3ff" depthTest={false} transparent />
      </lineLoop>
    </group>
  )
}
