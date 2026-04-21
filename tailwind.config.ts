import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070B17",
        backgroundSecondary: "#0D1224",
        card: "#131930",
        primary: "#F5F7FF",
        secondary: "#A7B0C9",
        border: "#26304E",
        muted: "#1A2342",

        // Semantic accents (strict)
        accent: "#F97316", // CTA / action
        intelligence: "#7C3AED", // AI
        accentSecondary: "#7C3AED", // legacy alias used by existing components
        positive: "#10B981",
        risk: "#EF4444",
      },
      fontFamily: {
        sans: ["var(--font-general-sans)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 24px rgba(3, 7, 18, 0.34)",
        card: "0 20px 48px rgba(4, 9, 25, 0.46)",
        "accent-glow":
          "0 0 0 1px rgba(249, 115, 22, 0.12), 0 2px 8px rgba(249, 115, 22, 0.15), 0 24px 48px rgba(15, 23, 42, 0.08)",
        "card-lift":
          "0 12px 30px rgba(4, 9, 25, 0.4), 0 28px 64px rgba(4, 9, 25, 0.56)",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(ellipse 95% 60% at 95% 0%, rgba(249, 115, 22, 0.2), transparent 58%), radial-gradient(ellipse 75% 55% at 0% 100%, rgba(124, 58, 237, 0.22), transparent 52%)",
      },
      keyframes: {
        "landing-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "landing-pulse": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.9" },
        },
      },
      animation: {
        "landing-float": "landing-float 5s ease-in-out infinite",
        "landing-pulse": "landing-pulse 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
