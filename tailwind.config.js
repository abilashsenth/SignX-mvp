module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontfamily:{
        Manrope: ['Manrope', 'sans-serif'],
        Rampart: ["Rampart One", "cursive"],
      },
    },
  },
  plugins: [require("daisyui")],
}
