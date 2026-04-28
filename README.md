# NEURIX

NEURIX is an ethical AI debrief experience for exploring athletic archetype signals. A user enters biometrics, activity background, voice input, and an agent mode; NEURIX then produces an anonymized, synthetic, Team USA-inspired archetype debrief.

## Challenge-Safe Data Policy

- NEURIX does not use real athlete names.
- NEURIX does not display real athlete records.
- NEURIX does not claim real historical matching.
- All archive language refers to synthetic, anonymized, historically inspired patterns.
- Olympic-inspired and Paralympic-inspired pathways are treated with equal prominence.

## Demo Flow

1. Landing: introduces the Human Intelligence Analysis System.
2. Scan: collects height, weight, age, habits, voice input, and agent mode.
3. Thinking: visualizes the pipeline through body signal, habit vector, synthetic archive, ethics filter, and agent synthesis.
4. Results: reveals the archetype lock, synthetic archive ID, signal confidence, sport pathway, agent lens, archive echoes, and debrief card export.

## Agent Lenses

- Advisor: explains the reasoning and signal factors.
- Coach: turns the signal into sport pathways and training protocol.
- Mentor: frames the result as a longer LA28 possibility arc.

## AI Pipeline

The app uses Gemini for narrative and structured JSON generation, with a deterministic synthetic fallback for demo reliability. If Gemini fails or an API key is missing, NEURIX still returns a complete synthetic debrief marked as fallback output.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run build
```

## Known Limitations

- The Spline body visualization is external, so NEURIX includes a local SVG fallback for demo safety.
- The archive is intentionally synthetic and should not be interpreted as real athlete data.
- Recommendations are exploratory pathways, not performance predictions.
