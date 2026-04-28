import { localClassify } from '@/core/classifier'
import type {
  AdvisorResult,
  Archetype,
  ArchetypeResult,
  BiometricInput,
  CoachResult,
  MentorResult,
  ReflectionResult,
  SoulTwin,
  SportRecommendation,
} from '@/types/atlas'

export const ETHICS_NOTE = 'No real athlete identity or record used'

export interface SyntheticArchiveProfile {
  id: string
  signalLabel: string
  basis: string
  timeSpan: string
  nodeCount: number
  olympicSignals: number
  paralympicSignals: number
  eraEchoes: SoulTwin[]
  sportPathways: SportRecommendation[]
  color: string
  secondaryColor: string
}

export const syntheticArchive: Record<Archetype, SyntheticArchiveProfile> = {
  power: {
    id: 'SYN-PWR-042',
    signalLabel: 'Explosive strength signal',
    basis: 'Synthetic power archive built from anonymized strength, leverage, and acceleration patterns.',
    timeSpan: '1904-inspired - LA28 scenario',
    nodeCount: 4240,
    olympicSignals: 2120,
    paralympicSignals: 2120,
    color: '#ff6b35',
    secondaryColor: '#ff0050',
    sportPathways: [
      { rank: 1, sport: 'Shot put', is_paralympic: false, alignment_score: 91, why: 'Your mass-to-height signal could align with explosive throw patterns in the synthetic archive.', entry_point: 'Start with a local throws clinic or strength coach assessment.' },
      { rank: 2, sport: 'Para powerlifting', is_paralympic: true, alignment_score: 87, why: 'The same power-dominant signal can map to bench-press-based strength pathways.', entry_point: 'Explore adaptive strength programs or USA Para Powerlifting resources.' },
      { rank: 3, sport: 'Wrestling', is_paralympic: false, alignment_score: 80, why: 'Compact force production and contact-sport habits may support combat-sport exploration.', entry_point: 'Try a beginner wrestling or grappling class for movement exposure.' },
      { rank: 4, sport: 'Discus', is_paralympic: false, alignment_score: 74, why: 'Rotational power appears as a secondary echo for this profile.', entry_point: 'Practice basic throws mechanics with supervised coaching.' },
      { rank: 5, sport: 'Para athletics throws', is_paralympic: true, alignment_score: 72, why: 'Adaptive throwing events preserve the same synthetic power signature.', entry_point: 'Look for a para athletics clinic or regional adaptive sport club.' },
    ],
    eraEchoes: [
      { era: '1932-inspired · Los Angeles', archetype_label: 'Anonymous power archive node', sport: 'Throws pattern', games_type: 'Olympic', height_cm: 182, weight_kg: 91, similarity_note: 'This anonymized node echoes force-first builds in a synthetic throws pattern.', historical_context: 'Historically inspired power events are represented here only as fictionalized archetype signals.' },
      { era: '1996-inspired · Atlanta', archetype_label: 'Anonymous adaptive strength node', sport: 'Para power pattern', games_type: 'Paralympic', height_cm: 176, weight_kg: 84, similarity_note: 'This node keeps the same strength signal while avoiding real athlete identity or record data.', historical_context: 'The archive models Paralympic parity through synthetic adaptive-strength pathways.' },
    ],
  },
  endurance: {
    id: 'SYN-END-118',
    signalLabel: 'Aerobic efficiency signal',
    basis: 'Synthetic endurance archive built from anonymized lean-mass, rhythm, and repeated-output patterns.',
    timeSpan: '1904-inspired - LA28 scenario',
    nodeCount: 3960,
    olympicSignals: 1980,
    paralympicSignals: 1980,
    color: '#00ff9d',
    secondaryColor: '#00e5ff',
    sportPathways: [
      { rank: 1, sport: 'Cycling', is_paralympic: false, alignment_score: 90, why: 'Your profile could align with repeated-output and aerobic rhythm patterns.', entry_point: 'Start with a bike-fit session and structured easy rides.' },
      { rank: 2, sport: 'Para cycling', is_paralympic: true, alignment_score: 86, why: 'The endurance signal can translate across adaptive equipment categories.', entry_point: 'Explore adaptive cycling clubs or introductory para cycling clinics.' },
      { rank: 3, sport: 'Distance running', is_paralympic: false, alignment_score: 82, why: 'Lower-mass aerobic patterns appear strongly in the synthetic archive.', entry_point: 'Begin with a run-walk plan and gait assessment.' },
      { rank: 4, sport: 'Para athletics racing', is_paralympic: true, alignment_score: 77, why: 'Sustained output remains the dominant signal in adaptive racing pathways.', entry_point: 'Contact a regional adaptive sports organization for racing exposure.' },
      { rank: 5, sport: 'Triathlon', is_paralympic: false, alignment_score: 70, why: 'Multi-discipline stamina appears as a secondary endurance echo.', entry_point: 'Try short swim-bike-run sessions before specializing.' },
    ],
    eraEchoes: [
      { era: '1984-inspired · Los Angeles', archetype_label: 'Anonymous aerobic archive node', sport: 'Distance pattern', games_type: 'Olympic', height_cm: 171, weight_kg: 62, similarity_note: 'This anonymized node echoes lean repeated-output profiles.', historical_context: 'The era signal is fictionalized to describe sport-pattern history without real records.' },
      { era: '2012-inspired · London', archetype_label: 'Anonymous adaptive racing node', sport: 'Wheelchair racing pattern', games_type: 'Paralympic', height_cm: 169, weight_kg: 61, similarity_note: 'This node reflects endurance logic across a synthetic Paralympic pathway.', historical_context: 'Paralympic representation is modeled as equal-depth synthetic archive data.' },
    ],
  },
  technical: {
    id: 'SYN-TEC-073',
    signalLabel: 'Precision control signal',
    basis: 'Synthetic technical archive built from anonymized balance, timing, accuracy, and controlled-output patterns.',
    timeSpan: '1904-inspired - LA28 scenario',
    nodeCount: 3410,
    olympicSignals: 1705,
    paralympicSignals: 1705,
    color: '#b400ff',
    secondaryColor: '#00e5ff',
    sportPathways: [
      { rank: 1, sport: 'Archery', is_paralympic: false, alignment_score: 89, why: 'Your signal could align with precision-first control patterns.', entry_point: 'Book an introductory range session with safety instruction.' },
      { rank: 2, sport: 'Para archery', is_paralympic: true, alignment_score: 86, why: 'The same control and repeatability pattern maps cleanly to adaptive precision sport.', entry_point: 'Explore adaptive archery programs or local para sport clinics.' },
      { rank: 3, sport: 'Diving', is_paralympic: false, alignment_score: 78, why: 'Timing, balance, and body control appear as secondary echoes.', entry_point: 'Start with dryland mobility and beginner diving instruction.' },
      { rank: 4, sport: 'Shooting sport', is_paralympic: false, alignment_score: 75, why: 'Stillness and repeatable aim match the technical archive signal.', entry_point: 'Find a certified beginner safety course.' },
      { rank: 5, sport: 'Para shooting', is_paralympic: true, alignment_score: 73, why: 'Adaptive precision pathways preserve the same synthetic control signature.', entry_point: 'Contact an adaptive shooting or para sport organization.' },
    ],
    eraEchoes: [
      { era: '2004-inspired · Athens', archetype_label: 'Anonymous precision archive node', sport: 'Archery pattern', games_type: 'Olympic', height_cm: 168, weight_kg: 63, similarity_note: 'This anonymized node echoes controlled technical profiles.', historical_context: 'The archive uses fictionalized era signals rather than real athlete records.' },
      { era: '2004-inspired · Athens', archetype_label: 'Anonymous adaptive precision node', sport: 'Para archery pattern', games_type: 'Paralympic', height_cm: 166, weight_kg: 61, similarity_note: 'This node keeps precision parity across adaptive sport pathways.', historical_context: 'Paralympic context is represented as synthetic pattern data with equal prominence.' },
    ],
  },
  hybrid: {
    id: 'SYN-HYB-206',
    signalLabel: 'Multi-role adaptability signal',
    basis: 'Synthetic hybrid archive built from anonymized mixed-strength, agility, coordination, and team-sport patterns.',
    timeSpan: '1904-inspired - LA28 scenario',
    nodeCount: 5120,
    olympicSignals: 2560,
    paralympicSignals: 2560,
    color: '#00e5ff',
    secondaryColor: '#ffffff',
    sportPathways: [
      { rank: 1, sport: 'Basketball', is_paralympic: false, alignment_score: 88, why: 'Your balanced signal could align with multi-role court movement and team-sport habits.', entry_point: 'Join a recreational league or skills clinic to test court roles.' },
      { rank: 2, sport: 'Wheelchair basketball', is_paralympic: true, alignment_score: 85, why: 'The synthetic archive maps the same tactical adaptability into a Paralympic team pathway.', entry_point: 'Find an adaptive sport program with beginner chair-skills sessions.' },
      { rank: 3, sport: 'Volleyball', is_paralympic: false, alignment_score: 80, why: 'Jump timing, lateral movement, and team reads appear as strong secondary echoes.', entry_point: 'Try open gym volleyball or a fundamentals clinic.' },
      { rank: 4, sport: 'Sitting volleyball', is_paralympic: true, alignment_score: 78, why: 'Hybrid coordination and quick decision-making translate into this adaptive team format.', entry_point: 'Look for sitting volleyball demos through local adaptive sport groups.' },
      { rank: 5, sport: 'Soccer', is_paralympic: false, alignment_score: 74, why: 'Endurance plus agility creates a useful secondary field-sport signal.', entry_point: 'Start with small-sided games to test repeated movement demands.' },
    ],
    eraEchoes: [
      { era: '1996-inspired · Atlanta', archetype_label: 'Anonymous team-sport archive node', sport: 'Basketball pattern', games_type: 'Olympic', height_cm: 178, weight_kg: 76, similarity_note: 'This anonymized node echoes adaptable team-sport builds.', historical_context: 'The era is historically inspired but all profile details are synthetic.' },
      { era: '2016-inspired · Rio', archetype_label: 'Anonymous adaptive team node', sport: 'Sitting volleyball pattern', games_type: 'Paralympic', height_cm: 174, weight_kg: 73, similarity_note: 'This node reflects tactical balance without exposing any real athlete record.', historical_context: 'Paralympic parity is modeled through synthetic adaptive team-sport echoes.' },
    ],
  },
}

