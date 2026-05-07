import archiveData from '@/data/processed/team-usa-archetype-clusters.json'
import type { Archetype } from '@/types/neurix'

export interface PublicArchiveCluster {
  archetype: Archetype
  archive_id: string
  basis: string
  count: number
  olympic_count: number
  paralympic_count: number
  time_span: string
  average_height_cm: number | null
  average_weight_kg: number | null
  average_age: number | null
  eras: { value: string; count: number }[]
  sports: { value: string; count: number }[]
  hometown_regions: { value: string; count: number }[]
}

interface PublicArchiveData {
  source_type: string
  us_filtered_count: number
  clusters: PublicArchiveCluster[]
}

const publicArchive = archiveData as PublicArchiveData

export function hasPublicArchiveData(): boolean {
  return publicArchive.source_type === 'public_aggregate' && publicArchive.clusters.length > 0
}

export function getPublicArchiveCluster(archetype: Archetype): PublicArchiveCluster | null {
  if (!hasPublicArchiveData()) return null
  return publicArchive.clusters.find((cluster) => cluster.archetype === archetype) ?? null
}

export function getPublicArchiveMetadata() {
  return {
    sourceType: publicArchive.source_type,
    usFilteredCount: publicArchive.us_filtered_count,
    clusterCount: publicArchive.clusters.length,
    hasData: hasPublicArchiveData(),
  }
}

export function buildPublicArchivePromptContext(archetype?: Archetype): string {
  if (!hasPublicArchiveData()) {
    return 'PUBLIC ARCHIVE CONTEXT: No generated public aggregate archive is bundled. Use the synthetic fallback archive and clearly label it as synthetic.'
  }

  const clusters = archetype
    ? publicArchive.clusters.filter((cluster) => cluster.archetype === archetype)
    : publicArchive.clusters

  const summary = clusters
    .map((cluster) => {
      const sports = cluster.sports.map((sport) => sport.value).join(', ') || 'not enough public rows'
      return `${cluster.archetype}: ${cluster.count} anonymous Team USA-scope rows, ${cluster.olympic_count} Olympic-scope, ${cluster.paralympic_count} Paralympic-scope, span ${cluster.time_span}, top sports: ${sports}`
    })
    .join('\n')

  return `PUBLIC ARCHIVE CONTEXT:
Generated anonymous Team USA-scope aggregate archive is available.
Total US-filtered rows: ${publicArchive.us_filtered_count}
${summary}
Do not mention athlete names, exact records, finish times, or identifying details.`
}
