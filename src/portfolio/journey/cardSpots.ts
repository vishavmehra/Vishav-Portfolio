import { CAMERA_DIST, chapterProgress, sampleCameraPath, type ChapterId } from './journey'

/**
 * Where each chapter's card stands, shared by the DOM layer that draws the
 * card and the scene that grows moss around it. One definition, so the two
 * can never disagree about where a card is.
 */
export interface CardSpot {
  readonly id: ChapterId
  /** Journey progress at which this card is centred in view. */
  readonly at: number
  /** Where the card sits on screen when its chapter is current: px from the viewport centre. */
  readonly dx: number
  readonly dy: number
  /** translateZ in px; negative is deeper into the scene. */
  readonly cz: number
  /** Resting tilt, degrees. */
  readonly tilt: number
  /** Width on the 1600-unit grid. */
  readonly w: number
}

/* Authored and varied, deliberately not a grid: each chapter frames its card
   somewhere else, at its own depth and lean, so arriving somewhere new reads
   as finding something rather than reaching the next slide. */
const spot = (id: ChapterId, dx: number, dy: number, cz: number, tilt: number, w: number): CardSpot => ({
  id,
  at: chapterProgress(id),
  dx,
  dy,
  cz,
  tilt,
  w,
})

export const CARD_SPOTS: readonly CardSpot[] = [
  spot('about', -330, -40, -40, -3.1, 272),
  spot('experience', 300, -10, -100, 2.4, 262),
  spot('projects', -270, 50, 40, -2.2, 290),
  spot('education', 320, 90, -140, 3.0, 250),
  spot('skills', -300, -70, -90, 2.0, 252),
  spot('achievements', 40, -120, -70, -1.6, 244),
]

/**
 * The world-space offset that puts a card at its screen spot when the camera
 * is at its chapter. Inverts the scene's publication: a DOM card is translated
 * by (sx + jx, sy + jy) with jx = -cam.x and jy = cam.y, then scaled by
 * k = DIST / (cam.z - cz). The same numbers place the card's world position at
 * (sx, -sy, cz) in scene coordinates — world y is up, CSS y is down.
 *
 * k is returned as well: it is how much larger than its CSS box the card is
 * drawn at its chapter, and on a phone the stylesheet divides it back out so a
 * card authored deep in the scene is not also drawn wider than the screen.
 */
export function solveSpot(s: CardSpot, narrow: boolean): { sx: number; sy: number; k: number } {
  const cam = sampleCameraPath(s.at, { x: 0, y: 0, z: 0 })
  const k = CAMERA_DIST / (cam.z - s.cz)
  const dx = narrow ? 0 : s.dx
  const dy = narrow ? s.dy * 0.6 : s.dy
  return { sx: dx / k + cam.x, sy: dy / k - cam.y, k }
}
