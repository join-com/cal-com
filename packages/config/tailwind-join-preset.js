/** @type {import('tailwindcss').Config} */

module.exports = {
  theme: {
    fontFamily: {
      cal: ["Inter", "sans-serif"],
      sans: ["Inter", "sans-serif"],
    },
    extend: {
      colors: {
        brand: {
          400: "#60A5FA",
          500: "#2563EB",
          DEFAULT: "var(--brand-color)",
        },
        neutral: {
          50: "#FAFAFA",
          75: "#F5F5F5",
          100: "#EFEFF0",
          200: "#E3E3E5",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "#18181B",
        },
        red: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
        orange: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#F7903B",
          500: "#E56A14",
          600: "#CC4D0A",
          700: "#B83E0B",
          800: "#9A3412",
          900: "#7C2D12",
        },
        green: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A5F0CD",
          300: "#6DE5B6",
          400: "#32CC94",
          500: "#0EA674",
          600: "#05875F",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        blue: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        purpole: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
        },
      },
      fontFamily: {
        cal: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      height: {
        "25px": "25px",
      },
    },
  },
};
