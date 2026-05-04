'use client'

import { useState, useEffect } from 'react'
import { useAtlasStore } from '@/store/atlasStore'
import { AgentAdvisor } from './AgentAdvisor'
import { AgentCoach } from './AgentCoach'
import { AgentMentor } from './AgentMentor'
import type { AgentMode } from '@/types/atlas'

const TABS: {
  key: AgentMode
  label: string
  desc: string
  icon: string
  tag: string
  color: string
  soft: string
  border: string
}[] = [
  {
    key: 'advisor',
    label: 'ADVISOR',
    desc: 'Blueprint reasoning',
    icon: '◈',
    tag: 'ANALYTICAL',
    color: '#FFBB99',
    soft: 'rgba(255,187,153,0.055)',
    border: 'rgba(255,187,153,0.2)',
  },
  {
    key: 'coach',
    label: 'COACH',
    desc: 'Pathway protocol',
    icon: '▲',
    tag: 'PERFORMANCE',
    color: '#FF8A4C',
    soft: 'rgba(255,138,76,0.055)',
    border: 'rgba(255,138,76,0.2)',
  },
  {
    key: 'mentor',
    label: 'MENTOR',
    desc: 'LA28 story arc',
    icon: '◎',
    tag: 'NARRATIVE',
    color: '#b400ff',
    soft: 'rgba(180,0,255,0.055)',
    border: 'rgba(180,0,255,0.2)',
  },
]

export function AgentTabs() {
  const activeAgent = useAtlasStore((s) => s.activeAgent)
  const setActiveAgent = useAtlasStore((s) => s.setActiveAgent)
  const result = useAtlasStore((s) => s.result)
  const coachResult = useAtlasStore((s) => s.coachResult)
  const mentorResult = useAtlasStore((s) => s.mentorResult)
  const biometrics = useAtlasStore((s) => s.biometrics)
  const userProfile = useAtlasStore((s) => s.userProfile)
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
        body: JSON.stringify({ bio: biometrics, mode, ...(userProfile ? { userProfile } : {}) }),
        signal: controller.signal,
      })
      const data = await res.json()
      if (mode === 'coach') setCoachResult(data)
      else setMentorResult(data)
    } catch (err) {
      if ((err as Error).name === 'AbortError') setLoadError(mode)
    } finally {
      clearTimeout(timeout)
      setLoading(false)
    }
  }

  const switchTab = async (mode: AgentMode) => {
    if (mode === activeAgent) return
    setVisible(false)
    await new Promise((r) => setTimeout(r, 180))
    setActiveAgent(mode)
    setLoadError(null)
    setVisible(true)
    if (mode === 'coach' && !coachResult && !result?.coach) fetchAgentMode('coach')
    if (mode === 'mentor' && !mentorResult && !result?.mentor) fetchAgentMode('mentor')
  }

  useEffect(() => {
    setActiveAgent(biometrics.agentMode)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!result) return null

  const hydratedCoach = coachResult ?? result.coach
  const hydratedMentor = mentorResult ?? result.mentor
  const activeTab = TABS.find((t) => t.key === activeAgent)!

  return (
    <div className="flex flex-col gap-0">
      {/* Mode selector strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.04]">
        {TABS.map((tab) => {
          const isActive = activeAgent === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => switchTab(tab.key)}
              className="relative p-5 text-left transition-all duration-300 cursor-pointer overflow-hidden flex flex-col gap-2.5"
              style={{
                background: isActive ? tab.soft : 'var(--bg)',
                borderBottom: `2px solid ${isActive ? tab.color : 'transparent'}`,
              }}
            >
              {/* Top scan line on active */}
              {isActive && (
                <div
                  className="absolute inset-x-0 top-0 h-px pointer-events-none"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${tab.color}99 50%, transparent 100%)`,
                    boxShadow: `0 0 14px ${tab.color}66`,
                  }}
                />
              )}
              {/* Corner bracket TL */}
              <div
                className="absolute top-0 left-0 w-3 h-3 pointer-events-none transition-opacity duration-300"
                style={{
                  borderTop: `1px solid ${tab.color}`,
                  borderLeft: `1px solid ${tab.color}`,
                  opacity: isActive ? 1 : 0,
                }}
              />
              {/* Corner bracket BR */}
              <div
                className="absolute bottom-0 right-0 w-3 h-3 pointer-events-none transition-opacity duration-300"
                style={{
                  borderBottom: `1px solid ${tab.color}`,
                  borderRight: `1px solid ${tab.color}`,
                  opacity: isActive ? 0.5 : 0,
                }}
              />

              <div className="flex items-start justify-between gap-2">
                <span
                  className="font-mono text-[20px] leading-none"
                  style={{
                    color: isActive ? tab.color : 'rgba(255,255,255,0.16)',
                    textShadow: isActive ? `0 0 16px ${tab.color}88` : 'none',
                    transition: 'color 0.3s ease, text-shadow 0.3s ease',
                  }}
                >
                  {tab.icon}
                </span>
                <span
                  className="font-mono text-[7px] tracking-[0.2em] uppercase px-1.5 py-0.5 border transition-all duration-300"
                  style={{
                    color: isActive ? tab.color : 'rgba(255,255,255,0.1)',
                    borderColor: isActive ? tab.border : 'rgba(255,255,255,0.05)',
                    background: isActive ? `${tab.color}12` : 'transparent',
                  }}
                >
                  {tab.tag}
                </span>
              </div>

              <span
                className="block font-mono text-[13px] font-bold uppercase tracking-[0.14em] transition-colors duration-300"
                style={{ color: isActive ? tab.color : 'rgba(255,255,255,0.3)' }}
              >
                {tab.label}
              </span>
              <span
                className="block font-mono text-[9px] uppercase tracking-widest transition-colors duration-300"
                style={{ color: isActive ? `${tab.color}80` : 'rgba(255,255,255,0.15)' }}
              >
                {tab.desc}
              </span>
            </button>
          )
        })}
      </div>

      {/* Content pane with mode-tinted frame */}
      <div
        className="border-x border-b transition-all duration-300"
        style={{
          borderColor: activeTab.border,
          background: activeTab.soft,
        }}
      >
        <div
          className="p-6 transition-opacity duration-180"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {loading && (
            <div className="py-8 flex items-center gap-3">
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: activeTab.color }}
              />
              <span
                className="font-mono text-[11px] uppercase tracking-widest"
                style={{ color: activeTab.color }}
              >
                Generating {activeAgent} analysis...
              </span>
            </div>
          )}

          {!loading && loadError && (
            <div className="py-8 flex flex-col gap-3">
              <span className="font-mono text-[11px] uppercase tracking-widest text-white/25">
                Analysis timed out — Gemini took too long.
              </span>
              <button
                onClick={() => fetchAgentMode(loadError as 'coach' | 'mentor')}
                className="self-start px-4 py-2 font-mono text-[10px] border uppercase tracking-widest transition-all cursor-pointer"
                style={{ borderColor: activeTab.border, color: activeTab.color }}
              >
                Retry →
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
            <div className="py-4 font-mono text-[11px] uppercase tracking-widest" style={{ color: 'rgba(255,138,76,0.4)' }}>
              Loading coach analysis...
            </div>
          )}
          {!loading && activeAgent === 'mentor' && !hydratedMentor && (
            <div className="py-4 font-mono text-[11px] uppercase tracking-widest" style={{ color: 'rgba(180,0,255,0.4)' }}>
              Loading mentor analysis...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
