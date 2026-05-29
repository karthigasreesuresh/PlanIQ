/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#c2d1ff',
          300: '#99b3ff',
          400: '#7094ff',
          500: '#4775ff', // Primary Brand Blue/Indigo
          600: '#335ae6',
          700: '#2443bf',
          800: '#172c99',
          900: '#0c1673',
        },
        slate: {
          850: '#1e293b', // Rich dark gray for layout cards
          950: '#0f172a'  // Dark background
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      }
    },
  },
  plugins: [],
}
