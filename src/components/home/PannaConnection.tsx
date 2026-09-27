import { attractions } from "@/data/attractions";
import { phoneHref } from "@/lib/contact";
import { Button } from "../ui/Button";
import { Media } from "../ui/Media";
import { SectionHeading } from "../ui/SectionHeading";
import { type Locale, pick } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { Accent } from "../ui/Accent";

/**
 * Places the restaurant inside the wider Panna travel ecosystem (brief §16).
 * No distances or drive times until the owner verifies them.
 */
export function PannaConnection({ locale = "en" }: { locale?: Locale }) {
  const text = t(locale).panna;
  return (
    <section id="panna" aria-labelledby="panna-title" className="scroll-mt-20 overflow-hidden bg-paper py-24 sm:py-32">
      <div className="container-x flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow={text.eyebrow}
          title={
            <span id="panna-title">
              <Accent parts={text.title} className="text-clay-deep" />
            </span>
          }
          intro={text.intro}
        />
        <div data-reveal className="shrink-0">
          <Button href={phoneHref} variant="outline" tone="light" icon="phone" track={{ event: "call_click", params: { location: "panna" } }}>
            {text.call}
          </Button>
        </div>
      </div>

      <ul
        data-reveal-stagger
        className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:scroll-px-8 sm:px-8 lg:gap-6 lg:scroll-px-14 lg:px-14"
      >
        {attractions.map((place, i) => (
          <li key={place.name} className="w-[72vw] max-w-[22rem] shrink-0 snap-start sm:w-[40vw] lg:w-[23vw]">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-smoke">
              <Media visual={place.visual} locale={locale} sizes="(min-width: 1024px) 23vw, (min-width: 640px) 40vw, 72vw" showLabel={false} />
              <p className="label absolute top-4 left-4 rounded-full bg-cream/85 px-3 py-1.5 text-[0.6rem] text-ink backdrop-blur-sm">
                0{i + 1} · {pick(locale, place.kind, place.kindHi)}
              </p>
            </div>
            <h3 className="mt-5 font-display text-2xl">{pick(locale, place.name, place.nameHi)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{pick(locale, place.description, place.descriptionHi)}</p>
          </li>
        ))}
      </ul>

      <p className="container-x mt-10 text-xs text-muted">
        {text.note}
      </p>
    </section>
  );
}
