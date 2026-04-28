'use client'

import { useState, useEffect } from 'react'
import { useAtlasStore } from '@/store/atlasStore'
import { AgentAdvisor } from './AgentAdvisor'
import { AgentCoach } from './AgentCoach'
import { AgentMentor } from './AgentMentor'
import { getSyntheticArchiveProfile } from '@/lib/syntheticArchive'
import type { AgentMode } from '@/types/atlas'

const TABS: { key: AgentMode; label: string; desc: string }[] = [
  { key: 'advisor', label: 'Advisor', desc: 'Blueprint reasoning' },
  { key: 'coach', label: 'Coach', desc: 'Pathway protocol' },
  { key: 'mentor', label: 'Mentor', desc: 'LA28 story arc' },
]

export function AgentTabs() {
  const activeAgent = useAtlasStore((s) => s.activeAgent)
  const setActiveAgent = useAtlasStore((s) => s.setActiveAgent)
  const result = useAtlasStore((s) => s.result)
  const coachResult = useAtlasStore((s) => s.coachResult)
  const mentorResult = useAtlasStore((s) => s.mentorResult)
  const biometrics = useAtlasStore((s) => s.biometrics)
  const setCoachResult = useAtlasStore((s) => s.setCoachResult)
  const setMentorResult = useAtlasStore((s) => s.setMentorResult)

  const [visible, setVisible] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState<AgentMode | null>(null)

  const fetchAgentMode = async (mode: 'coach' | 'mentor') => {
    setLoading(true)
    setLoadError(null)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    try {
      const res = await fetch('/api/agent-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: biometrics, mode }),
        signal: controller.signal,
      })
      const data = await res.json()
      if (mode === 'coach') setCoachResult(data)
      else setMentorResult(data)
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        setLoadError(mode)
      }
    } finally {
      clearTimeout(timeout)
      setLoading(false)
    }
  }

  const switchTab = async (mode: AgentMode) => {
    if (mode === activeAgent) return
    setVisible(false)
    await new Promise((r) => setTimeout(r, 200))
    setActiveAgent(mode)
    setLoadError(null)
    setVisible(true)

    if (mode === 'coach' && !coachResult && !result?.coach) {
      fetchAgentMode('coach')
    }
    if (mode === 'mentor' && !mentorResult && !result?.mentor) {
      fetchAgentMode('mentor')
    }
  }

  // Set initial agent from biometrics preference
  useEffect(() => {
    setActiveAgent(biometrics.agentMode)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!result) return null
  const profile = getSyntheticArchiveProfile(result.archetype.archetype)
  const hydratedCoach = coachResult ?? result.coach
  const hydratedMentor = mentorResult ?? result.mentor

  return (
    <div className="flex flex-col gap-6">
      {/* Agent lens controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px border border-white/[0.06] bg-white/[0.04]">
        {TABS.map(({ key, label, desc }) => (
          <button
            key={key}
            onClick={() => switchTab(key)}
            className={`p-4 text-left transition-colors cursor-pointer ${
              activeAgent === key
                ? 'bg-[var(--surface-2)] text-white'
                : 'bg-[var(--bg)] text-[var(--text-2)] hover:bg-[var(--surface-1)]'
            }`}
            style={activeAgent === key ? { boxShadow: `inset 0 2px 0 ${profile.color}` } : undefined}
          >
            <span className="block font-mono text-[13px] font-semibold uppercase tracking-widest">{label}</span>
            <span className="block mt-1 font-mono text-[9px] uppercase tracking-widest opacity-45">{desc}</span>
          </button>
        ))}
      </div>

      {/* Content with fade transition */}
      <div
        className="transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {loading && (
          <div className="py-8 flex items-center gap-3 text-[var(--text-3)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-3)] animate-pulse" />
            <span className="text-[13px] font-mono">Generating {activeAgent} analysis...</span>
          </div>
        )}

        {!loading && loadError && (
          <div className="py-8 flex flex-col gap-3">
            <span className="text-[13px] font-mono text-[var(--text-3)]">
              Analysis timed out — Gemini took too long.
            </span>
            <button
              onClick={() => fetchAgentMode(loadError as 'coach' | 'mentor')}
              className="self-start px-4 py-2 text-[12px] font-mono border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-colors rounded-[8px] cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && activeAgent === 'advisor' && result.advisor && (
          <AgentAdvisor data={result.advisor} />
        )}

        {!loading && activeAgent === 'coach' && hydratedCoach && (
          <AgentCoach data={hydratedCoach} />
        )}

        {!loading && activeAgent === 'mentor' && hydratedMentor && (
          <AgentMentor data={hydratedMentor} />
        )}

        {!loading && activeAgent === 'coach' && !hydratedCoach && (
          <div className="py-4 text-[13px] text-[var(--text-3)]">Loading coach analysis...</div>
        )}

        {!loading && activeAgent === 'mentor' && !hydratedMentor && (
          <div className="py-4 text-[13px] text-[var(--text-3)]">Loading mentor analysis...</div>
        )}
      </div>
    </div>
  )
}
