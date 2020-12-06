module.exports = {
  purge: ['./src/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      display: ['Poppins', 'sans-serif'],
      // Note, Work Sans must be quoted per the docs: https://tailwindcss.com/docs/font-family/#font-families
      body: ['"Work Sans"', 'sans-serif'],
    },
    extend: {},
  },
  variants: {},
  plugins: [],
}
