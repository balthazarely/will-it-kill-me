/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Space Grotesk'", "sans-serif"],
      },
      colors: {
        primary: {
          400: "#a78bfa",
          500: "#a78bfa",
          600: "#7c3aed",
          700: "#6d28d9",
        },
      },
      keyframes: {
        scanLine: {
          "0%, 100%": { top: "10%", opacity: "1" },
          "50%": { top: "85%", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "scan-line": "scanLine 1.8s ease-in-out infinite",
        shimmer: "shimmer 1.5s linear infinite",
        "fade-up": "fadeUp 0.4s ease both",
      },
    },
  },
};
