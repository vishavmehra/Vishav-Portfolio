/**
 * The portfolio's pictures.
 *
 * Content, not composition: this file says *what* each image is, and
 * `ui/portfolio/world/images.ts` says where it sits in the frame, how deep it
 * is, how far it parallaxes and when the journey brings it in. Swapping a
 * picture is an edit here and nowhere else — the scene, the timeline and the
 * reveal never see a file name.
 *
 * Nothing is invented. An entry with no `src` is a reserved place in the
 * composition and renders nothing at all, exactly as an empty section renders
 * no chapter (CLAUDE.md §19, §62).
 */

export type PortfolioVisual = {
  src: string
  /** Required with a source. Describes the picture, never "image of…". */
  alt: string
}

export type PortfolioVisuals = {
  hero?: PortfolioVisual
  about?: PortfolioVisual
  experience?: PortfolioVisual
  projects?: PortfolioVisual
}

/**
 * MISSING, pending the owner's files: hero, about, experience and project
 * pictures. No image asset exists in the project yet, so every entry is absent
 * and nothing is rendered for them. The reveal architecture is in place and
 * needs only a source to light up.
 */
export const VISUALS: PortfolioVisuals = {}
