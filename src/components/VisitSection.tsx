import { business } from "@/data/business";
import type { Locale } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { addressText, directionsUrl, mapEmbedUrl, phoneDisplay, phoneHref, whatsappHref } from "@/lib/contact";
import { hoursText } from "@/lib/hours";
import { Accent } from "./ui/Accent";
import { Button } from "./ui/Button";
import { OpenStatus } from "./ui/OpenStatus";
import { SectionHeading } from "./ui/SectionHeading";

/** The main conversion section (brief §18): Call · WhatsApp · Directions. */
export function VisitSection({
  eyebrow,
  headingLevel = "h2",
  locale = "en",
}: {
  eyebrow?: string;
  headingLevel?: "h1" | "h2";
  locale?: Locale;
}) {
  const text = t(locale).visit;
  const rows = [
    { label: text.address, value: <address className="not-italic">{addressText(locale)}</address> },
    { label: text.plusCode, value: business.address.plusCode },
    { label: text.hours, value: t(locale).hours.everyDay(hoursText(locale)) },
    { label: text.phone, value: phoneDisplay },
  ];

  return (
    <section id="visit" aria-labelledby="visit-title" className="scroll-mt-20 bg-paper py-24 sm:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div>
          <SectionHeading
            as={headingLevel}
            eyebrow={eyebrow ?? text.eyebrow}
            title={
              <span id="visit-title">
                <Accent parts={text.title} className="text-clay-deep" />
              </span>
            }
          />

          <div data-reveal className="mt-8 inline-flex rounded-full bg-cream px-4 py-2 text-sm font-medium text-ink shadow-sm ring-1 ring-ink/10">
            <OpenStatus locale={locale} />
          </div>

          <dl data-reveal-stagger className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-[7rem_1fr] gap-4 py-5">
                <dt className="label pt-1 text-muted">{row.label}</dt>
                <dd className="text-lg leading-snug">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div data-reveal className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href={directionsUrl} external tone="light" icon="pin" track={{ event: "directions_click", params: { location: "visit" } }}>
              {text.directions}
            </Button>
            <Button href={phoneHref} variant="outline" tone="light" icon="phone" track={{ event: "call_click", params: { location: "visit" } }}>
              {text.call}
            </Button>
            <Button
              href={whatsappHref(text.message)}
              external
              variant="whatsapp"
              icon="whatsapp"
              track={{ event: "whatsapp_click", params: { location: "visit" } }}
            >
              {text.whatsapp}
            </Button>
          </div>
        </div>

        <div data-reveal="clip" className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-cream ring-1 ring-ink/10 lg:min-h-full">
          <iframe
            title={text.map}
            src={mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 size-full border-0 grayscale-[35%] sepia-[20%]"
          />
        </div>
      </div>
    </section>
  );
}
