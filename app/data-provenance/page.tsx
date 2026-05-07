import Link from 'next/link'

const badges = [
  'Public-Inspired',
  'Anonymized',
  'Synthetic Fallback',
  'Ethics-Constrained',
]

const matrixRows = [
  {
    layer: 'Sport archetypes',
    source: 'Public-inspired sport context',
    usedFor: 'Broad pathway language and archetype framing',
    realSynthetic: 'Public-inspired, not individual records',
    safety: 'No athlete identity, rank, record, likeness, or one-to-one match',
  },
  {
    layer: 'Biometric ranges',
    source: 'Anonymous archetype patterns',
    usedFor: 'Signal matching across power, endurance, technical, and hybrid profiles',
    realSynthetic: 'Anonymized aggregate-style patterns',
    safety: 'Converted into broad ranges; never used as proof of ability',
  },
  {
    layer: 'Regional context',
    source: 'General public sport geography and access context',
    usedFor: 'Explaining entry points, clubs, and sport discovery pathways',
    realSynthetic: 'Public-inspired context',
    safety: 'Educational framing only; no eligibility or selection claims',
  },
  {
    layer: 'Paralympic classification education',
    source: 'Publicly available classification concepts',
    usedFor: 'Respectful explanation of adaptive sport pathways',
    realSynthetic: 'Public educational context',
    safety: 'No medical judgment, classification decision, or eligibility estimate',
  },
  {
    layer: 'Demo fallback archive',
    source: 'Fictional synthetic data generated for reliability',
    usedFor: 'Keeping demos stable when live model or archive calls are unavailable',
    realSynthetic: 'Synthetic',
    safety: 'Clearly labeled fictional fallback; never presented as real athlete data',
  },
  {
    layer: 'User scan input',
    source: 'User-provided biometrics, movement preferences, and activity background',
    usedFor: 'Creating a temporary structured profile for the fan experience',
    realSynthetic: 'Real user input',
    safety: 'Used only for conditional exploration, not ranking or diagnosis',
  },
]

const dataCards = [
  {
    title: 'Public-Inspired Context',
    label: 'Context',
    copy:
      'NEURIX uses broad public knowledge about Olympic and Paralympic sport demands, training environments, and pathway vocabulary. This context helps the app explain sports in plain language without naming or modeling real athletes.',
  },
  {
    title: 'Anonymous Archetype Patterns',
    label: 'Pattern Layer',
    copy:
      'The product frames user input against anonymous archetype patterns: power, endurance, technical, and hybrid. These patterns are intentionally broad so the output feels explainable without becoming a comparison engine.',
  },
  {
    title: 'Synthetic Fallback Data',
    label: 'Demo Reliability',
    copy:
      'Fallback archive entries are fictional. They exist only so the hackathon demo remains stable if a live response is unavailable, and they must never be interpreted as real athlete records or scouting evidence.',
  },
]

const safetyRules = [
  'No real athlete names',
  'No athlete likenesses',
  'No one-to-one athlete matching',
  'No guaranteed performance prediction',
  'No medical or eligibility claims',
  'No ranking users by human value or future success',
  'Olympic and Paralympic pathways explained with equal respect',
  'Conditional language only',
]

const pipeline = [
  'User Input',
  'Structured Profile',
  'Archetype Signal Matching',
  'Gemini Reasoning',
  'Ethics Filter',
  'Fan-Friendly Result',
]

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="mb-6">
      <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/25">
        {eyebrow}
      </div>
      <h2 className="mt-2 font-mono text-[22px] font-bold uppercase tracking-tight text-white md:text-[26px]">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-white/48">
          {description}
        </p>
      )}
    </div>
  )
}

