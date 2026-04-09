'use client'

import { useEffect, useRef, useState } from 'react'

const HUD_NODES = [
  {
    id: 'neural',
    label: 'NEURAL SYNC',
    sub: 'HEAD · SIG LOCKED',
    dx: 5,
    dy: -310,
    glowDelay: '0s',
  },
  {
    id: 'cardio',
    label: 'CARDIO STREAM',
    sub: 'CHEST · ACTIVE',
    dx: -22,
    dy: -162,
    glowDelay: '0.9s',
  },
  {
    id: 'strength',
    label: 'BIOMECH SCAN',
    sub: 'ARM · SCANNING',
    dx: -178,
    dy: -122,
    glowDelay: '1.8s',
  },
  {
    id: 'mobility',
    label: 'MOBILITY INDEX',
    sub: 'LEGS · CALIBRATING',
    dx: 12,
    dy: 195,
    glowDelay: '2.7s',
  },
] as const

// Extra scan data-points scattered around body — suggest active sampling
const SCAN_DOTS = [
  { dx: -68, dy: -228 },  // left shoulder
  { dx:  82, dy: -182 },  // right shoulder
  { dx: -108, dy: -72 },  // left arm
  { dx:  100, dy: -46 },  // right arm
  { dx: -52,  dy:  68 },  // left hip
  { dx:  58,  dy: 128 },  // right thigh
  { dx: -28,  dy: 272 },  // left shin
  { dx:  36,  dy: 288 },  // right shin
]

