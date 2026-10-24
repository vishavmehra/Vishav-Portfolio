import type { ExperienceEntry } from './types'

/**
 * Professional experience, most recent first.
 *
 * Roles, dates, stacks and bullet points are the résumé's own text. Nothing is
 * summarised, rephrased into claims it does not make, or padded.
 */
export const EXPERIENCE: readonly ExperienceEntry[] = [
  {
    id: 'siemens-associate',
    organisation: 'Siemens Digital Industries Software',
    role: 'Software Engineer (Associate)',
    period: 'Jul 2026 - Present',
    stack: ['C++', 'NX', 'Unit Testing'],
    points: [
      'Engineered license decomposition for NX Assembly Constraints, enabling feature-level licensing and reducing unnecessary dependency on higher-tier Assembly capabilities.',
      'Designed and implemented cross-layer license management covering checkout, release, and stateful licensing across commands, undo operations, part closure, and session lifecycle.',
      'Extended and validated Assembly and Design Center workflows, ensuring consistent licensing behavior across diverse feature execution paths and application states.',
    ],
  },
  {
    id: 'siemens-intern',
    organisation: 'Siemens Digital Industries Software',
    role: 'Student Intern',
    period: 'May 2025 - Jun 2026',
    stack: ['C++', 'NX', 'Unit Testing'],
    points: [
      'Engineered an AI-powered Assembly Search framework supporting structured queries, multi-condition filtering, result aggregation, and efficient retrieval across complex product structures.',
      'Expanded Assembly Search with rich component properties and metadata, including physical properties, spatial information, component states, and assembly-specific attributes.',
      'Developed advanced Assembly and positioning functionality, improving feature workflows while implementing and validating licensing behavior for assembly-related capabilities.',
      'Integrated and enhanced assembly data retrieval and presentation, including descriptive component information, search result enrichment, and contextual tooltips.',
      'Implemented performance instrumentation and automated testing for assembly workflows, while debugging data-flow, runtime, and integration issues across multiple software components.',
    ],
  },
  {
    id: 'iit-kanpur',
    organisation: 'IIT Kanpur',
    role: 'Research Intern',
    period: 'May 2025 - Sep 2025',
    stack: ['Python', 'Regex', 'Small Language Models', 'LLM', 'Reinforcement Learning'],
    points: [
      'Built a web scraping pipeline using Python to collect legal templates and clauses from online sources for AI tasks.',
      'Designed an automated timekeeping system for lawyers that uses regex to classify and log case activities; prototyping a small language model to generate and refine regex patterns for more accurate categorization.',
      'Developing a legal AI framework to generate templates and retrieve clauses based on user input, enabling dynamic document creation and adaptation.',
      'Implementing an LLM-based template modification module with reinforcement learning from user feedback to reduce hallucinations and enforce legal compliance.',
    ],
  },
  {
    id: 'salesforce',
    organisation: 'SalesForce',
    role: 'Developer Intern',
    period: 'Oct 2023 - Nov 2023',
    stack: ['LWC', 'API', 'Apex Testing', 'CLI Setup', 'Process Automation'],
    points: [
      'Played a pivotal role in the establishment of a Salesforce Org, driving organizational efficiency.',
      "Developed intricate validation rules and workflow automation using Salesforce's flow/process builder.",
    ],
    links: [{ label: 'Certificate', href: 'https://drive.google.com/file/d/12A-khIoEgpr9jXJp58BJ9zrh8gqfEPG4/view?usp=drive_link' }],
  },
] as const
