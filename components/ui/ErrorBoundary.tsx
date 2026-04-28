'use client'

import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[NEURIX] Render error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[var(--bg,#0a0a0a)] flex items-center justify-center px-8">
          <div className="max-w-md flex flex-col gap-4">
            <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-red-500/70">
              NEURIX · SYSTEM ERROR
            </div>
            <h2 className="text-[18px] font-semibold text-white/80">Something went wrong</h2>
            <p className="text-[13px] text-white/40 font-mono leading-relaxed">
              {this.state.error.message}
            </p>
            <button
              onClick={() => this.setState({ error: null })}
              className="self-start px-4 py-2 text-[12px] font-mono border border-white/10 text-white/60 hover:text-white/80 hover:border-white/20 transition-colors rounded-[8px] cursor-pointer"
            >
              ← Dismiss
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
