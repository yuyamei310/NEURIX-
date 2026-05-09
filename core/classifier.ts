import type { Archetype, Habit, LocalClassification } from '@/types/neurix'

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

  const scores: Record<Archetype, number> = {
    power: 0.18,
    endurance: 0.18,
    technical: 0.18,
    hybrid: 0.24,
  }

  const add = (archetype: Archetype, amount: number) => {
    scores[archetype] += amount
  }

  // Body signal. These broad ranges make manual height/weight/age changes visible
  // even before the user selects an activity background.
  if (bmi >= 28) add('power', 0.34)
  else if (bmi >= 25) add('power', 0.22)
  else if (bmi <= 19.5) add('endurance', 0.28)
  else if (bmi <= 21.5) add('endurance', 0.18)
  else add('hybrid', 0.12)

  if (weight >= 95) add('power', 0.24)
  else if (weight >= 82) add('power', 0.14)
  else if (weight <= 58) add('technical', 0.20)
  else if (weight <= 68) add('endurance', 0.12)

  if (height >= 190) add('hybrid', 0.18)
  else if (height >= 182) add('power', 0.10)
  else if (height <= 168) add('technical', 0.16)

  if (age >= 34) add('technical', 0.12)
  else if (age <= 22) add('endurance', 0.08)
  else add('hybrid', 0.06)

  // Activity signal still matters, but no longer hides all biometric variation.
  if (effectiveStrength) add('power', 0.36)
  if (effectiveEndurance) add('endurance', 0.36)
  if (hasTeam) add('hybrid', 0.34)
  if (hasGymnastics || hasRacket) add('technical', 0.34)
  if (hasWheelchair && effectiveStrength) add('power', 0.18)
  if (hasPara && !effectiveStrength) add('endurance', 0.12)

  const selectedHabits = habits.length
  if (selectedHabits >= 2) add('hybrid', 0.08)
  if (effectiveStrength && effectiveEndurance) add('hybrid', 0.16)

  const ranked = (Object.entries(scores) as [Archetype, number][])
    .sort((a, b) => b[1] - a[1])
  const [archetype, topScore] = ranked[0]
  const runnerUpScore = ranked[1][1]
  const margin = Math.max(0, topScore - runnerUpScore)
  const confidence = Math.min(0.9, Math.max(0.58, 0.62 + margin * 0.65))

  return { archetype, confidence: Number(confidence.toFixed(2)) }
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
