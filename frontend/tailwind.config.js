/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3e2',
          100: '#fde7c5',
          200: '#fbcf8b',
          300: '#f9b751',
          400: '#f79f17',
          500: '#f58700',
          600: '#dd7800',
          700: '#b56200',
          800: '#8d4d00',
          900: '#653700',
        },
        ravi: '#3B82F6',
        guru: '#8B5CF6',
        arjun: '#10B981',
        meera: '#F59E0B',
        kavya: '#EF4444',
      },
      fontFamily: {
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
