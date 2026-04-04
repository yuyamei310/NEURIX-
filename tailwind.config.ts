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
      },
      fontFamily: {
        sans: ['var(--sans)'],
        mono: ['var(--mono)'],
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
