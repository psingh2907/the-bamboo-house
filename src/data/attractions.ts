import type { Visual } from "./types";

export interface Attraction {
  name: string;
  nameHi: string;
  kind: string;
  kindHi: string;
  description: string;
  descriptionHi: string;
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
    nameHi: "पन्ना टाइगर रिज़र्व",
    kind: "Wildlife",
    kindHi: "वन्यजीव",
    description: "One of central India's best-known tiger reserves — teak forest, plateaus and the Ken River gorge.",
    descriptionHi: "मध्य भारत के सबसे जाने-माने टाइगर रिज़र्व में से एक — सागौन के जंगल, पठार और केन नदी की घाटी।",
    visual: {
      art: { kind: "landscape", hue: 95, seed: 1, feature: "forest" },
      alt: "Forest landscape of Panna Tiger Reserve",
      altHi: "पन्ना टाइगर रिज़र्व का जंगल",
      shot: "Licensed or own photo: Panna forest landscape",
    },
  },
  {
    name: "Ken River",
    nameHi: "केन नदी",
    kind: "River",
    kindHi: "नदी",
    description: "The river that shapes the region, cutting through rock pools and gorges on its way north.",
    descriptionHi: "इस इलाक़े को आकार देने वाली नदी, जो उत्तर की ओर बहते हुए चट्टानी कुंडों और घाटियों से गुज़रती है।",
    visual: {
      art: { kind: "landscape", hue: 190, seed: 2, feature: "river" },
      alt: "The Ken River winding through rocky banks",
      altHi: "चट्टानी किनारों के बीच बहती केन नदी",
      shot: "Licensed or own photo: Ken River",
    },
  },
  {
    name: "Pandav Falls",
    nameHi: "पांडव जलप्रपात",
    kind: "Waterfall",
    kindHi: "झरना",
    description: "A waterfall dropping into a deep green pool, tied in local legend to the Pandavas.",
    descriptionHi: "गहरे हरे कुंड में गिरता झरना, जिसे स्थानीय कथाओं में पांडवों से जोड़ा जाता है।",
    visual: {
      art: { kind: "landscape", hue: 150, seed: 3, feature: "falls" },
      alt: "Pandav Falls pouring into a pool",
      altHi: "कुंड में गिरता पांडव जलप्रपात",
      shot: "Licensed or own photo: Pandav Falls",
    },
  },
  {
    name: "Raneh Falls",
    nameHi: "रनेह जलप्रपात",
    kind: "Canyon",
    kindHi: "घाटी",
    description: "A canyon of pink, red and grey granite carved by the Ken — striking after the monsoon.",
    descriptionHi: "केन नदी की तराशी गुलाबी, लाल और स्लेटी ग्रेनाइट की घाटी — बारिश के बाद देखने लायक़।",
    visual: {
      art: { kind: "landscape", hue: 14, seed: 4, feature: "canyon" },
      alt: "Raneh Falls canyon",
      altHi: "रनेह जलप्रपात की घाटी",
      shot: "Licensed or own photo: Raneh Falls canyon",
    },
  },
  {
    name: "Khajuraho",
    nameHi: "खजुराहो",
    kind: "Heritage",
    kindHi: "विरासत",
    description: "The UNESCO World Heritage temples, famous for some of the finest stone carving in India.",
    descriptionHi: "यूनेस्को विश्व धरोहर मंदिर, जो भारत की बेहतरीन पत्थर की नक़्क़ाशी के लिए मशहूर हैं।",
    visual: {
      art: { kind: "landscape", hue: 32, seed: 5, feature: "temple" },
      alt: "Khajuraho temple spires at sunset",
      altHi: "सूर्यास्त में खजुराहो के मंदिर",
      shot: "Licensed or own photo: Khajuraho temples",
    },
  },
];
