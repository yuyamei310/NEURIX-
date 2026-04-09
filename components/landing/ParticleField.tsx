'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  opacity: number
  size: number
  colorBase: string
}

function pickColor(): string {
  const r = Math.random()
  if (r < 0.60) return '0,229,255'   // cyan  60%
  if (r < 0.92) return '255,255,255' // white 32%
  return '180,0,255'                  // violet 8%
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width = W
    canvas.height = H

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W
      canvas.height = H
    }
    window.addEventListener('resize', resize, { passive: true })

    // Seed particles spread across the full canvas
    const particles: Particle[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.28,
      vy: -(Math.random() * 0.32 + 0.12),
      opacity: Math.random() * 0.45 + 0.08,
      size: Math.random() * 1.4 + 0.5,
      colorBase: pickColor(),
    }))

    let rafId: number

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 85) {
            const alpha = ((1 - dist / 85) * 0.11).toFixed(3)
            ctx.strokeStyle = `rgba(0,229,255,${alpha})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw and advance particles
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.colorBase},${p.opacity.toFixed(2)})`
        ctx.fill()

        p.x += p.vx
        p.y += p.vy

        // Wrap vertically — restart at bottom when above viewport
        if (p.y < -10) {
          p.y = H + 10
          p.x = Math.random() * W
        }
        // Wrap horizontally
        if (p.x < -10) p.x = W + 10
        if (p.x > W + 10) p.x = -10
      }

      rafId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
