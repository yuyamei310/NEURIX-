'use client'

import { useState } from 'react'
import { eraData, eraKeys, type EraKey } from '@/lib/eraData'
import type { SoulTwin } from '@/types/atlas'

interface ReflectionPanelProps {
  reflection: string
  twins: SoulTwin[]
}

export function ReflectionPanel({ reflection, twins }: ReflectionPanelProps) {
  // Default open: era matching oldest soul twin
  const defaultEra = (() => {
    if (!twins.length) return '1968' as EraKey
    // Find earliest era from soul twins
    const years = twins.map((t) => {
      const match = t.era.match(/\d{4}/)
      return match ? parseInt(match[0]) : 9999
    })
    const minYear = Math.min(...years)
    if (minYear <= 1940) return '1932'
    if (minYear <= 1975) return '1968'
    if (minYear <= 2005) return '1996'
    return 'LA28'
  })() as EraKey

  const [activeEra, setActiveEra] = useState<EraKey | null>(defaultEra)

  const toggleEra = (key: EraKey) => {
    setActiveEra((prev) => (prev === key ? null : key))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="font-mono-data">— REFLECTION</div>

      {/* Era timeline */}
      <div className="flex items-center gap-0 select-none">
        {eraKeys.map((key, i) => (
          <div key={key} className="flex items-center">
            <button
              onClick={() => toggleEra(key)}
              className={`font-mono text-[12px] px-2 py-1 rounded-[6px] border border-[0.5px] transition-colors cursor-pointer ${
                activeEra === key
                  ? 'bg-[var(--text)] text-white border-[var(--text)]'
                  : 'text-[var(--text-2)] border-[var(--border-2)] hover:bg-[var(--surface-2)]'
              }`}
            >
              [{key}]
            </button>
            {i < eraKeys.length - 1 && (
              <div className="w-8 h-px bg-[var(--border-2)]" />
            )}
          </div>
        ))}
      </div>

      {/* Inline era card — click-to-expand, 200ms fade */}
      <div
        className="overflow-hidden transition-all duration-200"
        style={{
          maxHeight: activeEra ? '200px' : '0',
          opacity: activeEra ? 1 : 0,
        }}
      >
        {activeEra && (
          <div className="bg-[var(--surface-1)] border border-[0.5px] border-[var(--border)] rounded-[10px] p-4 flex flex-col gap-2">
            <div className="font-mono text-[12px] font-semibold text-[var(--text)]">
              {eraData[activeEra].label}
            </div>
            <p className="text-[13px] text-[var(--text-2)] leading-relaxed">
              {eraData[activeEra].context}
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {eraData[activeEra].archetypes.map((a) => (
                <span
                  key={a}
                  className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-3)] border border-[0.5px] border-[var(--border)] rounded-[4px] px-1.5 py-0.5"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reflection narrative */}
      <blockquote className="border-l-2 border-[var(--border-2)] pl-5">
        <p className="text-body italic leading-loose text-[var(--text-2)]">
          &ldquo;{reflection}&rdquo;
        </p>
      </blockquote>
    </div>
  )
}
