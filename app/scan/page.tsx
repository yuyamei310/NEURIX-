'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { CSSProperties } from 'react'
import { ScanCore } from '@/components/scan/ScanCore'
import { BottomDrawer, DrawerSection } from '@/components/scan/BottomDrawer'
import { BiometricSliders } from '@/components/scan/BiometricSliders'
import { HabitGrid } from '@/components/scan/HabitGrid'
import { VoiceInput } from '@/components/scan/VoiceInput'
import { AgentModeSelector } from '@/components/scan/AgentModeSelector'
import { DemoPresets, applyDemoPreset, DEMO_PRESETS } from '@/components/scan/DemoPresets'
import { useNeurixStore } from '@/store/neurixStore'
import type { AgentMode, Archetype } from '@/types/neurix'

const ORANGE = '#FF8A4C'

export default function ScanPage() {
  const router = useRouter()
  const setBiometrics = useNeurixStore((s) => s.setBiometrics)
  const setLocalClassification = useNeurixStore((s) => s.setLocalClassification)
  const appliedDemoRef = useRef(false)

  useEffect(() => {
    if (appliedDemoRef.current || typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const demo = params.get('demo') as Archetype | null
    const lens = params.get('lens') as AgentMode | null
    if (demo && demo in DEMO_PRESETS) {
      appliedDemoRef.current = true
      applyDemoPreset(
        demo,
        setBiometrics,
        setLocalClassification,
        lens === 'advisor' || lens === 'coach' || lens === 'mentor' ? lens : undefined
      )
    }
  }, [setBiometrics, setLocalClassification])

  const handleAnalyze = () => {
    router.push('/thinking')
  }

  return (
    <div
      className="relative flex flex-col min-h-screen bg-[var(--bg)] overflow-hidden"
      style={{
        '--active-archetype-color': ORANGE,
        '--active-archetype-soft': `${ORANGE}22`,
      } as CSSProperties}
    >

      {/* Header */}
      <header className="flex items-center justify-between gap-3 px-5 sm:px-8 py-4 sm:py-5 border-b border-white/[0.08] shrink-0 z-10">
        <span className="font-mono-data">NEURIX · SCAN</span>
        <span
          className="font-mono text-[8px] sm:text-[9px] tracking-[0.14em] sm:tracking-[0.22em] uppercase text-right"
          style={{ color: ORANGE }}
        >
          Ethics safe · synthetic archive
        </span>
      </header>

      {/* Center stage — ScanCore fills remaining space above drawer */}
      <main className="flex-1 flex items-center justify-center min-h-0" style={{ paddingBottom: '72px' }}>
        <div className="w-full h-full">
          <ScanCore />
        </div>
      </main>

      {/* Bottom drawer with all inputs */}
      <BottomDrawer onAnalyze={handleAnalyze}>
        <DrawerSection title="DEMO PRESETS">
          <DemoPresets />
        </DrawerSection>
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
