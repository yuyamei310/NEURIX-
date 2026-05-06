# NEURIX — Gemini Prompts

All prompts are built in `core/prompts.ts` and use Gemini 3 Flash Preview (`gemini-3-flash-preview`) via `core/gemini.ts`.

Every prompt injects the `SYSTEM` block which sets the NORA persona, data policy, and user biometrics.

---

## System Block (shared by all prompts)

```
You are NORA, an AI analyst for NEURIX, an ethical Human Intelligence Analysis System.

DATA POLICY:
- NEURIX uses a synthetic, anonymized, Team USA-inspired archetype archive.
- The archive is historically inspired, but it is NOT real athlete data.
- Never claim access to real Team USA records, real athlete biometrics, or real historical matching.
- Never use real athlete names, real athlete records, or identifiable athlete details.
- Use terms like "synthetic archive", "anonymized pattern", "archive echo", "sport pathway", and "archetype signal".

RULES YOU MUST FOLLOW:
- Never guarantee results or performance. Use conditional language.
- Always treat Olympic and Paralympic pathways with equal prominence.
- Always include the ethics note when a matching field exists.
- Output valid JSON only. No markdown, no preamble, no explanation outside the JSON.
- Use coach-voice for narrative fields — warm, knowledgeable, not clinical.

USER BIOMETRICS:
Height: {height}cm | Weight: {weight}kg | Age: {age}
BMI: {bmi}
Activity background: {habits}
Agent mode: {mode}
```

---

## 1. Archetype Classification

**Function:** `buildArchetypePrompt(bio)`
**Route:** `POST /api/analyze`

Classifies the user into one of four archetypes: `power`, `endurance`, `technical`, or `hybrid`.

**Output JSON:**
```json
{
  "archetype": "power | endurance | technical | hybrid",
  "confidence": 0.0–1.0,
  "reasoning": "2–3 sentence explanation using conditional phrasing",
  "cluster_size": number,
  "olympic_count": number,
  "paralympic_count": number,
  "time_span": "historically inspired synthetic range",
  "synthetic_archive_id": "e.g. SYN-HYB-206",
  "archive_basis": "1 sentence on anonymized pattern logic",
  "ethics_note": "...",
  "signal_label": "short label for the archetype signal"
}
```

---

## 2. Voice Extract

**Function:** `buildVoiceExtractPrompt(transcript)`
**Route:** `POST /api/voice-parse`

Parses a free-form voice transcript into structured biometric fields.

**Output JSON:**
```json
{
  "height": number | null,
  "weight": number | null,
  "age": number | null,
  "habits": ["strength", "running", "swimming", "team_sports", "martial_arts",
             "gymnastics", "racket", "wheelchair_sport", "para_athletics"],
  "confirmation_message": "natural language summary for the user"
}
```

---

## 3. Advisor Narrative

**Function:** `buildAdvisorPrompt(bio)`
**Route:** `POST /api/agent-mode` with `agentMode: "advisor"`

Analytical explanation of the archetype classification.

**Output JSON:**
```json
{
  "narrative": "3–4 sentence analytical explanation",
  "key_factors": [
    { "factor": "string", "value": "string", "significance": "string" }
  ],
  "historical_context": "1–2 sentences on synthetic archive context",
  "olympic_note": "1 sentence on Olympic-inspired pathway",
  "paralympic_note": "1 sentence on Paralympic-inspired pathway (equal depth)",
  "confidence_explanation": "1 sentence on signal confidence",
  "ethics_note": "..."
}
```

---

## 4. Coach Narrative

**Function:** `buildCoachPrompt(bio)`
**Route:** `POST /api/agent-mode` with `agentMode: "coach"`

5 ranked sport recommendations (≥2 Paralympic) + 3-phase training roadmap.

**Output JSON:**
```json
{
  "narrative": "2–3 sentence coach-voice intro",
  "sport_recommendations": [
    {
      "rank": 1,
      "sport": "string",
      "is_paralympic": boolean,
      "alignment_score": 0–100,
      "why": "1–2 sentences",
      "entry_point": "1 concrete first step"
    }
  ],
  "training_phases": [
    { "phase": "Foundation | Sport exposure | Competition prep",
      "duration": "e.g. months 1–3",
      "focus": "2–3 sentences" }
  ],
  "important_note": "exploratory guidance disclaimer",
  "ethics_note": "..."
}
```

---

## 5. Mentor Narrative

**Function:** `buildMentorPrompt(bio)`
**Route:** `POST /api/agent-mode` with `agentMode: "mentor"`

4-year story arc toward LA28.

**Output JSON:**
```json
{
  "narrative": "3–4 sentence mentor opening",
  "timeline": [
    { "phase": "Now · 2025", "title": "string", "description": "3–4 sentences", "milestone": "string" },
    { "phase": "Year 1 · 2026", "title": "string", "description": "3–4 sentences", "milestone": "string" },
    { "phase": "Year 2–3 · 2027", "title": "string", "description": "3–4 sentences", "milestone": "string" },
    { "phase": "Year 4 · 2028", "title": "string", "description": "3–4 sentences", "milestone": "string" }
  ],
  "la28_connection": "2–3 sentences on LA28 sport alignment",
  "soul_message": "1 final emotional sentence",
  "ethics_note": "..."
}
```

---

## 6. Soul Twins

**Function:** `buildSoulTwinPrompt(bio)`
**Route:** `POST /api/analyze` (combined with archetype classification)

Finds 2–3 synthetic archive echoes whose anonymized patterns resemble the user. At least one must be Paralympic-inspired.

**Output JSON:**
```json
{
  "soul_twins": [
    {
      "era": "e.g. 1948 · London",
      "archetype_label": "anonymous archive node label",
      "sport": "string",
      "games_type": "Olympic | Paralympic",
      "height_cm": number,
      "weight_kg": number,
      "similarity_note": "1 sentence (conditional phrasing)",
      "historical_context": "1 sentence (no real records)"
    }
  ]
}
```

---

## 7. Reflection

**Function:** `buildReflectionPrompt(bio, archetype)`
**Route:** `POST /api/analyze` (combined with archetype classification)

Exactly 3–4 sentence emotional reflection connecting the user to an anonymized archive pattern. Must include both Olympic-inspired and Paralympic-inspired synthetic context.

**Output JSON:**
```json
{
  "reflection": "3–4 sentence narrative as a single string",
  "ethics_note": "..."
}
```

---

## Public Archive Context

Prompts may include a `PUBLIC ARCHIVE CONTEXT` block from `core/publicArchive.ts`.
When `data/processed/team-usa-archetype-clusters.json` contains generated public aggregate clusters, Gemini receives anonymous cluster counts, sport summaries, and parity counts. When the generated archive is empty, prompts explicitly instruct Gemini to use the synthetic fallback archive and label it as synthetic.

## Deterministic Fallback

If any Gemini call fails, NEURIX falls back to pre-computed synthetic responses in `core/syntheticArchive.ts`. Fallback outputs are marked with `"demo_fallback": true` and contain complete, exhibition-safe debrief data.
