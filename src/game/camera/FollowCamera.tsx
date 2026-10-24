'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, Raycaster, Vector3, type Intersection, type Object3D } from 'three'

import { CAMERA, CAMERA_YAW, cameraFov, cameraOffsetScale } from '@/game/config'
import { playerPosition } from '@/game/player/playerState'
import { heightAt } from '@/game/world/worldGen'
import { attachLookInput, consumeLookDelta } from '@/input/lookInput'
import { cameraView } from './cameraState'

// Reused every frame (CLAUDE.md §30).
const head = new Vector3()
const orbit = new Vector3()
const body = new Vector3()
const look = { x: 0, y: 0 }
const raycaster = new Raycaster()
const hits: Intersection[] = []
/** Stand off the surface we hit so the near plane never clips through it. */
const OCCLUDER_MARGIN = 0.55
/**
 * The second occlusion ray starts this far below the orbit centre, at the
 * character's chest. The orbit centre sits above the head, so on its own its ray
 * can clear a roof edge or branch that still hides the body (docs/09 F4).
 */
const BODY_RAY_DROP = 1.4
/**
 * The camera never dollies closer than this to the look-at point. An occluder
 * shortens the distance; it must not be able to shorten it to nothing, or the
 * shot ends up inside the character.
 */
const MIN_DISTANCE = 1.15
/** Dolly-in damping. Fast, because easing in would show the inside of a wall while turning. */
const PULL_IN_DAMPING = 26

/**
 * Third-person orbit camera (DD-28).
 *
 * The camera orbits the look-at point (player + lookAtHeight) at a yaw and pitch
 * the visitor controls through the shared look input. At rest it reproduces the
 * authored CAMERA offset exactly, including the aspect-scaled mobile framing.
 *
 * Per frame:
 *   player → eased orbit centre → desired position on the orbit
 *          → occlusion rays (dolly in) → terrain floor → render
 *
 * The orbit centre trails the player slightly, so walking still feels like a
 * composition that follows. Occluders pull the camera in immediately and release
 * it gently: easing *in* would show the inside of a wall while turning.
 *
 * Runs entirely in the frame loop — the camera transform never passes through
 * React state. Collision and interaction know nothing about it.
 */
