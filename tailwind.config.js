/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#fdf7f2',
        sand: '#f5e6da',
        gold: '#c9a15f',
        plum: {
          DEFAULT: '#3b1d2f',
          950: '#22101b',
          900: '#2a1421',
          800: '#3b1d2f',
          700: '#522a41',
          600: '#6b3a55',
        },
        blush: {
          50: '#fff5f6',
          100: '#ffe8ec',
          200: '#fdd0da',
          300: '#f9a8bb',
          400: '#f2799a',
          500: '#e84d7a',
          600: '#d02e63',
          700: '#a8214e',
        },
      },
      boxShadow: {
        soft: '0 10px 40px -14px rgba(59,29,47,.20)',
        lift: '0 28px 60px -20px rgba(208,46,99,.38)',
        glow: '0 0 0 6px rgba(232,77,122,.15)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pop: {
          '0%': { transform: 'scale(.6)', opacity: '0' },
          '70%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        blob: {
          '0%,100%': { borderRadius: '60% 40% 55% 45% / 55% 45% 60% 40%' },
          '50%': { borderRadius: '45% 55% 40% 60% / 45% 60% 40% 55%' },
        },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        marquee: 'marquee 32s linear infinite',
        pop: 'pop .45s cubic-bezier(.2,.9,.3,1.2) both',
        'slide-up': 'slideUp .4s ease both',
        blob: 'blob 12s ease-in-out infinite',
        'spin-slow': 'spinSlow 22s linear infinite',
      },
    },
  },
  plugins: [],
};
