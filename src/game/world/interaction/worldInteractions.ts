import { DESTINATIONS } from '../worldConfig'
import { heightAt } from '../worldGen'
import type { WorldInteraction } from './InteractionTypes'

function at(id: keyof typeof DESTINATIONS): [number, number, number] {
  const [x, z] = DESTINATIONS[id].position
  return [x, heightAt(x, z), z]
}

/**
 * Destination interactions, positioned from DESTINATIONS so they can never drift
 * from the rendered sets.
 *
 * Radii are independent of the colliders in worldColliders.ts. Every destination is
 * now a solid the player has to stand outside of, so each radius clears its own
 * footprint: the dais and the Experience cabin at 5, the Education cabin at 4.6
 * (2.3 deep plus room to stand), the Projects shack at 4.2 (1.5 plus the same).
 *
 * `promptHeight` places the on-screen prompt just above each set's silhouette.
 * `navigable` makes each a compass destination (DD-29).
 *
 * There is no Contact destination in the world yet (DD-05), so it has no record.
 *
 * Leaving the world is NOT an interaction. Holding X (desktop) or the EXIT button
 * (touch) works from anywhere, so there is no exit record here and no prompt to
 * walk to — the trailhead marker by the spawn is scenery, nothing more.
 */
export const WORLD_INTERACTIONS: WorldInteraction[] = [
  {
    id: 'projects',
    type: DESTINATIONS.projects.contentKey,
    position: at('projects'),
    interactionRadius: 4.2,
    prompt: 'Interact',
    navigable: true,
    promptHeight: 4.6,
  },
  {
    id: 'achievements',
    type: DESTINATIONS.achievements.contentKey,
    position: at('achievements'),
    interactionRadius: 5,
    prompt: 'Interact',
    navigable: true,
    promptHeight: 3.9,
  },
  {
    id: 'experience',
    type: DESTINATIONS.experience.contentKey,
    position: at('experience'),
    interactionRadius: 5,
    prompt: 'Interact',
    navigable: true,
    promptHeight: 5.2,
  },
  {
    id: 'education',
    type: DESTINATIONS.education.contentKey,
    position: at('education'),
    interactionRadius: 4.6,
    prompt: 'Interact',
    navigable: true,
    promptHeight: 2.9,
  },
]
