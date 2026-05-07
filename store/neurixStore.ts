'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BiometricInput, LocalClassification, NeurixResult, AgentMode, CoachResult, MentorResult, UserProfile } from '@/types/neurix'

interface NeurixStore {
  // Input
  biometrics: BiometricInput
  localClassification: LocalClassification
  insightPeek: string

  // Results
  result: NeurixResult | null
  coachResult: CoachResult | null
  mentorResult: MentorResult | null
  activeAgent: AgentMode

  // Long-term memory — persists across sessions
  userProfile: UserProfile | null

  // Actions
  setBiometrics: (b: Partial<BiometricInput>) => void
  setLocalClassification: (c: LocalClassification) => void
  setInsightPeek: (peek: string) => void
  setResult: (r: NeurixResult) => void
  setCoachResult: (r: CoachResult) => void
  setMentorResult: (r: MentorResult) => void
  setActiveAgent: (mode: AgentMode) => void
  setUserProfile: (p: UserProfile) => void
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

export const useNeurixStore = create<NeurixStore>()(
  persist(
    (set, get) => ({
      biometrics: defaultBiometrics,
      localClassification: defaultClassification,
      insightPeek: '',
      result: null,
      coachResult: null,
      mentorResult: null,
      activeAgent: 'advisor',
      userProfile: null,

      setBiometrics: (b) =>
        set((state) => ({ biometrics: { ...state.biometrics, ...b } })),

      setLocalClassification: (c) => set({ localClassification: c }),

      setInsightPeek: (peek) => set({ insightPeek: peek }),

      setResult: (r) => {
        const bio = get().biometrics
        const profile: UserProfile = {
          height: bio.height,
          weight: bio.weight,
          archetype: r.archetype.archetype,
          lastUpdated: new Date().toISOString(),
        }
        set({
          result: r,
          coachResult: r.coach ?? null,
          mentorResult: r.mentor ?? null,
          userProfile: profile,
        })
      },

      setCoachResult: (r) => set({ coachResult: r }),

      setMentorResult: (r) => set({ mentorResult: r }),

      setActiveAgent: (mode) => set({ activeAgent: mode }),

      setUserProfile: (p) => set({ userProfile: p }),

      reset: () =>
        set((state) => ({
          biometrics: defaultBiometrics,
          localClassification: defaultClassification,
          insightPeek: '',
          result: null,
          coachResult: null,
          mentorResult: null,
          activeAgent: 'advisor',
          // userProfile is intentionally preserved — it is long-term memory
          userProfile: state.userProfile,
        })),
    }),
    {
      name: 'neurix-memory',
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null
          const item = localStorage.getItem(name)
          return item ? JSON.parse(item) : null
        },
        setItem: (name, value) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem(name, JSON.stringify(value))
          }
        },
        removeItem: (name) => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(name)
          }
        },
      },
      // Only persist the long-term memory fields + active session result
      partialize: (state) =>
        ({
          userProfile: state.userProfile,
          biometrics: state.biometrics,
          result: state.result,
          coachResult: state.coachResult,
          mentorResult: state.mentorResult,
          activeAgent: state.activeAgent,
        }) as NeurixStore,
    }
  )
)
