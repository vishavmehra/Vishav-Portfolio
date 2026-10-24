'use client'

import { useEffect, useState } from 'react'

import { getLoadingSnapshot, subscribeLoading } from '@/game/loading/loadingState'
import { getTimeMode, setTimeMode, subscribeTimeMode, TIME_PRESETS, type TimeMode } from '@/game/world/timeOfDay'

const OPTIONS: { id: TimeMode; label: string }[] = [
  { id: 'morning', label: TIME_PRESETS.morning.label },
  { id: 'afternoon', label: TIME_PRESETS.afternoon.label },
  { id: 'evening', label: TIME_PRESETS.evening.label },
  { id: 'night', label: TIME_PRESETS.night.label },
  { id: 'auto', label: 'Auto' },
]

/**
 * Time-of-day selector.
 *
 * Renders once per click and never during a transition — the easing itself lives
 * in the frame loop. Auto follows the visitor's own clock; picking a state holds
 * it until Auto is chosen again.
 */
export function TimeOfDayControl() {
  const [mode, setMode] = useState<TimeMode>(getTimeMode)
  const [ready, setReady] = useState(() => getLoadingSnapshot().phase === 'ready')

  useEffect(() => subscribeTimeMode(setMode), [])
  useEffect(() => subscribeLoading(() => setReady(getLoadingSnapshot().phase === 'ready')), [])

  if (!ready) return null

  return (
    <div className="time-control" role="group" aria-label="Time of day">
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => setTimeMode(option.id)}
          data-active={mode === option.id ? '' : undefined}
          aria-pressed={mode === option.id}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
