/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"], 
  theme: {
    extend: {
      colors: {
        'brand-red': '#f5683a',
        'brand-light': '#fde7cf',
        'brand-dark': '#000000'
      },
      fontFamily: {
        // Títulos oficiales
        'title': ['"ITC Benguiat Condensed Bold"', 'serif'],
        // Texto principal oficial
        'body': ['"ITC Franklin Gothic LT"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}