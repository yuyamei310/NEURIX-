'use client'

import { useState, useRef, useEffect } from 'react'
import { useAtlasStore } from '@/store/atlasStore'
import { localClassify } from '@/lib/classifier'
import type { Habit } from '@/types/atlas'

type VoiceState = 'idle' | 'listening' | 'confirming'

// Pre-computed waveform bar data (deterministic, no Math.random at render)
const WAVEFORM_BARS = Array.from({ length: 16 }, (_, i) => {
  const a = ((i * 1664525 + 1013904223) & 0x7fffffff)
  const b = ((a * 22695477 + 1) & 0x7fffffff)
  return {
    duration: 0.35 + (a % 100) / 100 * 0.45,
    delay: i * 0.04,
    minScale: 0.12 + (b % 30) / 100,
  }
})

function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-[2px]" style={{ height: 32 }}>
      {WAVEFORM_BARS.map((bar, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: 2,
            height: 28,
            background: active
              ? `linear-gradient(to top, rgba(var(--glow-rgb), 0.4), var(--glow))`
              : 'var(--border-2)',
            transformOrigin: 'center',
            transform: active ? undefined : `scaleY(${bar.minScale})`,
            animation: active
              ? `waveform-dance ${bar.duration}s ease-in-out ${bar.delay}s infinite`
              : undefined,
            transition: 'background 0.3s',
          }}
        />
      ))}
    </div>
  )
}

export function VoiceInput() {
  const [state, setState] = useState<VoiceState>('idle')
  const [confirmation, setConfirmation] = useState('')
  const [supported, setSupported] = useState(false)
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

  if (!supported) return null

  const startListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return

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
      setState('confirming')

      try {
        const res = await fetch('/api/voice-parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript }),
        })
        const data = await res.json()
        setConfirmation(data.confirmation_message || '')

        const updates: Partial<typeof biometrics> = {}
        if (data.height) updates.height = data.height
        if (data.weight) updates.weight = data.weight
        if (data.age) updates.age = data.age
        if (data.habits?.length) updates.habits = data.habits as Habit[]

        if (Object.keys(updates).length > 0) {
          animateSliders(updates)
        } else {
          setState('idle')
          stateRef.current = 'idle'
        }
      } catch {
        setState('idle')
        stateRef.current = 'idle'
      }
    }

    recognition.onerror = () => {
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
      <span
        className="font-mono tracking-[0.14em] uppercase"
        style={{ fontSize: 10, color: 'var(--text-3)' }}
      >
        VOICE INPUT
      </span>

      <div className="flex items-center gap-4">
        {/* Mic button */}
        <button
          onClick={startListening}
          disabled={state !== 'idle'}
          className="relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50"
          style={{
            border: '1px solid',
            borderColor: state === 'listening' ? 'var(--glow)' : 'var(--border-2)',
            background: state === 'listening' ? 'rgba(var(--glow-rgb), 0.08)' : 'transparent',
            boxShadow: state === 'listening' ? '0 0 12px rgba(var(--glow-rgb), 0.3)' : 'none',
          }}
        >
          {state === 'listening' && (
            <span
              className="absolute inset-0 rounded-full pulse-ring"
              style={{ borderColor: 'var(--glow)' }}
            />
          )}
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke={state === 'listening' ? 'var(--glow)' : 'var(--text-3)'}
            strokeWidth="1.5"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>

        {/* Waveform or status text */}
        {state === 'listening' ? (
          <Waveform active />
        ) : (
          <span style={{ fontSize: 13, color: 'var(--text-3)' }}>
            {state === 'idle' && 'Tap to speak your biometrics'}
            {state === 'confirming' && (
              <span style={{ color: 'var(--glow)' }}>Confirming...</span>
            )}
          </span>
        )}
      </div>

      {confirmation && state === 'idle' && (
        <p className="fade-in pl-14" style={{ fontSize: 13, color: 'var(--text-2)' }}>
          {confirmation}
        </p>
      )}
    </div>
  )
}
