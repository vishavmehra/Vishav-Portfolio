'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'

import {
  COMPASS_HALF_FIELD,
  getNavigationSnapshot,
  getServerNavigationSnapshot,
  navigationView,
  subscribeNavigation,
} from '@/game/navigation/NavigationSystem'
import type { InteractionType } from '@/game/world/interaction/InteractionTypes'

/** Destination names are presentation, so they live here rather than in the world. */
const LABELS: Record<InteractionType, string> = {
  projects: 'Projects',
  experience: 'Experience',
  education: 'Education',
  achievements: 'Achievements',
  contact: 'Contact',
}

/** Cardinal letters and the quiet dots between them, as headings clockwise from north. */
const MARKS: readonly (readonly [label: string, angle: number])[] = [
  ['N', 0],
  ['', Math.PI / 4],
  ['E', Math.PI / 2],
  ['', (3 * Math.PI) / 4],
  ['S', Math.PI],
  ['', (-3 * Math.PI) / 4],
  ['W', -Math.PI / 2],
  ['', -Math.PI / 4],
]

/** Offset as a percentage of the dial's width: ±50 at the edge of the ±90° field. */
function percent(angle: number, limit: number) {
  const t = Math.max(-limit, Math.min(limit, angle / COMPASS_HALF_FIELD))
  return Math.round(t * 500) / 10
}

/**
 * The compass (DD-29): a small dial at the top of the screen. Cardinal marks slide
 * with the camera heading; one marker shows where the nearest destination lies
 * relative to the view, centred when it is dead ahead and pinned to an edge as a
 * turn chevron when it is behind.
 *
 * Quiet by default. Only when guidance is useful — the destination out of view, or
 * the visitor walking away from it — does the marker turn amber and the name
 * appear. Nothing flashes or moves beyond the dial itself.
 *
 * React re-renders only when the target, emphasis or edge changes. The marks and
 * marker move through a requestAnimationFrame loop that writes transforms directly,
 * and only when a value actually changes.
 */
export function CompassHUD() {
  const { targetId, targetType, emphasis, edge } = useSyncExternalStore(
    subscribeNavigation,
    getNavigationSnapshot,
    getServerNavigationSnapshot,
  )
  const markRefs = useRef<(HTMLSpanElement | null)[]>([])
  const markerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let frame = 0
    const last = new Float32Array(MARKS.length + 1).fill(NaN)
    const place = (index: number, element: HTMLElement | null, value: number) => {
      if (!element || value === last[index]) return
      last[index] = value
      element.style.transform = `translateX(${value}%)`
    }
    const tick = () => {
      for (let i = 0; i < MARKS.length; i++) {
        const relative = Math.atan2(Math.sin(MARKS[i][1] - navigationView.heading), Math.cos(MARKS[i][1] - navigationView.heading))
        // Past the field a mark sits just outside the dial, hidden, so wrapping round is never seen.
        place(i, markRefs.current[i], percent(relative, 1.3))
      }
      place(MARKS.length, markerRef.current, percent(navigationView.bearing, 1))
      frame = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frame)
  }, [])

  const label = targetType ? (LABELS[targetType as InteractionType] ?? '') : ''

  return (
    <div
      className="compass"
      data-emphasis={emphasis}
      data-edge={edge < 0 ? 'left' : edge > 0 ? 'right' : undefined}
      data-target={targetId ? '' : undefined}
      aria-hidden="true"
    >
      <div className="compass-dial">
        <div className="compass-scale">
          {MARKS.map(([mark], i) => (
            <span key={i} ref={(el) => void (markRefs.current[i] = el)} className="compass-mark">
              {mark ? <b>{mark}</b> : <i />}
            </span>
          ))}
        </div>
        <span className="compass-notch" />
        <span ref={markerRef} className="compass-marker">
          <i />
        </span>
      </div>
      <p className="compass-label">
        {edge < 0 ? '‹ ' : ''}
        {label}
        {edge > 0 ? ' ›' : ''}
      </p>
    </div>
  )
}
