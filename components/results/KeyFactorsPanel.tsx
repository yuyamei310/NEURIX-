'use client'

import type { AdvisorResult } from '@/types/atlas'

interface KeyFactorsPanelProps {
  factors: AdvisorResult['key_factors']
}

export function KeyFactorsPanel({ factors }: KeyFactorsPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <span className="font-mono-data">KEY FACTORS</span>
      <div className="flex flex-col gap-6">
        {factors.map(({ factor, value, significance }, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="font-mono-data">{factor}</span>
            <span className="text-[15px] font-semibold tracking-tight text-[var(--text)]">
              {value}
            </span>
            <span className="text-[12px] text-[var(--text-3)] leading-relaxed">{significance}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
