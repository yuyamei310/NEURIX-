'use client'

import { useAtlasStore } from '@/store/atlasStore'
import { localClassify } from '@/lib/classifier'
import type { Habit } from '@/types/atlas'

const HABITS: { key: Habit; label: string; glyph: string }[] = [
  { key: 'strength',         label: 'Strength',     glyph: '⚡' },
  { key: 'running',          label: 'Running',       glyph: '◈' },
  { key: 'swimming',         label: 'Swimming',      glyph: '≋' },
  { key: 'team_sports',      label: 'Team sports',   glyph: '⬡' },
  { key: 'martial_arts',     label: 'Martial arts',  glyph: '◆' },
  { key: 'gymnastics',       label: 'Gymnastics',    glyph: '✦' },
  { key: 'racket',           label: 'Racket',        glyph: '◇' },
  { key: 'wheelchair_sport', label: 'Wheelchair',    glyph: '⊕' },
  { key: 'para_athletics',   label: 'Para athletics',glyph: '∞' },
]

export function HabitGrid() {
  const biometrics = useAtlasStore((s) => s.biometrics)
  const setBiometrics = useAtlasStore((s) => s.setBiometrics)
  const setLocalClassification = useAtlasStore((s) => s.setLocalClassification)

  const toggle = (key: Habit) => {
    const current = biometrics.habits
    const next = current.includes(key)
      ? current.filter((h) => h !== key)
      : [...current, key]
    setBiometrics({ habits: next })
    const result = localClassify(biometrics.height, biometrics.weight, biometrics.age, next)
    setLocalClassification(result)
  }

  return (
    <div>
      <div
        className="mb-3 font-mono tracking-[0.14em] uppercase"
        style={{ fontSize: 10, color: 'var(--text-3)' }}
      >
        ACTIVITY BACKGROUND
      </div>
      <div className="flex flex-wrap gap-2">
        {HABITS.map(({ key, label, glyph }) => {
          const active = biometrics.habits.includes(key)
          return (
            <button
              key={key}
              onClick={() => toggle(key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[13px] transition-all duration-200 cursor-pointer"
              style={{
                border: '1px solid',
                borderColor: active
                  ? 'rgba(var(--glow-rgb), 0.7)'
                  : 'var(--border-2)',
                background: active
                  ? 'rgba(var(--glow-rgb), 0.08)'
                  : 'var(--surface-1)',
                color: active ? 'var(--glow)' : 'var(--text-2)',
                boxShadow: active
                  ? '0 0 8px rgba(var(--glow-rgb), 0.15)'
                  : 'none',
                textShadow: active
                  ? '0 0 6px rgba(var(--glow-rgb), 0.5)'
                  : 'none',
              }}
            >
              <span style={{ fontSize: 11, opacity: active ? 1 : 0.6 }}>{glyph}</span>
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
