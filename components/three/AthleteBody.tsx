'use client'

import type { Archetype } from '@/types/atlas'

interface AthleteBodyProps {
  archetype: Archetype
  onCanvasReady?: (dataUrl: string) => void
  onHoverChange?: (hovered: boolean) => void
}

export function AthleteBody({ archetype, onCanvasReady, onHoverChange }: AthleteBodyProps) {
  void archetype
  void onCanvasReady

  return (
    <div
      className="relative w-full h-full"
      style={{ minHeight: '400px' }}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <iframe
        src="https://my.spline.design/bodywithglowringscopy-fNne1gztopzGRDWvTxFpbkaO/"
        title="NEURIX result body visualization"
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      />
    </div>
  )
}
