'use client'

import { getSyntheticArchiveProfile } from '@/core/syntheticArchive'
import type { AtlasResult, UserProfile } from '@/types/atlas'

const ACCENT = '#FF8A4C'
const MONO: React.CSSProperties['fontFamily'] = 'ui-monospace, "JetBrains Mono", "SF Mono", monospace'

interface DNACardProps {
  result: AtlasResult
  userProfile?: UserProfile | null
  canvasDataUrl?: string
}

function label(): React.CSSProperties {
  return {
    fontFamily: MONO,
    fontSize: 8,
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    color: '#666',
    marginBottom: 6,
  }
}

function divider(): React.CSSProperties {
  return { height: 1, background: '#1a1a1a', margin: '16px 0' }
}

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max).trimEnd() + '…' : str
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toISOString().slice(0, 10)
  } catch {
    return iso.slice(0, 10)
  }
}

// Wireframe human SVG — shown when no 3D canvas is available
function WireframeFigure() {
  const s = '#FF8A4C'
  const op = (o: number) => ({ stroke: s, strokeWidth: 0.8, fill: 'none', opacity: o })
  return (
    <svg viewBox="0 0 80 128" style={{ width: 72, height: 116, display: 'block' }}>
      {/* head */}
      <circle cx="40" cy="13" r="9.5" {...op(0.5)} />
      {/* spine */}
      <line x1="40" y1="22.5" x2="40" y2="64" {...op(0.35)} />
      {/* shoulder bar */}
      <line x1="18" y1="30" x2="62" y2="30" {...op(0.4)} />
      {/* left arm */}
      <line x1="18" y1="30" x2="10" y2="56" {...op(0.4)} />
      {/* right arm */}
      <line x1="62" y1="30" x2="70" y2="56" {...op(0.4)} />
      {/* hip bar */}
      <line x1="26" y1="64" x2="54" y2="64" {...op(0.4)} />
      {/* left leg */}
      <line x1="26" y1="64" x2="20" y2="100" {...op(0.4)} />
      {/* right leg */}
      <line x1="54" y1="64" x2="60" y2="100" {...op(0.4)} />
      {/* left foot */}
      <line x1="20" y1="100" x2="14" y2="106" {...op(0.3)} />
      <line x1="20" y1="100" x2="24" y2="106" {...op(0.3)} />
      {/* right foot */}
      <line x1="60" y1="100" x2="56" y2="106" {...op(0.3)} />
      <line x1="60" y1="100" x2="64" y2="106" {...op(0.3)} />
      {/* shoulder joints */}
      <circle cx="18" cy="30" r="2.5" {...op(0.6)} />
      <circle cx="62" cy="30" r="2.5" {...op(0.6)} />
      {/* hip joints */}
      <circle cx="26" cy="64" r="2.5" {...op(0.6)} />
      <circle cx="54" cy="64" r="2.5" {...op(0.6)} />
      {/* knee joints */}
      <circle cx="21" cy="82" r="2" {...op(0.5)} />
      <circle cx="59" cy="82" r="2" {...op(0.5)} />
      {/* chest cross */}
      <line x1="36" y1="46" x2="44" y2="46" stroke={s} strokeWidth="0.5" opacity="0.25" />
      <line x1="40" y1="42" x2="40" y2="50" stroke={s} strokeWidth="0.5" opacity="0.25" />
    </svg>
  )
}

// HUD rings drawn as SVG overlay on the body panel
function HudRingOverlay({ w, h }: { w: number; h: number }) {
  const cx = w / 2
  const cy = h / 2
  const ticks = [0, 45, 90, 135, 180, 225, 270, 315]
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: w, height: h, pointerEvents: 'none' }}
      viewBox={`0 0 ${w} ${h}`}
    >
      {/* outer ring */}
      <circle cx={cx} cy={cy} r={Math.min(w, h) * 0.44} fill="none" stroke={ACCENT} strokeWidth="0.6" opacity="0.18" />
      {/* mid dashed ring */}
      <circle cx={cx} cy={cy} r={Math.min(w, h) * 0.34} fill="none" stroke={ACCENT} strokeWidth="0.5" strokeDasharray="3 6" opacity="0.12" />
      {/* tick marks on outer ring */}
      {ticks.map((deg) => {
        const rad = (deg * Math.PI) / 180
        const r1 = Math.min(w, h) * 0.44
        const r2 = r1 - 5
        return (
          <line
            key={deg}
            x1={cx + r2 * Math.cos(rad)} y1={cy + r2 * Math.sin(rad)}
            x2={cx + r1 * Math.cos(rad)} y2={cy + r1 * Math.sin(rad)}
            stroke={ACCENT} strokeWidth="1" opacity="0.35"
          />
        )
      })}
      {/* center dot */}
      <circle cx={cx} cy={cy} r="2.5" fill={ACCENT} opacity="0.5" />
    </svg>
  )
}

