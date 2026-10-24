import type { Achievement } from './types'

/**
 * Achievements, in the résumé's order.
 *
 * Ratings, ranks and competitor counts are transcribed exactly. Where the
 * résumé hyperlinks a platform, that target is kept; Code Gladiators has no
 * link on the résumé and therefore has none here.
 */
export const ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: 'gsoc',
    title: 'Google Summer of Code',
    detail:
      'Integrated LLM and vector-based retrieval pipelines into Rocket.Chat, enabling knowledge-grounded conversations and optimizing query understanding through efficient indexing and embeddings.',
  },
  {
    id: 'hacker-cup',
    title: "Hacker Cup '23 — Meta",
    detail: 'Secured 3412 Global rank in Round 2.',
    href: 'https://drive.google.com/file/d/1L6CuOuVQp2Cu1m-8ynpua6WhPnve7naH/view?usp=sharing',
  },
  {
    id: 'codeforces',
    title: 'Codeforces — Candidate Master',
    detail: 'Max rating 1903. Ranked 167th in Round 954, 307th in Epic Round (Div 1 + 2).',
    href: 'https://codeforces.com/profile/ThinkAgain',
  },
  {
    id: 'leetcode',
    title: 'LeetCode — Guardian',
    detail: 'Max rating 2329. Ranked 298th in Biweekly 117, 272nd in Weekly 373.',
    href: 'https://leetcode.com/vishav__mehra/',
  },
  {
    id: 'codechef',
    title: 'CodeChef — 5 Star',
    detail: 'Max rating 2025. Ranked 59th in Starter 86, 11th in Starter 100, 51st in Starter 117.',
    href: 'https://www.codechef.com/users/mehravishav26',
  },
  {
    id: 'code-for-freedom',
    title: "Code For Freedom '23 — Coding Ninjas",
    detail: 'Achieved AIR 131 out of 4000+ competitors.',
    href: 'https://drive.google.com/file/d/1XboKUfi7ojGtt5Vml2AmxvV5w9nJOtF4/view?pli=1',
  },
  {
    id: 'codekaze-sep',
    title: "CodeKaze Sep '23 — Coding Ninjas",
    detail: 'Secured 11th College Rank and an AIR of 344 among 1 lakh competitors.',
    href: 'https://drive.google.com/file/d/19EPk4hBk38D8a3F5lmbufGpF5X6oPlV2/view?usp=drive_link',
  },
  {
    id: 'code-gladiators',
    title: 'Code Gladiators — TechGig',
    detail: 'Secured 59 Global rank among 20000 competitors.',
  },
  {
    id: 'codekaze-jun',
    title: "CodeKaze Jun '23 — Coding Ninjas",
    detail: 'Secured 19th College Rank and an AIR of 711 among 2 lakh competitors.',
    href: 'https://drive.google.com/file/d/1Efa9FrOpIstLuniXihgjZtL6xnjXlsdV/view',
  },
  {
    id: 'geeksforgeeks',
    title: 'GeeksforGeeks',
    detail: 'Coding score 1200, Institute rank 131.',
    href: 'https://auth.geeksforgeeks.org/user/mehravishav26/practice',
  },
  {
    id: 'hackerrank',
    title: 'HackerRank — 5 Star',
    detail: 'C++ and Problem Solving.',
    href: 'https://www.hackerrank.com/mehravishav26?hr_r=1',
  },
] as const
