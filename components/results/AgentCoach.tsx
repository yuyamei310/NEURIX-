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
        <div className="font-mono-data mb-4">SPORT PATHWAYS</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.sport_recommendations.map((rec) => (
            <article
              key={rec.rank}
              className="min-h-[168px] rounded-[8px] border border-white/[0.08] bg-white/[0.025] p-4 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-[11px] text-[var(--text-3)] border border-white/[0.08] rounded-full w-7 h-7 flex items-center justify-center shrink-0">
                    {rec.rank}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[15px] font-semibold text-[var(--text)] leading-tight">{rec.sport}</span>
                      {rec.is_paralympic && <Badge label="PARA" variant="paralympic" />}
                    </div>
                    <div className="font-mono text-[10px] tracking-widest uppercase text-[var(--text-3)] mt-1">
                      Sport pathway
                    </div>
                  </div>
                </div>
                <div className="font-mono text-[18px] font-semibold text-[var(--text)] whitespace-nowrap">
                  {rec.alignment_score}%
                </div>
              </div>

              <p className="text-[12px] text-[var(--text-2)] leading-relaxed">{rec.why}</p>

              <div className="mt-auto pt-3 border-t border-white/[0.06]">
                <div className="font-mono text-[9px] tracking-widest uppercase text-[var(--text-3)] mb-1">
                  Entry point
                </div>
                <p className="text-[11px] text-[var(--text-3)] leading-relaxed">{rec.entry_point}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Training phases accordion */}
      <div>
        <div className="font-mono-data mb-4">TRAINING PROTOCOL</div>
        <div className="flex flex-col gap-3">
          {data.training_phases.map((phase, i) => (
            <div
              key={i}
              className="border border-[0.5px] border-white/[0.08] bg-white/[0.02] rounded-[8px] overflow-hidden"
            >
              <button
                onClick={() => setOpenPhase(openPhase === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
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
      {data.ethics_note && <p className="text-[11px] text-[var(--text-3)] font-mono uppercase tracking-widest">{data.ethics_note}</p>}
    </div>
  )
}
