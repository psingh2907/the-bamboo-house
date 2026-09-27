import type { Visual } from "./types";

export const galleryCategories = ["Food", "The Space", "People", "Moments"] as const;
export type GalleryCategory = (typeof galleryCategories)[number];

export interface GalleryItem extends Visual {
  id: string;
  category: GalleryCategory;
  /** Spans two columns in the desktop grid. */
  wide?: boolean;
}

/**
 * Gallery slots. Each `shot` is the brief for the photographer; drop the
 * finished image into /public/images/gallery and set `photo`.
 */
export const gallery: GalleryItem[] = [
  { id: "interior-wide", category: "The Space", wide: true, art: { kind: "slats", seed: 11 }, alt: "The bamboo-walled dining room", shot: "Wide interior from the entrance, evening" },
  { id: "thali", category: "Food", art: { kind: "plate", hue: 38, seed: 21, thali: true }, alt: "A full thali from above", shot: "Top-down thali on dark wood" },
  { id: "pots", category: "The Space", art: { kind: "pots", seed: 12 }, alt: "Clay pots hanging from the ceiling", shot: "Detail: the hanging clay pots against bamboo" },
  { id: "paneer", category: "Food", art: { kind: "plate", hue: 18, seed: 22 }, alt: "Paneer butter masala", shot: "Paneer butter masala, three-quarter angle" },
  { id: "evening", category: "Moments", wide: true, art: { kind: "lamp", seed: 13 }, alt: "Warm lights at dusk", shot: "Exterior at dusk with lights on" },
  { id: "team", category: "People", art: { kind: "pots", seed: 14 }, alt: "The kitchen team", shot: "Team portrait in front of the bamboo wall" },
  { id: "biryani", category: "Food", art: { kind: "plate", hue: 42, seed: 23 }, alt: "Vegetable biryani", shot: "Biryani with steam" },
  { id: "tables", category: "The Space", art: { kind: "slats", seed: 15 }, alt: "Wooden tables and bamboo chairs", shot: "Detail: bamboo chair and dark-wood table grain" },
  { id: "family", category: "Moments", art: { kind: "lamp", seed: 16 }, alt: "A family meal", shot: "Candid family meal (with consent)" },
  { id: "chef", category: "People", art: { kind: "plate", hue: 4, seed: 24 }, alt: "The chef plating a dish", shot: "Chef plating, hands and flame" },
  { id: "chai", category: "Food", art: { kind: "plate", hue: 28, seed: 25 }, alt: "Masala chai", shot: "Masala chai in clay kulhad, close-up" },
  { id: "birthday", category: "Moments", art: { kind: "lamp", seed: 17 }, alt: "A birthday celebration", shot: "Birthday cake moment (with consent)" },
];
