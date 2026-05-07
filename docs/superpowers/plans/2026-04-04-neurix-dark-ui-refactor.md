# NEURIX Dark UI Refactor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing white dashboard UI into a premium dark AI scanning interface with a full-screen ScanCore visual, bottom drawer for inputs, and consistent dark theme across all pages.

**Architecture:** Minimal surgery — update global CSS tokens first so dark theme propagates, then move FloatingCard to shared UI, then create two new components (ScanCore, BottomDrawer), then rebuild the scan page layout, then restyle thinking and results pages.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS, React useState/useEffect, CSS keyframe animations (no Framer Motion).

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `app/globals.css` | Modify | Dark token palette + new keyframes (scan, breathe) |
| `components/results/FloatingCard.tsx` | Delete (move) | Source removed after moving |
| `components/ui/FloatingCard.tsx` | Create | Shared dark glassmorphism card |
| `components/ui/Button.tsx` | Modify | Fix hardcoded `bg-white` in secondary variant |
| `components/ui/Slider.tsx` | Modify | Fix hardcoded `bg-white` on thumb |
| `components/scan/AgentModeSelector.tsx` | Modify | Fix hardcoded `bg-white` on inactive buttons |
| `components/scan/ScanCore.tsx` | Create | 4-layer animated visual: glow + pulse + scan line + breathing |
| `components/scan/BottomDrawer.tsx` | Create | Slide-up input panel with dim overlay |
| `app/scan/page.tsx` | Rebuild | Full-screen layout: header + ScanCore + BottomDrawer |
| `app/thinking/page.tsx` | Modify | Add pulsing dot, staged messages, progress bar |
| `app/results/page.tsx` | Modify | Update FloatingCard import + soften surfaces |

---

## Task 1: Dark Token Palette + New Keyframes

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace CSS custom property values**

Replace the entire `:root` block in `app/globals.css` with:

```css
:root {
  /* Base */
  --bg: #0a0a0a;
  --surface-1: #111111;
  --surface-2: #1a1a1a;
  --surface-3: #222222;

  /* Borders */
  --border: rgba(255, 255, 255, 0.08);
  --border-2: rgba(255, 255, 255, 0.14);
  --border-3: rgba(255, 255, 255, 0.24);

  /* Text */
  --text: #ffffff;
  --text-2: #8a8a8a;
  --text-3: #555558;

  /* Accent */
  --accent: #ffffff;
  --accent-inv: #0a0a0a;

  /* Typography */
  --mono: 'SF Mono', ui-monospace, monospace;
  --sans: -apple-system, 'Helvetica Neue', sans-serif;
}
```

- [ ] **Step 2: Add new keyframe animations**

Add these two blocks after the existing `@keyframes fade-in` block in `app/globals.css`:

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

- [ ] **Step 3: Start dev server and verify dark background propagates**

```bash
cd "/Users/meiyang/Desktop/NEURIX os/neurix" && npm run dev
```

Open `http://localhost:3000/scan` — background should be `#0a0a0a`. Text should be white. Header border should be very subtle.

- [ ] **Step 4: Commit**

```bash
cd "/Users/meiyang/Desktop/NEURIX os/neurix"
git add app/globals.css
git commit -m "feat: flip to dark token palette, add scan and breathe keyframes"
```

---

## Task 2: Move FloatingCard to Shared UI (Dark Default)

**Files:**
- Create: `components/ui/FloatingCard.tsx`
- Modify: `components/results/FloatingCard.tsx` (replace content with re-export, then in Task 7 update the import in results/page.tsx)

- [ ] **Step 1: Create the new shared FloatingCard**

Create `components/ui/FloatingCard.tsx`:

