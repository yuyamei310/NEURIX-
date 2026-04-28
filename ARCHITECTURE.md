# NEURIX — System Architecture

## Overview

NEURIX is a Next.js 15 application that runs a multi-stage AI pipeline to produce an ethical athletic archetype debrief. The system processes biometric input through a series of deterministic and generative stages, with a synthetic fallback at every AI boundary.

```
User Input
    │
    ▼
┌─────────────┐
│  Scan Stage  │  biometrics (height/weight/age), habits, voice input, agent mode
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Voice Parse API    │  Gemini extracts biometrics from voice transcript
│  /api/voice-parse   │  → buildVoiceExtractPrompt()
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Analyze API        │  Gemini classifies archetype + generates soul twins + reflection
│  /api/analyze       │  → buildArchetypePrompt() + buildSoulTwinPrompt() + buildReflectionPrompt()
└──────┬──────────────┘
       │
       ▼
┌──────────────────────┐
│  Agent Mode API      │  Gemini generates agent-specific narrative (advisor/coach/mentor)
│  /api/agent-mode     │  → buildAdvisorPrompt() / buildCoachPrompt() / buildMentorPrompt()
└──────┬───────────────┘
       │
       ▼
┌─────────────┐
│  Results    │  archetype lock, synthetic archive ID, sport pathways, debrief card
└─────────────┘
```

---

## Directory Structure

```
/app              Next.js App Router pages and API routes
  /api
    /analyze      archetype classification + soul twins + reflection
    /agent-mode   advisor / coach / mentor narrative generation
    /voice-parse  voice transcript → biometric JSON
  /scan           biometric input UI
  /thinking       pipeline visualization (animated stages)
  /results        debrief output UI
  /onboarding     intro flow

/core             AI pipeline logic and data utilities
  gemini.ts       Gemini client (callGemini, streamGemini, parseGeminiJSON)
  prompts.ts      all prompt builder functions
  classifier.ts   deterministic local archetype classifier (BMI + habit heuristics)
  syntheticArchive.ts  synthetic archive profiles and fallback debrief generator
  eraData.ts      era-based synthetic archive data
  morphControl.ts Three.js body mesh morph targets
  dnaExport.ts    debrief card HTML-to-canvas export
  paralympicFallback.ts  Paralympic-specific fallback data

/skills           agent skill definitions
  advisor.md      Advisor skill spec
  coach.md        Coach skill spec
  mentor.md       Mentor skill spec

/components       React UI components
  /landing        landing page hero
  /scan           biometric sliders, voice input, habit grid
  /thinking       pipeline stage animations
  /results        archetype lock, agent tabs, reflection panel, DNA card
  /three          Three.js body mesh visualization
  /ui             shared UI primitives

/store            Zustand state
  atlasStore.ts   global app state (biometrics, results, agent mode)

/types            TypeScript type definitions
  atlas.ts        Archetype, AgentMode, BiometricInput, DebriefResult
  gemini.ts       Gemini response shape types
```

---

## AI Pipeline Detail

### Stage 1 — Voice Parse
**Route:** `POST /api/voice-parse`
**Input:** raw voice transcript string
**Output:** `{ height, weight, age, habits, confirmation_message }`
**Fallback:** returns null values; UI prompts manual entry

### Stage 2 — Archetype Classification
**Route:** `POST /api/analyze`
**Input:** `BiometricInput` (height, weight, age, habits, agentMode)
**Output:** `{ archetype, confidence, reasoning, cluster_size, synthetic_archive_id, soul_twins, reflection }`
**Fallback:** `buildDemoFallbackAnalysis()` in `core/syntheticArchive.ts` — deterministic, always returns a complete result

### Stage 3 — Agent Narrative
**Route:** `POST /api/agent-mode`
**Input:** `BiometricInput` + `agentMode`
**Output:** mode-specific JSON (see `/skills/*.md` for output shapes)
**Fallback:** pre-written synthetic narrative per archetype + agent mode

---

## Deterministic Fallback System

Every Gemini call is wrapped in a try/catch. If the API key is missing, the request fails, or the response cannot be parsed as valid JSON, NEURIX returns a complete synthetic result. This means the demo always works regardless of API state.

Fallback path: `core/syntheticArchive.ts` → `buildDemoFallbackAnalysis()` and `buildParalympicFallback()`

---

## Ethics Layer

All prompts include a system instruction enforcing:
- No real athlete names or records
- Conditional phrasing only ("could align", "synthetic patterns suggest")
- Equal prominence for Olympic-inspired and Paralympic-inspired pathways
- Ethics note included in every structured JSON response

The `ETHICS_NOTE` constant is defined in `core/syntheticArchive.ts` and injected into every prompt.

---

## State Management

Zustand store (`store/atlasStore.ts`) holds:
- `biometrics` — current BiometricInput
- `results` — DebriefResult from /api/analyze
- `agentMode` — selected agent lens
- `agentResult` — agent-mode narrative from /api/agent-mode
- `step` — current pipeline step for the Thinking visualization
