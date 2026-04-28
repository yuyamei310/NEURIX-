'use client'

import { useRouter } from 'next/navigation'
import type { CSSProperties } from 'react'
import { ScanCore } from '@/components/scan/ScanCore'
import { BottomDrawer, DrawerSection } from '@/components/scan/BottomDrawer'
import { BiometricSliders } from '@/components/scan/BiometricSliders'
import { HabitGrid } from '@/components/scan/HabitGrid'
import { VoiceInput } from '@/components/scan/VoiceInput'
import { AgentModeSelector } from '@/components/scan/AgentModeSelector'
import { useAtlasStore } from '@/store/atlasStore'
import { getSyntheticArchiveProfile } from '@/lib/syntheticArchive'

export default function ScanPage() {
  const router = useRouter()
  const localClassification = useAtlasStore((s) => s.localClassification)
  const profile = getSyntheticArchiveProfile(localClassification.archetype)

  const handleAnalyze = () => {
    router.push('/thinking')
  }

  return (
    <div
      className="relative flex flex-col min-h-screen bg-[var(--bg)] overflow-hidden"
      style={{
        '--active-archetype-color': profile.color,
        '--active-archetype-soft': `${profile.color}22`,
      } as CSSProperties}
    >

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/[0.08] shrink-0 z-10">
        <span className="font-mono-data">NEURIX · SCAN</span>
        <span
          className="font-mono text-[9px] tracking-[0.22em] uppercase"
          style={{ color: profile.color }}
        >
          Ethics safe · synthetic archive
        </span>
      </header>

      {/* Center stage — ScanCore fills remaining space above drawer */}
      <main className="flex-1 flex items-center justify-center min-h-0" style={{ paddingBottom: '56px' }}>
        <div className="w-full h-full">
          <ScanCore />
        </div>
      </main>

      {/* Bottom drawer with all inputs */}
      <BottomDrawer onAnalyze={handleAnalyze}>
        <DrawerSection title="BIOMETRICS">
          <BiometricSliders />
        </DrawerSection>
        <DrawerSection title="VOICE INPUT">
          <VoiceInput />
        </DrawerSection>
        <DrawerSection title="ACTIVITY BACKGROUND">
          <HabitGrid />
        </DrawerSection>
        <DrawerSection title="AGENT MODE">
          <AgentModeSelector />
        </DrawerSection>
      </BottomDrawer>

    </div>
  )
}
