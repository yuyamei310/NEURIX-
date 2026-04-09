'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

export function GlobalShell({ children }: { children: ReactNode }) {
  const [clock, setClock] = useState('')
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorLagRef = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: -100, y: -100 })
  const lagPos = useRef({ x: -100, y: -100 })
  const [mounted, setMounted] = useState(false)

  // Clock
  useEffect(() => {
    const update = () => {
      const n = new Date()
      const pad = (x: number) => x.toString().padStart(2, '0')
      setClock(`${pad(n.getHours())}:${pad(n.getMinutes())}:${pad(n.getSeconds())}`)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  // Custom cursor + hide system cursor
  useEffect(() => {
    setMounted(true)
    document.documentElement.style.cursor = 'none'

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 8}px, ${e.clientY - 8}px)`
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })

    let rafId: number
    const animateLag = () => {
      lagPos.current.x += (mousePos.current.x - lagPos.current.x) * 0.1
      lagPos.current.y += (mousePos.current.y - lagPos.current.y) * 0.1
      if (cursorLagRef.current) {
        cursorLagRef.current.style.transform = `translate(${lagPos.current.x - 16}px, ${lagPos.current.y - 16}px)`
      }
      rafId = requestAnimationFrame(animateLag)
    }
    rafId = requestAnimationFrame(animateLag)

    return () => {
      document.documentElement.style.cursor = ''
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      {children}

      {/* Noise overlay */}
      <div
        className="noise-overlay fixed inset-0 pointer-events-none"
        style={{ zIndex: 9998 }}
        aria-hidden
      />

      {/* System status bar — bottom left */}
      <div
        className="fixed bottom-3 left-4 pointer-events-none select-none"
        style={{ zIndex: 9990 }}
        aria-hidden
      >
        <span className="status-bar">
          SYS://NEURIX v2.4{clock ? ` · ${clock}` : ''}
        </span>
      </div>

      {/* Custom cursor — only after mount to avoid SSR mismatch */}
      {mounted && (
        <>
          {/* Lag ring */}
          <div
            ref={cursorLagRef}
            className="fixed top-0 left-0 pointer-events-none select-none"
            style={{
              zIndex: 9997,
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '1px solid rgba(0,229,255,0.25)',
              willChange: 'transform',
            }}
            aria-hidden
          />

          {/* Crosshair dot */}
          <div
            ref={cursorRef}
            className="fixed top-0 left-0 pointer-events-none select-none"
            style={{ zIndex: 9999, width: 16, height: 16, willChange: 'transform' }}
            aria-hidden
          >
            {/* Horizontal bar */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: 1,
                background: 'rgba(0,229,255,0.75)',
                transform: 'translateY(-50%)',
              }}
            />
            {/* Vertical bar */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: 1,
                background: 'rgba(0,229,255,0.75)',
                transform: 'translateX(-50%)',
              }}
            />
            {/* Center dot */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: 'rgba(0,229,255,1)',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 6px rgba(0,229,255,0.8)',
              }}
            />
          </div>
        </>
      )}
    </>
  )
}
