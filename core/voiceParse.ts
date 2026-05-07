import type { Habit } from '@/types/neurix'

export type VoiceParseResult = {
  height: number | null
  weight: number | null
  age: number | null
  habits: Habit[]
  confirmation_message: string
}

const HABITS: Habit[] = [
  'strength',
  'running',
  'swimming',
  'team_sports',
  'martial_arts',
  'gymnastics',
  'racket',
  'wheelchair_sport',
  'para_athletics',
]

const HABIT_PATTERNS: Record<Habit, RegExp[]> = {
  strength: [/\b(strength|lift|lifting|weights?|weight training|gym|powerlifting|crossfit)\b/],
  running: [/\b(run|running|runner|jogging|track|marathon|distance)\b/],
  swimming: [/\b(swim|swimming|swimmer)\b/],
  team_sports: [/\b(team sports?|basketball|soccer|football|volleyball|baseball|softball|rugby|hockey)\b/],
  martial_arts: [/\b(martial arts?|boxing|wrestling|judo|karate|taekwondo|mma|grappling)\b/],
  gymnastics: [/\b(gymnastics|gymnast|tumbling)\b/],
  racket: [/\b(racket|racquet|tennis|badminton|pickleball|squash)\b/],
  wheelchair_sport: [/\b(wheelchair sports?|wheelchair basketball|wheelchair racing|chair racing)\b/],
  para_athletics: [/\b(para athletics?|adaptive sport|adaptive athletics|parasport|para sport)\b/],
}

const labelHabit = (habit: Habit) =>
  habit
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const clamp = (value: number | null, min: number, max: number) => {
  if (value === null || !Number.isFinite(value)) return null
  return Math.min(Math.max(Math.round(value), min), max)
}

const matchNumber = (text: string, patterns: RegExp[]) => {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[1]) return Number(match[1])
  }
  return null
}

const parseHeight = (text: string) => {
  const cm = matchNumber(text, [
    /\b(\d{2,3})\s*(?:cm|centimeters?|centimetres?)\b/,
    /\b(?:height|tall)\D{0,12}(\d{2,3})\b/,
  ])
  if (cm !== null) return clamp(cm, 100, 220)

  const feetMatch =
    text.match(/\b(\d)\s*(?:ft|feet|foot|')\s*(\d{1,2})?\s*(?:in|inches?|")?\b/) ??
    text.match(/\b(\d)\s*'\s*(\d{1,2})\b/)

  if (!feetMatch) return null

  const feet = Number(feetMatch[1])
  const inches = Number(feetMatch[2] ?? 0)
  if (!Number.isFinite(feet) || !Number.isFinite(inches)) return null
  return clamp((feet * 12 + inches) * 2.54, 100, 220)
}

const parseWeight = (text: string) => {
  const kg = matchNumber(text, [
    /\b(\d{2,3})\s*(?:kg|kgs|kilograms?|kilos?)\b/,
    /\b(?:weigh|weight)\D{0,12}(\d{2,3})\b/,
  ])
  if (kg !== null) return clamp(kg, 30, 200)

  const pounds = matchNumber(text, [/\b(\d{2,3})\s*(?:lb|lbs|pounds?)\b/])
  if (pounds !== null) return clamp(pounds * 0.453592, 30, 200)

  return null
}

const parseAge = (text: string) => {
  const age = matchNumber(text, [
    /\b(?:age|aged)\D{0,8}(\d{1,2})\b/,
    /\b(\d{1,2})\s*(?:years?|yrs?)\s*old\b/,
    /\b(?:i am|i'm|im)\s*(\d{1,2})\b/,
  ])

  return clamp(age, 10, 90)
}

export const normalizeHabits = (value: unknown): Habit[] => {
  if (!Array.isArray(value)) return []
  return Array.from(new Set(value.filter((habit): habit is Habit => HABITS.includes(habit as Habit))))
}

const parseHabits = (text: string) =>
  HABITS.filter((habit) => HABIT_PATTERNS[habit].some((pattern) => pattern.test(text)))

export const buildVoiceConfirmation = (data: Omit<VoiceParseResult, 'confirmation_message'>) => {
  const parts = [
    data.height !== null ? `${data.height}cm` : null,
    data.weight !== null ? `${data.weight}kg` : null,
    data.age !== null ? `age ${data.age}` : null,
    data.habits.length ? data.habits.map(labelHabit).join(', ') : null,
  ].filter(Boolean)

  if (!parts.length) {
    return 'I could not find biometric details. You can enter them manually below.'
  }

  return `Got it - ${parts.join(', ')}.`
}

export function parseVoiceTranscript(transcript: string): VoiceParseResult {
  const text = transcript.toLowerCase().replace(/[.,;:]/g, ' ')
  const parsed = {
    height: parseHeight(text),
    weight: parseWeight(text),
    age: parseAge(text),
    habits: parseHabits(text),
  }

  return {
    ...parsed,
    confirmation_message: buildVoiceConfirmation(parsed),
  }
}

export function normalizeVoiceParseResult(value: unknown): VoiceParseResult {
  const data = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const parsed = {
    height: clamp(typeof data.height === 'number' ? data.height : null, 100, 220),
    weight: clamp(typeof data.weight === 'number' ? data.weight : null, 30, 200),
    age: clamp(typeof data.age === 'number' ? data.age : null, 10, 90),
    habits: normalizeHabits(data.habits),
  }

  return {
    ...parsed,
    confirmation_message:
      typeof data.confirmation_message === 'string' && data.confirmation_message.trim()
        ? data.confirmation_message.trim()
        : buildVoiceConfirmation(parsed),
  }
}

export function mergeVoiceParseResults(primary: VoiceParseResult, fallback: VoiceParseResult): VoiceParseResult {
  const parsed = {
    height: primary.height ?? fallback.height,
    weight: primary.weight ?? fallback.weight,
    age: primary.age ?? fallback.age,
    habits: Array.from(new Set([...primary.habits, ...fallback.habits])),
  }

  return {
    ...parsed,
    confirmation_message: buildVoiceConfirmation(parsed),
  }
}
