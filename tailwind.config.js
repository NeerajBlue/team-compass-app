/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bw: {
          navy: '#0f3460',
          gold: '#e2b04a',
          light: '#f4f5f7',
          dark: '#1a1a2e',
        }
      }
    },
  },
  plugins: [],
}
