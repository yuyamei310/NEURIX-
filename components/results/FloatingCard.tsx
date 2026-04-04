import { ReactNode } from 'react'

interface FloatingCardProps {
  children: ReactNode
  className?: string
}

export function FloatingCard({ children, className = '' }: FloatingCardProps) {
  return (
    <div
      className={`bg-[#fafafa] border border-[0.5px] border-[#e5e5e7] rounded-xl p-3 ${className}`}
    >
      {children}
    </div>
  )
}
