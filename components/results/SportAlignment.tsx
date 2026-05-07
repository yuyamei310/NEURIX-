'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { SportRecommendation } from '@/types/neurix'

interface SportAlignmentProps {
  sports: SportRecommendation[]
}

export function SportAlignment({ sports }: SportAlignmentProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [])

  const sorted = [...sports].sort((a, b) => b.alignment_score - a.alignment_score)

  return (
    <Card className="flex flex-col gap-4">
      <div className="font-mono-data">SPORT ALIGNMENT</div>
      <div className="flex flex-col gap-3">
        {sorted.map((sport) => (
          <div key={sport.sport} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-[var(--text)]">{sport.sport}</span>
                {sport.is_paralympic && <Badge label="PARA" variant="paralympic" />}
              </div>
              <span className="font-mono text-[12px] text-[var(--text-3)]">{sport.alignment_score}%</span>
            </div>
            <div className="h-[3px] bg-[var(--border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--text)] rounded-full transition-all duration-700 ease-out"
                style={{ width: animated ? `${sport.alignment_score}%` : '0%' }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
