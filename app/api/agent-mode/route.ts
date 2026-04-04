import { NextRequest, NextResponse } from 'next/server'
import { callGemini, parseGeminiJSON } from '@/lib/gemini'
import { buildCoachPrompt, buildMentorPrompt } from '@/lib/prompts'
import type { BiometricInput, AgentMode, CoachResult, MentorResult } from '@/types/atlas'

export async function POST(req: NextRequest) {
  const { bio, mode }: { bio: BiometricInput; mode: AgentMode } = await req.json()

  try {
    if (mode === 'coach') {
      const raw = await callGemini(buildCoachPrompt(bio))
      const data = parseGeminiJSON<CoachResult>(raw)
      return NextResponse.json(data)
    }

    if (mode === 'mentor') {
      const raw = await callGemini(buildMentorPrompt(bio))
      const data = parseGeminiJSON<MentorResult>(raw)
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
