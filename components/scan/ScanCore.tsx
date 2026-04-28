'use client'

import { useEffect, useState } from 'react'
import { ArchetypeDriftLabel } from '@/components/scan/ArchetypeDriftLabel'
import { CircularHUD } from '@/components/scan/CircularHUD'
import { HUDPanel } from '@/components/ui/FloatingCard'
import { HolographicBody } from '@/components/scan/HolographicBody'
import { ScanHUD } from '@/components/scan/ScanHUD'
import { BodyNodes } from '@/components/scan/BodyNodes'
import { useAtlasStore } from '@/store/atlasStore'
import { getSyntheticArchiveProfile } from '@/core/syntheticArchive'

const STATUS_MESSAGES = [
  'Analyzing biomechanical signal...',
  'Signal integrity: 92%',
]

const READINESS_MESSAGES = [
  'Neural profile stabilizing...',
  'Readiness: 72% → 84%',
]

export function ScanCore() {
  const [statusIdx, setStatusIdx]       = useState(0)
  const [readinessIdx, setReadinessIdx] = useState(0)
  const { archetype } = useAtlasStore((s) => s.localClassification)
  const profile = getSyntheticArchiveProfile(archetype)

  useEffect(() => {
    const t1 = setInterval(() => setStatusIdx((i) => (i + 1) % STATUS_MESSAGES.length), 3000)
    const t2 = setInterval(() => setReadinessIdx((i) => (i + 1) % READINESS_MESSAGES.length), 3000)
    return () => { clearInterval(t1); clearInterval(t2) }
  }, [])

  return (
    <div className="relative flex items-center justify-center w-full h-full">

      {/* Stage radial glow — depth behind model */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.06), transparent 60%)',
          boxShadow: `inset 0 0 220px ${profile.color}10`,
        }}
      />

      {/* Model stage — centered, fixed size, breathing */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            width: '420px',
            height: '720px',
            transform: 'translateY(-40px)',
            animation: 'breathe 4s ease-in-out infinite',
            pointerEvents: 'auto',
          }}
        >
          <HolographicBody />
        </div>
      </div>

      {/* Circular HUD — rotating scan rings, depth layer above iframe */}
      <CircularHUD />

      {/* HUD overlay — arcs, nodes, connector lines, system labels */}
      <ScanHUD />

      {/* Interactive analysis nodes — hoverable, above HUD */}
      <BodyNodes />

      {/* Archetype label — above center */}
      <div className="absolute" style={{ top: 'calc(50% - 240px)' }}>
        <ArchetypeDriftLabel />
      </div>

      {/* System copy — below center */}
      <div
        className="absolute font-mono text-[10px] tracking-widest uppercase text-white/25 pointer-events-none"
        style={{ top: 'calc(50% + 240px)' }}
      >
        NEURIX calibrating your profile...
      </div>
      <div
        className="absolute font-mono text-[9px] tracking-[0.2em] uppercase pointer-events-none"
        style={{ top: 'calc(50% + 265px)', color: profile.color, opacity: 0.78 }}
      >
        {profile.id} · {profile.signalLabel}
      </div>

      {/* HUD Panel — top left (System Status) */}
      <HUDPanel className="absolute top-1/4 left-8 w-52">
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-1.5"
          style={{ color: 'rgba(255,255,255,0.38)' }}
        >
          [ SYSTEM STATUS ]
        </div>
        <div
          className="text-[13px] transition-all duration-500"
          style={{ color: 'rgba(255,255,255,0.8)' }}
        >
          {STATUS_MESSAGES[statusIdx]}
        </div>
      </HUDPanel>

      {/* HUD Panel — bottom right (Readiness) */}
      <HUDPanel className="absolute bottom-1/4 right-8 w-52">
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-1.5"
          style={{ color: 'rgba(255,255,255,0.38)' }}
        >
          [ READINESS ]
        </div>
        <div
          className="text-[13px] transition-all duration-500"
          style={{ color: 'rgba(255,255,255,0.8)' }}
        >
          {READINESS_MESSAGES[readinessIdx]}
        </div>
      </HUDPanel>

      {/* System micro-text: left edge vertical strip */}
      <div
        className="absolute pointer-events-none"
        style={{ left: 10, top: '35%', color: 'rgba(255,255,255,0.18)' }}
      >
        {['SCAN', 'INIT', '0x2F', '···'].map((t, i) => (
          <div key={i} className="font-mono text-[9px] tracking-widest uppercase leading-5">{t}</div>
        ))}
      </div>

      {/* System micro-text: right edge vertical strip */}
      <div
        className="absolute pointer-events-none text-right"
        style={{ right: 10, top: '40%', color: 'rgba(255,255,255,0.15)' }}
      >
        {['DATA', 'LOCK', 'V2.4', '···'].map((t, i) => (
          <div key={i} className="font-mono text-[9px] tracking-widest uppercase leading-5">{t}</div>
        ))}
      </div>

    </div>
  )
}
