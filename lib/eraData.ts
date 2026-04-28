export interface EraInfo {
  label: string
  context: string
  archetypes: string[]
}

export const eraData: Record<string, EraInfo> = {
  '1932': {
    label: '1932-inspired · Los Angeles',
    context:
      'A fictionalized early-era archive echo where strength and precision patterns are modeled without real athlete records.',
    archetypes: ['Power', 'Technical'],
  },
  '1968': {
    label: '1968-inspired · Mexico City',
    context:
      'A synthetic parity node that imagines Olympic and Paralympic-inspired power and hybrid pathways with equal prominence.',
    archetypes: ['Power', 'Hybrid'],
  },
  '1996': {
    label: '1996-inspired · Atlanta',
    context:
      'An anonymized archive echo for broad sport expansion, adaptive pathways, and mixed archetype signals.',
    archetypes: ['Power', 'Endurance', 'Hybrid'],
  },
  LA28: {
    label: 'LA28 horizon · Los Angeles',
    context:
      'A future-facing scenario node used for narrative possibility, not eligibility, selection, or real athlete prediction.',
    archetypes: ['All'],
  },
}

export const eraKeys = ['1932', '1968', '1996', 'LA28'] as const
export type EraKey = (typeof eraKeys)[number]
