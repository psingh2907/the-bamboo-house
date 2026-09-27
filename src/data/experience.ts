import type { Visual } from "./types";

export interface Chapter {
  number: string;
  title: string;
  body: string;
  visual: Visual;
}

/**
 * The four-part "experience" story (brief §14).
 * "The Space" is based on the listing photo (bamboo walls, dark wood, clay
 * pots). The rest is DEMO copy — rewrite with the owner's own story.
 */
export const chapters: Chapter[] = [
  {
    number: "01",
    title: "The Space",
    body: "Walls of bamboo, tables of dark wood and clay pots hung overhead. It feels built by hand, because it was.",
    visual: {
      art: { kind: "slats", seed: 2 },
      alt: "Bamboo-slat walls and dark wooden furniture inside The Bamboo House",
      shot: "Wide interior, evening, all lights on: bamboo walls, tables and hanging pots in one frame",
    },
  },
  {
    number: "02",
    title: "The Food",
    body: "Cooked fresh and served hot, in portions made for passing around the table.",
    visual: {
      art: { kind: "plate", hue: 30, seed: 4, thali: true },
      alt: "Dishes being served at the table",
      shot: "Overhead: a full family table mid-meal, many dishes, hands reaching in",
    },
  },
  {
    number: "03",
    title: "The People",
    body: "A family kitchen feeding families — the kind of place where the staff remember your order.",
    visual: {
      art: { kind: "pots", seed: 6 },
      alt: "The team at The Bamboo House",
      shot: "Portrait: the owner and kitchen team in front of the bamboo wall (with consent)",
    },
  },
  {
    number: "04",
    title: "The Moments",
    body: "Birthdays, road-trip stops, Sunday lunches. The warm light stays on until half past nine.",
    visual: {
      art: { kind: "lamp", seed: 8 },
      alt: "Warm evening light over a table",
      shot: "Evening mood: warm lamps, a family celebrating (with consent), candid not posed",
    },
  },
];
