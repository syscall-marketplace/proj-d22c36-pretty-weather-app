/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace'],
      },
      backgroundImage: {
        'gradient-day': 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 50%, #a78bfa 100%)',
        'gradient-night': 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        'gradient-sunny': 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
        'gradient-cloudy': 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
        'gradient-rainy': 'linear-gradient(135deg, #373b44 0%, #4286f4 100%)',
        'gradient-snowy': 'linear-gradient(135deg, #83a4d4 0%, #b6fbff 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
};
