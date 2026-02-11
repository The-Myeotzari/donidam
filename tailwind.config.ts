import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
    
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",

        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",

        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",

        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",

        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",

        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",

        family: "var(--family)",
        "family-foreground": "var(--family-foreground)",

        success: "var(--success)",
        "success-foreground": "var(--success-foreground)",

        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",

        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",

        // (선택) category도 색으로 쓰고 싶으면
        "category-food": "var(--category-food)",
        "category-transport": "var(--category-transport)",
        "category-shopping": "var(--category-shopping)",
        "category-education": "var(--category-education)",
        "category-health": "var(--category-health)",
        "category-entertainment": "var(--category-entertainment)",
      },

      /**
       * ✅ 커스텀 gradient를 Tailwind "bg-*"로 등록
       * => className="bg-gradient-mint" 자동완성 됨
       */
      backgroundImage: {
        "gradient-mint":
          "linear-gradient(135deg, var(--mint-500) 0%, var(--mint-400) 100%)",
        "gradient-sky":
          "linear-gradient(135deg, var(--sky-500) 0%, var(--sky-400) 100%)",
        "gradient-warm":
          "linear-gradient(135deg, var(--warm-50) 0%, var(--warm-100) 100%)",
        "gradient-family":
          "linear-gradient(135deg, var(--family-500) 0%, var(--family-400) 100%)",
        "gradient-success":
          "linear-gradient(135deg, var(--success-500) 0%, var(--success-400) 100%)",
      },


      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)",
        float: "var(--shadow-float)",
      },


      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "toast-slide-up-down": {
          "0%": { opacity: "0", transform: "translateY(50px)" },
          "15%": { opacity: "1", transform: "translateY(0)" },
          "85%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(50px)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "bounce-soft": "bounce-soft 2s ease-in-out infinite",
        "slide-up": "slide-up 0.4s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "toast-slide": "toast-slide-up-down 3s ease-in-out forwards",
      },
    },
  },

  plugins: [],
};

export default config;
