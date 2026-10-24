import type { Metadata, Viewport } from 'next'
import './globals.css'

import { WorldHandoff } from '@/ui/transition/WorldHandoff'

export const metadata: Metadata = {
  title: 'Vishav Mehra',
  description: 'A small playable world that doubles as a portfolio.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  // The colour the browser paints around the app before it renders. It used to be
  // the old parchment; both worlds are green now, so the chrome matches them.
  themeColor: '#0d1310',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Above both routes: the crossing between the world and the portfolio
            happens underneath this, which is why the route change is never seen. */}
        <WorldHandoff />
      </body>
    </html>
  )
}
