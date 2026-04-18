/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        body: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          DEFAULT: 'rgb(var(--ink-900) / <alpha-value>)',
          50: 'rgb(var(--ink-50) / <alpha-value>)',
          100: 'rgb(var(--ink-100) / <alpha-value>)',
          200: 'rgb(var(--ink-200) / <alpha-value>)',
          300: 'rgb(var(--ink-300) / <alpha-value>)',
          400: 'rgb(var(--ink-400) / <alpha-value>)',
          500: 'rgb(var(--ink-500) / <alpha-value>)',
          600: 'rgb(var(--ink-600) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)',
          900: 'rgb(var(--ink-900) / <alpha-value>)',
        },
        volt: {
          DEFAULT: 'rgb(var(--volt-300) / <alpha-value>)',
          50: 'rgb(var(--volt-50) / <alpha-value>)',
          100: 'rgb(var(--volt-100) / <alpha-value>)',
          200: 'rgb(var(--volt-200) / <alpha-value>)',
          300: 'rgb(var(--volt-300) / <alpha-value>)',
          400: 'rgb(var(--volt-400) / <alpha-value>)',
          500: 'rgb(var(--volt-500) / <alpha-value>)',
        },
        coral: {
          DEFAULT: 'rgb(var(--coral-default) / <alpha-value>)',
          light: 'rgb(var(--coral-light) / <alpha-value>)',
          dark: 'rgb(var(--coral-dark) / <alpha-value>)',
        },
        amber: {
          task: 'rgb(var(--amber-task) / <alpha-value>)',
          light: 'rgb(var(--amber-light) / <alpha-value>)',
          dark: 'rgb(var(--amber-dark) / <alpha-value>)',
        },
        sky: {
          task: 'rgb(var(--sky-task) / <alpha-value>)',
          light: 'rgb(var(--sky-light) / <alpha-value>)',
          dark: 'rgb(var(--sky-dark) / <alpha-value>)',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-right': 'slideRight 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-volt': 'pulseVolt 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'count-up': 'countUp 0.6s ease forwards',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideRight: { from: { opacity: 0, transform: 'translateX(-24px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        pulseVolt: { '0%,100%': { boxShadow: '0 0 0 0 rgba(200,255,0,0.4)' }, '50%': { boxShadow: '0 0 0 12px rgba(200,255,0,0)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        glow: { from: { textShadow: '0 0 10px rgba(200,255,0,0.5)' }, to: { textShadow: '0 0 20px rgba(200,255,0,0.9), 0 0 40px rgba(200,255,0,0.3)' } },
        countUp: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgb(var(--grid-line) / 0.06) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--grid-line) / 0.06) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
}
