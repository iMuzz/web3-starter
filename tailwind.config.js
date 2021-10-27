const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
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
        rainbow: {
          '0%': {
            borderColor: '#ff454f',
          },
          '20%': {
            borderColor: '#ffc615',
          },
          '40%': {
            borderColor: '#d51fff',
          },
          '50%': {
            borderColor: '#0085ff',
          },
          '80%': {
            borderColor: '#00a545',
          },
          '100%': {
            borderColor: '#ff454f',
          },
        },
      },
      animation: {
        spinnerTimer: 'dash 5s linear infinite',
        rainbow: 'rainbow 5s linear infinite',
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      panelBg: '#001d2b',
      borderColor: '#1d435a',
      gold: '#daba63',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
