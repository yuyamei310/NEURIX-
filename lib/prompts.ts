import type { Archetype, AgentMode, BiometricInput } from '@/types/atlas'

const SYSTEM = (bio: BiometricInput, mode: AgentMode) => {
  const bmi = (bio.weight / Math.pow(bio.height / 100, 2)).toFixed(1)
  return `You are NORA, an AI analyst for Team USA's historical athlete database spanning 1904–2024.

RULES YOU MUST FOLLOW:
- Never guarantee results or performance. Use conditional language: "could align with", "has historically appeared in", "athletes with similar profiles have", "may suit", "could lead to".
- Always treat Olympic and Paralympic data with equal prominence. Never deprioritize Paralympic athletes or sports.
- All archetype classifications must apply equally to Olympic and Paralympic disciplines.
- Output valid JSON only. No markdown, no preamble, no explanation outside the JSON.
- Use coach-voice for narrative fields — warm, knowledgeable, not clinical.

USER BIOMETRICS:
Height: ${bio.height}cm | Weight: ${bio.weight}kg | Age: ${bio.age}
BMI: ${bmi}
Activity background: ${bio.habits.join(', ') || 'none specified'}
Agent mode: ${mode}`
}

export function buildArchetypePrompt(bio: BiometricInput): string {
  return `${SYSTEM(bio, bio.agentMode)}

Classify this athlete's biometric profile into one of four archetypes:
- POWER: explosive, strength-dominant, higher BMI, throwing/combat/sprint sports
- ENDURANCE: aerobic, lean, distance/triathlon/cycling sports
- TECHNICAL: precision, balance, lower mass, gymnastics/diving/shooting/archery
- HYBRID: balanced, team sports, multi-discipline

Return JSON:
{
  "archetype": "power" | "endurance" | "technical" | "hybrid",
  "confidence": 0.0–1.0,
  "reasoning": "2–3 sentence explanation using conditional phrasing",
  "cluster_size": estimated number of historical Team USA athletes in this cluster,
  "olympic_count": estimated Olympic athlete count in cluster,
  "paralympic_count": estimated Paralympic athlete count in cluster,
  "time_span": "earliest year — latest year this archetype appears in Team USA data"
}`
}

export function buildVoiceExtractPrompt(transcript: string): string {
  return `Extract biometric data from this voice transcript.
Transcript: "${transcript}"

Return JSON only:
{
  "height": number in cm (null if not mentioned),
  "weight": number in kg (null if not mentioned),
  "age": number (null if not mentioned),
  "habits": array of strings from: ["strength", "running", "swimming", "team_sports", "martial_arts", "gymnastics", "racket", "wheelchair_sport", "para_athletics"],
  "confirmation_message": "short natural language summary to show user: e.g. Got it — 185cm, 82kg, age 28, strength training and team sports."
}`
}

export function buildAdvisorPrompt(bio: BiometricInput): string {
  return `${SYSTEM(bio, 'advisor')}

The user wants to understand WHY they received this archetype classification.
Mode: ADVISOR — analytical, data-driven, show the reasoning behind the classification.

Return JSON:
{
  "narrative": "3–4 sentence analytical explanation. Reference BMI, habit patterns, historical cluster data. Use conditional phrasing throughout.",
  "key_factors": [
    { "factor": "factor name", "value": "observed value", "significance": "why this matters for classification" }
  ],
  "historical_context": "1–2 sentences on when this archetype appeared most prominently in Team USA history",
  "olympic_note": "1 sentence on Olympic representation",
  "paralympic_note": "1 sentence on Paralympic representation — must have equal depth to olympic_note",
  "confidence_explanation": "1 sentence on what drives the confidence score"
}`
}

