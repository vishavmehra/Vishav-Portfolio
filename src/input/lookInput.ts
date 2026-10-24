/**
 * Shared camera-look input.
 *
 *   Mouse over the world ───┐
 *                           ├──► accumulated { x, y } pixel delta ──► FollowCamera
 *   Touch (drag right half) ┘
 *
 * Sources add screen-space deltas; the camera consumes and clears them once per
 * frame, so it cannot tell which device produced them — the same shape as
 * movementInput. Never React state: pointer moves arrive faster than frames
 * (CLAUDE.md §29).
 *
 * There is no pointer lock, no button to hold and no cursor capture. The cursor
 * stays visible and keeps working on the HUD; moving it across the canvas turns
 * the camera, and moving it across a control does not.
 *
 * Holding Left Ctrl pauses the look entirely, so the cursor can cross the whole
 * screen to reach a control without turning the camera on the way.
 *
 * No look happens while the input gate is closed, and closing it ends any in progress.
 */

import { isGameInputEnabled, onGameInputChange } from './inputGate'

const pending = { x: 0, y: 0 }
/** True while Left Ctrl is held: the camera ignores mouse movement (spec Part 10). */
let lookPaused = false
const pauseListeners = new Set<(paused: boolean) => void>()

export function isLookPaused() {
  return lookPaused
}

/** Notified when the Ctrl pause turns on or off. Returns an unsubscribe function. */
export function onLookPauseChange(listener: (paused: boolean) => void): () => void {
  pauseListeners.add(listener)
  return () => {
    pauseListeners.delete(listener)
  }
}

/**
 * Pausing and resuming both drop whatever movement has accumulated. That is the
 * whole trick: the camera cannot lurch on release by replaying the travel the
 * cursor made on its way to a button.
 */
function setLookPaused(next: boolean) {
  if (next === lookPaused) return
  lookPaused = next
  pending.x = 0
  pending.y = 0
  for (const listener of pauseListeners) listener(next)
}

/** Receives pending look movement in CSS pixels and clears it. Allocation-free. */
export function consumeLookDelta(out: { x: number; y: number }) {
  out.x = pending.x
  out.y = pending.y
  pending.x = 0
  pending.y = 0
}

/** Ends whatever look gesture is active on the attached surface. */
let endActiveLook: (() => void) | null = null

/**
 * Stops any camera look in progress — call it when UI needs the mouse, e.g. a
 * destination window opening.
 */
export function releaseLook() {
  endActiveLook?.()
  pending.x = 0
  pending.y = 0
}

/**
 * Largest per-event movement we trust, in CSS pixels. Clamped rather than dropped:
 * a fast turn is exactly the gesture that produces oversized deltas, and dropping
 * those made quick sweeps stall.
 */
const MAX_EVENT_DELTA = 260
/** Touches starting at or right of this fraction of the surface's width look around. */
const TOUCH_LOOK_FROM = 0.5

const clamp = (value: number) => (value > MAX_EVENT_DELTA ? MAX_EVENT_DELTA : value < -MAX_EVENT_DELTA ? -MAX_EVENT_DELTA : value)

/**
 * Attaches camera look to a surface (the canvas). Returns a cleanup function.
 *
 * Mouse: no click, no button. While the cursor is over the canvas its travel turns
 * the camera; `movementX/Y` is used where the browser provides it and the distance
 * between consecutive positions otherwise. Leaving the canvas — onto a HUD control,
 * or out of the window — simply stops the look, and re-entering starts a fresh
 * measurement so the camera never jumps by the distance the cursor travelled away.
 *
 * Touch: one finger dragging from the right half. The joystick is its own element
 * on the left, so both work at once. `touchScale` converts a finger's pixels into
 * mouse-equivalent pixels.
 */