export function getSyntheticArchiveProfile(archetype: Archetype): SyntheticArchiveProfile {
  return syntheticArchive[archetype]
}

export function enrichArchetypeResult(result: Partial<ArchetypeResult>, fallbackArchetype: Archetype): ArchetypeResult {
  const archetype = result.archetype ?? fallbackArchetype
  const profile = getSyntheticArchiveProfile(archetype)
  return {
    archetype,
    confidence: result.confidence ?? 0.72,
    reasoning: result.reasoning ?? `This profile could align with the ${archetype} signal in NEURIX's synthetic archive. The classification is an anonymized pattern read, not a real athlete comparison.`,
    cluster_size: result.cluster_size ?? profile.nodeCount,
    olympic_count: result.olympic_count ?? profile.olympicSignals,
    paralympic_count: result.paralympic_count ?? profile.paralympicSignals,
    time_span: result.time_span ?? profile.timeSpan,
    synthetic_archive_id: result.synthetic_archive_id ?? profile.id,
    archive_basis: result.archive_basis ?? profile.basis,
    ethics_note: result.ethics_note ?? ETHICS_NOTE,
    signal_label: result.signal_label ?? profile.signalLabel,
    demo_fallback: result.demo_fallback,
  }
}

export function buildDemoFallbackAnalysis(bio: BiometricInput) {
  const local = localClassify(bio.height, bio.weight, bio.age, bio.habits)
  const profile = getSyntheticArchiveProfile(local.archetype)
  const bmi = bio.weight / Math.pow(bio.height / 100, 2)
  const habits = bio.habits.length ? bio.habits.join(', ') : 'no selected activity background'

  const archetype: ArchetypeResult = enrichArchetypeResult({
    archetype: local.archetype,
    confidence: local.confidence,
    reasoning: `Your ${bmi.toFixed(1)} BMI, ${bio.height}cm frame, and ${habits} input could align with NEURIX's ${profile.signalLabel.toLowerCase()}. This is a synthetic archive pattern, not a match to a real athlete.`,
    demo_fallback: true,
  }, local.archetype)

  const advisor: AdvisorResult = {
    narrative: `NEURIX reads your profile as a ${local.archetype} signal inside a synthetic Team USA-inspired archive. The strongest indicators are your body composition, activity background, and the way those inputs could map to ${profile.signalLabel.toLowerCase()}. This debrief avoids real athlete records and treats Olympic and Paralympic pathways as equal synthetic pattern categories.`,
    key_factors: [
      { factor: 'Body signal', value: `${bio.height}cm / ${bio.weight}kg`, significance: 'Provides the baseline shape for anonymized archetype comparison.' },
      { factor: 'Activity vector', value: habits, significance: 'Adds behavioral context without using any personal or real athlete record.' },
      { factor: 'Archive basis', value: profile.id, significance: 'Locks the result to a fixed synthetic archive profile for demo reliability.' },
    ],
    historical_context: `${profile.id} is a historically inspired synthetic pattern, designed for narrative context without real athlete identity or record data.`,
    olympic_note: 'Olympic pathways are represented as anonymized pattern signals, not athlete records.',
    paralympic_note: 'Paralympic pathways are represented with equal depth as anonymized pattern signals.',
    confidence_explanation: `Signal confidence is ${Math.round(local.confidence * 100)}% because multiple inputs point toward the same synthetic archetype.`,
    ethics_note: ETHICS_NOTE,
    demo_fallback: true,
  }

  const coach: CoachResult = {
    narrative: `As a coach lens, this result is best treated as an exploration map. Your ${profile.signalLabel.toLowerCase()} could make these pathways worth testing through low-risk clinics, clubs, and beginner sessions.`,
    sport_recommendations: profile.sportPathways,
    training_phases: [
      { phase: 'Foundation', duration: 'Weeks 1-4', focus: 'Build movement quality, basic conditioning, and safe strength habits while testing whether the pathway feels energizing.' },
      { phase: 'Sport exposure', duration: 'Months 2-3', focus: 'Try two recommended sport formats, including one Olympic pathway and one Paralympic pathway when relevant.' },
      { phase: 'Skill signal', duration: 'Months 4-6', focus: 'Track which environment produces the clearest technical, physical, and motivational fit.' },
    ],
    important_note: 'This is an exploratory protocol from synthetic patterns, not a prediction of performance.',
    ethics_note: ETHICS_NOTE,
    demo_fallback: true,
  }

  const mentor: MentorResult = {
    narrative: `The mentor lens frames this as possibility, not destiny. Your ${profile.signalLabel.toLowerCase()} could become a story of testing, choosing, and refining a pathway with care.`,
    timeline: [
      { phase: 'Now · 2026', title: 'Signal Check', description: 'Start by learning what your body enjoys under real movement, not by chasing a label. The archive gives a direction, but your lived response should lead.', milestone: 'Try one recommended sport session.' },
      { phase: 'Year 1 · 2027', title: 'Pattern Into Practice', description: 'If a pathway keeps feeling right, build a weekly rhythm around it. The goal is consistency, feedback, and safe progression.', milestone: 'Join a club or beginner program.' },
      { phase: 'Year 2-3 · 2028', title: 'Choose The Arena', description: 'A clear sport identity could emerge through repetition and coaching. Olympic and Paralympic pathways remain equal in the system narrative.', milestone: 'Complete a local event or skills evaluation.' },
      { phase: 'LA28 Horizon', title: 'Home-Stage Imagination', description: 'LA28 becomes a symbolic target for commitment rather than a guaranteed destination. The point is to move from curiosity to a chosen practice.', milestone: 'Define a personal four-year training story.' },
    ],
    la28_connection: 'LA28 is used here as a narrative horizon for Team USA-inspired sport possibility. NEURIX does not claim eligibility, selection, or real athlete comparison.',
    soul_message: 'Your profile belongs in motion before it belongs in a verdict.',
    ethics_note: ETHICS_NOTE,
    demo_fallback: true,
  }

  const reflection: ReflectionResult = {
    reflection: `Your profile could sit inside a synthetic archive echo where Olympic and Paralympic pathways share the same dignity. Similar anonymized patterns might point toward ${profile.sportPathways[0].sport} or ${profile.sportPathways[1].sport}, but the result remains a story prompt rather than a prediction. NEURIX keeps the human meaning while removing real athlete identity from the comparison.`,
    ethics_note: ETHICS_NOTE,
    demo_fallback: true,
  }

  return {
    archetype,
    advisor,
    coach,
    mentor,
    reflection,
    soul_twins: profile.eraEchoes,
  }
}
