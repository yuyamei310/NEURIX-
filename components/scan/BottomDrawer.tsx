'use client'

interface BottomDrawerProps {
  onAnalyze: () => void
}

export function BottomDrawer({ onAnalyze }: BottomDrawerProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 backdrop-blur-md"
      style={{
        background: 'linear-gradient(to top, rgba(6,6,8,0.98) 70%, rgba(6,6,8,0.8))',
        borderTop: '1px solid rgba(var(--glow-rgb), 0.2)',
        zIndex: 50,
      }}
    >
      <div className="max-w-2xl mx-auto px-6 py-5">
        <button
          onClick={onAnalyze}
          className="w-full group relative overflow-hidden rounded-lg py-4 transition-all duration-300"
          style={{
            border: '1px solid rgba(var(--glow-rgb), 0.5)',
            background: 'rgba(var(--glow-rgb), 0.04)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.background = 'rgba(var(--glow-rgb), 0.1)'
            el.style.boxShadow = '0 0 24px rgba(var(--glow-rgb), 0.25), inset 0 0 24px rgba(var(--glow-rgb), 0.05)'
            el.style.borderColor = 'rgba(var(--glow-rgb), 0.8)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.background = 'rgba(var(--glow-rgb), 0.04)'
            el.style.boxShadow = ''
            el.style.borderColor = 'rgba(var(--glow-rgb), 0.5)'
          }}
        >
          <span
            className="font-orbitron font-semibold tracking-[0.18em] uppercase"
            style={{
              fontSize: 13,
              color: 'var(--glow)',
              textShadow: '0 0 10px rgba(var(--glow-rgb), 0.6)',
            }}
          >
            Analyze with Gemini →
          </span>
        </button>

        <p
          className="text-center mt-2.5 font-mono tracking-[0.18em] uppercase"
          style={{ fontSize: 9, color: 'rgba(var(--glow-rgb), 0.3)' }}
        >
          One Gemini Call · Results in ~10 seconds
        </p>
      </div>
    </div>
  )
}