```tsx
import { ReactNode } from 'react'

interface FloatingCardProps {
  children: ReactNode
  className?: string
}

export function FloatingCard({ children, className = '' }: FloatingCardProps) {
  return (
    <div
      className={`bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-xl p-3 ${className}`}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Update old FloatingCard to re-export from new location**

Replace the entire content of `components/results/FloatingCard.tsx` with:

```tsx
// Re-exported from shared UI — update imports to use @/components/ui/FloatingCard
export { FloatingCard } from '@/components/ui/FloatingCard'
```

This keeps existing imports in `results/page.tsx` working until Task 7.

- [ ] **Step 3: Commit**

```bash
cd "/Users/meiyang/Desktop/NEURIX os/neurix"
git add components/ui/FloatingCard.tsx components/results/FloatingCard.tsx
git commit -m "feat: move FloatingCard to shared ui, dark glassmorphism default"
```

---

## Task 3: Fix Hardcoded `bg-white` in UI Components

**Files:**
- Modify: `components/ui/Button.tsx`
- Modify: `components/ui/Slider.tsx`
- Modify: `components/scan/AgentModeSelector.tsx`

These components have hardcoded `bg-white` that will render as white boxes on the dark background.

- [ ] **Step 1: Fix Button secondary variant**

In `components/ui/Button.tsx`, change the `secondary` variant from:
```tsx
secondary: 'bg-white border border-[var(--border-2)] text-[var(--text)] hover:bg-[var(--surface-2)]',
```
to:
```tsx
secondary: 'bg-[var(--surface-1)] border border-[var(--border-2)] text-[var(--text)] hover:bg-[var(--surface-2)]',
```

- [ ] **Step 2: Fix Slider thumb**

In `components/ui/Slider.tsx`, change the thumb div from:
```tsx
className="absolute top-1/2 w-3 h-3 rounded-full bg-white border border-[var(--border-2)] shadow-sm -translate-y-1/2 transition-all pointer-events-none"
```
to:
```tsx
className="absolute top-1/2 w-3 h-3 rounded-full bg-[var(--text)] border border-[var(--border-2)] -translate-y-1/2 transition-all pointer-events-none"
```

- [ ] **Step 3: Fix AgentModeSelector inactive button background**

In `components/scan/AgentModeSelector.tsx`, change the inactive button class from:
```tsx
'bg-white border-[var(--border-2)] hover:bg-[var(--surface-2)]'
```
to:
```tsx
'bg-[var(--surface-1)] border-[var(--border-2)] hover:bg-[var(--surface-2)]'
```

- [ ] **Step 4: Commit**

```bash
cd "/Users/meiyang/Desktop/NEURIX os/neurix"
git add components/ui/Button.tsx components/ui/Slider.tsx components/scan/AgentModeSelector.tsx
git commit -m "fix: replace hardcoded bg-white with surface tokens for dark theme"
```

---

## Task 4: Create ScanCore Component

**Files:**
- Create: `components/scan/ScanCore.tsx`

- [ ] **Step 1: Create the component**

Create `components/scan/ScanCore.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { ArchetypeDriftLabel } from '@/components/scan/ArchetypeDriftLabel'
import { FloatingCard } from '@/components/ui/FloatingCard'

const STATUS_MESSAGES = [
  'Analyzing biomechanical signal...',
  'Signal integrity: 92%',
]

const READINESS_MESSAGES = [
  'Neural profile stabilizing...',
  'Readiness: 72% → 84%',
]

