'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

import { CursorDrivenParticleTypography } from '@/components/ui/cursor-driven-particle-typography'
import { enterWorld, getLoadingSnapshot, getServerLoadingSnapshot, subscribeLoading } from '@/game/loading/loadingState'

/**
 * The signature face, and the particles made from it.
 *
 * Componentry ships two pieces that each want to be the name: Signature, which
 * traces a font into stroked SVG paths, and the cursor-driven particle
 * typography, which samples rendered text into particles. Stacking both would put
 * the name on screen twice, so they are combined instead — the signature's own
 * typeface (Lastoria, the face the Signature component loads) is what the
 * particle sampler rasterises. One name, signature character, particles that
 * answer the cursor.
 */
const SIGNATURE_FACE = '"Lastoria", "Segoe Script", cursive'
/** Warm ivory. Never pure white against the forest. */
const NAME_COLOUR = '#f4ecd8'

/** True once the signature face is available to the canvas rasteriser. */
function useSignatureFace() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let cancelled = false
    const done = () => {
      if (!cancelled) setReady(true)
    }
    // Sampling before the face loads would rasterise the fallback and keep it.
    document.fonts.load('700 200px Lastoria').then(done, done)
    return () => {
      cancelled = true
    }
  }, [])
  return ready
}

/**
 * The type size that actually fits the line.
 *
 * The Componentry component caps its font at 15% of its container's width, which
 * is a guess about the text — for a wide script face like this one it lets the
 * glyphs run past both edges and the sampler clips them. So the face is measured
 * once, and the size is set from the real advance width and the box height.
 */
function useFittedSize(text: string, box: HTMLElement | null, share: number) {
  const [size, setSize] = useState(0)
  useEffect(() => {
    if (!box) return
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) return
    const fit = () => {
      context.font = `bold 100px ${SIGNATURE_FACE}`
      const ratio = context.measureText(text).width / 100
      const rect = box.getBoundingClientRect()
      if (!ratio || !rect.width) return
      // The stacked lines are deliberately wider than the screen — that is how the
      // component's own width-based cap is defeated — so the *text* is fitted to
      // whichever is narrower, the box or the viewport, and then to `share` of it:
      // the name leads the composition, it does not fill it. The world has to stay
      // visible around it.
      const available = Math.min(rect.width, window.innerWidth) * share
      const byWidth = available / ratio
      // A script face needs about 1.7x its size in height, ascender to descender.
      const byHeight = rect.height / 1.7
      setSize(Math.max(28, Math.min(byWidth, byHeight)))
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(box)
    return () => observer.disconnect()
  }, [text, box, share])
  return size
}

/** How much of the viewport's width the name may take, by composition. */
const NAME_SHARE = { line: 0.58, stacked: 0.84 }

/** The name recomposes on narrow screens rather than shrinking into a heading. */
function useStackedName() {
  const [stacked, setStacked] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(max-width: 720px)')
    const sync = () => setStacked(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])
  return stacked
}

/**
 * The title screen.
 *
 * A shot of the real world — EntryRig drives the camera — with the name standing
 * in it as particles and one way in. No portfolio chrome and no explanatory copy:
 * the name is the hero, the world is the atmosphere, the interaction is a line of
 * text and a ring.
 *
 * Server-rendered, so the first paint is dark forest rather than a white page.
 * The loading phase keeps its hairline of real progress; only the composition
 * around it changed.
 */
