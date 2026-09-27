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
    titleHi: "स्टार्टर",
    items: [
      {
        name: "Paneer Tikka",
        nameHi: "पनीर टिक्का",
        description: "Cottage cheese, peppers and onion, marinated in spiced curd and charred in the tandoor.",
        descriptionHi: "मसालेदार दही में मैरिनेट किया पनीर, शिमला मिर्च और प्याज़, तंदूर में सिका।",
        price: 260,
        veg: true,
        signature: true,
        visual: {
          art: { kind: "plate", hue: 22, seed: 3 },
          alt: "Paneer tikka on a plate",
          altHi: "प्लेट में पनीर टिक्का",
          shot: "Top-down: paneer tikka on the house plate, charred edges visible",
        },
      },
      { name: "Hara Bhara Kebab", nameHi: "हरा भरा कबाब", description: "Spinach, peas and potato patties, crisp outside.", descriptionHi: "पालक, मटर और आलू की टिक्की, बाहर से कुरकुरी।", price: 200, veg: true },
      { name: "Crispy Corn", nameHi: "क्रिस्पी कॉर्न", description: "Tossed with onion, chilli and chaat masala.", descriptionHi: "प्याज़, मिर्च और चाट मसाले के साथ।", price: 180, veg: true },
      { name: "Veg Manchurian (dry)", nameHi: "वेज मंचूरियन (ड्राई)", price: 190, veg: true },
      { name: "Masala Papad", nameHi: "मसाला पापड़", price: 60, veg: true },
    ],
  },
  {
    id: "mains",
    title: "Main Course",
    titleHi: "मेन कोर्स",
    items: [
      {
        name: "The Bamboo House Thali",
        nameHi: "द बैम्बू हाउस थाली",
        description: "The whole table on one plate: two sabzis, dal, rice, rotis, salad, raita and a sweet.",
        descriptionHi: "एक थाली में पूरा खाना: दो सब्ज़ियाँ, दाल, चावल, रोटियाँ, सलाद, रायता और मीठा।",
        price: 250,
        veg: true,
        signature: true,
        visual: {
          art: { kind: "plate", hue: 38, seed: 1, thali: true },
          alt: "A full thali with small bowls of curry, dal and raita",
          altHi: "कटोरियों में सब्ज़ी, दाल और रायते वाली पूरी थाली",
          shot: "Top-down hero shot: full thali on a dark wood table (used large on the home page)",
        },
      },
      {
        name: "Paneer Butter Masala",
        nameHi: "पनीर बटर मसाला",
        description: "Soft paneer in a slow-cooked tomato and cashew gravy, finished with butter.",
        descriptionHi: "धीमी आँच पर पकी टमाटर-काजू की ग्रेवी में मुलायम पनीर, ऊपर से मक्खन।",
        price: 240,
        veg: true,
        signature: true,
        visual: {
          art: { kind: "plate", hue: 18, seed: 5 },
          alt: "Paneer butter masala in a bowl",
          altHi: "कटोरी में पनीर बटर मसाला",
          shot: "Three-quarter angle: paneer butter masala in its serving bowl, cream swirl on top",
        },
      },
      {
        name: "Dal Makhani",
        nameHi: "दाल मखनी",
        description: "Black lentils simmered low for hours with butter and cream.",
        descriptionHi: "मक्खन और क्रीम के साथ घंटों धीमी आँच पर पकी काली दाल।",
        price: 200,
        veg: true,
        signature: true,
        visual: {
          art: { kind: "plate", hue: 12, seed: 7 },
          alt: "Dal makhani in a bowl",
          altHi: "कटोरी में दाल मखनी",
          shot: "Close-up: dal makhani with butter melting, rotis in soft focus behind",
        },
      },
      { name: "Kadai Paneer", nameHi: "कड़ाही पनीर", price: 250, veg: true },
      { name: "Malai Kofta", nameHi: "मलाई कोफ़्ता", price: 240, veg: true },
      { name: "Mix Veg", nameHi: "मिक्स वेज", price: 180, veg: true },
      { name: "Dal Tadka", nameHi: "दाल तड़का", price: 150, veg: true },
    ],
  },
  {
    id: "breads",
    title: "Breads",
    titleHi: "रोटियाँ",
    items: [
      { name: "Tandoori Roti", nameHi: "तंदूरी रोटी", price: 20, veg: true },
      { name: "Butter Naan", nameHi: "बटर नान", price: 45, veg: true },
      { name: "Garlic Naan", nameHi: "गार्लिक नान", price: 60, veg: true },
      { name: "Lachha Paratha", nameHi: "लच्छा पराठा", price: 50, veg: true },
    ],
  },
  {
    id: "rice",
    title: "Rice & Biryani",
    titleHi: "चावल और बिरयानी",
    items: [
      {
        name: "Veg Dum Biryani",
        nameHi: "वेज दम बिरयानी",
        description: "Long-grain rice and vegetables, sealed and slow-cooked with whole spices.",
        descriptionHi: "लंबे दाने वाले चावल और सब्ज़ियाँ, खड़े मसालों के साथ दम पर पकी।",
        price: 200,
        veg: true,
        signature: true,
        visual: {
          art: { kind: "plate", hue: 42, seed: 9 },
          alt: "Vegetable biryani served with raita",
          altHi: "रायते के साथ वेज बिरयानी",
          shot: "Steam shot: biryani being opened or served, raita on the side",
        },
      },
      { name: "Veg Pulao", nameHi: "वेज पुलाव", price: 160, veg: true },
      { name: "Jeera Rice", nameHi: "जीरा राइस", price: 120, veg: true },
    ],
  },
  {
    id: "chinese",
    title: "Chinese",
    titleHi: "चाइनीज़",
    items: [
      {
        name: "Chilli Paneer",
        nameHi: "चिली पनीर",
        description: "Wok-tossed with peppers, spring onion and a glossy chilli-soy glaze.",
        descriptionHi: "शिमला मिर्च, हरे प्याज़ और चिली-सोया सॉस के साथ कड़ाही में टॉस किया।",
        price: 220,
        veg: true,
        signature: true,
        visual: {
          art: { kind: "plate", hue: 4, seed: 11 },
          alt: "Chilli paneer with peppers",
          altHi: "शिमला मिर्च के साथ चिली पनीर",
          shot: "Action shot: chilli paneer tossed in the wok, or plated with spring onion",
        },
      },
      { name: "Veg Hakka Noodles", nameHi: "वेज हक्का नूडल्स", price: 160, veg: true },
      { name: "Veg Fried Rice", nameHi: "वेज फ़्राइड राइस", price: 160, veg: true },
    ],
  },
  {
    id: "drinks",
    title: "Drinks & Desserts",
    titleHi: "पेय और मिठाई",
    items: [
      { name: "Masala Chai", nameHi: "मसाला चाय", price: 30, veg: true },
      { name: "Masala Chaas", nameHi: "मसाला छाछ", price: 50, veg: true },
      { name: "Sweet Lassi", nameHi: "मीठी लस्सी", price: 70, veg: true },
      { name: "Cold Coffee", nameHi: "कोल्ड कॉफ़ी", price: 90, veg: true },
      { name: "Gulab Jamun (2 pcs)", nameHi: "गुलाब जामुन (2 पीस)", price: 60, veg: true },
      { name: "Ice Cream", nameHi: "आइसक्रीम", price: 70, veg: true },
    ],
  },
];

export const signatureDishes: (MenuItem & { category: string; categoryHi?: string })[] = menu.flatMap((category) =>
  category.items
    .filter((item) => item.signature)
    .map((item) => ({ ...item, category: category.title, categoryHi: category.titleHi })),
);
