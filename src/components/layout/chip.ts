/**
 * Floating header "chips" (after JP Pizzeria's mobile header): small solid
 * tiles instead of a full-width bar, readable on dark and light sections.
 *
 * Each tone sets its own background and text colour (never layered on top of
 * another tone, which made colours clash), and there is no display value
 * here: each chip sets its own ("inline-flex" or "hidden xl:flex"), so a
 * responsive "hidden" is never overridden.
 */
const base =
  "pointer-events-auto h-12 items-center rounded-2xl ring-1 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md transition-[background-color,transform] duration-300 active:scale-95";

const tones = {
  dark: "bg-smoke/90 text-cream ring-cream/15 hover:bg-smoke",
  light: "bg-cream text-smoke ring-ink/10 hover:bg-bamboo-light",
  accent: "bg-bamboo text-smoke ring-bamboo/40 hover:bg-bamboo-light",
} as const;

export const chip = (tone: keyof typeof tones = "dark") => `${base} ${tones[tone]}`;
