/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'notion-gray': {
          50: '#f7f7f5',
          100: '#e9e9e7',
          200: '#d3d3d0',
          300: '#b8b8b5',
          400: '#a1a19e',
          500: '#8b8b88',
          600: '#78787a',
          700: '#63636a',
          800: '#515158',
          900: '#434349',
        }
      }
    },
  },
  plugins: [],
}