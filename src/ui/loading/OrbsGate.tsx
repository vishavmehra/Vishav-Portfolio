'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { ThinkingOrb } from 'thinking-orbs'

import { getLoadingSnapshot, getServerLoadingSnapshot, subscribeLoading } from '@/game/loading/loadingState'

/** How long the gate takes to dissolve. Matches the transition in globals.css. */
const FADE_MS = 700

/**
 * The way in — the only loading screen the experience has.
 *
 * Libraries.dev's thinking orb over the dark of the forest, and then it dissolves
 * off the live world: the 3D scene is already mounted and rendering behind it, so
 * there is no second screen, no hand-off and no flash of empty page between the
 * loader and what the visitor came for.
 *
 * Progress is the real thing. It reads the same asset tracker every GLB reports
 * to, and it leaves the moment the assets have settled and frames are on screen.
 * Nothing is padded to make the animation last (CLAUDE.md §5).
 */
export function OrbsGate({ caption = 'Entering the world' }: { caption?: string }) {
  const { phase } = useSyncExternalStore(subscribeLoading, getLoadingSnapshot, getServerLoadingSnapshot)
  const built = phase !== 'loading'
  const [gone, setGone] = useState(false)

  useEffect(() => {
    // The threshold is the entrance, so a reload starts there rather than wherever
    // the browser last left the visitor.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!built) return
    const timer = window.setTimeout(() => setGone(true), FADE_MS)
    return () => window.clearTimeout(timer)
  }, [built])

  // The page must not scroll out from under a world that is not there yet.
  useEffect(() => {
    if (gone) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [gone])

  if (gone) return null

  return (
    <div className="orbs-gate" data-leaving={built ? '' : undefined} role="status">
      <ThinkingOrb state="weaving" size={64} theme="dark" aria-label={caption} />
      <p>{caption}</p>
    </div>
  )
}
