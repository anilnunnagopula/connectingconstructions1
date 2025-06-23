/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      boxShadow: {
        "top-xl": "0 -10px 15px -3px rgba(0, 0, 0, 0.1)",
      },
      keyframes: {
        "bounce-in-out": {
          "0%": { transform: "translateY(50px)", opacity: "0" },
          "50%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(50px)", opacity: "0" },
        },
      },
      animation: {
        "bounce-in-out": "bounce-in-out 2s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
