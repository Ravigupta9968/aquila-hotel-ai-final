/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chatbg: "#343541", 
        sidebar: "#202123", 
        inputbg: "#40414f", 
        hoverbg: "#2A2B32", 
        borderDark: "#4d4d4f",
        aquilaGold: "#C9A84C", 
      }
    },
  },
  plugins: [],
}