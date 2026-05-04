'use client'

import type { CSSProperties } from 'react'
import { useState } from 'react'
import { useAtlasStore } from '@/store/atlasStore'

interface NodeDef {
  id: string
  label: string
  metric: string
  detail: string
  value: number
  // CSS calc() positions — body visual center is at calc(50% - 40px) due to translateY
  top: string
  left: string
  cardSide: 'left' | 'right'
  cardDown: boolean
}

const BODY_NODES: NodeDef[] = [
  {
    id: 'hybrid',
    label: 'HYBRID',
    metric: 'Adaptability signal: 78%',
    detail: 'Team read · mixed output',
    value: 78,
    top: 'calc(50% - 350px)',   // cy - 310 (with -40px body offset)
    left: 'calc(50% + 5px)',
    cardSide: 'right',
    cardDown: true,             // card opens below (node is near top of frame)
  },
  {
    id: 'endurance',
    label: 'ENDURANCE',
    metric: 'Aerobic pattern: 91%',
    detail: 'Rhythm · repeated output',
    value: 91,
    top: 'calc(50% - 202px)',
    left: 'calc(50% - 22px)',
    cardSide: 'right',
    cardDown: false,
  },
  {
    id: 'strength',
    label: 'POWER',
    metric: 'Force pattern: 82%',
    detail: 'Strength · acceleration',
    value: 82,
    top: 'calc(50% - 162px)',
    left: 'calc(50% - 178px)',
    cardSide: 'left',
    cardDown: false,
  },
  {
    id: 'technical',
    label: 'TECHNICAL',
    metric: 'Control pattern: 64%',
    detail: 'Balance · precision',
    value: 64,
    top: 'calc(50% + 155px)',
    left: 'calc(50% + 12px)',
    cardSide: 'right',
    cardDown: false,
  },
]

// L-bend line from node center → card edge. coords relative to node center.
function getLinePoints(node: NodeDef): string {
  const hx = node.cardSide === 'right' ? 16 : -16
  const vy = node.cardDown ? 40 : -40
  return `0,0 ${hx},0 ${hx},${vy}`
}

function CornerAccents() {
  const c = 'rgba(255,255,255,0.32)'
  const s = `1px solid ${c}`
  const cls = 'absolute w-2.5 h-2.5'
  return (
    <>
      <div className={`${cls} top-0 left-0`}    style={{ borderTop: s,    borderLeft:  s }} />
      <div className={`${cls} top-0 right-0`}   style={{ borderTop: s,    borderRight: s }} />
      <div className={`${cls} bottom-0 left-0`} style={{ borderBottom: s, borderLeft:  s }} />
      <div className={`${cls} bottom-0 right-0`}style={{ borderBottom: s, borderRight: s }} />
    </>
  )
}

