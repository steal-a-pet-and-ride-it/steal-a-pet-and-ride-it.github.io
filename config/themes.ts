import type { ThemeConfig, ThemePresetName } from "./types";

export const themes: Record<string, ThemeConfig> = {
  "obsidian-red": {
    name: "obsidian-red" as ThemePresetName,
    label: "Site Theme",
    description: "Selected site theme",
    tokens: {
  "background": "31 29% 14%",
  "foreground": "0 0% 99%",
  "card": "31 29% 19%",
  "card-foreground": "0 0% 99%",
  "primary": "106 31% 37%",
  "primary-foreground": "0 0% 100%",
  "secondary": "31 29% 25%",
  "muted": "31 29% 22%",
  "muted-foreground": "0 0% 99%",
  "border": "31 29% 30%",
  "radius": ".75rem",
  "card-shadow": "0 22px 70px hsl(106 31% 37% / .16)",
  "hero-gradient": "radial-gradient(circle at 78% 14%, hsl(106 31% 37% / .2), transparent 36%)",
  "background-pattern": "radial-gradient(hsl(106 31% 37% / .05) 1px, transparent 1px)",
  "font-sans": "\"Source Sans 3\", ui-sans-serif, system-ui, sans-serif",
  "font-heading": "\"IBM Plex Mono\", ui-monospace, SFMono-Regular, Menlo, monospace",
  "heading-weight": "600",
  "heading-letter-spacing": "0em"
},
  },
};
