# NEURIX DNA Profile Card — Image Generation Guide

---

## Overview

This document defines the complete visual generation system for the NEURIX DNA Profile Card. All generated images must adhere strictly to these specifications to ensure consistency across users and sessions.

---

## Visual System Rules

### Color Palette
| Role | Value | Usage |
|---|---|---|
| Background | `#000000` | Full canvas |
| Primary text | `#FFFFFF` | Headers, labels |
| Secondary text | `#AAAAAA` | Body copy, subtitles |
| Accent | `#FF8A4C` | Highlights, memory stamps, key metrics ONLY |
| No other colors permitted |

### Typography
- Font style: monospace or geometric sans-serif (SF Mono, JetBrains Mono, or equivalent)
- Weight: Regular for body, Medium for labels, Light for captions
- Avoid decorative or script fonts entirely

### Design Language
- Apple-level minimalism: every element must justify its presence
- Futuristic HUD aesthetic: structured, data-first
- Grid-based layout with consistent margins and gutters
- No gradients except subtle radial depth on body silhouette
- No excessive glow — one faint ring only around the central figure
- No decorative icons, abstract art, or atmospheric fog effects

---

## Layout Specification

```
┌────────────────────────────────────────────────────────────┐
│  NEURIX DNA PROFILE                    [SYSTEM ID / HASH]  │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│         ┌──────────────────────────────────────┐           │
│         │      TYPE: {TYPE}                    │           │
│         │      CONFIDENCE: {CONFIDENCE}%        │           │
│         └──────────────────────────────────────┘           │
│                                                             │
│    ┌───────────────────────────────────────────────────┐   │
│    │           [WIREFRAME HUMAN BODY]                  │   │
│    │           ○ CIRCULAR HUD RING ○                   │   │
│    └───────────────────────────────────────────────────┘   │
│                                                             │
│  CORE INSIGHT                                               │
│  ── {CORE_INSIGHT}                                          │
│                                                             │
│  BODY COMPOSITION          HISTORICAL MATCH                 │
│  ── {BODY_DATA[0]}         ── {MATCH_NAME}                  │
│  ── {BODY_DATA[1]}         ── {MATCH_ERA}                   │
│  ── {BODY_DATA[2]}         ── {MATCH_SIMILARITY}%           │
│                                                             │
│  POTENTIAL SPORTS          TRAINING FOCUS                   │
│  ── {SPORTS}               ── {TRAINING}                    │
│                                                             │
│  AWARENESS                 REFLECTION                       │
│  ── {AWARENESS}            ── {REFLECTION}                  │
│                                                             │
│  ╔═══════════════════════════════════════════════════════╗  │
│  ║  ● STORED IN NEURIX MEMORY      [#FF8A4C accent]     ║  │
│  ║  ● LAST UPDATED: {TIMESTAMP}                         ║  │
│  ╚═══════════════════════════════════════════════════════╝  │
└────────────────────────────────────────────────────────────┘
```

---

## Full Prompt Template

Use this template for high-fidelity generation (Gemini Image or equivalent):

```
Generate a premium AI system interface card called "NEURIX DNA PROFILE" rendered as a single dark-mode UI screen.

STRICT VISUAL RULES:
- Canvas: pure black (#000000), no gradients or textures
- All text: white (#FFFFFF) or light gray (#AAAAAA)
- Single accent color: peach orange (#FF8A4C) used ONLY on memory stamps, key metric highlights, and section divider lines
- Typography: monospace or geometric sans-serif, clean and structured
- Style: Apple-level minimalism meets futuristic HUD interface — data-dense but uncluttered, no decorative elements

LAYOUT (top to bottom):
1. HEADER ROW — left: "NEURIX DNA PROFILE" in caps; right: a short hex-style system ID string
2. TYPE BANNER — full-width label block showing: TYPE: {TYPE} | CONFIDENCE: {CONFIDENCE}%
3. CENTRAL FIGURE — minimal wireframe or flat-line silhouette of a standing human body, centered, surrounded by a single thin circular HUD ring with subtle tick marks; no glow halos, no particle effects
4. DATA COLUMNS — two columns of labeled metrics:
   Left column: CORE INSIGHT / BODY COMPOSITION (3 bullet metrics: {BODY_DATA})
   Right column: HISTORICAL MATCH (name, era, similarity%) / POTENTIAL SPORTS ({SPORTS})
5. SECONDARY ROW — two columns: TRAINING FOCUS ({TRAINING}) | AWARENESS ({AWARENESS})
6. REFLECTION ROW — full-width subtle text block: {REFLECTION}
7. MEMORY STAMP — bottom panel with #FF8A4C left border:
   "● STORED IN NEURIX MEMORY"
   "● LAST UPDATED: {TIMESTAMP}"

CONTENT TO RENDER:
- Type: {TYPE}
- Confidence: {CONFIDENCE}%
- Core Insight: {CORE_INSIGHT}
- Body Data: {BODY_DATA}
- Historical Match: {HISTORICAL_MATCH}
- Potential Sports: {SPORTS}
- Training Focus: {TRAINING}
- Awareness: {AWARENESS}
- Reflection: {REFLECTION}
- Timestamp: {TIMESTAMP}

DO NOT include: abstract art, glowing orbs, atmospheric fog, lens flares, decorative borders, stock-art imagery, marketing language, or random UI chrome. This must look like a real data product output, not concept art.
```

