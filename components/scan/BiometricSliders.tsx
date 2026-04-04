'use client'

import { useAtlasStore } from '@/store/atlasStore'
import { localClassify } from '@/lib/classifier'
import { Slider } from '@/components/ui/Slider'

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
    <div className="flex flex-col gap-6">
      <Slider
        label="HEIGHT"
        value={biometrics.height}
        min={140}
        max={220}
        unit="cm"
        onChange={(v) => update('height', v)}
      />
      <Slider
        label="WEIGHT"
        value={biometrics.weight}
        min={40}
        max={160}
        unit="kg"
        onChange={(v) => update('weight', v)}
      />
      <Slider
        label="AGE"
        value={biometrics.age}
        min={14}
        max={60}
        unit="yrs"
        onChange={(v) => update('age', v)}
      />
    </div>
  )
}
