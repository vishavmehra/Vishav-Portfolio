'use client'

import { useSyncExternalStore, type ReactNode } from 'react'

import { getLoadingSnapshot, getServerLoadingSnapshot, subscribeLoading } from '@/game/loading/loadingState'

/**
 * Holds the HUD back until the visitor has actually entered.
 *
 * The entry screen is a shot of the world, not a card over it, so anything that
 * used to be hidden behind an opaque loading page is now simply in frame: the
 * compass, the joystick, the exit hint. None of them belong to the threshold —
 * and X, which enters the world, is the same key that later leaves it.
 *
 * Gameplay itself is untouched: these are the same components, mounted a moment
 * later. Their own logic starts when they mount, which is when the world opens.
 */
export function WhenEntered({ children }: { children: ReactNode }) {
  const { phase } = useSyncExternalStore(subscribeLoading, getLoadingSnapshot, getServerLoadingSnapshot)
  if (phase !== 'ready') return null
  return <>{children}</>
}
