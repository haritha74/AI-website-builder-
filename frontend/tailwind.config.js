export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#10151f",
        panel: "#151b27",
        line: "#293244",
        brand: "#2f6df6",
        mint: "#16a085",
        coral: "#f26d5b",
      },
      boxShadow: {
        glow: "0 18px 70px rgba(47, 109, 246, 0.22)",
      },
    },
  },
  plugins: [],
};
