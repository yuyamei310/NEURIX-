'use client'

import React from 'react'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  unit: string
  onChange: (value: number) => void
}

export function Slider({ label, value, min, max, unit, onChange }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="font-mono-data">{label}</span>
        <span className="font-mono text-[15px] font-semibold tracking-tight text-[var(--text)]">
          {value}
          <span className="text-[11px] text-[var(--text-3)] ml-0.5 font-normal">{unit}</span>
        </span>
      </div>
      <div className="relative h-[2px] bg-[var(--border)] rounded-full">
        <div
          className="absolute left-0 top-0 h-full bg-[var(--text)] rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-6 -top-2"
          style={{ margin: 0 }}
        />
        <div
          className="absolute top-1/2 w-3 h-3 rounded-full bg-white border border-[var(--border-2)] shadow-sm -translate-y-1/2 transition-all pointer-events-none"
          style={{ left: `calc(${pct}% - 6px)` }}
        />
      </div>
    </div>
  )
}
