/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,jsx,mdx}",
    "./components/**/*.{js,jsx,mdx}",
    "./admin/**/*.{js,jsx}",
    "./content/**/*.{md,mdx}"
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Legacy aliases — kept until components are migrated to the new tokens below.
        ink: "#07070A",
        accent: "#6947BF",
        accentSoft: "#8B6FD6",

        // New brand design system (see /areas/portfolio-redesign.md)
        background: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-hover": "rgb(var(--color-surface-hover) / <alpha-value>)",
        foreground: "rgb(var(--color-fg) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        primary: {
          DEFAULT: "#6947BF",
          dark: "#34147C",
          light: "#8B6FD6"
        }
      },
      fontFamily: {
        body: ["var(--font-inter)", "var(--font-vazirmatn)", "sans-serif"],
        display: ["var(--font-inter)", "var(--font-vazirmatn)", "sans-serif"],
        fa: ["var(--font-vazirmatn)", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 40px -8px rgb(105 71 191 / 0.45)",
        "glow-sm": "0 0 20px -6px rgb(105 71 191 / 0.4)"
      },
      backgroundImage: {
        noise: "url('/noise.svg')"
      }
    }
  },
  plugins: []
};

export default config;
