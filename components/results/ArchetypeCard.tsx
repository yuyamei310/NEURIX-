'use client'

import type { ArchetypeResult } from '@/types/atlas'

interface ArchetypeCardProps {
  data: ArchetypeResult
  biometrics?: { height: number; weight: number; age: number }
  onShare?: () => void
}

const ARCHETYPE_SPORTS: Record<string, string[]> = {
  power: ['Shot put', 'Weightlifting', 'Wrestling', 'Para powerlifting'],
  endurance: ['Marathon', 'Cycling', 'Triathlon', 'Para athletics'],
  technical: ['Gymnastics', 'Diving', 'Archery', 'Para archery'],
  hybrid: ['Basketball', 'Soccer', 'Volleyball', 'Wheelchair basketball'],
}

export function ArchetypeCard({ data, biometrics, onShare }: ArchetypeCardProps) {
  const sports = ARCHETYPE_SPORTS[data.archetype] ?? []

  return (
    <div
      className="flex flex-col h-full overflow-y-auto p-6 gap-5"
      style={{ background: 'var(--bg)', fontFamily: 'var(--mono)' }}
    >
      <div
        className="text-[8px] tracking-widest uppercase"
        style={{ opacity: 0.22 }}
      >
        {'// SYNTHETIC PROFILE'}
      </div>

      {/* Biometrics */}
      {biometrics && (
        <div>
          <div
            className="text-[8px] tracking-widest uppercase mb-1"
            style={{ opacity: 0.25 }}
          >
            BIOMETRICS
          </div>
          <div className="text-[12px]" style={{ opacity: 0.65 }}>
            {biometrics.height}cm · {biometrics.weight}kg · Age {biometrics.age}
          </div>
        </div>
      )}

      {/* Reasoning clamped to 3 lines */}
      <p className="text-[10px] leading-relaxed line-clamp-3" style={{ opacity: 0.32 }}>
        {data.reasoning}
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="text-[8px] tracking-widest uppercase mb-1" style={{ opacity: 0.25 }}>
            OLY-SYN
          </div>
          <div className="text-[17px] font-semibold">{data.olympic_count.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-[8px] tracking-widest uppercase mb-1" style={{ opacity: 0.25 }}>
            PARA-SYN
          </div>
          <div className="text-[17px] font-semibold">{data.paralympic_count.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-[8px] tracking-widest uppercase mb-1" style={{ opacity: 0.25 }}>
            NODES
          </div>
          <div className="text-[17px] font-semibold">{data.cluster_size.toLocaleString()}</div>
        </div>
      </div>

      {/* Time span */}
      <div className="text-[9px] tracking-widest" style={{ opacity: 0.18 }}>
        ARCHIVE: {data.synthetic_archive_id}
      </div>

      {/* Sport compatibility tags */}
      <div className="mt-auto">
        <div className="text-[8px] tracking-widest uppercase mb-2" style={{ opacity: 0.18 }}>
          SPORT PATHWAYS
        </div>
        <div className="flex flex-wrap gap-1">
          {sports.map((s) => (
            <span
              key={s}
              className="text-[9px] border px-2 py-0.5"
              style={{ borderColor: 'rgba(255,255,255,0.08)', opacity: 0.38 }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {onShare && (
        <button
          onClick={onShare}
          className="text-[8px] tracking-widest uppercase cursor-pointer transition-opacity hover:opacity-60 text-left"
          style={{ opacity: 0.22 }}
        >
          ↗ EXPORT DEBRIEF CARD
        </button>
      )}
      <p className="text-[8px] tracking-widest uppercase leading-relaxed" style={{ opacity: 0.2 }}>
        {data.ethics_note}
      </p>
    </div>
  )
}
