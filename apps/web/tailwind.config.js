/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-dark": "var(--primary-dark)",
        secondary: "var(--secondary)",
        "text-secondary": "var(--text-secondary)",
        background: "var(--background)",
        "background-elevated": "var(--background-elevated)",
        "background-highlight": "var(--background-highlight)",
      },
    },
  },
  plugins: [],
};
