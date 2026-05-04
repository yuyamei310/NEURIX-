'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import type { CoachResult } from '@/types/atlas'
import { SvgTrimBorder, CornerBrackets } from './HudElements'

const ORANGE = '#FF8A4C'
const ORANGE_SOFT = 'rgba(255,138,76,0.055)'
const ORANGE_BORDER = 'rgba(255,138,76,0.2)'
const ORANGE_DIM = 'rgba(255,138,76,0.55)'

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-1 h-3.5 rounded-full shrink-0" style={{ background: ORANGE, boxShadow: `0 0 10px ${ORANGE}88` }} />
      <span className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: ORANGE }}>{children}</span>
    </div>
  )
}

interface AgentCoachProps {
  data: CoachResult
}

export function AgentCoach({ data }: AgentCoachProps) {
  const [openPhase, setOpenPhase] = useState<number | null>(0)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [hoveredAccordion, setHoveredAccordion] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-7">
      {/* Mode activation header */}
      <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: ORANGE_BORDER }}>
        <span className="font-mono text-[20px] leading-none shrink-0" style={{ color: ORANGE, textShadow: `0 0 18px ${ORANGE}77` }}>
          ▲
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: ORANGE }}>Coach Protocol Active</div>
          <div className="font-mono text-[8px] tracking-widest uppercase text-white/20 mt-0.5">Performance pathway · Training protocol calibration</div>
        </div>
        <div className="shrink-0 font-mono text-[7px] tracking-[0.18em] uppercase px-2 py-1 border" style={{ color: ORANGE, borderColor: ORANGE_BORDER, background: ORANGE_SOFT }}>
          PERFORMANCE
        </div>
      </div>

      {/* Narrative */}
      <p className="text-[13px] leading-relaxed text-white/55">{data.narrative}</p>

      {/* Sport pathways — SVG trim + bracket expand + score glow + bar shimmer */}
      <div>
        <SectionLabel>Sport Pathways</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.sport_recommendations.map((rec) => {
            const hovered = hoveredCard === rec.rank
            return (
              <article
                key={rec.rank}
                className="relative border flex flex-col gap-3 p-4"
                style={{ borderColor: ORANGE_BORDER, background: hovered ? 'rgba(255,138,76,0.08)' : ORANGE_SOFT, transition: 'background 0.3s ease' }}
                onMouseEnter={() => setHoveredCard(rec.rank)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <SvgTrimBorder color={ORANGE} active={hovered} />
                <CornerBrackets color={ORANGE} active={hovered} />

                {/* Header row */}
                <div className="relative flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-7 h-7 flex items-center justify-center font-mono text-[11px] border rounded-full shrink-0"
                      style={{
                        borderColor: ORANGE,
                        color: ORANGE,
                        background: `${ORANGE}18`,
                        boxShadow: hovered ? `0 0 16px ${ORANGE}66` : `0 0 10px ${ORANGE}44`,
                        transition: 'box-shadow 0.3s ease',
                      }}
                    >
                      {rec.rank}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[14px] font-semibold text-white/90 leading-tight">{rec.sport}</span>
                        {rec.is_paralympic && <Badge label="PARA" variant="paralympic" />}
                      </div>
                      <div className="font-mono text-[9px] tracking-widest uppercase text-white/25 mt-0.5">Sport pathway</div>
                    </div>
                  </div>
                  <div
                    className="font-mono text-[20px] font-bold shrink-0"
                    style={{
                      color: ORANGE,
                      textShadow: hovered ? `0 0 20px ${ORANGE}` : `0 0 10px ${ORANGE}55`,
                      transition: 'text-shadow 0.3s ease',
                    }}
                  >
                    {rec.alignment_score}%
                  </div>
                </div>

                {/* Alignment bar with shimmer sweep on hover */}
                <div className="relative h-px bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full absolute left-0 top-0"
                    style={{
                      width: `${rec.alignment_score}%`,
                      background: `linear-gradient(90deg, ${ORANGE}, ${ORANGE}77)`,
                      boxShadow: hovered ? `0 0 14px ${ORANGE}` : `0 0 8px ${ORANGE}66`,
                      transition: 'box-shadow 0.3s ease, width 1.2s cubic-bezier(0.16,1,0.3,1)',
                    }}
                  />
                  {/* Shimmer sweep */}
                  <div
                    className="absolute inset-y-0 w-[50%] pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)',
                      transform: hovered ? 'translateX(260%)' : 'translateX(-120%)',
                      transition: hovered ? 'transform 0.5s 0.08s cubic-bezier(0.16,1,0.3,1)' : 'none',
                    }}
                  />
                </div>

                <p className="relative text-[12px] text-white/40 leading-relaxed">{rec.why}</p>

                <div className="relative pt-2.5 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="font-mono text-[8px] tracking-widest uppercase mb-1" style={{ color: ORANGE_DIM }}>Entry point</div>
                  <p className="text-[11px] text-white/28 leading-relaxed">{rec.entry_point}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {/* Training protocol — left-edge glow bar slides in on row hover */}
      <div>
        <SectionLabel>Training Protocol</SectionLabel>
        <div className="flex flex-col gap-2">
          {data.training_phases.map((phase, i) => (
            <div
              key={i}
              className="relative border overflow-hidden transition-colors duration-200"
              style={{
                borderColor: openPhase === i ? ORANGE_BORDER : 'rgba(255,255,255,0.06)',
                background: openPhase === i ? ORANGE_SOFT : 'transparent',
              }}
              onMouseEnter={() => setHoveredAccordion(i)}
              onMouseLeave={() => setHoveredAccordion(null)}
            >
              {/* Left-edge glow bar */}
              <div
                className="absolute left-0 top-0 w-[2px] pointer-events-none"
                style={{
                  height: '100%',
                  background: ORANGE,
                  boxShadow: `2px 0 8px ${ORANGE}77`,
                  transformOrigin: 'top',
                  transform: hoveredAccordion === i ? 'scaleY(1)' : 'scaleY(0)',
                  transition: 'transform 0.28s cubic-bezier(0.16,1,0.3,1)',
                }}
              />

              <button
                onClick={() => setOpenPhase(openPhase === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200"
                    style={{
                      background: openPhase === i ? ORANGE : 'rgba(255,255,255,0.18)',
                      boxShadow: openPhase === i ? `0 0 8px ${ORANGE}` : 'none',
                    }}
                  />
                  <span className="text-[13px] font-medium text-white/80">{phase.phase}</span>
                  <span
                    className="font-mono text-[10px] uppercase tracking-widest transition-colors duration-200"
                    style={{ color: openPhase === i ? ORANGE_DIM : 'rgba(255,255,255,0.22)' }}
                  >
                    {phase.duration}
                  </span>
                </div>
                <span
                  className="font-mono text-[10px] tracking-widest transition-colors duration-200"
                  style={{ color: openPhase === i ? ORANGE : 'rgba(255,255,255,0.22)' }}
                >
                  {openPhase === i ? '[ – ]' : '[ + ]'}
                </span>
              </button>
              {openPhase === i && (
                <div className="px-4 pb-4 pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-[13px] text-white/42 leading-relaxed">{phase.focus}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="font-mono text-[11px] text-white/22 italic">{data.important_note}</p>
      {data.ethics_note && (
        <p className="font-mono text-[9px] tracking-widest uppercase" style={{ color: `${ORANGE}44` }}>{data.ethics_note}</p>
      )}
    </div>
  )
}
