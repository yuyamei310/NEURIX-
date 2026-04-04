'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useAtlasStore } from '@/store/atlasStore'

export function LandingHero() {
  const router = useRouter()
  const reset = useAtlasStore((s) => s.reset)

  const handleStart = () => {
    reset()
    router.push('/scan')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
      {/* Wordmark */}
      <div className="mb-16 text-center">
        <div className="font-mono-data mb-4">TEAM USA · ATHLETE INTELLIGENCE</div>
        <h1 className="text-hero mb-6">ATLAS</h1>
        <p className="text-body max-w-[440px] mx-auto text-center">
          Input your biometrics, speak your story — ATLAS finds your place in
          120 years of Team USA history and shows you the path forward.
        </p>
      </div>

      {/* CTA */}
      <Button size="lg" onClick={handleStart}>
        Begin scan →
      </Button>

      {/* Feature line */}
      <div className="mt-20 flex gap-8 flex-wrap justify-center">
        {[
          'Voice input',
          'Live 3D body',
          'AI archetype',
          'Soul twins',
          'Paralympic-first',
        ].map((f) => (
          <span key={f} className="font-mono-data">
            {f}
          </span>
        ))}
      </div>

      {/* Bottom attribution */}
      <div className="absolute bottom-8 font-mono-data">
        Powered by Gemini · Google Cloud Run
      </div>
    </main>
  )
}
