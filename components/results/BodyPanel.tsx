'use client'

import dynamic from 'next/dynamic'
import type { Archetype } from '@/types/neurix'

const AthleteBody = dynamic(
  () => import('@/components/three/AthleteBody').then((m) => m.AthleteBody),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[var(--surface-2)] rounded-[14px]" />,
  }
)

interface BodyPanelProps {
  archetype: Archetype
  onCanvasReady?: (dataUrl: string) => void
  onHoverChange?: (hovered: boolean) => void
}

export function BodyPanel({ archetype, onCanvasReady, onHoverChange }: BodyPanelProps) {
  return (
    <div className="w-full h-full rounded-[14px] overflow-hidden">
      <AthleteBody archetype={archetype} onCanvasReady={onCanvasReady} onHoverChange={onHoverChange} />
    </div>
  )
}
