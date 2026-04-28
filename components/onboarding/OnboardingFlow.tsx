'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Step1Body } from './Step1Body'
import { Step2Logs } from './Step2Logs'
import { Step3Discover } from './Step3Discover'

const STEPS = [
  { num: '01', label: 'BODY' },
  { num: '02', label: 'ANALYSIS' },
  { num: '03', label: 'DISCOVER' },
]

export function OnboardingFlow() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [exiting, setExiting] = useState(false)

  const goNext = useCallback(() => {
    if (step >= 2) {
      router.push('/scan')
      return
    }
    setExiting(true)
    setTimeout(() => {
      setStep((s) => s + 1)
      setExiting(false)
    }, 320)
  }, [step, router])

  return (
    <div className="fixed inset-0 bg-[var(--bg)] overflow-hidden flex flex-col">

      {/* Background grid */}
      <div className="sys-grid fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} aria-hidden />

      {/* Viewport corner brackets */}
      <div className="fixed pointer-events-none" style={{ inset: 16, zIndex: 2 }} aria-hidden>
        <div className="absolute top-0 left-0 w-7 h-7" style={{ borderTop: '1px solid rgba(255,107,53,0.2)', borderLeft: '1px solid rgba(255,107,53,0.2)', animation: 'bracket-pulse 3.2s 0s ease-in-out infinite' }} />
        <div className="absolute top-0 right-0 w-7 h-7" style={{ borderTop: '1px solid rgba(255,107,53,0.2)', borderRight: '1px solid rgba(255,107,53,0.2)', animation: 'bracket-pulse 3.2s 0.8s ease-in-out infinite' }} />
        <div className="absolute bottom-0 left-0 w-7 h-7" style={{ borderBottom: '1px solid rgba(255,107,53,0.2)', borderLeft: '1px solid rgba(255,107,53,0.2)', animation: 'bracket-pulse 3.2s 1.6s ease-in-out infinite' }} />
        <div className="absolute bottom-0 right-0 w-7 h-7" style={{ borderBottom: '1px solid rgba(255,107,53,0.2)', borderRight: '1px solid rgba(255,107,53,0.2)', animation: 'bracket-pulse 3.2s 2.4s ease-in-out infinite' }} />
      </div>

      {/* Header */}
      <header
        className="relative flex items-center justify-between px-8 py-[18px] border-b shrink-0"
        style={{ borderColor: 'var(--border)', zIndex: 10 }}
      >
        <span className="font-mono-data">NEURIX · CALIBRATION</span>

        {/* Step progress indicator */}
        <div className="flex items-center gap-2.5">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span
                  className="font-mono text-[9px] tracking-[0.2em] transition-colors duration-400"
                  style={{ color: i === step ? 'var(--glow)' : i < step ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)' }}
                >
                  {s.num}
                </span>
                <span
                  className="font-mono text-[9px] tracking-[0.2em] transition-colors duration-400"
                  style={{ color: i === step ? 'rgba(255,107,53,0.65)' : 'rgba(255,255,255,0.1)' }}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="h-px transition-all duration-500"
                  style={{ width: 28, background: i < step ? 'rgba(255,107,53,0.35)' : 'rgba(255,255,255,0.08)' }}
                />
              )}
            </div>
          ))}
        </div>
      </header>

      {/* Step content */}
      <main className="relative flex-1 overflow-y-auto hide-scrollbar" style={{ zIndex: 5 }}>
        <div
          key={step}
          style={{
            opacity: exiting ? 0 : undefined,
            transform: exiting ? 'translateY(10px)' : undefined,
            transition: exiting ? 'opacity 0.32s ease, transform 0.32s ease' : undefined,
            animation: !exiting ? 'page-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' : undefined,
          }}
        >
          {step === 0 && <Step1Body onNext={goNext} />}
          {step === 1 && <Step2Logs onNext={goNext} />}
          {step === 2 && <Step3Discover onBeginScan={goNext} />}
        </div>
      </main>

    </div>
  )
}
