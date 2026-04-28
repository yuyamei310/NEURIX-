'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { useAtlasStore } from '@/store/atlasStore'
import { ThinkingSequence } from '@/components/thinking/ThinkingSequence'
import type { PipelineEvents } from '@/components/thinking/ThinkingSequence'
import { getSyntheticArchiveProfile } from '@/lib/syntheticArchive'
import type {
  ArchetypeResult,
  SoulTwin,
  AdvisorResult,
  ReflectionResult,
  CoachResult,
  MentorResult,
} from '@/types/atlas'

export default function ThinkingPage() {
  const router = useRouter()
  const biometrics = useAtlasStore((s) => s.biometrics)
  const setResult = useAtlasStore((s) => s.setResult)
  const setCoachResult = useAtlasStore((s) => s.setCoachResult)
  const setMentorResult = useAtlasStore((s) => s.setMentorResult)
  const setInsightPeek = useAtlasStore((s) => s.setInsightPeek)
  const [apiError, setApiError] = useState<string | null>(null)
  const [lockReveal, setLockReveal] = useState<ArchetypeResult | null>(null)
  const [pipelineEvents, setPipelineEvents] = useState<PipelineEvents>({
    archetype: false,
    soul_twins: false,
    reflection: false,
    done: false,
  })

  const STAGED_MESSAGES = [
    'Reading body signal...',
    'Building habit vector...',
    'Checking synthetic archive...',
    'Applying ethics filter...',
    'Preparing agent synthesis...',
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
    coach?: CoachResult
    mentor?: MentorResult
  }>({})
  const navigatingRef = useRef(false)

  const tryNavigate = () => {
    if (animationDoneRef.current && apiDoneRef.current && !navigatingRef.current) {
      const r = resultRef.current
      if (r.archetype && r.advisor && r.soul_twins && r.reflection) {
        navigatingRef.current = true
        setResult({
          archetype: r.archetype,
          soul_twins: r.soul_twins,
          reflection: r.reflection,
          advisor: r.advisor,
          coach: r.coach,
          mentor: r.mentor,
        })
        if (r.coach) setCoachResult(r.coach)
        if (r.mentor) setMentorResult(r.mentor)
        setLockReveal(r.archetype)
        window.setTimeout(() => router.push('/results'), 1350)
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
                setPipelineEvents((prev) => ({ ...prev, archetype: true }))
              } else if (msg.type === 'advisor') {
                resultRef.current.advisor = msg.data
              } else if (msg.type === 'soul_twins') {
                resultRef.current.soul_twins = msg.data
                setPipelineEvents((prev) => ({ ...prev, soul_twins: true }))
              } else if (msg.type === 'reflection') {
                resultRef.current.reflection = msg.data
                setPipelineEvents((prev) => ({ ...prev, reflection: true }))
              } else if (msg.type === 'coach') {
                resultRef.current.coach = msg.data
              } else if (msg.type === 'mentor') {
                resultRef.current.mentor = msg.data
              } else if (msg.type === 'insight_peek') {
                setInsightPeek(msg.data)
              } else if (msg.type === 'done') {
                setPipelineEvents((prev) => ({ ...prev, done: true }))
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

  if (lockReveal) {
    const profile = getSyntheticArchiveProfile(lockReveal.archetype)
    return (
      <div
        className="relative min-h-screen overflow-hidden bg-[var(--bg)] flex items-center justify-center px-8"
        style={{ '--active-archetype-color': profile.color } as CSSProperties}
      >
        <div className="absolute inset-0 sys-grid opacity-60" />
        <div className="scan-beam" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${profile.color}24, transparent 58%)`,
          }}
        />
        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-white/35 mb-5">
            Ethics safe · synthetic archive · {profile.id}
          </div>
          <h1
            className="font-mono font-black uppercase leading-none"
            style={{
              color: profile.color,
              fontSize: 'clamp(44px, 9vw, 104px)',
              textShadow: `0 0 42px ${profile.color}55`,
            }}
          >
            {lockReveal.archetype} profile locked
          </h1>
          <div className="mt-5 font-mono text-[12px] tracking-[0.18em] uppercase text-white/45">
            {lockReveal.signal_label} · {Math.round(lockReveal.confidence * 100)}% signal confidence
          </div>
          <div className="mt-8 h-px w-64 overflow-hidden bg-white/10">
            <div
              className="h-full w-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${profile.color}, transparent)`,
                animation: 'progress 1.2s linear forwards',
              }}
            />
          </div>
          <p className="mt-7 max-w-md text-[12px] leading-relaxed text-white/40">
            No real athlete identity or record used. NEURIX is preparing your anonymized debrief.
          </p>
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
            NEURIX is constructing your ethical debrief...
          </h2>
          <div className="font-mono-data text-white/40">
            {STAGED_MESSAGES[stagedIdx]}
          </div>
          <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/25">
            No real athlete identity or record used
          </div>
        </div>

        {/* Steps — each advances only when its real SSE event arrives */}
        <ThinkingSequence onComplete={handleAnimationComplete} pipelineEvents={pipelineEvents} />

        {/* Progress bar driven by real pipeline events */}
        <div className="mt-10 w-full h-[1px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/40 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${
                pipelineEvents.done ? 95
                : pipelineEvents.reflection ? 80
                : pipelineEvents.soul_twins ? 60
                : pipelineEvents.archetype ? 30
                : 8
              }%`,
            }}
          />
        </div>

      </div>
    </div>
  )
}
