import type { Archetype, Habit, LocalClassification } from '@/types/atlas'

export function localClassify(
  height: number,
  weight: number,
  age: number,
  habits: Habit[]
): LocalClassification {
  const bmi = weight / Math.pow(height / 100, 2)
  const hasStrength = habits.includes('strength')
  const hasEndurance = habits.includes('running') || habits.includes('swimming')
  const hasTeam = habits.includes('team_sports')
  const hasMartial = habits.includes('martial_arts')
  const hasGymnastics = habits.includes('gymnastics')
  const hasRacket = habits.includes('racket')
  const hasWheelchair = habits.includes('wheelchair_sport')
  const hasPara = habits.includes('para_athletics')

  // Para sport inputs map to archetypes normally — same logic
  const effectiveEndurance = hasEndurance || hasPara
  const effectiveStrength = hasStrength || hasMartial

  // Power: high BMI + strength background
  if (bmi > 24 && effectiveStrength && !effectiveEndurance) {
    return { archetype: 'power', confidence: 0.85 }
  }

  // Power with wheelchair power sports
  if (hasWheelchair && effectiveStrength && bmi > 22) {
    return { archetype: 'power', confidence: 0.80 }
  }

  // Endurance: lower BMI + cardio background
  if (bmi < 22 && effectiveEndurance && !effectiveStrength) {
    return { archetype: 'endurance', confidence: 0.82 }
  }

  // Endurance: para athletics leans endurance
  if (hasPara && bmi < 23 && !effectiveStrength) {
    return { archetype: 'endurance', confidence: 0.78 }
  }

  // Technical: lower weight, precision sports
  if (bmi < 21 && (hasGymnastics || hasRacket)) {
    return { archetype: 'technical', confidence: 0.79 }
  }

  // Technical: older age with precision sports
  if (age > 30 && (hasGymnastics || hasRacket) && !effectiveStrength) {
    return { archetype: 'technical', confidence: 0.72 }
  }

  // Hybrid: team sports or mixed signals
  if (hasTeam) {
    return { archetype: 'hybrid', confidence: 0.70 }
  }

  // Hybrid: everything else
  return { archetype: 'hybrid', confidence: 0.65 }
}

export function archetypeBadgeLabel(archetype: Archetype): string {
  const labels: Record<Archetype, string> = {
    power: 'POWERHOUSE',
    endurance: 'AEROBIC',
    technical: 'TECHNICAL',
    hybrid: 'HYBRID',
  }
  return labels[archetype]
}
