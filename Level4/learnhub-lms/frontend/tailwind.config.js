/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          100: '#1e1e2e',
          200: '#181825',
          300: '#11111b',
        }
      }
    },
  },
  plugins: [],
}