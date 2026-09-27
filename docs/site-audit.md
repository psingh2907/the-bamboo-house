# Site audit — 27 Sep 2026

Production build (`pnpm build && pnpm start`), Lighthouse 12, mobile emulation
(Moto G class device, throttled 4G), plus manual code review.

## Scores

| Page | Performance | Accessibility | Best practices | SEO |
|------|-------------|---------------|----------------|-----|
| `/`     | 76 | 95  | 100 | 66* |
| `/menu` | 81 | 100 | —   | —   |

\* SEO is low only because prototype mode sets `noindex` on purpose.

| Metric (home) | Value | Target |
|---|---|---|
| First Contentful Paint | 2.1 s | < 1.8 s |
| Largest Contentful Paint | **5.6 s** | < 2.5 s |
| Total Blocking Time | 90 ms | < 200 ms ✓ |
| Cumulative Layout Shift | 0.001 | < 0.1 ✓ |

## Weight

| | Size |
|---|---|
| Home HTML | **690 KB (138 KB gzip)** — 347 KB inline SVG illustrations + 289 KB React payload repeating them |
| DOM | 3,761 elements (mostly illustration shapes) |
| JavaScript | 254 KB gzip: ~155 KB React/Next runtime, 44 KB GSAP + ScrollTrigger, ~15 KB our code |
| Fonts | 295 KB, all preloaded: Fraunces normal 149 KB + italic 121 KB (opsz + SOFT axes), Manrope 25 KB |
| CSS | 12.6 KB, one file ✓ |

## Findings

### P0 — fix before showing the owner on a phone

1. **The loader is the LCP element.** Its giant counter is the largest text on
   screen and keeps changing until the reveal, so LCP lands at the end of the
   intro (5.6 s home, 4.8 s menu). Fix: draw the counter on `<canvas>` (not an
   LCP candidate) so LCP becomes the hero headline painted underneath; add
   "tap to skip"; trim MIN to ~1.0 s.
2. **Illustrations are inlined into every page twice** (HTML + React payload).
   Fix: prerender each illustration once as a static `.svg` file
   (`/art/<id>.svg`, generated at build) and load it with a lazy `<img>`.
   Expected: home HTML ~690 KB → <100 KB, DOM −3,000 nodes, and it behaves like
   the real photos that will replace it.
3. **Scroll reveals use `visibility: hidden`** (GSAP `autoAlpha`). Unrevealed
   sections are invisible to screen readers and in-page search, which is also
   why Lighthouse reports a heading-order error. Fix: animate opacity only.
4. **Manifesto dim words fail contrast** (1.56:1 at 16 % opacity). Fix: animate
   colour from a dim tone that still passes 3:1 for large text (#75685a) to cream.

### P1 — before launch

5. **Fonts**: drop the `SOFT` axis, keep one optical size, preload only the
   regular face. Saves ~100–150 KB on the critical path.
6. **No security headers.** Add CSP (allowing Google Maps frame + GA),
   `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
   `frame-ancestors 'none'` in `next.config.ts`.
7. **No privacy policy page.** Needed once GA4 is on (India DPDP Act 2023); the
   brief's footer also lists Privacy / Terms.
8. **Nothing is committed to git yet.** Commit a baseline before further work.

### Verified OK

- CLS 0.001, TBT 90 ms, best practices 100.
- All pages static (prerendered), sitemap/robots/OG image/JSON-LD valid.
- `sharp` loads through Next (image optimisation works for real photos).
- Loader: skipped for reduced motion, repeat pages, background tabs; 6 s failsafe.
- Game: taps, wrong-animal penalty, misses, pause off-screen, mobile layout.

## Opportunities

### Game & loader
- **Share your score** (Web Share API → WhatsApp): "I spotted 14 tigers at The
  Bamboo House, Panna — beat that?" + link. Free word of mouth; track `game_share`.
- **Rare golden tiger** (+3) and a streak multiplier — more replay value.
- **Haptic tick** on a catch (`navigator.vibrate`, Android).
- **Reward hook** (owner decision): score ≥ N shows a daily code for a free chai —
  turns the toy into a reason to visit. Daily code stops screenshot reuse.
- Loader: "tap to skip"; seasonal/festival label lines.

### Growth (Phase 2)
- **Review QR**: `/review` redirect to the Google review form (needs the place ID,
  available after claiming the listing) + a printable table tent.
- **Table menu QR** → `/menu` (already fast and mobile-first).
- **Hindi** (`hi-IN`) for menu and key pages — the local audience searches in Hindi.
- **Offers / announcements** strip driven from a data file.
- **Journal** travel guides (after keyword validation, per the strategy).
- Schema `servesCuisine` + `hasMenu` once the real menu is in.

## How to run the project from here

1. **Engineering pass (P0 + P1)** — no owner input needed.
2. **Owner pack** — claim Google listing, photos, menu, reviews, WhatsApp, logo
   (see `owner-checklist.md`). Set a content deadline; the site stays in
   prototype mode until then.
3. **Preview deploy** (Netlify branch deploy) so the owner reviews on their own
   phone; collect feedback in one round.
4. **Launch** — prototype mode off, domain, Search Console, GA4 key events.
5. **Monthly** — Search Console queries, GA4 calls/directions/WhatsApp, new
   reviews into `reviews.ts`, menu updates.

## Results after the fix pass (branch `audit-fixes`)

Same setup (production build, Lighthouse 12, mobile, throttled 4G).

| | Before | After |
|---|---|---|
| Performance — home / menu | 76 / 81 | **91 / 91** |
| Accessibility — home / menu | 95 / 100 | 97+ / 100 |
| LCP (home) | 5.6 s (loader counter) | **3.5 s** (real content) |
| FCP (home) | 2.1 s | **1.5 s** |
| TBT (home) | 90 ms | 60 ms |
| Home HTML | 675 KB (134 KB gzip) | **170 KB (28 KB gzip)** |
| DOM (home) | 3,761 | **947** |
| Fonts preloaded | 295 KB (3 files) | **59 KB (2 files)**; italic loads after paint |
| Security headers | none | CSP, HSTS, nosniff, frame-deny, referrer, permissions |

What changed:
1. Loader counter drawn on `<canvas>`; tap / click / Escape skips; MIN 1.0 s.
2. Illustrations prerendered to `public/art/*.svg` by `scripts/build-art.tsx`
   (runs before `dev` and `build`), loaded lazily via `next/image`.
3. Reveals animate opacity only (content stays in the accessibility tree).
4. Manifesto dims by colour (#807262, 4:1); faded chapter numbers 3.3:1.
5. Fraunces: weight axis only; italic is a separate, non-preloaded face.
6. Security headers in `next.config.ts` (CSP allows Google Maps + GA4).
7. `/privacy` page (draft for owner approval), linked in footer + sitemap.
8. Baseline committed to `main`; fixes on `audit-fixes`.

Remaining LCP (3.5 s) is the display font arriving on a throttled 4G
profile. Next lever if needed: `font-display: optional` for Fraunces, or
self-hosting a subset (digits + Latin) of the display face.

Still open: GA4 should load only after consent once it is switched on
(DPDP Act); a Terms page if the owner wants one.
