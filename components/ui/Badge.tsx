import React from 'react'

interface BadgeProps {
  label: string
  variant?: 'default' | 'olympic' | 'paralympic' | 'archetype'
  className?: string
}

export function Badge({ label, variant = 'default', className = '' }: BadgeProps) {
  const base = 'inline-flex items-center rounded-pill px-2.5 py-0.5 font-mono text-[10px] tracking-widest uppercase leading-none border border-[0.5px]'

  const variants = {
    default: 'bg-[var(--surface-2)] text-[var(--text-3)] border-[var(--border)]',
    olympic: 'bg-[var(--text)] text-white border-[var(--text)]',
    paralympic: 'bg-[var(--text)] text-white border-[var(--text)]',
    archetype: 'bg-white text-[var(--text)] border-[var(--border-2)]',
  }

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {label}
    </span>
  )
}