export default function DataProvenancePage() {
  return (
    <main className="min-h-screen sys-grid bg-[var(--bg)] text-white">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(255,138,76,0.16), transparent 44%), radial-gradient(circle at 78% 18%, rgba(0,255,157,0.06), transparent 28%)',
        }}
        aria-hidden
      />

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px)',
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-5 py-5 md:px-8 md:py-6">
        <header className="flex flex-col gap-4 border-b border-white/[0.06] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="font-mono text-[10px] uppercase tracking-widest text-white/38 transition-colors hover:text-white"
          >
            NEURIX
          </Link>
          <nav className="flex flex-wrap items-center gap-4 font-mono text-[9px] uppercase tracking-[0.18em] text-white/28">
            <Link href="/scan" className="transition-colors hover:text-white/70">
              Scan
            </Link>
            <span className="text-[#ff8a4c]">Data Provenance</span>
          </nav>
        </header>

        <section className="relative overflow-hidden border-b border-white/[0.06] py-14 md:py-20">
          <div className="hud-frame glass-panel relative max-w-5xl rounded-[8px] p-6 md:p-9">
            <div className="font-mono text-[9px] uppercase tracking-[0.26em] text-[#ff8a4c]">
              Challenge 4 Ethics Evidence
            </div>
            <h1
              className="mt-4 font-black uppercase leading-none tracking-[0.08em]"
              style={{
                fontFamily: 'var(--display)',
                fontSize: 'clamp(42px, 8vw, 96px)',
                textShadow: '0 0 60px rgba(255,138,76,0.18)',
              }}
            >
              Data Provenance
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/58 md:text-[18px]">
              How NEURIX uses data responsibly
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-[6px] border border-[#ff8a4c]/25 bg-[#ff8a4c]/[0.06] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#ffb088]"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.06] py-10 md:py-14">
          <SectionHeader
            eyebrow="// Data Strategy Summary"
            title="Responsible By Design"
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              'NEURIX does not identify, rank, or compare users against real individual athletes.',
              'It uses public sport context, anonymous archetype patterns, and synthetic fallback data.',
              'The goal is fan-facing exploration, not talent prediction.',
            ].map((item, index) => (
              <div key={item} className="glass-panel rounded-[8px] p-5">
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#ff8a4c]">
                  0{index + 1}
                </div>
                <p className="mt-4 text-[13px] leading-relaxed text-white/62">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-white/[0.06] py-10 md:py-14">
          <SectionHeader
            eyebrow="// Data Source Matrix"
            title="Layered Inputs, Limited Use"
            description="Each layer has a specific role and a safety boundary. NEURIX narrows the data into explainable sport archetype signals without exposing identity-based comparisons."
          />
          <div className="overflow-hidden rounded-[8px] border border-white/[0.10] bg-white/[0.035]">
            <div className="hidden grid-cols-[1.05fr_1.15fr_1.4fr_1fr_1.45fr] gap-px bg-white/[0.08] font-mono text-[8px] uppercase tracking-[0.18em] text-white/42 lg:grid">
              {['Data Layer', 'Source Type', 'Used For', 'Real or Synthetic?', 'Safety Approach'].map((heading) => (
                <div key={heading} className="bg-[#0a0a0a] p-4">
                  {heading}
                </div>
              ))}
            </div>
            <div className="divide-y divide-white/[0.07] lg:divide-y-0">
              {matrixRows.map((row) => (
                <div
                  key={row.layer}
                  className="grid gap-px bg-white/[0.055] lg:grid-cols-[1.05fr_1.15fr_1.4fr_1fr_1.45fr]"
                >
                  {[
                    ['Data Layer', row.layer],
                    ['Source Type', row.source],
                    ['Used For', row.usedFor],
                    ['Real or Synthetic?', row.realSynthetic],
                    ['Safety Approach', row.safety],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-[#0a0a0a] p-4">
                      <div className="mb-2 font-mono text-[8px] uppercase tracking-[0.16em] text-white/25 lg:hidden">
                        {label}
                      </div>
                      <div className="text-[12px] leading-relaxed text-white/58">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.06] py-10 md:py-14">
          <SectionHeader
            eyebrow="// Real vs Synthetic"
            title="What The Archive Means"
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {dataCards.map((card) => (
              <article key={card.title} className="glass-panel rounded-[8px] p-5">
                <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#00ff9d]/70">
                  {card.label}
                </div>
                <h3 className="mt-3 font-mono text-[15px] font-bold uppercase tracking-tight text-white">
                  {card.title}
                </h3>
                <p className="mt-4 text-[12px] leading-relaxed text-white/52">
                  {card.copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-b border-white/[0.06] py-10 md:py-14">
          <SectionHeader
            eyebrow="// Safety Rules"
            title="Ethics Lock"
            description="These constraints shape both generated text and product presentation."
          />
          <div className="grid gap-3 md:grid-cols-2">
            {safetyRules.map((rule) => (
              <div key={rule} className="glass-panel flex items-start gap-3 rounded-[8px] p-4">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border border-[#ff8a4c]/45 bg-[#ff8a4c]/10 font-mono text-[10px] text-[#ff8a4c]">
                  OK
                </span>
                <span className="text-[12px] leading-relaxed text-white/60">{rule}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-white/[0.06] py-10 md:py-14">
          <SectionHeader
            eyebrow="// Gemini Reasoning Pipeline"
            title="Conditional Generation Flow"
            description="Gemini uses structured user input, anonymous archetype context, and safety constraints to generate a conditional, explainable result."
          />
          <div className="glass-panel rounded-[8px] p-4 md:p-5">
            <div className="grid gap-3 md:grid-cols-6">
              {pipeline.map((step, index) => (
                <div key={step} className="relative">
                  <div className="min-h-[92px] rounded-[6px] border border-white/[0.08] bg-black/20 p-4">
                    <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#ff8a4c]">
                      Step {index + 1}
                    </div>
                    <div className="mt-3 text-[12px] font-medium leading-snug text-white/70">
                      {step}
                    </div>
                  </div>
                  {index < pipeline.length - 1 && (
                    <div className="hidden md:block absolute right-[-11px] top-1/2 z-10 -translate-y-1/2 font-mono text-[13px] text-[#ff8a4c]/70">
                      -&gt;
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="glass-panel rounded-[8px] border-[#ff8a4c]/25 p-6 md:p-8">
            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#ff8a4c]">
              Final Ethics Statement
            </div>
            <p className="mt-4 max-w-4xl text-[16px] leading-relaxed text-white/68 md:text-[18px]">
              NEURIX is designed as an educational and imaginative fan experience. It is not a scouting tool, medical tool, eligibility system, or performance prediction engine.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
