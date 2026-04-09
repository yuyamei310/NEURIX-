'use client'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

// Generate stable particles (not recalculated on re-renders)
const PARTICLES: Particle[] = Array.from({ length: 28 }, (_, i) => {
  // Deterministic pseudo-random using index
  const seed = (i * 2654435761) >>> 0
  const rand = (offset: number) => ((seed ^ (offset * 1234567)) % 1000) / 1000
  return {
    id: i,
    x: rand(1) * 100,
    y: rand(2) * 100,
    size: rand(3) * 2 + 1,
    duration: rand(4) * 4 + 3,
    delay: rand(5) * 6,
  }
})

export function ScanCore() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Subtle grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(var(--glow-rgb), 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--glow-rgb), 1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.025,
        }}
      />

      {/* Radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(6,6,8,0.7) 100%)',
        }}
      />

      {/* Scan beam */}
      <div className="scan-beam" />

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: 'var(--glow)',
            animation: `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
