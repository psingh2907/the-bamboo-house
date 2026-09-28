import { signatureDishes } from "@/data/menu";
import { type Locale, localePath, pick } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { Accent } from "../ui/Accent";
import { Button } from "../ui/Button";
import { Media } from "../ui/Media";
import { SectionHeading } from "../ui/SectionHeading";
import { ScrollDots } from "../ui/ScrollDots";

/** 4–6 visually strong dishes rather than the whole menu (brief §13). */
export function SignatureDishes({ locale = "en" }: { locale?: Locale }) {
  const text = t(locale).dishes;
  return (
    <section id="food" aria-labelledby="dishes-title" className="lamp scroll-mt-20 overflow-hidden bg-smoke py-16 text-cream sm:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            tone="dark"
            eyebrow={text.eyebrow}
            title={
              <span id="dishes-title">
                <Accent parts={text.title} className="text-bamboo" />
              </span>
            }
            intro={text.intro}
          />
          <div data-reveal className="shrink-0">
            <Button href={localePath(locale, "/menu")} variant="outline" icon="book">
              {text.cta}
            </Button>
          </div>
        </div>
      </div>

      {/* Phones: swipeable row. Desktop: grid. */}
      <ul
        id="dish-cards"
        data-reveal-stagger
        data-dish-grid
        className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:scroll-px-8 sm:px-8 lg:container-x lg:grid lg:grid-cols-3 lg:gap-x-6 lg:gap-y-14 lg:overflow-visible"
      >
        {signatureDishes.map((dish) => (
          <li key={dish.name} className="group w-[78vw] max-w-sm shrink-0 snap-start sm:w-[44vw] lg:w-auto lg:max-w-none">
            <div
              // Landing spot for a bowl from the hero thali (see ThaliJourney).
              data-dish-slot={dish.visual?.art.kind === "plate" && !dish.visual.art.thali ? "" : undefined}
              className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-smoke-soft"
            >
              <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.05]">
                {dish.visual && <Media visual={dish.visual} locale={locale} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 44vw, 78vw" />}
              </div>
            </div>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <p className="label text-[0.7rem] text-mist">[ {pick(locale, dish.category, dish.categoryHi)} ]</p>
                <h3 className="mt-2 font-display text-2xl">{pick(locale, dish.name, dish.nameHi)}</h3>
                {/* The other language's name, small: Hindi under English and vice versa. */}
                {dish.nameHi && (
                  <p lang={locale === "hi" ? "en" : "hi"} className="font-hand mt-0.5 text-base text-bamboo-light/80">
                    {locale === "hi" ? dish.name : dish.nameHi}
                  </p>
                )}
              </div>
              <p className="font-display text-xl text-bamboo">₹{dish.price}</p>
            </div>
            {dish.description && (
              <p className="mt-2 text-sm leading-relaxed text-mist">{pick(locale, dish.description, dish.descriptionHi)}</p>
            )}
          </li>
        ))}
      </ul>
      <ScrollDots targetId="dish-cards" count={signatureDishes.length} tone="dark" />
    </section>
  );
}
