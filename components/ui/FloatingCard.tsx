import { ReactNode } from 'react'

interface FloatingCardProps {
  children: ReactNode
  className?: string
}

export function FloatingCard({ children, className = '' }: FloatingCardProps) {
  return (
    <div
      className={`bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-3 text-white ${className}`}
    >
      {children}
    </div>
  )
}

export function HUDPanel({ children, className = '' }: FloatingCardProps) {
  const c = 'rgba(255,255,255,0.32)'
  return (
    <div className={`relative text-white ${className}`}>
      <div className="absolute top-0 left-0 w-2.5 h-2.5" style={{ borderTop: `1px solid ${c}`, borderLeft: `1px solid ${c}` }} />
      <div className="absolute top-0 right-0 w-2.5 h-2.5" style={{ borderTop: `1px solid ${c}`, borderRight: `1px solid ${c}` }} />
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5" style={{ borderBottom: `1px solid ${c}`, borderLeft: `1px solid ${c}` }} />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5" style={{ borderBottom: `1px solid ${c}`, borderRight: `1px solid ${c}` }} />
      <div className="p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {children}
      </div>
    </div>
  )
}
