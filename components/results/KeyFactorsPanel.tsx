'use client'

import type { AdvisorResult } from '@/types/atlas'

interface KeyFactorsPanelProps {
  factors: AdvisorResult['key_factors']
}

export function KeyFactorsPanel({ factors }: KeyFactorsPanelProps) {
  return (
    <div
      className="flex flex-col h-full overflow-y-auto p-6 gap-5"
      style={{ background: 'var(--bg)', fontFamily: 'var(--mono)' }}
    >
      <div
        className="text-[8px] tracking-widest uppercase"
        style={{ opacity: 0.22 }}
      >
        {'// ADVISOR SIGNALS'}
      </div>

      <div className="flex flex-col gap-4">
        {factors.map(({ factor, value, significance }, i) => (
          <div
            key={i}
            className="flex flex-col gap-1 pb-4 border-b last:border-0"
            style={{ borderColor: 'rgba(255,255,255,0.04)' }}
          >
            <div className="flex items-baseline gap-2">
              <span
                className="text-[8px]"
                style={{ color: 'rgba(255,107,53,0.4)' }}
              >
                ▶
              </span>
              <span
                className="text-[8px] tracking-widest uppercase"
                style={{ opacity: 0.32 }}
              >
                {factor}
              </span>
            </div>
            <div
              className="text-[13px] font-semibold pl-4 leading-tight"
            >
              {value}
            </div>
            <div
              className="text-[10px] leading-relaxed pl-4"
              style={{ opacity: 0.28 }}
            >
              {significance}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
