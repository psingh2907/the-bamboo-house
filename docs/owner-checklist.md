# The Bamboo House — owner checklist

Everything the site needs from the owner before launch, in priority order.
Data lives in `src/data/`; each value there is labelled VERIFIED / REPORTED /
UNCONFIRMED / DEMO.

## 1. Do this week (biggest impact)

- [ ] **Claim the Google Business Profile.** As of 27 Sep 2026 the listing shows
      "Claim this business" — nobody controls it. Claiming unlocks replies to
      reviews, photos, posts, hours and the website field.
- [ ] Once claimed, fix the listing:
  - [ ] Name: "The bamboo house" → **"The Bamboo House"** (match the website exactly).
  - [ ] Hindi name: "थे बम्बू हाउस" is a wrong transliteration → **"द बैम्बू हाउस"**.
  - [ ] Add the website URL (after launch).
  - [ ] Confirm hours for every day (only Sunday 11 am–9:30 pm was visible).
  - [ ] Add menu, attributes (veg/non-veg, parking, family-friendly, seating).
- [ ] Confirm the **WhatsApp number** (the site assumes 079876 29286).
- [ ] **Is it a resort?** The Instagram handle is `@the_bamboohouse_resort`
      ("Bamboo House Official"). If there are rooms or stays, the site's
      positioning, pages and schema (`LodgingBusiness`) should change — ask first.
- [ ] Facebook page and any other profiles (YouTube, Zomato, Swiggy, Justdial,
      Tripadvisor) → `business.socials`. Instagram is added.

## 2. Content questions (from the strategy, §46)

| # | Question | Where it goes |
|---|----------|---------------|
| 1–3 | Why started? Why "The Bamboo House"? Biggest USP? | About page story (`src/app/about/page.tsx`) |
| 4 | Top 5 dishes | `signature: true` in `src/data/menu.ts` |
| 5–6 | Cuisine; veg / non-veg / both | Menu + schema `servesCuisine` |
| — | **Full menu with prices** | `src/data/menu.ts` (currently all DEMO) |
| 7–9 | Seating capacity, outdoor seating, parking | Facts + FAQ on /contact |
| 10–13 | Reservations, parties, takeaway, delivery | FAQ; decides if group form stays |
| 14 | WhatsApp for enquiries? | Section 1 above |
| — | Instagram / Facebook links | `business.socials` |
| — | Logo files | Replaces the temporary bamboo mark |
| — | Real drive times to Panna Tiger Reserve, Khajuraho, etc. | `src/data/attractions.ts` (only once verified) |
| — | 3–6 Google reviews the owner is happy to feature (copied word for word) | `src/data/reviews.ts` |

## 3. Hindi version (/hi)

- [ ] **Read every Hindi page** (/hi, /hi/menu, /hi/contact) — the Hindi is a
      draft written for the site, not machine-translated, but it needs a native
      speaker's eye. A little Bundeli warmth is welcome. Text lives in
      `src/i18n/dictionaries.ts` and the `…Hi` fields in `src/data/`.
- [ ] Confirm the Hindi spelling of **Syamardanda** (the site uses
      "श्यामरदंडा") — `business.addressHi` in `src/data/business.ts`.
- [ ] Confirm the Hindi dish names once the real menu arrives.

## 4. Photography — the critical path

The design is built around photography; every image slot currently shows an
illustration labelled "photo to come". One evening shoot (golden hour → lights
on) covers everything. Shoot at ≥ 2000px, horizontal and vertical of each.

**Hero (most important):** top-down full thali on the dark wood table, shot
straight down, plate filling the frame. It replaces the illustrated plate in
the centre of the home page.

**Food (top-down or three-quarter, dark wood surface):** paneer tikka, paneer
butter masala, dal makhani, biryani with steam, chilli paneer, masala chai.

**Space:** wide interior from the entrance with all lights on · bamboo wall
detail · hanging clay pots · bamboo chair + table grain · exterior at dusk.

**People & moments (with written consent):** owner + kitchen team in front of
the bamboo wall · chef plating · a family mid-meal · a birthday.

Each slot's exact brief is in the `shot` field in `src/data/*.ts` (hover the
"photo to come" label on the preview to see it).

## 5. Launch

1. Set `NEXT_PUBLIC_PROTOTYPE_MODE=false`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID`.
2. Deploy, connect domain.
3. Google Search Console: verify domain, submit `/sitemap.xml`.
4. GA4: mark `call_click`, `whatsapp_click`, `directions_click` as key events.
5. Add the website URL to the Google Business Profile.
