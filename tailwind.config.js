/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'r-start': '#FFFB92',
        'r-end': '#00F6FF',
        'd-start': '#FFC2F5',
        'd-end': '#C3FFC6',
      },
      backgroundImage: {
        'gradient-r-to-white': 'linear-gradient(to bottom, #FFFB92, #00F6FF, white)',
        'gradient-d-to-white': 'linear-gradient(to bottom, #FFC2F5, #C3FFC6, white)',
        'gradient-r-subject': 'linear-gradient(to top, #FFFB92, white)',
        'gradient-r-rule': 'linear-gradient(to bottom, #00F6FF, white)',
        'gradient-d-subject': 'linear-gradient(to top, #FFC2F5, white)',
        'gradient-d-rule': 'linear-gradient(to bottom, #C3FFC6, white)',
      }
    },
  },
  plugins: [],
} 