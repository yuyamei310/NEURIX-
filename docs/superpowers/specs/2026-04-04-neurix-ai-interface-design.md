# NEURIX — AI Interface Redesign Spec
**Date:** 2026-04-04  
**Scope:** Layout, components, UI structure, transitions only. No backend or API changes.  
**Approach:** Option A — Minimal surgery. Rebuild only what's broken; leave working logic intact.

---

## 1. Problem

The current UI feels like a form dashboard. The scan page is a vertical `max-w-2xl` stack of sections with no visual hierarchy or sense of system. The goal is to transform it into a premium dark AI scanning interface where the 3D body is the emotional and visual core.

---

## 2. Global Design Token Changes

File: `neurix/app/globals.css`

**Color palette flip (white → dark):**

```css
--bg: #0a0a0a;
--surface-1: #111111;
--surface-2: #1a1a1a;
--border: rgba(255, 255, 255, 0.08);
--border-2: rgba(255, 255, 255, 0.14);
--border-3: rgba(255, 255, 255, 0.24);
--text: #ffffff;
--text-2: #8a8a8a;
--text-3: #555558;
--accent: #ffffff;
--accent-inv: #0a0a0a;
```

**New keyframe animations to add:**

```css
@keyframes scan {
  0%   { transform: translateY(0); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
}

@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.03); }
}
```

All pages inherit dark background automatically via `html, body { background-color: var(--bg); }`.

---

## 3. Component Changes

### 3a. Move FloatingCard to shared UI

- **From:** `components/results/FloatingCard.tsx`
- **To:** `components/ui/FloatingCard.tsx`
- Update import in `app/results/page.tsx` accordingly.
- Dark variant is the default: `bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-xl px-4 py-3`
- This softer surface (`white/[0.02]`, `border white/[0.06]`) replaces the previous `white/[0.04]` and `white/[0.08]` — cards should feel like they float, not sit on a surface.

### 3b. New: `ScanCore` (`components/scan/ScanCore.tsx`)

Full-screen centered visual. Four motion layers:

**Layer A — Radial glow (base atmosphere):**
- `absolute inset-0` div behind all other layers
- `background: radial-gradient(circle at center, rgba(255,255,255,0.08), transparent 70%)`
- No animation — static energy source feeling

**Layer B — Pulse ring (outer):**
- Div with `pulse-ring` class (already in globals.css)
- `w-64 h-64 rounded-full border border-white/20`

**Layer C — Scan line:**
- `absolute w-full h-[2px] bg-white/10`
- CSS: `animation: scan 2s linear infinite`
- Clipped by `overflow-hidden` on parent container

**Layer D — Inner breathing body:**
- Inner circle `w-48 h-48 rounded-full bg-white/[0.03]`
- CSS: `animation: breathe 3s ease-in-out infinite`
- Contains an SVG human silhouette outline (white, opacity 0.15)

**Static elements layered on top:**
- `ArchetypeDriftLabel` floated above center
- System copy below: `"NEURIX calibrating your profile..."` — `font-mono-data text-white/40`

**Two FloatingCards — dynamic system copy (fake-reactive, not static):**
- Top-left: label `SYSTEM STATUS`, animated value cycles between:
  `"Analyzing biomechanical signal..."` → `"Signal integrity: 92%"` — swap every 3s via `useState` + `setInterval`
- Bottom-right: label `READINESS`, animated value:
  `"Neural profile stabilizing..."` → `"Readiness: 72% → 84%"` — same pattern

### 3c. New: `BottomDrawer` (`components/scan/BottomDrawer.tsx`)

Fixed to bottom of screen. Two states: collapsed and expanded.

**Collapsed state:**
- Height: ~56px
- Content: `SYSTEM INPUT LAYER` (mono label, `text-white/60`) + `BIOMETRICS · HABITS · MODE` (mono sub-label, `text-white/30`) + `↑` chevron on right
- Background: `bg-[#111111] border-t border-white/[0.08]`

**Expanded state:**
- Height: 60vh
- Transition: `transform 350ms ease-in-out`
- Collapsed transform: `translateY(calc(100% - 56px))`
- Expanded transform: `translateY(0)`
- Content: scrollable area with `BiometricSliders`, `VoiceInput`, `HabitGrid`, `AgentModeSelector`
- CTA pinned at drawer bottom: `Begin Full Scan →` — `w-full bg-white text-black rounded-[10px] py-3 font-mono-data`

