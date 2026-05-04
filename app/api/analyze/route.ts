import { NextRequest } from 'next/server'
import { callGemini, streamGemini, parseGeminiJSON } from '@/core/gemini'
import {
  buildArchetypePrompt,
  buildAdvisorPrompt,
  buildSoulTwinPrompt,
  buildReflectionPrompt,
  buildCoachPrompt,
  buildMentorPrompt,
} from '@/core/prompts'
import {
  buildDemoFallbackAnalysis,
  enrichArchetypeResult,
  getSyntheticArchiveProfile,
} from '@/core/syntheticArchive'
import type { BiometricInput, UserProfile } from '@/types/atlas'
import type {
  ArchetypeResult,
  SoulTwin,
  AdvisorResult,
  ReflectionResult,
  CoachResult,
  MentorResult,
} from '@/types/atlas'

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
  const parsed: BiometricInput & { userProfile?: UserProfile } = JSON.parse(text)
  const { userProfile, ...bio } = parsed

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`))
      }

      try {
        // 1. Archetype + advisor in parallel (non-streaming for reliability)
        const [archetypeRaw, advisorRaw] = await Promise.all([
          callGemini(buildArchetypePrompt(bio, userProfile)),
          callGemini(buildAdvisorPrompt(bio, userProfile)),
        ])

        const archetype = enrichArchetypeResult(parseGeminiJSON<ArchetypeResult>(archetypeRaw), 'hybrid')
        send({ type: 'archetype', data: archetype })

        const advisor = parseGeminiJSON<AdvisorResult>(advisorRaw)
        send({ type: 'advisor', data: advisor })

        // 2. Insight peek — stream narrative prompt and grab first sentence
        const narrativeStream = await streamGemini(
          `${buildAdvisorPrompt(bio, userProfile)}\n\nReturn ONLY the narrative field value as plain text (no JSON). 1-2 sentences only.`
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
        const soulRaw = await callGemini(buildSoulTwinPrompt(bio, userProfile))
        const soulParsed = parseGeminiJSON<{ soul_twins: SoulTwin[] }>(soulRaw)
        let twins = soulParsed.soul_twins ?? []

        // Synthetic Paralympic parity fallback
        const hasParalympic = twins.some((t) => t.games_type === 'Paralympic')
        if (!hasParalympic) {
          twins = [...twins, getSyntheticArchiveProfile(archetype.archetype).eraEchoes[1]]
        }
        send({ type: 'soul_twins', data: twins })

        // 4. Reflection
        const reflRaw = await callGemini(buildReflectionPrompt(bio, archetype.archetype, userProfile))
        const reflection = parseGeminiJSON<ReflectionResult>(reflRaw)
        send({ type: 'reflection', data: reflection })

        // 5. Preload selected agent lens for a smoother demo reveal.
        if (bio.agentMode === 'coach') {
          const coachRaw = await callGemini(buildCoachPrompt(bio, userProfile))
          const coach = parseGeminiJSON<CoachResult>(coachRaw)
          send({ type: 'coach', data: coach })
        }

        if (bio.agentMode === 'mentor') {
          const mentorRaw = await callGemini(buildMentorPrompt(bio, userProfile))
          const mentor = parseGeminiJSON<MentorResult>(mentorRaw)
          send({ type: 'mentor', data: mentor })
        }

        send({ type: 'done', data: null })
      } catch (err) {
        const fallback = buildDemoFallbackAnalysis(bio)
        send({ type: 'archetype', data: fallback.archetype })
        send({ type: 'advisor', data: fallback.advisor })
        send({ type: 'insight_peek', data: fallback.advisor.narrative.split('.')[0] + '.' })
        send({ type: 'soul_twins', data: fallback.soul_twins })
        send({ type: 'reflection', data: fallback.reflection })
        if (bio.agentMode === 'coach') send({ type: 'coach', data: fallback.coach })
        if (bio.agentMode === 'mentor') send({ type: 'mentor', data: fallback.mentor })
        send({ type: 'done', data: { fallback: true, reason: String(err) } })
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
