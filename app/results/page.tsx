'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAtlasStore } from '@/store/atlasStore'
import { ArchetypeCard } from '@/components/results/ArchetypeCard'
import { BodyPanel } from '@/components/results/BodyPanel'
import { KeyFactorsPanel } from '@/components/results/KeyFactorsPanel'
import { SoulTwins } from '@/components/results/SoulTwins'
import { ReflectionPanel } from '@/components/results/ReflectionPanel'
import { AgentTabs } from '@/components/results/AgentTabs'
import { DNACard } from '@/components/results/DNACard'
import { exportDNACard } from '@/lib/dnaExport'
import type { SportRecommendation } from '@/types/atlas'

function buildFallbackSports(archetype: string): SportRecommendation[] {
  const fallbacks: Record<string, SportRecommendation[]> = {
    power: [
      { rank: 1, sport: 'Shot put', is_paralympic: false, alignment_score: 91, why: '', entry_point: '' },
      { rank: 2, sport: 'Weightlifting', is_paralympic: false, alignment_score: 84, why: '', entry_point: '' },
      { rank: 3, sport: 'Wrestling', is_paralympic: false, alignment_score: 77, why: '', entry_point: '' },
      { rank: 4, sport: 'Para powerlifting', is_paralympic: true, alignment_score: 73, why: '', entry_point: '' },
      { rank: 5, sport: 'Discus', is_paralympic: false, alignment_score: 68, why: '', entry_point: '' },
    ],
    endurance: [
      { rank: 1, sport: 'Marathon', is_paralympic: false, alignment_score: 90, why: '', entry_point: '' },
      { rank: 2, sport: 'Cycling', is_paralympic: false, alignment_score: 83, why: '', entry_point: '' },
      { rank: 3, sport: 'Triathlon', is_paralympic: false, alignment_score: 76, why: '', entry_point: '' },
      { rank: 4, sport: 'Para athletics', is_paralympic: true, alignment_score: 72, why: '', entry_point: '' },
      { rank: 5, sport: 'Wheelchair racing', is_paralympic: true, alignment_score: 67, why: '', entry_point: '' },
    ],
    technical: [
      { rank: 1, sport: 'Gymnastics', is_paralympic: false, alignment_score: 89, why: '', entry_point: '' },
      { rank: 2, sport: 'Diving', is_paralympic: false, alignment_score: 82, why: '', entry_point: '' },
      { rank: 3, sport: 'Archery', is_paralympic: false, alignment_score: 75, why: '', entry_point: '' },
      { rank: 4, sport: 'Para archery', is_paralympic: true, alignment_score: 71, why: '', entry_point: '' },
      { rank: 5, sport: 'Shooting', is_paralympic: false, alignment_score: 66, why: '', entry_point: '' },
    ],
    hybrid: [
      { rank: 1, sport: 'Basketball', is_paralympic: false, alignment_score: 88, why: '', entry_point: '' },
      { rank: 2, sport: 'Soccer', is_paralympic: false, alignment_score: 81, why: '', entry_point: '' },
      { rank: 3, sport: 'Wheelchair basketball', is_paralympic: true, alignment_score: 76, why: '', entry_point: '' },
      { rank: 4, sport: 'Volleyball', is_paralympic: false, alignment_score: 70, why: '', entry_point: '' },
      { rank: 5, sport: 'Sitting volleyball', is_paralympic: true, alignment_score: 65, why: '', entry_point: '' },
    ],
  }
  return fallbacks[archetype] ?? fallbacks.hybrid
}

