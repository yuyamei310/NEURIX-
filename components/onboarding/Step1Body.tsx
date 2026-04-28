'use client'

import { useRef, useState } from 'react'
import { BiometricSliders } from '@/components/scan/BiometricSliders'
import { HabitGrid } from '@/components/scan/HabitGrid'

interface Step1BodyProps {
  onNext: () => void
}

export function Step1Body({ onNext }: Step1BodyProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFileName, setImageFileName] = useState<string | null>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFileName(file.name)
    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }

  return (
    <div className="w-full max-w-[660px] mx-auto px-6 py-10">

      {/* Title */}
      <div className="mb-9 reveal-1">
        <div className="font-mono-data mb-3" style={{ color: 'var(--glow)' }}>
          01 / 03 — BODY PROFILE
        </div>
        <h2
          style={{
            fontFamily: 'var(--display)',
            fontSize: 'clamp(26px, 4.5vw, 36px)',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.12,
            color: 'var(--text)',
          }}
        >
          Tell NEURIX<br />about your body
        </h2>
      </div>

      {/* Two-column: sliders + habits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

        <div className="reveal-2">
          <div className="font-mono-data mb-4">BIOMETRICS</div>
          <BiometricSliders />
        </div>

        <div className="reveal-3">
          <div className="font-mono-data mb-4">ACTIVITY BACKGROUND</div>
          <HabitGrid />
        </div>

      </div>

      {/* Image upload */}
      <div className="reveal-4 mb-7">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full flex items-center gap-4 text-left transition-all duration-200"
          style={{
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.015)',
            border: '1px dashed rgba(255,255,255,0.1)',
            borderRadius: 4,
            cursor: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,107,53,0.28)'
            e.currentTarget.style.background = 'rgba(255,107,53,0.03)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.015)'
          }}
        >
          {/* Icon or preview */}
          {imagePreview ? (
            <img // eslint-disable-line @next/next/no-img-element
              src={imagePreview}
              alt=""
              className="w-10 h-10 object-cover flex-shrink-0"
              style={{ borderRadius: 3, border: '1px solid rgba(255,107,53,0.3)' }}
            />
          ) : (
            <div
              className="w-10 h-10 flex items-center justify-center flex-shrink-0"
              style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="2.5" width="14" height="11" rx="1.5" stroke="rgba(255,255,255,0.28)" strokeWidth="1.1" />
                <circle cx="5.5" cy="7" r="1.5" stroke="rgba(255,255,255,0.28)" strokeWidth="1.1" />
                <path d="M1 12l3.5-3 2.5 2 2.5-3.5L15 12" stroke="rgba(255,255,255,0.28)" strokeWidth="1.1" strokeLinejoin="round" />
              </svg>
            </div>
          )}

          <div>
            <div className="text-[13px]" style={{ color: imagePreview ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.38)' }}>
              {imagePreview
                ? imageFileName
                : <>Upload a body image <span style={{ color: 'rgba(255,255,255,0.2)' }}>— optional</span></>
              }
            </div>
            <div className="font-mono-data mt-1">
              {imagePreview ? 'IMAGE LOADED — READY FOR ANALYSIS' : 'Upload an image to let NEURIX analyze your body profile using AI'}
            </div>
          </div>
        </button>
      </div>

      {/* Microcopy */}
      <div className="reveal-4 flex items-start gap-2 mb-8">
        <div
          className="w-1 h-1 rounded-full mt-[6px] flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.18)' }}
        />
        <p
          className="font-mono text-[10px] tracking-[0.08em]"
          style={{ color: 'rgba(255,255,255,0.24)' }}
        >
          This is not a real scan. Your data drives the analysis.
        </p>
      </div>

      {/* CTA */}
      <div className="reveal-5">
        <div className="relative inline-block">
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: '-50%',
              background: 'radial-gradient(ellipse, rgba(255,107,53,0.1) 0%, transparent 65%)',
              filter: 'blur(18px)',
              animation: 'breathe 3.2s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
          <button
            onClick={onNext}
            style={{
              position: 'relative',
              fontFamily: 'var(--display)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              padding: '16px 48px',
              background: 'transparent',
              border: '1px solid rgba(255,107,53,0.42)',
              color: 'rgba(255,107,53,0.85)',
              cursor: 'none',
              transition: 'background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease, color 0.22s ease',
              boxShadow: '0 0 18px rgba(255,107,53,0.09), inset 0 0 18px rgba(255,107,53,0.03)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.background = 'rgba(255,107,53,0.07)'
              el.style.borderColor = 'rgba(255,107,53,0.82)'
              el.style.boxShadow = '0 0 38px rgba(255,107,53,0.28), inset 0 0 26px rgba(255,107,53,0.05)'
              el.style.color = 'rgba(255,107,53,1)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.background = 'transparent'
              el.style.borderColor = 'rgba(255,107,53,0.42)'
              el.style.boxShadow = '0 0 18px rgba(255,107,53,0.09), inset 0 0 18px rgba(255,107,53,0.03)'
              el.style.color = 'rgba(255,107,53,0.85)'
            }}
          >
            CONTINUE →
          </button>
        </div>
      </div>

    </div>
  )
}
