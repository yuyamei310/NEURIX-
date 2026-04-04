'use client'

import { useAtlasStore } from '@/store/atlasStore'
import { archetypeBadgeLabel } from '@/lib/classifier'
import { Badge } from '@/components/ui/Badge'

export function ArchetypeDriftLabel() {
  const { archetype, confidence } = useAtlasStore((s) => s.localClassification)

  return (
    <div className="flex items-center gap-3">
      <span className="text-archetype">{archetype.toUpperCase()}</span>
      <Badge label={archetypeBadgeLabel(archetype)} variant="archetype" />
      <span className="font-mono text-[12px] text-[var(--text-3)] tracking-tight">
        {Math.round(confidence * 100)}% confidence
      </span>
    </div>
  )
}
