'use client'

import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { SoulTwin } from '@/types/neurix'

interface SoulTwinsProps {
  twins: SoulTwin[]
}

export function SoulTwins({ twins }: SoulTwinsProps) {
  return (
    <Card className="flex flex-col gap-5" padding={false}>
      <div className="px-5 pt-5">
        <div className="font-mono-data">SYNTHETIC ARCHIVE ECHOES</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-5 pb-5">
        {twins.map((twin, i) => (
          <article
            key={i}
            className="rounded-[8px] border border-white/[0.08] bg-white/[0.025] p-4 min-h-[210px] flex flex-col gap-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2 min-w-0">
                <span className="font-mono text-[11px] text-[var(--text-2)] leading-tight">{twin.era}</span>
                <Badge
                  label={twin.games_type.toUpperCase()}
                  variant={twin.games_type === 'Paralympic' ? 'paralympic' : 'olympic'}
                />
              </div>
              <div className="flex gap-2 text-[11px] font-mono text-[var(--text-3)] shrink-0">
                <span>{twin.height_cm}cm</span>
                <span>·</span>
                <span>{twin.weight_kg}kg</span>
              </div>
            </div>

            <div>
              <div className="text-[14px] font-semibold text-[var(--text)] leading-snug">{twin.archetype_label}</div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-[var(--text-3)] mt-1">{twin.sport}</div>
            </div>

            <p className="text-[12px] text-[var(--text-2)] leading-relaxed">{twin.similarity_note}</p>

            <div className="mt-auto pt-3 border-t border-white/[0.06]">
              <div className="font-mono text-[9px] tracking-widest uppercase text-[var(--text-3)] mb-1">
                Context
              </div>
              <p className="text-[11px] text-[var(--text-3)] leading-relaxed">{twin.historical_context}</p>
            </div>
          </article>
        ))}
      </div>
    </Card>
  )
}
