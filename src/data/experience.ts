import type { Visual } from "./types";

export interface Chapter {
  number: string;
  title: string;
  titleHi: string;
  body: string;
  bodyHi: string;
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
    titleHi: "जगह",
    body: "Walls of bamboo, tables of dark wood and clay pots hung overhead. It feels built by hand, because it was.",
    bodyHi: "बाँस की दीवारें, गहरे रंग की लकड़ी की मेज़ें और ऊपर लटकते मिट्टी के मटके। ये जगह हाथों से बनी लगती है — क्योंकि सच में बनी है।",
    visual: {
      art: { kind: "slats", seed: 2 },
      alt: "Bamboo-slat walls and dark wooden furniture inside The Bamboo House",
      altHi: "द बैम्बू हाउस के अंदर बाँस की दीवारें और लकड़ी का फ़र्नीचर",
      shot: "Wide interior, evening, all lights on: bamboo walls, tables and hanging pots in one frame",
    },
  },
  {
    number: "02",
    title: "The Food",
    titleHi: "खाना",
    body: "Cooked fresh and served hot, in portions made for passing around the table.",
    bodyHi: "ताज़ा पका, गरम परोसा, और इतना कि पूरी टेबल बाँटकर खाए।",
    visual: {
      art: { kind: "plate", hue: 30, seed: 4, thali: true },
      alt: "Dishes being served at the table",
      altHi: "टेबल पर परोसे जा रहे पकवान",
      shot: "Overhead: a full family table mid-meal, many dishes, hands reaching in",
    },
  },
  {
    number: "03",
    title: "The People",
    titleHi: "लोग",
    body: "A family kitchen feeding families — the kind of place where the staff remember your order.",
    bodyHi: "परिवारों को खिलाने वाली एक पारिवारिक रसोई — ऐसी जगह जहाँ स्टाफ़ को आपका ऑर्डर याद रहता है।",
    visual: {
      art: { kind: "pots", seed: 6 },
      alt: "The team at The Bamboo House",
      altHi: "द बैम्बू हाउस की टीम",
      shot: "Portrait: the owner and kitchen team in front of the bamboo wall (with consent)",
    },
  },
  {
    number: "04",
    title: "The Moments",
    titleHi: "पल",
    body: "Birthdays, road-trip stops, Sunday lunches. The warm light stays on until half past nine.",
    bodyHi: "जन्मदिन, सफ़र के बीच का पड़ाव, रविवार का खाना। गरम रोशनी रात साढ़े नौ बजे तक जलती रहती है।",
    visual: {
      art: { kind: "lamp", seed: 8 },
      alt: "Warm evening light over a table",
      altHi: "टेबल पर शाम की गरम रोशनी",
      shot: "Evening mood: warm lamps, a family celebrating (with consent), candid not posed",
    },
  },
];
