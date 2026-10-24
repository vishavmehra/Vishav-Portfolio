'use client'

import { useCallback, useEffect, useRef } from 'react'

import type { ContentCard } from './contentItems'

/**
 * A centred focus carousel.
 *
 * One upright, fully readable card in the middle; the others peek at the sides,
 * smaller and dimmer, turned a little toward the centre. Built for reading, not
 * for spectacle: nothing about the focused card is rotated or clipped.
 *
 * It owns no animation loop. Each item's place is a CSS function of its signed
 * distance from the focused index, so a drag is a single custom property
 * written on the track from the pointer event, and React renders only when the
 * index actually changes. Snapping back is a CSS transition.
 *
 * Input: drag, swipe, horizontal or vertical wheel, arrow keys, Home/End, the
 * dots, the arrows, and clicking a neighbour.
 */
interface Props {
  cards: readonly ContentCard[]
  index: number
  onIndexChange: (next: number) => void
  /** Accessible name for the whole control, e.g. the section title. */
  label: string
}

/** Distance in cards beyond which an item is not shown at all. */
const VISIBLE = 2

export function FocusCarousel({ cards, index, onIndexChange, label }: Props) {
  const track = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; id: number; moved: boolean } | null>(null)
  const wheelAt = useRef(0)
  const count = cards.length

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(count - 1, next))
      if (clamped !== index) onIndexChange(clamped)
    },
    [count, index, onIndexChange],
  )

  /* The index drives the layout through one variable rather than per-item styles. */
  useEffect(() => {
    track.current?.style.setProperty('--index', String(index))
  }, [index])

  /* ---- drag / swipe --------------------------------------------------- */
  /* --step is a min() of lengths; the cheapest exact resolution is to
     measure a probe once per drag, not to re-derive the CSS in JS. */
  const stepPx = () => {
    const el = root.current
    if (!el) return 320
    const probe = document.createElement('div')
    probe.style.cssText = `position:absolute;visibility:hidden;width:${getComputedStyle(el).getPropertyValue('--step')}`
    el.appendChild(probe)
    const px = probe.getBoundingClientRect().width || 320
    probe.remove()
    return px
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    drag.current = { x: e.clientX, id: e.pointerId, moved: false }
    track.current?.setAttribute('data-dragging', '')
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d || e.pointerId !== d.id) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true
      ;(e.currentTarget as HTMLElement).setPointerCapture(d.id)
    }
    if (d.moved) track.current?.style.setProperty('--drag', String(-dx / stepPx()))
  }
  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d || e.pointerId !== d.id) return
    const t = track.current
    if (!t) return
    const offset = parseFloat(t.style.getPropertyValue('--drag') || '0')
    t.removeAttribute('data-dragging')
    t.style.setProperty('--drag', '0')
    if (d.moved) {
      /* A short flick still turns one page; a long drag turns several. */
      const dir = Math.sign(offset)
      const mag = Math.abs(offset)
      const pages = mag > 0.12 && mag < 0.5 ? 1 : Math.round(mag)
      go(index + dir * pages)
    }
    /* Cleared after the click that ends a drag has had its chance to be
       ignored by the neighbour-click handler. */
    setTimeout(() => { drag.current = null }, 0)
  }

  /* ---- wheel ---------------------------------------------------------- */
  const onWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    if (Math.abs(delta) < 12) return
    const now = performance.now()
    if (now - wheelAt.current < 380) return
    wheelAt.current = now
    go(index + (delta > 0 ? 1 : -1))
  }

  /* ---- keyboard ------------------------------------------------------- */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); go(index + 1) }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); go(index - 1) }
    else if (e.key === 'Home') { e.preventDefault(); go(0) }
    else if (e.key === 'End') { e.preventDefault(); go(count - 1) }
  }

  return (
    <div
      className="fc"
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
    >
      <div
        className="fc-track"
        ref={track}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {cards.map((card, i) => {
          const o = i - index
          const focus = o === 0
          const shown = Math.abs(o) <= VISIBLE
          return (
            <article
              key={card.id}
              className={`fc-item${focus ? ' is-focus' : ''}`}
              style={{ '--i': i, zIndex: 20 - Math.abs(o) } as React.CSSProperties}
              aria-hidden={!shown}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${card.title}`}
              /* A neighbour is a target: clicking it brings it to the front.
                 The click that ends a drag is not also a jump. */
              onClick={() => { if (!focus && !drag.current?.moved) go(i) }}
            >
              <p className="fc-kicker">{card.kicker}</p>
              <h3 className="fc-title">{card.title}</h3>
              {card.meta ? <p className="fc-meta">{card.meta}</p> : null}
              <div className="fc-body" tabIndex={focus ? 0 : -1}>
                {card.body}
              </div>
              {card.tags?.length ? (
                <div className="fc-tags" aria-label="Technologies">
                  {card.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              ) : null}
              {card.links?.length ? (
                <nav className="fc-links" aria-label={`${card.title} links`}>
                  {card.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      tabIndex={focus ? 0 : -1}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {l.label}
                    </a>
                  ))}
                </nav>
              ) : null}
            </article>
          )
        })}
      </div>
    </div>
  )
}

/** The dots and arrows, rendered by the caller wherever the layout wants them. */
export function FocusCarouselNav({
  count,
  index,
  onIndexChange,
}: {
  count: number
  index: number
  onIndexChange: (next: number) => void
}) {
  return (
    <div className="fc-nav">
      <button
        type="button"
        className="fc-arrow"
        aria-label="Previous"
        disabled={index === 0}
        onClick={() => onIndexChange(index - 1)}
      >
        <span aria-hidden="true">←</span>
      </button>
      <div className="fc-dots" role="tablist" aria-label="Cards">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            className="fc-dot"
            aria-label={`Card ${i + 1}`}
            aria-current={i === index ? 'true' : undefined}
            aria-selected={i === index}
            onClick={() => onIndexChange(i)}
          />
        ))}
      </div>
      <button
        type="button"
        className="fc-arrow"
        aria-label="Next"
        disabled={index === count - 1}
        onClick={() => onIndexChange(index + 1)}
      >
        <span aria-hidden="true">→</span>
      </button>
    </div>
  )
}
