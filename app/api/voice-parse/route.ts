import { NextRequest, NextResponse } from 'next/server'
import { callGemini, parseGeminiJSON } from '@/core/gemini'
import { buildVoiceExtractPrompt } from '@/core/prompts'

export async function POST(req: NextRequest) {
  const { transcript } = await req.json()
  if (!transcript) {
    return NextResponse.json({
      height: null,
      weight: null,
      age: null,
      habits: [],
      confirmation_message: 'I could not hear biometric details. You can enter them manually below.',
    })
  }

  try {
    const raw = await callGemini(buildVoiceExtractPrompt(transcript))
    const data = parseGeminiJSON<{
      height: number | null
      weight: number | null
      age: number | null
      habits: string[]
      confirmation_message: string
    }>(raw)
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({
      height: null,
      weight: null,
      age: null,
      habits: [],
      confirmation_message: 'Voice parsing is unavailable right now. Manual input still works.',
      demo_fallback: true,
      reason: String(err),
    })
  }
}
