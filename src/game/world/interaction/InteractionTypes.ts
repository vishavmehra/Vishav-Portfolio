/**
 * What an interaction opens. Content lives elsewhere; this is only a key (CLAUDE.md §20).
 *
 * Leaving the world is deliberately absent: it is a HUD action (hold X, or the EXIT
 * button), not something the player walks up to and triggers.
 */
export type InteractionType = 'projects' | 'experience' | 'education' | 'achievements' | 'contact'

export type WorldInteraction = {
  /** Stable, unique. Re-registering an id replaces the previous interaction. */
  id: string
  type: InteractionType
  /** World position of the trigger centre. Proximity is measured on XZ only. */
  position: readonly [x: number, y: number, z: number]
  /**
   * Entry radius on the XZ plane. Independent of any collider: a solid
   * destination normally needs a radius comfortably larger than its footprint,
   * so the player can trigger it while standing outside.
   */
  interactionRadius: number
  /** Short verb shown beside the input affordance, e.g. "Interact". */
  prompt: string
  /** Defaults to true. */
  enabled?: boolean
  /**
   * A destination the compass guides toward (DD-29). Opt-in: an incidental
   * interactable (a sign, a switch) leaves it unset and is never a compass target.
   */
  navigable?: boolean
  /** Optional per-interaction handler. Listeners registered with onInteraction also fire. */
  onInteract?: () => void
  /** Height above `position` where the on-screen prompt anchors. Defaults to 1.8. */
  promptHeight?: number
}
