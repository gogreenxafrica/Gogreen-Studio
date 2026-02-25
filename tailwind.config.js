/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A5D22',
        dark: '#051a08',
        ghost: '#f4f4f4',
      },
      keyframes: {
        'progress-indeterminate': {
          '0%': { transform: 'translateX(-100%) scaleX(0.5)' },
          '50%': { transform: 'translateX(0) scaleX(0.2)' },
          '100%': { transform: 'translateX(100%) scaleX(0.5)' },
        },
        'coin-bounce': {
          '0%, 100%': { transform: 'translateY(-10%)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
        },
        'shadow-pulse': {
          '0%, 100%': { transform: 'scale(1, 1)', opacity: 0.7 },
          '50%': { transform: 'scale(1.2, 1)', opacity: 1 },
        },
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'slide-up': { '0%': { transform: 'translateY(20px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        }
      },
      animation: {
        'progress-indeterminate': 'progress-indeterminate 1.5s ease-in-out infinite',
        'coin-bounce': 'coin-bounce 3s ease-in-out infinite',
        'shadow-pulse': 'shadow-pulse 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'shake': 'shake 0.5s ease-in-out',
      }
    },
  },
  plugins: [],
}