**Overlay dim when expanded:**
- `fixed inset-0 bg-black/40 backdrop-blur-sm` rendered behind drawer, above page content
- `z-index`: overlay = 40, drawer = 50
- Clicking overlay closes drawer

Toggle: click collapsed strip header to open; click overlay or chevron (↓) to close.

---

## 4. Page Changes

### 4a. `/app/scan/page.tsx` — Full rebuild

```
min-h-screen bg-[var(--bg)] relative overflow-hidden
│
├── <header>  NEURIX · SCAN  |  ArchetypeDriftLabel
│
├── <main> flex items-center justify-center flex-1
│   └── <ScanCore />
│
├── <DrawerOverlay />   (conditional, z-40)
└── <BottomDrawer>      (z-50)
    ├── BiometricSliders
    ├── VoiceInput
    ├── HabitGrid
    ├── AgentModeSelector
    └── "Begin Full Scan →" CTA → router.push('/thinking')
```

Remove: `max-w-2xl`, all `<section>` blocks, standalone CTA div.  
Keep: `useRouter`, `handleAnalyze` → `router.push('/thinking')` (no logic change).

### 4b. `/app/thinking/page.tsx` — Substantial restyle

This is the second most important page. It should build anticipation, not just show a spinner.

**Layout:** Full-screen centered, inherits dark background via tokens. No local bg override needed.

**Upgrade `ThinkingSequence`:** The component itself is not changed, but the page wrapping it is upgraded:

Add above `ThinkingSequence`:
- Pulsing dot: `w-2 h-2 rounded-full bg-white animate-pulse`
- Headline: `"NEURIX is constructing your profile..."` — `text-[22px] font-semibold tracking-tight text-white`
- Sub-label: `font-mono-data text-white/40` — cycles through staged system messages:
  `"Mapping biomechanics..."` → `"Detecting neural patterns..."` → `"Comparing historical records..."` — swap every 2s

Add below `ThinkingSequence`:
- Thin progress bar: `w-full h-[1px] bg-white/10` with animated fill `bg-white/40` growing 0→100% over ~8s (CSS animation, not tied to real API progress)

Verify `ThinkingSequence` internal text colors use `var(--text)` and `var(--text-2)` — update hardcoded hex values if found.

### 4c. `/app/results/page.tsx` — Restyle for final impression

The results page is the final impression. Current section structure is kept but surfaces are softened.

Changes:
- Update `FloatingCard` import to `@/components/ui/FloatingCard`
- All `border-[var(--border)]` section dividers: change to `border-white/[0.06]`
- All card surfaces: ensure `bg-white/[0.02]` not `bg-white/[0.04]` — lighter float feel
- Increase vertical spacing between sections: `pt-10 pb-10` → `pt-14 pb-14` where used
- `ArchetypeCard`, `KeyFactorsPanel`: add `rounded-xl` if missing; remove any `shadow-*` classes

### 4d. `/app/page.tsx` (Landing)

No changes needed. Inherits dark tokens.

---

## 5. Files Changed Summary

| File | Type |
|------|------|
| `app/globals.css` | Edit — dark tokens + new keyframes |
| `components/results/FloatingCard.tsx` | Move → `components/ui/FloatingCard.tsx` |
| `components/scan/ScanCore.tsx` | Create new |
| `components/scan/BottomDrawer.tsx` | Create new |
| `app/scan/page.tsx` | Rebuild layout |
| `app/thinking/page.tsx` | Substantial restyle |
| `app/results/page.tsx` | Import update + surface softening |
| `components/thinking/ThinkingSequence.tsx` | Verify/fix color tokens |

**Not touched:** All API routes, Zustand store, `BiometricSliders`, `VoiceInput`, `HabitGrid`, `AgentModeSelector`, `BodyPanel`, `AthleteBody`, `ArchetypeCard`, `AgentTabs`, `SoulTwins`, `ReflectionPanel`, `DNACard`, all types.

---

## 6. Out of Scope

- Backend, API routes, Zustand store
- Real 3D body on scan page (placeholder only)
- Framer Motion (all animation is pure CSS + React useState/setInterval)
- New routes — existing `/scan`, `/thinking`, `/results` are used
