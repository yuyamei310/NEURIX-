import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ATLAS — Team USA Athlete Intelligence',
  description:
    'Input your biometrics, speak your story — ATLAS finds your place in 120 years of Team USA history and shows you the path forward.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
