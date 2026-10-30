import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Theme taken from the Figma design: black base, gold accent
        ink: "#000000",
        panel: "#14120c",
        line: "#2a2518",
        gold: { DEFAULT: "#f5c84b", dark: "#c99a1e" },
        mute: "#a39b85",
        up: "#3ddc84",
        down: "#ff4d5e",
      },
      fontFamily: { sans: ["var(--font-sora)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
