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
        // CodexFlow Custom Colors
        primary: {
          50: "#f0f0ff",
          100: "#e6e6ff",
          500: "#4338ca", // Your primary indigo
          600: "#3730a3",
          700: "#312e81",
          900: "#1e1b4b",
        },
        accent: {
          500: "#6366f1", // Your accent color
          600: "#5b21b6",
        },
      },
    },
  },
  plugins: [],
};
