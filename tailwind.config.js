/**
 * Setup config file template comes from TailwindCSS documentation
 * @https://v2.tailwindcss.com/docs/configuration
 */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"], // adjust if needed
  theme: {
    extend: {
      colors: {
        background: '#F5E3C6',
        text: '#8B4C24',
        brown_crust: '#D1905A',
        brown_highlight: '#FFE2B6',
        secondary_brown: '#C27A49',
        green_acccent: '#639751',
      },
      animation: {
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};