import { signatureDishes } from "@/data/menu";
import { Button } from "../ui/Button";
import { Media } from "../ui/Media";
import { SectionHeading } from "../ui/SectionHeading";

/** 4–6 visually strong dishes rather than the whole menu (brief §13). */
export function SignatureDishes() {
  return (
    <section id="food" aria-labelledby="dishes-title" className="lamp scroll-mt-20 overflow-hidden bg-smoke py-24 text-cream sm:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            tone="dark"
            eyebrow="03 — The food"
            title={
              <span id="dishes-title">
                From our <em className="text-bamboo">kitchen</em>.
              </span>
            }
            intro="A few of the plates people come back for. The full menu has everything from starters to sweet lassi."
          />
          <div data-reveal className="shrink-0">
            <Button href="/menu" variant="outline" icon="book">
              View full menu
            </Button>
          </div>
        </div>
      </div>

      {/* Phones: swipeable row. Desktop: grid. */}
      <ul
        data-reveal-stagger
        data-dish-grid
        className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:scroll-px-8 sm:px-8 lg:container-x lg:grid lg:grid-cols-3 lg:gap-x-6 lg:gap-y-14 lg:overflow-visible"
      >
        {signatureDishes.map((dish) => (
          <li key={dish.name} className="group w-[78vw] max-w-sm shrink-0 snap-start sm:w-[44vw] lg:w-auto lg:max-w-none">
            <div
              // Landing spot for a bowl from the hero thali (see ThaliJourney).
              data-dish-slot={dish.visual?.art.kind === "plate" && !dish.visual.art.thali ? "" : undefined}
              className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-smoke-soft"
            >
              <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.05]">
                {dish.visual && <Media visual={dish.visual} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 44vw, 78vw" />}
              </div>
            </div>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <p className="label text-[0.62rem] text-mist">[ {dish.category} ]</p>
                <h3 className="mt-2 font-display text-2xl">{dish.name}</h3>
              </div>
              <p className="font-display text-xl text-bamboo">₹{dish.price}</p>
            </div>
            {dish.description && <p className="mt-2 text-sm leading-relaxed text-mist">{dish.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
