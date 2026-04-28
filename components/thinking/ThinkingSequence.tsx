'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useAtlasStore } from '@/store/atlasStore'

export interface PipelineEvents {
  archetype: boolean
  soul_twins: boolean
  reflection: boolean
  done: boolean
}

const STEPS = [
  { text: 'BODY SIGNAL', detail: 'Biometric vector normalized' },
  { text: 'HABIT VECTOR', detail: 'Activity pattern layered into signal' },
  { text: 'SYNTHETIC ARCHIVE', detail: 'Anonymized Team USA-inspired nodes scanned' },
  { text: 'ETHICS FILTER', detail: 'No real athlete identity or record used' },
  { text: 'AGENT SYNTHESIS', detail: null },
  { text: 'DEBRIEF READY', detail: 'Archetype lock prepared' },
]

// Which pipeline event must arrive before each step can complete
const STEP_GATES: Array<keyof PipelineEvents> = [
  'archetype', 'archetype', 'soul_twins', 'soul_twins', 'reflection', 'done',
]

const MIN_ACTIVE_MS = 750

type StepStatus = 'pending' | 'active' | 'done'

interface StepState {
  text: string
  detail: string | null
  status: StepStatus
  showDetail: boolean
}

interface ThinkingSequenceProps {
  onComplete: () => void
  pipelineEvents: PipelineEvents
}

export function ThinkingSequence({ onComplete, pipelineEvents }: ThinkingSequenceProps) {
  const insightPeek = useAtlasStore((s) => s.insightPeek)

  const [steps, setSteps] = useState<StepState[]>(
    STEPS.map((s) => ({ text: s.text, detail: s.detail, status: 'pending' as StepStatus, showDetail: false }))
  )

  // All mutable state lives in refs to avoid stale closure issues
  const currentRef = useRef(0)
  const activatedAtRef = useRef(Date.now())
  const completedRef = useRef(false)
  const pipelineRef = useRef(pipelineEvents)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => { pipelineRef.current = pipelineEvents }, [pipelineEvents])
  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])

  // Checks if the current active step can advance (both time and event gates must pass)
  const advanceIfReady = useCallback(() => {
    if (completedRef.current) return

    const i = currentRef.current
    if (i >= STEPS.length) return

    const eventReady = pipelineRef.current[STEP_GATES[i]]
    const elapsed = Date.now() - activatedAtRef.current

    if (!eventReady || elapsed < MIN_ACTIVE_MS) return

    setSteps((prev) =>
      prev.map((s, idx) => idx === i ? { ...s, status: 'done' } : s)
    )

    const next = i + 1
    if (next >= STEPS.length) {
      completedRef.current = true
      setTimeout(() => onCompleteRef.current(), 400)
      return
    }

    currentRef.current = next
    activatedAtRef.current = Date.now()

    setSteps((prev) =>
      prev.map((s, idx) => idx === next ? { ...s, status: 'active' } : s)
    )
    setTimeout(() => {
      setSteps((prev) =>
        prev.map((s, idx) => idx === next ? { ...s, showDetail: true } : s)
      )
    }, 350)

    // Schedule next check after minimum display time
    setTimeout(advanceIfReady, MIN_ACTIVE_MS + 100)
  }, []) // stable — all state accessed via refs

  // Activate step 0 immediately on mount
  useEffect(() => {
    currentRef.current = 0
    activatedAtRef.current = Date.now()
    setSteps((prev) =>
      prev.map((s, idx) => idx === 0 ? { ...s, status: 'active' } : s)
    )
    setTimeout(() => {
      setSteps((prev) =>
        prev.map((s, idx) => idx === 0 ? { ...s, showDetail: true } : s)
      )
    }, 350)
    setTimeout(advanceIfReady, MIN_ACTIVE_MS + 100)
  }, [advanceIfReady])

  // Re-check advancement whenever a new pipeline event arrives
  useEffect(() => {
    advanceIfReady()
  }, [pipelineEvents, advanceIfReady])

  // Inject streamed insight preview into AGENT SYNTHESIS step
  useEffect(() => {
    if (insightPeek) {
      setSteps((prev) =>
        prev.map((s, idx) => idx === 4 ? { ...s, detail: `"${insightPeek}"` } : s)
      )
    }
  }, [insightPeek])

  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => (
        <div
          key={i}
          className={`transition-opacity duration-300 ${step.status === 'pending' ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="flex items-center gap-3 py-2">
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-500 ${
              step.status === 'done' ? 'bg-[var(--text-3)]' : 'bg-[var(--text)]'
            }`} />
            <span className={`text-[14px] transition-colors duration-500 ${
              step.status === 'done'
                ? 'text-[var(--text-3)]'
                : step.status === 'active'
                ? 'text-[var(--text)]'
                : 'text-[var(--text-3)]'
            }`}>
              {step.text}
              {step.status === 'active' && !step.showDetail && (
                <span className="cursor-blink" />
              )}
            </span>
          </div>

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
