import { NextRequest, NextResponse } from 'next/server'
import { callGemini, parseGeminiJSON } from '@/core/gemini'
import { buildVoiceExtractPrompt } from '@/core/prompts'

export async function POST(req: NextRequest) {
  const { transcript } = await req.json()
  if (!transcript) {
    return NextResponse.json({ error: 'No transcript provided' }, { status: 400 })
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
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
