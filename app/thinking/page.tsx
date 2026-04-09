'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAtlasStore } from '@/store/atlasStore'
import { ThinkingSequence } from '@/components/thinking/ThinkingSequence'
import { NeuralNetwork } from '@/components/thinking/NeuralNetwork'
import type { ArchetypeResult, SoulTwin, AdvisorResult, ReflectionResult } from '@/types/atlas'

const TOTAL_STEPS = 6

function SegmentedProgress({ completedSteps, activeStep }: { completedSteps: number; activeStep: number }) {
  return (
    <div className="flex items-center gap-1.5 w-full">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const isDone   = i < completedSteps
        const isActive = i === activeStep && i >= completedSteps
        return (
          <div
            key={i}
            className="flex-1 rounded-full overflow-hidden"
            style={{ height: 3, background: 'var(--border)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: isDone ? '100%' : isActive ? '60%' : '0%',
                background: isDone
                  ? 'var(--glow)'
                  : isActive
                  ? `linear-gradient(to right, var(--glow), rgba(var(--glow-rgb), 0.4))`
                  : 'transparent',
                boxShadow: (isDone || isActive) ? '0 0 6px rgba(var(--glow-rgb), 0.5)' : 'none',
                transition: 'width 0.4s ease, background 0.3s',
                transformOrigin: 'left',
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

export default function ThinkingPage() {
  const router = useRouter()
  const biometrics = useAtlasStore((s) => s.biometrics)
  const setResult = useAtlasStore((s) => s.setResult)
  const setInsightPeek = useAtlasStore((s) => s.setInsightPeek)
  const [apiError, setApiError] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(0)

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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const animationDoneRef = useRef(false)
  const apiDoneRef = useRef(false)
  const apiErrorRef = useRef<string | null>(null)
  const resultRef = useRef<{
    archetype?: ArchetypeResult
    advisor?: AdvisorResult
    soul_twins?: SoulTwin[]
    reflection?: ReflectionResult
  }>({})

  const tryNavigate = () => {
    if (animationDoneRef.current && apiDoneRef.current) {
      const r = resultRef.current
      if (r.archetype && r.advisor && r.soul_twins && r.reflection) {
        setResult({
          archetype: r.archetype,
          soul_twins: r.soul_twins,
          reflection: r.reflection,
          advisor: r.advisor,
        })
        router.push('/results')
      } else {
        const errMsg = apiErrorRef.current ?? 'Analysis returned incomplete data. Please try again.'
        setApiError(errMsg)
      }
    }
  }

  const handleAnimationComplete = () => {
    animationDoneRef.current = true
    setCompletedSteps(TOTAL_STEPS)
    tryNavigate()
  }

  const handleStepChange = (stepIndex: number) => {
    setActiveStep(stepIndex)
    setCompletedSteps(stepIndex)
  }

  useEffect(() => {
    let controller: AbortController | null = new AbortController()

    async function fetchAnalysis() {
      if (!biometrics) {
        router.replace('/scan')
        return
      }

      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(biometrics),
          signal: controller?.signal,
        })

        if (!res.ok || !res.body) throw new Error('API error')

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            try {
              const msg = JSON.parse(line.slice(6))
              if (msg.type === 'archetype') {
                resultRef.current.archetype = msg.data
              } else if (msg.type === 'advisor') {
                resultRef.current.advisor = msg.data
              } else if (msg.type === 'soul_twins') {
                resultRef.current.soul_twins = msg.data
              } else if (msg.type === 'reflection') {
                resultRef.current.reflection = msg.data
              } else if (msg.type === 'insight_peek') {
                setInsightPeek(msg.data)
              } else if (msg.type === 'done') {
                apiDoneRef.current = true
                tryNavigate()
              } else if (msg.type === 'error') {
                apiErrorRef.current = `Gemini API error: ${msg.data}`
                apiDoneRef.current = true
                tryNavigate()
              }
            } catch { /* malformed chunk */ }
          }
        }

        apiDoneRef.current = true
        tryNavigate()
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        apiErrorRef.current = (err as Error).message ?? 'Network error'
        apiDoneRef.current = true
        tryNavigate()
      }
    }

    fetchAnalysis()

    return () => {
      controller?.abort()
      controller = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (apiError) {
    return (
      <div
        className="dark-theme min-h-screen flex flex-col items-center justify-center px-8"
        style={{ background: 'var(--bg)', color: 'var(--text)' }}
      >
        <div className="max-w-lg w-full flex flex-col gap-6">
          <div
            className="font-mono tracking-[0.14em] uppercase"
            style={{ fontSize: 10, color: '#f87171' }}
          >
            ATLAS · ERROR
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>
            Analysis failed
          </h2>
          <p
            className="font-mono"
            style={{ fontSize: 12, color: 'var(--text-2)', letterSpacing: '0.06em' }}
          >
            {apiError}
          </p>
          <button
            onClick={() => router.replace('/scan')}
            className="self-start rounded-lg transition-all duration-200 cursor-pointer"
            style={{
              padding: '10px 20px',
              fontSize: 12,
              fontFamily: 'var(--mono)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              border: '1px solid rgba(var(--glow-rgb), 0.4)',
              background: 'rgba(var(--glow-rgb), 0.06)',
              color: 'var(--glow)',
            }}
          >
            ← Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="dark-theme min-h-screen flex flex-col"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      {/* Header */}
      <header
        className="px-8 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="font-orbitron tracking-[0.2em] uppercase"
            style={{
              fontSize: 11,
              color: 'var(--glow)',
              textShadow: '0 0 8px rgba(var(--glow-rgb), 0.6)',
            }}
          >
            ATLAS
          </span>
          <span style={{ color: 'var(--border-2)' }}>·</span>
          <span
            className="font-mono tracking-[0.15em] uppercase"
            style={{ fontSize: 10, color: 'var(--text-3)' }}
          >
            ANALYZING
          </span>
        </div>
        <div
          className="font-mono tracking-[0.1em] uppercase"
          style={{ fontSize: 9, color: 'var(--text-3)' }}
        >
          {completedSteps}/{TOTAL_STEPS} STEPS
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 py-10">
        <div className="w-full max-w-2xl flex flex-col gap-10">
          {/* Staged message */}
          <div
            className="font-mono tracking-[0.08em] uppercase"
            style={{ fontSize: 11, color: 'var(--text-3)' }}
          >
            {STAGED_MESSAGES[stagedIdx]}
          </div>

          {/* Neural network visualization */}
          <section>
            <NeuralNetwork activeStep={activeStep} />
          </section>

          {/* Segmented progress bar */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span
                className="font-orbitron tracking-[0.15em] uppercase"
                style={{ fontSize: 10, color: 'var(--text-3)' }}
              >
                Processing Pipeline
              </span>
              <span
                className="font-mono"
                style={{ fontSize: 10, color: 'var(--glow)', opacity: 0.7 }}
              >
                {Math.round((completedSteps / TOTAL_STEPS) * 100)}%
              </span>
            </div>
            <SegmentedProgress completedSteps={completedSteps} activeStep={activeStep} />
          </section>

          {/* Step sequence */}
          <section>
            <ThinkingSequence
              onComplete={handleAnimationComplete}
              onStepChange={handleStepChange}
            />
          </section>
        </div>
      </main>
    </div>
  )
}
