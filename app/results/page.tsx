'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAtlasStore } from '@/store/atlasStore'
import { ArchetypeCard } from '@/components/results/ArchetypeCard'
import { BodyPanel } from '@/components/results/BodyPanel'
import { FloatingCard } from '@/components/results/FloatingCard'
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

  const sports =
    coachResult?.sport_recommendations ?? buildFallbackSports(result.archetype.archetype)

  const topSport = sports[0]
  const topTwin = result.soul_twins[0]

  const handleShare = async () => {
    await exportDNACard(canvasDataUrl)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-[0.5px] border-[var(--border)]">
        <button
          onClick={() => router.push('/scan')}
          className="font-mono-data hover:text-[var(--text-2)] transition-colors cursor-pointer"
        >
          ← ATLAS
        </button>
        <span className="font-mono-data">RESULTS</span>
      </header>

      {/* 3-column hero: archetype | 3D body | key factors */}
      <div
        className="flex gap-6 px-8 pt-8"
        style={{ height: '72vh', minHeight: '560px' }}
      >
        {/* Left: Archetype panel */}
        <div className="w-72 shrink-0 overflow-y-auto">
          <ArchetypeCard data={result.archetype} onShare={handleShare} />
        </div>

        {/* Center: 3D body — full height, floating cards on top */}
        <div className="flex-1 relative">
          <BodyPanel
            archetype={result.archetype.archetype}
            onCanvasReady={(url) => setCanvasDataUrl(url)}
            onHoverChange={setModelHovered}
          />

          {/* ── Always-visible cards ── */}
          {topSport && (
            <FloatingCard className="absolute top-4 right-4 w-44">
              <div className="font-mono-data mb-1.5">TOP MATCH</div>
              <div className="text-[13px] font-semibold text-[var(--text)]">{topSport.sport}</div>
              <div className="font-mono text-[11px] text-[var(--text-3)] mt-0.5">
                {topSport.alignment_score}% alignment
              </div>
            </FloatingCard>
          )}

          {topTwin && (
            <FloatingCard className="absolute bottom-8 left-4 w-44">
              <div className="font-mono-data mb-1.5">SOUL TWIN</div>
              <div className="text-[13px] font-semibold text-[var(--text)]">{topTwin.sport}</div>
              <div className="font-mono text-[11px] text-[var(--text-3)] mt-0.5">{topTwin.era}</div>
            </FloatingCard>
          )}

          {/* ── Hover-reveal analysis cards ── */}
          {/* Top-left: Archetype */}
          <FloatingCard
            className={`absolute top-4 left-4 w-44 transition-all duration-300 ${
              modelHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
          >
            <div className="font-mono-data mb-1.5">ARCHETYPE</div>
            <div className="text-[13px] font-semibold text-[var(--text)] capitalize">
              {result.archetype.archetype}
            </div>
            <div className="font-mono text-[11px] text-[var(--text-3)] mt-0.5">
              {Math.round(result.archetype.confidence * 100)}% confidence
            </div>
          </FloatingCard>

          {/* Mid-left: Olympic cluster */}
          <div
            className={`absolute left-4 w-44 transition-all duration-300 delay-75 ${
              modelHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            <FloatingCard>
              <div className="font-mono-data mb-1.5">OLYMPIC CLUSTER</div>
              <div className="text-[13px] font-semibold text-[var(--text)]">
                {result.archetype.cluster_size} athletes
              </div>
              <div className="font-mono text-[11px] text-[var(--text-3)] mt-0.5">
                {result.archetype.olympic_count} Olympic · {result.archetype.paralympic_count} Para
              </div>
              <div className="font-mono text-[10px] text-[var(--text-3)] mt-0.5">
                {result.archetype.time_span}
              </div>
            </FloatingCard>
          </div>

          {/* Mid-right: Key factor */}
          {result.advisor.key_factors[0] && (
            <div
              className={`absolute right-4 w-44 transition-all duration-300 delay-75 ${
                modelHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
              <FloatingCard>
                <div className="font-mono-data mb-1.5">KEY FACTOR</div>
                <div className="text-[13px] font-semibold text-[var(--text)]">
                  {result.advisor.key_factors[0].factor}
                </div>
                <div className="font-mono text-[11px] text-[var(--text-3)] mt-0.5">
                  {result.advisor.key_factors[0].value}
                </div>
              </FloatingCard>
            </div>
          )}

          {/* Bottom-right: Body profile */}
          <FloatingCard
            className={`absolute bottom-8 right-4 w-44 transition-all duration-300 delay-100 ${
              modelHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            <div className="font-mono-data mb-1.5">BODY PROFILE</div>
            <div className="font-mono text-[11px] text-[var(--text)] leading-relaxed">
              <div>{biometrics.height} cm · {biometrics.weight} kg</div>
              <div className="text-[var(--text-3)]">Age {biometrics.age}</div>
            </div>
          </FloatingCard>
        </div>

        {/* Right: Key factors from advisor */}
        <div className="w-64 shrink-0 flex flex-col justify-center py-4">
          <KeyFactorsPanel factors={result.advisor.key_factors} />
        </div>
      </div>

      {/* Agent mode section */}
      <section className="px-8 pt-10 pb-10 mt-8 border-t border-[0.5px] border-[var(--border)]">
        <AgentTabs />
      </section>

      {/* Soul twins + Reflection */}
      <section className="px-8 pb-16 flex flex-col gap-12">
        <SoulTwins twins={result.soul_twins} />
        <ReflectionPanel
          reflection={result.reflection.reflection}
          twins={result.soul_twins}
        />
      </section>

      {/* Off-screen DNA card for export */}
      <DNACard result={result} canvasDataUrl={canvasDataUrl} />
    </div>
  )
}
