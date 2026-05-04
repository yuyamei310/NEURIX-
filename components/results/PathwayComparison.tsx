'use client'

import type { SportRecommendation } from '@/types/atlas'

const ORANGE = '#FF8A4C'

interface PathwayComparisonProps {
  sports: SportRecommendation[]
}

function pickTop(sports: SportRecommendation[], isParalympic: boolean) {
  return sports
    .filter((sport) => sport.is_paralympic === isParalympic)
    .sort((a, b) => b.alignment_score - a.alignment_score)
    .slice(0, 2)
}

function PathwayColumn({
  title,
  tag,
  items,
}: {
  title: string
  tag: string
  items: SportRecommendation[]
}) {
  return (
    <div className="min-h-[260px] p-6" style={{ background: 'var(--bg)' }}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[8px] uppercase tracking-widest text-white/25">{tag}</div>
          <h3 className="mt-1 font-mono text-[16px] font-bold uppercase tracking-tight">{title}</h3>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="border border-white/[0.06] p-4 font-mono text-[10px] uppercase tracking-[0.12em] text-white/28">
          No pathway generated for this side. Switch agent mode to Coach or rerun analysis.
        </div>
      ) : (
        <div className="space-y-5">
          {items.map((item) => (
            <article key={item.sport} className="border-t border-white/[0.06] pt-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-[15px] font-bold uppercase">{item.sport}</div>
                  <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em]" style={{ color: ORANGE }}>
                    {item.alignment_score}% synthetic alignment
                  </div>
                </div>
                <div className="font-mono text-[10px] text-white/24">#{item.rank}</div>
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-white/42">{item.why}</p>
              <div className="mt-4 border-l pl-3 font-mono text-[9px] uppercase tracking-[0.1em] leading-relaxed text-white/34" style={{ borderColor: `${ORANGE}66` }}>
                {item.entry_point}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export function PathwayComparison({ sports }: PathwayComparisonProps) {
  const olympic = pickTop(sports, false)
  const paralympic = pickTop(sports, true)

  return (
    <section className="border-b border-white/[0.04]">
      <div className="px-5 md:px-8 pt-12 pb-7">
        <div className="font-mono text-[9px] tracking-widest uppercase mb-2 text-white/25">{'// PATHWAY PARITY'}</div>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-mono text-[24px] font-bold uppercase tracking-tight">Compare Pathways</h2>
            <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-white/42">
              Olympic-inspired and Paralympic-inspired routes are presented side by side so the recommendation model stays visibly balanced.
            </p>
          </div>
          <div className="font-mono text-[8px] uppercase tracking-[0.18em]" style={{ color: ORANGE }}>
            Equal-depth display
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-px bg-white/[0.035] xl:grid-cols-2">
        <PathwayColumn title="Olympic-Inspired" tag="OLY-SCOPE" items={olympic} />
        <PathwayColumn title="Paralympic-Inspired" tag="PARA-SCOPE" items={paralympic} />
      </div>
    </section>
  )
}

