'use client'

import type { Archetype } from '@/types/atlas'

interface AthleteBodyProps {
  archetype: Archetype
  onCanvasReady?: (dataUrl: string) => void
  onHoverChange?: (hovered: boolean) => void
}

export function AthleteBody({ onHoverChange }: AthleteBodyProps) {
  return (
    <div
      className="w-full h-full"
      style={{ minHeight: '400px' }}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <iframe
        src="https://my.spline.design/bodywithglowringscopy-fNne1gztopzGRDWvTxFpbkaO/"
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      />
    </div>
  )
}
