import { NextRequest } from 'next/server'
import { callGemini, streamGemini, parseGeminiJSON } from '@/lib/gemini'
import {
  buildArchetypePrompt,
  buildAdvisorPrompt,
  buildSoulTwinPrompt,
  buildReflectionPrompt,
} from '@/lib/prompts'
import { paralympicFallback } from '@/lib/paralympicFallback'
import type { BiometricInput } from '@/types/atlas'
import type { ArchetypeResult, SoulTwin, AdvisorResult, ReflectionResult } from '@/types/atlas'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  const text = await req.text()
  if (!text) {
    return new Response(JSON.stringify({ error: 'Empty request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  const bio: BiometricInput = JSON.parse(text)

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`))
      }

      try {
        // 1. Archetype + advisor in parallel (non-streaming for reliability)
        const [archetypeRaw, advisorRaw] = await Promise.all([
          callGemini(buildArchetypePrompt(bio)),
          callGemini(buildAdvisorPrompt(bio)),
        ])

        const archetype = parseGeminiJSON<ArchetypeResult>(archetypeRaw)
        send({ type: 'archetype', data: archetype })

        const advisor = parseGeminiJSON<AdvisorResult>(advisorRaw)
        send({ type: 'advisor', data: advisor })

        // 2. Insight peek — stream narrative prompt and grab first sentence
        const narrativeStream = await streamGemini(
          `${buildAdvisorPrompt(bio)}\n\nReturn ONLY the narrative field value as plain text (no JSON). 1-2 sentences only.`
        )
        let insightText = ''
        for await (const chunk of narrativeStream.stream) {
          const text = chunk.text()
          insightText += text
          // Send first sentence as peek
          const sentenceEnd = insightText.search(/[.!?]/)
          if (sentenceEnd > 0 && insightText.length > 40) {
            send({ type: 'insight_peek', data: insightText.slice(0, sentenceEnd + 1).trim() })
            break
          }
        }

        // 3. Soul twins
        const soulRaw = await callGemini(buildSoulTwinPrompt(bio))
        const soulParsed = parseGeminiJSON<{ soul_twins: SoulTwin[] }>(soulRaw)
        let twins = soulParsed.soul_twins ?? []

        // Paralympic fallback
        const hasParalympic = twins.some((t) => t.games_type === 'Paralympic')
        if (!hasParalympic) {
          twins = [...twins, paralympicFallback[archetype.archetype]]
        }
        send({ type: 'soul_twins', data: twins })

        // 4. Reflection
        const reflRaw = await callGemini(buildReflectionPrompt(bio, archetype.archetype))
        const reflection = parseGeminiJSON<ReflectionResult>(reflRaw)
        send({ type: 'reflection', data: reflection })

        send({ type: 'done', data: null })
      } catch (err) {
        send({ type: 'error', data: String(err) })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
