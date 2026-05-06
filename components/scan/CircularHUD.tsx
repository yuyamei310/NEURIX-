'use client'

const SIZE   = 640   // outer diameter in px
const H      = SIZE / 2   // rotation pivot = 320px
const DOT_R  = 300   // orbit radius ≈ main ring radius (inset:20 → div 600px → R 300px)

// Punch out a ring of `width` at the outer edge of the element
function ringMask(width: string) {
  return `radial-gradient(circle closest-side at center, transparent calc(100% - ${width}), black calc(100% - ${width}))`
}

// Dots that orbit the ring: [animation, duration, delay, opacity, size(px)]
const ORBIT_DOTS: [string, string, string, number, number][] = [
  ['hudRotateCW',  '22s', '0s',    0.45, 3  ],
  ['hudRotateCW',  '38s', '-17s',  0.28, 2.5],
  ['hudRotateCCW', '28s', '-9s',   0.35, 2.5],
]

export function CircularHUD() {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: SIZE,
        height: SIZE,
        top: '50%',
        left: '50%',
        // Align with body's visual center (body has translateY(-40px))
        transform: 'translate(-50%, -50%) translateY(-40px)',
      }}
    >
      {/* ─────────────────────────────────────────────
          DEPTH — Radial gradient behind the entire HUD
          Center slightly brighter → fades outward
          Creates focus / depth around the body
      ───────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: -100,
          background: `radial-gradient(
            circle at center,
            rgba(255,255,255,0.055) 0%,
            rgba(255,255,255,0.025) 30%,
            rgba(255,255,255,0.008) 55%,
            transparent 72%
          )`,
        }}
      />

      {/* ─────────────────────────────────────────────
          LAYER 1 — Outermost static reference ring
          Very thin, white/8 — the "measurement baseline"
      ───────────────────────────────────────────── */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ border: '0.5px solid rgba(255,255,255,0.08)' }}
      />

      {/* ─────────────────────────────────────────────
          LAYER 2 — Tick marks
          72 ticks at 5° intervals, inside the outer ring
          Major (90°) / Mid (30°) / Minor (5°)
      ───────────────────────────────────────────── */}
      {Array.from({ length: 72 }, (_, i) => {
        const isMajor = i % 18 === 0
        const isMid   = i % 6 === 0
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 1,
              height: isMajor ? 13 : isMid ? 7 : 3.5,
              background: `rgba(255,255,255,${isMajor ? 0.22 : isMid ? 0.13 : 0.07})`,
              top: 0,
              left: 'calc(50% - 0.5px)',
              // Pivot at container center → tick extends inward from the ring edge
              transformOrigin: `0.5px ${H}px`,
              transform: `rotate(${i * 5}deg)`,
            }}
          />
        )
      })}

      {/* ─────────────────────────────────────────────
          LAYER 3 — Soft glow aura
          Wide blurred ring behind the main arc;
          rotates in sync with main ring
      ───────────────────────────────────────────── */}
      <div
        className="absolute rounded-full"
        style={{
          inset: 6,
          background: `conic-gradient(
            from 0deg,
            transparent       0%,
            rgba(180,210,255,0.22) 16%,
            rgba(255,255,255,0.38) 24%,
            rgba(180,210,255,0.22) 33%,
            transparent       46%,
            transparent       58%,
            rgba(255,255,255,0.12) 65%,
            rgba(255,255,255,0.05) 72%,
            transparent       80%,
            transparent       100%
          )`,
          WebkitMask: ringMask('26px'),
          mask:        ringMask('26px'),
          filter: 'blur(9px)',
          animation: 'hudRotateCW 30s linear infinite',
        }}
      />

      {/* ─────────────────────────────────────────────
          LAYER 4 — Main conic arc ring  (hero element)
          Two bright arc segments + one faint segment
          Slow CW rotation
      ───────────────────────────────────────────── */}
      <div
        className="absolute rounded-full"
        style={{
          inset: 20,
          background: `conic-gradient(
            from 0deg,
            transparent            0%,
            rgba(255,255,255,0.04) 3%,
            rgba(180,210,255,0.36) 14%,
            rgba(255,255,255,0.50) 21%,
            rgba(180,210,255,0.36) 28%,
            rgba(255,255,255,0.04) 32%,
            transparent            37%,
            transparent            53%,
            rgba(255,255,255,0.04) 55%,
            rgba(255,255,255,0.18) 61%,
            rgba(255,255,255,0.04) 67%,
            transparent            71%,
            transparent            100%
          )`,
          WebkitMask: ringMask('2.5px'),
          mask:        ringMask('2.5px'),
          animation: 'hudRotateCW 30s linear infinite',
        }}
      />

      {/* ─────────────────────────────────────────────
          LAYER 5 — Inner secondary ring
          Counter-rotating, fainter — creates depth
      ───────────────────────────────────────────── */}
      <div
        className="absolute rounded-full"
        style={{
          inset: 32,
          background: `conic-gradient(
            from 90deg,
            transparent            0%,
            rgba(255,255,255,0.02) 5%,
            rgba(255,255,255,0.14) 13%,
            rgba(255,255,255,0.02) 21%,
            transparent            29%,
            transparent            68%,
            rgba(255,255,255,0.09) 78%,
            rgba(255,255,255,0.02) 87%,
            transparent            95%,
            transparent            100%
          )`,
          WebkitMask: ringMask('1.5px'),
          mask:        ringMask('1.5px'),
          animation: 'hudRotateCCW 55s linear infinite',
        }}
      />

      {/* Active scan field — clipped to the circular core */}
      <div
        className="absolute rounded-full overflow-hidden"
        style={{
          inset: 34,
          opacity: 0.9,
          WebkitMask: 'radial-gradient(circle, black 62%, transparent 63%)',
          mask: 'radial-gradient(circle, black 62%, transparent 63%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `conic-gradient(
              from 230deg,
              transparent 0deg,
              rgba(255,138,76,0.02) 18deg,
              rgba(255,138,76,0.18) 35deg,
              rgba(255,255,255,0.18) 42deg,
              transparent 68deg,
              transparent 360deg
            )`,
            animation: 'hud-sweep-spin 7s linear infinite',
          }}
        />
      </div>

      {/* ─────────────────────────────────────────────
          ORBITING DOTS — travel along the main ring path
          Each dot: zero-size pivot at HUD center,
          dot offset -DOT_R so it sits on the ring,
          parent rotates → dot appears to travel the arc
      ───────────────────────────────────────────── */}
      {ORBIT_DOTS.map(([anim, dur, delay, opacity, size], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 0,
            height: 0,
            // Pivot is the HUD center; rotation moves the dot along the ring
            animation: `${anim} ${dur} ${delay} linear infinite`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: '50%',
              background: `rgba(255,255,255,${opacity})`,
              // Center the dot on the ring: offset up by DOT_R + half dot size
              top:  -(DOT_R + size / 2),
              left: -(size / 2),
              boxShadow: `0 0 5px rgba(255,255,255,${opacity * 0.7}), 0 0 2px rgba(200,225,255,${opacity * 0.5})`,
            }}
          />
        </div>
      ))}
    </div>
  )
}
