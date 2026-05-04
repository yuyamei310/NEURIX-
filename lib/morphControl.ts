import type { Archetype } from '@/types/atlas'
import * as THREE from 'three'

export interface ArchetypeParams {
  torsoScale: THREE.Vector3
  shoulderWidth: number
  legWidth: number
  color: string
}

export const archetypeParams: Record<Archetype, ArchetypeParams> = {
  power: {
    torsoScale: new THREE.Vector3(1.15, 1.0, 1.1),
    shoulderWidth: 1.2,
    legWidth: 1.1,
    color: '#ede8e3',
  },
  endurance: {
    torsoScale: new THREE.Vector3(0.88, 1.05, 0.9),
    shoulderWidth: 0.9,
    legWidth: 0.88,
    color: '#e3e8ed',
  },
  technical: {
    torsoScale: new THREE.Vector3(0.92, 0.98, 0.92),
    shoulderWidth: 0.95,
    legWidth: 0.93,
    color: '#f0f0f0',
  },
  hybrid: {
    torsoScale: new THREE.Vector3(1.0, 1.0, 1.0),
    shoulderWidth: 1.0,
    legWidth: 1.0,
    color: '#f0f0f0',
  },
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function lerpVec3(
  a: THREE.Vector3,
  b: THREE.Vector3,
  t: number
): THREE.Vector3 {
  return new THREE.Vector3(
    lerp(a.x, b.x, t),
    lerp(a.y, b.y, t),
    lerp(a.z, b.z, t)
  )
}

export function animateArchetypeChange(
  meshes: { torso: THREE.Mesh; shoulderL: THREE.Mesh; shoulderR: THREE.Mesh; legL: THREE.Mesh; legR: THREE.Mesh },
  archetype: Archetype,
  duration = 600
): void {
  const params = archetypeParams[archetype]
  const startScales = {
    torso: meshes.torso.scale.clone(),
    shoulderL: meshes.shoulderL.scale.clone(),
    shoulderR: meshes.shoulderR.scale.clone(),
    legL: meshes.legL.scale.clone(),
    legR: meshes.legR.scale.clone(),
  }

  const start = performance.now()

  function tick() {
    const elapsed = performance.now() - start
    const raw = Math.min(elapsed / duration, 1)
    const t = easeInOutCubic(raw)

    // Torso
    const ts = lerpVec3(startScales.torso, params.torsoScale, t)
    meshes.torso.scale.set(ts.x, ts.y, ts.z)

    // Shoulders
    const sw = lerp(startScales.shoulderL.x, params.shoulderWidth, t)
    meshes.shoulderL.scale.set(sw, sw, sw)
    meshes.shoulderR.scale.set(sw, sw, sw)

    // Legs
    const lw = lerp(startScales.legL.x, params.legWidth, t)
    meshes.legL.scale.set(lw, meshes.legL.scale.y, lw)
    meshes.legR.scale.set(lw, meshes.legR.scale.y, lw)

    if (raw < 1) requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}
