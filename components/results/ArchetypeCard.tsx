'use client'

import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { archetypeBadgeLabel } from '@/lib/classifier'
import type { ArchetypeResult } from '@/types/atlas'

interface ArchetypeCardProps {
  data: ArchetypeResult
  onShare?: () => void
}

export function ArchetypeCard({ data, onShare }: ArchetypeCardProps) {
  const sports: Record<string, string[]> = {
    power: ['Shot put', 'Weightlifting', 'Wrestling', 'Discus', 'Para powerlifting'],
    endurance: ['Marathon', 'Cycling', 'Triathlon', 'Rowing', 'Para athletics'],
    technical: ['Gymnastics', 'Diving', 'Archery', 'Shooting', 'Para archery'],
    hybrid: ['Basketball', 'Soccer', 'Volleyball', 'Decathlon', 'Wheelchair basketball'],
  }
  const archetypeSports = sports[data.archetype] ?? []

  return (
    <Card className="flex flex-col gap-4 h-full">
      <div className="flex items-start justify-between">
        <Badge label={archetypeBadgeLabel(data.archetype)} variant="archetype" />
        <span className="font-mono text-[11px] text-[var(--text-3)] tracking-tight">
          {Math.round(data.confidence * 100)}%
        </span>
      </div>

      <div>
        <div className="text-archetype mb-1">{data.archetype.charAt(0).toUpperCase() + data.archetype.slice(1)}</div>
        <div className="font-mono-data">{data.time_span}</div>
      </div>

      <p className="text-body leading-relaxed">{data.reasoning}</p>

      {/* Olympic / Paralympic counts */}
      <div className="flex gap-4 pt-1">
        <div className="flex flex-col gap-1">
          <span className="font-mono-data">OLYMPIC</span>
          <span className="font-mono text-[15px] font-semibold">{data.olympic_count.toLocaleString()}</span>
        </div>
        <div className="w-px bg-[var(--border)]" />
        <div className="flex flex-col gap-1">
          <span className="font-mono-data">PARALYMPIC</span>
          <span className="font-mono text-[15px] font-semibold">{data.paralympic_count.toLocaleString()}</span>
        </div>
        <div className="w-px bg-[var(--border)]" />
        <div className="flex flex-col gap-1">
          <span className="font-mono-data">TOTAL CLUSTER</span>
          <span className="font-mono text-[15px] font-semibold">{data.cluster_size.toLocaleString()}</span>
        </div>
      </div>

      {/* Sport tags */}
      <div className="flex flex-wrap gap-1.5">
        {archetypeSports.map((s) => (
          <span
            key={s}
            className="text-[12px] text-[var(--text-3)] border border-[0.5px] border-[var(--border)] rounded-[6px] px-2 py-0.5"
          >
            {s}
          </span>
        ))}
      </div>

      {onShare && (
        <button
          onClick={onShare}
          className="mt-auto text-[13px] text-[var(--text-2)] border border-[0.5px] border-[var(--border-2)] rounded-pill px-4 py-2 hover:bg-[var(--surface-2)] transition-colors cursor-pointer self-start"
        >
          Share DNA card ↗
        </button>
      )}
    </Card>
  )
}
