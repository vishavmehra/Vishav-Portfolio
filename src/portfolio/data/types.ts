/**
 * The portfolio's content schema.
 *
 * Content is separate from the world that presents it: nothing in the WebGL
 * scene, the camera or the timeline imports anything but these types, so a new
 * project or a changed date never touches rendering code.
 *
 * Everything here is sourced from `public/resume/VishavMehraResume.pdf`.
 * Optional fields are optional because the résumé does not state them — an
 * absent field is a fact about the source, not a gap to be filled in
 * (CLAUDE.md §24, §62: never invent, prefer omission).
 */

export type Link = {
  label: string
  href: string
}

export type Profile = {
  name: string
  /** Current role, exactly as the résumé states it. */
  title: string
  email: string
  phone: string
  links: {
    linkedin: string
    github: string
    resume: string
  }
  /** MISSING from the résumé: a stated city of residence. */
  location?: string
}

export type About = {
  /** The one-line professional identity the résumé supports. */
  headline: string
  /** Fields the résumé names as specialisations or focus areas. */
  focus: readonly string[]
  /**
   * Free prose in Vishav's own words. The résumé contains no summary or
   * objective section, so there is nothing to derive this from without
   * inventing it. Left undefined until he supplies it.
   */
  bio?: string
}

export type EducationEntry = {
  institution: string
  qualification: string
  /** Named specialisation, where the résumé gives one. */
  specialisation?: string
  place: string
  period: string
  /** As printed, e.g. "8.57" — kept a string so it renders exactly. */
  cgpa?: string
}

export type ExperienceEntry = {
  id: string
  organisation: string
  role: string
  period: string
  /** The technologies listed beside the role on the résumé. */
  stack: readonly string[]
  points: readonly string[]
  links?: readonly Link[]
}

export type ProjectEntry = {
  id: string
  title: string
  /** Personal projects and research papers are separate sections on the résumé. */
  category: 'project' | 'research'
  stack: readonly string[]
  points: readonly string[]
  links?: readonly Link[]
}

export type SkillGroup = {
  group: string
  items: readonly string[]
}

export type Achievement = {
  id: string
  /** The award, platform or programme. */
  title: string
  detail: string
  href?: string
}
