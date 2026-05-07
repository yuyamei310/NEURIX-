import { NextRequest, NextResponse } from 'next/server'
import { callGemini, parseGeminiJSON } from '@/core/gemini'
import { buildVoiceExtractPrompt } from '@/core/prompts'
import {
  mergeVoiceParseResults,
  normalizeVoiceParseResult,
  parseVoiceTranscript,
} from '@/core/voiceParse'

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

  const local = parseVoiceTranscript(transcript)
  const hasLocalData = local.height !== null || local.weight !== null || local.age !== null || local.habits.length > 0

  try {
    const raw = await callGemini(buildVoiceExtractPrompt(transcript))
    const geminiData = parseGeminiJSON<{
      height: number | null
      weight: number | null
      age: number | null
      habits: string[]
      confirmation_message: string
    }>(raw)
    const normalized = normalizeVoiceParseResult(geminiData)
    return NextResponse.json(mergeVoiceParseResults(normalized, local))
  } catch (err) {
    if (hasLocalData) {
      return NextResponse.json({
        ...local,
        demo_fallback: true,
        reason: 'local_parser',
      })
    }

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
