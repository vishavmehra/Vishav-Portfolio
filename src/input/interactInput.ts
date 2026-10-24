/**
 * Keyboard source for the interact action (docs/03 §11: `E`).
 *
 * Fires once per physical key press: a keydown transition, never a held-key poll,
 * and auto-repeat is ignored, so holding E cannot re-trigger every frame.
 * Ignored while the input gate is closed.
 */

import { isGameInputEnabled } from './inputGate'

const INTERACT_CODES = new Set(['KeyE'])

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT'
}

/** Returns a cleanup function; call it on unmount so listeners never duplicate. */
export function attachInteractKey(onInteract: () => void): () => void {
  const onKeyDown = (event: KeyboardEvent) => {
    if (!INTERACT_CODES.has(event.code) || event.repeat || !isGameInputEnabled()) return
    if (event.ctrlKey || event.metaKey || event.altKey) return
    if (isTypingTarget(event.target)) return
    onInteract()
  }
  window.addEventListener('keydown', onKeyDown)
  return () => window.removeEventListener('keydown', onKeyDown)
}
