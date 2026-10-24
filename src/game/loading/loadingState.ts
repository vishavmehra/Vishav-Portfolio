/**
 * Initial load: real progress and the moment the world may be revealed
 * (CLAUDE.md §5, docs/05 §3, docs/09 §18).
 *
 * Tracks every GLB requested while the world first mounts — whatever requests it,
 * so a newly integrated asset is covered without being listed anywhere.
 *
 * - Progress is bytes received per asset, averaged across assets. Download is most
 *   of the work, not all of it, so an asset counts as complete only once the
 *   component using it has committed to the scene (or its load failed and the
 *   fallback stands in).
 * - Loading gives way to the landing screen SETTLE_FRAMES rendered frames after the
 *   last asset settles, so it never shows a proxy swapping to its GLB or a frame
 *   still compiling shaders. Nothing is padded: a fast load lands immediately.
 * - A request that never finishes cannot hold the visitor: after ASSET_TIMEOUT_MS
 *   the world opens with fallbacks and the asset appears whenever it lands.
 * - `landing` is the built world waiting behind the title card. The visitor enters
 *   deliberately; only then does `ready` open the input gate.
 *
 * React sees only the phase and a coarse progress value, and only when they change.
 */

export type LoadingPhase = 'loading' | 'landing' | 'ready' | 'error'
export type LoadingSnapshot = { phase: LoadingPhase; progress: number }

const SETTLE_FRAMES = 2
const ASSET_TIMEOUT_MS = 15_000
/** Download share of an asset's progress; parse and first render are the rest. */
const DOWNLOAD_SHARE = 0.9
/** Progress is published in 2% steps — finer changes nothing a visitor can see. */
const PROGRESS_STEPS = 50

/** url → downloaded fraction, 0…1. */
const requested = new Map<string, number>()
const settled = new Set<string>()
const listeners = new Set<() => void>()
const SERVER_SNAPSHOT: LoadingSnapshot = { phase: 'loading', progress: 0 }
let snapshot = SERVER_SNAPSHOT
let firstFrameAt = -1
let settledFrames = 0

function publish(next: LoadingSnapshot) {
  snapshot = next
  for (const listener of listeners) listener()
}

function publishProgress() {
  if (snapshot.phase !== 'loading' || requested.size === 0) return
  let sum = 0
  for (const [url, fraction] of requested) sum += settled.has(url) ? 1 : fraction * DOWNLOAD_SHARE
  const progress = Math.floor((sum / requested.size) * PROGRESS_STEPS) / PROGRESS_STEPS
  // Never moves backwards, even if a late request joins the average.
  if (progress > snapshot.progress) publish({ phase: 'loading', progress })
}

/**
 * Called while rendering the component that needs `url`. Deliberately silent:
 * notifying subscribers mid-render would update other components during render.
 */
export function beginAsset(url: string) {
  if (snapshot.phase === 'loading' && !requested.has(url)) requested.set(url, 0)
}

export function reportAssetProgress(url: string, loaded: number, total: number) {
  // No Content-Length: the asset still counts once it settles.
  if (!requested.has(url) || total <= 0) return
  requested.set(url, Math.min(1, loaded / total))
  publishProgress()
}

/** The asset is in the scene, or failed and its fallback is. Safe to call repeatedly. */
export function settleAsset(url: string) {
  if (settled.has(url) || !requested.has(url)) return
  settled.add(url)
  publishProgress()
}

/** Called from the frame loop until the world is revealed. */
export function markFrameRendered(now = performance.now()) {
  if (snapshot.phase !== 'loading') return
  if (firstFrameAt < 0) firstFrameAt = now

  let pending = false
  for (const url of requested.keys()) {
    if (!settled.has(url)) {
      pending = true
      break
    }
  }
  if (pending) {
    if (now - firstFrameAt < ASSET_TIMEOUT_MS) {
      settledFrames = 0
      return
    }
    if (settledFrames === 0) console.warn('[loading] assets still pending; entering the world with fallbacks.')
  }

  if (++settledFrames >= SETTLE_FRAMES) publish({ phase: 'landing', progress: 1 })
}

/** The visitor chose to enter — X, or the touch button. Opens gameplay input. */
export function enterWorld() {
  if (snapshot.phase === 'landing') publish({ phase: 'ready', progress: 1 })
}

/** Something the world cannot run without failed (renderer creation, scene construction). */
export function failLoading() {
  if (snapshot.phase === 'loading') publish({ phase: 'error', progress: snapshot.progress })
}

export function subscribeLoading(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getLoadingSnapshot(): LoadingSnapshot {
  return snapshot
}

export function getServerLoadingSnapshot(): LoadingSnapshot {
  return SERVER_SNAPSHOT
}
