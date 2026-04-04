export interface EraInfo {
  label: string
  context: string
  archetypes: string[]
}

export const eraData: Record<string, EraInfo> = {
  '1932': {
    label: '1932 · Los Angeles',
    context:
      'Power archetypes dominated early Team USA strength events. Paralympic competition had not yet begun — these athletes set the foundation.',
    archetypes: ['Power', 'Technical'],
  },
  '1968': {
    label: '1968 · Mexico City',
    context:
      'The first Paralympic Games in the Americas. Power and hybrid profiles expanded significantly across both programs.',
    archetypes: ['Power', 'Hybrid'],
  },
  '1996': {
    label: '1996 · Atlanta',
    context:
      'Atlanta marked a turning point — Paralympic integration grew, and strength-dominant profiles appeared across a wider range of disciplines.',
    archetypes: ['Power', 'Endurance', 'Hybrid'],
  },
  LA28: {
    label: 'LA28 · Los Angeles',
    context:
      'Home games. Team USA is building toward its broadest representation across Olympic and Paralympic disciplines in history.',
    archetypes: ['All'],
  },
}

export const eraKeys = ['1932', '1968', '1996', 'LA28'] as const
export type EraKey = (typeof eraKeys)[number]
