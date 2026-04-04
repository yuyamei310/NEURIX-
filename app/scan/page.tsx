'use client'

import { useRouter } from 'next/navigation'
import { BiometricSliders } from '@/components/scan/BiometricSliders'
import { HabitGrid } from '@/components/scan/HabitGrid'
import { VoiceInput } from '@/components/scan/VoiceInput'
import { AgentModeSelector } from '@/components/scan/AgentModeSelector'
import { ArchetypeDriftLabel } from '@/components/scan/ArchetypeDriftLabel'
import { Button } from '@/components/ui/Button'

export default function ScanPage() {
  const router = useRouter()
  const handleAnalyze = () => {
    // Store biometrics are already in Zustand — navigate directly
    router.push('/thinking')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-[0.5px] border-[var(--border)]">
        <div className="flex items-center gap-3">
          <span className="font-mono-data">ATLAS</span>
          <span className="text-[var(--border-2)]">·</span>
          <span className="font-mono-data">SCAN</span>
        </div>
        <ArchetypeDriftLabel />
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-8 py-10 flex flex-col gap-10">
        {/* Biometrics */}
        <section>
          <div className="font-mono-data mb-5">BIOMETRICS</div>
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

        {/* CTA */}
        <div className="flex flex-col gap-3 pt-2">
          <Button size="lg" onClick={handleAnalyze} className="w-full">
            Analyze with Gemini →
          </Button>
          <p className="text-[12px] text-[var(--text-3)] text-center">
            One Gemini call · Results in ~10 seconds
          </p>
        </div>
      </main>
    </div>
  )
}
