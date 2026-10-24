import type { Metadata } from 'next'

import { WorldStage } from '@/portfolio/world/WorldStage'

/*
 * The portfolio world, before it carries any content.
 *
 * What is here is the rendering foundation — procedural geometry, the moss
 * shaders, instancing, haze, parallax and the pointer spray — with the
 * reference's own branding, navigation and copy removed. The portfolio's
 * chapters are a later pass; nothing on this page is final.
 */
export const metadata: Metadata = {
  title: 'Portfolio',
}

export default function PortfolioPage() {
  return <WorldStage />
}
