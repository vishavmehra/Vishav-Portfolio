import type { About, Profile } from './types'

/**
 * Identity and contact.
 *
 * Every value is taken from `public/resume/VishavMehraResume.pdf` — the text for
 * the name, role, email and phone, and the link targets from the PDF's own URI
 * annotations rather than from guesswork.
 */
export const PROFILE: Profile = {
  name: 'Vishav Mehra',
  title: 'Software Engineer',
  email: 'mehravishav26@gmail.com',
  phone: '+91-8376000825',
  links: {
    linkedin: 'https://www.linkedin.com/in/vishav-mehra-755107208/',
    github: 'https://github.com/vishavmehra',
    resume: '/resume/VishavMehraResume.pdf',
  },
  // MISSING: the résumé states no city of residence. Surat and New Delhi appear
  // only as the locations of his universities, which is not the same claim.
}

/**
 * The About material.
 *
 * `headline` and `focus` are the résumé's own words. `bio` is deliberately
 * absent: the résumé has no summary or objective section, so any paragraph here
 * would be written by me rather than by him.
 */
export const ABOUT: About = {
  headline: 'Software Engineer',
  /* Wording requested by the owner on 2026-10-24. Every clause restates a
     fact recorded elsewhere in this data — the role in experience.ts, the
     project domains in projects.ts, the honours in achievements.ts — so the
     About makes no claim the rest of the portfolio does not already make.
     Degrees are deliberately absent here; they belong to Education. */
  tagline: 'Software engineer across machine learning, web and systems',
  summary: [
    'Software engineer at Siemens Digital Industries Software, working in C++ on NX.',
    'Machine learning work spanning retrieval-grounded research assistants, transformer ensembles for fake-news detection, medical RAG and speech assessment.',
    'Full-stack web development with Next.js, TypeScript and PostgreSQL / Supabase.',
    'Google Summer of Code contributor and competitive programmer: Codeforces Candidate Master, LeetCode Guardian.',
  ],
  focus: [
    'Information Security and Privacy',
    'Network and Information Security',
    'C++ and NX systems engineering',
    'Web engineering',
    'Applied AI and language models',
  ],
}
