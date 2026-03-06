import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // THIS LINE IS REQUIRED

  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {},
  },

  plugins: [],
};

export default config;