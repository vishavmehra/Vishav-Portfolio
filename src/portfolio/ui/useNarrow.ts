'use client'

import { useEffect, useState } from 'react'

/**
 * The one breakpoint the world uses, shared with the scene.
 *
 * `scene.ts` switches its own composition on `(max-width: 900px)`; reading the
 * same query here keeps the DOM layer and the WebGL layer from disagreeing
 * about which layout they are in.
 *
 * Starts false so the server and the first client render match, then corrects
 * on mount — a `useSyncExternalStore` reading `matchMedia` would hydrate with
 * the real value and mismatch the server's.
 */
export function useNarrow(): boolean {
  const [narrow, setNarrow] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const sync = () => setNarrow(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return narrow
}
