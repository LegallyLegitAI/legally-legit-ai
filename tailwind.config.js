/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#1e3a5f',
        'navy-dark': '#0f1f33',
        'forest': '#2d5a3d',
        'forest-light': '#4a8b64',
        'gold': '#d4a574',
        'gold-light': '#e6c8a0',
      }
    },
  },
  plugins: [],
}