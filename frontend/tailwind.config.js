/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      colors: {
        bg: '#070b14',
        bg2: '#0d1424',
        accent: '#00e5ff',
        accent2: '#7c3aed',
        accent3: '#f59e0b',
      },
    },
  },
  plugins: [],
}