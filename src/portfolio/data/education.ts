import type { EducationEntry } from './types'

/** Both degrees, most recent first, exactly as the résumé prints them. */
export const EDUCATION: readonly EducationEntry[] = [
  {
    institution: 'Sardar Vallabhbhai National Institute of Technology',
    qualification: 'Master of Technology, Computer Science and Engineering',
    specialisation: 'Information Security and Privacy',
    place: 'Surat, Gujarat',
    period: '2024 — 2026',
    cgpa: '8.57',
  },
  {
    institution: 'Netaji Subhas University of Technology',
    qualification: 'Bachelor of Technology, Information Technology',
    specialisation: 'Network and Information Security',
    place: 'New Delhi',
    period: '2020 — 2024',
    cgpa: '7.59',
  },
] as const
