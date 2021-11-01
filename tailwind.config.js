const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
        rotate: {
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        dash: {
          '0%': {
            strokeDasharray: '0, 150',
            opacity: '1',
            stroke: '#2185d0',
          },
          '100%': {
            strokeDasharray: '120',
          },
        },
      },
      animation: {
        spinnerTimer: 'dash 5s linear infinite',
        rainbow: 'rainbow 5s linear infinite',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
