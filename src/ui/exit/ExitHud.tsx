'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { getLoadingSnapshot, subscribeLoading } from '@/game/loading/loadingState'
import {
  advanceExitHold,
  exitHold,
  isLeaving,
  requestExit,
  setExitHolding,
  subscribeExit,
} from '@/game/world/exitState'
import { isGameInputEnabled, setGameInputEnabled } from '@/input/inputGate'
import { useTouchControls } from '@/ui/controls/useTouchControls'
import { beginHandoff } from '@/ui/transition/handoff'

/**
 * The way out, always visible and always available.
 *
 * Leaving is a HUD action, not an interaction: there is nowhere to walk to, no
 * object to find and no E to press first. Holding X anywhere in the world leaves;
 * releasing early cancels and the progress falls back, so a mis-press costs
 * nothing.
 *
 * Desktop: a small persistent `HOLD X TO EXIT` hint that fills as X is held.
 * Touch: a compact EXIT button beside the joystick. One tap, no hold — a hold
 * gesture would compete with the joystick for the same thumb.
 *
 * The fill is drawn by mutating a CSS variable in a rAF loop; React sees only
 * whether the world is ready. The crossing itself belongs to the handoff layer.
 */
export function ExitHud() {
  const router = useRouter()
  const touch = useTouchControls()
  const [ready, setReady] = useState(() => getLoadingSnapshot().phase === 'ready')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => subscribeLoading(() => setReady(getLoadingSnapshot().phase === 'ready')), [])

  // Hold X. Ignored while the gate is shut, so the landing screen's own X cannot
  // start an exit the moment the world opens.
  useEffect(() => {
    if (!ready) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'KeyX' || event.repeat) return
      if (event.ctrlKey || event.metaKey || event.altKey) return
      if (!isGameInputEnabled()) return
      setExitHolding(true)
    }
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'KeyX') setExitHolding(false)
    }
    const release = () => setExitHolding(false)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', release)
    document.addEventListener('visibilitychange', release)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', release)
      document.removeEventListener('visibilitychange', release)
      release()
    }
  }, [ready])

  // One loop drives the fill and the hold's own clock.
  useEffect(() => {
    if (!ready) return
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.1)
      last = now
      const progress = advanceExitHold(delta)
      const el = ref.current
      if (el) {
        el.style.setProperty('--exit-progress', progress.toFixed(3))
        if (exitHold.holding) el.setAttribute('data-holding', '')
        else el.removeAttribute('data-holding')
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [ready])

  // Leaving: close input and hand over. The handoff owns the cover, the route
  // change and the reveal — it changes the page only once the screen is covered,
  // and holds the cover until the portfolio has actually painted.
  useEffect(
    () =>
      subscribeExit(() => {
        if (!isLeaving()) return
        setGameInputEnabled(false)
        beginHandoff(() => router.push('/portfolio'), '/portfolio')
      }),
    [router],
  )

  if (!ready) return null

  return (
    <>
      {touch ? (
        <button type="button" className="exit-button" onClick={() => requestExit()}>
          Exit
        </button>
      ) : (
        <div ref={ref} className="exit-hint" aria-hidden="true">
          <span className="exit-hint-fill" />
          <kbd>X</kbd>
          <span>Hold to exit world</span>
        </div>
      )}
    </>
  )
}
