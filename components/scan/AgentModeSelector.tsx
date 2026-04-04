'use client'

import { useAtlasStore } from '@/store/atlasStore'
import type { AgentMode } from '@/types/atlas'

const MODES: { key: AgentMode; label: string; desc: string }[] = [
  { key: 'advisor', label: 'Advisor', desc: 'Analytical · Why this archetype' },
  { key: 'coach', label: 'Coach', desc: 'Practical · What sport to pursue' },
  { key: 'mentor', label: 'Mentor', desc: 'Story-driven · 4-year path to LA28' },
]

export function AgentModeSelector() {
  const agentMode = useAtlasStore((s) => s.biometrics.agentMode)
  const setBiometrics = useAtlasStore((s) => s.setBiometrics)

  return (
    <div>
      <div className="font-mono-data mb-3">AGENT MODE</div>
      <div className="grid grid-cols-3 gap-2">
        {MODES.map(({ key, label, desc }) => {
          const active = agentMode === key
          return (
            <button
              key={key}
              onClick={() => setBiometrics({ agentMode: key })}
              className={`flex flex-col gap-1 p-3 rounded-[10px] border border-[0.5px] text-left transition-colors cursor-pointer ${
                active
                  ? 'bg-[var(--text)] text-white border-[var(--text)]'
                  : 'bg-[var(--surface-1)] border-[var(--border-2)] hover:bg-[var(--surface-2)]'
              }`}
            >
              <span className={`text-[14px] font-semibold ${active ? 'text-white' : 'text-[var(--text)]'}`}>
                {label}
              </span>
              <span className={`text-[11px] leading-tight ${active ? 'text-white/70' : 'text-[var(--text-3)]'}`}>
                {desc}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
