'use client'

import { useEffect, useRef } from 'react'

interface NeuralNetworkProps {
  activeStep: number // 0-5
}

// Viewbox: 600 x 320
const VB_W = 600
const VB_H = 320

// Layer definitions
const LAYERS: { x: number; ys: number[] }[] = [
  { x: 80,  ys: [40, 100, 160, 220, 280] },                          // 5 input nodes
  { x: 300, ys: [20, 62, 104, 146, 188, 230, 272, 300] },           // 8 hidden nodes
  { x: 520, ys: [80, 160, 240] },                                     // 3 output nodes
]

// Active highlight pattern per step
// [layer1NodeIndices, layer2NodeIndices, layer3NodeIndices, activeConnectionLayer(0=L1→L2, 1=L2→L3, -1=none)]
const STEP_PATTERNS: {
  nodes: [number[], number[], number[]]
  connLayer: number
} [] = [
  { nodes: [[0,1,2,3,4], [], []], connLayer: -1 },         // step 0: input nodes
  { nodes: [[0,1,2,3,4], [0,1,2,3,4,5,6,7], []], connLayer: 0 }, // step 1: L1→L2
  { nodes: [[], [0,1,2,3,4,5,6,7], []], connLayer: -1 },   // step 2: hidden nodes
  { nodes: [[], [0,1,2,3,4,5,6,7],[0,1,2]], connLayer: 1 },// step 3: L2→L3
  { nodes: [[], [], [0,1,2]], connLayer: -1 },              // step 4: output nodes
  { nodes: [[0,1,2,3,4],[0,1,2,3,4,5,6,7],[0,1,2]], connLayer: 1 }, // step 5: full
]

function buildConnections(layerA: typeof LAYERS[0], layerB: typeof LAYERS[0]) {
  const conns: { x1: number; y1: number; x2: number; y2: number }[] = []
  for (const y1 of layerA.ys) {
    for (const y2 of layerB.ys) {
      conns.push({ x1: layerA.x, y1, x2: layerB.x, y2 })
    }
  }
  return conns
}

const CONNS_L1_L2 = buildConnections(LAYERS[0], LAYERS[1])
const CONNS_L2_L3 = buildConnections(LAYERS[1], LAYERS[2])

export function NeuralNetwork({ activeStep }: NeuralNetworkProps) {
  const step = Math.min(Math.max(activeStep, 0), STEP_PATTERNS.length - 1)
  const pattern = STEP_PATTERNS[step]

  const isNodeActive = (layer: number, nodeIdx: number) =>
    pattern.nodes[layer].includes(nodeIdx)

  const isConnActive = (connLayerIdx: number) =>
    pattern.connLayer === connLayerIdx

  return (
    <div className="w-full" style={{ maxWidth: VB_W }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block', overflow: 'visible' }}
      >
        {/* ── L1→L2 connections ─────────────────────────────────── */}
        <g>
          {CONNS_L1_L2.map((c, i) => (
            <line
              key={`l1l2-${i}`}
              x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke="var(--glow)"
              strokeWidth={isConnActive(0) ? 0.7 : 0.4}
              strokeOpacity={isConnActive(0) ? undefined : 0.1}
              style={isConnActive(0) ? {
                animation: `neural-connection-pulse ${0.6 + (i % 5) * 0.12}s ease-in-out ${(i * 0.03) % 0.5}s infinite`,
              } : undefined}
            />
          ))}
        </g>

        {/* ── L2→L3 connections ─────────────────────────────────── */}
        <g>
          {CONNS_L2_L3.map((c, i) => (
            <line
              key={`l2l3-${i}`}
              x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke="var(--glow)"
              strokeWidth={isConnActive(1) ? 0.7 : 0.4}
              strokeOpacity={isConnActive(1) ? undefined : 0.1}
              style={isConnActive(1) ? {
                animation: `neural-connection-pulse ${0.5 + (i % 5) * 0.1}s ease-in-out ${(i * 0.04) % 0.5}s infinite`,
              } : undefined}
            />
          ))}
        </g>

        {/* ── Layer 1 nodes ─────────────────────────────────────── */}
        {LAYERS[0].ys.map((y, i) => {
          const active = isNodeActive(0, i)
          return (
            <circle
              key={`n0-${i}`}
              cx={LAYERS[0].x}
              cy={y}
              r={active ? 6 : 4}
              fill={active ? 'rgba(var(--glow-rgb), 0.15)' : 'transparent'}
              stroke="var(--glow)"
              strokeWidth={active ? 1.5 : 0.8}
              strokeOpacity={active ? 1 : 0.25}
              style={active ? {
                filter: 'drop-shadow(0 0 4px rgba(var(--glow-rgb), 0.8))',
                animation: `neural-node-idle ${1.2 + i * 0.15}s ease-in-out ${i * 0.1}s infinite`,
              } : undefined}
            />
          )
        })}

        {/* ── Layer 2 nodes ─────────────────────────────────────── */}
        {LAYERS[1].ys.map((y, i) => {
          const active = isNodeActive(1, i)
          return (
            <circle
              key={`n1-${i}`}
              cx={LAYERS[1].x}
              cy={y}
              r={active ? 6 : 4}
              fill={active ? 'rgba(var(--glow-rgb), 0.15)' : 'transparent'}
              stroke="var(--glow)"
              strokeWidth={active ? 1.5 : 0.8}
              strokeOpacity={active ? 1 : 0.2}
              style={active ? {
                filter: 'drop-shadow(0 0 4px rgba(var(--glow-rgb), 0.8))',
                animation: `neural-node-idle ${1.0 + i * 0.12}s ease-in-out ${i * 0.08}s infinite`,
              } : undefined}
            />
          )
        })}

        {/* ── Layer 3 nodes ─────────────────────────────────────── */}
        {LAYERS[2].ys.map((y, i) => {
          const active = isNodeActive(2, i)
          return (
            <circle
              key={`n2-${i}`}
              cx={LAYERS[2].x}
              cy={y}
              r={active ? 8 : 5}
              fill={active ? 'rgba(var(--glow-rgb), 0.2)' : 'transparent'}
              stroke="var(--glow)"
              strokeWidth={active ? 2 : 0.8}
              strokeOpacity={active ? 1 : 0.2}
              style={active ? {
                filter: 'drop-shadow(0 0 6px rgba(var(--glow-rgb), 0.9))',
                animation: `neural-node-idle ${1.4 + i * 0.2}s ease-in-out ${i * 0.15}s infinite`,
              } : undefined}
            />
          )
        })}

        {/* ── Layer labels ──────────────────────────────────────── */}
        {[
          { x: LAYERS[0].x, label: 'INPUT' },
          { x: LAYERS[1].x, label: 'HIDDEN' },
          { x: LAYERS[2].x, label: 'OUTPUT' },
        ].map(({ x, label }) => (
          <text
            key={label}
            x={x}
            y={VB_H - 2}
            textAnchor="middle"
            fill="var(--glow)"
            fillOpacity="0.3"
            fontSize="8"
            fontFamily="var(--mono)"
            letterSpacing="0.15em"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  )
}
