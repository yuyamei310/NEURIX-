import type { Archetype } from '@/types/atlas'
import type { SoulTwin } from '@/types/atlas'

export const paralympicFallback: Record<Archetype, SoulTwin> = {
  power: {
    era: '1996 · Atlanta',
    archetype_label: 'A strength-class powerlifter from the 1996 Atlanta Paralympic Games',
    sport: 'Paralympic Powerlifting',
    games_type: 'Paralympic',
    height_cm: 178,
    weight_kg: 82,
    similarity_note:
      "This athlete's strength-to-mass ratio could align closely with your power-dominant profile and training background.",
    historical_context:
      'Atlanta 1996 marked a pivotal expansion of Paralympic strength events, with Team USA fielding some of its strongest power-class athletes.',
  },
  endurance: {
    era: '2012 · London',
    archetype_label: 'A distance wheelchair racer from the 2012 London Paralympic Games',
    sport: 'Wheelchair Racing',
    games_type: 'Paralympic',
    height_cm: 172,
    weight_kg: 62,
    similarity_note:
      'Their aerobic output and lean build could mirror your endurance-oriented profile in ways that span different movement disciplines.',
    historical_context:
      'London 2012 saw wheelchair racing reach its highest global profile, with Team USA distance athletes setting multiple podium finishes.',
  },
  technical: {
    era: '2004 · Athens',
    archetype_label: 'A precision archer from the 2004 Athens Paralympic Games',
    sport: 'Paralympic Archery',
    games_type: 'Paralympic',
    height_cm: 168,
    weight_kg: 63,
    similarity_note:
      'Their technical precision and controlled movement profile could align with the discipline and focus your background suggests.',
    historical_context:
      'Athens 2004 elevated Paralympic archery as a showcase of technical mastery, with Team USA earning strong representation.',
  },
  hybrid: {
    era: '2016 · Rio',
    archetype_label: 'A sitting volleyball player from the 2016 Rio Paralympic Games',
    sport: 'Sitting Volleyball',
    games_type: 'Paralympic',
    height_cm: 175,
    weight_kg: 74,
    similarity_note:
      'Their mixed athleticism and team-oriented profile could reflect the hybrid adaptability that defines your biometric pattern.',
    historical_context:
      'Rio 2016 represented a breakthrough moment for Team USA sitting volleyball, combining raw athleticism with deep team cohesion.',
  },
}
