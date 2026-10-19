/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red:        '#E31E24',
          'red-dark': '#B5181D',
          'red-light':'#FF4044',
          dark:       '#1A1A1A',
          gray:       '#4B4B4B',
          'gray-mid': '#888888',
          'gray-light':'#F5F5F5',
          'gray-border':'#E5E5E5',
          white:      '#FFFFFF',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          hover:   '#20BA5A',
          dark:    '#128C7E',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card:        '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 12px 32px rgba(0,0,0,0.12)',
        'glow-red':  '0 0 25px rgba(227,30,36,0.25)',
        'glow-green':'0 0 25px rgba(37,211,102,0.25)',
      },
      borderRadius: {
        xl2: '1rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};