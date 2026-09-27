import type { Visual } from "./types";

export interface Attraction {
  name: string;
  kind: string;
  description: string;
  visual: Visual;
}

/**
 * Panna-region attractions promoted by Madhya Pradesh Tourism.
 *
 * Deliberately NO distances or drive times: the brief forbids proximity
 * claims until the owner confirms real routes. Add them here (e.g.
 * `driveTime: "45 min"`) only once verified.
 */
export const attractions: Attraction[] = [
  {
    name: "Panna Tiger Reserve",
    kind: "Wildlife",
    description: "One of central India's best-known tiger reserves — teak forest, plateaus and the Ken River gorge.",
    visual: {
      art: { kind: "landscape", hue: 95, seed: 1, feature: "forest" },
      alt: "Forest landscape of Panna Tiger Reserve",
      shot: "Licensed or own photo: Panna forest landscape",
    },
  },
  {
    name: "Ken River",
    kind: "River",
    description: "The river that shapes the region, cutting through rock pools and gorges on its way north.",
    visual: {
      art: { kind: "landscape", hue: 190, seed: 2, feature: "river" },
      alt: "The Ken River winding through rocky banks",
      shot: "Licensed or own photo: Ken River",
    },
  },
  {
    name: "Pandav Falls",
    kind: "Waterfall",
    description: "A waterfall dropping into a deep green pool, tied in local legend to the Pandavas.",
    visual: {
      art: { kind: "landscape", hue: 150, seed: 3, feature: "falls" },
      alt: "Pandav Falls pouring into a pool",
      shot: "Licensed or own photo: Pandav Falls",
    },
  },
  {
    name: "Raneh Falls",
    kind: "Canyon",
    description: "A canyon of pink, red and grey granite carved by the Ken — striking after the monsoon.",
    visual: {
      art: { kind: "landscape", hue: 14, seed: 4, feature: "canyon" },
      alt: "Raneh Falls canyon",
      shot: "Licensed or own photo: Raneh Falls canyon",
    },
  },
  {
    name: "Khajuraho",
    kind: "Heritage",
    description: "The UNESCO World Heritage temples, famous for some of the finest stone carving in India.",
    visual: {
      art: { kind: "landscape", hue: 32, seed: 5, feature: "temple" },
      alt: "Khajuraho temple spires at sunset",
      shot: "Licensed or own photo: Khajuraho temples",
    },
  },
];
