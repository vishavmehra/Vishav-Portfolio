import type { WorldInteraction } from './InteractionTypes'

/**
 * Generic proximity interaction (docs/03 §14–§15).
 *
 * The system only decides which interaction is active and fires it. It knows
 * nothing about UI or content: prompts subscribe to the active value, and whatever
 * opens a destination window subscribes with onInteraction.
 *
 * - Distance check on XZ only. No raycasts, no physics triggers.
 * - Nearest valid candidate wins; at most one is ever active.
 * - Hysteresis: once active, an interaction stays active until the player is
 *   EXIT_MARGIN beyond its radius, so the prompt never flickers on the boundary.
 * - React learns about the active value only when it changes, never per frame.
 */

const EXIT_MARGIN = 0.5

const interactions = new Map<string, WorldInteraction>()
const disabled = new Set<string>()
/** Registry as an array, rebuilt only on change so the per-frame loop never allocates. */
let list: WorldInteraction[] = []
let active: WorldInteraction | null = null
/** The most recent non-null active interaction — lets a prompt keep its text while fading out. */
let lastActive: WorldInteraction | null = null

const activeListeners = new Set<() => void>()
const interactListeners = new Set<(interaction: WorldInteraction) => void>()

/**
 * Where the active prompt should sit on screen, in CSS pixels. Written each frame
 * by the in-canvas runtime (which owns the camera), read by the DOM prompt.
 */
export const activePromptScreen = { x: 0, y: 0, visible: false }

function rebuild() {
  list = Array.from(interactions.values())
}

/** Enabled in its record and not switched off at runtime with setInteractionEnabled. */
export function isInteractionEnabled(interaction: WorldInteraction) {
  return interaction.enabled !== false && !disabled.has(interaction.id)
}

function setActive(next: WorldInteraction | null) {
  if (next === active) return
  active = next
  if (next) lastActive = next
  for (const listener of activeListeners) listener()
}

export function registerInteraction(interaction: WorldInteraction): () => void {
  interactions.set(interaction.id, interaction)
  rebuild()
  return () => {
    if (interactions.get(interaction.id) === interaction) removeInteraction(interaction.id)
  }
}

export function removeInteraction(id: string) {
  if (!interactions.delete(id)) return
  disabled.delete(id)
  rebuild()
  if (active?.id === id) setActive(null)
}

export function setInteractionEnabled(id: string, enabled: boolean) {
  if (enabled) disabled.delete(id)
  else disabled.add(id)
  if (!enabled && active?.id === id) setActive(null)
}

/** Every registered interaction. For tooling (debug drawing). */
export function getInteractions(): WorldInteraction[] {
  return list
}

/** Call once per frame with the player's position. Allocation-free. */
export function updateInteractions(px: number, pz: number) {
  let best: WorldInteraction | null = null
  let bestD2 = Infinity
  let activeD2 = Infinity

  for (let i = 0; i < list.length; i++) {
    const candidate = list[i]
    if (!isInteractionEnabled(candidate)) continue
    const dx = px - candidate.position[0]
    const dz = pz - candidate.position[2]
    const d2 = dx * dx + dz * dz
    if (candidate === active) activeD2 = d2
    const r = candidate.interactionRadius
    if (d2 < r * r && d2 < bestD2) {
      best = candidate
      bestD2 = d2
    }
  }

  let next = best
  if (active && activeD2 !== Infinity) {
    const exit = active.interactionRadius + EXIT_MARGIN
    // Keep the current one while inside its exit radius, unless another is strictly closer.
    if (activeD2 < exit * exit && (!best || activeD2 <= bestD2)) next = active
  }
  setActive(next)
}

export function getActiveInteraction(): WorldInteraction | null {
  return active
}

export function getLastActiveInteraction(): WorldInteraction | null {
  return lastActive
}

/** Notified whenever the active interaction changes. Returns an unsubscribe function. */
export function subscribeActiveInteraction(listener: () => void): () => void {
  activeListeners.add(listener)
  return () => {
    activeListeners.delete(listener)
  }
}

/** Notified whenever an interaction is triggered. Returns an unsubscribe function. */
export function onInteraction(listener: (interaction: WorldInteraction) => void): () => void {
  interactListeners.add(listener)
  return () => {
    interactListeners.delete(listener)
  }
}

/**
 * Triggers the active interaction, if any. Input sources (E key, touch button)
 * all call this, so there is exactly one interaction path.
 */
export function interact(): boolean {
  const current = active
  if (!current) return false
  current.onInteract?.()
  for (const listener of interactListeners) listener(current)
  return true
}
