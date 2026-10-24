'use client'

import { useRef, useSyncExternalStore } from 'react'

import { getActiveInteraction, interact, subscribeActiveInteraction } from '@/game/world/interaction/InteractionSystem'
import { isGameInputEnabled } from '@/input/inputGate'
import { useTouchControls } from './useTouchControls'

const getServerSnapshot = () => null

function trigger() {
  if (isGameInputEnabled()) interact()
}

/**
 * Contextual touch INTERACT button (docs/03 §12, docs/05 §11): bottom-right, at
 * least 56 px, shown only while an interaction is available. It calls the same
 * `interact()` as the E key, so there is one interaction path for every device.
 *
 * Pointer presses activate on release over the button, handled directly: mobile
 * Chromium synthesises no `click` for a tap while another finger is already down,
 * so a thumb on the joystick or dragging the camera would otherwise swallow the
 * tap. Clicks with `detail === 0` — Enter/Space, assistive technology — still
 * activate through `onClick`; pointer-generated clicks are ignored so nothing
 * fires twice.
 */
export function InteractButton() {
  const touch = useTouchControls()
  const active = useSyncExternalStore(subscribeActiveInteraction, getActiveInteraction, getServerSnapshot)
  const pressId = useRef<number | null>(null)
  if (!touch) return null

  return (
    <button
      type="button"
      className="interact-button"
      data-visible={active ? '' : undefined}
      aria-hidden={!active}
      tabIndex={active ? 0 : -1}
      onPointerDown={(event) => {
        if (pressId.current !== null) return
        pressId.current = event.pointerId
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerUp={(event) => {
        if (event.pointerId !== pressId.current) return
        pressId.current = null
        const r = event.currentTarget.getBoundingClientRect()
        const inside = event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom
        if (inside) trigger()
      }}
      onPointerCancel={() => {
        pressId.current = null
      }}
      onClick={(event) => {
        if (event.detail === 0) trigger()
      }}
    >
      {active?.prompt ?? 'Interact'}
    </button>
  )
}