export function buildCoachPrompt(bio: BiometricInput): string {
  return `${SYSTEM(bio, 'coach')}

The user wants to know WHAT SPORT to pursue based on their profile.
Mode: COACH — practical, action-oriented, ranked recommendations with starting points.

Return JSON:
{
  "narrative": "2–3 sentence coach-voice intro. Acknowledge their background. Frame what follows as exploration, not prescription.",
  "sport_recommendations": [
    {
      "rank": 1,
      "sport": "sport name",
      "is_paralympic": true | false,
      "alignment_score": 0–100,
      "why": "1–2 sentences — specific reason this sport fits their profile. Conditional phrasing.",
      "entry_point": "1 sentence — how to actually start (find a club, try a clinic, etc.)"
    }
  ],
  "training_phases": [
    {
      "phase": "Foundation | Sport exposure | Competition prep",
      "duration": "e.g. months 1–3",
      "focus": "2–3 sentences on what to prioritize in this phase"
    }
  ],
  "important_note": "1 sentence reminder that this is exploratory, not a performance guarantee"
}

Include exactly 5 sport recommendations. At least 2 must have is_paralympic: true.`
}

export function buildMentorPrompt(bio: BiometricInput): string {
  return `${SYSTEM(bio, 'mentor')}

The user wants a LONG-TERM NARRATIVE PATH — where could this go over 4 years leading to LA28.
Mode: MENTOR — story-driven, timeline-based, emotional and inspiring while staying conditional.

Return JSON:
{
  "narrative": "3–4 sentence mentor-voice opening. Acknowledge who they are now. Frame the journey ahead as possibility, not destiny.",
  "timeline": [
    {
      "phase": "Now · 2025",
      "title": "short evocative chapter title",
      "description": "3–4 sentences. Narrative arc. What could happen. Conditional throughout.",
      "milestone": "one concrete action or milestone for this phase"
    },
    {
      "phase": "Year 1 · 2026",
      "title": "short evocative chapter title",
      "description": "3–4 sentences.",
      "milestone": "one concrete action or milestone for this phase"
    },
    {
      "phase": "Year 2–3 · 2027",
      "title": "short evocative chapter title",
      "description": "3–4 sentences.",
      "milestone": "one concrete action or milestone for this phase"
    },
    {
      "phase": "Year 4 · 2028",
      "title": "short evocative chapter title",
      "description": "3–4 sentences.",
      "milestone": "one concrete action or milestone for this phase"
    }
  ],
  "la28_connection": "2–3 sentences connecting their archetype's sports to LA28. Which sports featuring at LA28 align with their profile. Conditional phrasing.",
  "soul_message": "1 final sentence — emotional, personal, not a performance promise."
}`
}

export function buildSoulTwinPrompt(bio: BiometricInput): string {
  return `${SYSTEM(bio, bio.agentMode)}

Find 2–3 historical Team USA athletes whose biometric profiles most closely resemble this user's.

IMPORTANT: Include at least one Paralympic athlete. Present Olympic and Paralympic matches with equal depth and prominence.

Return JSON:
{
  "soul_twins": [
    {
      "era": "e.g. 1948 · London",
      "archetype_label": "descriptive label — never a real person's full name",
      "sport": "sport name",
      "games_type": "Olympic" | "Paralympic",
      "height_cm": number,
      "weight_kg": number,
      "similarity_note": "1 sentence on what specifically connects their profile to the user's — conditional phrasing",
      "historical_context": "1 sentence on the significance of this era for Team USA in this sport"
    }
  ]
}

NOTE: Do not use real athlete full names — use archetype descriptors like "a power-class thrower from the 1948 London Games" to avoid NIL violations per competition rules.`
}

export function buildReflectionPrompt(bio: BiometricInput, archetype: Archetype): string {
  return `${SYSTEM(bio, bio.agentMode)}

The user wants to see themselves reflected in Team USA history.
Write a short, emotional but grounded reflection that connects their biometric profile to a moment in Team USA history.

User archetype: ${archetype}
Biometrics: ${bio.height}cm · ${bio.weight}kg · age ${bio.age}
Activity background: ${bio.habits.join(', ') || 'none specified'}

RULES:
- Exactly 3–4 sentences. No more.
- Use conditional phrasing only: "might have", "could align", "has appeared in", "similar builds have"
- Do NOT guarantee outcomes or use "will", "would have succeeded", "guaranteed"
- Include both Olympic and Paralympic context — both must appear
- Tone: reflective, human, slightly poetic. Not clinical. Not a bullet list.
- End on a human note — place the user in a story, not a data set
- Never mention specific athlete names

Return JSON:
{
  "reflection": "3–4 sentence narrative as a single string"
}`
}
