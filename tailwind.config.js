/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.custom-scrollbar': {
          'scrollbar-width': 'none', // For Firefox
          '-ms-overflow-style': 'none', // For Internet Explorer
        },
        '.custom-scrollbar::-webkit-scrollbar': {
          display: 'none', // For Chrome, Safari, and Edge
        },
      });
    },
  ],
}