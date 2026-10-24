'use client'

import { useSyncExternalStore } from 'react'

import { Signature } from '@/components/ui/signature'
import { getChapter, getServerChapter, subscribeChapter } from '@/portfolio/journey/journey'

/**
 * The last thing in the world: a thank-you in the same hand as the name on
 * the landing, so the journey closes the way it opened.
 *
 * Mounted only once the journey has reached its final chapters, so the
 * signature draws itself on arrival rather than having finished long before
 * anyone scrolled there. Its fade is CSS, from the same --j the cards use.
 */
export function Closing() {
  const chapter = useSyncExternalStore(subscribeChapter, getChapter, getServerChapter)
  if (chapter !== 'resume' && chapter !== 'contact') return null

  return (
    <div className="closing" role="img" aria-label="Thank you">
      <Signature text="Thank you" color="#efe6d2" fontSize={76} duration={2.2} delay={0.3} />
    </div>
  )
}
