/**
 * Shared normalised movement input.
 *
 *   Keyboard ──┐
 *              ├──► movementInput { x, y } ──► PlayerController
 *   Touch ─────┘
 *
 * Both sources write into the same object. The player controller reads it and
 * cannot tell which device produced the values (docs/04 §6).
 *
 * This is deliberately not React state — it changes on every key event and
 * every pointer move, and is read every frame (CLAUDE.md §29).
 *
 * While the input gate is closed the shared vector is zero, but each source keeps
 * its own state, so reopening the gate restores whatever is still held.
 */

import { PLAYER } from '@/game/config'
import { isGameInputEnabled, onGameInputChange } from './inputGate'

export type MovementInput = {
  /** -1 (left) … 1 (right) */
  x: number
  /** -1 (backward) … 1 (forward) */
  y: number
  /**
   * Multiplier on the player's walk speed, blended across whichever sources are
   * contributing: Shift sprints on the keyboard, touch walks faster by default.
   * The controller multiplies by this and never asks which device it came from.
   */
  speedScale: number
}

/** The single shared input vector. Magnitude is always <= 1. */
export const movementInput: MovementInput = { x: 0, y: 0, speedScale: 1 }

// Per-source vectors, combined into movementInput by combine().
const keyboard = { x: 0, y: 0 }
const touch = { x: 0, y: 0 }
/** Left Shift, keyboard only. There is no sprint on touch (spec Part 2). */
let sprinting = false
/** One-shot jump request, consumed by the player controller. Keyboard only. */
let jumpQueued = false

/**
 * Whether sprint and jump exist on this device.
 *
 * Mobile is deliberately simpler: no Shift, no Space, no jump (spec Part 2). The
 * test is for a *fine* pointer anywhere on the device rather than for a coarse
 * primary one, so a touchscreen laptop keeps both — it has a real keyboard, and
 * the point is to leave out what a phone cannot do, not to punish hybrids.
 */
function hasKeyboardMechanics() {
  if (typeof window === 'undefined' || !window.matchMedia) return true
  return window.matchMedia('(any-pointer: fine)').matches
}

/**
 * Combination rule: sum the sources, then clamp the resulting magnitude to 1.
 *
 * Using both at once therefore blends directions and can never exceed the
 * intended maximum speed. Opposite inputs cancel, which is the same behaviour
 * as pressing A and D together.
 */
function combine() {
  if (!isGameInputEnabled()) {
    movementInput.x = 0
    movementInput.y = 0
    movementInput.speedScale = 1
    jumpQueued = false
    return
  }

  let x = keyboard.x + touch.x
  let y = keyboard.y + touch.y

  const magnitude = Math.hypot(x, y)
  if (magnitude > 1) {
    x /= magnitude
    y /= magnitude
  }

  movementInput.x = x
  movementInput.y = y

  // Each source brings its own pace; blending by how hard each is pushing means
  // a thumb and a key held together produce something sensible rather than a jump
  // between two speeds.
  const keyMagnitude = Math.hypot(keyboard.x, keyboard.y)
  const touchMagnitude = Math.hypot(touch.x, touch.y)
  const total = keyMagnitude + touchMagnitude
  const keyScale = sprinting ? PLAYER.sprintMultiplier : 1
  movementInput.speedScale =
    total === 0 ? 1 : (keyMagnitude * keyScale + touchMagnitude * PLAYER.touchMultiplier) / total
}

/** True while Left Shift is held. Exposed for the movement-state read only. */
export function isSprinting() {
  return sprinting && isGameInputEnabled()
}

/**
 * Takes the pending jump, if any. One press is one jump: holding Space cannot
 * queue a second, and the controller decides whether the player is grounded.
 */
export function consumeJump() {
  if (!jumpQueued) return false
  jumpQueued = false
  return true
}

onGameInputChange(combine)

// ---------------------------------------------------------------------------
// Touch / pointer source
// ---------------------------------------------------------------------------

/**
 * Sets the touch contribution. Expects an already-normalised vector with
 * magnitude <= 1; the joystick clamps to its own radius before calling this.
 */
export function setTouchInput(x: number, y: number) {
  touch.x = x
  touch.y = y
  combine()
}

export function clearTouchInput() {
  if (touch.x === 0 && touch.y === 0) return
  touch.x = 0
  touch.y = 0
  combine()
}

// ---------------------------------------------------------------------------
// Keyboard source
// ---------------------------------------------------------------------------

const FORWARD_KEYS = new Set(['KeyW', 'ArrowUp'])
const BACK_KEYS = new Set(['KeyS', 'ArrowDown'])
const LEFT_KEYS = new Set(['KeyA', 'ArrowLeft'])
const RIGHT_KEYS = new Set(['KeyD', 'ArrowRight'])

const pressed = new Set<string>()

function isMovementKey(code: string) {
  return (
    FORWARD_KEYS.has(code) ||
    BACK_KEYS.has(code) ||
    LEFT_KEYS.has(code) ||
    RIGHT_KEYS.has(code)
  )
}

/** Recomputed on key events only — never per frame. */
function recomputeKeyboard() {
  let x = 0
  let y = 0
  for (const code of pressed) {
    if (FORWARD_KEYS.has(code)) y += 1
    else if (BACK_KEYS.has(code)) y -= 1
    else if (LEFT_KEYS.has(code)) x -= 1
    else if (RIGHT_KEYS.has(code)) x += 1
  }

  // Diagonals must not be faster than a straight line.
  const magnitude = Math.hypot(x, y)
  if (magnitude > 1) {
    x /= magnitude
    y /= magnitude
  }

  keyboard.x = x
  keyboard.y = y
  combine()
}

function clearKeyboard() {
  const wasSprinting = sprinting
  sprinting = false
  jumpQueued = false
  if (pressed.size === 0) {
    if (wasSprinting) combine()
    return
  }
  pressed.clear()
  recomputeKeyboard()
}

/**
 * Attaches keyboard listeners. Returns a cleanup function — call it on unmount
 * so listeners are never duplicated across remounts or fast-refresh cycles.
 */
export function attachKeyboardInput(): () => void {
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      if (sprinting || !hasKeyboardMechanics()) return
      sprinting = true
      combine()
      return
    }
    if (event.code === 'Space') {
      // Space scrolls the page and re-presses a focused button; neither is wanted
      // while the world has the keyboard.
      if (!isGameInputEnabled() || !hasKeyboardMechanics()) return
      event.preventDefault()
      if (!event.repeat) jumpQueued = true
      return
    }
    if (!isMovementKey(event.code)) return
    // Arrow keys would otherwise scroll the page.
    event.preventDefault()
    if (event.repeat) return
    pressed.add(event.code)
    recomputeKeyboard()
  }

  const onKeyUp = (event: KeyboardEvent) => {
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      // Releasing Shift returns to walking on the very next frame.
      sprinting = false
      combine()
      return
    }
    if (!isMovementKey(event.code)) return
    pressed.delete(event.code)
    recomputeKeyboard()
  }

  // Keys held while the window loses focus would otherwise stay stuck down.
  const onBlur = () => clearKeyboard()
  const onVisibility = () => {
    if (document.hidden) clearKeyboard()
  }

  window.addEventListener('keydown', onKeyDown, { passive: false })
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', onBlur)
  document.addEventListener('visibilitychange', onVisibility)

  return () => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('blur', onBlur)
    document.removeEventListener('visibilitychange', onVisibility)
    clearKeyboard()
  }
}