export function attachLookInput(surface: HTMLElement, touchScale: number): () => void {
  // --- mouse ---------------------------------------------------------------
  /** Last cursor position over the canvas, or null when the cursor is elsewhere. */
  let lastMouseX: number | null = null
  let lastMouseY: number | null = null

  const endMouse = () => {
    lastMouseX = null
    lastMouseY = null
  }

  /** The canvas owns camera movement; anything over a control belongs to that control. */
  const overWorld = (event: PointerEvent | MouseEvent) => event.target === surface

  const onMouseMove = (event: PointerEvent | MouseEvent) => {
    if (!isGameInputEnabled()) return endMouse()
    if (!overWorld(event)) return endMouse()

    // Ctrl held: keep following the cursor so the next unpaused frame measures from
    // where it actually is, but contribute nothing to the camera.
    if (lookPaused) {
      lastMouseX = event.clientX
      lastMouseY = event.clientY
      return
    }

    // First sample after entering the canvas only establishes the origin.
    if (lastMouseX === null || lastMouseY === null) {
      lastMouseX = event.clientX
      lastMouseY = event.clientY
      return
    }

    // movementX/Y is the browser's own delta and survives a cursor that is at rest
    // against a screen edge; the position difference is the fallback where it is 0
    // for synthetic events or unsupported.
    const dx = event.movementX || event.clientX - lastMouseX
    const dy = event.movementY || event.clientY - lastMouseY
    lastMouseX = event.clientX
    lastMouseY = event.clientY

    pending.x += clamp(dx)
    pending.y += clamp(dy)
  }

  const onMouseLeave = () => endMouse()

  // A right-click on the world would only ever open a menu over the game.
  const onContextMenu = (event: MouseEvent) => {
    if (overWorld(event)) event.preventDefault()
  }

  // --- touch ---------------------------------------------------------------
  let touchId = -1
  let lastX = 0
  let lastY = 0

  const onTouchDown = (event: PointerEvent) => {
    if (touchId !== -1) return
    const rect = surface.getBoundingClientRect()
    if (event.clientX < rect.left + rect.width * TOUCH_LOOK_FROM) return
    touchId = event.pointerId
    lastX = event.clientX
    lastY = event.clientY
    // Keeps the drag alive if the finger slides over the joystick or off the edge.
    surface.setPointerCapture(event.pointerId)
  }

  const onPointerDown = (event: PointerEvent) => {
    if (!isGameInputEnabled()) return
    if (event.pointerType === 'touch') onTouchDown(event)
  }

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') {
      if (event.pointerId !== touchId) return
      pending.x += (event.clientX - lastX) * touchScale
      pending.y += (event.clientY - lastY) * touchScale
      lastX = event.clientX
      lastY = event.clientY
      return
    }
    onMouseMove(event)
  }

  const endTouch = () => {
    if (touchId === -1) return
    if (surface.hasPointerCapture(touchId)) surface.releasePointerCapture(touchId)
    touchId = -1
  }

  const onTouchEnd = (event: PointerEvent) => {
    if (event.pointerId === touchId) endTouch()
  }

  // --- Ctrl pause ----------------------------------------------------------
  // `event.ctrlKey` rather than the key code alone, so a Ctrl that went down before
  // the window had focus — or came back up during an OS shortcut — still resolves.
  // Nothing is preventDefault-ed: Ctrl-clicking a control must reach that control.
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'ControlLeft' || event.code === 'ControlRight') setLookPaused(true)
  }
  const onKeyUp = (event: KeyboardEvent) => {
    if (event.code === 'ControlLeft' || event.code === 'ControlRight') setLookPaused(false)
    else if (!event.ctrlKey) setLookPaused(false)
  }

  // --- shared --------------------------------------------------------------
  const endAll = () => {
    endMouse()
    endTouch()
    // A window that loses focus never delivers the keyup, so Ctrl would stick on.
    setLookPaused(false)
  }
  const onVisibility = () => {
    if (document.hidden) endAll()
  }

  surface.addEventListener('pointerdown', onPointerDown)
  surface.addEventListener('pointermove', onPointerMove)
  surface.addEventListener('pointerup', onTouchEnd)
  surface.addEventListener('pointercancel', onTouchEnd)
  surface.addEventListener('lostpointercapture', onTouchEnd)
  surface.addEventListener('pointerleave', onMouseLeave)
  surface.addEventListener('contextmenu', onContextMenu)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', endAll)
  document.addEventListener('visibilitychange', onVisibility)
  endActiveLook = endAll
  const offGate = onGameInputChange((enabled) => {
    if (!enabled) releaseLook()
  })

  return () => {
    offGate()
    surface.removeEventListener('pointerdown', onPointerDown)
    surface.removeEventListener('pointermove', onPointerMove)
    surface.removeEventListener('pointerup', onTouchEnd)
    surface.removeEventListener('pointercancel', onTouchEnd)
    surface.removeEventListener('lostpointercapture', onTouchEnd)
    surface.removeEventListener('pointerleave', onMouseLeave)
    surface.removeEventListener('contextmenu', onContextMenu)
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('blur', endAll)
    document.removeEventListener('visibilitychange', onVisibility)
    if (endActiveLook === endAll) endActiveLook = null
    endAll()
    pending.x = 0
    pending.y = 0
  }
}
