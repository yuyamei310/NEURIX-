'use client'

import { useEffect, useRef, useState } from 'react'
import type { Archetype } from '@/types/atlas'

const ARCHETYPE_COLORS: Record<Archetype, string> = {
  power: '#ff6b35',
  endurance: '#4ade80',
  technical: '#a855f7',
  hybrid: '#22d3ee',
}

interface AthleteBodyProps {
  archetype: Archetype
  onCanvasReady?: (dataUrl: string) => void
  onHoverChange?: (hovered: boolean) => void
}

export function AthleteBody({ archetype, onHoverChange }: AthleteBodyProps) {
  const [useFallback, setUseFallback] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const color = ARCHETYPE_COLORS[archetype] ?? '#22d3ee'

  useEffect(() => {
    // If the Spline iframe hasn't signalled load within 8s, show local SVG
    timeoutRef.current = setTimeout(() => setUseFallback(true), 8000)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [])

  const handleLoad = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  return (
    <div
      className="relative w-full h-full"
      style={{ minHeight: '400px' }}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      {useFallback ? (
        <BodySVGFallback color={color} archetype={archetype} />
      ) : (
        <iframe
          src="https://my.spline.design/bodywithglowringscopy-fNne1gztopzGRDWvTxFpbkaO/"
          title="NEURIX result body visualization"
          onLoad={handleLoad}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        />
      )}
    </div>
  )
}

function BodySVGFallback({ color, archetype }: { color: string; archetype: Archetype }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 55% 65% at 50% 44%, ${color}12 0%, transparent 70%)`,
        }}
      />

      <svg
        viewBox="0 0 160 360"
        className="relative z-10 w-auto"
        style={{ height: '78%', maxHeight: '320px', filter: `drop-shadow(0 0 14px ${color}44)` }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <circle cx="80" cy="28" r="20" stroke={color} strokeWidth="1.2" opacity="0.85" />
        <circle cx="80" cy="28" r="4" fill={color} opacity="0.35" />

        {/* Neck */}
        <rect x="72" y="48" width="16" height="13" stroke={color} strokeWidth="1.1" opacity="0.6" />

        {/* Clavicle */}
        <path d="M26 68 Q80 57 134 68" stroke={color} strokeWidth="1.4" opacity="0.8" />

        {/* Torso */}
        <path
          d="M36 68 L32 148 Q80 156 128 148 L124 68 Z"
          stroke={color} strokeWidth="1.2" opacity="0.75"
          fill={color} fillOpacity="0.04"
        />
        {/* Sternum center line */}
        <line x1="80" y1="68" x2="80" y2="148" stroke={color} strokeWidth="0.5" opacity="0.2" strokeDasharray="4 3" />

        {/* Left arm */}
        <path d="M36 70 L16 112 L10 160" stroke={color} strokeWidth="1.2" opacity="0.72" strokeLinecap="round" />
        {/* Right arm */}
        <path d="M124 70 L144 112 L150 160" stroke={color} strokeWidth="1.2" opacity="0.72" strokeLinecap="round" />

        {/* Hip line */}
        <path d="M32 148 Q80 158 128 148" stroke={color} strokeWidth="1.2" opacity="0.6" />

        {/* Left leg */}
        <path d="M50 152 L44 236 L42 330" stroke={color} strokeWidth="1.4" opacity="0.75" strokeLinecap="round" />
        {/* Right leg */}
        <path d="M110 152 L116 236 L118 330" stroke={color} strokeWidth="1.4" opacity="0.75" strokeLinecap="round" />

        {/* Joint nodes */}
        {([ [80,8],[80,48],[36,70],[124,70],[10,160],[150,160],[50,152],[110,152] ] as [number,number][]).map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r="2.8" fill={color} opacity="0.32" />
        ))}
      </svg>

      <div
        className="relative z-10 mt-3 font-mono text-[9px] tracking-[0.25em] uppercase text-center opacity-30"
        style={{ color }}
      >
        {archetype} · synthetic model
      </div>
    </div>
  )
}
