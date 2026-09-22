/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0C2A46',
          'navy-light': '#102F49',
          'navy-dark': '#081D30',
          midnight: '#011826',
          'midnight-card': '#071F30',
          gold: '#A67A53',
          'gold-light': '#C49A6C',
          'gold-dark': '#865E39',
          brown: '#401F14',
          'brown-light': '#5A2E20',
          cream: '#F7F3EC',
          'cream-card': '#FAF8F5',
          sand: '#D9D0C5',
          warmwhite: '#F2F2F2',
        },
        lexi: {
          navy: '#0C2A46',
          'navy-light': '#102F49',
          'navy-dark': '#081D30',
          midnight: '#011826',
          'midnight-card': '#071F30',
          gold: '#A67A53',
          'gold-light': '#C49A6C',
          'gold-dark': '#865E39',
          brown: '#401F14',
          cream: '#F7F3EC',
          sand: '#D9D0C5',
          warmwhite: '#F2F2F2',
        },
        legal: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', 'Merriweather', 'Georgia', 'serif'],
        headline: ['Newsreader', 'Merriweather', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(166, 122, 83, 0.25)',
        'gold-subtle': '0 4px 20px -2px rgba(166, 122, 83, 0.12)',
        'navy-deep': '0 10px 30px -5px rgba(1, 24, 38, 0.6)',
      }
    },
  },
  plugins: [],
}
