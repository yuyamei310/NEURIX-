import type { Metadata } from 'next'
import { Orbitron } from 'next/font/google'
import './globals.css'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-orbitron',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ATLAS — Team USA Athlete Intelligence',
  description:
    'Input your biometrics, speak your story — ATLAS finds your place in 120 years of Team USA history and shows you the path forward.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={orbitron.variable}>
      <body>{children}</body>
    </html>
  )
}
