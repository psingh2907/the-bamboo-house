# The Bamboo House — website

Family restaurant in Syamardanda, near Devendranagar, Panna (MP).
Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
```

Copy `.env.example` to `.env.local`. The site runs in **prototype mode** by
default: sample menu and illustrations are shown, a preview banner is visible
and search engines are blocked. Set `NEXT_PUBLIC_PROTOTYPE_MODE=false` to launch.

## Where things live

| What | File |
|------|------|
| Name, address, phone, hours, rating | `src/data/business.ts` |
| Menu (currently DEMO) | `src/data/menu.ts` |
| Gallery slots + shot list | `src/data/gallery.ts` |
| Experience story | `src/data/experience.ts` |
| Panna attractions | `src/data/attractions.ts` |
| Approved Google reviews | `src/data/reviews.ts` |
| Design tokens (from the interior) | `src/app/globals.css` |
| Animation system (`data-reveal`, `data-parallax`) | `src/components/motion/MotionProvider.tsx` |

**Adding a real photo:** put it in `public/images/…` and set `photo: { src, width, height }`
on that item. The illustration is replaced automatically.

## Docs

- `docs/owner-checklist.md` — what we need from the owner, photo shot list, launch steps
- `docs/strategy-review.md` — how this build follows / departs from the strategy blueprint
