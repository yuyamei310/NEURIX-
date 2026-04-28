export interface GeminiTextPart {
  text: string
}

export interface GeminiContent {
  parts: GeminiTextPart[]
  role: string
}

export interface GeminiCandidate {
  content: GeminiContent
  finishReason: string
}

export interface GeminiResponse {
  candidates: GeminiCandidate[]
}

export interface SSEChunk {
  type: 'archetype' | 'soul_twins' | 'reflection' | 'advisor' | 'coach' | 'mentor' | 'insight_peek' | 'done' | 'error'
  data: unknown
}
