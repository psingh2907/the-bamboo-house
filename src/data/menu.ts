import type { MenuCategory, MenuItem } from "./types";

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  MENU — DEMO. Every dish, description and price below is SAMPLE content.
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  Written to show the layout with a typical family-restaurant menu for the
 *  region. The owner's real menu, prices, cuisine and veg/non-veg policy
 *  (questions 4–6 in docs/owner-checklist.md) replace all of it.
 *  Prices are kept inside the reported ₹200–400 per-person range.
 */
export const menu: MenuCategory[] = [
  {
    id: "starters",
    title: "Starters",
    items: [
      {
        name: "Paneer Tikka",
        description: "Cottage cheese, peppers and onion, marinated in spiced curd and charred in the tandoor.",
        price: 260,
        veg: true,
        signature: true,
        visual: {
          art: { kind: "plate", hue: 22, seed: 3 },
          alt: "Paneer tikka on a plate",
          shot: "Top-down: paneer tikka on the house plate, charred edges visible",
        },
      },
      { name: "Hara Bhara Kebab", description: "Spinach, peas and potato patties, crisp outside.", price: 200, veg: true },
      { name: "Crispy Corn", description: "Tossed with onion, chilli and chaat masala.", price: 180, veg: true },
      { name: "Veg Manchurian (dry)", price: 190, veg: true },
      { name: "Masala Papad", price: 60, veg: true },
    ],
  },
  {
    id: "mains",
    title: "Main Course",
    items: [
      {
        name: "The Bamboo House Thali",
        description: "The whole table on one plate: two sabzis, dal, rice, rotis, salad, raita and a sweet.",
        price: 250,
        veg: true,
        signature: true,
        visual: {
          art: { kind: "plate", hue: 38, seed: 1, thali: true },
          alt: "A full thali with small bowls of curry, dal and raita",
          shot: "Top-down hero shot: full thali on a dark wood table (used large on the home page)",
        },
      },
      {
        name: "Paneer Butter Masala",
        description: "Soft paneer in a slow-cooked tomato and cashew gravy, finished with butter.",
        price: 240,
        veg: true,
        signature: true,
        visual: {
          art: { kind: "plate", hue: 18, seed: 5 },
          alt: "Paneer butter masala in a bowl",
          shot: "Three-quarter angle: paneer butter masala in its serving bowl, cream swirl on top",
        },
      },
      {
        name: "Dal Makhani",
        description: "Black lentils simmered low for hours with butter and cream.",
        price: 200,
        veg: true,
        signature: true,
        visual: {
          art: { kind: "plate", hue: 12, seed: 7 },
          alt: "Dal makhani in a bowl",
          shot: "Close-up: dal makhani with butter melting, rotis in soft focus behind",
        },
      },
      { name: "Kadai Paneer", price: 250, veg: true },
      { name: "Malai Kofta", price: 240, veg: true },
      { name: "Mix Veg", price: 180, veg: true },
      { name: "Dal Tadka", price: 150, veg: true },
    ],
  },
  {
    id: "breads",
    title: "Breads",
    items: [
      { name: "Tandoori Roti", price: 20, veg: true },
      { name: "Butter Naan", price: 45, veg: true },
      { name: "Garlic Naan", price: 60, veg: true },
      { name: "Lachha Paratha", price: 50, veg: true },
    ],
  },
  {
    id: "rice",
    title: "Rice & Biryani",
    items: [
      {
        name: "Veg Dum Biryani",
        description: "Long-grain rice and vegetables, sealed and slow-cooked with whole spices.",
        price: 200,
        veg: true,
        signature: true,
        visual: {
          art: { kind: "plate", hue: 42, seed: 9 },
          alt: "Vegetable biryani served with raita",
          shot: "Steam shot: biryani being opened or served, raita on the side",
        },
      },
      { name: "Veg Pulao", price: 160, veg: true },
      { name: "Jeera Rice", price: 120, veg: true },
    ],
  },
  {
    id: "chinese",
    title: "Chinese",
    items: [
      {
        name: "Chilli Paneer",
        description: "Wok-tossed with peppers, spring onion and a glossy chilli-soy glaze.",
        price: 220,
        veg: true,
        signature: true,
        visual: {
          art: { kind: "plate", hue: 4, seed: 11 },
          alt: "Chilli paneer with peppers",
          shot: "Action shot: chilli paneer tossed in the wok, or plated with spring onion",
        },
      },
      { name: "Veg Hakka Noodles", price: 160, veg: true },
      { name: "Veg Fried Rice", price: 160, veg: true },
    ],
  },
  {
    id: "drinks",
    title: "Drinks & Desserts",
    items: [
      { name: "Masala Chai", price: 30, veg: true },
      { name: "Masala Chaas", price: 50, veg: true },
      { name: "Sweet Lassi", price: 70, veg: true },
      { name: "Cold Coffee", price: 90, veg: true },
      { name: "Gulab Jamun (2 pcs)", price: 60, veg: true },
      { name: "Ice Cream", price: 70, veg: true },
    ],
  },
];

export const signatureDishes: (MenuItem & { category: string })[] = menu.flatMap((category) =>
  category.items.filter((item) => item.signature).map((item) => ({ ...item, category: category.title })),
);
