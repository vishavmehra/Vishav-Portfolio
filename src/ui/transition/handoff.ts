/**
 * The handoff between the two worlds.
 *
 *   game ──► cover ──► (route changes underneath) ──► reveal ──► portfolio
 *
 * The old exit faded a parchment sheet over the game, waited a fixed 520 ms and
 * pushed the route. That sheet was the beige frame: it was the game's own
 * loading colour, and it had no idea whether anything was ready behind it — a
 * slow first portfolio frame simply showed through as an unpainted page.
 *
 * So the cover is no longer a timer. It closes over the game, the route changes
 * beneath it, and it stays until the world underneath has actually drawn.
 *
 * "Drawn" has to mean the *arriving* world. The first version of this watched for
 * a canvas of real size and found one immediately — the game's own, still mounted
 * behind the cover — and opened again before the route had even changed. So the
 * watcher holds the canvas that was on screen when the crossing began, and waits
 * for the path to be the destination and for a different canvas to exist.
 * `reportWorldReady` lets a scene say so itself; the watcher is there because
 * nothing should have to.
 *
 * Nothing here publishes per-frame values to React — the phases are the only
 * thing that changes, and each one changes once.
 */

export type HandoffPhase = 'idle' | 'covering' | 'holding' | 'revealing'

/**
 * Time the green closes over the leaving world. The aperture travels the whole
 * frame, so a short duration reads as a snap rather than as air closing in.
 */
export const COVER_MS = 620
/** Time the arriving world emerges from it. */
export const REVEAL_MS = 700
/**
 * The longest the cover will ever wait for a world that never reports. A visitor
 * must never be held behind it: if the scene is still not ready, the reveal runs
 * anyway and the scene finishes arriving in view.
 */
const READY_TIMEOUT_MS = 3200
/** Frames to let pass after a canvas appears, so the reveal never shows frame zero. */
const SETTLE_FRAMES = 2

let phase: HandoffPhase = 'idle'
const listeners = new Set<() => void>()
let timers: number[] = []
let watching = false
/** The canvas the leaving world was drawing into, so it cannot be mistaken for the arriving one. */
let staleCanvas: HTMLCanvasElement | null = null
/** Where we are going. The crossing is not over until the path says so. */
let destination = ''

function publish(next: HandoffPhase) {
  if (phase === next) return
  phase = next
  for (const listener of listeners) listener()
}

function clearTimers() {
  for (const timer of timers) window.clearTimeout(timer)
  timers = []
}

function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Cover, then reveal. Reduced motion keeps every step, just shortens them. */
export function coverMs() {
  return reducedMotion() ? 140 : COVER_MS
}

export function revealMs() {
  return reducedMotion() ? 160 : REVEAL_MS
}

/**
 * Starts the handoff. `navigate` is called once the screen is covered — the
 * route change happens under the green, so it is never visible.
 */
export function beginHandoff(navigate: () => void, to: string) {
  if (phase !== 'idle') return
  clearTimers()
  destination = to
  staleCanvas = document.querySelector('canvas')
  publish('covering')

  timers.push(
    window.setTimeout(() => {
      publish('holding')
      navigate()
      watchForWorld()
      // The backstop: a world that never reports is revealed anyway.
      timers.push(window.setTimeout(() => reveal(), READY_TIMEOUT_MS))
    }, coverMs()),
  )
}

/** The arriving scene says it is drawing. Safe to call more than once. */
export function reportWorldReady() {
  if (phase !== 'holding') return
  reveal()
}

function reveal() {
  if (phase !== 'holding') return
  clearTimers()
  watching = false
  staleCanvas = null
  publish('revealing')
  timers.push(
    window.setTimeout(() => {
      publish('idle')
    }, revealMs()),
  )
}

/**
 * Waits for the arriving world to paint.
 *
 * A canvas with real size is the signal that a renderer exists and has been
 * laid out; two frames after that, it has drawn something. This needs no
 * cooperation from the scene, which is the point — the handoff cannot be broken
 * by a page that forgets to report.
 */
function watchForWorld() {
  if (watching) return
  watching = true
  let settled = 0

  const look = () => {
    if (!watching || phase !== 'holding') return
    // The route has to have changed first: until then, anything on screen is
    // still the world being left.
    if (location.pathname === destination) {
      const canvases = [...document.querySelectorAll('canvas')]
      const arrived = canvases.find(
        (canvas) => canvas !== staleCanvas && canvas.clientWidth > 0 && canvas.clientHeight > 0,
      )
      if (arrived && ++settled >= SETTLE_FRAMES) {
        reveal()
        return
      }
    }
    requestAnimationFrame(look)
  }
  requestAnimationFrame(look)
}

export function subscribeHandoff(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getHandoffPhase(): HandoffPhase {
  return phase
}

export function getServerHandoffPhase(): HandoffPhase {
  return 'idle'
}
