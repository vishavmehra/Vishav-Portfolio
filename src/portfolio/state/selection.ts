/**
 * What the visitor has chosen, and the only place that answers it.
 *
 * The navigator and the cards are two ways into the same thing, so they must
 * not each keep their own idea of what is selected — choosing ABOUT on the
 * wheel and clicking the ABOUT card have to be indistinguishable afterwards.
 * Both call {@link select}; both read back from here.
 *
 * A module store rather than a React context, matching `ui/transition/handoff.ts`:
 * the scene needs to read this too, and it is not a React component.
 */

import { chapterProgress, setJourneyTarget, type ChapterId } from '@/portfolio/journey/journey'

/** The chapters that have a card and a navigator entry. */
export const CONTENT_IDS = [
  'about',
  'experience',
  'projects',
  'education',
  'achievements',
] as const

export type ContentId = (typeof CONTENT_IDS)[number]

export function isContentId(value: string): value is ContentId {
  return (CONTENT_IDS as readonly string[]).includes(value)
}

let active: ContentId | null = null
const listeners = new Set<() => void>()

export function getActive(): ContentId | null {
  return active
}

/** Nothing is selected on the server, and nothing may be, or the markup differs. */
export function getServerActive(): ContentId | null {
  return null
}

export function subscribeSelection(fn: () => void): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

/**
 * Choose a chapter, or pass null to clear.
 *
 * Selecting also aims the journey at that chapter — the camera travels there.
 * It does not change route, scroll an element into view, or build a scene.
 */
export function select(id: ContentId | null): void {
  if (active === id) return
  active = id
  setJourneyTarget(id === null ? null : chapterProgress(id as ChapterId))
  for (const fn of listeners) fn()
}
