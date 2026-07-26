export type ThemeId =
  | "ironman"
  | "hulk"
  | "captain"
  | "moonknight"
  | "strange"
  | "thor"
  | "venom";

export interface ThemeDef {
  id: ThemeId;
  name: string;
  codename: string;
  vibe: string;
  /** Preview swatches shown in the Theme Hub cards */
  swatches: [string, string, string];
}

export const THEMES: ThemeDef[] = [
  {
    id: "ironman",
    name: "Mark VII",
    codename: "Iron Man",
    vibe: "JARVIS HUD — crimson & gold",
    swatches: ["#e11d2e", "#f5a623", "#0b0507"],
  },
  {
    id: "hulk",
    name: "Gamma",
    codename: "Hulk",
    vibe: "Gamma surge — emerald & lime",
    swatches: ["#22c55e", "#a3e635", "#04100a"],
  },
  {
    id: "captain",
    name: "Sentinel",
    codename: "Captain America",
    vibe: "First Avenger — navy, white, red",
    swatches: ["#4f8ef7", "#e11d2e", "#060d1f"],
  },
  {
    id: "moonknight",
    name: "Lunar",
    codename: "Moon Knight",
    vibe: "Moonlight — silver & charcoal",
    swatches: ["#e8eaf0", "#9aa3b5", "#101216"],
  },
  {
    id: "strange",
    name: "Mystic",
    codename: "Doctor Strange",
    vibe: "Sanctum — violet & ember",
    swatches: ["#a855f7", "#fb923c", "#0c0614"],
  },
  {
    id: "thor",
    name: "Stormbreaker",
    codename: "Thor",
    vibe: "Thunder — cyan & gold lightning",
    swatches: ["#22d3ee", "#facc15", "#040a1e"],
  },
  {
    id: "venom",
    name: "Symbiote",
    codename: "Venom",
    vibe: "Alien ink — black, white, electric blue",
    swatches: ["#38bdf8", "#f8fafc", "#000000"],
  },
];

export const DEFAULT_THEME: ThemeId = "ironman";
export const THEME_STORAGE_KEY = "senpai-theme";