export function LoadingScreen() {
  const { phase, progress } = useSyncExternalStore(subscribeLoading, getLoadingSnapshot, getServerLoadingSnapshot)
  const [gone, setGone] = useState(false)
  const faceReady = useSignatureFace()
  const stacked = useStackedName()

  // The fade is what removes this from the DOM, and `transitionend` is the signal
  // for it — but an interrupted or skipped transition never fires one, which would
  // leave an invisible overlay mounted for the session. The timer is the backstop.
  useEffect(() => {
    if (phase !== 'ready') return
    const timer = window.setTimeout(() => setGone(true), 1200)
    return () => window.clearTimeout(timer)
  }, [phase])

  // X enters, the same key that leaves the world later (docs/03 §11).
  useEffect(() => {
    if (phase !== 'landing') return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyX' && !event.repeat && !event.ctrlKey && !event.metaKey && !event.altKey) enterWorld()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [phase])

  if (gone) return null

  const open = phase === 'landing' || phase === 'ready'
  const percent = Math.round(progress * 100)

  return (
    <div
      className="entry"
      data-phase={phase}
      // The scrim lifts with real progress, so the world is arriving in view the
      // whole time rather than being unveiled at the end.
      style={{ '--entry-reveal': open ? 1 : progress } as React.CSSProperties}
      onTransitionEnd={(event) => {
        if (phase === 'ready' && event.target === event.currentTarget) setGone(true)
      }}
    >
      <div className="entry-scrim" aria-hidden />

      {phase === 'error' ? (
        <div className="entry-frame">
          <h1 className="entry-name">
            <span className="entry-name-plain">Vishav Mehra</span>
          </h1>
          <p className="entry-failed" role="alert">
            The world failed to load.
          </p>
          <button type="button" className="entry-enter" onClick={() => window.location.reload()}>
            <span className="entry-enter-label">Try again</span>
          </button>
        </div>
      ) : (
        <div className="entry-frame">
          <h1 className="entry-name" data-stacked={stacked ? '' : undefined}>
            {/* A canvas carries no text for assistive technology, so the name is
                here too — and it is what shows for the moment before the
                signature face has loaded. */}
            <span className="entry-name-reader">Vishav Mehra</span>
            {faceReady ? (
              <span className="entry-name-particles" aria-hidden>
                {stacked ? (
                  <>
                    <ParticleName text="Vishav" share={NAME_SHARE.stacked} />
                    <ParticleName text="Mehra" share={NAME_SHARE.stacked} />
                  </>
                ) : (
                  <ParticleName text="Vishav Mehra" share={NAME_SHARE.line} />
                )}
              </span>
            ) : (
              <span className="entry-name-plain" aria-hidden>
                Vishav Mehra
              </span>
            )}
          </h1>

          <p className="entry-role">Software Engineer</p>

          {open ? (
            <button type="button" className="entry-enter" onClick={enterWorld}>
              <span className="entry-enter-label">Enter world</span>
              {/* A ring with a light in it: the entrance control, not an arrow. */}
              <span className="entry-mark" aria-hidden>
                <span className="entry-mark-dot" />
              </span>
              <span className="entry-enter-hint">
                <span className="entry-enter-click">Click to enter or press X</span>
                <span className="entry-enter-tap">Tap to enter</span>
              </span>
            </button>
          ) : (
            <div className="entry-loading">
              <div
                className="entry-line"
                role="progressbar"
                aria-label="Loading the world"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
              >
                <span style={{ transform: `scaleX(${progress})` }} />
              </div>
              <p className="entry-percent">{percent}%</p>
            </div>
          )}

          {open ? <p className="entry-aside">Mind the bridge.</p> : null}
        </div>
      )}
    </div>
  )
}

/**
 * One line of the name.
 *
 * The Componentry component caps its own type at 15% of its container's width, so
 * the line's width is what sets the scale: the CSS gives each line a container
 * wider than the glyphs need and they grow into it.
 */
function ParticleName({ text, share }: { text: string; share: number }) {
  const [box, setBox] = useState<HTMLElement | null>(null)
  const size = useFittedSize(text, box, share)

  return (
    <span className="entry-name-line" ref={setBox}>
      {size > 0 && (
      <CursorDrivenParticleTypography
        className="entry-name-canvas"
        text={text}
        fontSize={size}
        fontFamily={SIGNATURE_FACE}
        color={NAME_COLOUR}
        particleSize={2.1}
        particleDensity={4}
        dispersionStrength={26}
        returnSpeed={0.06}
      />
      )}
    </span>
  )
}
