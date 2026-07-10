/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",          
    "./src/**/*.{html,js}"  
  ], 
  theme: {
    extend: {
      colors: {
        'brand-red': '#f83e02',
        'brand-light': '#fde7cf',
        'brand-dark': '#000000'
      },
      fontFamily: {
        // Títulos
        'title': ['"Sunborn"', 'sans-serif'],
        // Texto principal
        'body': ['"ITC Franklin Gothic LT"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}