'use client'

import { useEffect, useState, useRef } from 'react'
import type { CSSProperties, MutableRefObject } from 'react'
import { useRouter } from 'next/navigation'
import { useAtlasStore } from '@/store/atlasStore'
import { ArchetypeCard } from '@/components/results/ArchetypeCard'
import { BodyPanel } from '@/components/results/BodyPanel'
import { KeyFactorsPanel } from '@/components/results/KeyFactorsPanel'
import { SoulTwins } from '@/components/results/SoulTwins'
import { ReflectionPanel } from '@/components/results/ReflectionPanel'
import { AgentTabs } from '@/components/results/AgentTabs'
import { DNACard } from '@/components/results/DNACard'
import { MemoryPanel } from '@/components/results/MemoryPanel'
import { DataProvenancePanel } from '@/components/results/DataProvenancePanel'
import { PathwayComparison } from '@/components/results/PathwayComparison'
import { exportDNACard } from '@/core/dnaExport'
import { ETHICS_NOTE, getSyntheticArchiveProfile } from '@/core/syntheticArchive'

export default function ResultsPage() {
  const router = useRouter()
  const result = useAtlasStore((s) => s.result)
  const coachResult = useAtlasStore((s) => s.coachResult)
  const mentorResult = useAtlasStore((s) => s.mentorResult)
  const activeAgent = useAtlasStore((s) => s.activeAgent)
  const biometrics = useAtlasStore((s) => s.biometrics)
  const userProfile = useAtlasStore((s) => s.userProfile)
  const [canvasDataUrl, setCanvasDataUrl] = useState<string | undefined>()
  const [modelHovered, setModelHovered] = useState(false)
  const [titleChars, setTitleChars] = useState(0)
  const [counts, setCounts] = useState({ confidence: 0, cluster: 0, olympic: 0, paralympic: 0, align: 0 })
  const reflectionRef = useRef<HTMLDivElement>(null)
  const agentRef = useRef<HTMLDivElement>(null)
  const twinsRef = useRef<HTMLDivElement>(null)
  const [reflectionVisible, setReflectionVisible] = useState(false)
  const [agentVisible, setAgentVisible] = useState(false)
  const [twinsVisible, setTwinsVisible] = useState(false)

  useEffect(() => {
    if (!result) router.replace('/scan')
  }, [result, router])

  useEffect(() => {
    if (!result) return
    const title = (result.archetype.archetype + ' profile locked').toUpperCase()
    let i = 0
    const id = setInterval(() => {
      i++
      setTitleChars(i)
      if (i >= title.length) clearInterval(id)
    }, 58)
    return () => clearInterval(id)
  }, [result])

  useEffect(() => {
    if (!result) return
    const archetypeProfile = getSyntheticArchiveProfile(result.archetype.archetype)
    const coach = coachResult ?? result.coach
    const sports = coach?.sport_recommendations ?? archetypeProfile.sportPathways
    const topSportEntry = sports[0]
    const conf = Math.round(result.archetype.confidence * 100)

    type Key = 'confidence' | 'cluster' | 'olympic' | 'paralympic' | 'align'
    const targets: Record<Key, number> = {
      confidence: conf,
      cluster: result.archetype.cluster_size,
      olympic: result.archetype.olympic_count,
      paralympic: result.archetype.paralympic_count,
      align: topSportEntry.alignment_score,
    }
    const delays: Record<Key, number> = { confidence: 350, align: 500, cluster: 600, olympic: 700, paralympic: 800 }
    const duration = 1500

    const timers = (Object.entries(targets) as [Key, number][]).map(([key, target]) =>
      setTimeout(() => {
        const start = performance.now()
        const tick = () => {
          const p = Math.min((performance.now() - start) / duration, 1)
          const ease = 1 - (1 - p) ** 3
          setCounts((prev) => ({ ...prev, [key]: Math.round(target * ease) }))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }, delays[key])
    )
    return () => timers.forEach(clearTimeout)
  }, [result, coachResult])

  useEffect(() => {
    type Entry = { ref: MutableRefObject<HTMLDivElement | null>; setter: (v: boolean) => void }
    const watched: Entry[] = [
      { ref: reflectionRef, setter: setReflectionVisible },
      { ref: agentRef,      setter: setAgentVisible },
      { ref: twinsRef,      setter: setTwinsVisible },
    ]
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const found = watched.find((w) => w.ref.current === e.target)
          if (found && e.isIntersecting) found.setter(true)
        })
      },
      { threshold: 0.06 }
    )
    watched.forEach(({ ref }) => { if (ref.current) obs.observe(ref.current) })
    return () => obs.disconnect()
  }, [])

  if (!result) return null

  const profile = getSyntheticArchiveProfile(result.archetype.archetype)
  const ORANGE = '#FF8A4C'
  const hydratedCoach = coachResult ?? result.coach
  const hydratedMentor = mentorResult ?? result.mentor
  const sports = hydratedCoach?.sport_recommendations ?? profile.sportPathways
  const topSport = sports[0]
  const topTwin = result.soul_twins[0]
  const confidenceRaw = Math.round(result.archetype.confidence * 100)

  const agentNarrative =
    activeAgent === 'coach'
      ? hydratedCoach?.narrative ?? result.advisor.narrative
      : activeAgent === 'mentor'
      ? hydratedMentor?.narrative ?? result.advisor.narrative
      : result.advisor.narrative

  const fullTitle = (result.archetype.archetype + ' profile locked').toUpperCase()
  const archetypeDisplay = fullTitle.slice(0, titleChars)
  const titleDone = titleChars >= fullTitle.length

  const handleShare = async () => {
    await exportDNACard(canvasDataUrl)
  }

  return (
    <div
      className="min-h-screen sys-grid"
      style={{
        background: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: 'var(--mono)',
        '--active-archetype-color': ORANGE,
        '--active-archetype-soft': `${ORANGE}22`,
      } as CSSProperties}
    >
      {/* CRT scanline */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 9998,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.055) 3px, rgba(0,0,0,0.055) 4px)',
        }}
      />

      <header className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-white/[0.05]">
        <button
          onClick={() => router.push('/scan')}
          className="font-mono text-[10px] tracking-widest uppercase cursor-pointer transition-opacity hover:opacity-100"
          style={{ opacity: 0.4 }}
        >
          ← NEURIX
        </button>
        <div className="flex items-center gap-5">
          <span className="font-mono text-[9px] tracking-widest uppercase text-white/25">SYS://ETHICAL-DEBRIEF</span>
          <span className="font-mono text-[9px]" style={{ color: ORANGE }}>● SYNTHETIC</span>
        </div>
      </header>

      {/* ── Hero: archetype reveal ──────────────────────────────── */}
      <section className="relative overflow-hidden px-5 md:px-8 py-10 md:py-14 border-b border-white/[0.04]">
        {/* Ambient radial */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 0%, ${ORANGE}1e, transparent 52%)` }}
        />
        {/* Scan beam sweeps while title types in */}
        {!titleDone && (
          <div
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${ORANGE}99, transparent)`,
              boxShadow: `0 0 18px ${ORANGE}66`,
              zIndex: 2,
              animation: 'scan-beam 2.5s linear forwards',
            }}
          />
        )}

        <div className="relative font-mono text-[9px] tracking-[0.22em] uppercase mb-5 reveal-1" style={{ color: ORANGE }}>
          [CLASSIFIED DEBRIEF READY] · {result.archetype.synthetic_archive_id} · {ETHICS_NOTE}
        </div>

        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-end">
          <div>
            <div className="font-mono text-[9px] tracking-widest uppercase mb-2 text-white/30 reveal-1">You are</div>

            {/* Typewriter archetype title */}
            <h1
              className="font-mono font-black tracking-tight leading-none reveal-2"
              style={{
                fontSize: 'clamp(48px, 8vw, 96px)',
                color: ORANGE,
                textShadow: `0 0 50px ${ORANGE}33`,
                minHeight: '1.1em',
                textTransform: 'uppercase',
              }}
            >
              {archetypeDisplay}
              {!titleDone && <span className="cursor-blink" />}
            </h1>

            {/* Underline that appears after typing finishes */}
            <div
              className="mt-3 h-[1px] overflow-hidden"
              style={{ maxWidth: '480px', background: 'rgba(255,255,255,0.06)' }}
            >
              <div
                className="h-full"
                style={{
                  background: `linear-gradient(90deg, ${ORANGE}, transparent)`,
                  width: titleDone ? '100%' : '0%',
                  transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>

            <p
              className="mt-5 max-w-3xl text-[13px] leading-relaxed text-white/48 font-sans reveal-3"
              style={{ opacity: titleDone ? undefined : 0, transition: 'opacity 0.6s ease' }}
            >
              {agentNarrative}
            </p>
          </div>

          {/* Stats tiles — stagger in */}
          <div className="grid grid-cols-2 gap-px border border-white/[0.06] bg-white/[0.04]">
            <div className="p-4 bg-[var(--bg)] stat-1">
              <div className="font-mono text-[8px] tracking-widest uppercase mb-2 text-white/25">Signal confidence</div>
              <div className="font-mono text-[34px] font-bold" style={{ color: ORANGE }}>
                {counts.confidence}%
              </div>
              <div className="mt-2 h-[2px] bg-white/10 overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${counts.confidence}%`,
                    background: ORANGE,
                    transition: 'width 150ms linear',
                  }}
                />
              </div>
            </div>
            <div className="p-4 bg-[var(--bg)] stat-2">
              <div className="font-mono text-[8px] tracking-widest uppercase mb-2 text-white/25">Top pathway</div>
              <div className="font-mono text-[16px] font-bold uppercase">{topSport.sport}</div>
              <div className="mt-2 text-[9px] tracking-widest uppercase" style={{ color: ORANGE }}>
                {counts.align}% align
              </div>
            </div>
            <div className="p-4 bg-[var(--bg)] stat-3">
              <div className="font-mono text-[8px] tracking-widest uppercase mb-2 text-white/25">Archive nodes</div>
              <div className="font-mono text-[22px] font-bold">{counts.cluster.toLocaleString()}</div>
              <div className="mt-2 text-[9px] text-white/25">synthetic signals</div>
            </div>
            <div className="p-4 bg-[var(--bg)] stat-4">
              <div className="font-mono text-[8px] tracking-widest uppercase mb-2 text-white/25">Parity model</div>
              <div className="font-mono text-[11px] leading-relaxed text-white/55">
                {counts.olympic} OLY-SYN<br />
                {counts.paralympic} PARA-SYN
              </div>
            </div>
          </div>
        </div>
      </section>

      <DataProvenancePanel archetype={result.archetype} />

      {/* ── 3-col data grid (stagger panels in) ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[264px_minmax(0,1fr)_264px] gap-px bg-white/[0.028] border-b border-white/[0.04]">
        <div className="panel-1 flex flex-col" style={{ background: 'var(--bg)' }}>
          <ArchetypeCard data={result.archetype} biometrics={biometrics} onShare={handleShare} />
          {userProfile && <MemoryPanel profile={userProfile} />}
        </div>

        <div className="relative overflow-hidden min-h-[520px] panel-2" style={{ background: 'var(--bg)' }}>
          <BodyPanel
            archetype={result.archetype.archetype}
            onCanvasReady={(url) => setCanvasDataUrl(url)}
            onHoverChange={setModelHovered}
          />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 4 }}>
            <div className="relative" style={{ width: 0, height: 0 }}>
              <div className="ring-spin-slow absolute border rounded-full" style={{ width: 400, height: 400, top: -200, left: -200, borderColor: `${ORANGE}18` }} />
              <div className="ring-spin-ccw absolute rounded-full" style={{ width: 298, height: 298, top: -149, left: -149, border: `1px dashed ${ORANGE}24` }} />
              <div className="ring-spin-cw absolute border rounded-full" style={{ width: 208, height: 208, top: -104, left: -104, borderColor: `${ORANGE}18` }} />
              <div className="absolute rounded-full" style={{ width: 6, height: 6, top: -3, left: -3, background: ORANGE, boxShadow: `0 0 14px ${ORANGE}` }} />
            </div>
          </div>

          <HudDatum position="top-5 right-5" label="Top match" value={topSport.sport} detail={`${topSport.alignment_score}% align`} color={ORANGE} />
          {topTwin && <HudDatum position="bottom-5 left-5" label="Archive echo" value={topTwin.sport} detail={topTwin.era} color={ORANGE} />}
          <div className={`absolute top-5 left-5 transition-all duration-300 ${modelHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ zIndex: 10 }}>
            <HudDatum label="Archetype" value={result.archetype.archetype} detail={`${confidenceRaw}% signal`} color={ORANGE} />
          </div>
          <div className={`absolute right-5 bottom-5 transition-all duration-300 ${modelHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ zIndex: 10 }}>
            <HudDatum label="Ethics layer" value="Identity safe" detail={ETHICS_NOTE} color={ORANGE} />
          </div>
        </div>

        <div className="panel-3" style={{ background: 'var(--bg)' }}>
          <KeyFactorsPanel factors={result.advisor.key_factors} />
        </div>
      </div>

      {/* ── Reflection + recommended path (scroll reveal) ─────────── */}
      <div
        ref={reflectionRef}
        className={`grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-px bg-white/[0.028] border-b border-white/[0.04] section-hidden ${reflectionVisible ? 'section-visible' : ''}`}
      >
        <div style={{ background: 'var(--bg)' }}>
          <ReflectionPanel reflection={result.reflection.reflection} twins={result.soul_twins} />
        </div>

        <div className="flex flex-col justify-center gap-5 p-8" style={{ background: 'var(--bg)' }}>
          <div className="font-mono text-[8px] tracking-widest uppercase text-white/25">{'// RECOMMENDED PATH'}</div>
          <div>
            <div className="font-mono text-[8px] tracking-widest uppercase mb-1 text-white/30">Primary sport pathway</div>
            <div className="font-mono font-bold tracking-tight uppercase" style={{ fontSize: 26 }}>{topSport.sport}</div>
            <div className="font-mono text-[9px] mt-1 tracking-widest" style={{ color: ORANGE }}>
              {topSport.alignment_score}% SYNTHETIC ALIGNMENT
            </div>
          </div>
          <p className="text-[12px] leading-relaxed text-white/40 font-sans">{topSport.why}</p>
          <button
            onClick={handleShare}
            className="font-mono text-[9px] tracking-widest uppercase border px-5 py-3 mt-1 cursor-pointer transition-all hover:bg-white hover:text-black"
            style={{ borderColor: `${ORANGE}66`, color: ORANGE }}
          >
            Export NEURIX debrief card →
          </button>
          <button
            onClick={() => router.push('/scan')}
            className="font-mono text-[8px] tracking-widest uppercase cursor-pointer transition-opacity hover:opacity-60 text-left text-white/25"
          >
            Recalibrate scan
          </button>
        </div>
      </div>

      <PathwayComparison sports={sports} />

      {/* ── Agent lenses (scroll reveal) ─────────────────────────── */}
      <div
        ref={agentRef}
        className={`px-5 md:px-8 pt-12 pb-14 border-b border-white/[0.04] section-hidden ${agentVisible ? 'section-visible' : ''}`}
      >
        <div className="font-mono text-[9px] tracking-widest uppercase mb-7 text-white/25">{'// AGENT LENSES'}</div>
        <AgentTabs />
      </div>

      {/* ── Soul twins (scroll reveal) ────────────────────────────── */}
      <div
        ref={twinsRef}
        className={`px-5 md:px-8 pt-12 pb-20 section-hidden ${twinsVisible ? 'section-visible' : ''}`}
      >
        <div className="font-mono text-[9px] tracking-widest uppercase mb-7 text-white/25">{'// SYNTHETIC ARCHIVE ECHOES'}</div>
        <SoulTwins twins={result.soul_twins} />
      </div>

      <DNACard result={{ ...result, coach: hydratedCoach, mentor: hydratedMentor }} userProfile={userProfile} canvasDataUrl={canvasDataUrl} />
    </div>
  )
}

function HudDatum({
  label,
  value,
  detail,
  color,
  position = '',
}: {
  label: string
  value: string
  detail: string
  color: string
  position?: string
}) {
  return (
    <div className={`${position ? `absolute pointer-events-none ${position}` : 'pointer-events-none'}`} style={{ zIndex: 10 }}>
      <div className="font-mono text-[8px] tracking-widest uppercase mb-0.5" style={{ color }}>
        {label}
      </div>
      <div className="font-mono text-[12px] font-semibold capitalize">{value}</div>
      <div className="font-mono text-[9px] text-white/30 max-w-[180px]">{detail}</div>
    </div>
  )
}
