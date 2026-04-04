'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAtlasStore } from '@/store/atlasStore'
import { ThinkingSequence } from '@/components/thinking/ThinkingSequence'
import type { ArchetypeResult, SoulTwin, AdvisorResult, ReflectionResult } from '@/types/atlas'

export default function ThinkingPage() {
  const router = useRouter()
  const biometrics = useAtlasStore((s) => s.biometrics)
  const setResult = useAtlasStore((s) => s.setResult)
  const setInsightPeek = useAtlasStore((s) => s.setInsightPeek)
  const [apiError, setApiError] = useState<string | null>(null)

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
    tryNavigate()
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

        // Safety: mark done even if no 'done' event
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
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-8">
        <div className="max-w-lg w-full flex flex-col gap-6">
          <div className="font-mono-data text-red-500">NEURIX · ERROR</div>
          <h2 className="text-[22px] font-semibold tracking-tight text-[var(--text)]">
            Analysis failed
          </h2>
          <p className="text-[13px] text-[var(--text-2)] font-mono-data">{apiError}</p>
          <button
            onClick={() => router.replace('/scan')}
            className="self-start px-5 py-2.5 text-[13px] font-mono-data bg-[var(--text)] text-white rounded-[10px] hover:opacity-80 transition-opacity cursor-pointer"
          >
            ← Try again
          </button>
        </div>
      </div>
    )
  }

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
}
