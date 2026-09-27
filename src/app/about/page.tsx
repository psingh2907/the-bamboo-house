import { ExperienceStory } from "@/components/home/ExperienceStory";
import { Numbers } from "@/components/home/Numbers";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Media } from "@/components/ui/Media";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { business } from "@/data/business";
import { gallery } from "@/data/gallery";
import { directionsUrl } from "@/lib/contact";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description: `The story of ${business.name}, a family restaurant built from bamboo in Syamardanda, near Devendranagar in Panna district, Madhya Pradesh.`,
  path: "/about",
});

const pots = gallery.find((item) => item.id === "pots")!;

// DEMO — placeholder story. Replace with the owner's answers to
// "Why was it started?" and "Why the name?" (docs/owner-checklist.md, Q1–Q3).
const story = [
  "The Bamboo House was built around a simple idea: a place in Syamardanda where a family can sit down together to a proper meal, in a room they will remember.",
  "So the room was built by hand, from bamboo — the walls, the chairs, the frames — with clay pots hung overhead and warm light that comes on as the evening does.",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={
          <>
            A house of <em className="text-bamboo">bamboo</em>, a table for everyone.
          </>
        }
        intro={`${business.name} is a family restaurant in ${business.address.area}, near ${business.address.locality} in Panna district, Madhya Pradesh.`}
      />

      <section aria-labelledby="story-title" className="bg-paper py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Our story"
              title={
                <span id="story-title">
                  Why <em className="text-clay-deep">bamboo</em>?
                </span>
              }
            />
            <div data-reveal className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
              {story.map((paragraph) => (
                <p key={paragraph.slice(0, 20)}>{paragraph}</p>
              ))}
            </div>
            <div data-reveal className="mt-10">
              <Button href={directionsUrl} external tone="light" icon="pin" track={{ event: "directions_click", params: { location: "about" } }}>
                Come and see it
              </Button>
            </div>
          </div>
          <div data-reveal="clip" className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-smoke">
            <div data-parallax="0.12" className="absolute -inset-y-[8%] inset-x-0">
              <Media visual={pots} sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
          </div>
        </div>
      </section>

      <Numbers />
      <ExperienceStory />

      <JsonLd data={breadcrumbJsonLd("About", "/about")} />
    </>
  );
}
