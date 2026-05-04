'use client'

interface Step3DiscoverProps {
  onBeginScan: () => void
}

const CARDS = [
  {
    id: 'archetype',
    num: '01',
    title: 'Your Archetype',
    desc: 'Understand how your profile aligns with athlete patterns',
    glowColor: 'rgba(255,107,53,0.55)',
  },
  {
    id: 'advisor',
    num: '02',
    title: 'Advisor',
    desc: 'See why this classification fits you',
    glowColor: 'rgba(0,255,157,0.45)',
  },
  {
    id: 'coach',
    num: '03',
    title: 'Coach',
    desc: 'Explore sports that could match your profile',
    glowColor: 'rgba(180,0,255,0.45)',
  },
  {
    id: 'dna',
    num: '04',
    title: 'Your Athlete DNA',
    desc: 'Generate a visual card you can share',
    glowColor: 'rgba(255,138,76,0.45)',
  },
]

export function Step3Discover({ onBeginScan }: Step3DiscoverProps) {
  return (
    <div className="w-full max-w-[660px] mx-auto px-6 py-10">

      {/* Title */}
      <div className="mb-9 reveal-1">
        <div className="font-mono-data mb-3" style={{ color: 'var(--glow)' }}>
          03 / 03 — PREVIEW
        </div>
        <h2
          style={{
            fontFamily: 'var(--display)',
            fontSize: 'clamp(26px, 4.5vw, 36px)',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.12,
            color: 'var(--text)',
          }}
        >
          What You<br />Will Discover
        </h2>
      </div>

      {/* 2×2 card grid */}
      <div className="grid grid-cols-2 gap-3.5 mb-9">
        {CARDS.map((card, i) => (
          <DiscoverCard key={card.id} card={card} delay={i * 0.12} />
        ))}
      </div>

      {/* Emotional tagline */}
      <div
        className="reveal-5 mb-10 text-center"
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 11,
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.05em',
          fontStyle: 'italic',
          lineHeight: 1.6,
        }}
      >
        &ldquo;This system doesn&apos;t define you.<br />
        It shows where you fit in history.&rdquo;
      </div>

      {/* CTA */}
      <div className="reveal-5 flex justify-center">
        <div className="relative">
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: '-55%',
              background: 'radial-gradient(ellipse, rgba(255,107,53,0.12) 0%, transparent 65%)',
              filter: 'blur(20px)',
              animation: 'breathe 3s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
          <button
            onClick={onBeginScan}
            style={{
              position: 'relative',
              fontFamily: 'var(--display)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              padding: '18px 52px',
              background: 'transparent',
              border: '1px solid rgba(255,107,53,0.48)',
              color: 'rgba(255,107,53,0.88)',
              cursor: 'none',
              transition: 'background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, color 0.25s ease',
              boxShadow: '0 0 22px rgba(255,107,53,0.1), inset 0 0 22px rgba(255,107,53,0.03)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.background = 'rgba(255,107,53,0.07)'
              el.style.borderColor = 'rgba(255,107,53,0.85)'
              el.style.boxShadow = '0 0 44px rgba(255,107,53,0.32), inset 0 0 32px rgba(255,107,53,0.06)'
              el.style.color = 'rgba(255,107,53,1)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.background = 'transparent'
              el.style.borderColor = 'rgba(255,107,53,0.48)'
              el.style.boxShadow = '0 0 22px rgba(255,107,53,0.1), inset 0 0 22px rgba(255,107,53,0.03)'
              el.style.color = 'rgba(255,107,53,0.88)'
            }}
          >
            BEGIN SCAN ↗
          </button>
        </div>
      </div>

    </div>
  )
}

function DiscoverCard({ card, delay }: { card: typeof CARDS[number]; delay: number }) {
  return (
    <div
      className="hud-frame"
      style={{
        padding: '20px 18px',
        background: 'rgba(255,255,255,0.018)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 2,
        animation: `reveal-up 0.7s ${0.1 + delay}s cubic-bezier(0.16, 1, 0.3, 1) both`,
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.background = `rgba(${card.glowColor.replace('rgba(', '').replace(')', '').split(',').slice(0, 3).join(',')}, 0.04)`
        el.style.borderColor = 'rgba(255,255,255,0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.018)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
      }}
    >
      {/* Number */}
      <div
        className="font-mono-data mb-3"
        style={{ color: card.glowColor, letterSpacing: '0.18em' }}
      >
        {card.num}
      </div>

      {/* Title */}
      <div
        className="mb-2 font-semibold"
        style={{
          fontFamily: 'var(--display)',
          fontSize: 13,
          letterSpacing: '0.04em',
          color: 'rgba(255,255,255,0.88)',
        }}
      >
        {card.title}
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: 12,
          lineHeight: 1.55,
          color: 'rgba(255,255,255,0.35)',
        }}
      >
        {card.desc}
      </p>

      {/* Subtle glow dot */}
      <div
        className="mt-4"
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: card.glowColor,
          boxShadow: `0 0 8px ${card.glowColor}`,
          opacity: 0.6,
        }}
      />
    </div>
  )
}
