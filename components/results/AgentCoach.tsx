'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import type { CoachResult } from '@/types/atlas'

interface AgentCoachProps {
  data: CoachResult
}

export function AgentCoach({ data }: AgentCoachProps) {
  const [openPhase, setOpenPhase] = useState<number | null>(0)

  return (
    <div className="flex flex-col gap-6">
      <p className="text-body leading-relaxed">{data.narrative}</p>

      {/* Sport recommendations */}
      <div>
        <div className="font-mono-data mb-3">SPORT RECOMMENDATIONS</div>
        <div className="flex flex-col gap-3">
          {data.sport_recommendations.map((rec) => (
            <div key={rec.rank} className="flex gap-4 py-3 border-b border-[0.5px] border-[var(--border)] last:border-0">
              <span className="font-mono text-[20px] font-semibold text-[var(--border-2)] w-6 flex-shrink-0 pt-0.5">
                {rec.rank}
              </span>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium text-[var(--text)]">{rec.sport}</span>
                  {rec.is_paralympic && <Badge label="PARA" variant="paralympic" />}
                  <span className="font-mono text-[11px] text-[var(--text-3)]">{rec.alignment_score}%</span>
                </div>
                <p className="text-[12px] text-[var(--text-2)] leading-relaxed">{rec.why}</p>
                <p className="text-[11px] text-[var(--text-3)]">{rec.entry_point}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Training phases accordion */}
      <div>
        <div className="font-mono-data mb-3">TRAINING PHASES</div>
        <div className="flex flex-col gap-2">
          {data.training_phases.map((phase, i) => (
            <div
              key={i}
              className="border border-[0.5px] border-[var(--border)] rounded-[10px] overflow-hidden"
            >
              <button
                onClick={() => setOpenPhase(openPhase === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-medium text-[var(--text)]">{phase.phase}</span>
                  <span className="font-mono text-[11px] text-[var(--text-3)]">{phase.duration}</span>
                </div>
                <span className="text-[var(--text-3)] text-[12px]">{openPhase === i ? '↑' : '↓'}</span>
              </button>
              {openPhase === i && (
                <div className="px-4 pb-4 pt-1">
                  <p className="text-[13px] text-[var(--text-2)] leading-relaxed">{phase.focus}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-[12px] text-[var(--text-3)] italic">{data.important_note}</p>
    </div>
  )
}
