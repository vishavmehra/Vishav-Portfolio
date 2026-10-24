'use client'

import { useEffect, useState } from 'react'

/**
 * Whether on-screen touch controls should show.
 *
 * True on touch-primary devices, and on hybrids as soon as a genuine touch lands.
 * Viewport width alone is not a reliable signal: a narrow window on a desktop is
 * still a keyboard machine. Shared by every touch control so they appear together.
 */
export function useTouchControls(): boolean {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)')
    const apply = () => setVisible(query.matches)
    apply()
    query.addEventListener('change', apply)

    const onFirstTouch = (event: PointerEvent) => {
      if (event.pointerType === 'touch') setVisible(true)
    }
    window.addEventListener('pointerdown', onFirstTouch, { passive: true })

    return () => {
      query.removeEventListener('change', apply)
      window.removeEventListener('pointerdown', onFirstTouch)
    }
  }, [])

  return visible
}
