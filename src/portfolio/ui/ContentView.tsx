'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { getActive, getServerActive, select, subscribeSelection } from '@/portfolio/state/selection'
import { SECTIONS } from './contentItems'
import { FocusCarousel, FocusCarouselNav } from './FocusCarousel'

/**
 * A portfolio section, opened inside the world.
 *
 * Not a modal: the backdrop is a translucent darkening with no blur, so the
 * moss, the stem and the motes stay visible behind the content, and nothing
 * here costs a full-screen compositing pass per frame.
 *
 * Mounts only while something is selected — nothing about this view renders
 * or animates on the landing composition. No renderer, no scene, no canvas
 * and no animation loop: the carousel animates with CSS transitions, so the
 * world's single rAF remains the only one running.
 */
export function ContentView() {
  const active = useSyncExternalStore(subscribeSelection, getActive, getServerActive)
  const [index, setIndex] = useState(0)
  const panel = useRef<HTMLDivElement>(null)

  /* Escape closes, from anywhere inside the page. */
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') select(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [active])

  /* Opening starts at the first card and puts focus on the carousel so the
     arrow keys work before anything has been clicked. */
  useEffect(() => {
    setIndex(0)
    if (active) panel.current?.querySelector<HTMLElement>('.fc')?.focus({ preventScroll: true })
  }, [active])

  if (!active) return null

  const section = SECTIONS[active]
  const count = section.cards.length

  return (
    <div className="content" role="dialog" aria-modal="false" aria-label={section.kicker} ref={panel}>
      <header className="content-head">
        <p className="content-kicker">{section.kicker}</p>
        <h2 className="content-title">{section.title}</h2>
        <button
          type="button"
          className="content-close"
          onClick={() => select(null)}
          aria-label={`Close ${section.kicker}`}
        >
          <span aria-hidden="true">×</span>
        </button>
      </header>

      <FocusCarousel cards={section.cards} index={index} onIndexChange={setIndex} label={section.title} />

      <footer className="content-foot">
        <span aria-live="polite">
          {index + 1} / {count}
        </span>
        {count > 1 ? <FocusCarouselNav count={count} index={index} onIndexChange={setIndex} /> : <span />}
        <span>Esc to return</span>
      </footer>
    </div>
  )
}
