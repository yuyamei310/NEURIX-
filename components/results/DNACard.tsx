'use client'

import { archetypeBadgeLabel } from '@/lib/classifier'
import { ETHICS_NOTE, getSyntheticArchiveProfile } from '@/lib/syntheticArchive'
import type { AtlasResult } from '@/types/atlas'

interface DNACardProps {
  result: AtlasResult
  canvasDataUrl?: string
}

export function DNACard({ result, canvasDataUrl }: DNACardProps) {
  const profile = getSyntheticArchiveProfile(result.archetype.archetype)
  const top3 = result.coach
    ? result.coach.sport_recommendations.slice(0, 3).map((r) => r.sport)
    : profile.sportPathways.slice(0, 3).map((r) => r.sport)

  const archiveEcho = result.soul_twins[0]
  const agentQuote = result.mentor?.soul_message ?? result.coach?.important_note ?? result.advisor.confidence_explanation

  return (
    <div
      id="dna-card"
      style={{
        position: 'fixed',
        top: -9999,
        left: -9999,
        width: 540,
        height: 675,
        background: '#080808',
        fontFamily: '-apple-system, Helvetica Neue, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        padding: '40px',
        border: `0.5px solid ${profile.color}`,
        color: '#ffffff',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: profile.color, marginBottom: 4 }}>
            ETHICAL AI DEBRIEF · {profile.id}
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.04em', color: '#ffffff' }}>NEURIX</div>
        </div>
        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#777' }}>
          SYNTHETIC
        </div>
      </div>

      {/* 3D canvas */}
      {canvasDataUrl && (
        <div style={{ width: '100%', height: 220, background: '#111', borderRadius: 8, overflow: 'hidden', marginBottom: 24, border: '0.5px solid #222' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            id="dna-card-3d-img"
            src={canvasDataUrl}
            alt="NEURIX body"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      )}

      {/* Archetype */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#86868b', marginBottom: 6 }}>
          ARCHETYPE SIGNAL
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', color: profile.color }}>
            {result.archetype.archetype.charAt(0).toUpperCase() + result.archetype.archetype.slice(1)}
          </span>
          <span style={{
            fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.14em',
            textTransform: 'uppercase', border: '0.5px solid #d0d0d5', borderRadius: 999,
            padding: '2px 8px', color: '#ffffff',
          }}>
            {archetypeBadgeLabel(result.archetype.archetype)}
          </span>
        </div>
      </div>

      {/* Sports */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#86868b', marginBottom: 6 }}>
          TOP SPORT PATHWAYS
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {top3.map((s, i) => (
            <span key={i} style={{ fontSize: 12, color: '#ffffff', border: '0.5px solid #333', borderRadius: 6, padding: '3px 8px' }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Archive echo */}
      {archiveEcho && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#86868b', marginBottom: 6 }}>
            SYNTHETIC ARCHIVE ECHO
          </div>
          <div style={{ fontSize: 13, color: '#bbbbbb' }}>{archiveEcho.era} · {archiveEcho.games_type}-inspired</div>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#86868b', marginBottom: 6 }}>
          AGENT QUOTE
        </div>
        <div style={{ fontSize: 15, color: '#ffffff', lineHeight: 1.45 }}>&ldquo;{agentQuote}&rdquo;</div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 'auto', marginBottom: 16 }}>
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', border: '0.5px solid #333', borderRadius: 999, padding: '5px 8px', color: '#bbbbbb' }}>
          Olympic + Paralympic parity
        </span>
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', border: `0.5px solid ${profile.color}`, borderRadius: 999, padding: '5px 8px', color: profile.color }}>
          {ETHICS_NOTE}
        </span>
      </div>

      {/* Footer */}
      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#86868b' }}>
        Generated by NEURIX · Synthetic demo card
      </div>
    </div>
  )
}
