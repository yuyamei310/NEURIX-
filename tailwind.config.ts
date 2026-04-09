import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'surface-1': 'var(--surface-1)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        border: 'var(--border)',
        'border-2': 'var(--border-2)',
        'border-3': 'var(--border-3)',
        text: 'var(--text)',
        'text-2': 'var(--text-2)',
        'text-3': 'var(--text-3)',
        accent: 'var(--accent)',
        'accent-inv': 'var(--accent-inv)',
        // Neon palette
        glow: 'var(--glow)',
        'glow-2': 'var(--glow-2)',
        'glow-3': 'var(--glow-3)',
        'glow-4': 'var(--glow-4)',
        // Glass surfaces
        'glass-1': 'var(--glass-1)',
        'glass-border': 'var(--glass-border)',
        // Archetype colors
        'color-power':     'var(--color-power)',
        'color-endurance': 'var(--color-endurance)',
        'color-technical': 'var(--color-technical)',
        'color-hybrid':    'var(--color-hybrid)',
      },
      fontFamily: {
        sans:    ['var(--font-sans)', '-apple-system', 'Helvetica Neue', 'sans-serif'],
        mono:    ['var(--mono)'],
        display: ['var(--font-display)', 'sans-serif'],
      },
      borderWidth: {
        '0.5': '0.5px',
      },
      borderRadius: {
        pill: '980px',
      },
    },
  },
  plugins: [],
}

export default config
