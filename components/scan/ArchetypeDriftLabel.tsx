'use client'

import { useNeurixStore } from '@/store/neurixStore'
import { archetypeBadgeLabel } from '@/core/classifier'
import { Badge } from '@/components/ui/Badge'
import { getSyntheticArchiveProfile } from '@/core/syntheticArchive'

export function ArchetypeDriftLabel() {
  const { archetype, confidence } = useNeurixStore((s) => s.localClassification)
  const profile = getSyntheticArchiveProfile(archetype)

  return (
    <div className="flex items-center gap-3">
      <span className="text-archetype" style={{ color: profile.color, textShadow: `0 0 24px ${profile.color}55` }}>
        {archetype.toUpperCase()}
      </span>
      <Badge label={archetypeBadgeLabel(archetype)} variant="archetype" />
      <span className="font-mono text-[12px] text-[var(--text-3)] tracking-tight">
        {Math.round(confidence * 100)}% signal
      </span>
    </div>
  )
}
