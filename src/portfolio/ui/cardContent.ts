import { ABOUT, ACHIEVEMENTS, EDUCATION, EXPERIENCE, PROFILE, PROJECTS_BY_RECENCY, SKILLS, VISUALS } from '@/portfolio/data'
/* `PortfolioVisual` lives with the visuals themselves; the barrel re-exports
   the value but not this type. */
import type { PortfolioVisual } from '@/portfolio/data/visuals'
import type { ContentId } from '@/portfolio/state/selection'

/**
 * What each world card says.
 *
 * Derived from the content, never written here: a card shows a count because
 * the data has that many entries, and names an employer because the résumé
 * names one. Change the résumé-derived data and these change with it.
 *
 * `plate` is usually absent, and that is correct — no picture exists in the
 * project yet (`VISUALS` is empty). The card renders no image frame at all in
 * that case rather than an empty container (CLAUDE.md §19).
 */
export interface CardContent {
  readonly id: ContentId
  readonly label: string
  readonly title: string
  readonly teaser: string
  readonly plate?: PortfolioVisual
}

/** "Master of Technology, Computer Science and Engineering" -> "M.Tech" etc. */
function shortDegree(qualification: string): string {
  if (/^Master of Technology/i.test(qualification)) return 'M.Tech'
  if (/^Bachelor of Technology/i.test(qualification)) return 'B.Tech'
  return qualification
}

function list(items: readonly string[], max: number): string {
  return items.slice(0, max).join(' · ')
}

const newest = EXPERIENCE[0]
const degrees = EDUCATION.map((e) => shortDegree(e.qualification))

export const CARDS: readonly CardContent[] = [
  {
    id: 'about',
    label: 'About',
    title: PROFILE.name,
    teaser: ABOUT.tagline ?? list(ABOUT.focus, 2),
    plate: VISUALS.about,
  },
  {
    id: 'experience',
    label: 'Experience',
    title: newest.organisation,
    teaser: `${newest.role} · ${newest.period}`,
    plate: VISUALS.experience,
  },
  {
    id: 'projects',
    label: 'Projects',
    title: 'Projects I have built',
    teaser: list(PROJECTS_BY_RECENCY.map((p) => p.title), 2),
    plate: VISUALS.projects,
  },
  {
    id: 'education',
    label: 'Education',
    title: degrees.join(' · '),
    teaser: EDUCATION[0].specialisation ?? EDUCATION[0].institution,
  },
  {
    id: 'skills',
    label: 'Skills',
    title: 'Technical skills',
    teaser: SKILLS.map((g) => g.group).join(' · '),
  },
  {
    id: 'achievements',
    label: 'Achievements',
    title: 'Contests and programs',
    teaser: list(
      ACHIEVEMENTS.map((a) => a.title.split(' (')[0]),
      2,
    ),
  },
] as const
