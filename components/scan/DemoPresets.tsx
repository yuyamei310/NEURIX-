'use client'

import { useAtlasStore } from '@/store/atlasStore'
import { localClassify } from '@/core/classifier'
import type { AgentMode, Archetype, BiometricInput, Habit } from '@/types/atlas'

const ORANGE = '#FF8A4C'

type Preset = {
  key: Archetype
  label: string
  bio: BiometricInput
}

export const DEMO_PRESETS: Record<Archetype, Preset> = {
  power: {
    key: 'power',
    label: 'Power',
    bio: { height: 184, weight: 92, age: 26, habits: ['strength', 'martial_arts'], agentMode: 'coach' },
  },
  endurance: {
    key: 'endurance',
    label: 'Endurance',
    bio: { height: 171, weight: 61, age: 24, habits: ['running', 'swimming'], agentMode: 'coach' },
  },
  technical: {
    key: 'technical',
    label: 'Technical',
    bio: { height: 168, weight: 59, age: 22, habits: ['gymnastics', 'racket'], agentMode: 'mentor' },
  },
  hybrid: {
    key: 'hybrid',
    label: 'Hybrid',
    bio: { height: 178, weight: 74, age: 25, habits: ['team_sports', 'running'], agentMode: 'advisor' },
  },
}

export function applyDemoPreset(
  presetKey: Archetype,
  setBiometrics: (b: Partial<BiometricInput>) => void,
  setLocalClassification: (c: { archetype: Archetype; confidence: number }) => void,
  agentMode?: AgentMode,
) {
  const preset = DEMO_PRESETS[presetKey]
  const next = { ...preset.bio, ...(agentMode ? { agentMode } : {}) }
  setBiometrics(next)
  setLocalClassification(localClassify(next.height, next.weight, next.age, next.habits as Habit[]))
}

export function DemoPresets() {
  const biometrics = useAtlasStore((s) => s.biometrics)
  const setBiometrics = useAtlasStore((s) => s.setBiometrics)
  const setLocalClassification = useAtlasStore((s) => s.setLocalClassification)

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-px bg-white/[0.045] sm:grid-cols-4">
        {Object.values(DEMO_PRESETS).map((preset) => {
          const active =
            biometrics.height === preset.bio.height &&
            biometrics.weight === preset.bio.weight &&
            biometrics.age === preset.bio.age

          return (
            <button
              key={preset.key}
              onClick={() => applyDemoPreset(preset.key, setBiometrics, setLocalClassification)}
              className="p-4 text-left transition-colors"
              style={{
                background: active ? `${ORANGE}12` : 'var(--bg)',
                borderTop: active ? `1px solid ${ORANGE}` : '1px solid transparent',
              }}
            >
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: active ? ORANGE : 'rgba(255,255,255,0.56)' }}>
                {preset.label}
              </div>
              <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] leading-relaxed text-white/28">
                {preset.bio.height}cm / {preset.bio.weight}kg / {preset.bio.agentMode}
              </div>
            </button>
          )
        })}
      </div>
      <p className="font-mono text-[9px] uppercase tracking-[0.12em] leading-relaxed text-white/24">
        Presets are for repeatable demos and video capture. Manual controls remain editable after selection.
      </p>
    </div>
  )
}
