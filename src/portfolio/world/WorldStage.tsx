'use client'

import { useEffect, useRef } from 'react'

import { ContentView } from '@/portfolio/ui/ContentView'
import { HeroType } from '@/portfolio/ui/HeroType'
import { Navigator } from '@/portfolio/ui/Navigator'
import { WorldCards } from '@/portfolio/ui/WorldCards'
import { mountWorldScene } from './scene'
import './world.css'

/**
 * The world, and everything standing in it.
 *
 * One canvas, one scene, one camera, one frame loop — all owned by
 * {@link mountWorldScene}, which also advances the journey. React's jobs are to
 * put the frame in the document and to start and stop that loop; nothing here
 * re-renders per frame and no Three.js object is made during a render
 * (CLAUDE.md §29).
 *
 * `#hero`, `#scene` and `#stage` are load-bearing names: the scene measures the
 * hero for its viewport and FOV, builds the renderer on the canvas, and maps
 * the stage's box onto the 1600-unit grid that places the roots. The `js` class
 * carries every pre-intro hidden state and has to be in the server-rendered
 * markup — set from an effect it would show the finished composition for a
 * frame, snap back to hidden, and only then animate in.
 */
export function WorldStage() {
  const hero = useRef<HTMLElement>(null)

  useEffect(() => {
    const host = hero.current
    if (!host) return

    /*
     * The journey reads the scroll position, so a restored one starts the
     * visitor part-way through the world — reloading after scrolling opened the
     * page at progress 0.23 with the camera already past the hero. The browser
     * restores scroll before this runs, so it has to be undone as well as
     * disabled. Normal scrolling is unaffected; only the restore is.
     */
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    /*
     * The canvas is created here rather than rendered by React, and it has to
     * be. A canvas hands out one drawing context for its lifetime — a lost
     * context cannot be replaced — so a second mount needs a brand new element.
     * StrictMode mounts effects twice in development, and if React owned this
     * node it would also try to remove one that had been swapped underneath it.
     */
    const canvas = document.createElement('canvas')
    canvas.id = 'scene'
    host.insertBefore(canvas, host.firstChild)

    const dispose = mountWorldScene()

    return () => {
      dispose()
      canvas.remove()
    }
  }, [])

  return (
    <>
      {/*
        Runs while the HTML is still being parsed, before React exists. On a
        reload Chrome restores the old scroll position after hydration, so
        setting this from the effect below was too late — the journey opened
        at 0.31 instead of 0. React never executes inline scripts it renders on
        the client, which is fine: a client-side arrival has nothing to restore.
      */}
      <script dangerouslySetInnerHTML={{ __html: "history.scrollRestoration='manual';scrollTo(0,0)" }} />
      <main className="hero world-root js" id="hero" ref={hero}>
        {/*
          Two layers on the same 1600 x 880 grid, one either side of the canvas.

          #stage carries z-index 1, which makes it a stacking context — so
          everything inside it paints below the canvas at z-index 3, however
          high its own z-index. That is right for the column guides, which are
          meant to sit behind the moss, and wrong for the interface: the cards
          and the name were being drawn under the vegetation. Hit-testing did
          not show it, because the canvas is pointer-events:none and so gets
          skipped by elementFromPoint while still painting over everything.

          #stage stays exactly as it was — the scene measures it to place the
          roots — and the interface moves to a sibling in front of the canvas.
        */}
        <div className="stage" id="stage">
          <div className="guides fade" style={{ ['--d' as string]: '900ms' }} aria-hidden="true">
            <i style={{ left: 'calc(405 * var(--u))' }} />
            <i style={{ left: 'calc(748 * var(--u))' }} />
            <i style={{ left: 'calc(1091 * var(--u))' }} />
          </div>
        </div>

        <div className="stage stage--front">
          <HeroType />
          <WorldCards />
          <Navigator />
        </div>

        {/* Mounts only while a section is open, so it costs nothing on the
            landing composition. */}
        <ContentView />
      </main>

      {/*
        The journey expressed as a length. It holds no content — scrolling it is
        how the visitor spends time in the world, and `journey.ts` reads the
        position. The hero above is fixed, so this scrolls behind it.
      */}
      <div className="journey-track" aria-hidden="true" />
    </>
  )
}
