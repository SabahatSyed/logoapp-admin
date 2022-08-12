/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      rublik: ["Rubik", "sans-serif"],
      lato: ["Lato", "sans-serif"],
      oxygen: ["Oxygen", "sans-serif"],
      poppins: ["Poppins", "sans-serif"],
    },
    extend: {
      colors: {
        primary: {
          100: "#92B8FF",
          200: "#5F91F2",
          300: "#6F88FC",
          400: "#1564C0",
          500: "#013B8D",
        },
        secondary: {
          100: "#A5DEF1",
          200: "#70AFCE",
          300: "#3A7B99",
        },
        tertiary: {
          cyan: "#45E3FF",
          purple: "#A162F7",
        },
      },
      backgroundImage: {
        "hero-pattern":
          "url('https://demos.wrappixel.com/premium-admin-templates/react/flexy-react/main/static/media/welcome-bg-2x-svg.25338f53.svg')",
      },
    },
  },
  plugins: [require("tailwind-scrollbar"), require("@tailwindcss/forms")],
  variants: {
    scrollbar: ["rounded", "active", "disabled"],
  },
};
