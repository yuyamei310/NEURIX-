'use client'

import { useEffect, useState } from 'react'
import { ArchetypeDriftLabel } from '@/components/scan/ArchetypeDriftLabel'
import { FloatingCard } from '@/components/ui/FloatingCard'

const STATUS_MESSAGES = [
  'Analyzing biomechanical signal...',
  'Signal integrity: 92%',
]

const READINESS_MESSAGES = [
  'Neural profile stabilizing...',
  'Readiness: 72% → 84%',
]

export function ScanCore() {
  const [statusIdx, setStatusIdx] = useState(0)
  const [readinessIdx, setReadinessIdx] = useState(0)

  useEffect(() => {
    const t1 = setInterval(() => {
      setStatusIdx((i) => (i + 1) % STATUS_MESSAGES.length)
    }, 3000)
    const t2 = setInterval(() => {
      setReadinessIdx((i) => (i + 1) % READINESS_MESSAGES.length)
    }, 3000)
    return () => {
      clearInterval(t1)
      clearInterval(t2)
    }
  }, [])

  return (
    <div className="relative flex items-center justify-center w-full h-full">

      {/* Layer A — Radial glow (energy source) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.08), transparent 70%)',
        }}
      />

      {/* Layer B — Pulse ring + inner layers */}
      <div className="relative flex items-center justify-center">
        <div className="pulse-ring absolute w-64 h-64 rounded-full border border-white/20" />

        {/* Layer C — Scan line (clipped inside core circle) */}
        <div className="relative w-64 h-64 rounded-full overflow-hidden flex items-center justify-center">
          <div
            className="absolute top-0 left-0 w-full h-[2px] bg-white/10"
            style={{ animation: 'scan 2s linear infinite' }}
          />

          {/* Layer D — Breathing body */}
          <div
            className="w-48 h-48 rounded-full bg-white/[0.03] flex items-center justify-center"
            style={{ animation: 'breathe 3s ease-in-out infinite' }}
          >
            {/* SVG human silhouette */}
            <svg
              viewBox="0 0 60 120"
              className="w-16 h-32 opacity-15"
              fill="none"
              stroke="white"
              strokeWidth="1"
            >
              {/* Head */}
              <circle cx="30" cy="12" r="8" />
              {/* Neck */}
              <line x1="30" y1="20" x2="30" y2="26" />
              {/* Shoulders */}
              <line x1="10" y1="30" x2="50" y2="30" />
              {/* Arms */}
              <line x1="10" y1="30" x2="6" y2="60" />
              <line x1="50" y1="30" x2="54" y2="60" />
              {/* Torso */}
              <line x1="30" y1="26" x2="30" y2="75" />
              {/* Hips */}
              <line x1="18" y1="75" x2="42" y2="75" />
              {/* Legs */}
              <line x1="20" y1="75" x2="16" y2="110" />
              <line x1="40" y1="75" x2="44" y2="110" />
            </svg>
          </div>
        </div>
      </div>

      {/* Archetype label — above core */}
      <div className="absolute" style={{ top: 'calc(50% - 160px)' }}>
        <ArchetypeDriftLabel />
      </div>

      {/* System copy — below core */}
      <div
        className="absolute font-mono-data text-white/40"
        style={{ top: 'calc(50% + 148px)' }}
      >
        NEURIX calibrating your profile...
      </div>

      {/* FloatingCard — top left (system status) */}
      <FloatingCard className="absolute top-1/4 left-8 w-52">
        <div className="font-mono-data mb-1.5">SYSTEM STATUS</div>
        <div className="text-[13px] text-white/80 transition-all duration-500">
          {STATUS_MESSAGES[statusIdx]}
        </div>
      </FloatingCard>

      {/* FloatingCard — bottom right (readiness) */}
      <FloatingCard className="absolute bottom-1/4 right-8 w-52">
        <div className="font-mono-data mb-1.5">READINESS</div>
        <div className="text-[13px] text-white/80 transition-all duration-500">
          {READINESS_MESSAGES[readinessIdx]}
        </div>
      </FloatingCard>

    </div>
  )
}
