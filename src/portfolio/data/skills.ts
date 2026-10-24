import type { SkillGroup } from './types'

/** The résumé's own four groupings, in its own order. */
export const SKILLS: readonly SkillGroup[] = [
  {
    group: 'Languages',
    items: ['C', 'C++', 'Python', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'QT'],
  },
  {
    group: 'Frameworks / Libraries',
    items: ['ReactJS', 'NextJS', 'ThreeJS', 'NodeJS', 'ExpressJS', 'Framer Motion', 'TailwindCSS', 'Shadcn'],
  },
  {
    group: 'Databases / Tools',
    items: [
      'MySQL',
      'PostgreSQL',
      'MongoDB',
      'Firebase',
      'Supabase',
      'Clerk',
      'Resend',
      'Edgestore',
      'VS Code',
      'PyCharm',
    ],
  },
  {
    group: 'Coursework',
    items: ['Object Oriented Programming', 'Computer Networks', 'Operating Systems', 'DBMS'],
  },
] as const
