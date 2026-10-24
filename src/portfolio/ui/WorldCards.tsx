'use client'

import { useMemo, useSyncExternalStore } from 'react'

import {
  CAMERA_DIST,
  CHAPTERS,
  chapterProgress,
  getChapter,
  getServerChapter,
  sampleCameraPath,
  subscribeChapter,
  type ChapterId,
} from '@/portfolio/journey/journey'
import { getActive, getServerActive, select, subscribeSelection } from '@/portfolio/state/selection'
import { CARDS } from './cardContent'
import { useNarrow } from './useNarrow'

/**
 * The portfolio's artifacts, standing along the journey.
 *
 * One card per chapter, and none on the hero: each is placed where the camera
 * will be when the scroll reaches its chapter, so the landing shows the world
 * and the name, and the cards are discovered by travelling. Position is
 * derived from the same camera path the scene drives the camera from, which
 * is what guarantees a card is in frame when its chapter is current.
 *
 * Reveal is CSS (see .card in world.css): the scene publishes progress as
 * --j once a frame and each card fades and rises in around its own --at.
 * React only hears about whole chapters, to decide which cards may be
 * focused or clicked — a card faded to nothing must not stay a live button.
 */

interface Spot {
  /** Where the card sits on screen when its chapter is current: px from the viewport centre. */
  dx: number
  dy: number
  /** translateZ in px; negative is deeper into the scene. */
  cz: number
  /** Resting tilt, degrees. */
  tilt: number
  /** Width on the 1600-unit grid. */
  w: number
}

/* Authored and varied, deliberately not a grid: each chapter frames its card
   somewhere else, at its own depth and lean, so arriving somewhere new reads
   as finding something rather than reaching the next slide. */
const SPOTS: Record<string, Spot> = {
  about: { dx: -330, dy: -40, cz: -40, tilt: -3.1, w: 272 },
  experience: { dx: 300, dy: -10, cz: -100, tilt: 2.4, w: 262 },
  projects: { dx: -270, dy: 50, cz: 40, tilt: -2.2, w: 290 },
  education: { dx: 320, dy: 90, cz: -140, tilt: 3.0, w: 250 },
  achievements: { dx: -30, dy: -110, cz: -70, tilt: -1.6, w: 244 },
}

const ORDER: ChapterId[] = CHAPTERS.map((c) => c.id)

/**
 * Solve the world-space offset that puts a card at (dx, dy) on screen when the
 * camera is at its chapter. This inverts the scene's own publication: a card
 * is translated by (sx + jx, sy + jy) with jx = -cam.x and jy = cam.y, then
 * scaled by the perspective factor DIST / (cam.z - cz). Done once per card at
 * mount, never in the frame loop.
 */
function solve(at: number, spot: Spot, narrow: boolean) {
  const cam = sampleCameraPath(at, { x: 0, y: 0, z: 0 })
  const scale = CAMERA_DIST / (cam.z - spot.cz)
  const dx = narrow ? 0 : spot.dx
  const dy = narrow ? spot.dy * 0.6 : spot.dy
  return {
    sx: dx / scale + cam.x,
    sy: dy / scale - cam.y,
  }
}

export function WorldCards() {
  const active = useSyncExternalStore(subscribeSelection, getActive, getServerActive)
  const chapter = useSyncExternalStore(subscribeChapter, getChapter, getServerChapter)
  const narrow = useNarrow()

  const placed = useMemo(
    () =>
      CARDS.map((card) => {
        const at = chapterProgress(card.id as ChapterId)
        const spot = SPOTS[card.id]
        return { card, at, spot, ...solve(at, spot, narrow) }
      }),
    [narrow],
  )

  const here = ORDER.indexOf(chapter)

  return (
    <div className="cards" data-open={active ?? undefined}>
      {placed.map(({ card, at, spot, sx, sy }) => {
        const chosen = active === card.id
        const near = Math.abs(ORDER.indexOf(card.id as ChapterId) - here) <= 1
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
                '--at': at,
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
