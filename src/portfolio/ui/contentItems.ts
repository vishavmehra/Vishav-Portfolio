import {
  ABOUT,
  ACHIEVEMENTS,
  CONTACT_LINKS,
  EDUCATION,
  EXPERIENCE,
  PROFILE,
  PROJECTS_BY_RECENCY,
  SKILLS,
} from '@/portfolio/data'
import type { Link } from '@/portfolio/data/types'
import type { ContentId } from '@/portfolio/state/selection'

/**
 * The opened sections, built from the content.
 *
 * Presentation only: every string here is read from `src/portfolio/data`,
 * which is read from the résumé and the repositories. A field the source does
 * not state stays absent — `meta`, `tags` and `links` are frequently undefined
 * rather than carrying a placeholder (CLAUDE.md §19, §62).
 *
 * `points` is a list on purpose: the cards read as bullet points, and a card
 * with a single point renders it as one line rather than a one-item list.
 */
export interface ContentCard {
  readonly id: string
  readonly kicker: string
  readonly title: string
  /** A date range, grade, or other short fact under the title. */
  readonly meta?: string
  readonly points: readonly string[]
  readonly tags?: readonly string[]
  readonly links?: readonly Link[]
}

export interface ContentSection {
  readonly id: ContentId
  readonly kicker: string
  readonly title: string
  readonly cards: readonly ContentCard[]
}

/* About is one card. ABOUT.bio is deliberately absent — the résumé has no
   summary section — so the focus areas stand as the facts about him rather
   than a paragraph written on his behalf. */
const about: ContentSection = {
  id: 'about',
  kicker: 'About',
  title: PROFILE.name,
  cards: [
    {
      id: 'profile',
      kicker: PROFILE.title,
      title: PROFILE.name,
      /* The bio is one paragraph in his own words; the facts live in the
         other sections, so nothing else is listed here. */
      points: ABOUT.bio ? [ABOUT.bio] : ABOUT.focus,
      links: CONTACT_LINKS,
    },
  ],
}

const experience: ContentSection = {
  id: 'experience',
  kicker: 'Experience',
  title: 'Where the work happened',
  cards: EXPERIENCE.map((role) => ({
    id: role.id,
    kicker: role.role,
    title: role.organisation,
    meta: role.period,
    points: role.points,
    tags: role.stack,
    links: role.links,
  })),
}

const projects: ContentSection = {
  id: 'projects',
  kicker: 'Projects',
  title: 'Things built',
  cards: PROJECTS_BY_RECENCY.map((project) => ({
    id: project.id,
    kicker: project.category === 'research' ? 'Research' : 'Project',
    title: project.title,
    points: project.points,
    tags: project.stack,
    links: project.links,
  })),
}

const education: ContentSection = {
  id: 'education',
  kicker: 'Education',
  title: 'Where it was learnt',
  cards: EDUCATION.map((entry, i) => ({
    id: `edu-${i}`,
    kicker: entry.qualification,
    title: entry.institution,
    /* CGPA is optional because the résumé does not print one for every entry;
       an absent grade shows nothing rather than a dash. */
    meta: entry.cgpa ? `${entry.period} · CGPA ${entry.cgpa}` : entry.period,
    points: [entry.specialisation, entry.place].filter((s): s is string => Boolean(s)),
  })),
}

/* One card per group the résumé lists, each group's items as the points. */
const skills: ContentSection = {
  id: 'skills',
  kicker: 'Skills',
  title: 'What I work with',
  cards: SKILLS.map((group) => ({
    id: `skills-${group.group}`,
    kicker: 'Skills',
    title: group.group,
    meta: `${group.items.length} listed`,
    points: group.items,
  })),
}

const achievements: ContentSection = {
  id: 'achievements',
  kicker: 'Achievements',
  title: 'What came of it',
  cards: ACHIEVEMENTS.map((entry) => ({
    id: entry.id,
    kicker: 'Achievement',
    title: entry.title,
    points: [entry.detail],
    links: entry.href ? [{ label: 'View', href: entry.href }] : undefined,
  })),
}

export const SECTIONS: Record<ContentId, ContentSection> = {
  about,
  experience,
  projects,
  education,
  skills,
  achievements,
}
