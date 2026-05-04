'use client'

import { useState } from 'react'
import type { MentorResult } from '@/types/atlas'
import { SvgTrimBorder, CornerBrackets } from './HudElements'

const PURPLE = '#b400ff'
const PURPLE_SOFT = 'rgba(180,0,255,0.055)'
const PURPLE_BORDER = 'rgba(180,0,255,0.2)'
const PURPLE_DIM = 'rgba(180,0,255,0.55)'

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="w-1 h-3.5 rounded-full shrink-0" style={{ background: PURPLE, boxShadow: `0 0 10px ${PURPLE}88` }} />
      <span className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: PURPLE }}>{children}</span>
    </div>
  )
}

interface AgentMentorProps {
  data: MentorResult
}

export function AgentMentor({ data }: AgentMentorProps) {
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null)
  const [la28Hovered, setLa28Hovered] = useState(false)
  const [soulHovered, setSoulHovered] = useState(false)

  return (
    <div className="flex flex-col gap-7">
      {/* Mode activation header */}
      <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: PURPLE_BORDER }}>
        <span className="font-mono text-[20px] leading-none shrink-0" style={{ color: PURPLE, textShadow: `0 0 18px ${PURPLE}77` }}>
          ◎
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: PURPLE }}>Mentor Arc Active</div>
          <div className="font-mono text-[8px] tracking-widest uppercase text-white/20 mt-0.5">LA28 story arc · Aspirational journey mapping</div>
        </div>
        <div className="shrink-0 font-mono text-[7px] tracking-[0.18em] uppercase px-2 py-1 border" style={{ color: PURPLE, borderColor: PURPLE_BORDER, background: PURPLE_SOFT }}>
          NARRATIVE
        </div>
      </div>

      {/* Narrative */}
      <p className="text-[13px] leading-relaxed text-white/55">{data.narrative}</p>

      {/* Timeline — node glow + milestone tint intensify on phase hover */}
      <div>
        <SectionLabel>LA28 Possibility Arc</SectionLabel>
        <div className="flex flex-col gap-0 relative">
          <div
            className="absolute left-[7px] top-2 bottom-2 w-px pointer-events-none"
            style={{ background: `linear-gradient(to bottom, ${PURPLE}55, ${PURPLE}22 80%, transparent)` }}
          />
          {data.timeline.map((phase, i) => (
            <div
              key={i}
              className="flex gap-4 pb-8 last:pb-0 relative cursor-default"
              onMouseEnter={() => setHoveredPhase(i)}
              onMouseLeave={() => setHoveredPhase(null)}
            >
              {/* Glowing milestone node */}
              <div className="relative flex-shrink-0 mt-0.5">
                <div
                  className="w-[15px] h-[15px] rounded-full flex items-center justify-center relative z-10"
                  style={{
                    border: `1.5px solid ${PURPLE}`,
                    background: hoveredPhase === i ? `${PURPLE}44` : `${PURPLE}22`,
                    boxShadow: hoveredPhase === i ? `0 0 22px ${PURPLE}` : `0 0 12px ${PURPLE}66`,
                    transition: 'background 0.3s ease, box-shadow 0.3s ease',
                  }}
                >
                  <div
                    className="w-[5px] h-[5px] rounded-full"
                    style={{
                      background: PURPLE,
                      boxShadow: hoveredPhase === i ? `0 0 12px ${PURPLE}` : `0 0 6px ${PURPLE}`,
                      transition: 'box-shadow 0.3s ease',
                    }}
                  />
                </div>
                {/* Pulse ring — speeds up on hover */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    border: `1px solid ${PURPLE}44`,
                    animation: hoveredPhase === i
                      ? `pulse-ring 1.1s ${i * 0.3}s cubic-bezier(0.215,0.61,0.355,1) infinite`
                      : `pulse-ring 2.4s ${i * 0.55}s cubic-bezier(0.215,0.61,0.355,1) infinite`,
                  }}
                />
              </div>

              <div className="flex flex-col gap-1.5 min-w-0 pb-1">
                <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: PURPLE_DIM }}>{phase.phase}</span>
                <span
                  className="text-[14px] font-semibold"
                  style={{
                    color: hoveredPhase === i ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.88)',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {phase.title}
                </span>
                <p className="text-[13px] text-white/40 leading-relaxed">{phase.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-4 h-px shrink-0" style={{ background: PURPLE_BORDER }} />
                  <span
                    className="font-mono text-[11px] italic"
                    style={{
                      color: hoveredPhase === i ? PURPLE : PURPLE_DIM,
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {phase.milestone}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LA28 connection — SVG trim + bracket expand + ambient glow on hover */}
      <div
        className="relative p-5 border cursor-default"
        style={{
          background: la28Hovered ? 'rgba(180,0,255,0.09)' : PURPLE_SOFT,
          borderColor: PURPLE_BORDER,
          transition: 'background 0.3s ease',
        }}
        onMouseEnter={() => setLa28Hovered(true)}
        onMouseLeave={() => setLa28Hovered(false)}
      >
        <SvgTrimBorder color={PURPLE} active={la28Hovered} />
        <CornerBrackets color={PURPLE} active={la28Hovered} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: la28Hovered
              ? `radial-gradient(ellipse at 0% 50%, ${PURPLE}1c, transparent 60%)`
              : `radial-gradient(ellipse at 0% 50%, ${PURPLE}0d, transparent 60%)`,
            transition: 'background 0.4s ease',
          }}
        />
        <div className="relative">
          <div className="font-mono text-[8px] tracking-[0.2em] uppercase mb-3" style={{ color: PURPLE_DIM }}>LA28 Connection</div>
          <p className="text-[13px] text-white/48 leading-relaxed">{data.la28_connection}</p>
        </div>
      </div>

      {/* Soul message — quote marks glow + ambient expands on hover */}
      <div
        className="relative py-7 text-center overflow-hidden cursor-default"
        onMouseEnter={() => setSoulHovered(true)}
        onMouseLeave={() => setSoulHovered(false)}
      >
        {/* Ambient radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: soulHovered
              ? `radial-gradient(ellipse at 50% 50%, ${PURPLE}22, transparent 70%)`
              : `radial-gradient(ellipse at 50% 50%, ${PURPLE}12, transparent 65%)`,
            transition: 'background 0.5s ease',
          }}
        />
        <div
          className="font-mono text-[52px] select-none"
          style={{
            color: soulHovered ? `${PURPLE}88` : `${PURPLE}44`,
            lineHeight: '1',
            textShadow: soulHovered ? `0 0 24px ${PURPLE}99` : 'none',
            transition: 'color 0.4s ease, text-shadow 0.4s ease',
          }}
        >
          &ldquo;
        </div>
        <p className="relative text-[16px] font-medium leading-relaxed max-w-[500px] mx-auto text-white/82">
          {data.soul_message}
        </p>
        <div
          className="font-mono text-[52px] select-none"
          style={{
            color: soulHovered ? `${PURPLE}88` : `${PURPLE}44`,
            lineHeight: '1',
            textShadow: soulHovered ? `0 0 24px ${PURPLE}99` : 'none',
            transition: 'color 0.4s ease, text-shadow 0.4s ease',
          }}
        >
          &rdquo;
        </div>
        {/* Bottom glow line — expands on hover */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px"
          style={{
            width: soulHovered ? 140 : 96,
            background: `linear-gradient(90deg, transparent, ${PURPLE}88, transparent)`,
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      {data.ethics_note && (
        <p className="font-mono text-[9px] tracking-widest uppercase text-center" style={{ color: `${PURPLE}44` }}>
          {data.ethics_note}
        </p>
      )}
    </div>
  )
}
