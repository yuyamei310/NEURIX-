# NEURIX — System Architecture

## Overview

NEURIX is a Next.js 14 application that produces an ethical athletic archetype debrief. It combines deterministic local classification, a reproducible public aggregate archive pipeline, Gemini-generated reasoning, and a synthetic fallback at every AI boundary.

```plaintext
Raw permitted public CSVs
    -> scripts/build-public-archive.mjs
    -> anonymous aggregate clusters
    -> core/publicArchive.ts

User input
    -> scan UI
    -> local signal preview
    -> /api/analyze
    -> Gemini + archive context
    -> results UI + DNA card export
```

## Runtime Flow

```plaintext
User Input
    |
    v
Scan Stage
    biometrics, habits, voice input, selected agent mode
    |
    v
Voice Parse API
    /api/voice-parse
    Gemini extracts optional biometric JSON from transcript
    |
    v
Analyze API
    /api/analyze
    streams archetype, advisor, insight peek, soul twins, reflection
    |
    v
Agent Mode API
    /api/agent-mode
    lazily hydrates Coach or Mentor lens when needed
    |
    v
Results
    archetype lock, provenance panel, parity comparison, sport pathways, debrief card
```

## Directory Structure

```plaintext
/app
  /api/analyze        streaming archetype + debrief route
  /api/agent-mode     coach / mentor route
  /api/voice-parse    voice transcript parser route
  /scan               biometric input UI
  /thinking           pipeline visualization
  /results            debrief output UI

/components
  /scan               biometric controls, body scan, HUD layers
  /results            cards, data provenance, parity comparison, agent tabs, DNA export card
  /three              body visualization fallback logic
  /ui                 shared primitives

/core
  classifier.ts       deterministic local archetype preview
  gemini.ts           Gemini client + JSON parser
  prompts.ts          prompt contracts and ethics policy
  publicArchive.ts    generated public aggregate archive adapter
  syntheticArchive.ts synthetic fallback archive and debriefs
  dnaExport.ts        HTML-to-canvas card export

/data
  /raw                permitted public CSV inputs, not generated output
  /processed          anonymous aggregate cluster JSON

/scripts
  build-public-archive.mjs  CSV ingestion, US filtering, anonymized clustering

/store
  atlasStore.ts       Zustand app state and local memory

/types
  atlas.ts            shared app contracts
```

## Public Archive Pipeline

`scripts/build-public-archive.mjs` reads CSV files from `data/raw`, filters to US/Team USA rows, normalizes flexible column names, classifies rows into `power`, `endurance`, `technical`, and `hybrid`, then writes aggregate-only output to `data/processed/team-usa-archetype-clusters.json`.

The repository includes `data/raw/sample-team-usa-public.csv`, an anonymous balanced sample that lets judges run the pipeline without private data.

Privacy and contest-safety rules:

- Athlete names are never written to generated outputs.
- Clusters smaller than the minimum threshold are suppressed.
- Outputs are anonymous aggregates, not individual athlete matches.
- Finish times, exact scoring results, images, logos, and likenesses are not used in app output.
- If public aggregate data is absent, the app explicitly falls back to the synthetic archive.

## AI Pipeline

### Stage 1 — Voice Parse

- Route: `POST /api/voice-parse`
- Input: raw voice transcript
- Output: `{ height, weight, age, habits, confirmation_message }`
- Fallback: returns an error and lets the UI continue with manual input.

### Stage 2 — Archetype Analysis

- Route: `POST /api/analyze`
- Input: `BiometricInput` and optional stored profile memory
- Output stream: `archetype`, `advisor`, `insight_peek`, `soul_twins`, `reflection`, optional selected agent lens
- Fallback: `buildDemoFallbackAnalysis()` returns complete synthetic debrief data.

### Stage 3 — Agent Lens

- Route: `POST /api/agent-mode`
- Modes: `coach`, `mentor`
- Output: sport recommendations, training phases, or LA28 narrative timeline.
- Fallback: prewritten synthetic lens data by archetype.

## Ethics Layer

All prompt contracts enforce:

- No real athlete names or identifiable athlete details in outputs.
- No real record, finish-time, or score claims.
- Conditional language only.
- Equal Olympic and Paralympic prominence.
- Clear labeling when the synthetic fallback archive is used.

## Deployment

The repository includes a standalone Next.js configuration and Dockerfile suitable for Cloud Run:

```bash
npm run build
docker build -t neurix .
```

Cloud Run should receive `GEMINI_API_KEY` as a secret or environment variable.
