/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,mdx}",
    "./components/**/*.{js,jsx,mdx}",
    "./admin/**/*.{js,jsx}",
    "./content/**/*.{md,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#080f1f",
        accent: "#0ea5e9",
        accentSoft: "#38bdf8"
      },
      fontFamily: {
        body: ["Vazirmatn", "sans-serif"],
        display: ["Vazirmatn", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
