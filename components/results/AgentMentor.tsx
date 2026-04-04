'use client'

import type { MentorResult } from '@/types/atlas'

interface AgentMentorProps {
  data: MentorResult
}

export function AgentMentor({ data }: AgentMentorProps) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-body leading-relaxed">{data.narrative}</p>

      {/* 4-phase timeline */}
      <div>
        <div className="font-mono-data mb-4">4-YEAR PATH TO LA28</div>
        <div className="flex flex-col gap-0 relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--border-2)]" />
          {data.timeline.map((phase, i) => (
            <div key={i} className="flex gap-4 pb-6 last:pb-0 relative">
              <div className="w-4 h-4 rounded-full border-2 border-[var(--text)] bg-white flex-shrink-0 mt-0.5 relative z-10" />
              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[11px] text-[var(--text-3)]">{phase.phase}</span>
                </div>
                <span className="text-[14px] font-semibold text-[var(--text)]">{phase.title}</span>
                <p className="text-[13px] text-[var(--text-2)] leading-relaxed">{phase.description}</p>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-px bg-[var(--border-2)]" />
                  <span className="text-[12px] text-[var(--text-3)] italic">{phase.milestone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LA28 connection */}
      <div className="bg-[var(--surface-1)] border border-[0.5px] border-[var(--border)] rounded-[10px] p-4">
        <div className="font-mono-data mb-2">LA28 CONNECTION</div>
        <p className="text-[13px] text-[var(--text-2)] leading-relaxed">{data.la28_connection}</p>
      </div>

      {/* Soul message — larger, centered */}
      <div className="text-center py-4">
        <p className="text-[16px] font-medium text-[var(--text)] leading-relaxed max-w-[480px] mx-auto">
          &ldquo;{data.soul_message}&rdquo;
        </p>
      </div>
    </div>
  )
}
