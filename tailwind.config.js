/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        gallery: {
          50: '#faf8f5',
          100: '#f2ede4',
          200: '#e5d9c8',
          300: '#d4bfa0',
          400: '#c09a72',
          500: '#b07d52',
          600: '#9a6642',
          700: '#7f5237',
          800: '#684431',
          900: '#57392b',
          950: '#2e1d14',
        },
        obsidian: '#0a0a0f',
        ivory: '#f8f5f0',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
      },
    },
  },
  plugins: [],
}
