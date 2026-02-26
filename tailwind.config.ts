import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
        heading: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        /* ── Design system surfaces ── */
        surface: {
          pure: "hsl(var(--surface-pure))",
          soft: "hsl(var(--surface-soft))",
          muted: "hsl(var(--surface-muted))",
          dark: "hsl(var(--surface-dark))",
          "dark-alt": "hsl(var(--surface-dark-alt))",
          black: "hsl(var(--surface-black))",
        },
        /* ── Design system text ── */
        "text-dark": "hsl(var(--text-dark))",
        "text-body": "hsl(var(--text-body))",
        "text-subtle": "hsl(var(--text-subtle))",
        "text-label": "hsl(var(--text-label))",
        "text-caption": "hsl(var(--text-caption))",
        "text-light": "hsl(var(--text-light))",
        "text-hero": "hsl(var(--text-hero))",
        /* ── Design system borders ── */
        "border-light": "hsl(var(--border-light))",
        "border-lighter": "hsl(var(--border-lighter))",
        "border-subtle": "hsl(var(--border-subtle))",
        "border-divider": "hsl(var(--border-divider))",
        /* ── Pills / Interactive ── */
        pill: {
          border: "hsl(var(--pill-border))",
          "hover-bg": "hsl(var(--pill-hover-bg))",
          "hover-border": "hsl(var(--pill-hover-border))",
        },
        /* ── Manifesto ── */
        manifesto: {
          muted: "hsl(var(--manifesto-muted))",
          active: "hsl(var(--manifesto-active))",
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
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
