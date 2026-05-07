export type Archetype = 'power' | 'endurance' | 'technical' | 'hybrid'

export type AgentMode = 'advisor' | 'coach' | 'mentor'

export type Habit =
  | 'strength'
  | 'running'
  | 'swimming'
  | 'team_sports'
  | 'martial_arts'
  | 'gymnastics'
  | 'racket'
  | 'wheelchair_sport'
  | 'para_athletics'

export interface BiometricInput {
  height: number // cm
  weight: number // kg
  age: number
  habits: Habit[]
  agentMode: AgentMode
}

export interface LocalClassification {
  archetype: Archetype
  confidence: number
}

export interface ArchetypeResult {
  archetype: Archetype
  confidence: number
  reasoning: string
  cluster_size: number
  olympic_count: number
  paralympic_count: number
  time_span: string
  synthetic_archive_id: string
  archive_basis: string
  ethics_note: string
  signal_label: string
  demo_fallback?: boolean
}

export interface SoulTwin {
  era: string
  archetype_label: string
  sport: string
  games_type: 'Olympic' | 'Paralympic'
  height_cm: number
  weight_kg: number
  similarity_note: string
  historical_context: string
}

export interface SportRecommendation {
  rank: number
  sport: string
  is_paralympic: boolean
  alignment_score: number
  why: string
  entry_point: string
}

export interface TrainingPhase {
  phase: string
  duration: string
  focus: string
}

export interface AdvisorResult {
  narrative: string
  key_factors: { factor: string; value: string; significance: string }[]
  historical_context: string
  olympic_note: string
  paralympic_note: string
  confidence_explanation: string
  ethics_note?: string
  demo_fallback?: boolean
}

export interface CoachResult {
  narrative: string
  sport_recommendations: SportRecommendation[]
  training_phases: TrainingPhase[]
  important_note: string
  ethics_note?: string
  demo_fallback?: boolean
}

export interface MentorTimeline {
  phase: string
  title: string
  description: string
  milestone: string
}

export interface MentorResult {
  narrative: string
  timeline: MentorTimeline[]
  la28_connection: string
  soul_message: string
  ethics_note?: string
  demo_fallback?: boolean
}

export interface ReflectionResult {
  reflection: string
  ethics_note?: string
  demo_fallback?: boolean
}

export interface UserProfile {
  height: number
  weight: number
  archetype: Archetype
  lastUpdated: string  // ISO timestamp
}

export interface NeurixResult {
  archetype: ArchetypeResult
  soul_twins: SoulTwin[]
  reflection: ReflectionResult
  advisor: AdvisorResult
  coach?: CoachResult
  mentor?: MentorResult
}
