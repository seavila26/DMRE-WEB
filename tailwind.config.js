/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // Poppins como fuente global
      },
      colors: {
        text: "#333333",
        background: "#f9f9f9",
        secondary: "#555555",
      },
      fontSize: {
        h1: "2.25rem", // 36px
        h2: "1.5rem",  // 24px
        body: "1rem",  // 16px
      },
      // 🔹 Animaciones personalizadas
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(40px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 1s ease-out forwards",
      },
    },
  },
  plugins: [],
};