export function ScanHUD() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()
      setSize({ w: r.width, h: r.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Body visual center: container center shifted -40px (matching the body's translateY)
  const cx = size ? size.w / 2 : 0
  const cy = size ? size.h / 2 - 40 : 0

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      {size && (
        <>
          {/* ── SVG layer ── */}
          <svg
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`}
            fill="none"
            style={{ position: 'absolute', inset: 0 }}
          >
            <defs>
              <style>{`
                @keyframes dashFlow    { to { stroke-dashoffset: -8; } }
                @keyframes dashFlowSlow{ to { stroke-dashoffset: -10; } }
              `}</style>
              <filter id="hud-glow-node" x="-300%" y="-300%" width="800%" height="800%">
                <feGaussianBlur stdDeviation="2.5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="hud-glow-line" x="-100%" y="-100%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="1.2" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Outer dashed ring */}
            <circle
              cx={cx} cy={cy} r={308}
              stroke="white" strokeOpacity={0.07} strokeWidth={1}
              strokeDasharray="3 14"
            />
            {/* Mid ring */}
            <circle
              cx={cx} cy={cy} r={255}
              stroke="white" strokeOpacity={0.05} strokeWidth={0.5}
              strokeDasharray="2 10"
            />
            {/* Inner ring */}
            <circle
              cx={cx} cy={cy} r={198}
              stroke="white" strokeOpacity={0.04} strokeWidth={0.5}
              strokeDasharray="1 8"
            />

            {/* Top-right quadrant partial arc (prominent) */}
            <path
              d={`M ${cx} ${cy - 255} A 255 255 0 0 1 ${cx + 255} ${cy}`}
              stroke="white" strokeOpacity={0.13} strokeWidth={1}
              strokeLinecap="round"
            />
            {/* Bottom-left quadrant partial arc (faint) */}
            <path
              d={`M ${cx} ${cy + 255} A 255 255 0 0 1 ${cx - 255} ${cy}`}
              stroke="white" strokeOpacity={0.06} strokeWidth={0.5}
              strokeLinecap="round"
            />

            {/* Tick marks at 30-degree intervals */}
            {Array.from({ length: 12 }, (_, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180)
              const R = 303
              const len = i % 3 === 0 ? 10 : 5
              const x1 = cx + R * Math.cos(angle)
              const y1 = cy + R * Math.sin(angle)
              const x2 = cx + (R + len) * Math.cos(angle)
              const y2 = cy + (R + len) * Math.sin(angle)
              return (
                <line
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="white"
                  strokeOpacity={i % 3 === 0 ? 0.18 : 0.07}
                  strokeWidth={i % 3 === 0 ? 1.2 : 0.5}
                />
              )
            })}

            {/* Crosshair marks at cardinal ring positions */}
            {[0, 90, 180, 270].map((deg, i) => {
              const rad = (deg - 90) * Math.PI / 180
              const r = 308
              const px = cx + r * Math.cos(rad)
              const py = cy + r * Math.sin(rad)
              return (
                <g key={`cross-${i}`}>
                  <line x1={px - 5} y1={py} x2={px + 5} y2={py} stroke="white" strokeOpacity={0.14} strokeWidth={0.5} />
                  <line x1={px} y1={py - 5} x2={px} y2={py + 5} stroke="white" strokeOpacity={0.14} strokeWidth={0.5} />
                </g>
              )
            })}

            {/* Faint crosshair axes */}
            <line
              x1={cx - 340} y1={cy} x2={cx + 340} y2={cy}
              stroke="white" strokeOpacity={0.04} strokeWidth={0.5} strokeDasharray="1 16"
            />
            <line
              x1={cx} y1={cy - 340} x2={cx} y2={cy + 340}
              stroke="white" strokeOpacity={0.04} strokeWidth={0.5} strokeDasharray="1 16"
            />

            {/* ── Connector: neural → top-left ScanCore panel ── */}
            {(() => {
              const nx = cx + 5, ny = cy - 310
              const cardX = 136, cardY = size.h * 0.25 + 38
              return (
                <polyline
                  points={`${nx},${ny} ${nx - 55},${ny} ${cardX},${cardY}`}
                  stroke="white" strokeOpacity={0.14} strokeWidth={0.5}
                  strokeDasharray="3 7" fill="none"
                  filter="url(#hud-glow-line)"
                  style={{ animation: 'dashFlow 3s linear infinite' } as React.CSSProperties}
                />
              )
            })()}

            {/* ── Connector: mobility → bottom-right ScanCore panel ── */}
            {(() => {
              const nx = cx + 12, ny = cy + 195
              const cardX = size.w - 136, cardY = size.h * 0.75 - 38
              return (
                <polyline
                  points={`${nx},${ny} ${nx + 55},${ny} ${cardX},${cardY}`}
                  stroke="white" strokeOpacity={0.14} strokeWidth={0.5}
                  strokeDasharray="3 7" fill="none"
                  filter="url(#hud-glow-line)"
                  style={{ animation: 'dashFlow 3.4s linear infinite' } as React.CSSProperties}
                />
              )
            })()}

            {/* ── Stub: cardio → elbow out right ── */}
            {(() => {
              const nx = cx - 22, ny = cy - 162
              return (
                <polyline
                  points={`${nx},${ny} ${nx + 48},${ny} ${nx + 48},${ny - 24}`}
                  stroke="white" strokeOpacity={0.1} strokeWidth={0.5}
                  strokeDasharray="2 6" fill="none"
                  style={{ animation: 'dashFlow 2.8s linear infinite' } as React.CSSProperties}
                />
              )
            })()}

            {/* ── Stub: strength → elbow out left ── */}
            {(() => {
              const nx = cx - 178, ny = cy - 122
              return (
                <polyline
                  points={`${nx},${ny} ${nx - 48},${ny} ${nx - 48},${ny - 24}`}
                  stroke="white" strokeOpacity={0.1} strokeWidth={0.5}
                  strokeDasharray="2 6" fill="none"
                  style={{ animation: 'dashFlowSlow 3.2s linear infinite' } as React.CSSProperties}
                />
              )
            })()}

            {/* ── Extra scan dots scattered on body ── */}
            {SCAN_DOTS.map((dot, i) => {
              const dx = cx + dot.dx
              const dy = cy + dot.dy
              return (
                <g key={`scan-dot-${i}`}>
                  <circle cx={dx} cy={dy} r={5} fill="white" fillOpacity={0.04} />
                  <circle cx={dx} cy={dy} r={1.5} fill="white" fillOpacity={0.28} />
                </g>
              )
            })}

            {/* ── Main node: glow halo + dot + tick stub ── */}
            {HUD_NODES.map((node) => {
              const nx = cx + node.dx
              const ny = cy + node.dy
              const rightSide = node.dx >= 0
              return (
                <g key={node.id}>
                  <circle cx={nx} cy={ny} r={8} fill="white" fillOpacity={0.05} />
                  <circle
                    cx={nx} cy={ny} r={2.5}
                    fill="white" fillOpacity={0.65}
                    filter="url(#hud-glow-node)"
                  />
                  <line
                    x1={rightSide ? nx + 3 : nx - 3} y1={ny}
                    x2={rightSide ? nx + 22 : nx - 22} y2={ny}
                    stroke="white" strokeOpacity={0.22} strokeWidth={0.5}
                  />
                </g>
              )
            })}
          </svg>

          {/* ── Animated glow rings ── */}
          {HUD_NODES.map((node) => {
            const nx = cx + node.dx
            const ny = cy + node.dy
            return (
              <div
                key={`glow-${node.id}`}
                className="absolute rounded-full"
                style={{
                  width: 24,
                  height: 24,
                  left: nx - 12,
                  top: ny - 12,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.24) 0%, transparent 70%)',
                  animation: `hudPulse 3.6s ${node.glowDelay} ease-in-out infinite`,
                }}
              />
            )
          })}

          {/* ── Node labels ── */}
          {HUD_NODES.map((node) => {
            const nx = cx + node.dx
            const ny = cy + node.dy
            const rightSide = node.dx >= 0
            return (
              <div
                key={`label-${node.id}`}
                className="absolute"
                style={
                  rightSide
                    ? { left: nx + 28, top: ny - 10 }
                    : { right: size.w - nx + 28, top: ny - 10, textAlign: 'right' as const }
                }
              >
                <div
                  className="font-mono text-[9px] tracking-widest whitespace-nowrap"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  {node.label}
                </div>
                <div
                  className="font-mono text-[8px] tracking-widest whitespace-nowrap mt-px"
                  style={{ color: 'rgba(255,255,255,0.2)' }}
                >
                  {node.sub}
                </div>
              </div>
            )
          })}

          {/* ── System micro-text: edge labels ── */}

          {/* bottom-left */}
          <div className="absolute font-mono text-[9px] tracking-widest uppercase"
            style={{ bottom: '8%', left: '6%', color: 'rgba(255,255,255,0.25)' }}>
            BIOMECHANICAL ANALYSIS
          </div>

          {/* top-right */}
          <div className="absolute font-mono text-[9px] tracking-widest uppercase"
            style={{ top: '6%', right: '6%', color: 'rgba(255,255,255,0.2)' }}>
            SYS · NEURIX · v2.4
          </div>

          {/* near neural node — left of body, upper */}
          <div className="absolute font-mono text-[10px] tracking-widest uppercase"
            style={{ top: cy - 320, left: '5%', color: 'rgba(255,255,255,0.22)' }}>
            NEURAL SYNC
          </div>

          {/* right side, upper-mid */}
          <div className="absolute font-mono text-[9px] tracking-widest uppercase"
            style={{ top: cy - 205, right: '5%', color: 'rgba(255,255,255,0.18)' }}>
            CORE SIGNAL LOCKED
          </div>

          {/* left side, strength area */}
          <div className="absolute font-mono text-[9px] tracking-widest uppercase"
            style={{ top: cy - 148, left: '4%', color: 'rgba(255,255,255,0.18)' }}>
            UPPER BODY ANALYSIS
          </div>

          {/* right side, lower */}
          <div className="absolute font-mono text-[9px] tracking-widest uppercase"
            style={{ top: cy + 185, right: '6%', color: 'rgba(255,255,255,0.18)' }}>
            LOWER BODY SYNC
          </div>

          {/* bottom center */}
          <div className="absolute font-mono text-[10px] tracking-widest uppercase"
            style={{ bottom: '14%', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.2)' }}>
            BIOMECH SCAN ACTIVE
          </div>

          {/* top center */}
          <div className="absolute font-mono text-[9px] tracking-widest uppercase"
            style={{ top: '7%', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.14)' }}>
            SCAN DEPTH: 98.2%
          </div>

          {/* right side lower-mid */}
          <div className="absolute font-mono text-[9px] tracking-widest uppercase"
            style={{ bottom: '22%', right: '5%', color: 'rgba(255,255,255,0.15)' }}>
            MOBILITY TRACKED
          </div>

          {/* left side lower */}
          <div className="absolute font-mono text-[9px] tracking-widest uppercase"
            style={{ bottom: '28%', left: '5%', color: 'rgba(255,255,255,0.15)' }}>
            SIGNAL INTEGRITY: 92%
          </div>

          {/* top-left corner */}
          <div className="absolute font-mono text-[9px] tracking-widest uppercase"
            style={{ top: '6%', left: '6%', color: 'rgba(255,255,255,0.14)' }}>
            SCAN PROTOCOL ACTIVE
          </div>

          {/* right side near scan ring */}
          <div className="absolute font-mono text-[9px] tracking-widest uppercase"
            style={{ top: cy + 60, right: '4%', color: 'rgba(255,255,255,0.13)' }}>
            CARDIO STREAM ACTIVE
          </div>
        </>
      )}
    </div>
  )
}
