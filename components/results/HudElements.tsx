'use client'

// Sequential 4-side border draw: top → right → bottom → left on hover-in,
// opacity fade-out on hover-out.
export function SvgTrimBorder({ color, active }: { color: string; active: boolean }) {
  const sides = [
    { x1: '0',    y1: '0',    x2: '100%', y2: '0'    },
    { x1: '100%', y1: '0',    x2: '100%', y2: '100%' },
    { x1: '100%', y1: '100%', x2: '0',    y2: '100%' },
    { x1: '0',    y1: '100%', x2: '0',    y2: '0'    },
  ]
  const delays = [0, 0.15, 0.3, 0.45]

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 4, overflow: 'visible' }}
    >
      {sides.map((s, i) => (
        <line
          key={i}
          x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          stroke={color}
          strokeWidth="1"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={active ? 0 : 1}
          style={{
            transition: active
              ? `stroke-dashoffset 0.14s ${delays[i]}s ease, opacity 0.05s 0s`
              : 'opacity 0.25s ease',
            opacity: active ? 1 : 0,
            filter: `drop-shadow(0 0 3px ${color})`,
          }}
        />
      ))}
    </svg>
  )
}

// 4 corner brackets that expand on hover (12px → 20px) with staggered delay.
export function CornerBrackets({ color, active }: { color: string; active: boolean }) {
  const s = active ? 20 : 12
  const g = active ? `0 0 10px ${color}88` : 'none'
  const t = 'width 0.25s cubic-bezier(0.16,1,0.3,1), height 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease'
  const base = { position: 'absolute' as const, pointerEvents: 'none' as const, zIndex: 3, transition: t }
  return (
    <>
      <div style={{ ...base, top: 0, left: 0, width: s, height: s, borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}`, boxShadow: g }} />
      <div style={{ ...base, top: 0, right: 0, width: s, height: s, borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}`, boxShadow: g, transitionDelay: '0.04s' }} />
      <div style={{ ...base, bottom: 0, left: 0, width: s, height: s, borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}`, boxShadow: g, transitionDelay: '0.04s' }} />
      <div style={{ ...base, bottom: 0, right: 0, width: s, height: s, borderBottom: `1px solid ${color}77`, borderRight: `1px solid ${color}77`, boxShadow: active ? `0 0 6px ${color}55` : 'none', transitionDelay: '0.08s' }} />
    </>
  )
}
