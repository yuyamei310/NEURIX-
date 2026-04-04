'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BiometricInput, LocalClassification, AtlasResult, AgentMode, CoachResult, MentorResult } from '@/types/atlas'

interface AtlasStore {
  // Input
  biometrics: BiometricInput
  localClassification: LocalClassification
  insightPeek: string

  // Results
  result: AtlasResult | null
  coachResult: CoachResult | null
  mentorResult: MentorResult | null
  activeAgent: AgentMode

  // Actions
  setBiometrics: (b: Partial<BiometricInput>) => void
  setLocalClassification: (c: LocalClassification) => void
  setInsightPeek: (peek: string) => void
  setResult: (r: AtlasResult) => void
  setCoachResult: (r: CoachResult) => void
  setMentorResult: (r: MentorResult) => void
  setActiveAgent: (mode: AgentMode) => void
  reset: () => void
}

const defaultBiometrics: BiometricInput = {
  height: 175,
  weight: 75,
  age: 25,
  habits: [],
  agentMode: 'advisor',
}

const defaultClassification: LocalClassification = {
  archetype: 'hybrid',
  confidence: 0.65,
}

export const useAtlasStore = create<AtlasStore>()(
  persist(
    (set) => ({
      biometrics: defaultBiometrics,
      localClassification: defaultClassification,
      insightPeek: '',
      result: null,
      coachResult: null,
      mentorResult: null,
      activeAgent: 'advisor',

      setBiometrics: (b) =>
        set((state) => ({ biometrics: { ...state.biometrics, ...b } })),

      setLocalClassification: (c) => set({ localClassification: c }),

      setInsightPeek: (peek) => set({ insightPeek: peek }),

      setResult: (r) => set({ result: r }),

      setCoachResult: (r) => set({ coachResult: r }),

      setMentorResult: (r) => set({ mentorResult: r }),

      setActiveAgent: (mode) => set({ activeAgent: mode }),

      reset: () =>
        set({
          biometrics: defaultBiometrics,
          localClassification: defaultClassification,
          insightPeek: '',
          result: null,
          coachResult: null,
          mentorResult: null,
          activeAgent: 'advisor',
        }),
    }),
    {
      name: 'atlas-session',
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null
          const item = sessionStorage.getItem(name)
          return item ? JSON.parse(item) : null
        },
        setItem: (name, value) => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(name, JSON.stringify(value))
          }
        },
        removeItem: (name) => {
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem(name)
          }
        },
      },
    }
  )
)
