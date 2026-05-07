'use client'

import type { UserProfile } from '@/types/neurix'

interface MemoryPanelProps {
  profile: UserProfile
}

const MEMORY_ORANGE = '#FF8A4C'

export function MemoryPanel({ profile }: MemoryPanelProps) {
  const lastUpdated = new Date(profile.lastUpdated)
  const dateStr = lastUpdated.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const timeStr = lastUpdated.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return (
    <div
      className="p-5 flex flex-col gap-4"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="font-mono text-[8px] tracking-[0.24em] uppercase text-white/30">
          Stored Profile
        </div>
        <span
          className="font-mono text-[8px] tracking-[0.18em] uppercase px-2 py-[3px] rounded-full"
          style={{
            color: MEMORY_ORANGE,
            background: `${MEMORY_ORANGE}18`,
            border: `1px solid ${MEMORY_ORANGE}40`,
          }}
        >
          MEMORY
        </span>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-2">
        <MemoryRow label="Height" value={`${profile.height} cm`} />
        <MemoryRow label="Weight" value={`${profile.weight} kg`} />
        <MemoryRow
          label="Archetype"
          value={profile.archetype.toUpperCase()}
          valueStyle={{ color: MEMORY_ORANGE }}
        />
        <MemoryRow label="Last analysis" value={`${dateStr} · ${timeStr}`} dim />
      </div>

      {/* Status line */}
      <div className="flex items-center gap-1.5 pt-1">
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: MEMORY_ORANGE }}
        />
        <span
          className="font-mono text-[8px] tracking-[0.18em] uppercase"
          style={{ color: `${MEMORY_ORANGE}99` }}
        >
          Profile active · responses are memory-driven
        </span>
      </div>
    </div>
  )
}

function MemoryRow({
  label,
  value,
  valueStyle,
  dim,
}: {
  label: string
  value: string
  valueStyle?: React.CSSProperties
  dim?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-white/25 shrink-0">
        {label}
      </span>
      <span
        className="font-mono text-[11px] font-medium text-right"
        style={valueStyle ?? { color: dim ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.65)' }}
      >
        {value}
      </span>
    </div>
  )
}
