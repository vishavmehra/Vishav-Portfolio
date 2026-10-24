import {
  ABOUT,
  ACHIEVEMENTS,
  CONTACT_LINKS,
  EDUCATION,
  EXPERIENCE,
  PROJECTS,
  PROFILE,
  SKILLS,
} from '@/portfolio/data'
import type { Link } from '@/portfolio/data/types'
import type { ContentId } from '@/portfolio/state/selection'

/**
 * The opened sections, built from the content.
 *
 * Presentation only: every string here is read from `src/portfolio/data`,
 * which is read from the résumé. A field the résumé does not state stays
 * absent — `meta`, `tags` and `links` are frequently undefined rather than
 * carrying a placeholder (CLAUDE.md §19, §62).
 */
export interface ContentCard {
  readonly id: string
  readonly kicker: string
  readonly title: string
  /** A date range, grade, or other short fact under the title. */
  readonly meta?: string
  readonly body: string
  readonly tags?: readonly string[]
  readonly links?: readonly Link[]
}

export interface ContentSection {
  readonly id: ContentId
  readonly kicker: string
  readonly title: string
  readonly cards: readonly ContentCard[]
}

const about: ContentSection = {
  id: 'about',
  kicker: 'About',
  title: PROFILE.name,
  cards: [
    {
      id: 'profile',
      kicker: 'Profile',
      title: PROFILE.name,
      meta: PROFILE.title,
      /* ABOUT.bio is deliberately absent — the résumé has no summary section —
         so the focus areas stand as the factual description rather than a
         paragraph written on his behalf. */
      body: ABOUT.focus.join(' · '),
      links: CONTACT_LINKS,
    },
    ...SKILLS.map((group) => ({
      id: `skills-${group.group}`,
      kicker: 'Skills',
      title: group.group,
      meta: `${group.items.length} listed`,
      body: group.items.join(' · '),
      tags: group.items.slice(0, 6),
    })),
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
    body: role.points.join(' '),
    tags: role.stack,
    links: role.links,
  })),
}

const projects: ContentSection = {
  id: 'projects',
  kicker: 'Projects',
  title: 'Things built',
  cards: PROJECTS.map((project) => ({
    id: project.id,
    kicker: project.category === 'research' ? 'Research' : 'Project',
    title: project.title,
    body: project.points.join(' '),
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
    body: [entry.specialisation, entry.place].filter(Boolean).join(' · '),
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
    body: entry.detail,
    links: entry.href ? [{ label: 'View', href: entry.href }] : undefined,
  })),
}

export const SECTIONS: Record<ContentId, ContentSection> = {
  about,
  experience,
  projects,
  education,
  achievements,
}
