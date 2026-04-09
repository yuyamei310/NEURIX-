'use client'

import { useAtlasStore } from '@/store/atlasStore'

const TICK_DEGREES = Array.from({ length: 24 }, (_, i) => i * 15)
const LABEL_DEGREES = [0, 90, 180, 270]

const SIZE = 260
const CX = SIZE / 2
const CY = SIZE / 2
const OUTER_R = 118
const LABEL_R = 130

export function CircularHUD() {
  const { archetype, confidence } = useAtlasStore((s) => s.localClassification)

  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
      {/* SVG: rings + ticks + labels */}
      <svg
        width={SIZE}
        height={SIZE}
        className="absolute inset-0"
        style={{ overflow: 'visible' }}
      >
        {/* Concentric rings */}
        {[118, 96, 74, 52].map((r, i) => (
          <circle
            key={r}
            cx={CX}
            cy={CY}
            r={r}
            fill="none"
            stroke="var(--glow)"
            strokeOpacity={0.18 - i * 0.03}
            strokeWidth={i === 0 ? 1 : 0.5}
          />
        ))}

        {/* Tick marks */}
        {TICK_DEGREES.map((deg) => {
          const rad = (deg * Math.PI) / 180
          const isLabel = LABEL_DEGREES.includes(deg)
          const innerR = isLabel ? 103 : 109
          const x1 = CX + OUTER_R * Math.sin(rad)
          const y1 = CY - OUTER_R * Math.cos(rad)
          const x2 = CX + innerR * Math.sin(rad)
          const y2 = CY - innerR * Math.cos(rad)
          return (
            <line
              key={deg}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="var(--glow)"
              strokeOpacity={isLabel ? 0.65 : 0.25}
              strokeWidth={isLabel ? 1.5 : 0.5}
            />
          )
        })}

        {/* Degree labels */}
        {LABEL_DEGREES.map((deg) => {
          const rad = (deg * Math.PI) / 180
          const x = CX + LABEL_R * Math.sin(rad)
          const y = CY - LABEL_R * Math.cos(rad)
          return (
            <text
              key={deg}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--glow)"
              fillOpacity="0.45"
              fontSize="7"
              fontFamily="var(--mono)"
              letterSpacing="0.05em"
            >
              {deg}°
            </text>
          )
        })}

        {/* Cross-hair lines */}
        <line x1={CX} y1={CY - OUTER_R} x2={CX} y2={CY + OUTER_R}
          stroke="var(--glow)" strokeOpacity="0.06" strokeWidth="0.5" />
        <line x1={CX - OUTER_R} y1={CY} x2={CX + OUTER_R} y2={CY}
          stroke="var(--glow)" strokeOpacity="0.06" strokeWidth="0.5" />
      </svg>

      {/* Radar sweep — conic-gradient rotating layer */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 310deg,
            rgba(var(--glow-rgb), 0.04) 330deg,
            rgba(var(--glow-rgb), 0.18) 350deg,
            rgba(var(--glow-rgb), 0.45) 358deg,
            rgba(var(--glow-rgb), 0.15) 360deg
          )`,
          clipPath: `circle(${OUTER_R}px at center)`,
          animation: 'radar-rotate 3.5s linear infinite',
        }}
      />

      {/* Sweep leading edge glow */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `circle(${OUTER_R}px at center)`,
          animation: 'radar-rotate 3.5s linear infinite',
        }}
      >
        <div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            width: 1,
            height: OUTER_R,
            transformOrigin: 'top center',
            transform: 'translateX(-50%)',
            background: `linear-gradient(to bottom, rgba(var(--glow-rgb), 0.9), transparent)`,
            filter: 'blur(1px)',
          }}
        />
      </div>

      {/* Center display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none">
        <span
          className="font-orbitron tracking-[0.2em] uppercase"
          style={{
            fontSize: 8,
            color: 'var(--glow)',
            opacity: 0.5,
          }}
        >
          ARCHETYPE
        </span>
        <span
          className="font-orbitron font-bold tracking-[0.08em] uppercase"
          style={{
            fontSize: 18,
            color: 'var(--glow)',
            textShadow: '0 0 12px rgba(var(--glow-rgb), 0.8)',
          }}
        >
          {archetype}
        </span>
        <span
          className="font-mono tracking-widest"
          style={{ fontSize: 10, color: 'var(--glow)', opacity: 0.45 }}
        >
          {Math.round(confidence * 100)}%
        </span>
      </div>
    </div>
  )
}
