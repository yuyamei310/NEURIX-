'use client'

import { useRouter } from 'next/navigation'
import { ScanCore } from '@/components/scan/ScanCore'
import { BottomDrawer, DrawerSection } from '@/components/scan/BottomDrawer'
import { BiometricSliders } from '@/components/scan/BiometricSliders'
import { HabitGrid } from '@/components/scan/HabitGrid'
import { VoiceInput } from '@/components/scan/VoiceInput'
import { AgentModeSelector } from '@/components/scan/AgentModeSelector'

export default function ScanPage() {
  const router = useRouter()

  const handleAnalyze = () => {
    router.push('/thinking')
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-[var(--bg)] overflow-hidden">

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/[0.08] shrink-0 z-10">
        <span className="font-mono-data">NEURIX · SCAN</span>
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
