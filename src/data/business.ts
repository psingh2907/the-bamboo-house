/**
 * ─────────────────────────────────────────────────────────────────────────
 *  BUSINESS INFORMATION — the single place to edit restaurant details.
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  Values written as "{{TOKEN}}" are unknown; the site hides them.
 *
 *  Source: Google Maps listing "The bamboo house" (place CID
 *  0x8bdbf6ab3cdad9f3), checked 27 Sep 2026, plus the client strategy brief.
 *  The listing is UNCLAIMED and has no website — claiming it is step one.
 *  See docs/owner-checklist.md.
 */
export const business = {
  name: "The Bamboo House",

  // VERIFIED — Google Maps category.
  category: "Family restaurant",

  // DEMO — suggested line, not an existing slogan.
  tagline: "Come hungry. Leave with a memory.",

  // DEMO — suggested description. The bamboo interior is verified from the
  // listing photo; everything else here needs the owner's words.
  description:
    "A family restaurant wrapped in bamboo, in Syamardanda near Devendranagar, Panna. Good food, warm light and room for everyone at the table.",

  address: {
    area: "Syamardanda", // VERIFIED — Google Maps
    locality: "Devendranagar", // REPORTED — client brief
    district: "Panna", // REPORTED — client brief
    state: "Madhya Pradesh", // VERIFIED
    postalCode: "488333", // VERIFIED — Google Maps
    country: "India",
    plusCode: "G9M5+GM2", // VERIFIED — Google Maps plus code
  },

  // VERIFIED — Google Maps pin.
  geo: { lat: 24.533753, lng: 80.3591447 },

  // VERIFIED — Google Maps place CID (decimal form of 0x8bdbf6ab3cdad9f3).
  googleCid: "10077919806492432883",

  contact: {
    phone: "+91 79876 29286", // VERIFIED — Google Maps shows 079876 29286
    // UNCONFIRMED — assumed to be the same number. Ask the owner (Q14).
    whatsapp: "+91 79876 29286",
    email: "{{EMAIL}}",
  },

  // REPORTED — Google Maps showed Sunday 11 am–9:30 pm on 27 Sep 2026; the
  // brief lists 11:00–21:30 as typical. Confirm every day with the owner.
  hours: {
    opens: "11:00",
    closes: "21:30",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },

  // REPORTED — "₹200–₹400" per person, per the Google listing (via brief).
  priceRange: { min: 200, max: 400 },

  // REPORTED — 4.7 seen on Google Maps (27 Sep 2026); count of 49 from the
  // brief. Update both when the listing changes.
  rating: { value: 4.7, count: 49, source: "Google" },

  socials: {
    instagram: "{{INSTAGRAM_URL}}",
    facebook: "{{FACEBOOK_URL}}",
  },
} as const;

export type Business = typeof business;
