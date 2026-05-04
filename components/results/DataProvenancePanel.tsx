'use client'

import { getPublicArchiveCluster, getPublicArchiveMetadata } from '@/core/publicArchive'
import type { ArchetypeResult } from '@/types/atlas'

const ORANGE = '#FF8A4C'

interface DataProvenancePanelProps {
  archetype: ArchetypeResult
}

export function DataProvenancePanel({ archetype }: DataProvenancePanelProps) {
  const metadata = getPublicArchiveMetadata()
  const cluster = getPublicArchiveCluster(archetype.archetype)
  const responseUsesPublicArchive = archetype.synthetic_archive_id.startsWith('PUB-')
  const sourceLabel = responseUsesPublicArchive ? 'PUBLIC AGGREGATE' : 'SYNTHETIC FALLBACK'
  const activeCount = responseUsesPublicArchive ? archetype.cluster_size : cluster?.count ?? metadata.usFilteredCount

  const rows = [
    { label: 'Output source', value: sourceLabel },
    { label: 'Archive scope', value: metadata.hasData ? `${metadata.usFilteredCount} Team USA-scope aggregate rows` : 'Synthetic fallback active' },
    { label: 'Cluster visibility', value: `${metadata.clusterCount} anonymous archetype clusters` },
    { label: 'Active node count', value: activeCount ? activeCount.toLocaleString() : 'Synthetic nodes' },
  ]

  const checks = [
    'No athlete names in product output',
    'No records, scores, finish times, or likenesses',
    'Olympic and Paralympic pathways shown together',
    'Conditional guidance only; no performance prediction',
  ]

  return (
    <section
      className="grid grid-cols-1 gap-px bg-white/[0.035] border-b border-white/[0.04] xl:grid-cols-[minmax(0,1fr)_360px]"
      aria-label="Data provenance and ethics"
    >
      <div className="p-8" style={{ background: 'var(--bg)' }}>
        <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="font-mono text-[8px] tracking-widest uppercase text-white/25">{'// DATA PROVENANCE'}</div>
            <h2 className="mt-2 font-mono text-[22px] font-bold uppercase tracking-tight">Archive Evidence</h2>
          </div>
          <div
            className="self-start border px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.18em]"
            style={{
              borderColor: responseUsesPublicArchive ? `${ORANGE}66` : 'rgba(255,255,255,0.1)',
              color: responseUsesPublicArchive ? ORANGE : 'rgba(255,255,255,0.32)',
              background: responseUsesPublicArchive ? `${ORANGE}0f` : 'transparent',
            }}
          >
            {sourceLabel}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-white/[0.05] md:grid-cols-4">
          {rows.map((row) => (
            <div key={row.label} className="min-h-[86px] p-4" style={{ background: 'var(--bg)' }}>
              <div className="font-mono text-[8px] uppercase tracking-widest text-white/24">{row.label}</div>
              <div className="mt-3 font-mono text-[13px] leading-relaxed text-white/68">{row.value}</div>
            </div>
          ))}
        </div>

        <p className="mt-5 max-w-3xl text-[12px] leading-relaxed text-white/42">
          NEURIX treats the archive as aggregate pattern context. The debrief explains possible sport pathways from anonymous clusters and never identifies or compares the user to a real athlete.
        </p>
      </div>

      <div className="flex flex-col justify-center gap-4 p-8" style={{ background: 'var(--bg)' }}>
        <div className="font-mono text-[8px] tracking-widest uppercase text-white/25">{'// ETHICS LOCK'}</div>
        <div className="space-y-3">
          {checks.map((check) => (
            <div key={check} className="flex items-start gap-3">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: ORANGE, boxShadow: `0 0 10px ${ORANGE}88` }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] leading-relaxed text-white/52">{check}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
