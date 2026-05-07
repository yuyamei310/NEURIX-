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

const MODE_ANALYSIS_COPY: Record<AgentMode, {
  eyebrow: string
  title: string
  detail: string
  steps: string[]
}> = {
  advisor: {
    eyebrow: 'Advisor lens recalibration',
    title: 'Rechecking archive reasoning...',
    detail: 'NEURIX is rebuilding the evidence chain behind this archetype signal.',
    steps: ['Body signal weighted', 'Key factors ranked', 'Ethics language checked'],
  },
  coach: {
    eyebrow: 'Coach lens synthesis',
    title: 'Mapping sport pathways...',
    detail: 'NEURIX is translating your profile into practical training and pathway options.',
    steps: ['Sport fit compared', 'Entry points scored', 'Training phases drafted'],
  },
  mentor: {
    eyebrow: 'Mentor lens projection',
    title: 'Projecting long-term trajectory...',
    detail: 'NEURIX is shaping the same signal into a conditional LA28 story arc.',
    steps: ['Timeline staged', 'Motivation pattern read', 'Future milestones aligned'],
  },
}

const MINI_ANALYSIS_MS = 1150

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

  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState<AgentMode | null>(null)
  const [analyzingMode, setAnalyzingMode] = useState<AgentMode | null>(null)
  const [displayMode, setDisplayMode] = useState<AgentMode>(activeAgent)

  const fetchAgentMode = async (mode: 'coach' | 'mentor') => {
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
    }
  }

  const runModeAnalysis = async (mode: AgentMode, forceFetch = false) => {
    const needsFetch = forceFetch || (mode === 'coach'
      ? !coachResult && !result?.coach
      : mode === 'mentor'
      ? !mentorResult && !result?.mentor
      : false)

    setLoading(needsFetch)
    setAnalyzingMode(mode)
    setActiveAgent(mode)
    setLoadError(null)

    const startedAt = Date.now()
    const fetchPromise =
      mode === 'coach' && needsFetch
        ? fetchAgentMode('coach')
        : mode === 'mentor' && needsFetch
        ? fetchAgentMode('mentor')
        : Promise.resolve()

    await fetchPromise
    const remainingRevealMs = Math.max(0, MINI_ANALYSIS_MS - (Date.now() - startedAt))
    if (remainingRevealMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, remainingRevealMs))
    }

    setDisplayMode(mode)
    setLoading(false)
    setAnalyzingMode(null)
  }

  const switchTab = async (mode: AgentMode) => {
    if (mode === activeAgent || analyzingMode) return
    runModeAnalysis(mode)
  }

  const retryAnalysis = async () => {
    if (!loadError || analyzingMode) return
    runModeAnalysis(loadError, true)
  }

  useEffect(() => {
    setActiveAgent(biometrics.agentMode)
    setDisplayMode(biometrics.agentMode)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!result) return null

  const hydratedCoach = coachResult ?? result.coach
  const hydratedMentor = mentorResult ?? result.mentor
  const activeTab = TABS.find((t) => t.key === activeAgent)!
  const displayTab = TABS.find((t) => t.key === displayMode)!
  const analysisCopy = MODE_ANALYSIS_COPY[analyzingMode ?? activeAgent]
  const paneColor = analyzingMode ? activeTab.color : displayTab.color
  const paneBorder = analyzingMode ? activeTab.border : displayTab.border
  const paneSoft = analyzingMode ? activeTab.soft : displayTab.soft

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
              disabled={Boolean(analyzingMode)}
              className="relative p-5 text-left transition-all duration-300 cursor-pointer overflow-hidden flex flex-col gap-2.5"
              style={{
                background: isActive ? tab.soft : 'var(--bg)',
                borderBottom: `2px solid ${isActive ? tab.color : 'transparent'}`,
                cursor: analyzingMode ? 'wait' : 'pointer',
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
          borderColor: paneBorder,
          background: paneSoft,
        }}
      >
        <div className="relative min-h-[320px] overflow-hidden p-6">
          <div
            className="transition-all duration-300"
            style={{
              opacity: analyzingMode ? 0.18 : 1,
              filter: analyzingMode ? 'blur(3px)' : 'blur(0)',
              transform: analyzingMode ? 'translateY(6px)' : 'translateY(0)',
            }}
          >
            {!loadError && displayMode === 'advisor' && result.advisor && (
              <AgentAdvisor data={result.advisor} />
            )}
            {!loadError && displayMode === 'coach' && hydratedCoach && (
              <AgentCoach data={hydratedCoach} />
            )}
            {!loadError && displayMode === 'mentor' && hydratedMentor && (
              <AgentMentor data={hydratedMentor} />
            )}
            {!loadError && displayMode === 'coach' && !hydratedCoach && (
              <div className="py-4 font-mono text-[11px] uppercase tracking-widest" style={{ color: 'rgba(255,138,76,0.4)' }}>
                Coach analysis pending...
              </div>
            )}
            {!loadError && displayMode === 'mentor' && !hydratedMentor && (
              <div className="py-4 font-mono text-[11px] uppercase tracking-widest" style={{ color: 'rgba(180,0,255,0.4)' }}>
                Mentor analysis pending...
              </div>
            )}
          </div>

          {analyzingMode && (
            <div className="absolute inset-0 flex items-center justify-center p-5">
              <div
                className="pointer-events-none absolute left-0 right-0 top-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${activeTab.color}, transparent)`,
                  boxShadow: `0 0 18px ${activeTab.color}66`,
                  animation: 'agent-analysis-pass 1.1s linear infinite',
                }}
              />
              <div
                className="relative w-full max-w-3xl border bg-black/70 p-5 sm:p-6"
                style={{
                  borderColor: activeTab.border,
                  boxShadow: `0 18px 70px rgba(0,0,0,0.55), 0 0 38px ${activeTab.color}12`,
                }}
              >
                <div className="absolute left-0 top-0 h-3 w-3" style={{ borderLeft: `1px solid ${activeTab.color}`, borderTop: `1px solid ${activeTab.color}` }} />
                <div className="absolute bottom-0 right-0 h-3 w-3" style={{ borderBottom: `1px solid ${activeTab.color}`, borderRight: `1px solid ${activeTab.color}` }} />

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="font-mono text-[8px] uppercase tracking-[0.24em]" style={{ color: activeTab.color }}>
                      {analysisCopy.eyebrow}
                    </div>
                    <div className="mt-2 font-mono text-[18px] font-bold uppercase tracking-[0.08em] text-white sm:text-[22px]">
                      {analysisCopy.title}
                    </div>
                    <p className="mt-3 max-w-xl text-[12px] leading-relaxed text-white/42 font-sans">
                      {analysisCopy.detail}
                    </p>
                  </div>

                  <div className="relative h-20 w-20 shrink-0 self-start md:self-center">
                    <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${activeTab.color}55`, animation: 'ring-spin-cw 2.4s linear infinite' }} />
                    <div className="absolute inset-3 rounded-full" style={{ border: `1px dashed ${activeTab.color}80`, animation: 'ring-spin-ccw 3.2s linear infinite' }} />
                    <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: activeTab.color, boxShadow: `0 0 18px ${activeTab.color}` }} />
                  </div>
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  {analysisCopy.steps.map((step, index) => (
                    <div key={step} className="border px-3 py-2" style={{ borderColor: activeTab.border, background: `${activeTab.color}08` }}>
                      <div className="mb-1 font-mono text-[8px] uppercase tracking-[0.18em]" style={{ color: activeTab.color }}>
                        0{index + 1}
                      </div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/38">
                        {step}
                      </div>
                    </div>
                  ))}
                </div>

                {loading && (
                  <div className="mt-5 flex items-center gap-3">
                    <div
                      className="h-1.5 w-1.5 rounded-full animate-pulse"
                      style={{ background: activeTab.color }}
                    />
                    <span
                      className="font-mono text-[10px] uppercase tracking-widest"
                      style={{ color: activeTab.color }}
                    >
                      Generating fresh {analyzingMode} analysis...
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {!analyzingMode && loadError && (
            <div className="py-8 flex flex-col gap-3">
              <span className="font-mono text-[11px] uppercase tracking-widest text-white/25">
                Analysis timed out — Gemini took too long.
              </span>
              <button
                onClick={retryAnalysis}
                className="self-start px-4 py-2 font-mono text-[10px] border uppercase tracking-widest transition-all cursor-pointer"
                style={{ borderColor: paneBorder, color: paneColor }}
              >
                Retry →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