export function FollowCamera() {
  const camera = useThree((state) => state.camera)
  const surface = useThree((state) => state.gl.domElement)
  const rig = useRef({ initialized: false, yaw: CAMERA_YAW, pitch: 0, targetYaw: CAMERA_YAW, targetPitch: 0, distance: 0, fov: 0 })
  const anchor = useRef(new Vector3())
  const target = useRef(new Vector3())
  const occluderRoots = useRef<Object3D[]>([])

  useEffect(() => attachLookInput(surface, CAMERA.touchLookScale), [surface])

  useFrame((state, delta) => {
    const r = rig.current

    // Read straight from the frame state — subscribing to size through React
    // would be a render per resize frame for a value used only here.
    const aspect = state.size.width / state.size.height
    const scale = cameraOffsetScale(aspect)

    // Widening the FOV is the only thing that opens the horizontal cone on a
    // narrow screen. Only touch the projection matrix when the value changes.
    const fov = cameraFov(aspect)
    if (fov !== r.fov && 'fov' in camera) {
      r.fov = fov
      camera.fov = fov
      camera.updateProjectionMatrix()
    }

    // The authored rest offset, measured from the look-at point instead of the feet.
    const restRise = CAMERA.offsetY * scale - CAMERA.lookAtHeight
    const restBack = Math.hypot(CAMERA.offsetX, CAMERA.offsetZ) * scale
    const wanted = Math.hypot(restRise, restBack)

    head.set(playerPosition.x, playerPosition.y + CAMERA.lookAtHeight, playerPosition.z)

    // Mouse right looks right (yaw decreases); mouse up looks up (camera drops).
    consumeLookDelta(look)
    r.targetYaw -= look.x * CAMERA.lookSensitivity
    r.targetPitch = MathUtils.clamp(r.targetPitch + look.y * CAMERA.pitchSensitivity, CAMERA.minPitch, CAMERA.maxPitch)

    if (r.initialized) {
      const turn = 1 - Math.exp(-CAMERA.lookDamping * delta)
      r.yaw += (r.targetYaw - r.yaw) * turn
      r.pitch += (r.targetPitch - r.pitch) * turn
      anchor.current.lerp(head, 1 - Math.exp(-CAMERA.positionDamping * delta))
      target.current.lerp(head, 1 - Math.exp(-CAMERA.targetDamping * delta))
    } else {
      // Snap on the first frame so the camera never swoops in from its initial position.
      r.targetPitch = MathUtils.clamp(Math.atan2(restRise, restBack), CAMERA.minPitch, CAMERA.maxPitch)
      r.pitch = r.targetPitch
      r.yaw = r.targetYaw
      anchor.current.copy(head)
      target.current.copy(head)
    }

    const cosPitch = Math.cos(r.pitch)
    orbit.set(Math.sin(r.yaw) * cosPitch, Math.sin(r.pitch), Math.cos(r.yaw) * cosPitch)

    // Occlusion: rays out toward where the camera wants to be. The orbit centre sits
    // above the head, so a second ray from the chest catches a roof edge or branch that
    // the first clears. Structures and trees register under groups named `occluders`.
    if (occluderRoots.current.length === 0) {
      state.scene.traverse((o) => {
        if (o.name === 'occluders') occluderRoots.current.push(o)
      })
    }
    let allowed = wanted
    const roots = occluderRoots.current
    if (roots.length > 0) {
      body.copy(anchor.current).y -= BODY_RAY_DROP
      const nearest = Math.min(hitDistance(anchor.current, wanted, roots), hitDistance(body, wanted, roots))
      // Keep the margin from the surface, but never end up past it: a wall closer than
      // the margin still leaves the camera on the player's side (docs/09 F4).
      if (nearest < wanted) allowed = Math.max(nearest * 0.5, nearest - OCCLUDER_MARGIN)
    }

    if (allowed < MIN_DISTANCE) allowed = MIN_DISTANCE

    // Distance is the only thing an obstacle may change. Pulling in is quick but
    // still eased, so a branch entering the line does not jump the shot by a metre
    // in one frame; releasing uses the gentler position damping.
    const damping = allowed < r.distance ? PULL_IN_DAMPING : CAMERA.positionDamping
    if (!r.initialized) r.distance = allowed
    else r.distance += (allowed - r.distance) * (1 - Math.exp(-damping * delta))

    // Ground clearance as a *distance* limit, not a height clamp. Lifting the camera
    // out of the ground would change the pitch the visitor set; shortening the orbit
    // radius along the same direction keeps yaw and pitch exactly as they are.
    for (let i = 0; i < 3; i++) {
      camera.position.copy(orbit).multiplyScalar(r.distance).add(anchor.current)
      const floor = heightAt(camera.position.x, camera.position.z) + CAMERA.groundClearance
      const below = floor - camera.position.y
      if (below <= 0) break
      const rise = Math.max(orbit.y, 0.2)
      r.distance = Math.max(MIN_DISTANCE, r.distance - below / rise)
    }

    // The aim never moves with the dolly: the look-at point is the same smoothed
    // point at every distance, so closing in on a tree cannot tilt the shot.
    camera.lookAt(target.current)
    cameraView.yaw = r.yaw
    r.initialized = true
  })

  return null
}

/** Distance to the first occluder along the orbit direction, or `far` if the line is clear. Allocation-free. */
function hitDistance(origin: Vector3, far: number, roots: Object3D[]) {
  raycaster.set(origin, orbit)
  raycaster.far = far
  hits.length = 0
  raycaster.intersectObjects(roots, true, hits)
  return hits.length === 0 ? far : hits[0].distance
}
