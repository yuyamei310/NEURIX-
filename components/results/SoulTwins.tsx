'use client'

import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { SoulTwin } from '@/types/atlas'

interface SoulTwinsProps {
  twins: SoulTwin[]
}

export function SoulTwins({ twins }: SoulTwinsProps) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="font-mono-data">SOUL TWINS</div>
      <div className="flex flex-col gap-4">
        {twins.map((twin, i) => (
          <div key={i} className="flex flex-col gap-2 pb-4 border-b border-[0.5px] border-[var(--border)] last:border-0 last:pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[12px] text-[var(--text-2)]">{twin.era}</span>
                <Badge
                  label={twin.games_type.toUpperCase()}
                  variant={twin.games_type === 'Paralympic' ? 'paralympic' : 'olympic'}
                />
              </div>
              <div className="flex gap-2 text-[11px] font-mono text-[var(--text-3)]">
                <span>{twin.height_cm}cm</span>
                <span>·</span>
                <span>{twin.weight_kg}kg</span>
              </div>
            </div>
            <div className="text-[13px] font-medium text-[var(--text)]">{twin.sport}</div>
            <p className="text-[12px] text-[var(--text-2)] leading-relaxed">{twin.similarity_note}</p>
            <p className="text-[11px] text-[var(--text-3)] leading-relaxed">{twin.historical_context}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
