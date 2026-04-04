import { ReactNode } from 'react'

interface FloatingCardProps {
  children: ReactNode
  className?: string
}

export function FloatingCard({ children, className = '' }: FloatingCardProps) {
  return (
    <div
      className={`bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-xl p-3 ${className}`}
    >
      {children}
    </div>
  )
}
