/**
 * Whether gameplay input — movement, camera look, interaction — is accepted.
 *
 * Closed until the world is revealed (the loading screen opens it), and the one
 * switch a future window can use to lock movement (docs/03 §17).
 *
 * Sources keep tracking physical state while it is closed: a key still held when
 * the gate opens moves the player immediately, with no need to press it again.
 */

let enabled = false
const listeners = new Set<(enabled: boolean) => void>()

export function isGameInputEnabled() {
  return enabled
}

export function setGameInputEnabled(next: boolean) {
  if (next === enabled) return
  enabled = next
  for (const listener of listeners) listener(next)
}

/** Returns an unsubscribe function. */
export function onGameInputChange(listener: (enabled: boolean) => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
