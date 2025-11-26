import flowbite from "flowbite-react/plugin";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        matcha: {
          50: "#f4f7f2",
          100: "#e6f0e0",
          200: "#cce1c1",
          300: "#b3d2a3",
          400: "#99c385",
          500: "#80b566", // warna utama
          600: "#66904f",
          700: "#4d6c3b",
          800: "#334926",
          900: "#1a2513",
        },
        retro: {
          cream: "#fdf3e7",
          yellow: "#f4c542",
          orange: "#e07a5f",
          red: "#d64550",
          blue: "#6eb4b8",
          brown: "#b87b4b",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [flowbite],
};
