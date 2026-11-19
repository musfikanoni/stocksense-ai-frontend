import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
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
      animation: {
        "fade-up": "fadeUp .4s cubic-bezier(.16, 1, .3, 1) both",
        "fade-in": "fadeIn .25s cubic-bezier(.16, 1, .3, 1) both",
        "scale-in": "scaleIn .25s cubic-bezier(.16, 1, .3, 1) both",
        marquee: "marquee 45s linear infinite",
        float: "float 6s ease-in-out infinite",
        grow: "grow .8s cubic-bezier(.16, 1, .3, 1) both",
        ring: "ring 1s cubic-bezier(.16, 1, .3, 1) both",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
      },
      fontFamily: { sans: ["var(--font-sora)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
