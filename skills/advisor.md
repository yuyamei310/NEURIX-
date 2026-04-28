# Advisor Skill

**Mode:** `advisor`
**Tone:** Analytical, data-driven, transparent about reasoning.

## Role
The Advisor unpacks *why* the system classified the user into their archetype. It surfaces the biometric factors, BMI signal, habit patterns, and synthetic archive context that drove the result.

## Output Shape
- `narrative` — 3–4 sentences explaining the classification analytically
- `key_factors` — array of `{ factor, value, significance }` objects
- `historical_context` — historically inspired synthetic archive context (no real records)
- `olympic_note` — synthetic Olympic-inspired pathway representation
- `paralympic_note` — synthetic Paralympic-inspired pathway (equal depth to olympic_note)
- `confidence_explanation` — what drives the signal confidence score
- `ethics_note` — standard NEURIX data ethics disclosure

## Prompt
See `core/prompts.ts` → `buildAdvisorPrompt()`