export function ScanCore() {
  const [statusIdx, setStatusIdx] = useState(0)
  const [readinessIdx, setReadinessIdx] = useState(0)

  useEffect(() => {
    const t1 = setInterval(() => {
      setStatusIdx((i) => (i + 1) % STATUS_MESSAGES.length)
    }, 3000)
    const t2 = setInterval(() => {
      setReadinessIdx((i) => (i + 1) % READINESS_MESSAGES.length)
    }, 3000)
    return () => {
      clearInterval(t1)
      clearInterval(t2)
    }
  }, [])

  return (
    <div className="relative flex items-center justify-center w-full h-full">

      {/* Layer A — Radial glow (energy source) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.08), transparent 70%)',
        }}
      />

      {/* Layer B — Pulse ring */}
      <div className="relative flex items-center justify-center">
        <div className="pulse-ring absolute w-64 h-64 rounded-full border border-white/20" />

        {/* Layer C — Scan line (clipped inside core) */}
        <div className="relative w-64 h-64 rounded-full overflow-hidden flex items-center justify-center">
          <div
            className="absolute top-0 left-0 w-full h-[2px] bg-white/10"
            style={{ animation: 'scan 2s linear infinite' }}
          />

          {/* Layer D — Breathing body */}
          <div
            className="w-48 h-48 rounded-full bg-white/[0.03] flex items-center justify-center"
            style={{ animation: 'breathe 3s ease-in-out infinite' }}
          >
            {/* SVG human silhouette */}
            <svg
              viewBox="0 0 60 120"
              className="w-16 h-32 opacity-15"
              fill="none"
              stroke="white"
              strokeWidth="1"
            >
              {/* Head */}
              <circle cx="30" cy="12" r="8" />
              {/* Neck */}
              <line x1="30" y1="20" x2="30" y2="26" />
              {/* Shoulders */}
              <line x1="10" y1="30" x2="50" y2="30" />
              {/* Arms */}
              <line x1="10" y1="30" x2="6" y2="60" />
              <line x1="50" y1="30" x2="54" y2="60" />
              {/* Torso */}
              <line x1="30" y1="26" x2="30" y2="75" />
              {/* Hips */}
              <line x1="18" y1="75" x2="42" y2="75" />
              {/* Legs */}
              <line x1="20" y1="75" x2="16" y2="110" />
              <line x1="40" y1="75" x2="44" y2="110" />
            </svg>
          </div>
        </div>
      </div>

      {/* Archetype label — above core */}
      <div className="absolute" style={{ top: 'calc(50% - 160px)' }}>
        <ArchetypeDriftLabel />
      </div>

      {/* System copy — below core */}
      <div
        className="absolute font-mono-data text-white/40"
        style={{ top: 'calc(50% + 148px)' }}
      >
        NEURIX calibrating your profile...
      </div>

      {/* FloatingCard — top left (system status) */}
      <FloatingCard className="absolute top-1/4 left-8 w-52">
        <div className="font-mono-data mb-1.5">SYSTEM STATUS</div>
        <div className="text-[13px] text-white/80 transition-all duration-500">
          {STATUS_MESSAGES[statusIdx]}
        </div>
      </FloatingCard>

      {/* FloatingCard — bottom right (readiness) */}
      <FloatingCard className="absolute bottom-1/4 right-8 w-52">
        <div className="font-mono-data mb-1.5">READINESS</div>
        <div className="text-[13px] text-white/80 transition-all duration-500">
          {READINESS_MESSAGES[readinessIdx]}
        </div>
      </FloatingCard>

    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/meiyang/Desktop/NEURIX os/neurix"
git add components/scan/ScanCore.tsx
git commit -m "feat: create ScanCore with 4-layer animation (glow, pulse, scan, breathe)"
```

---

## Task 5: Create BottomDrawer Component

**Files:**
- Create: `components/scan/BottomDrawer.tsx`

- [ ] **Step 1: Create the component**

Create `components/scan/BottomDrawer.tsx`:

```tsx
'use client'

import { useState, ReactNode } from 'react'

interface BottomDrawerProps {
  children: ReactNode
  onAnalyze: () => void
}

export function BottomDrawer({ children, onAnalyze }: BottomDrawerProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Dim overlay — rendered when open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col"
        style={{
          height: '60vh',
          transform: open ? 'translateY(0)' : 'translateY(calc(100% - 56px))',
          transition: 'transform 350ms ease-in-out',
        }}
      >
        {/* Collapsed strip / drawer handle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-between px-6 h-14 shrink-0 bg-[#111111] border-t border-white/[0.08] cursor-pointer w-full text-left"
        >
          <div className="flex flex-col gap-0.5">
            <span className="font-mono-data text-white/60">SYSTEM INPUT LAYER</span>
            <span className="font-mono-data text-white/30">BIOMETRICS · HABITS · MODE</span>
          </div>
          <span
            className="font-mono-data text-white/40 transition-transform duration-350"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            ↑
          </span>
        </button>

        {/* Scrollable input content */}
        <div className="flex-1 overflow-y-auto bg-[#111111] px-6 pt-6 pb-4 flex flex-col gap-8">
          {children}

          {/* CTA */}
          <button
            onClick={onAnalyze}
            className="w-full py-3 bg-white text-black rounded-[10px] font-mono-data hover:opacity-90 transition-opacity cursor-pointer shrink-0"
          >
            Begin Full Scan →
          </button>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/meiyang/Desktop/NEURIX os/neurix"
git add components/scan/BottomDrawer.tsx
git commit -m "feat: create BottomDrawer with dim overlay and 350ms slide animation"
```

---

## Task 6: Rebuild Scan Page Layout

**Files:**
- Modify: `app/scan/page.tsx`

- [ ] **Step 1: Replace the scan page**

Replace the entire content of `app/scan/page.tsx` with:

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { ScanCore } from '@/components/scan/ScanCore'
import { BottomDrawer } from '@/components/scan/BottomDrawer'
import { BiometricSliders } from '@/components/scan/BiometricSliders'
import { HabitGrid } from '@/components/scan/HabitGrid'
import { VoiceInput } from '@/components/scan/VoiceInput'
import { AgentModeSelector } from '@/components/scan/AgentModeSelector'

export default function ScanPage() {
  const router = useRouter()

  const handleAnalyze = () => {
    router.push('/thinking')
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-[var(--bg)] overflow-hidden">

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/[0.08] shrink-0 z-10">
        <span className="font-mono-data">NEURIX · SCAN</span>
      </header>

      {/* Center stage — ScanCore fills remaining space above drawer */}
      <main className="flex-1 flex items-center justify-center" style={{ paddingBottom: '56px' }}>
        <ScanCore />
      </main>

      {/* Bottom drawer with all inputs */}
      <BottomDrawer onAnalyze={handleAnalyze}>
        <section>
          <div className="font-mono-data mb-5">BIOMETRICS</div>
          <BiometricSliders />
        </section>
        <section>
          <VoiceInput />
        </section>
        <section>
          <HabitGrid />
        </section>
        <section>
          <AgentModeSelector />
        </section>
      </BottomDrawer>

    </div>
  )
}
```

- [ ] **Step 2: Verify scan page visually**

Open `http://localhost:3000/scan`.

Check:
- Dark background fills full screen
- Radial glow visible at center
- Pulse ring animates
- Scan line moves top → bottom inside the circle
- Body silhouette breathes (scale pulse)
- Archetype label shows above the circle
- "NEURIX calibrating your profile..." text below
- Two floating cards visible (system status + readiness)
- Bottom strip shows "SYSTEM INPUT LAYER"
- Clicking strip slides drawer up with 350ms ease
- Overlay dims the background when drawer open
- Clicking overlay closes drawer
- "Begin Full Scan →" button in drawer navigates to `/thinking`

- [ ] **Step 3: Commit**

```bash
cd "/Users/meiyang/Desktop/NEURIX os/neurix"
git add app/scan/page.tsx
git commit -m "feat: rebuild scan page — full-screen ScanCore + BottomDrawer layout"
```

---

## Task 7: Restyle Thinking Page

**Files:**
- Modify: `app/thinking/page.tsx`

- [ ] **Step 1: Add staged messages + progress bar + pulsing dot to thinking page**

Replace the content inside the thinking page's main centered div. Find this section in `app/thinking/page.tsx`:

```tsx
return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="mb-10">
          <div className="font-mono-data mb-2">NEURIX · ANALYZING PROFILE</div>
          <h2 className="text-[22px] font-semibold tracking-tight text-[var(--text)]">
            NEURIX is analyzing your biometric profile...
          </h2>
        </div>

        {/* Steps */}
        <ThinkingSequence onComplete={handleAnimationComplete} />
      </div>
    </div>
  )
```

Replace with:

```tsx
return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-8">
      <div className="max-w-lg w-full">

        {/* Pulsing dot + headline */}
        <div className="mb-10 flex flex-col gap-3">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <h2 className="text-[22px] font-semibold tracking-tight text-[var(--text)]">
            NEURIX is constructing your profile...
          </h2>
          <div className="font-mono-data text-white/40">
            {STAGED_MESSAGES[stagedIdx]}
          </div>
        </div>

        {/* Steps */}
        <ThinkingSequence onComplete={handleAnimationComplete} />

        {/* Progress bar */}
        <div className="mt-10 w-full h-[1px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/40 rounded-full"
            style={{ animation: 'progress 8s linear forwards' }}
          />
        </div>

      </div>
    </div>
  )
```

- [ ] **Step 2: Add the STAGED_MESSAGES constant and stagedIdx state**

At the top of the `ThinkingPage` component function (after the existing state declarations), add:

```tsx
const STAGED_MESSAGES = [
  'Mapping biomechanics...',
  'Detecting neural patterns...',
  'Comparing historical records...',
]

const [stagedIdx, setStagedIdx] = useState(0)

useEffect(() => {
  const t = setInterval(() => {
    setStagedIdx((i) => (i + 1) % STAGED_MESSAGES.length)
  }, 2000)
  return () => clearInterval(t)
}, [])
```

Make sure `useState` is already imported (it is). No new imports needed.

- [ ] **Step 3: Add progress keyframe to globals.css**

Append to `app/globals.css`:

```css
@keyframes progress {
  from { width: 0%; }
  to   { width: 100%; }
}
```

- [ ] **Step 4: Fix error state background**

In `app/thinking/page.tsx`, find the error return:

```tsx
<div className="min-h-screen bg-white flex flex-col items-center justify-center px-8">
```

Change `bg-white` to `bg-[var(--bg)]`.

- [ ] **Step 5: Verify thinking page visually**

Navigate to `/scan`, open drawer, click "Begin Full Scan →".

Check:
- Dark background
- Pulsing white dot
- Headline text is white
- Staged sub-label cycles every 2s
- ThinkingSequence steps appear white → dimmed on complete
- Thin progress bar fills across ~8 seconds

- [ ] **Step 6: Commit**

```bash
cd "/Users/meiyang/Desktop/NEURIX os/neurix"
git add app/thinking/page.tsx app/globals.css
git commit -m "feat: upgrade thinking page with staged messages, pulsing dot, progress bar"
```

---

## Task 8: Update Results Page

**Files:**
- Modify: `app/results/page.tsx`

- [ ] **Step 1: Update FloatingCard import path**

In `app/results/page.tsx`, find:

```tsx
import { FloatingCard } from '@/components/results/FloatingCard'
```

Replace with:

```tsx
import { FloatingCard } from '@/components/ui/FloatingCard'
```

- [ ] **Step 2: Soften section borders**

In `app/results/page.tsx`, find all occurrences of:

```tsx
border-b border-[0.5px] border-[var(--border)]
```

and:

```tsx
border-t border-[0.5px] border-[var(--border)]
```

Replace with `border-white/[0.06]` in each case. Example:

```tsx
// Before
className="... border-b border-[0.5px] border-[var(--border)]"

// After  
className="... border-b border-white/[0.06]"
```

- [ ] **Step 3: Increase section spacing**

In `app/results/page.tsx`, find:

```tsx
<section className="px-8 pt-10 pb-10 mt-8 border-t border-[0.5px] border-[var(--border)]">
```

Change to:

```tsx
<section className="px-8 pt-14 pb-14 mt-8 border-t border-white/[0.06]">
```

And:

```tsx
<section className="px-8 pb-16 flex flex-col gap-12">
```

Change to:

```tsx
<section className="px-8 pb-20 flex flex-col gap-16">
```

- [ ] **Step 4: Remove old re-export from results/FloatingCard.tsx**

Now that `results/page.tsx` imports directly from `ui/FloatingCard`, delete the re-export shim:

Delete `components/results/FloatingCard.tsx` entirely (it now only contains a re-export comment).

```bash
rm "/Users/meiyang/Desktop/NEURIX os/neurix/components/results/FloatingCard.tsx"
```

- [ ] **Step 5: Verify results page visually**

Navigate through the full flow: `/scan` → open drawer → fill inputs → "Begin Full Scan →" → wait for thinking page → results.

Check:
- Dark background throughout
- FloatingCards have dark glassmorphism look (barely-there surface)
- Section borders are very subtle
- More breathing room between sections
- 3D body panel visible in center column

- [ ] **Step 6: Commit**

```bash
cd "/Users/meiyang/Desktop/NEURIX os/neurix"
git add app/results/page.tsx
git rm components/results/FloatingCard.tsx
git commit -m "feat: update results page — dark surfaces, softer borders, direct FloatingCard import"
```

---

## Final Verification Checklist

After all tasks complete, run through the full user flow:

- [ ] `/scan` — dark full screen, ScanCore visible and animated, drawer collapses/expands smoothly
- [ ] `/thinking` — dark, pulsing dot, staged messages cycle, ThinkingSequence steps visible in white
- [ ] `/results` — dark, 3D body center, floating cards barely-there, generous spacing
- [ ] No white boxes or flash of light background anywhere
- [ ] Sliders thumb is visible (white dot) on dark track
- [ ] AgentModeSelector: inactive = dark surface, active = white bg with black text
- [ ] All text legible — no white-on-white or black-on-black
