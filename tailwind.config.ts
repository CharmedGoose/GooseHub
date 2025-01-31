import { type Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx,js,jsx}",
  ],
  // deno-lint-ignore no-explicit-any
  plugins: [daisyui as any],

  daisyui: {
    logs: false,
    themes: [
      {
        goosehub: {
          "primary": "#fb923c",
          "secondary": "#18181b",
          "secondary-content": "#3f3f46",
          "accent": "#e5e7eb",
          "neutral": "#09090b",
          "base-100": "#27272a",
          "base-content": "#ffffff",
          "info": "#3f3f46",
          "success": "#00ff00",
          "warning": "#facc15",
          "error": "#ff0000",
        },
      },
    ],
  },
} satisfies Config;
