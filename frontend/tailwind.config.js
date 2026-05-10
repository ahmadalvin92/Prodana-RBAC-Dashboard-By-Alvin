/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#111827",
        muted: "#667085",
        surface: "#f6f8fb",
        brand: "#2563eb",
        success: "#059669",
        warning: "#d97706",
        danger: "#dc2626",
      },
      boxShadow: {
        soft: "0 18px 48px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
