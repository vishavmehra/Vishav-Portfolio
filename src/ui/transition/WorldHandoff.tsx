'use client'

import { useSyncExternalStore } from 'react'

import { getHandoffPhase, getServerHandoffPhase, subscribeHandoff } from './handoff'

/** Motes drifting through the green. Positions are fixed so the field never reflows. */
const MOTES = [
  { left: 12, delay: 0, drift: 7.5 },
  { left: 23, delay: 1.4, drift: 9 },
  { left: 31, delay: 0.6, drift: 8.2 },
  { left: 44, delay: 2.1, drift: 10 },
  { left: 52, delay: 0.3, drift: 7 },
  { left: 61, delay: 1.7, drift: 9.4 },
  { left: 69, delay: 0.9, drift: 8 },
  { left: 78, delay: 2.4, drift: 10.5 },
  { left: 87, delay: 1.1, drift: 7.8 },
  { left: 94, delay: 0.2, drift: 9.2 },
]

/**
 * The layer the two worlds are handed over across.
 *
 * It lives in the root layout, above both routes, so the route change happens
 * underneath it and is never seen. It is not a colour wipe: the green closes in
 * from the edges as haze, holds while the arriving world paints, then opens out
 * of the middle as that world emerges through it.
 *
 * Everything here is CSS — no frame loop, no renderer, no texture. The only
 * state is the phase, and it changes three times per crossing.
 */
export function WorldHandoff() {
  const phase = useSyncExternalStore(subscribeHandoff, getHandoffPhase, getServerHandoffPhase)
  if (phase === 'idle') return null

  return (
    <div className="handoff" data-phase={phase} aria-hidden>
      <div className="handoff-haze" />
      <div className="handoff-motes">
        {MOTES.map((mote, i) => (
          <span
            key={i}
            style={{
              left: `${mote.left}%`,
              animationDelay: `${mote.delay}s`,
              animationDuration: `${mote.drift}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
