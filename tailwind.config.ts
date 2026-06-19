import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#06080F",
        gold: "#C6A258",
        goldHover: "#DcC489",
        cream: "#ECE7DB",
        creamBright: "#F4EFE4",
        muted: "#9b988e",
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "serif"],
        sans: ["'Hanken Grotesk'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
