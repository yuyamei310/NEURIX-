import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-3-flash-preview'

const getClient = () => {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY not set')
  return new GoogleGenerativeAI(key)
}

export async function callGemini(prompt: string): Promise<string> {
  const genAI = getClient()
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })
  const result = await model.generateContent(prompt)
  return result.response.text()
}

export async function streamGemini(prompt: string) {
  const genAI = getClient()
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })
  return model.generateContentStream(prompt)
}

export function parseGeminiJSON<T>(text: string): T {
  // Strip markdown code fences if present
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()

  try {
    return JSON.parse(cleaned) as T
  } catch {
    // Gemini sometimes wraps JSON in extra prose — extract the JSON object/array
    const start = cleaned.search(/[{[]/)
    const lastBrace = cleaned.lastIndexOf('}')
    const lastBracket = cleaned.lastIndexOf(']')
    const end = Math.max(lastBrace, lastBracket)
    if (start !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as T
    }
    throw new Error(`Could not parse Gemini response as JSON: ${cleaned.slice(0, 200)}`)
  }
}