export default function ResultsPage() {
  const router = useRouter()
  const result = useAtlasStore((s) => s.result)
  const coachResult = useAtlasStore((s) => s.coachResult)
  const biometrics = useAtlasStore((s) => s.biometrics)
  const [canvasDataUrl, setCanvasDataUrl] = useState<string | undefined>()
  const [modelHovered, setModelHovered] = useState(false)

  useEffect(() => {
    if (!result) router.replace('/scan')
  }, [result, router])

  if (!result) return null

  const sports = coachResult?.sport_recommendations ?? buildFallbackSports(result.archetype.archetype)
  const topSport = sports[0]
  const topTwin = result.soul_twins[0]
  const confidencePct = Math.round(result.archetype.confidence * 100)

  const handleShare = async () => {
    await exportDNACard(canvasDataUrl)
  }

  return (
    <div
      className="min-h-screen sys-grid"
      style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--mono)' }}
    >
      {/* Scanlines overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 9998,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.055) 3px, rgba(0,0,0,0.055) 4px)',
        }}
      />

      {/* ── HEADER ── */}
      <header
        className="flex items-center justify-between px-8 py-4 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <button
          onClick={() => router.push('/scan')}
          className="font-mono text-[10px] tracking-widest uppercase cursor-pointer transition-opacity hover:opacity-100"
          style={{ opacity: 0.35 }}
        >
          ← NEURIX
        </button>
        <div className="flex items-center gap-5">
          <span className="font-mono text-[9px] tracking-widest uppercase" style={{ opacity: 0.2 }}>
            SYS://RESULTS
          </span>
          <span className="font-mono text-[9px]" style={{ color: 'rgba(0,229,255,0.55)' }}>
            ● LIVE
          </span>
        </div>
      </header>

      {/* ── CLASSIFICATION BANNER ── */}
      <section
        className="px-8 py-10 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.04)' }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-5"
          style={{ opacity: 0.22 }}
        >
          [CLASSIFICATION COMPLETE] ▶ ARCHETYPE LOCKED
        </div>

        <div className="flex flex-wrap items-end gap-8 md:gap-16">
          {/* Big archetype label */}
          <div>
            <div
              className="font-mono text-[9px] tracking-widest uppercase mb-2"
              style={{ opacity: 0.28 }}
            >
              YOU ARE
            </div>
            <h1
              className="font-mono font-bold tracking-tight leading-none"
              style={{
                fontSize: 'clamp(52px, 8vw, 88px)',
                textShadow: '0 0 50px rgba(255,255,255,0.12)',
              }}
            >
              {result.archetype.archetype.toUpperCase()}
            </h1>
          </div>

          {/* Confidence */}
          <div className="pb-1">
            <div
              className="font-mono text-[9px] tracking-widest uppercase mb-3"
              style={{ opacity: 0.28 }}
            >
              CONFIDENCE
            </div>
            <div className="flex items-center gap-5">
              <div
                className="relative w-48 rounded-full overflow-hidden"
                style={{ height: 2, background: 'rgba(255,255,255,0.08)' }}
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full glow-bar"
                  style={{ width: `${confidencePct}%` }}
                />
              </div>
              <span
                className="font-mono font-bold"
                style={{ fontSize: 32, letterSpacing: '-0.02em' }}
              >
                {confidencePct}%
              </span>
            </div>
          </div>

          {/* Cluster size */}
          <div className="pb-1 ml-auto">
            <div
              className="font-mono text-[9px] tracking-widest uppercase mb-2"
              style={{ opacity: 0.22 }}
            >
              ATHLETE CLUSTER
            </div>
            <span
              className="font-mono font-semibold"
              style={{ fontSize: 20, opacity: 0.45 }}
            >
              {result.archetype.cluster_size.toLocaleString()}
            </span>
            <span
              className="font-mono text-[9px] tracking-widest ml-2"
              style={{ opacity: 0.2 }}
            >
              RECORDS
            </span>
          </div>
        </div>
      </section>

      {/* ── MAIN 3-COLUMN ── */}
      <div
        className="grid gap-px"
        style={{
          gridTemplateColumns: '264px 1fr 264px',
          height: '68vh',
          minHeight: '520px',
          background: 'rgba(255,255,255,0.028)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        {/* LEFT: Profile card */}
        <ArchetypeCard
          data={result.archetype}
          biometrics={biometrics}
          onShare={handleShare}
        />

        {/* CENTER: 3D body + HUD rings */}
        <div className="relative overflow-hidden" style={{ background: 'var(--bg)' }}>
          <BodyPanel
            archetype={result.archetype.archetype}
            onCanvasReady={(url) => setCanvasDataUrl(url)}
            onHoverChange={setModelHovered}
          />

          {/* HUD rotating rings */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ zIndex: 4 }}
          >
            <div className="relative" style={{ width: 0, height: 0 }}>
              {/* Outer ring */}
              <div
                className="ring-spin-slow absolute border rounded-full"
                style={{
                  width: 400, height: 400,
                  top: -200, left: -200,
                  borderColor: 'rgba(0,229,255,0.07)',
                }}
              />
              {/* Middle dashed ring */}
              <div
                className="ring-spin-ccw absolute rounded-full"
                style={{
                  width: 298, height: 298,
                  top: -149, left: -149,
                  border: '1px dashed rgba(0,229,255,0.1)',
                }}
              />
              {/* Inner ring */}
              <div
                className="ring-spin-cw absolute border rounded-full"
                style={{
                  width: 208, height: 208,
                  top: -104, left: -104,
                  borderColor: 'rgba(0,229,255,0.07)',
                }}
              />
              {/* Center glow dot */}
              <div
                className="absolute rounded-full"
                style={{
                  width: 6, height: 6, top: -3, left: -3,
                  background: 'rgba(0,229,255,0.5)',
                  boxShadow: '0 0 14px rgba(0,229,255,0.7)',
                }}
              />
            </div>
          </div>

          {/* ── Always-visible data points ── */}
          {topSport && (
            <div
              className="absolute top-5 right-5 pointer-events-none"
              style={{ zIndex: 10 }}
            >
              <div
                className="font-mono text-[8px] tracking-widest uppercase mb-0.5"
                style={{ color: 'rgba(0,229,255,0.5)' }}
              >
                TOP MATCH
              </div>
              <div className="font-mono text-[12px] font-semibold">{topSport.sport}</div>
              <div className="font-mono text-[9px]" style={{ opacity: 0.3 }}>
                {topSport.alignment_score}% align
              </div>
            </div>
          )}

          {topTwin && (
            <div
              className="absolute bottom-5 left-5 pointer-events-none"
              style={{ zIndex: 10 }}
            >
              <div
                className="font-mono text-[8px] tracking-widest uppercase mb-0.5"
                style={{ color: 'rgba(0,229,255,0.5)' }}
              >
                SOUL TWIN
              </div>
              <div className="font-mono text-[12px] font-semibold">{topTwin.sport}</div>
              <div className="font-mono text-[9px]" style={{ opacity: 0.3 }}>{topTwin.era}</div>
            </div>
          )}

          {/* ── Hover-reveal data points ── */}
          <div
            className={`absolute top-5 left-5 transition-all duration-300 ${modelHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ zIndex: 10 }}
          >
            <div
              className="font-mono text-[8px] tracking-widest uppercase mb-0.5"
              style={{ color: 'rgba(0,229,255,0.5)' }}
            >
              ARCHETYPE
            </div>
            <div className="font-mono text-[12px] font-semibold capitalize">
              {result.archetype.archetype}
            </div>
            <div className="font-mono text-[9px]" style={{ opacity: 0.3 }}>
              {confidencePct}% conf
            </div>
          </div>

          <div
            className={`absolute left-5 transition-all duration-300 delay-75 ${modelHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
          >
            <div
              className="font-mono text-[8px] tracking-widest uppercase mb-0.5"
              style={{ color: 'rgba(0,229,255,0.5)' }}
            >
              CLUSTER
            </div>
            <div className="font-mono text-[12px] font-semibold">
              {result.archetype.cluster_size}
            </div>
            <div className="font-mono text-[9px]" style={{ opacity: 0.3 }}>
              {result.archetype.olympic_count} OLY · {result.archetype.paralympic_count} PARA
            </div>
          </div>

          {result.advisor.key_factors[0] && (
            <div
              className={`absolute right-5 transition-all duration-300 delay-75 ${modelHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              style={{ top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
            >
              <div
                className="font-mono text-[8px] tracking-widest uppercase mb-0.5"
                style={{ color: 'rgba(0,229,255,0.5)' }}
              >
                KEY FACTOR
              </div>
              <div className="font-mono text-[12px] font-semibold">
                {result.advisor.key_factors[0].factor}
              </div>
              <div className="font-mono text-[9px]" style={{ opacity: 0.3 }}>
                {result.advisor.key_factors[0].value}
              </div>
            </div>
          )}

          <div
            className={`absolute bottom-5 right-5 transition-all duration-300 delay-100 ${modelHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ zIndex: 10 }}
          >
            <div
              className="font-mono text-[8px] tracking-widest uppercase mb-0.5"
              style={{ color: 'rgba(0,229,255,0.5)' }}
            >
              BODY PROFILE
            </div>
            <div className="font-mono text-[11px]">
              {biometrics.height}cm · {biometrics.weight}kg
            </div>
            <div className="font-mono text-[9px]" style={{ opacity: 0.3 }}>
              Age {biometrics.age}
            </div>
          </div>
        </div>

        {/* RIGHT: Insights panel */}
        <KeyFactorsPanel factors={result.advisor.key_factors} />
      </div>

      {/* ── TIMELINE + ACTION ── */}
      <div
        className="grid gap-px"
        style={{
          gridTemplateColumns: '1fr 360px',
          background: 'rgba(255,255,255,0.028)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          minHeight: 320,
        }}
      >
        {/* System log timeline */}
        <div style={{ background: 'var(--bg)' }}>
          <ReflectionPanel
            reflection={result.reflection.reflection}
            twins={result.soul_twins}
          />
        </div>

        {/* Action panel */}
        <div
          className="flex flex-col justify-center gap-5 p-8"
          style={{ background: 'var(--bg)' }}
        >
          <div
            className="font-mono text-[8px] tracking-widest uppercase"
            style={{ opacity: 0.22 }}
          >
            // RECOMMENDED PATH
          </div>

          {topSport && (
            <>
              <div>
                <div
                  className="font-mono text-[8px] tracking-widest uppercase mb-1"
                  style={{ opacity: 0.28 }}
                >
                  PRIMARY SPORT
                </div>
                <div
                  className="font-mono font-bold tracking-tight"
                  style={{ fontSize: 26, letterSpacing: '-0.01em' }}
                >
                  {topSport.sport.toUpperCase()}
                </div>
                <div
                  className="font-mono text-[9px] mt-1 tracking-widest"
                  style={{ color: 'rgba(0,229,255,0.55)' }}
                >
                  {topSport.alignment_score}% ALIGNMENT
                </div>
              </div>

              <div>
                <div
                  className="font-mono text-[8px] tracking-widest uppercase mb-1"
                  style={{ opacity: 0.28 }}
                >
                  ARCHETYPE
                </div>
                <div className="font-mono text-[13px] font-semibold capitalize">
                  {result.archetype.archetype}
                </div>
              </div>
            </>
          )}

          <button
            onClick={() => router.push('/scan')}
            className="font-mono text-[9px] tracking-widest uppercase border px-5 py-3 mt-1 cursor-pointer transition-all hover:bg-white hover:text-black"
            style={{
              borderColor: 'rgba(255,255,255,0.18)',
              color: 'rgba(255,255,255,0.65)',
            }}
          >
            INITIATE TRAINING PROTOCOL →
          </button>

          <button
            onClick={handleShare}
            className="font-mono text-[8px] tracking-widest uppercase cursor-pointer transition-opacity hover:opacity-60 text-left"
            style={{ opacity: 0.22 }}
          >
            ↗ EXPORT DNA CARD
          </button>
        </div>
      </div>

      {/* ── AGENT ANALYSIS ── */}
      <section
        className="px-8 pt-12 pb-14 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.04)' }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-7"
          style={{ opacity: 0.22 }}
        >
          // AGENT ANALYSIS
        </div>
        <AgentTabs />
      </section>

      {/* ── SOUL TWINS ── */}
      <section className="px-8 pt-12 pb-20">
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-7"
          style={{ opacity: 0.22 }}
        >
          // SOUL TWINS · HISTORICAL MATCHES
        </div>
        <SoulTwins twins={result.soul_twins} />
      </section>

      {/* Off-screen DNA card for export */}
      <DNACard result={result} canvasDataUrl={canvasDataUrl} />
    </div>
  )
}
