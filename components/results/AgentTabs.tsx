'use client'

import { useState, useEffect } from 'react'
import { useAtlasStore } from '@/store/atlasStore'
import { AgentAdvisor } from './AgentAdvisor'
import { AgentCoach } from './AgentCoach'
import { AgentMentor } from './AgentMentor'
import type { AgentMode } from '@/types/atlas'

const TABS: { key: AgentMode; label: string }[] = [
  { key: 'advisor', label: 'Advisor' },
  { key: 'coach', label: 'Coach' },
  { key: 'mentor', label: 'Mentor' },
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

  const switchTab = async (mode: AgentMode) => {
    if (mode === activeAgent) return
    setVisible(false)
    await new Promise((r) => setTimeout(r, 200))
    setActiveAgent(mode)
    setVisible(true)

    // Lazy-fetch coach/mentor
    if (mode === 'coach' && !coachResult) {
      setLoading(true)
      try {
        const res = await fetch('/api/agent-mode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bio: biometrics, mode: 'coach' }),
        })
        const data = await res.json()
        setCoachResult(data)
      } catch { /* silent */ }
      setLoading(false)
    }

    if (mode === 'mentor' && !mentorResult) {
      setLoading(true)
      try {
        const res = await fetch('/api/agent-mode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bio: biometrics, mode: 'mentor' }),
        })
        const data = await res.json()
        setMentorResult(data)
      } catch { /* silent */ }
      setLoading(false)
    }
  }

  // Set initial agent from biometrics preference
  useEffect(() => {
    setActiveAgent(biometrics.agentMode)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!result) return null

  return (
    <div className="flex flex-col gap-6">
      {/* Tab pills */}
      <div className="flex gap-2">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => switchTab(key)}
            className={`px-5 py-2 rounded-pill text-[13px] font-medium border border-[0.5px] transition-colors cursor-pointer ${
              activeAgent === key
                ? 'bg-[var(--text)] text-white border-[var(--text)]'
                : 'bg-white text-[var(--text-2)] border-[var(--border-2)] hover:bg-[var(--surface-2)]'
            }`}
          >
            {label}
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

        {!loading && activeAgent === 'advisor' && result.advisor && (
          <AgentAdvisor data={result.advisor} />
        )}

        {!loading && activeAgent === 'coach' && coachResult && (
          <AgentCoach data={coachResult} />
        )}

        {!loading && activeAgent === 'mentor' && mentorResult && (
          <AgentMentor data={mentorResult} />
        )}

        {!loading && activeAgent === 'coach' && !coachResult && (
          <div className="py-4 text-[13px] text-[var(--text-3)]">Loading coach analysis...</div>
        )}

        {!loading && activeAgent === 'mentor' && !mentorResult && (
          <div className="py-4 text-[13px] text-[var(--text-3)]">Loading mentor analysis...</div>
        )}
      </div>
    </div>
  )
}
