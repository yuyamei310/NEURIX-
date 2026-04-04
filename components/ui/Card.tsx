import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: boolean
}

export function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <div
      className={`bg-[var(--surface-1)] border border-[0.5px] border-[var(--border)] rounded-[14px] ${padding ? 'p-5' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
