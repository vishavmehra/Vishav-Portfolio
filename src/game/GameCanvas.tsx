'use client'

import { Component, useEffect, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PCFShadowMap, WebGLRenderer, type WebGLRendererParameters } from 'three'

import { FollowCamera } from '@/game/camera/FollowCamera'
import { EntryRig } from '@/game/entry/EntryRig'
import { CAMERA, WORLD } from '@/game/config'
import { failLoading, getLoadingSnapshot, markFrameRendered, subscribeLoading } from '@/game/loading/loadingState'
import { PlayerController } from '@/game/player/PlayerController'
import { TimeOfDayRig } from '@/game/world/TimeOfDayRig'
import { World } from '@/game/world/World'
import { WorldGameplay } from '@/game/world/WorldGameplay'
import { setGameInputEnabled } from '@/input/inputGate'

/**
 * First-frame clear colour, before the time-of-day rig takes the fog and
 * background over on frame one. Deep forest rather than the old parchment: the
 * entry screen opens on this, and no part of either world is beige any more.
 */
const HAZE = '#0d1310'

/**
 * R3F's own renderer construction, with a failure reported to the loading screen.
 * R3F creates the renderer inside an un-awaited promise, so without this a device
 * that cannot give a WebGL2 context would leave the loading screen up forever.
 */
function createRenderer(defaults: WebGLRendererParameters) {
  try {
    return new WebGLRenderer(defaults)
  } catch (error) {
    failLoading()
    throw error
  }
}

export function GameCanvas() {
  // Nothing moves, looks or interacts behind the loading screen; input returns the moment it lifts.
  useEffect(() => {
    const sync = () => setGameInputEnabled(getLoadingSnapshot().phase === 'ready')
    sync()
    return subscribeLoading(sync)
  }, [])

  return (
    <WorldBoundary>
      <Canvas
        gl={createRenderer}
        shadows={{ type: PCFShadowMap }}
        dpr={[1, 2]}
        camera={{
          position: [
            WORLD.spawnX + CAMERA.offsetX,
            CAMERA.offsetY,
            WORLD.spawnZ + CAMERA.offsetZ,
          ],
          fov: CAMERA.fov,
          near: CAMERA.near,
          far: 220,
        }}
      >
        <color attach="background" args={[HAZE]} />

        {/*
          Lights, fog and clear colour all belong to the time-of-day rig: it holds
          the same hemisphere pair and key light this scene always had, and eases
          their values between morning, afternoon, evening and night. The shadow
          frustum stays ±70 over the block-out world (plan P10 remains open).
        */}
        <TimeOfDayRig />

        <World />
        <WorldGameplay />
        <PlayerController />
        <FollowCamera />
        {/* Mounted after the gameplay camera so it runs after it: the entry shot
            blends out of whatever pose that camera computed, which is what makes
            the hand-over seamless without the gameplay rig knowing about it. */}
        <EntryRig />
        <LoadingProbe />
      </Canvas>
    </WorldBoundary>
  )
}

/** Tells the loading screen frames are being drawn; it decides when that means ready. */
function LoadingProbe() {
  useFrame(() => markFrameRendered())
  return null
}

/**
 * The canvas rethrows anything that breaks inside the scene. Individual assets
 * have their own AssetBoundary fallbacks; reaching this one means the world itself
 * cannot run, so the loading screen shows its error state instead of hanging.
 */
class WorldBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error('[world] the 3D world failed to start.', error)
    failLoading()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
