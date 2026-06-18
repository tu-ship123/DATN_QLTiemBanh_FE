/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FFF4F1',
          100: '#FFE6DF',
          200: '#FFC9BB',
          300: '#FFA38E',
          400: '#F57862',
          500: '#E8634A',
          600: '#C94B33',
          700: '#A83424',
          800: '#872019',
          900: '#6B1210',
        },
        cream: {
          50:  '#FFFCFA',
          100: '#FFF8F4',
          200: '#FFF0E8',
          300: '#FFE4D5',
        }
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
        display: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover': '0 10px 25px -5px rgba(0,0,0,0.08), 0 4px 10px -6px rgba(0,0,0,0.05)',
        'sidebar': '2px 0 20px rgba(0,0,0,0.04)',
      },
      borderRadius: {
        'xl2': '20px',
      }
    },
  },
  plugins: [],
}