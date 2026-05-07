'use client'

import { useState, ReactNode } from 'react'
import { useNeurixStore } from '@/store/neurixStore'

interface BottomDrawerProps {
  children: ReactNode
  onAnalyze: () => void
}

export function DrawerSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      className="relative border-l border-white/[0.08] py-5 pl-5 pr-1 first:pt-0 last:pb-0"
      style={{
        background: 'linear-gradient(90deg, rgba(255,138,76,0.035), transparent 34%)',
      }}
    >
      <div
        className="absolute left-[-1px] top-5 h-8 w-px"
        style={{ background: 'rgba(255,138,76,0.68)', boxShadow: '0 0 16px rgba(255,138,76,0.35)' }}
      />
      <p className="font-mono-data mb-4" style={{ color: 'rgba(255,255,255,0.62)' }}>{title}</p>
      {children}
    </section>
  )
}

function getStatusLine(completion: number): string {
  if (completion < 35) return 'Defaults loaded. Add your body signal.'
  if (completion < 70) return 'Biometrics received. Add activity background.'
  if (completion < 100) return `Signal integrity: ${completion}%`
  return 'Profile ready. Begin full scan.'
}

export function BottomDrawer({ children, onAnalyze }: BottomDrawerProps) {
  const [open, setOpen] = useState(false)

  const { height, weight, age, habits, agentMode } = useNeurixStore((s) => s.biometrics)

  const biometricsModified = height !== 175 || weight !== 75 || age !== 25
  const completion = (biometricsModified ? 35 : 0) + (habits.length > 0 ? 35 : 0) + 30
  const steps = [
    { label: 'Body signal', meta: biometricsModified ? `${height}cm / ${weight}kg / ${age}` : 'Default profile', done: biometricsModified },
    { label: 'Activity background', meta: habits.length ? `${habits.length} selected` : 'No activity selected', done: habits.length > 0 },
    { label: 'Analysis lens', meta: agentMode, done: true },
  ]
  const nextIncompleteStep = steps.findIndex((step) => !step.done)
  const activeStep = nextIncompleteStep === -1 ? steps.length - 1 : nextIncompleteStep

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  const stripSummary = `${completion}% signal / ${capitalize(agentMode)} lens`

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 350ms ease-in-out',
        }}
        onClick={() => setOpen(false)}
      />

      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col"
        style={{
          height: 'min(74vh, 760px)',
          transform: open ? 'translateY(0)' : 'translateY(calc(100% - 72px))',
          transition: 'transform 350ms cubic-bezier(0.32, 0.72, 0, 1)',
          boxShadow: open ? '0 -30px 80px rgba(0,0,0,0.7)' : '0 -4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-[72px] w-full shrink-0 cursor-pointer items-center justify-between gap-4 border-t px-5 text-left outline-none sm:px-8"
          style={{
            background: open
              ? 'linear-gradient(90deg, rgba(8,8,8,0.98), rgba(14,10,8,0.96))'
              : 'linear-gradient(90deg, rgba(255,138,76,0.09), rgba(8,8,8,0.82))',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            borderColor: open ? 'rgba(255,255,255,0.1)' : 'rgba(255,138,76,0.42)',
            boxShadow: open ? 'inset 0 1px 0 rgba(255,255,255,0.04)' : '0 -4px 28px rgba(255,138,76,0.1)',
            transition: 'background 350ms ease, border-color 350ms ease, box-shadow 350ms ease',
          }}
        >
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border sm:flex"
              style={{
                borderColor: open ? 'rgba(255,255,255,0.12)' : 'rgba(255,138,76,0.38)',
                background: 'radial-gradient(circle, rgba(255,138,76,0.18), transparent 68%)',
              }}
            >
              <div className="h-2 w-2 rounded-full" style={{ background: '#ff8a4c', boxShadow: '0 0 14px rgba(255,138,76,0.75)' }} />
            </div>
            <div className="min-w-0">
              <span
                className="font-mono-data block"
                style={{
                  color: open ? 'rgba(255,255,255,0.6)' : 'rgba(255,138,76,0.85)',
                  transition: 'color 350ms ease',
                }}
              >
                BUILD ATHLETE SIGNAL
              </span>
              <span
                className="block truncate font-mono leading-none normal-case transition-all duration-300"
                style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.38)' }}
              >
                {open ? getStatusLine(completion) : stripSummary}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden flex-col items-end gap-1 sm:flex">
              <span
                className="font-mono-data"
                style={{ fontSize: '9px', color: open ? 'rgba(255,255,255,0.22)' : 'rgba(255,138,76,0.55)', transition: 'color 350ms ease' }}
              >
                {completion}%
              </span>
              <div
                className="h-[2px] w-14 overflow-hidden rounded-full"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${completion}%`,
                    background: open ? 'rgba(255,255,255,0.5)' : '#ff8a4c',
                  }}
                />
              </div>
            </div>

            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden
              style={{
                flexShrink: 0,
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 350ms cubic-bezier(0.32, 0.72, 0, 1), color 350ms ease',
                color: open ? 'rgba(255,255,255,0.35)' : '#ff8a4c',
                filter: open ? 'none' : 'drop-shadow(0 0 4px rgba(255,138,76,0.5))',
              }}
            >
              <path
                d="M5 7.5l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>

        <div
          className="flex min-h-0 flex-1 flex-col"
          style={{
            background: `
              linear-gradient(180deg, rgba(10,10,10,0.92), rgba(5,5,5,0.96)),
              linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
            `,
            backgroundSize: 'auto, 44px 44px, 44px 44px',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[280px_1fr]">
            <aside className="border-b border-white/[0.07] px-6 py-6 lg:border-b-0 lg:border-r lg:px-8">
              <p className="font-mono-data mb-2" style={{ color: '#ff8a4c' }}>INPUT SEQUENCE</p>
              <p className="max-w-[28rem] text-[13px] leading-6 text-white/52 lg:max-w-none">
                Complete the signal stack, then run the full synthetic archive scan.
              </p>

              <div className="mt-6 space-y-4">
                {steps.map((step, index) => {
                  const active = index === activeStep
                  return (
                    <div key={step.label} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[10px]"
                          style={{
                            borderColor: step.done || active ? 'rgba(255,138,76,0.62)' : 'rgba(255,255,255,0.12)',
                            background: step.done ? 'rgba(255,138,76,0.16)' : 'rgba(255,255,255,0.03)',
                            color: step.done || active ? '#ff8a4c' : 'rgba(255,255,255,0.28)',
                            boxShadow: active ? '0 0 22px rgba(255,138,76,0.16)' : 'none',
                          }}
                        >
                          {index + 1}
                        </div>
                        {index < steps.length - 1 && (
                          <div className="mt-2 h-8 w-px" style={{ background: step.done ? 'rgba(255,138,76,0.36)' : 'rgba(255,255,255,0.08)' }} />
                        )}
                      </div>
                      <div className="min-w-0 pb-2">
                        <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: active ? 'rgba(255,255,255,0.86)' : 'rgba(255,255,255,0.48)' }}>
                          {step.label}
                        </p>
                        <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.12em] text-white/24">
                          {step.meta}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-7 border-t border-white/[0.06] pt-5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-mono-data">SIGNAL INTEGRITY</p>
                  <p className="font-mono-data" style={{ color: '#ff8a4c' }}>{completion}%</p>
                </div>
                <div className="h-[3px] overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${completion}%`,
                      background: 'linear-gradient(90deg, #ff8a4c, rgba(255,255,255,0.82))',
                      boxShadow: '0 0 18px rgba(255,138,76,0.35)',
                    }}
                  />
                </div>
              </div>
            </aside>

            <div className="min-h-0 overflow-y-auto px-6 py-6 sm:px-8">
              <div className="mb-6 flex flex-col justify-between gap-3 border-b border-white/[0.07] pb-5 md:flex-row md:items-end">
                <div>
                  <p className="font-mono-data mb-2">SCAN CONSOLE</p>
                  <p className="text-sm leading-6 text-white/62" key={getStatusLine(completion)}>
                    {getStatusLine(completion)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {['BODY', 'ACTIVITY', 'LENS'].map((label, index) => (
                    <span
                      key={label}
                      className="border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em]"
                      style={{
                        borderColor: index <= activeStep ? 'rgba(255,138,76,0.34)' : 'rgba(255,255,255,0.08)',
                        color: index <= activeStep ? 'rgba(255,138,76,0.78)' : 'rgba(255,255,255,0.24)',
                        background: index <= activeStep ? 'rgba(255,138,76,0.06)' : 'transparent',
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">{children}</div>
            </div>
          </div>

          <div className="shrink-0 border-t border-white/[0.08] px-6 py-4 sm:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono-data">ARCHIVE SCAN</p>
                <p className="mt-1 text-xs text-white/42">Creates your archetype, reasoning, sport path, and shareable DNA card.</p>
              </div>

              <button
                onClick={onAnalyze}
                className="w-full cursor-pointer rounded-full px-6 py-3.5 font-semibold uppercase tracking-widest text-black outline-none transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] md:w-auto"
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '12px',
                  background: 'linear-gradient(90deg, #ffffff, #ffdac6)',
                  boxShadow: '0 0 26px rgba(255,138,76,0.18)',
                }}
              >
                Begin Full Scan -&gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
