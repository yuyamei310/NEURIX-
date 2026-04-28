'use client'

import type { CSSProperties } from 'react'
import { useAtlasStore } from '@/store/atlasStore'
import { localClassify } from '@/lib/classifier'
import { getSyntheticArchiveProfile } from '@/lib/syntheticArchive'
import type { Habit } from '@/types/atlas'

const HABITS: { key: Habit; label: string }[] = [
  { key: 'strength', label: 'Strength training' },
  { key: 'running', label: 'Running' },
  { key: 'swimming', label: 'Swimming' },
  { key: 'team_sports', label: 'Team sports' },
  { key: 'martial_arts', label: 'Martial arts' },
  { key: 'gymnastics', label: 'Gymnastics' },
  { key: 'racket', label: 'Racket sports' },
  { key: 'wheelchair_sport', label: 'Wheelchair sport' },
  { key: 'para_athletics', label: 'Para athletics' },
]

export function HabitGrid() {
  const biometrics = useAtlasStore((s) => s.biometrics)
  const localClassification = useAtlasStore((s) => s.localClassification)
  const setBiometrics = useAtlasStore((s) => s.setBiometrics)
  const setLocalClassification = useAtlasStore((s) => s.setLocalClassification)
  const profile = getSyntheticArchiveProfile(localClassification.archetype)

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
      <div className="flex flex-wrap gap-2">
        {HABITS.map(({ key, label }) => {
          const active = biometrics.habits.includes(key)
          return (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`px-3 py-1.5 rounded-pill text-[13px] border border-[0.5px] transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                active
                  ? 'font-semibold'
                  : 'bg-[var(--surface-1)] text-[var(--text-2)] border-[var(--border-2)] hover:bg-[var(--surface-2)]'
              }`}
              style={
                active
                  ? {
                      background: profile.color,
                      borderColor: profile.color,
                      color: '#050505',
                      boxShadow: `0 0 16px ${profile.color}30`,
                    }
                  : { '--tw-ring-color': profile.color } as CSSProperties
              }
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
