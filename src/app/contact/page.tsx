import { GroupEnquiryForm } from "@/components/contact/GroupEnquiryForm";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VisitSection } from "@/components/VisitSection";
import { business } from "@/data/business";
import { directionsUrl, fullAddress, phoneDisplay, phoneHref } from "@/lib/contact";
import { hoursLabel } from "@/lib/hours";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Visit & Contact",
  description: `Directions, opening hours (${hoursLabel} daily) and contact for ${business.name}, Syamardanda, near Devendranagar, Panna. Call ${phoneDisplay}.`,
  path: "/contact",
});

// Only questions whose answers are known. Add parking, delivery, events etc.
// once the owner confirms them (docs/owner-checklist.md).
const faqs = [
  {
    q: "Where is The Bamboo House?",
    a: `In ${fullAddress}. Search "The Bamboo House" on Google Maps or use plus code ${business.address.plusCode}.`,
  },
  { q: "What are your opening hours?", a: `We're open every day from ${hoursLabel}.` },
  {
    q: "How much does a meal cost?",
    a: `Most guests spend around ₹${business.priceRange.min}–${business.priceRange.max} per person.`,
  },
  { q: "How can I contact the restaurant?", a: `Call us on ${phoneDisplay}, or send a message on WhatsApp.` },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Visit"
        title={
          <>
            We&apos;ll keep a <em className="text-bamboo">table warm</em>.
          </>
        }
        intro="Directions, hours and the quickest ways to reach us."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={directionsUrl} external icon="pin" track={{ event: "directions_click", params: { location: "contact_hero" } }}>
            Get directions
          </Button>
          <Button href={phoneHref} variant="outline" icon="phone" track={{ event: "call_click", params: { location: "contact_hero" } }}>
            {phoneDisplay}
          </Button>
        </div>
      </PageHero>

      <VisitSection eyebrow="Directions & hours" />

      <section aria-labelledby="groups-title" className="bg-cream py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Groups & occasions"
            title={
              <span id="groups-title">
                Coming with a <em className="text-clay-deep">crowd</em>?
              </span>
            }
            intro="Birthdays, family gatherings, travel groups — tell us when and how many, and we'll get back to you on WhatsApp."
          />
          <div data-reveal>
            <GroupEnquiryForm />
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="bg-paper py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Good to know"
            title={
              <span id="faq-title">
                Questions, <em className="text-clay-deep">answered</em>.
              </span>
            }
          />
          <div data-reveal-stagger className="divide-y divide-ink/10 border-y border-ink/10">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-2">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 font-display text-xl [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span aria-hidden="true" className="text-2xl text-clay-deep transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-5 leading-relaxed text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <JsonLd data={breadcrumbJsonLd("Visit & Contact", "/contact")} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
        }}
      />
    </>
  );
}
