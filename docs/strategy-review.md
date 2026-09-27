# Review of "Website Strategy & Product Blueprint v1.0"

What the build keeps, and where it deliberately departs from the blueprint.

## Kept as written

- Website as a **conversion layer** between discovery and a physical visit.
- CALL · WHATSAPP · DIRECTIONS as the key conversions (all tracked, see `src/lib/analytics.ts`).
- Food + Place + Experience pillars; "More than a meal" as the brand idea.
- **No proximity claims** — attractions have no distances until verified.
- **No fabricated reviews** — the rating is shown; quotes wait for owner approval.
- Mobile-first, sticky Call · Menu · Directions bar, reduced-motion support,
  semantic HTML, schema, sitemap/robots, OG images.
- Oryzo borrowed for *interaction philosophy* only: a single hero object held
  centre-stage (a top-down thali), blueprint guide lines drawing in,
  word-by-word scroll reveal, bracketed spec labels, big-number "spec sheet".

## Changed, and why

| Blueprint | Built | Reason |
|-----------|-------|--------|
| Not in the doc | **Claim the Google listing first** | It is unclaimed with no website. The single biggest local-SEO lever. |
| Sanity CMS in MVP | Typed data files in `src/data/`, CMS-shaped | A rural family restaurant owner may never log in (Q19 unanswered). Files map 1:1 to Sanity documents if needed in Phase 2. |
| Vercel | `netlify.toml` included (Vercel also works as-is) | Matches the other client sites' deployment. Pick one. |
| `/experience`, `/reviews` pages | Sections on Home + About | With no photos or approved reviews yet, separate pages would be thin content. Add them when there is real content. |
| `Review` / `AggregateRating` schema | Omitted | Google ignores self-serving review markup for a business's own site. |
| Oryzo's WebGL | SVG + GSAP only | Keeps LCP fast on Indian mobile networks; every page is fully static. |
| Contact form + server | Group enquiry form that composes a **WhatsApp** message | No backend, no spam, no stored personal data. |
| Keyword list centred on "Panna" | Add **Devendranagar** terms | The restaurant is in Syamardanda near Devendranagar; "restaurant in Devendranagar" is likely far more winnable than "restaurant in Panna". Validate both. |

## Gaps to add to the blueprint

1. **Hindi.** Local families search and read in Hindi. A `hi-IN` version (or at
   least Hindi headings and menu names) should be a Phase 2 item.
2. **Photography is the critical path.** Budget one professional evening shoot;
   the shot list is in `docs/owner-checklist.md`.
3. **Listing hygiene.** Name casing ("The bamboo house") and a wrong Hindi
   transliteration ("थे बम्बू हाउस") on Google — fix for NAP consistency.
4. **Review flywheel.** Put a QR code on tables and bills linking to the Google
   review form; 49 reviews is thin for a 4.7.
