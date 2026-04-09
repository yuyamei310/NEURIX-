'use client'

import React from 'react'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  unit: string
  hint?: string
  onChange: (value: number) => void
}

export function Slider({ label, value, min, max, unit, hint, onChange }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between">
        <div className="flex flex-col gap-0.5">
          <span
            className="font-mono tracking-[0.14em] uppercase"
            style={{ fontSize: 10, color: 'var(--text-3)' }}
          >
            {label}
          </span>
          {hint && (
            <span
              className="font-mono tracking-[0.1em] uppercase transition-all duration-300"
              style={{
                fontSize: 9,
                color: 'var(--glow)',
                opacity: 0.7,
                textShadow: '0 0 6px rgba(var(--glow-rgb), 0.5)',
              }}
            >
              {hint}
            </span>
          )}
        </div>
        <span
          className="font-mono font-semibold tracking-tight"
          style={{ fontSize: 15, color: 'var(--text)' }}
        >
          {value}
          <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 2, fontWeight: 400 }}>
            {unit}
          </span>
        </span>
      </div>

      {/* Track */}
      <div
        className="relative rounded-full"
        style={{ height: 2, background: 'var(--border)' }}
      >
        {/* Filled portion — cyan gradient */}
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-75"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(to right, rgba(var(--glow-rgb), 0.6), var(--glow))`,
            boxShadow: `0 0 6px rgba(var(--glow-rgb), 0.5)`,
          }}
        />

        {/* Invisible native range for interaction */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full opacity-0 cursor-pointer"
          style={{ top: -10, height: 24, margin: 0 }}
        />

        {/* Glowing thumb */}
        <div
          className="absolute rounded-full -translate-y-1/2 pointer-events-none transition-all duration-75"
          style={{
            top: '50%',
            left: `calc(${pct}% - 7px)`,
            width: 14,
            height: 14,
            background: 'var(--bg)',
            border: '1.5px solid var(--glow)',
            boxShadow: '0 0 8px rgba(var(--glow-rgb), 0.7), 0 0 2px rgba(var(--glow-rgb), 1)',
          }}
        />
      </div>
    </div>
  )
}
