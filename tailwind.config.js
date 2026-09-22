/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '20': 'repeat(20, minmax(0, 1fr))',
      },
      colors: {
        bronze: {
          50: '#fdf8f4',
          100: '#f9eee5',
          200: '#f2dbc9',
          300: '#e7c0a4',
          400: '#da9d78',
          500: '#ce7e54',
          600: '#bf643f',
          700: '#9e4e34',
          800: '#80402f',
          900: '#68362a',
        },
        steampunk: {
          brass: '#b59441',
          copper: '#c86f43',
          iron: '#343a40',
          dark: '#121418',
          panel: '#1b1f24',
          border: '#374151'
        }
      }
    },
  },
  plugins: [],
}
