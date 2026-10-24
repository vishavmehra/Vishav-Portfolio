'use client'

import { useEffect, useRef } from 'react'

import { clearTouchInput, setTouchInput } from '@/input/movementInput'
import { useTouchControls } from './useTouchControls'

/** Visual radius of the base, in px. Knob travel is clamped to this. */
const BASE_RADIUS = 58
/** Below this fraction of the radius the input is treated as neutral. */
const DEAD_ZONE = 0.12

/**
 * Virtual movement joystick for touch devices.
 *
 * Produces a normalised 2D vector and hands it to the shared movement input.
 * It contains no movement logic of its own — the player controller consumes
 * the same vector whether it came from here or from the keyboard.
 *
 * Continuous pointer values never enter React state: the knob is positioned by
 * mutating its transform directly, so dragging causes zero re-renders.
 */
export function MovementJoystick() {
  // Touch-primary devices, plus hybrids after a genuine touch (useTouchControls).
  const visible = useTouchControls()
  const baseRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const pointerId = useRef<number | null>(null)
  // Logical base centre, captured on pointerdown so the input stays anchored
  // even when the finger travels outside the visible base.
  const origin = useRef({ x: 0, y: 0 })

  // Always release the shared input if this component goes away mid-drag.
  useEffect(() => clearTouchInput, [])

  const moveKnob = (dx: number, dy: number) => {
    const knob = knobRef.current
    if (knob) knob.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
  }

  const reset = () => {
    pointerId.current = null
    moveKnob(0, 0)
    baseRef.current?.removeAttribute('data-active')
    clearTouchInput()
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== null) return
    const base = baseRef.current
    if (!base) return

    pointerId.current = event.pointerId
    base.setPointerCapture(event.pointerId)
    base.setAttribute('data-active', '')

    const rect = base.getBoundingClientRect()
    origin.current.x = rect.left + rect.width / 2
    origin.current.y = rect.top + rect.height / 2
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerId !== pointerId.current) return

    let dx = event.clientX - origin.current.x
    let dy = event.clientY - origin.current.y

    const distance = Math.hypot(dx, dy)
    if (distance > BASE_RADIUS) {
      const scale = BASE_RADIUS / distance
      dx *= scale
      dy *= scale
    }

    moveKnob(dx, dy)

    const magnitude = Math.min(distance, BASE_RADIUS) / BASE_RADIUS
    if (magnitude < DEAD_ZONE) {
      clearTouchInput()
      return
    }

    // Screen y grows downward; forward is up.
    setTouchInput(dx / BASE_RADIUS, -dy / BASE_RADIUS)
  }

  const onPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerId !== pointerId.current) return
    reset()
  }

  if (!visible) return null

  return (
    <div
      ref={baseRef}
      role="application"
      aria-label="Movement joystick. Drag to move. On a keyboard, use W A S D or the arrow keys."
      className="joystick"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onLostPointerCapture={onPointerEnd}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div ref={knobRef} className="joystick-knob" />
    </div>
  )
}
