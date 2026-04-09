import type { Metadata } from 'next'
import { Space_Grotesk, Orbitron } from 'next/font/google'
import './globals.css'
import { GlobalShell } from '@/components/ui/GlobalShell'

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
    'Input your biometrics, speak your story — NEURIX analyzes your biometric profile against 120 years of Team USA history and maps your path forward.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${orbitron.variable}`}>
      <body>
        <GlobalShell>{children}</GlobalShell>
      </body>
    </html>
  )
}
