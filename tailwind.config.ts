import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        elevationLight:
          "0px 1px 1px 0px rgba(0,0,0,.05), 0px 1px 1px 0px #fff inset, 0px 0px 0px 1px hsla(0,0%,100%,.1) inset, 0px 0px 1px 0px rgba(0,0,0,.5)",
        "inner-shadow-dark-sm":
          "0px 1px 0px 0px hsla(0,0%,100%,.02) inset, 0px 0px 0px 1px hsla(0,0%,100%,.02) inset, 0px 0px 0px 1px rgba(0,0,0,.25)",
        inputDark:
          "inset 0px 1px 0px 0px hsla(0,0%,100%,.01), inset 0px 0px 0px 1px hsla(0,0%,100%,.04), 0px 0px 0px 1px rgba(0,0,0,.2)",
        "ds-border": "0 0 0 1px rgba(0, 0, 0, 0.08)",
        "ds-small": "var(--ds-shadow-small)",
        "ds-border-small": "var(--ds-shadow-border-small)",
        "ds-medium": "var(--ds-shadow-medium)",
        "ds-border-medium": "var(--ds-shadow-border-medium)",
        "ds-large": "var(--ds-shadow-large)",
        "ds-border-large": "var(--ds-shadow-border-large)",
        "ds-tooltip": "var(--ds-shadow-tooltip)",
        "ds-menu": "var(--ds-shadow-menu)",
        "ds-modal": "var(--ds-shadow-modal)",
        "ds-fullscreen": "var(--ds-shadow-fullscreen)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
