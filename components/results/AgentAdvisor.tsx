'use client'

import { useState } from 'react'
import type { AdvisorResult } from '@/types/atlas'
import { SvgTrimBorder, CornerBrackets } from './HudElements'

const PEACH = '#FFBB99'
const PEACH_SOFT = 'rgba(255,187,153,0.055)'
const PEACH_BORDER = 'rgba(255,187,153,0.18)'
const PEACH_DIM = 'rgba(255,187,153,0.55)'

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-1 h-3.5 rounded-full shrink-0" style={{ background: PEACH, boxShadow: `0 0 10px ${PEACH}88` }} />
      <span className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: PEACH }}>{children}</span>
    </div>
  )
}

interface AgentAdvisorProps {
  data: AdvisorResult
}

export function AgentAdvisor({ data }: AgentAdvisorProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [hoveredBox, setHoveredBox] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-7">
      {/* Mode activation header */}
      <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: PEACH_BORDER }}>
        <span className="font-mono text-[20px] leading-none shrink-0" style={{ color: PEACH, textShadow: `0 0 18px ${PEACH}77` }}>
          ◈
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: PEACH }}>Advisory Protocol Active</div>
          <div className="font-mono text-[8px] tracking-widest uppercase text-white/20 mt-0.5">Blueprint reasoning · Synthetic archive cross-reference</div>
        </div>
        <div className="shrink-0 font-mono text-[7px] tracking-[0.18em] uppercase px-2 py-1 border" style={{ color: PEACH, borderColor: PEACH_BORDER, background: PEACH_SOFT }}>
          ANALYTICAL
        </div>
      </div>

      {/* Narrative */}
      <p className="text-[13px] leading-relaxed text-white/55">{data.narrative}</p>

      {/* Key factors — scan sweep on row hover */}
      <div>
        <SectionLabel>Key Factors</SectionLabel>
        <div className="flex flex-col">
          {data.key_factors.map((kf, i) => (
            <div
              key={i}
              className="relative overflow-hidden py-3.5 grid grid-cols-[1fr_auto] gap-4 items-center cursor-default"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.045)' }}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {/* Scan sweep */}
              <div
                className="absolute inset-y-0 w-[55%] pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${PEACH}1e, transparent)`,
                  transform: hoveredRow === i ? 'translateX(280%)' : 'translateX(-120%)',
                  transition: hoveredRow === i ? 'transform 0.55s cubic-bezier(0.16,1,0.3,1)' : 'none',
                }}
              />
              <div className="relative flex flex-col gap-0.5 min-w-0">
                <span className="text-[13px] font-medium text-white/80">{kf.factor}</span>
                <span className="font-mono text-[10px] text-white/25">{kf.significance}</span>
              </div>
              <span
                className="relative font-mono text-[13px] font-bold whitespace-nowrap"
                style={{
                  color: PEACH,
                  textShadow: hoveredRow === i ? `0 0 14px ${PEACH}` : `0 0 8px ${PEACH}55`,
                  transition: 'text-shadow 0.3s ease',
                }}
              >
                {kf.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Synthetic archive context */}
      <div>
        <SectionLabel>Synthetic Archive Context</SectionLabel>
        <p className="text-[13px] text-white/40 leading-relaxed">{data.historical_context}</p>
      </div>

      {/* Olympic + Paralympic notes — SVG trim + bracket expand on hover */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { label: 'Olympic-Inspired Note', text: data.olympic_note },
          { label: 'Paralympic-Inspired Note', text: data.paralympic_note },
        ].map(({ label, text }) => (
          <div
            key={label}
            className="relative p-4 border flex flex-col gap-2 cursor-default"
            style={{ background: PEACH_SOFT, borderColor: PEACH_BORDER }}
            onMouseEnter={() => setHoveredBox(label)}
            onMouseLeave={() => setHoveredBox(null)}
          >
            <SvgTrimBorder color={PEACH} active={hoveredBox === label} />
            <CornerBrackets color={PEACH} active={hoveredBox === label} />
            <span className="relative font-mono text-[8px] tracking-[0.18em] uppercase" style={{ color: PEACH_DIM }}>{label}</span>
            <p className="relative text-[12px] text-white/42 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <p className="font-mono text-[11px] text-white/22 italic">{data.confidence_explanation}</p>
      {data.ethics_note && (
        <p className="font-mono text-[9px] tracking-widest uppercase" style={{ color: `${PEACH}33` }}>{data.ethics_note}</p>
      )}
    </div>
  )
}
