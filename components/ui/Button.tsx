import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium transition-colors rounded-pill cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-[var(--accent)] text-[var(--accent-inv)] hover:opacity-90',
    secondary: 'bg-[var(--surface-1)] border border-[var(--border-2)] text-[var(--text)] hover:bg-[var(--surface-2)]',
    ghost: 'bg-transparent text-[var(--text-2)] hover:bg-[var(--surface-2)]',
  }

  const sizes = {
    sm: 'px-4 py-1.5 text-[13px]',
    md: 'px-6 py-2.5 text-[14px]',
    lg: 'px-8 py-3.5 text-[15px]',
  }

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
