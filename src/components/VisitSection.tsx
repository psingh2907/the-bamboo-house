import { business } from "@/data/business";
import { directionsUrl, fullAddress, mapEmbedUrl, phoneDisplay, phoneHref, whatsappHref } from "@/lib/contact";
import { hoursLabel } from "@/lib/hours";
import { Button } from "./ui/Button";
import { OpenStatus } from "./ui/OpenStatus";
import { SectionHeading } from "./ui/SectionHeading";

/** The main conversion section (brief §18): Call · WhatsApp · Directions. */
export function VisitSection({ eyebrow = "09 — Visit", headingLevel = "h2" }: { eyebrow?: string; headingLevel?: "h1" | "h2" }) {
  const rows = [
    { label: "Address", value: <address className="not-italic">{fullAddress}</address> },
    { label: "Plus code", value: business.address.plusCode },
    { label: "Hours", value: <>Every day, {hoursLabel}</> },
    { label: "Phone", value: phoneDisplay },
  ];

  return (
    <section id="visit" aria-labelledby="visit-title" className="scroll-mt-20 bg-paper py-24 sm:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div>
          <SectionHeading
            as={headingLevel}
            eyebrow={eyebrow}
            title={
              <span id="visit-title">
                Come <em className="text-clay-deep">find us</em>.
              </span>
            }
          />

          <div data-reveal className="mt-8 inline-flex rounded-full bg-cream px-4 py-2 text-sm font-medium text-ink shadow-sm ring-1 ring-ink/10">
            <OpenStatus />
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
              Get directions
            </Button>
            <Button href={phoneHref} variant="outline" tone="light" icon="phone" track={{ event: "call_click", params: { location: "visit" } }}>
              Call now
            </Button>
            <Button
              href={whatsappHref(`Hello ${business.name}, I'd like to ask about a visit.`)}
              external
              variant="whatsapp"
              icon="whatsapp"
              track={{ event: "whatsapp_click", params: { location: "visit" } }}
            >
              WhatsApp
            </Button>
          </div>
        </div>

        <div data-reveal="clip" className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-cream ring-1 ring-ink/10 lg:min-h-full">
          <iframe
            title={`Map showing ${business.name}, ${business.address.area}`}
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
