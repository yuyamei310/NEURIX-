'use client'

import { useRouter } from 'next/navigation'
import { BiometricSliders } from '@/components/scan/BiometricSliders'
import { HabitGrid } from '@/components/scan/HabitGrid'
import { VoiceInput } from '@/components/scan/VoiceInput'
import { AgentModeSelector } from '@/components/scan/AgentModeSelector'
import { CircularHUD } from '@/components/scan/CircularHUD'
import { ScanCore } from '@/components/scan/ScanCore'
import { BottomDrawer } from '@/components/scan/BottomDrawer'

export default function ScanPage() {
  const router = useRouter()
  const handleAnalyze = () => router.push('/thinking')

  return (
    <div
      className="dark-theme min-h-screen flex flex-col"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      {/* Ambient background effects */}
      <ScanCore />

      {/* Header */}
      <header
        className="relative flex items-center justify-between px-8 py-4"
        style={{
          borderBottom: '1px solid var(--border)',
          zIndex: 10,
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="font-orbitron tracking-[0.2em] uppercase"
            style={{
              fontSize: 11,
              color: 'var(--glow)',
              textShadow: '0 0 8px rgba(var(--glow-rgb), 0.6)',
            }}
          >
            ATLAS
          </span>
          <span style={{ color: 'var(--border-2)' }}>·</span>
          <span
            className="font-mono tracking-[0.15em] uppercase"
            style={{ fontSize: 10, color: 'var(--text-3)' }}
          >
            SCAN
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="font-mono tracking-[0.08em] uppercase"
            style={{ fontSize: 9, color: 'var(--text-3)' }}
          >
            BIOMETRIC INPUT
          </span>
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: 'var(--glow)',
              boxShadow: '0 0 6px var(--glow)',
              animation: 'neural-node-idle 2s ease-in-out infinite',
            }}
          />
        </div>
      </header>

      {/* Main content */}
      <main
        className="relative flex-1 max-w-2xl mx-auto w-full px-8 py-8 flex flex-col gap-8 pb-36"
        style={{ zIndex: 10 }}
      >
        {/* Circular HUD */}
        <section className="flex flex-col items-center">
          <CircularHUD />
        </section>

        {/* Biometrics */}
        <section>
          <div
            className="mb-4 font-mono tracking-[0.14em] uppercase"
            style={{ fontSize: 10, color: 'var(--text-3)' }}
          >
            BIOMETRICS
          </div>
          <BiometricSliders />
        </section>

        {/* Voice input */}
        <section>
          <VoiceInput />
        </section>

        {/* Habits */}
        <section>
          <HabitGrid />
        </section>

        {/* Agent mode */}
        <section>
          <AgentModeSelector />
        </section>
      </main>

      {/* Sticky bottom CTA drawer */}
      <BottomDrawer onAnalyze={handleAnalyze} />
    </div>
  )
}
