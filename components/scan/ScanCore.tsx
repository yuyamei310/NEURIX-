'use client'

import { ArchetypeDriftLabel } from '@/components/scan/ArchetypeDriftLabel'
import { CircularHUD } from '@/components/scan/CircularHUD'
import { HolographicBody } from '@/components/scan/HolographicBody'
import { ScanHUD } from '@/components/scan/ScanHUD'
import { BodyNodes } from '@/components/scan/BodyNodes'
import { useAtlasStore } from '@/store/atlasStore'
import { getSyntheticArchiveProfile } from '@/core/syntheticArchive'

export function ScanCore() {
  const { height, weight, age, habits, agentMode } = useAtlasStore((s) => s.biometrics)
  const { archetype } = useAtlasStore((s) => s.localClassification)
  const profile = getSyntheticArchiveProfile(archetype)
  const biometricsModified = height !== 175 || weight !== 75 || age !== 25
  const completion = (biometricsModified ? 35 : 0) + (habits.length > 0 ? 35 : 0) + 30

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
        Build signal in the console below
      </div>
      <div
        className="absolute font-mono text-[9px] tracking-[0.2em] uppercase pointer-events-none"
        style={{ top: 'calc(50% + 265px)', color: profile.color, opacity: 0.78 }}
      >
        {completion}% · {agentMode} lens · {profile.signalLabel}
      </div>

    </div>
  )
}
