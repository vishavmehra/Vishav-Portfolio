'use client'

import { useEffect, useState } from 'react'

import { getLoadingSnapshot, subscribeLoading } from '@/game/loading/loadingState'
import { useTouchControls } from '@/ui/controls/useTouchControls'

/** How long the card stays before it fades on its own. */
const VISIBLE_MS = 6500

type Row = { keys: string[]; label: string }

const DESKTOP: Row[] = [
  { keys: ['W', 'A', 'S', 'D'], label: 'Move' },
  { keys: ['Shift', 'W A S D'], label: 'Sprint' },
  { keys: ['Space'], label: 'Jump' },
  { keys: ['Mouse'], label: 'Look around' },
  { keys: ['Ctrl', 'Mouse'], label: 'Pause camera while using UI' },
  { keys: ['E'], label: 'Interact' },
  { keys: ['Hold X'], label: 'Exit world' },
]

const TOUCH: Row[] = [
  { keys: ['Joystick'], label: 'Move' },
  { keys: ['Drag right side'], label: 'Look around' },
  { keys: ['E'], label: 'Interact' },
  { keys: ['Exit'], label: 'Leave world' },
]

/**
 * The controls card (spec Part 4).
 *
 * Appears once, when the world opens, and leaves by itself after a few seconds.
 * Bottom-centre: clear of the compass at the top, the time selector on the left,
 * the joystick and the interact button at the bottom corners, and the right half
 * of the screen that touch look uses.
 *
 * Desktop and touch see different cards — a phone has no Shift, no Space and no
 * Ctrl, and showing keys that do not exist is worse than showing nothing.
 */
export function ControlsTutorial() {
  const touch = useTouchControls()
  const [ready, setReady] = useState(() => getLoadingSnapshot().phase === 'ready')
  const [dismissed, setDismissed] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => subscribeLoading(() => setReady(getLoadingSnapshot().phase === 'ready')), [])

  useEffect(() => {
    if (!ready || dismissed) return
    const timer = window.setTimeout(() => setLeaving(true), VISIBLE_MS)
    // Escape dismisses the card and nothing else — it has no camera meaning (DD-36).
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Escape') setDismissed(true)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [ready, dismissed])

  if (!ready || dismissed) return null

  const rows = touch ? TOUCH : DESKTOP

  return (
    <div
      className="controls-card"
      data-leaving={leaving ? '' : undefined}
      role="group"
      aria-label="Controls"
      onTransitionEnd={() => leaving && setDismissed(true)}
    >
      <div className="controls-head">
        <span>Controls</span>
        <button type="button" className="controls-close" aria-label="Dismiss controls" onClick={() => setDismissed(true)}>
          ×
        </button>
      </div>
      <dl className="controls-rows">
        {rows.map((row) => (
          <div key={row.label}>
            <dt>
              {row.keys.map((key) => (
                <kbd key={key}>{key}</kbd>
              ))}
            </dt>
            <dd>{row.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
