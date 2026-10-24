/**
 * Leaving the world.
 *
 *   hold X (desktop) ──┐
 *   EXIT button ───────┼──► leaving ──► /portfolio
 *   E at the gate ─────┘
 *
 * The hold is deliberate: X is reachable from anywhere, so it takes a moment of
 * intent rather than a stray keypress to end the visit. Releasing early cancels
 * and the progress falls back, so a mis-press costs nothing.
 *
 * Progress is polled from the frame loop by the HUD ring, never published to
 * React (CLAUDE.md §29); only the three coarse transitions — hold started,
 * cancelled, leaving — notify subscribers.
 */

/** Seconds of held X needed to leave. Long enough to be deliberate, short enough not to nag. */
export const EXIT_HOLD_SECONDS = 0.9
/** Progress falls back this many times faster than it builds. */
const RELEASE_RATE = 2.5

/** 0 … 1. Read in the frame loop. */
export const exitHold = { progress: 0, holding: false }

let leaving = false
const listeners = new Set<() => void>()

function publish() {
  for (const listener of listeners) listener()
}

export function subscribeExit(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function isLeaving() {
  return leaving
}

export function setExitHolding(next: boolean) {
  if (leaving || next === exitHold.holding) return
  exitHold.holding = next
  publish()
}

/** Leave now, with no hold — the touch EXIT button and the gate's own interaction. */
export function requestExit() {
  if (leaving) return
  leaving = true
  exitHold.holding = false
  exitHold.progress = 1
  publish()
}

/**
 * Advances the hold. Called once per frame with the frame delta; returns the
 * current progress so the caller can draw it without a second lookup.
 */
export function advanceExitHold(delta: number) {
  if (leaving) return 1
  const before = exitHold.progress
  if (exitHold.holding) {
    exitHold.progress = Math.min(1, before + delta / EXIT_HOLD_SECONDS)
    if (exitHold.progress >= 1) requestExit()
  } else if (before > 0) {
    exitHold.progress = Math.max(0, before - (delta / EXIT_HOLD_SECONDS) * RELEASE_RATE)
  }
  return exitHold.progress
}

/** Test seam: returns the store to its initial state. */
export function resetExit() {
  leaving = false
  exitHold.holding = false
  exitHold.progress = 0
}
