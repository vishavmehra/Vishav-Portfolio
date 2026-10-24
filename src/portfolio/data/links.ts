import { PROFILE } from './profile'
import type { Link } from './types'

/**
 * The closing links.
 *
 * Built from the profile so a changed address changes in one place, and so the
 * final scene never carries a hard-coded URL of its own.
 */
export const CONTACT_LINKS: readonly Link[] = [
  { label: 'Résumé', href: PROFILE.links.resume },
  { label: 'LinkedIn', href: PROFILE.links.linkedin },
  { label: 'GitHub', href: PROFILE.links.github },
  { label: 'Email', href: `mailto:${PROFILE.email}` },
  { label: 'Phone', href: `tel:${PROFILE.phone.replace(/[^+\d]/g, '')}` },
] as const
