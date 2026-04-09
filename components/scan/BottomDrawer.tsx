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
          transform: open ? 'translateY(0)' : 'translateY(calc(100% - 56px))',
          transition: 'transform 350ms cubic-bezier(0.32, 0.72, 0, 1)',
          boxShadow: open ? '0 -30px 80px rgba(0,0,0,0.7)' : '0 -4px 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* Handle strip */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-between px-6 h-14 shrink-0 border-t border-white/[0.12] cursor-pointer w-full text-left"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <div className="flex flex-col gap-0.5">
            <span className="font-mono-data" style={{ color: 'rgba(255,255,255,0.7)' }}>
              ▲ SYSTEM INPUT
            </span>
            <span
              className="font-mono-data transition-all duration-300"
              style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}
            >
              {open ? 'Tap to close' : stripSummary}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end gap-1">
              <span className="font-mono-data" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)' }}>
                {completion}%
              </span>
              <div
                className="w-14 h-[2px] rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${completion}%`, background: 'rgba(255,255,255,0.5)' }}
                />
              </div>
            </div>
            <span
              className="font-mono-data text-sm"
              style={{
                display: 'inline-block',
                color: 'rgba(255,255,255,0.4)',
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 350ms ease-in-out',
              }}
            >
              ↑
            </span>
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
            <p className="font-mono-data mb-1">▲ SYSTEM INPUT</p>
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
              className="w-full py-3.5 rounded-full bg-white text-black font-semibold tracking-widest uppercase transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
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
