/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#165a65",
          dark: "#0f424b",
          light: "#1e7a8a",
        },
        gold: {
          DEFAULT: "#cfa156",
          accent: "#cfa156",
          light: "#e6c68b",
        },
        background: {
          light: "#e8eeef",
          dark: "#0a1f24",
        },
        surface: {
          light: "#ffffff",
          dark: "#122a30",
        },
      },
      fontFamily: {
        display: ["Cinzel", "serif"],
        sans: ["Lato", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(22, 90, 101, 0.12)",
        gold: "0 4px 15px -3px rgba(207, 161, 86, 0.25)",
        card: "0 2px 12px -2px rgba(22, 90, 101, 0.08)",
      },
    },
  },
  plugins: [],
}
