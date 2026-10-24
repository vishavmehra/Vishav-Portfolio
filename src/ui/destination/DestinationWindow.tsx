'use client'

import { useEffect, useRef, useState } from 'react'

import { getLoadingSnapshot } from '@/game/loading/loadingState'
import { isLeaving, setExitHolding } from '@/game/world/exitState'
import { onInteraction } from '@/game/world/interaction/InteractionSystem'
import type { InteractionType } from '@/game/world/interaction/InteractionTypes'
import { setGameInputEnabled } from '@/input/inputGate'
import { releaseLook } from '@/input/lookInput'
import { SECTIONS, type ContentSection } from '@/portfolio/ui/contentItems'

/** Which section each destination opens. Content comes from SECTIONS, which reads src/portfolio/data. */
const SECTION_FOR: Partial<Record<InteractionType, keyof typeof SECTIONS>> = {
  projects: 'projects',
  experience: 'experience',
  education: 'education',
  achievements: 'achievements',
}

/** Horizontal travel, in px, that counts as a swipe on the page. */
const SWIPE = 48

/**
 * The window a destination opens: a field journal laid over the world.
 *
 * It listens to the one interaction path — E, or the touch Interact button —
 * and closes the input gate while it is open, so movement, look, interact and
 * hold-to-exit all stop without any of them knowing this window exists. The
 * world keeps running behind it and nothing is unmounted, so the player is
 * exactly where they were when it closes.
 */
export function DestinationWindow() {
  const [section, setSection] = useState<ContentSection | null>(null)
  const [index, setIndex] = useState(0)
  const dialog = useRef<HTMLDivElement>(null)
  const focusTargets = useRef<(HTMLElement | null)[]>([])
  const swipeX = useRef<number | null>(null)

  useEffect(
    () =>
      onInteraction((interaction) => {
        const id = SECTION_FOR[interaction.type]
        const next = id ? SECTIONS[id] : null
        // A section with nothing recorded opens nothing rather than an empty window.
        if (!next || next.cards.length === 0) return
        setIndex(0)
        setSection(next)
      }),
    [],
  )

  // While open, gameplay input is shut; on close it reopens unless the world is
  // no longer ready or is being left.
  useEffect(() => {
    if (!section) return
    setGameInputEnabled(false)
    setExitHolding(false)
    releaseLook()
    return () => {
      if (getLoadingSnapshot().phase === 'ready' && !isLeaving()) setGameInputEnabled(true)
    }
  }, [section])

  // Focus follows the selected entry, so arrow keys and screen readers agree.
  useEffect(() => {
    if (section) focusTargets.current[index]?.focus()
  }, [section, index])

  if (!section) return null

  const cards = section.cards
  const many = cards.length > 1
  const card = cards[Math.min(index, cards.length - 1)]
  const last = cards.length - 1
  const go = (i: number) => setIndex(Math.min(Math.max(i, 0), last))
  const close = () => {
    ;(document.activeElement as HTMLElement | null)?.blur()
    setSection(null)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const key = event.key
    if (key === 'Escape') close()
    else if (key === 'ArrowRight' || key === 'ArrowDown') go(index + 1)
    else if (key === 'ArrowLeft' || key === 'ArrowUp') go(index - 1)
    else if (key === 'Home') go(0)
    else if (key === 'End') go(last)
    else if (key === 'Tab') {
      // Keep focus inside the window.
      const focusable = dialog.current?.querySelectorAll<HTMLElement>('[tabindex="0"], button:not([tabindex]):not(:disabled), a[href]')
      if (!focusable?.length) return
      const first = focusable[0]
      const end = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) end.focus()
      else if (!event.shiftKey && document.activeElement === end) first.focus()
      else return
    } else return
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <div
      className="journal-backdrop"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div ref={dialog} className="journal" role="dialog" aria-modal="true" aria-labelledby="journal-title" onKeyDown={onKeyDown}>
        <header className="journal-head">
          <div>
            <p className="journal-kicker">{section.kicker}</p>
            <h2 id="journal-title" className="journal-title">
              {section.title}
            </h2>
          </div>
          <button type="button" className="journal-close" onClick={close} aria-label={`Close ${section.kicker}`}>
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="journal-body">
          {many && (
            <div className="journal-index" role="tablist" aria-label={section.title}>
              {cards.map((c, i) => (
                <button
                  key={c.id}
                  ref={(el) => {
                    focusTargets.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`journal-tab-${i}`}
                  aria-selected={i === index}
                  aria-controls="journal-page"
                  tabIndex={i === index ? 0 : -1}
                  className="journal-tab"
                  onClick={() => go(i)}
                >
                  <span className="journal-tab-no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="journal-tab-name">{c.title}</span>
                </button>
              ))}
            </div>
          )}

          <article
            key={card.id}
            id="journal-page"
            className="journal-page"
            role={many ? 'tabpanel' : undefined}
            aria-labelledby={many ? `journal-tab-${index}` : 'journal-title'}
            tabIndex={many ? -1 : 0}
            ref={(el) => {
              if (!many) focusTargets.current[0] = el
            }}
            onPointerDown={(event) => {
              if (event.pointerType !== 'mouse') swipeX.current = event.clientX
            }}
            onPointerUp={(event) => {
              if (swipeX.current === null) return
              const dx = event.clientX - swipeX.current
              swipeX.current = null
              if (Math.abs(dx) > SWIPE) go(index + (dx < 0 ? 1 : -1))
            }}
            onPointerCancel={() => {
              swipeX.current = null
            }}
          >
            <p className="journal-page-kicker">{card.kicker}</p>
            <h3 className="journal-page-title">{card.title}</h3>
            {card.meta && <p className="journal-page-meta">{card.meta}</p>}
            {card.points.length > 1 ? (
              <ul className="journal-points">
                {card.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            ) : card.points.length === 1 ? (
              <p className="journal-points">{card.points[0]}</p>
            ) : null}
            {card.tags && card.tags.length > 0 && (
              <ul className="journal-tags" aria-label="Tools">
                {card.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
            {card.links && card.links.length > 0 && (
              <div className="journal-links">
                {card.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </article>
        </div>

        {many && (
          <footer className="journal-foot">
            <button type="button" className="journal-step" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous entry">
              ←
            </button>
            <span aria-live="polite">
              {index + 1} / {cards.length}
            </span>
            <button type="button" className="journal-step" onClick={() => go(index + 1)} disabled={index === last} aria-label="Next entry">
              →
            </button>
          </footer>
        )}
      </div>
    </div>
  )
}
