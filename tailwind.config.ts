import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4F1EA",
        "paper-soft": "#FAF8F3",
        charcoal: "#242424",
        jet: "#0B0B0B",
        "gray-dark": "#454545",
        "gray-muted": "#858585",
        border: "#D8D4CC",
        accent: "#B89B5E",
        team: {
          green: "#3E6B4F",
          blue: "#2E4E7E",
          black: "#1A1A1A",
          red: "#8C3A32"
        }
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "serif"],
        sans: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};
export default config;
