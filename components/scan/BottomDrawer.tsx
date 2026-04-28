'use client'

import { useState, ReactNode } from 'react'
import { useAtlasStore } from '@/store/atlasStore'

interface BottomDrawerProps {
  children: ReactNode
  onAnalyze: () => void
}

export function DrawerSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b border-white/[0.06] pb-6 mb-6 last:border-0 last:mb-0">
      <p className="font-mono-data mb-4">{title}</p>
      {children}
    </div>
  )
}

function getStatusLine(completion: number): string {
  if (completion < 35) return 'Initializing profile...'
  if (completion < 70) return 'Signal integrity building...'
  if (completion < 100) return `Signal integrity: ${completion}%`
  return 'Profile ready · Begin scan'
}

export function BottomDrawer({ children, onAnalyze }: BottomDrawerProps) {
  const [open, setOpen] = useState(false)

  const { height, weight, age, habits, agentMode } = useAtlasStore((s) => s.biometrics)

  const biometricsModified = height !== 175 || weight !== 75 || age !== 25
  const completion = (biometricsModified ? 35 : 0) + (habits.length > 0 ? 35 : 0) + 30

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  const stripSummary = `${height}cm · ${weight}kg · ${capitalize(agentMode)}`

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 350ms ease-in-out',
        }}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col"
        style={{
          height: '65vh',
          transform: open ? 'translateY(0)' : 'translateY(calc(100% - 64px))',
          transition: 'transform 350ms cubic-bezier(0.32, 0.72, 0, 1)',
          boxShadow: open ? '0 -30px 80px rgba(0,0,0,0.7)' : '0 -4px 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* Handle strip */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-16 w-full shrink-0 cursor-pointer items-center justify-between gap-4 border-t px-5 text-left outline-none sm:px-6"
          style={{
            background: open ? 'rgba(8,8,8,0.95)' : 'rgba(255,107,53,0.06)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            borderColor: open ? 'rgba(255,255,255,0.1)' : 'rgba(255,107,53,0.35)',
            boxShadow: open ? 'none' : '0 -4px 24px rgba(255,107,53,0.08)',
            transition: 'background 350ms ease, border-color 350ms ease, box-shadow 350ms ease',
          }}
        >
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span
              className="font-mono-data"
              style={{
                color: open ? 'rgba(255,255,255,0.6)' : 'rgba(255,107,53,0.85)',
                transition: 'color 350ms ease',
              }}
            >
              SYSTEM INPUT
            </span>
            <span
              className="font-mono truncate leading-none normal-case transition-all duration-300"
              style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.38)' }}
            >
              {open ? 'Tap to close' : stripSummary}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="flex flex-col items-end gap-1">
              <span
                className="font-mono-data"
                style={{ fontSize: '9px', color: open ? 'rgba(255,255,255,0.22)' : 'rgba(255,107,53,0.55)', transition: 'color 350ms ease' }}
              >
                {completion}%
              </span>
              <div
                className="w-14 h-[2px] rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${completion}%`,
                    background: open ? 'rgba(255,255,255,0.5)' : '#ff6b35',
                  }}
                />
              </div>
            </div>

            {/* Chevron — rotates when open */}
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
                color: open ? 'rgba(255,255,255,0.35)' : '#ff6b35',
                filter: open ? 'none' : 'drop-shadow(0 0 4px rgba(255,107,53,0.5))',
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

        {/* Scrollable content — glass body */}
        <div
          className="flex-1 overflow-y-auto px-6 pt-6 pb-4 flex flex-col"
          style={{
            background: 'rgba(10,10,10,0.6)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          {/* Header status */}
          <div className="mb-6 pb-5 border-b border-white/[0.06]">
            <p className="font-mono-data mb-1">▲ INPUT QUEUE</p>
            <p
              className="text-xs text-white/60 transition-opacity duration-500"
              key={getStatusLine(completion)}
            >
              {getStatusLine(completion)}
            </p>
            <p className="font-mono-data mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
              BIOMECH INPUT REQUIRED
            </p>
          </div>

          {/* Injected sections */}
          <div className="flex-1">{children}</div>

          {/* Footer — completeness + CTA */}
          <div className="mt-6 border-t border-white/[0.06] pt-4 shrink-0">
            <div className="flex justify-between items-center mb-2">
              <p className="font-mono-data">PROFILE COMPLETENESS</p>
              <p className="font-mono-data">{completion}%</p>
            </div>
            <div
              className="w-full h-[2px] rounded-full overflow-hidden mb-4"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${completion}%`, background: 'rgba(255,255,255,0.9)' }}
              />
            </div>

            <button
              onClick={onAnalyze}
              className="w-full cursor-pointer rounded-full bg-white py-3.5 font-semibold uppercase tracking-widest text-black outline-none transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ fontFamily: 'var(--mono)', fontSize: '12px' }}
            >
              Begin Full Scan →
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
