import type { Metadata } from 'next'
import { Space_Grotesk, Orbitron } from 'next/font/google'
import './globals.css'
import { GlobalShell } from '@/components/ui/GlobalShell'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '700', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NEURIX — Human Intelligence Analysis System',
  description:
    'Input your biometrics, speak your story — NEURIX maps your profile through a synthetic, anonymized Team USA-inspired archetype archive.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${orbitron.variable}`}>
      <body>
        <ErrorBoundary>
          <GlobalShell>{children}</GlobalShell>
        </ErrorBoundary>
      </body>
    </html>
  )
}