function BodyNode({
  node,
  isHovered,
  isActive,
  onMouseEnter,
  onMouseLeave,
}: {
  node: NodeDef
  isHovered: boolean
  isActive: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  const cardPos: CSSProperties = {}
  if (node.cardSide === 'right') cardPos.left = 20
  else cardPos.right = 20
  if (node.cardDown) cardPos.top = 20
  else cardPos.bottom = 20
  const emphasized = isHovered || isActive

  return (
    <div
      className="absolute flex items-center justify-center cursor-crosshair"
      style={{
        top: node.top,
        left: node.left,
        width: 28,
        height: 28,
        transform: 'translate(-50%, -50%)',
        zIndex: 30,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Expanding glow ring */}
      <div
        className="absolute rounded-full transition-all duration-300"
        style={{
          width: emphasized ? 28 : 16,
          height: emphasized ? 28 : 16,
          background: 'radial-gradient(circle, var(--active-archetype-color, rgba(255,255,255,0.32)) 0%, transparent 70%)',
          opacity: emphasized ? 1 : 0.42,
          animation: isActive && !isHovered ? 'hudPulse 3.6s ease-in-out infinite' : undefined,
        }}
      />

      {/* Core dot */}
      <div
        className="w-2 h-2 rounded-full relative z-10 transition-all duration-200"
        style={{
          background: 'var(--active-archetype-color, #fff)',
          opacity: emphasized ? 1 : 0.58,
          boxShadow: emphasized
            ? '0 0 8px var(--active-archetype-color, rgba(255,255,255,0.9)), 0 0 20px var(--active-archetype-soft, rgba(255,255,255,0.3))'
            : '0 0 0px rgba(255,255,255,0)',
        }}
      />

      {/* Connection line: node → card (L-bend) */}
      <svg
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          overflow: 'visible',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 300ms ease',
          pointerEvents: 'none',
          zIndex: 45,
        }}
        width="0"
        height="0"
      >
        <polyline
          points={getLinePoints(node)}
          stroke="var(--active-archetype-color, rgba(255,255,255,0.2))"
          strokeWidth="0.5"
          fill="none"
          style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.4))' }}
        />
        {/* Glowing dot at line end */}
        <circle
          cx={node.cardSide === 'right' ? 16 : -16}
          cy={node.cardDown ? 40 : -40}
          r="1.2"
          fill="var(--active-archetype-color, rgba(255,255,255,0.5))"
          style={{ filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.6))' }}
        />
      </svg>

      {/* Floating HUD panel */}
      <div
        className="absolute"
        style={{
          ...cardPos,
          opacity: isHovered ? 1 : 0,
          transform: isHovered
            ? 'translateY(0)'
            : node.cardDown
            ? 'translateY(-5px)'
            : 'translateY(5px)',
          transition: 'opacity 240ms ease, transform 240ms ease',
          pointerEvents: 'none',
          zIndex: 50,
        }}
      >
        {/* HUD Panel — sharp edges, corner accents */}
        <div className="relative" style={{ width: 168 }}>
          <CornerAccents />
          <div
            className="px-3 py-2.5"
            style={{
              background: 'rgba(8,8,8,0.72)',
              border: '1px solid var(--active-archetype-soft, rgba(255,255,255,0.08))',
            }}
          >
            {/* System label */}
            <div
              className="font-mono text-[9px] tracking-widest mb-1.5 whitespace-nowrap uppercase"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              [ {node.label} ]
            </div>

            {/* Primary metric */}
            <div
              className="text-xs whitespace-nowrap"
              style={{ color: 'rgba(255,255,255,0.82)' }}
            >
              {node.metric}
            </div>

            {/* Animated progress bar */}
            <div
              className="mt-2 overflow-hidden"
              style={{ height: 1, width: 148, background: 'rgba(255,255,255,0.08)' }}
            >
              <div
                style={{
                  height: '100%',
                  background: 'var(--active-archetype-color, rgba(255,255,255,0.32))',
                  width: isHovered ? `${node.value}%` : '0%',
                  transition: 'width 480ms ease 80ms',
                }}
              />
            </div>

            {/* Secondary detail */}
            <div
              className="font-mono text-[8px] tracking-widest mt-1.5 whitespace-nowrap"
              style={{ color: 'rgba(255,255,255,0.22)' }}
            >
              {node.detail}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BodyNodes() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const { habits } = useAtlasStore((s) => s.biometrics)
  const { archetype } = useAtlasStore((s) => s.localClassification)

  const activeIds = new Set<string>([
    archetype === 'power' ? 'strength' : archetype,
    ...(habits.some((h) => ['running', 'swimming', 'wheelchair_sport', 'para_athletics'].includes(h)) ? ['endurance'] : []),
    ...(habits.some((h) => ['strength', 'martial_arts'].includes(h)) ? ['strength'] : []),
    ...(habits.some((h) => ['gymnastics', 'racket', 'team_sports'].includes(h)) ? ['technical'] : []),
  ])

  return (
    <div className="absolute inset-0">
      {BODY_NODES.map((node) => (
        <BodyNode
          key={node.id}
          node={node}
          isHovered={hoveredId === node.id}
          isActive={activeIds.has(node.id)}
          onMouseEnter={() => setHoveredId(node.id)}
          onMouseLeave={() => setHoveredId(null)}
        />
      ))}
    </div>
  )
}
