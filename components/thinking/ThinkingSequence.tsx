'use client'

import { useEffect, useState } from 'react'
import { useAtlasStore } from '@/store/atlasStore'

interface Step {
  text: string
  detail?: string | null
}

const STEPS: Step[] = [
  { text: 'Reading biometric input' },
  { text: 'Matching historical athlete clusters', detail: '12,482 profiles scanned' },
  { text: 'Evaluating Olympic / Paralympic distribution', detail: 'Olympic 62% · Paralympic 38%' },
  { text: 'Inferring archetype classification' },
  { text: 'Generating narrative insight', detail: null }, // populated from insightPeek
  { text: 'Mapping potential sport alignment' },
]

interface ThinkingSequenceProps {
  onComplete: () => void
}

interface StepState {
  text: string
  detail?: string | null
  status: 'pending' | 'active' | 'done'
  showDetail: boolean
}

export function ThinkingSequence({ onComplete }: ThinkingSequenceProps) {
  const insightPeek = useAtlasStore((s) => s.insightPeek)
  const [stepStates, setStepStates] = useState<StepState[]>(
    STEPS.map((s) => ({ ...s, status: 'pending', showDetail: false }))
  )

  useEffect(() => {
    let cancelled = false

    const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

    async function run() {
      for (let i = 0; i < STEPS.length; i++) {
        if (cancelled) return

        // Activate step
        setStepStates((prev) =>
          prev.map((s, idx) =>
            idx === i ? { ...s, status: 'active' } : s
          )
        )

        await delay(600 + Math.random() * 200)
        if (cancelled) return

        // Show detail if exists
        const step = STEPS[i]
        if (step.detail !== undefined) {
          setStepStates((prev) =>
            prev.map((s, idx) => (idx === i ? { ...s, showDetail: true } : s))
          )
          await delay(400)
          if (cancelled) return
        }

        // Complete step
        setStepStates((prev) =>
          prev.map((s, idx) =>
            idx === i ? { ...s, status: 'done' } : s
          )
        )
      }

      if (!cancelled) onComplete()
    }

    run()
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Inject insightPeek into step 4 detail
  useEffect(() => {
    if (insightPeek) {
      setStepStates((prev) =>
        prev.map((s, idx) =>
          idx === 4 ? { ...s, detail: `"${insightPeek}"` } : s
        )
      )
    }
  }, [insightPeek])

  return (
    <div className="flex flex-col gap-0">
      {stepStates.map((step, i) => (
        <div key={i} className={`transition-opacity duration-300 ${step.status === 'pending' ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex items-center gap-3 py-2">
            {/* Dot indicator */}
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
              step.status === 'done' ? 'bg-[var(--text-3)]' : 'bg-[var(--text)]'
            }`} />

            <span
              className={`text-[14px] transition-colors duration-500 ${
                step.status === 'done'
                  ? 'text-[var(--text-3)]'
                  : step.status === 'active'
                  ? `text-[var(--text)] ${step.detail === undefined ? 'cursor-blink' : ''}`
                  : 'text-[var(--text-3)]'
              }`}
            >
              {step.text}
              {step.status === 'active' && step.detail === undefined && (
                <span className="cursor-blink" />
              )}
            </span>
          </div>

          {/* Detail line */}
          {step.showDetail && step.detail && (
            <div className="pl-[18px] pb-2 fade-in">
              <span className="font-mono text-[12px] text-[var(--text-2)] tracking-tight">
                → {step.detail}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
