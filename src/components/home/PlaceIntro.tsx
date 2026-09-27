import { chapters } from "@/data/experience";
import type { Locale } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { hoursText } from "@/lib/hours";
import { Accent } from "../ui/Accent";
import { Button } from "../ui/Button";
import { Media } from "../ui/Media";
import { SectionHeading } from "../ui/SectionHeading";

const space = chapters[0].visual;

// Facts (src/i18n/dictionaries.ts): bamboo interior and family category are
// VERIFIED from the listing; hours are REPORTED.

export function PlaceIntro({ locale = "en" }: { locale?: Locale }) {
  const text = t(locale).place;
  const facts = text.facts.map((f) => ({ title: f.title, body: typeof f.body === "function" ? f.body(hoursText(locale)) : f.body }));
  return (
    <section id="place" aria-labelledby="place-title" className="scroll-mt-20 bg-paper py-24 sm:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div data-reveal="clip" className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-smoke">
          <div data-parallax="0.12" className="absolute -inset-y-[8%] inset-x-0">
            <Media visual={space} locale={locale} sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        </div>

        <div>
          <SectionHeading
            eyebrow={text.eyebrow}
            title={
              <span id="place-title">
                <Accent parts={text.title} className="text-clay-deep" />
              </span>
            }
            intro={text.intro}
          />

          <ol data-reveal-stagger className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
            {facts.map((fact, i) => (
              <li key={fact.title} className="grid grid-cols-[3.5rem_1fr] gap-4 py-6">
                <span className="label pt-1.5 text-clay-deep">[ 0{i + 1} ]</span>
                <div>
                  <h3 className="font-display text-2xl">{fact.title}</h3>
                  <p className="mt-1.5 text-muted">{fact.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10">
            <Button href="/about" variant="ghost" tone="light">
              {text.story}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
