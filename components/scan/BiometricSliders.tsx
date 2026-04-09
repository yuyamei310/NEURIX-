'use client'

import { useAtlasStore } from '@/store/atlasStore'
import { localClassify } from '@/lib/classifier'
import { Slider } from '@/components/ui/Slider'

function heightHint(h: number): string {
  if (h < 155) return 'COMPACT BUILD'
  if (h < 163) return 'BELOW AVERAGE'
  if (h < 172) return 'AVERAGE'
  if (h < 180) return 'TALL'
  if (h < 190) return 'TALL · LEVERAGE ADV'
  if (h < 200) return 'ELITE HEIGHT'
  return 'ELITE · MAX LEVERAGE'
}

function weightHint(w: number): string {
  if (w < 52) return 'LIGHTWEIGHT'
  if (w < 62) return 'LEAN'
  if (w < 75) return 'ATHLETIC'
  if (w < 88) return 'BALANCED'
  if (w < 102) return 'POWER BUILD'
  if (w < 120) return 'HEAVY POWER'
  return 'MAX MASS'
}

function ageHint(a: number): string {
  if (a < 16) return 'DEVELOPING'
  if (a < 20) return 'YOUTH PEAK'
  if (a < 26) return 'PRIME'
  if (a < 32) return 'PEAK PRIME'
  if (a < 38) return 'VETERAN'
  if (a < 45) return 'MASTERS'
  return 'SENIOR MASTERS'
}

export function BiometricSliders() {
  const biometrics = useAtlasStore((s) => s.biometrics)
  const setBiometrics = useAtlasStore((s) => s.setBiometrics)
  const setLocalClassification = useAtlasStore((s) => s.setLocalClassification)

  const update = (field: 'height' | 'weight' | 'age', value: number) => {
    const next = { ...biometrics, [field]: value }
    setBiometrics({ [field]: value })
    const result = localClassify(next.height, next.weight, next.age, next.habits)
    setLocalClassification(result)
  }

  return (
    <div className="flex flex-col gap-7">
      <Slider
        label="HEIGHT"
        value={biometrics.height}
        min={140}
        max={220}
        unit="cm"
        hint={heightHint(biometrics.height)}
        onChange={(v) => update('height', v)}
      />
      <Slider
        label="WEIGHT"
        value={biometrics.weight}
        min={40}
        max={160}
        unit="kg"
        hint={weightHint(biometrics.weight)}
        onChange={(v) => update('weight', v)}
      />
      <Slider
        label="AGE"
        value={biometrics.age}
        min={14}
        max={60}
        unit="yrs"
        hint={ageHint(biometrics.age)}
        onChange={(v) => update('age', v)}
      />
    </div>
  )
}
