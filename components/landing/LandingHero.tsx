'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAtlasStore } from '@/store/atlasStore'
import { ParticleField } from './ParticleField'

const FEATURES = ['Voice input', 'Live 3D body', 'Synthetic archive', 'Agent lenses', 'Ethics-safe']

export function LandingHero() {
  const router = useRouter()
  const reset = useAtlasStore((s) => s.reset)
  const [clock, setClock] = useState('')

  useEffect(() => {
    const update = () => {
      const n = new Date()
      const pad = (x: number) => x.toString().padStart(2, '0')
      setClock(`${pad(n.getHours())}:${pad(n.getMinutes())}:${pad(n.getSeconds())}`)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const handleStart = () => {
    reset()
    router.push('/onboarding')
  }

  return (
    <main className="fixed inset-0 flex items-center justify-center bg-[var(--bg)] overflow-hidden">

      {/* Layer 0 — particle constellation */}
      <ParticleField />

      {/* Layer 1 — grid */}
      <div className="sys-grid fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} aria-hidden />

      {/* Layer 2 — viewport corner brackets */}
      <div
        className="fixed pointer-events-none"
        style={{ inset: 20, zIndex: 2 }}
        aria-hidden
      >
        <div
          className="absolute top-0 left-0 w-7 h-7"
          style={{
            borderTop: '1px solid rgba(255,138,76,0.28)',
            borderLeft: '1px solid rgba(255,138,76,0.28)',
            animation: 'bracket-pulse 3.2s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-0 right-0 w-7 h-7"
          style={{
            borderTop: '1px solid rgba(255,138,76,0.28)',
            borderRight: '1px solid rgba(255,138,76,0.28)',
            animation: 'bracket-pulse 3.2s 0.8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-7 h-7"
          style={{
            borderBottom: '1px solid rgba(255,138,76,0.28)',
            borderLeft: '1px solid rgba(255,138,76,0.28)',
            animation: 'bracket-pulse 3.2s 1.6s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-7 h-7"
          style={{
            borderBottom: '1px solid rgba(255,138,76,0.28)',
            borderRight: '1px solid rgba(255,138,76,0.28)',
            animation: 'bracket-pulse 3.2s 2.4s ease-in-out infinite',
          }}
        />
      </div>

      {/* Layer 3 — top status header */}
      <header
        className="fixed top-0 left-0 right-0 flex justify-between items-center px-8 py-5 pointer-events-none select-none"
        style={{ zIndex: 10 }}
        aria-hidden
      >
        <span className="status-bar">NEURIX · HIAS · v2.4</span>
        <span className="status-bar data-flicker">
          {clock ? `SYS://LIVE · ${clock}` : 'SYS://LIVE'}
        </span>
      </header>

      {/* Layer 4 — center content */}
      <div className="relative z-10 text-center flex flex-col items-center px-6">

        {/* System identifier line */}
        <div
          className="reveal-1 font-mono tracking-[0.3em] uppercase mb-7"
          style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}
        >
          [ Human Intelligence Analysis System ]
        </div>

        {/* NEURIX — glitch wordmark */}
        <h1
          className="reveal-2 glitch-wrapper font-black tracking-[0.1em] leading-none"
          data-text="NEURIX"
          style={{
            fontFamily: 'var(--display)',
            fontSize: 'clamp(68px, 12vw, 122px)',
            color: '#ffffff',
            textShadow: '0 0 60px rgba(255,138,76,0.22), 0 0 140px rgba(255,138,76,0.08)',
          }}
        >
          NEURIX
        </h1>

        {/* Sub-headline */}
        <p
          className="reveal-3 max-w-[400px] mx-auto leading-relaxed mt-7 tracking-wide"
          style={{ fontSize: 13, color: 'rgba(255,255,255,0.36)' }}
        >
          Input your biometrics, speak your story — NEURIX maps your path through
          120 years of Team USA-inspired archetype patterns.
        </p>

        {/* CTA button */}
        <div className="reveal-4 mt-12 relative">
          {/* Ambient glow orb behind button */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: '-60%',
              background: 'radial-gradient(ellipse, rgba(255,138,76,0.14) 0%, transparent 65%)',
              filter: 'blur(20px)',
              animation: 'breathe 3s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />

          <button
            onClick={handleStart}
            style={{
              position: 'relative',
              fontFamily: 'var(--display)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              padding: '18px 52px',
              background: 'transparent',
              border: '1px solid rgba(255,138,76,0.5)',
              color: 'rgba(255,138,76,0.88)',
              cursor: 'none',
              transition: 'background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, color 0.25s ease',
              boxShadow: '0 0 22px rgba(255,138,76,0.12), inset 0 0 22px rgba(255,138,76,0.03)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.background = 'rgba(255,138,76,0.07)'
              el.style.borderColor = 'rgba(255,138,76,0.85)'
              el.style.boxShadow = '0 0 44px rgba(255,138,76,0.32), inset 0 0 32px rgba(255,138,76,0.06)'
              el.style.color = 'rgba(255,138,76,1)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.background = 'transparent'
              el.style.borderColor = 'rgba(255,138,76,0.5)'
              el.style.boxShadow = '0 0 22px rgba(255,138,76,0.12), inset 0 0 22px rgba(255,138,76,0.03)'
              el.style.color = 'rgba(255,138,76,0.88)'
            }}
          >
            BEGIN SCAN ↗
          </button>
        </div>

        {/* Feature strip */}
        <div className="reveal-5 mt-16 flex gap-7 flex-wrap justify-center">
          {FEATURES.map(f => (
            <div key={f} className="flex items-center gap-2">
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: 'var(--glow)',
                  boxShadow: '0 0 6px rgba(255,138,76,0.7)',
                }}
              />
              <span className="status-bar" style={{ color: 'rgba(255,255,255,0.2)' }}>
                {f}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom-right attribution */}
      <div
        className="fixed bottom-5 right-8 pointer-events-none select-none"
        style={{ zIndex: 10 }}
        aria-hidden
      >
        <span className="status-bar">Powered by Gemini · No real athlete data used</span>
      </div>

    </main>
  )
}
