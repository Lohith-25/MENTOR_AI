/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-blue": "#3B82F6",
        "brand-purple": "#A855F7",
        "brand-green": "#10B981",
        "brand-yellow": "#FBBF24",
        "brand-red": "#EF4444",
      },
      backgroundImage: {
        "gradient-dark": "linear-gradient(to bottom right, #0f172a, #4c1d95, #0f172a)",
        "gradient-card": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(59, 130, 246, 0.5)",
        "glow-green": "0 0 20px rgba(16, 185, 129, 0.5)",
        "glow-yellow": "0 0 20px rgba(251, 191, 36, 0.5)",
        "glow-red": "0 0 20px rgba(239, 68, 68, 0.5)",
      },
      animation: {
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "slide-up": "slide-up 0.6s ease-out",
        "counter-up": "counter-up 2s ease-out",
        "flip": "flip 0.6s ease-out",
        "confetti": "confetti 3s ease-out forwards",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: 1, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" },
          "50%": { opacity: 0.8, boxShadow: "0 0 40px rgba(59, 130, 246, 0.8)" },
        },
        "slide-up": {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "counter-up": {
          "0%": { opacity: 0, transform: "scale(0.8)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        "flip": {
          "0%": { transform: "rotateY(0deg)" },
          "50%": { transform: "rotateY(90deg)" },
          "100%": { transform: "rotateY(0deg)" },
        },
        "confetti": {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: 1 },
          "100%": { transform: "translateY(100vh) rotate(360deg)", opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}
