'use client'

import { useAtlasStore } from '@/store/atlasStore'
import type { AgentMode } from '@/types/atlas'

const MODES: { key: AgentMode; label: string; desc: string }[] = [
  { key: 'advisor', label: 'ADVISOR', desc: 'Analytical · Why this archetype' },
  { key: 'coach',   label: 'COACH',   desc: 'Practical · What sport to pursue' },
  { key: 'mentor',  label: 'MENTOR',  desc: 'Story-driven · 4-year path to LA28' },
]

export function AgentModeSelector() {
  const agentMode = useAtlasStore((s) => s.biometrics.agentMode)
  const setBiometrics = useAtlasStore((s) => s.setBiometrics)

  return (
    <div>
      <div
        className="mb-3 font-mono tracking-[0.14em] uppercase"
        style={{ fontSize: 10, color: 'var(--text-3)' }}
      >
        AGENT MODE
      </div>
      <div className="grid grid-cols-3 gap-2">
        {MODES.map(({ key, label, desc }) => {
          const active = agentMode === key
          return (
            <button
              key={key}
              onClick={() => setBiometrics({ agentMode: key })}
              className="flex flex-col gap-1.5 p-3 rounded-[10px] text-left transition-all duration-200 cursor-pointer"
              style={{
                border: '1px solid',
                borderColor: active
                  ? 'rgba(var(--glow-rgb), 0.65)'
                  : 'var(--border-2)',
                background: active
                  ? 'rgba(var(--glow-rgb), 0.07)'
                  : 'var(--surface-1)',
                boxShadow: active
                  ? '0 0 10px rgba(var(--glow-rgb), 0.12)'
                  : 'none',
              }}
            >
              <span
                className="font-orbitron font-semibold tracking-[0.1em]"
                style={{
                  fontSize: 11,
                  color: active ? 'var(--glow)' : 'var(--text)',
                  textShadow: active ? '0 0 8px rgba(var(--glow-rgb), 0.6)' : 'none',
                }}
              >
                {label}
              </span>
              <span
                className="leading-tight"
                style={{
                  fontSize: 10,
                  color: active ? 'rgba(var(--glow-rgb), 0.55)' : 'var(--text-3)',
                }}
              >
                {desc}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
