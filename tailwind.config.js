/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter"],
      },
      colors: {
        "label-2": "rgba(60,60,67,0.6)",
        "label-3": "rgba(60,60,67,0.3)",
        background: "rgba(22,21,23,.03)",
      },
    },
  },
  plugins: [],
};
