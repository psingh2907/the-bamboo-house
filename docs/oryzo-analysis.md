# Oryzo.ai — deep analysis, and what The Bamboo House can use

Checked 27 Sep 2026 (desktop). Oryzo is a joke product site by the studio
Lusion, built as a showcase of what they can do.

## How it is built

| Layer | What they use |
|---|---|
| Framework | **Astro**: one bundled script (`_astro/hoisted.js`, 297 KB) |
| Rendering | One **fixed full-screen WebGL canvas** behind the DOM (`#canvas` + `#ui`), custom engine (no global Three.js), plus 5 small canvases for widgets |
| 3D assets | 25 custom binary meshes (`.buf`, 2.8 MB): coaster, hand, table, wearables |
| Photoreal scenes | 2 **Gaussian splats** (`.sog`, 1.1 MB): table props and reflections |
| Materials | 80 WebP textures (5.2 MB): diffuse, height and base maps for cork, desk and cutting mat |
| UI motion | 4 **Rive** animations (`.riv`), a WASM decoder, 2 MP4s |
| Type | Halyard Display/Text (variable), Literata (serif), DM Mono (labels) |
| Weight | **10.6 MB, 143 requests**, and a page ~48,000 px tall (~62 screens) |
| Device split | `html.is-desktop`: separate desktop/mobile paths |

## Section by section

| # | Section | Mechanic |
|---|---|---|
| 1 | Hero | Photoreal top-down desk (cutting mat, pencils, knife) with the coaster; giant wordmark; sticky "ORYZO-1 MODEL" side tab; making-of video thumbnail; "scroll to explore" cue |
| 2 | Intro stage | Coaster held centre-stage on dark; copy reveals left and right of it |
| 3 | "Powered by AI\*" | 3D hand holds the coaster and **follows the cursor**; glowing rainbow border |
| 4 | "So portable, it's wearable" | Giant type with a **design-tool selection box** (dashed frame, handles) around the object |
| 5 | Wearable lookbook | **Pinned horizontal photo strip**; the centre photo sits in the dashed selection frame |
| 6 | Thermodynamic stability | **Thermal-camera false-colour** shader over a steaming mug; temperature legend |
| 7 | Roundness | Blueprint construction drawing; "37.9% more circular" |
| 8 | Smart flip encryption | **Type a message → the 3D coaster flips** to "encrypt" it |
| 9 | Grip-locked antislip | **Macro / microscope texture** with a live friction readout |
| 10 | Sustainability | Giant glowing word + big-number facts (25 yrs, 9 yrs) |
| 11 | Reviews | Tilted 3D coaster; star-rated list; "in use" image column |
| 12 | Spec slides | Full-bleed photo slides; **museum-style row** of ancient vessels with mono captions |
| 13 | Compare | **3-tier comparison table** (Oryzo / Pro / Pro Max) |
| 14 | Paper + footer | Joke research-paper block; **particle field** of coffee beans; studio pitch; newsletter |

Throughout: sticky section nav with active state (INTRO / FEATURES / PRODUCT /
CONTACT), a "scroll to continue" cue per section, and bracketed mono labels.

## Already adopted on our site

Centre-stage hero object (the thali) · blueprint guide lines that draw in ·
word-by-word scroll reveal · bracketed labels · big-number spec band.

## What to take next — mapped to The Bamboo House

### Tier 1: no owner assets needed, low performance cost
1. **The thali's journey** (the Oryzo signature move: one object carried
   through sections). As you scroll out of the hero, the katoris lift off the
   thali one by one and fly into the Signature Dishes cards. SVG + GSAP only.
2. **Lamp-light cursor** (from #3, the hand following the cursor). On dark
   sections a warm lamp glow follows the pointer across the bamboo, as if you
   carry a lantern. Pure CSS radial gradient; desktop only; off for reduced motion.
3. **"How many of you?" table setter** (from #8, where your input moves the
   object). A slider for 1–20 guests sets that many thalis around a table
   illustration, then a button sends "Table for 7 on Saturday" on WhatsApp. It
   turns spectacle into a conversion.
4. **Section progress nav + scroll cue** (sticky nav). A slim home-page
   indicator (Food · Place · Panna · Visit) with the active section, plus a
   "scroll" cue under the hero.

### Tier 2: needs the owner's photos
5. **Pinned horizontal gallery with a selection frame** (#4/#5): the gallery
   teaser scrolls sideways; the centre photo gets the dashed frame and handles.
6. **"Straight from the tandoor" heat lens** (#6): a circular thermal
   false-colour lens that follows the pointer over a hot dish photo. The joke
   lands (it *is* hot) and it's cheap: a CSS filter in a masked circle.
7. **Up close** (#9): scroll-driven zoom into a macro photo of the bamboo wall
   grain; shows the craft.
8. **"The pots overhead" museum row** (#12): the restaurant's clay pots,
   kulhads and brass shot like museum pieces with mono captions. This is the
   "Local / Bundelkhand" pillar from the brief.
9. **Kitchen reel in the hero corner** (#1): a 10–15 s muted loop (from their
   Instagram) that opens a video modal.

### Tier 3: needs owner data
10. **Thali comparison** (#13): Mini / Full / Maharaja thali as a 3-column
    table: what's included, serves, price. Genuinely useful for ordering.
11. **Reviews + guest photos** (#11): approved Google reviews alongside a
    column of guests' photos (with consent).

### Don't copy
- WebGL, meshes and Gaussian splats (10.6 MB). Our home page is ~0.5 MB and
  Lighthouse 91 on mobile; that matters more for a restaurant found on 4G.
- 62-screen length. Ours is ~12 screens; visitors want the menu and directions.
- Joke-product tone and the newsletter. Warm and local suits us better.
- Their layouts, copy, graphics and assets (per the strategy brief, §41).

## Suggested order

Tier 1 now (1 → 3 → 2 → 4), Tier 2 as photos arrive, Tier 3 with the owner's
menu. Each item is independent and can ship on its own branch.
