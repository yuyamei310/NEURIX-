# NEURIX — Devpost Submission Draft

This file is the copy source for Devpost, the demo video, and final judging notes. It does not replace the Devpost form; copy the relevant sections into the submission page.

---

## Project Title

NEURIX — Ethical Athlete Archetype Agent

## Tagline

A fan-facing Digital Mirror that maps body signals to anonymous Team USA-inspired athlete archetypes, sport pathways, and shareable Gemini-powered debriefs.

## Selected Challenge

Challenge 4 — The Athlete Archetype Agent

---

## Short Description

NEURIX helps fans explore where their body type and activity background could align with anonymous Team USA-inspired sport archetypes. Users enter biometrics, select habits, choose an Advisor, Coach, or Mentor lens, and receive a conditional AI debrief with Olympic-inspired and Paralympic-inspired pathways shown side by side.

The project uses Gemini for narrative generation, data reasoning, agent lenses, voice parsing, and structured reflection. It uses an anonymous aggregate archive pipeline with a synthetic fallback layer so the demo stays reliable while avoiding real athlete identity matching, NIL issues, records, finish times, or performance guarantees.

---

## Inspiration

Most fans experience Team USA through highlights, medals, and famous stories. NEURIX asks a more personal question: what if a fan could see themselves in the collective journey of Team USA without comparing themselves to a real athlete?

The product is designed as an ethical mirror, not a scouting tool. It transforms physical traits and activity background into anonymized archetype signals, then uses Gemini to explain possible sport pathways in a careful, conditional, inclusive way.

---

## What It Does

NEURIX guides a user through a five-stage experience:

1. The user enters height, weight, age, activity background, and optional voice input.
2. A local classifier gives an immediate body-signal preview.
3. Gemini analyzes the profile against archive context and returns a structured debrief.
4. The results page shows archetype confidence, data provenance, Olympic/Paralympic parity, sport pathways, agent lenses, and archive echoes.
5. The user can export a shareable NEURIX DNA Profile Card.

The app includes demo presets for reliable judging:

```text
/scan?demo=power
/scan?demo=endurance
/scan?demo=technical
/scan?demo=hybrid
/scan?demo=hybrid&lens=mentor
/scan?demo=endurance&lens=coach
```

---

## How We Used Gemini

Gemini is used in the core product experience:

- Archetype reasoning and explanation
- Advisor narrative for why the archetype was assigned
- Coach sport recommendations and training phases
- Mentor long-term narrative toward the LA28 Games as a horizon
- Voice transcript parsing into biometric fields
- Reflection generation using conditional language

All Gemini outputs are constrained by JSON prompt contracts in `core/prompts.ts`. The prompts enforce:

- no real athlete names
- no real athlete records
- no performance guarantees
- equal Olympic and Paralympic pathway representation
- clear use of conditional phrasing

---

## How We Used Google Cloud

The final app is designed for Google Cloud Run deployment using the included Dockerfile and standalone Next.js build.

Google Cloud / Gemini usage:

- Gemini API powers the AI reasoning routes.
- Cloud Run hosts the Next.js application.
- The Gemini API key is provided as a Cloud Run environment variable or secret.

Deployment target:

```text
Google Cloud Run
```

Core runtime routes:

```text
/api/analyze
/api/agent-mode
/api/voice-parse
```

---

## Data Strategy

NEURIX uses an anonymous aggregate archive pipeline:

```text
data/raw/*.csv
  -> scripts/build-public-archive.mjs
  -> data/processed/team-usa-archetype-clusters.json
  -> core/publicArchive.ts
  -> Gemini prompt context + results provenance
```

The sample dataset is intentionally anonymous and balanced across archetypes so judges can inspect the pipeline without private data. The builder filters to Team USA-scope rows, suppresses small clusters, removes names from generated output, and writes aggregate-only cluster data.

The product output does not show individual-level athlete data.

---

## What Makes This Safe

NEURIX is designed around NIL and data-use safety:

- No real athlete names appear in product output.
- No athlete images, likenesses, videos, or logos are used.
- No finish times, exact scores, or record claims are used.
- No one-to-one athlete matching is presented.
- No performance guarantee is made.
- Olympic and Paralympic pathways are treated with equal prominence.
- Results are framed as exploration, not selection or prediction.

