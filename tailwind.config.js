/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#FFE600",
          brightYellow: "#FFFF00",
          "yellow-hover": "#E6CF00",
          red: "#E21B23",
          "red-hover": "#C8141C",
          dark: "#0F1115",
          charcoal: "#1A1D24",
          card: "#FFFFFF",
          whatsapp: "#25D366",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.06)",
        card: "0 10px 30px -5px rgba(0, 0, 0, 0.08)",
        glow: "0 0 25px rgba(255, 184, 0, 0.35)",
        redGlow: "0 0 20px rgba(226, 27, 35, 0.35)",
      },
    },
  },
  plugins: [],
};
