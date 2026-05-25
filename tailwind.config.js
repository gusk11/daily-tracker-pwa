/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#071525',      // Navy
          secondary: '#10243d',    // Dunkles Blaugrau
          tertiary: '#132b49',     // Secondary
        },
        border: {
          subtle: '#1e3a52',       // Subtil
        },
        text: {
          primary: '#f8f9fa',      // Fast weiß
          muted: '#8b95a8',        // Graulich
        },
        accent: {
          primary: '#38bdf8',      // Hellblau
          success: '#22c55e',      // Grün
          warning: '#f97316',      // Orange
          danger: '#ef4444',       // Rot
        },
      },
    },
  },
  plugins: [],
}
