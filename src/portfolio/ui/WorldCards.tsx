'use client'

import { useMemo, useSyncExternalStore } from 'react'

import { CARD_SPOTS, solveSpot } from '@/portfolio/journey/cardSpots'
import { CHAPTERS, getChapter, getServerChapter, subscribeChapter, type ChapterId } from '@/portfolio/journey/journey'
import { getActive, getServerActive, select, subscribeSelection } from '@/portfolio/state/selection'
import { CARDS } from './cardContent'
import { useNarrow } from './useNarrow'

/**
 * The portfolio's artifacts, standing along the journey.
 *
 * One card per chapter, and none on the hero: each is placed where the camera
 * will be when the scroll reaches its chapter, so the landing shows the world
 * and the name, and the cards are discovered by travelling. The positions come
 * from `cardSpots.ts`, which the scene also reads to grow moss around each
 * card — one definition for both halves of the image.
 *
 * Reveal is CSS (see .card in world.css): the scene publishes progress as
 * --j once a frame and each card fades and rises in around its own --at.
 * React only hears about whole chapters, to decide which cards may be
 * focused or clicked — a card faded to nothing must not stay a live button.
 */

const ORDER: ChapterId[] = CHAPTERS.map((c) => c.id)

export function WorldCards() {
  const active = useSyncExternalStore(subscribeSelection, getActive, getServerActive)
  const chapter = useSyncExternalStore(subscribeChapter, getChapter, getServerChapter)
  const narrow = useNarrow()

  const placed = useMemo(
    () =>
      CARDS.flatMap((card) => {
        const spot = CARD_SPOTS.find((s) => s.id === card.id)
        return spot ? [{ card, spot, ...solveSpot(spot, narrow) }] : []
      }),
    [narrow],
  )

  const here = ORDER.indexOf(chapter)

  return (
    <div className="cards" data-open={active ?? undefined}>
      {placed.map(({ card, spot, sx, sy }) => {
        const chosen = active === card.id
        const near = Math.abs(ORDER.indexOf(spot.id) - here) <= 1
        return (
          <button
            key={card.id}
            type="button"
            className={`card${near ? ' is-near' : ''}${chosen ? ' is-active' : ''}`}
            aria-pressed={chosen}
            aria-label={`${card.label}: ${card.title}. Open`}
            tabIndex={near ? 0 : -1}
            onClick={() => select(chosen ? null : card.id)}
            style={
              {
                '--at': spot.at,
                '--sx': Math.round(sx),
                '--sy': Math.round(sy),
                '--cz': spot.cz,
                '--cw': spot.w,
                '--tilt': `${spot.tilt}deg`,
              } as React.CSSProperties
            }
          >
            <span className="card-label">{card.label}</span>
            <span className="card-title">{card.title}</span>
            <span className="card-teaser">{card.teaser}</span>
            <span className="card-open" aria-hidden="true">
              Open
            </span>
          </button>
        )
      })}
    </div>
  )
}
