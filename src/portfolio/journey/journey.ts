/**
 * The journey: one progress value, 0 → 1, for the whole portfolio.
 *
 * Scroll is not a page position here, it is time through a world. Everything
 * that moves — the camera, the stem, which chapter is lit — reads this one
 * number, so nothing can disagree about where the visitor is.
 *
 * Deliberately not React. Progress changes every frame, and putting it in
 * state would re-render the tree sixty times a second (CLAUDE.md §29). The
 * scene's existing frame loop calls {@link stepJourney} and applies the result;
 * React only hears about whole chapters, which change rarely.
 *
 * There is also no requestAnimationFrame in this file, on purpose. The world
 * already runs exactly one loop and this rides inside it.
 */

export type ChapterId =
  | 'hero'
  | 'about'
  | 'experience'
  | 'projects'
  | 'education'
  | 'skills'
  | 'achievements'
  | 'resume'
  | 'contact'

export interface Chapter {
  readonly id: ChapterId
  readonly label: string
  /** Where this chapter sits on the journey. */
  readonly at: number
}

/**
 * Authored waypoints. These are locations in one world, not sections of a page,
 * so they are allowed to overlap and nothing here draws a boundary between
 * them — a chapter is simply the nearest waypoint.
 */
export const CHAPTERS: readonly Chapter[] = [
  { id: 'hero', label: 'Hero', at: 0.0 },
  { id: 'about', label: 'About', at: 0.1 },
  { id: 'experience', label: 'Experience', at: 0.25 },
  { id: 'projects', label: 'Projects', at: 0.42 },
  { id: 'education', label: 'Education', at: 0.57 },
  { id: 'skills', label: 'Skills', at: 0.7 },
  { id: 'achievements', label: 'Achievements', at: 0.78 },
  { id: 'resume', label: 'Résumé', at: 0.88 },
  { id: 'contact', label: 'Contact', at: 1.0 },
] as const

export function chapterProgress(id: ChapterId): number {
  return CHAPTERS.find((c) => c.id === id)?.at ?? 0
}

export function chapterAt(progress: number): ChapterId {
  let best = CHAPTERS[0]
  for (const c of CHAPTERS) {
    if (Math.abs(c.at - progress) < Math.abs(best.at - progress)) best = c
  }
  return best.id
}

/* ----------------------------------------------------------------- camera */

export interface CameraPoint {
  x: number
  y: number
  z: number
}

/**
 * Where the camera is at each waypoint, in world units — which are CSS pixels
 * at z=0, so the DOM layer can read this directly. The scene drives the camera
 * from it; the cards place themselves from it, so a card authored for a
 * chapter is guaranteed to be in frame when the camera gets there.
 */
export const CAMERA_PATH: readonly (CameraPoint & { at: number })[] = [
  { at: 0.0, x: 0, y: 0, z: 1400 },
  { at: 0.1, x: -120, y: -70, z: 1180 },
  { at: 0.25, x: 180, y: -150, z: 1020 },
  { at: 0.42, x: -220, y: -240, z: 900 },
  { at: 0.57, x: 160, y: -330, z: 820 },
  { at: 0.7, x: -90, y: -410, z: 760 },
  { at: 0.78, x: 140, y: -470, z: 720 },
  { at: 0.88, x: -60, y: -540, z: 680 },
  { at: 1.0, x: 0, y: -620, z: 640 },
] as const

/** The camera's distance at rest; also the CSS perspective the DOM layers use. */
export const CAMERA_DIST = 1400

/**
 * Sample the path at a progress. Writes into `out` so the frame loop does not
 * allocate; smoothstepped between waypoints so there is no corner at one.
 */
export function sampleCameraPath(p: number, out: CameraPoint): CameraPoint {
  let i = 0
  while (i < CAMERA_PATH.length - 2 && p > CAMERA_PATH[i + 1].at) i++
  const a = CAMERA_PATH[i]
  const b = CAMERA_PATH[i + 1]
  const span = b.at - a.at
  let t = span <= 0 ? 0 : (p - a.at) / span
  t = Math.min(1, Math.max(0, t))
  t = t * t * (3 - 2 * t)
  out.x = a.x + (b.x - a.x) * t
  out.y = a.y + (b.y - a.y) * t
  out.z = a.z + (b.z - a.z) * t
  return out
}

/* ------------------------------------------------------------------ state */

let progress = 0
/** Where the navigator asked us to go, or null when scroll is in charge. */
let target: number | null = null
let chapter: ChapterId = 'hero'
const chapterListeners = new Set<(id: ChapterId) => void>()

export function getProgress(): number {
  return progress
}

export function getChapter(): ChapterId {
  return chapter
}

/** Server render has no scroll position; start at the beginning. */
export function getServerChapter(): ChapterId {
  return 'hero'
}

export function subscribeChapter(fn: (id: ChapterId) => void): () => void {
  chapterListeners.add(fn)
  return () => {
    chapterListeners.delete(fn)
  }
}

/**
 * Point the journey at a chapter. The camera travels there; it does not jump,
 * and this never touches the scroll API — `scrollIntoView` would fight the
 * easing below and hand control back to the browser mid-flight.
 */
export function setJourneyTarget(p: number | null): void {
  target = p === null ? null : Math.min(1, Math.max(0, p))
}

function scrollProgress(): number {
  const span = document.documentElement.scrollHeight - window.innerHeight
  if (span <= 0) return 0
  return Math.min(1, Math.max(0, window.scrollY / span))
}

/**
 * Advance one frame and return the current progress.
 *
 * Called from the world's frame loop with its delta. Easing is framerate
 * independent so a 30fps device travels at the same speed as a 120fps one.
 */
export function stepJourney(dt: number): number {
  const wanted = target ?? scrollProgress()

  /* When the navigator is driving, ease firmly enough to feel deliberate; when
     scroll is driving, stay close to the visitor's hand. */
  const rate = target === null ? 12 : 3.2
  const k = 1 - Math.exp(-rate * Math.min(dt, 0.1))
  progress += (wanted - progress) * k

  if (target !== null && Math.abs(target - progress) < 0.0005) {
    progress = target
    /* Hand control back to scroll, and put the scrollbar where the camera
       actually is, so the next wheel tick continues from here instead of
       snapping back to wherever the page was left. */
    const span = document.documentElement.scrollHeight - window.innerHeight
    if (span > 0) window.scrollTo({ top: progress * span, behavior: 'auto' })
    target = null
  }

  const next = chapterAt(progress)
  if (next !== chapter) {
    chapter = next
    for (const fn of chapterListeners) fn(chapter)
  }
  return progress
}
