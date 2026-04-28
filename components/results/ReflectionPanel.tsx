'use client'

import { useState } from 'react'
import { eraData, eraKeys, type EraKey } from '@/core/eraData'
import type { SoulTwin } from '@/types/atlas'

interface ReflectionPanelProps {
  reflection: string
  twins: SoulTwin[]
}

export function ReflectionPanel({ reflection }: ReflectionPanelProps) {
  const [hoveredEra, setHoveredEra] = useState<EraKey | null>(null)

  return (
    <div
      className="flex flex-col h-full"
      style={{ fontFamily: 'var(--mono)' }}
    >
      <div
        className="px-8 pt-8 pb-3 text-[8px] tracking-widest uppercase"
        style={{ opacity: 0.22 }}
      >
        {'// SYNTHETIC ERA ECHOES'}
      </div>

      {/* Log entries */}
      <div className="flex-1 overflow-y-auto">
        {eraKeys.map((key, i) => {
          const era = eraData[key]
          const isHovered = hoveredEra === key

          return (
            <div
              key={key}
              className="border-b cursor-default transition-colors"
              style={{
                borderColor: 'rgba(255,255,255,0.04)',
                background: isHovered ? 'rgba(0,229,255,0.028)' : 'transparent',
              }}
              onMouseEnter={() => setHoveredEra(key)}
              onMouseLeave={() => setHoveredEra(null)}
            >
              {/* Log row */}
              <div className="flex items-center gap-4 px-8 py-4">
                <span
                  className="text-[8px] tracking-widest shrink-0 transition-colors"
                  style={{ color: isHovered ? 'rgba(0,229,255,0.6)' : 'rgba(255,255,255,0.18)' }}
                >
                  [{String(i + 1).padStart(2, '0')}]
                </span>
                <span
                  className="text-[10px] tracking-widest uppercase font-semibold transition-opacity shrink-0"
                  style={{ opacity: isHovered ? 1 : 0.38 }}
                >
                  {key}
                </span>
                <span
                  className="text-[9px] transition-opacity"
                  style={{ opacity: isHovered ? 0.5 : 0.18 }}
                >
                  {era.label.split(' · ').slice(1).join(' · ')}
                </span>
                <span
                  className="ml-auto text-[8px] tracking-widest uppercase shrink-0 transition-opacity"
                  style={{ opacity: isHovered ? 0.35 : 0.12 }}
                >
                  EXPAND ▾
                </span>
              </div>

              {/* Expandable detail */}
              <div
                className="overflow-hidden transition-all duration-200"
                style={{ maxHeight: isHovered ? 140 : 0 }}
              >
                <div
                  className="mx-8 mb-4 pl-5 border-l"
                  style={{ borderColor: 'rgba(0,229,255,0.18)' }}
                >
                  <p
                    className="text-[10px] leading-relaxed mb-2"
                    style={{ opacity: 0.42 }}
                  >
                    {era.context}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {era.archetypes.map((a) => (
                      <span
                        key={a}
                        className="text-[8px] tracking-widest uppercase border px-2 py-0.5"
                        style={{
                          borderColor: 'rgba(255,255,255,0.1)',
                          opacity: 0.45,
                        }}
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Reflection quote as final log entry */}
        <div className="px-8 py-6">
          <div
            className="text-[8px] tracking-widest uppercase mb-3"
            style={{ opacity: 0.18 }}
          >
            [REFLECTION]
          </div>
          <p
            className="text-[10px] leading-relaxed italic"
            style={{ opacity: 0.32 }}
          >
            &ldquo;{reflection}&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}
