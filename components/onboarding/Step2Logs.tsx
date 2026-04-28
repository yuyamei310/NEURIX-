'use client'

import { useEffect, useState } from 'react'

interface Step2LogsProps {
  onNext: () => void
}

const LOGS = [
  { text: 'Matching historical athlete clusters...' },
  { text: 'Evaluating biomechanical signals...' },
  { text: 'Analyzing Olympic and Paralympic patterns...' },
  { text: 'Generating identity mapping...' },
]

const LOG_DELAYS = [450, 1350, 2250, 3150]
const CTA_DELAY = 4100

export function Step2Logs({ onNext }: Step2LogsProps) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [showCTA, setShowCTA] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    LOG_DELAYS.forEach((delay, i) => {
      timers.push(
        setTimeout(() => setVisibleCount((c) => Math.max(c, i + 1)), delay)
      )
    })

    timers.push(setTimeout(() => setShowCTA(true), CTA_DELAY))

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="w-full max-w-[540px] mx-auto px-6 py-10">

      {/* Title */}
      <div className="mb-10 reveal-1">
        <div className="font-mono-data mb-3" style={{ color: 'var(--glow)' }}>
          02 / 03 — ANALYSIS PREVIEW
        </div>
        <h2
          style={{
            fontFamily: 'var(--display)',
            fontSize: 'clamp(26px, 4.5vw, 36px)',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.12,
            color: 'var(--text)',
          }}
        >
          NEURIX will analyze<br />your profile
        </h2>
      </div>

      {/* Scan visual — concentric rotating rings */}
      <div className="reveal-2 flex justify-center mb-12">
        <div className="relative" style={{ width: 128, height: 128 }}>

          {/* Outermost ring */}
          <div
            className="absolute inset-0 rounded-full ring-spin-slow"
            style={{ border: '1px solid rgba(255,107,53,0.1)' }}
          />

          {/* Dashed mid ring */}
          <div
            className="absolute rounded-full ring-spin-ccw"
            style={{
              inset: 14,
              border: '1px dashed rgba(255,107,53,0.18)',
              borderSpacing: 4,
            }}
          />

          {/* Inner solid ring */}
          <div
            className="absolute rounded-full ring-spin-cw"
            style={{ inset: 30, border: '1px solid rgba(255,107,53,0.38)' }}
          />

          {/* Radial glow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,107,53,0.07) 0%, transparent 68%)',
            }}
            aria-hidden
          />

          {/* Center dot */}
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              width: 9,
              height: 9,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: 'rgba(255,107,53,0.9)',
              boxShadow: '0 0 14px rgba(255,107,53,0.65), 0 0 28px rgba(255,107,53,0.2)',
              animation: 'breathe 2.2s ease-in-out infinite',
            }}
          />

          {/* Corner node dots at 4 cardinal positions */}
          {[0, 90, 180, 270].map((deg) => (
            <div
              key={deg}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: 'rgba(255,107,53,0.45)',
                transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-48px)`,
                animation: `breathe 2.2s ${deg * 0.006}s ease-in-out infinite`,
              }}
            />
          ))}

        </div>
      </div>

      {/* Log lines */}
      <div className="flex flex-col gap-3 mb-10" style={{ minHeight: `${LOGS.length * 36}px` }}>
        {LOGS.map((log, i) => {
          if (i >= visibleCount) return null
          const isLatest = i === visibleCount - 1 && !showCTA
          return (
            <div
              key={i}
              className="flex items-center gap-3"
              style={{ animation: 'sys-log-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
            >
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: isLatest ? 'var(--glow)' : 'rgba(255,255,255,0.2)',
                  boxShadow: isLatest ? '0 0 8px rgba(255,107,53,0.6)' : 'none',
                  transition: 'background 0.3s ease, box-shadow 0.3s ease',
                }}
              />
              <span
                className="font-mono text-[12px] tracking-[0.05em]"
                style={{
                  color: isLatest ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
                  transition: 'color 0.3s ease',
                }}
              >
                {log.text}
                {isLatest && <span className="cursor-blink" />}
              </span>
            </div>
          )
        })}
      </div>

      {/* Status line */}
      {showCTA && (
        <div
          className="font-mono-data mb-7"
          style={{
            color: 'rgba(255,107,53,0.5)',
            animation: 'fade-in 0.4s ease forwards',
          }}
        >
          ANALYSIS READY — PROCEED TO OVERVIEW
        </div>
      )}

      {/* CTA */}
      <div
        style={{
          opacity: showCTA ? 1 : 0,
          transform: showCTA ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          pointerEvents: showCTA ? 'auto' : 'none',
        }}
      >
        <div className="relative inline-block">
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: '-50%',
              background: 'radial-gradient(ellipse, rgba(255,107,53,0.1) 0%, transparent 65%)',
              filter: 'blur(18px)',
              animation: showCTA ? 'breathe 3.2s ease-in-out infinite' : 'none',
              pointerEvents: 'none',
            }}
          />
          <button
            onClick={onNext}
            disabled={!showCTA}
            style={{
              position: 'relative',
              fontFamily: 'var(--display)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              padding: '16px 48px',
              background: 'transparent',
              border: '1px solid rgba(255,107,53,0.42)',
              color: 'rgba(255,107,53,0.85)',
              cursor: showCTA ? 'none' : 'default',
              transition: 'background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease, color 0.22s ease',
              boxShadow: '0 0 18px rgba(255,107,53,0.09), inset 0 0 18px rgba(255,107,53,0.03)',
            }}
            onMouseEnter={(e) => {
              if (!showCTA) return
              const el = e.currentTarget
              el.style.background = 'rgba(255,107,53,0.07)'
              el.style.borderColor = 'rgba(255,107,53,0.82)'
              el.style.boxShadow = '0 0 38px rgba(255,107,53,0.28), inset 0 0 26px rgba(255,107,53,0.05)'
              el.style.color = 'rgba(255,107,53,1)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.background = 'transparent'
              el.style.borderColor = 'rgba(255,107,53,0.42)'
              el.style.boxShadow = '0 0 18px rgba(255,107,53,0.09), inset 0 0 18px rgba(255,107,53,0.03)'
              el.style.color = 'rgba(255,107,53,0.85)'
            }}
          >
            NEXT →
          </button>
        </div>
      </div>

    </div>
  )
}
