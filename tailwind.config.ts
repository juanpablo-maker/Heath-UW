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
        background: "#FFFFFF",
        backgroundSecondary: "#FAFAFA",
        card: "#FFFFFF",
        primary: "#0F172A",
        secondary: "#6B7280",
        border: "#E5E7EB",
        muted: "#F5F5F5",

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
        soft: "0 1px 3px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.04)",
        card: "0 1px 2px rgba(0, 0, 0, 0.05), 0 12px 40px rgba(0, 0, 0, 0.06)",
        "accent-glow":
          "0 0 0 1px rgba(249, 115, 22, 0.12), 0 2px 8px rgba(249, 115, 22, 0.15), 0 24px 48px rgba(15, 23, 42, 0.08)",
        "card-lift":
          "0 1px 2px rgba(0, 0, 0, 0.04), 0 20px 50px rgba(15, 23, 42, 0.1)",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(ellipse 90% 60% at 100% 0%, rgba(249, 115, 22, 0.09), transparent 55%), radial-gradient(ellipse 70% 50% at 0% 100%, rgba(124, 58, 237, 0.07), transparent 50%)",
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
