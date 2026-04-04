'use client'

import { useState, ReactNode } from 'react'

interface BottomDrawerProps {
  children: ReactNode
  onAnalyze: () => void
}

export function BottomDrawer({ children, onAnalyze }: BottomDrawerProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Dim overlay — rendered when open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col"
        style={{
          height: '60vh',
          transform: open ? 'translateY(0)' : 'translateY(calc(100% - 56px))',
          transition: 'transform 350ms ease-in-out',
        }}
      >
        {/* Collapsed strip / drawer handle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-between px-6 h-14 shrink-0 bg-[#111111] border-t border-white/[0.08] cursor-pointer w-full text-left"
        >
          <div className="flex flex-col gap-0.5">
            <span className="font-mono-data text-white/60">SYSTEM INPUT LAYER</span>
            <span className="font-mono-data text-white/30">BIOMETRICS · HABITS · MODE</span>
          </div>
          <span
            className="font-mono-data text-white/40"
            style={{
              display: 'inline-block',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 350ms ease-in-out',
            }}
          >
            ↑
          </span>
        </button>

        {/* Scrollable input content */}
        <div className="flex-1 overflow-y-auto bg-[#111111] px-6 pt-6 pb-4 flex flex-col gap-8">
          {children}

          {/* CTA */}
          <button
            onClick={onAnalyze}
            className="w-full py-3 bg-white text-black rounded-[10px] font-mono-data hover:opacity-90 transition-opacity cursor-pointer shrink-0"
          >
            Begin Full Scan →
          </button>
        </div>
      </div>
    </>
  )
}
