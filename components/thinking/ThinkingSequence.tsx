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

type StepStatus = 'pending' | 'active' | 'done'

interface StepState {
  text: string
  detail?: string | null
  status: StepStatus
  showDetail: boolean
}

interface ThinkingSequenceProps {
  onComplete: () => void
  onStepChange?: (stepIndex: number) => void
}

function StatusTag({ status }: { status: StepStatus }) {
  if (status === 'pending') return null
  if (status === 'done') {
    return (
      <span
        className="flex-shrink-0 font-mono tracking-[0.12em] uppercase"
        style={{ fontSize: 9, color: 'rgba(var(--glow-rgb), 0.35)' }}
      >
        COMPLETE
      </span>
    )
  }
  return (
    <span
      className="flex-shrink-0 font-mono tracking-[0.12em] uppercase"
      style={{
        fontSize: 9,
        color: 'var(--glow)',
        textShadow: '0 0 6px rgba(var(--glow-rgb), 0.6)',
        animation: 'step-tag-pulse 1.2s ease-in-out infinite',
      }}
    >
      PROCESSING
    </span>
  )
}

export function ThinkingSequence({ onComplete, onStepChange }: ThinkingSequenceProps) {
  const insightPeek = useAtlasStore((s) => s.insightPeek)
  const [stepStates, setStepStates] = useState<StepState[]>(
    STEPS.map((s) => ({ ...s, status: 'pending' as StepStatus, showDetail: false }))
  )

  useEffect(() => {
    let cancelled = false
    const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

    async function run() {
      for (let i = 0; i < STEPS.length; i++) {
        if (cancelled) return

        setStepStates((prev) =>
          prev.map((s, idx) => idx === i ? { ...s, status: 'active' as StepStatus } : s)
        )
        onStepChange?.(i)

        await delay(600 + Math.random() * 200)
        if (cancelled) return

        const step = STEPS[i]
        if (step.detail !== undefined) {
          setStepStates((prev) =>
            prev.map((s, idx) => idx === i ? { ...s, showDetail: true } : s)
          )
          await delay(400)
          if (cancelled) return
        }

        setStepStates((prev) =>
          prev.map((s, idx) => idx === i ? { ...s, status: 'done' as StepStatus } : s)
        )
      }

      if (!cancelled) onComplete()
    }

    run()
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (insightPeek) {
      setStepStates((prev) =>
        prev.map((s, idx) => idx === 4 ? { ...s, detail: `"${insightPeek}"` } : s)
      )
    }
  }, [insightPeek])

  return (
    <div className="flex flex-col gap-0">
      {stepStates.map((step, i) => {
        const isActive  = step.status === 'active'
        const isDone    = step.status === 'done'
        const isPending = step.status === 'pending'

        return (
          <div
            key={i}
            className="transition-opacity duration-300"
            style={{ opacity: isPending ? 0 : 1 }}
          >
            <div className="flex items-center gap-3 py-2.5">
              {/* Step number */}
              <span
                className="font-mono flex-shrink-0 w-6 text-right"
                style={{
                  fontSize: 10,
                  color: isDone
                    ? 'rgba(var(--glow-rgb), 0.3)'
                    : isActive
                    ? 'var(--glow)'
                    : 'var(--text-3)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Dot */}
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-500"
                style={{
                  background: isDone
                    ? 'rgba(var(--glow-rgb), 0.3)'
                    : isActive
                    ? 'var(--glow)'
                    : 'var(--text-3)',
                  boxShadow: isActive ? '0 0 6px rgba(var(--glow-rgb), 0.8)' : 'none',
                }}
              />

              {/* Step text */}
              <span
                className="flex-1 transition-all duration-500"
                style={{
                  fontSize: isActive ? 16 : 14,
                  fontWeight: isActive ? 500 : 400,
                  color: isDone
                    ? 'var(--text-3)'
                    : isActive
                    ? 'var(--text)'
                    : 'var(--text-3)',
                  textDecoration: isDone ? 'line-through' : 'none',
                  textDecorationColor: 'rgba(var(--glow-rgb), 0.35)',
                }}
              >
                {step.text}
                {isActive && step.detail === undefined && (
                  <span className="cursor-blink" />
                )}
              </span>

              {/* Status tag */}
              <StatusTag status={step.status} />
            </div>

            {/* Detail line */}
            {step.showDetail && step.detail && (
              <div className="pl-[52px] pb-1.5 fade-in">
                <span
                  className="font-mono tracking-tight"
                  style={{ fontSize: 11, color: 'rgba(var(--glow-rgb), 0.55)' }}
                >
                  → {step.detail}
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