export function DNACard({ result, userProfile, canvasDataUrl }: DNACardProps) {
  const profile = getSyntheticArchiveProfile(result.archetype.archetype)

  const type = result.archetype.archetype.toUpperCase()
  const confidence = Math.round(result.archetype.confidence * 100)
  const systemId = result.archetype.synthetic_archive_id

  const coreInsight = truncate(result.advisor.confidence_explanation, 200)
  const bodyFactors = result.advisor.key_factors.slice(0, 3)
  const historicalMatch = result.soul_twins[0]

  const coachData = result.coach
  const sports = coachData
    ? coachData.sport_recommendations.slice(0, 3).map((r) => r.sport)
    : profile.sportPathways.slice(0, 3).map((r) => r.sport)

  const trainingFocus = coachData?.training_phases?.[0]?.focus
    ?? bodyFactors[0]?.significance
    ?? '—'

  const awareness = truncate(result.archetype.reasoning ?? result.advisor.olympic_note ?? '—', 160)
  const reflection = truncate(result.reflection.reflection, 160)

  const lastUpdated = userProfile?.lastUpdated
    ? formatDate(userProfile.lastUpdated)
    : new Date().toISOString().slice(0, 10)

  const BODY_W = 484
  const BODY_H = 210

  return (
    <div
      id="dna-card"
      style={{
        position: 'fixed',
        top: -9999,
        left: -9999,
        width: 540,
        background: '#000000',
        fontFamily: MONO,
        color: '#ffffff',
        padding: '28px',
        boxSizing: 'border-box',
      }}
    >
      {/* ── HEADER ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#444', marginBottom: 4 }}>
            NEURIX SYSTEM
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff' }}>
            DNA PROFILE
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 8, letterSpacing: '0.14em', color: ACCENT, marginBottom: 4 }}>
            {systemId}
          </div>
          <div style={{ fontSize: 8, letterSpacing: '0.12em', color: '#444', textTransform: 'uppercase' }}>
            SYNTHETIC · ETHICAL AI
          </div>
        </div>
      </div>

      <div style={divider()} />

      {/* ── TYPE + CONFIDENCE BANNER ─────────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: '14px 16px',
        border: `0.5px solid #1e1e1e`,
        background: '#060606',
        marginBottom: 16,
      }}>
        <div>
          <div style={label()}>Archetype type</div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: ACCENT, lineHeight: 1 }}>
            {type}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...label(), marginBottom: 4 }}>Signal confidence</div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1 }}>
            {confidence}%
          </div>
          <div style={{ marginTop: 6, height: 2, width: 80, background: '#1a1a1a', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, width: `${confidence}%`, background: ACCENT }} />
          </div>
        </div>
      </div>

      {/* ── BODY VISUAL ──────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        width: BODY_W,
        height: BODY_H,
        background: '#060606',
        border: '0.5px solid #1a1a1a',
        overflow: 'hidden',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {canvasDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            id="dna-card-3d-img"
            src={canvasDataUrl}
            alt="NEURIX body scan"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <WireframeFigure />
        )}
        <HudRingOverlay w={BODY_W} h={BODY_H} />

        {/* HUD corner labels */}
        <div style={{ position: 'absolute', top: 8, left: 10, fontFamily: MONO, fontSize: 7, letterSpacing: '0.14em', color: ACCENT, opacity: 0.6 }}>
          MORPHOTYPE · {type}
        </div>
        <div style={{ position: 'absolute', bottom: 8, right: 10, fontFamily: MONO, fontSize: 7, letterSpacing: '0.14em', color: '#444' }}>
          SCAN COMPLETE
        </div>
      </div>

      {/* ── CORE INSIGHT ─────────────────────────────────────── */}
      <div style={{ marginBottom: 0 }}>
        <div style={label()}>Core Insight</div>
        <div style={{ fontSize: 11, lineHeight: 1.6, color: '#ccc' }}>{coreInsight}</div>
      </div>

      <div style={divider()} />

      {/* ── BODY COMPOSITION + HISTORICAL MATCH ──────────────── */}
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={label()}>Body Composition</div>
          {bodyFactors.map((f, i) => (
            <div key={i} style={{ marginBottom: 6, fontSize: 10 }}>
              <span style={{ color: '#666' }}>{f.factor}: </span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{f.value}</span>
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={label()}>Historical Match</div>
          {historicalMatch ? (
            <>
              <div style={{ fontSize: 10, color: '#fff', fontWeight: 600, marginBottom: 4, lineHeight: 1.4 }}>
                {historicalMatch.archetype_label}
              </div>
              <div style={{ fontSize: 9, color: '#666', marginBottom: 3 }}>
                {historicalMatch.era}
              </div>
              <div style={{ fontSize: 9, color: ACCENT }}>
                {historicalMatch.games_type} · {historicalMatch.sport}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 10, color: '#444' }}>No match data</div>
          )}
        </div>
      </div>

      <div style={divider()} />

      {/* ── POTENTIAL SPORTS + TRAINING FOCUS ────────────────── */}
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={label()}>Potential Sports</div>
          {sports.map((s, i) => (
            <div key={i} style={{ marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: ACCENT, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: '#ccc' }}>{s}</span>
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={label()}>Training Focus</div>
          <div style={{ fontSize: 10, color: '#ccc', lineHeight: 1.6 }}>
            {truncate(trainingFocus, 120)}
          </div>
        </div>
      </div>

      <div style={divider()} />

      {/* ── AWARENESS + REFLECTION ───────────────────────────── */}
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={label()}>Awareness</div>
          <div style={{ fontSize: 10, color: '#aaa', lineHeight: 1.6 }}>{awareness}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={label()}>Reflection</div>
          <div style={{ fontSize: 10, color: '#aaa', lineHeight: 1.6, fontStyle: 'italic' }}>
            &ldquo;{reflection}&rdquo;
          </div>
        </div>
      </div>

      <div style={divider()} />

      {/* ── MEMORY STAMP ─────────────────────────────────────── */}
      <div style={{
        borderLeft: `2px solid ${ACCENT}`,
        paddingLeft: 12,
        paddingTop: 2,
        paddingBottom: 2,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, display: 'inline-block' }} />
          <span style={{ fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: ACCENT }}>
            STORED IN NEURIX MEMORY
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#333', display: 'inline-block' }} />
          <span style={{ fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555' }}>
            LAST UPDATED: {lastUpdated}
          </span>
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 7, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#333' }}>
          NO REAL ATHLETE IDENTITY USED
        </div>
        <div style={{ fontSize: 7, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#333' }}>
          NEURIX · SYNTHETIC DEMO
        </div>
      </div>
    </div>
  )
}