---

## Short Prompt Template (API Use)

Condensed version for token-efficient API calls:

```
Dark-mode AI profile card UI. Black background (#000000), white/gray text, peach orange (#FF8A4C) accent only. Monospace font. Layout: header "NEURIX DNA PROFILE", type/confidence banner, centered wireframe human silhouette with thin HUD ring, two-column data grid (body composition, historical match, sports, training, awareness), reflection text row, orange-accented memory stamp footer ("STORED IN NEURIX MEMORY / LAST UPDATED: {TIMESTAMP}"). Content: Type={TYPE}, Confidence={CONFIDENCE}%, Insight={CORE_INSIGHT}, Body={BODY_DATA}, Match={HISTORICAL_MATCH}, Sports={SPORTS}, Training={TRAINING}, Awareness={AWARENESS}, Reflection={REFLECTION}. Minimal, structured, product UI — not concept art.
```

---

## Content Writing Rules

When populating placeholders, follow these language constraints:

| Field | Rule | Example |
|---|---|---|
| `{TYPE}` | Capitalized noun phrase | `ENDURANCE ARCHITECT` |
| `{CONFIDENCE}` | Integer 60–96 | `87` |
| `{CORE_INSIGHT}` | 1–2 sentences, hedged language | `This profile may indicate a high aerobic baseline with structural resilience.` |
| `{BODY_DATA}` | 3 short metric labels + values | `Estimated VO2 Range: 52–58 / Lean Composition Index: High / Skeletal Load Class: Medium` |
| `{HISTORICAL_MATCH}` | Anonymous archive node + era + synthetic similarity note | `Anonymous endurance archive node — 1950s-inspired / structural echo` |
| `{SPORTS}` | 2–3 sports, comma-separated | `Marathon, Cross-Country, Cycling` |
| `{TRAINING}` | 1–2 focus areas | `Zone 2 aerobic base, cadence optimization` |
| `{AWARENESS}` | 1 sentence, cognitive/psychological insight | `May exhibit high pain tolerance and methodical pacing behavior.` |
| `{REFLECTION}` | 1 sentence, introspective AI output | `Pattern suggests long-term physical consistency over explosive output.` |
| `{TIMESTAMP}` | ISO-style date | `2026-04-28` |

**Prohibited language:** guaranteed, proven, definitive, will, is confirmed, scientifically verified.
**Required hedging:** may, could, suggests, indicates, estimated, pattern consistent with.

---

## Style Rules Checklist

Before submitting any generated card for use, verify:

- [ ] Background is pure black — no dark gray, no texture
- [ ] Only three text colors used: white, light gray, `#FF8A4C`
- [ ] `#FF8A4C` appears ONLY on memory stamp panel and key metric highlights
- [ ] Central figure is a clean wireframe or flat silhouette — not photorealistic
- [ ] HUD ring is a single thin circle — no multiple rings, no pulsing glow
- [ ] All text is monospace or geometric sans-serif
- [ ] No decorative elements, icons, or atmospheric effects
- [ ] Memory stamp section is visually distinct with orange accent
- [ ] All placeholder fields are populated — no `{FIELD}` literals in final output
- [ ] Language uses hedged AI reasoning — no absolute claims
- [ ] Card reads as a product UI artifact, not as generated art

---

## Example Populated Card (Reference)

```
NEURIX DNA PROFILE                              #NX-7F2A-9C41

TYPE: ENDURANCE ARCHITECT          CONFIDENCE: 87%

              [WIREFRAME HUMAN SILHOUETTE]
                    ○ HUD RING ○

CORE INSIGHT
── This profile may indicate a high aerobic capacity baseline
   with structural resilience suited for sustained output.

BODY COMPOSITION                   HISTORICAL MATCH
── Estimated Aerobic Signal: High  ── Anonymous endurance archive node
── Lean Composition: High          ── 1950s-inspired / structural echo
── Skeletal Load: Medium

POTENTIAL SPORTS                   TRAINING FOCUS
── Marathon, Cross-Country         ── Zone 2 base building
── Triathlon                       ── Cadence optimization

AWARENESS                          REFLECTION
── May exhibit high pain           ── Pattern suggests long-term
   tolerance and methodical           consistency over explosive
   self-regulation.                   peak output.

╔═══════════════════════════════════════════════════════════╗
║  ● STORED IN NEURIX MEMORY                               ║
║  ● LAST UPDATED: 2026-04-28                              ║
╚═══════════════════════════════════════════════════════════╝
```
