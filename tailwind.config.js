/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2da437', // Brand Green
        ghost: '#ffffff', // Brand White
        'brand-gray': '#d4d3d3', // Brand Gray
        green: {
          50: '#f2fbf3',
          100: '#e0f6e3',
          200: '#c2ecc7',
          300: '#93dba0',
          400: '#5bc36e',
          500: '#2da437', // Brand color
          600: '#208429',
          700: '#1b6823',
          800: '#185320',
          900: '#14441c',
        },
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#ebebeb',
          300: '#d4d3d3', // Brand gray
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
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