Example approved language:

```text
"could align with"
"may suit"
"synthetic patterns suggest"
"anonymous archive echoes"
```

Avoided language:

```text
"will become"
"guaranteed"
"matched to this athlete"
"proven predictor"
```

---

## Judging Points

### Impact

NEURIX turns Team USA history into a personal fan engagement experience while respecting athlete identity and privacy. It gives users a shareable, emotionally resonant output without pretending to predict performance.

### Technical Depth

The app combines:

- Next.js App Router
- streaming API responses
- Gemini JSON prompt contracts
- local deterministic classification
- anonymous aggregate archive pipeline
- synthetic fallback system
- Zustand persisted memory
- shareable image export
- Cloud Run-ready deployment

### Presentation

The interface is built as a cinematic but restrained analysis system. The 3D body, scan console, thinking pipeline, provenance panel, pathway parity comparison, and DNA card create a cohesive end-to-end demo.

### Challenge Alignment

NEURIX directly addresses Challenge 4 by clustering body signals into archetypes, generating a fan-facing agent experience, explaining Olympic and Paralympic pathways with equal analytical depth, and using conditional phrasing throughout.

---

## Demo Video Script

Target length: 2 to 3 minutes.

### 0:00-0:20 — Opening

"NEURIX is an ethical athlete archetype agent built for the Team USA x Google Cloud challenge. The idea is simple: let fans see where their body type and activity background could align with anonymous Team USA-inspired sport patterns, without identifying real athletes or making performance promises."

### 0:20-0:55 — Scan Demo

"I start on the scan console. For a reliable demo, I can use presets like power, endurance, technical, or hybrid. These fill in biometrics, habits, and the selected agent lens, but the user can still edit everything manually. The Spline body keeps the experience feeling like a digital mirror rather than a form."

Recommended URL:

```text
/scan?demo=hybrid&lens=mentor
```

### 0:55-1:20 — Analysis Pipeline

"When I begin the full scan, NEURIX streams the analysis pipeline. The app waits for real backend events like archetype, archive echoes, reflection, and completion. If Gemini or parsing fails, the system falls back to safe synthetic data so the demo remains usable."

### 1:20-1:55 — Results

"The results page shows the archetype lock, signal confidence, archive node counts, and the AI-generated explanation. This is not a real athlete match. It is anonymous pattern reasoning, phrased conditionally."

### 1:55-2:25 — Safety and Parity

"This section is the data provenance and ethics panel. It shows whether the result uses public aggregate context or synthetic fallback, and it lists the safety rules: no athlete names, no likenesses, no records, no finish times, and no performance guarantees. Below that, Olympic-inspired and Paralympic-inspired pathways are compared side by side with equal depth."

### 2:25-2:45 — Gemini and Cloud

"Gemini powers the archetype reasoning, agent lenses, voice parsing, and narrative generation. The app is built in Next.js and deployed to Google Cloud Run, with the Gemini API key provided securely as an environment variable."

### 2:45-3:00 — Closing

"NEURIX is a fan engagement tool, not a scouting tool. It helps people see themselves in the collective journey of Team USA through ethical, conditional, data-driven storytelling."

---

## Demo Checklist

Before recording:

- Run `npm run build:archive`
- Run `npm run lint`
- Run `npm run build`
- Confirm Cloud Run URL works
- Open the demo in an incognito/private browser
- Test `/scan?demo=hybrid&lens=mentor`
- Export the DNA card once
- Keep the browser zoom at 100%
- Avoid showing API keys or private console values

---

## Devpost Form Copy

### Built With

```text
Next.js, React, TypeScript, Tailwind CSS, Zustand, Gemini API, Google Cloud Run, Docker, html2canvas, Spline
```

### Try It Out

```text
Live demo: [Cloud Run URL]
Repository: https://github.com/yuyamei310/NEURIX-
Demo preset: [Cloud Run URL]/scan?demo=hybrid&lens=mentor
```

### What Is Next

- Expand the public aggregate archive with more Team USA-scope rows.
- Add a richer screenshot gallery and in-app onboarding.
- Add smoke tests for demo presets.
- Add more detailed Paralympic classification education where applicable.
- Add a Cloud Run deployment guide with exact `gcloud` commands.
