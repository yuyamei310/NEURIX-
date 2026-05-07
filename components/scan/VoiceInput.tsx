'use client'

import { useState, useRef, useEffect, type FormEvent } from 'react'
import { useAtlasStore } from '@/store/atlasStore'
import { localClassify } from '@/core/classifier'
import { parseVoiceTranscript } from '@/core/voiceParse'
import type { Habit } from '@/types/atlas'

type VoiceState = 'idle' | 'listening' | 'confirming'

export function VoiceInput() {
  const [state, setState] = useState<VoiceState>('idle')
  const [confirmation, setConfirmation] = useState('')
  const [supported, setSupported] = useState(false)
  const [transcriptDraft, setTranscriptDraft] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const stateRef = useRef<VoiceState>('idle')

  const biometrics = useAtlasStore((s) => s.biometrics)
  const setBiometrics = useAtlasStore((s) => s.setBiometrics)
  const setLocalClassification = useAtlasStore((s) => s.setLocalClassification)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SR) setSupported(true)
    }
  }, [])

  const parseTranscript = async (transcript: string) => {
    const normalizedTranscript = transcript.trim()
    if (!normalizedTranscript) return

    setState('confirming')
    stateRef.current = 'confirming'

    try {
      const res = await fetch('/api/voice-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: normalizedTranscript }),
      })
      if (!res.ok) throw new Error('Voice parse request failed')
      const data = await res.json()
      applyParsedData(data, true)
    } catch {
      applyParsedData(parseVoiceTranscript(normalizedTranscript), false)
    }
  }

  const startListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      setConfirmation('Microphone input is unavailable in this browser. Type the phrase below.')
      return
    }

    const recognition = new SR()
    recognitionRef.current = recognition
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    setState('listening')
    stateRef.current = 'listening'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript
      parseTranscript(transcript)
    }

    recognition.onerror = () => {
      setConfirmation('Microphone input did not return speech. Type the phrase below.')
      setState('idle')
      stateRef.current = 'idle'
    }
    recognition.onend = () => {
      if (stateRef.current === 'listening') {
        setState('idle')
        stateRef.current = 'idle'
      }
    }

    recognition.start()
  }

  const submitTranscript = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    parseTranscript(transcriptDraft)
  }

  const applyParsedData = (data: {
    height?: unknown
    weight?: unknown
    age?: unknown
    habits?: unknown
    confirmation_message?: unknown
  }, clearDraft: boolean) => {
    setConfirmation(typeof data.confirmation_message === 'string' ? data.confirmation_message : '')

    const clamp = (v: unknown, min: number, max: number) =>
      typeof v === 'number' && Number.isFinite(v) ? Math.min(Math.max(Math.round(v), min), max) : undefined

    const updates: Partial<typeof biometrics> = {}
    const h = clamp(data.height, 100, 220)
    const w = clamp(data.weight, 30, 200)
    const a = clamp(data.age, 10, 90)
    if (h !== undefined) updates.height = h
    if (w !== undefined) updates.weight = w
    if (a !== undefined) updates.age = a
    if (Array.isArray(data.habits) && data.habits.length) updates.habits = data.habits as Habit[]

    if (Object.keys(updates).length > 0) {
      animateSliders(updates)
      if (clearDraft) setTranscriptDraft('')
    } else {
      setState('idle')
      stateRef.current = 'idle'
    }
  }

  const animateSliders = (updates: Partial<typeof biometrics>) => {
    const duration = 800
    const start = performance.now()
    const from = { height: biometrics.height, weight: biometrics.weight, age: biometrics.age }
    const to = {
      height: updates.height ?? biometrics.height,
      weight: updates.weight ?? biometrics.weight,
      age: updates.age ?? biometrics.age,
    }

    const tick = () => {
      const elapsed = performance.now() - start
      const t = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)

      const cur = {
        height: Math.round(from.height + (to.height - from.height) * ease),
        weight: Math.round(from.weight + (to.weight - from.weight) * ease),
        age: Math.round(from.age + (to.age - from.age) * ease),
      }

      const merged = { ...cur, ...(updates.habits ? { habits: updates.habits } : {}) }
      setBiometrics(merged)
      const result = localClassify(cur.height, cur.weight, cur.age, updates.habits ?? biometrics.habits)
      setLocalClassification(result)

      if (t < 1) requestAnimationFrame(tick)
      else { setState('idle'); stateRef.current = 'idle' }
    }

    requestAnimationFrame(tick)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button
          onClick={startListening}
          disabled={state !== 'idle' || !supported}
          title={supported ? 'Start voice input' : 'Microphone input is unavailable in this browser'}
          className="relative w-10 h-10 rounded-full border border-[0.5px] border-[var(--border-2)] flex items-center justify-center hover:bg-[var(--surface-2)] transition-colors cursor-pointer disabled:opacity-50"
        >
          {state === 'listening' && (
            <span className="absolute inset-0 rounded-full border border-[var(--text)] pulse-ring" />
          )}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>

        <span className="text-[13px] text-[var(--text-3)]">
          {state === 'idle' && supported && 'Tap to speak your biometrics'}
          {state === 'idle' && !supported && 'Microphone unavailable here'}
          {state === 'listening' && 'Listening...'}
          {state === 'confirming' && 'Confirming...'}
        </span>
      </div>

      <form onSubmit={submitTranscript} className="flex flex-col gap-2 pl-0 sm:pl-[52px]">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={transcriptDraft}
            onChange={(event) => setTranscriptDraft(event.target.value)}
            disabled={state !== 'idle'}
            placeholder="Example: 180cm, 82kg, age 28, running and strength"
            className="min-w-0 flex-1 rounded-[6px] border border-[var(--border-2)] bg-[var(--surface-1)] px-3 py-2 text-[13px] text-[var(--text)] outline-none transition-colors placeholder:text-white/28 focus:border-white/30 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={state !== 'idle' || !transcriptDraft.trim()}
            className="rounded-[6px] border border-[var(--border-2)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      </form>

      {confirmation && state === 'idle' && (
        <p className="text-[13px] text-[var(--text-2)] fade-in pl-[52px]">{confirmation}</p>
      )}
    </div>
  )
}
