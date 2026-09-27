import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { business } from "@/data/business";
import { phoneDisplay, phoneHref } from "@/lib/contact";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How the ${business.name} website handles your information.`,
  path: "/privacy",
});

// DRAFT — written to match exactly what this site does today. The owner must
// review and approve it (it is not legal advice), and it must be updated if
// the site starts collecting anything new (e.g. online ordering, bookings).
const LAST_UPDATED = "27 September 2026";

export default function PrivacyPage() {
  const analytics = Boolean(siteConfig.gaId);

  const sections = [
    {
      title: "The short version",
      body: [
        "This website has no accounts, no sign-ups and no payment forms. We don't sell or share your information.",
        "When you call, WhatsApp or ask for directions, you leave this site for your phone, WhatsApp or Google Maps, and their own privacy policies apply.",
      ],
    },
    {
      title: "Group enquiries",
      body: [
        "The group enquiry form on our Visit page does not send anything to us or store anything on this website. It only prepares a message in WhatsApp, which you review and choose whether to send. Once sent, it is handled under WhatsApp's privacy policy, and we use it only to reply to your enquiry.",
      ],
    },
    {
      title: "Information stored on your device",
      body: [
        "We keep two small, non-personal notes in your browser: whether you have already seen the opening animation during this visit, and your best score in the Spot the Tiger game. They never leave your device, and clearing your browser data removes them.",
      ],
    },
    {
      title: "Analytics",
      body: analytics
        ? [
            "We use Google Analytics 4 to understand how many people visit and which buttons are used (for example Call, WhatsApp and Directions), so we can improve the site. Google Analytics uses cookies and receives technical information such as your browser type, approximate location and pages visited. It does not tell us who you are. You can opt out with Google's browser add-on or by blocking cookies.",
          ]
        : ["We do not currently use analytics or advertising cookies on this website."],
    },
    {
      title: "Maps",
      body: [
        "Our Visit sections show an embedded Google Map. Loading it connects your browser to Google, which may set its own cookies under Google's privacy policy.",
      ],
    },
    {
      title: "Hosting",
      body: [
        "Like any website, our hosting provider automatically records basic technical logs (such as IP address and time of request) to keep the site secure and working. These are not used to identify you.",
      ],
    },
    {
      title: "Your rights",
      body: [
        "Under India's Digital Personal Data Protection Act, 2023, you can ask us what personal information we hold about you, ask us to correct or delete it, or withdraw consent. In practice, the only personal information we may have is what you send us yourself by phone or WhatsApp.",
      ],
    },
  ];

  return (
    <>
      <PageHero eyebrow="Privacy" title="Privacy policy" intro={`Last updated ${LAST_UPDATED}.`} />

      <section className="bg-paper py-16 sm:py-24">
        <div className="container-x">
          <div className="max-w-2xl space-y-12">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="font-display text-3xl tracking-[-0.02em]">{section.title}</h2>
                <div className="mt-4 space-y-4 text-lg leading-relaxed text-muted">
                  {section.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <h2 className="font-display text-3xl tracking-[-0.02em]">Contact</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                Questions about this policy? Call {business.name} on{" "}
                <a href={phoneHref} className="text-clay-deep underline underline-offset-4">
                  {phoneDisplay}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={breadcrumbJsonLd("Privacy Policy", "/privacy")} />
    </>
  );
}
