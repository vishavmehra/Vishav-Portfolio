'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'

import {
  activePromptScreen,
  getActiveInteraction,
  getLastActiveInteraction,
  subscribeActiveInteraction,
} from '@/game/world/interaction/InteractionSystem'

const getServerSnapshot = () => null

/** Minimum gap between the pill and any viewport edge, in px. */
const EDGE = 16
/** Keeps the pill above the on-screen touch controls at the bottom. */
const BOTTOM_CLEARANCE = 150
/** Keeps the pill below the compass at the top. */
const TOP_CLEARANCE = 76

/**
 * The contextual interaction prompt (docs/05 §4): a small warm pill anchored just
 * above the active destination, with an `E` key cap on keyboard devices. On touch
 * devices the key cap is hidden; the Interact button is the affordance there.
 *
 * React re-renders only when the active interaction changes. While visible, the
 * position follows the destination through a requestAnimationFrame loop that
 * writes the element's transform directly, never through React state.
 */
export function InteractionPrompt() {
  const active = useSyncExternalStore(subscribeActiveInteraction, getActiveInteraction, getServerSnapshot)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active) return
    let frame = 0
    let lastX = NaN
    let lastY = NaN
    let lastVisible: boolean | null = null
    // The label is fixed for a given interaction, so measure once rather than every frame.
    const halfWidth = (ref.current?.offsetWidth ?? 0) / 2
    const pillHeight = ref.current?.offsetHeight ?? 0
    const tick = () => {
      const el = ref.current
      if (el) {
        // Anchor is the pill's bottom-centre; clamp so the whole pill stays on screen.
        const maxX = window.innerWidth - EDGE - halfWidth
        const maxY = window.innerHeight - BOTTOM_CLEARANCE
        const x = Math.round(Math.min(Math.max(activePromptScreen.x, EDGE + halfWidth), Math.max(maxX, EDGE + halfWidth)))
        const y = Math.round(Math.min(Math.max(activePromptScreen.y, TOP_CLEARANCE + pillHeight), Math.max(maxY, TOP_CLEARANCE + pillHeight)))
        if (x !== lastX || y !== lastY) {
          el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%)`
          lastX = x
          lastY = y
        }
        if (activePromptScreen.visible !== lastVisible) {
          el.style.visibility = activePromptScreen.visible ? 'visible' : 'hidden'
          lastVisible = activePromptScreen.visible
        }
      }
      frame = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frame)
  }, [active])

  // Keep the last label while fading out rather than flashing an empty pill.
  const label = (active ?? getLastActiveInteraction())?.prompt ?? ''

  return (
    <>
      <div ref={ref} className="interaction-prompt" data-visible={active ? '' : undefined} aria-hidden="true">
        <kbd className="interaction-key">E</kbd>
        <span>{label}</span>
      </div>
      {/* Announced once when an interaction becomes available; the pill itself is decorative. */}
      <div className="sr-only" role="status" aria-live="polite">
        {active ? `${active.prompt} available` : ''}
      </div>
    </>
  )
}
