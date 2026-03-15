import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans Hebrew', 'system-ui', 'sans-serif'],
      },
      colors: {
        milo: {
          cream: '#FFF8F0',
          blush: '#FFD6E0',
          mint: '#C7F2E4',
          lavender: '#E2D4F0',
          sky: '#C8E6FA',
          sunshine: '#FFF3B0',
          coral: '#FF8FA3',
          'coral-dark': '#E8607A',
          sage: '#A8D5BA',
          'sage-dark': '#6BAF8A',
          charcoal: '#3D3D3D',
          stone: '#8A8A8A',
          'stone-light': '#E8E8E8',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'check-pop': 'checkPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-down': 'slideDown 0.25s ease-out',
      },
      keyframes: {
        checkPop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
