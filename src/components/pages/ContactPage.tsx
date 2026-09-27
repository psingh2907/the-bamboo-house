import type { Metadata } from "next";
import { GroupEnquiryForm } from "@/components/contact/GroupEnquiryForm";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Accent } from "@/components/ui/Accent";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VisitSection } from "@/components/VisitSection";
import { business } from "@/data/business";
import type { Locale } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { addressText, directionsUrl, phoneDisplay, phoneHref } from "@/lib/contact";
import { hoursText } from "@/lib/hours";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

// Only questions whose answers are known. Add parking, delivery, events etc.
// once the owner confirms them (docs/owner-checklist.md).
function faqs(locale: Locale) {
  const { min, max } = business.priceRange;
  const hours = hoursText(locale);
  if (locale === "hi") {
    return [
      {
        q: "द बैम्बू हाउस कहाँ है?",
        a: `${addressText("hi")} में। Google Maps पर "The Bamboo House" खोजें या प्लस कोड ${business.address.plusCode} इस्तेमाल करें।`,
      },
      { q: "रेस्टोरेंट कब खुला रहता है?", a: `हम हर दिन ${hours} खुले रहते हैं।` },
      { q: "खाने का ख़र्च कितना आता है?", a: `ज़्यादातर मेहमानों का प्रति व्यक्ति लगभग ₹${min}–${max} ख़र्च होता है।` },
      { q: "रेस्टोरेंट से कैसे संपर्क करें?", a: `हमें ${phoneDisplay} पर कॉल करें या WhatsApp पर संदेश भेजें।` },
    ];
  }
  return [
    {
      q: "Where is The Bamboo House?",
      a: `In ${addressText("en")}. Search "The Bamboo House" on Google Maps or use plus code ${business.address.plusCode}.`,
    },
    { q: "What are your opening hours?", a: `We're open every day from ${hours}.` },
    { q: "How much does a meal cost?", a: `Most guests spend around ₹${min}–${max} per person.` },
    { q: "How can I contact the restaurant?", a: `Call us on ${phoneDisplay}, or send a message on WhatsApp.` },
  ];
}

export const contactMetadata = (locale: Locale): Metadata => {
  const hours = hoursText(locale);
  const description =
    locale === "hi"
      ? `${business.nameHi}, श्यामरदंडा (देवेंद्रनगर के पास, पन्ना) का रास्ता, समय (रोज़ ${hours}) और संपर्क। कॉल करें ${phoneDisplay}।`
      : `Directions, opening hours (${hours} daily) and contact for ${business.name}, Syamardanda, near Devendranagar, Panna. Call ${phoneDisplay}.`;
  return pageMetadata({ title: t(locale).contactPage.metaTitle, description, path: "/contact", locale });
};

/** The visit / contact page, in either language (/contact and /hi/contact). */
export function ContactPage({ locale }: { locale: Locale }) {
  const text = t(locale).contactPage;
  const nav = t(locale).nav;
  const list = faqs(locale);
  return (
    <>
      <PageHero eyebrow={text.eyebrow} title={<Accent parts={text.title} className="text-bamboo" />} intro={text.intro}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={directionsUrl} external icon="pin" track={{ event: "directions_click", params: { location: "contact_hero" } }}>
            {nav.directions}
          </Button>
          <Button href={phoneHref} variant="outline" icon="phone" track={{ event: "call_click", params: { location: "contact_hero" } }}>
            {phoneDisplay}
          </Button>
        </div>
      </PageHero>

      <VisitSection eyebrow={text.visitEyebrow} locale={locale} />

      <section aria-labelledby="groups-title" className="bg-cream py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow={text.groupsEyebrow}
            title={
              <span id="groups-title">
                <Accent parts={text.groupsTitle} className="text-clay-deep" />
              </span>
            }
            intro={text.groupsIntro}
          />
          <div data-reveal>
            <GroupEnquiryForm locale={locale} />
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="bg-paper py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow={text.faqEyebrow}
            title={
              <span id="faq-title">
                <Accent parts={text.faqTitle} className="text-clay-deep" />
              </span>
            }
          />
          <div data-reveal-stagger className="divide-y divide-ink/10 border-y border-ink/10">
            {list.map((faq) => (
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

      <JsonLd data={breadcrumbJsonLd(text.metaTitle, "/contact", locale)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: locale === "hi" ? "hi-IN" : "en-IN",
          mainEntity: list.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
        }}
      />
    </>
  );
}
