const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      display: ['Poppins', 'sans-serif'],
      // Note, Work Sans must be quoted per the docs: https://tailwindcss.com/docs/font-family/#font-families
      body: ['"Work Sans"', 'sans-serif'],
    },
    colors: {
      gray: colors.blueGray,
      orange: colors.orange,
      pink: colors.rose,
      purple: colors.fuchsia,
      green: colors.teal,
      yellow: colors.amber,
      blue: colors.lightBlue,
      white: colors.white,
      black: colors.black,
    },
    extend: {},
  },
  variants: {},
  plugins: [],
}
