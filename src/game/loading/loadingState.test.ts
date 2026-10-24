/**
 * Checks for initial-load readiness.
 * Run: node --test src/game/loading/loadingState.test.ts
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'

type Store = typeof import('./loadingState.ts')

/** A fresh module instance per test, since the store is module state. */
const fresh = (tag: string): Promise<Store> => import(`./loadingState.ts?${tag}`)

test('landing only after every asset settles and frames render; ready only on entry', async () => {
  const s = await fresh('ready')
  s.beginAsset('/a.glb')
  s.beginAsset('/b.glb')
  s.beginAsset('/a.glb')

  s.reportAssetProgress('/a.glb', 50, 100)
  const half = s.getLoadingSnapshot().progress
  assert.ok(half > 0 && half < 0.5, `progress ${half}`)

  s.settleAsset('/a.glb')
  s.reportAssetProgress('/a.glb', 10, 100)
  assert.ok(s.getLoadingSnapshot().progress >= half, 'never moves backwards')

  for (let i = 0; i < 5; i++) s.markFrameRendered(i)
  assert.equal(s.getLoadingSnapshot().phase, 'loading', 'b is still pending')

  s.settleAsset('/b.glb')
  s.markFrameRendered(6)
  assert.equal(s.getLoadingSnapshot().phase, 'loading', 'one frame is not enough')
  s.markFrameRendered(7)
  assert.deepEqual(s.getLoadingSnapshot(), { phase: 'landing', progress: 1 }, 'the world waits behind the landing card')

  s.failLoading()
  assert.equal(s.getLoadingSnapshot().phase, 'landing', 'a finished load cannot fail')

  s.enterWorld()
  assert.deepEqual(s.getLoadingSnapshot(), { phase: 'ready', progress: 1 })
  s.enterWorld()
  assert.equal(s.getLoadingSnapshot().phase, 'ready', 'entering twice is harmless')
})

test('the world cannot be entered before it has loaded', async () => {
  const s = await fresh('early-entry')
  s.beginAsset('/a.glb')
  s.enterWorld()
  assert.equal(s.getLoadingSnapshot().phase, 'loading', 'X does nothing while the bar is still filling')
})

test('a stalled asset cannot hold the world past the timeout', async () => {
  const s = await fresh('timeout')
  s.beginAsset('/stalled.glb')
  s.markFrameRendered(0)
  s.markFrameRendered(1_000)
  s.markFrameRendered(2_000)
  assert.equal(s.getLoadingSnapshot().phase, 'loading')
  s.markFrameRendered(16_000)
  s.markFrameRendered(16_016)
  assert.equal(s.getLoadingSnapshot().phase, 'landing')
})

test('unrequested urls (textures inside a GLB) are ignored; failure is terminal', async () => {
  const s = await fresh('error')
  s.beginAsset('/a.glb')
  s.settleAsset('blob:texture')
  s.markFrameRendered(0)
  s.markFrameRendered(16)
  assert.equal(s.getLoadingSnapshot().phase, 'loading')
  s.failLoading()
  s.settleAsset('/a.glb')
  s.markFrameRendered(32)
  s.markFrameRendered(48)
  assert.equal(s.getLoadingSnapshot().phase, 'error')
})
