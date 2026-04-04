'use client'

import type { AdvisorResult } from '@/types/atlas'

interface AgentAdvisorProps {
  data: AdvisorResult
}

export function AgentAdvisor({ data }: AgentAdvisorProps) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-body leading-relaxed">{data.narrative}</p>

      {/* Key factors table */}
      <div>
        <div className="font-mono-data mb-3">KEY FACTORS</div>
        <div className="flex flex-col divide-y divide-[var(--border)]">
          {data.key_factors.map((kf, i) => (
            <div key={i} className="py-3 grid grid-cols-[1fr_auto] gap-4 items-start">
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-medium text-[var(--text)]">{kf.factor}</span>
                <span className="text-[12px] text-[var(--text-3)]">{kf.significance}</span>
              </div>
              <span className="font-mono text-[12px] text-[var(--text-2)] whitespace-nowrap pt-0.5">{kf.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Historical context */}
      <div>
        <div className="font-mono-data mb-2">HISTORICAL CONTEXT</div>
        <p className="text-[13px] text-[var(--text-2)] leading-relaxed">{data.historical_context}</p>
      </div>

      {/* Olympic + Paralympic notes — same font size */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--surface-1)] border border-[0.5px] border-[var(--border)] rounded-[10px] p-3 flex flex-col gap-1.5">
          <span className="font-mono-data">OLYMPIC NOTE</span>
          <p className="text-[12px] text-[var(--text-2)] leading-relaxed">{data.olympic_note}</p>
        </div>
        <div className="bg-[var(--surface-1)] border border-[0.5px] border-[var(--border)] rounded-[10px] p-3 flex flex-col gap-1.5">
          <span className="font-mono-data">PARALYMPIC NOTE</span>
          <p className="text-[12px] text-[var(--text-2)] leading-relaxed">{data.paralympic_note}</p>
        </div>
      </div>

      <p className="text-[12px] text-[var(--text-3)] italic">{data.confidence_explanation}</p>
    </div>
  )
}
