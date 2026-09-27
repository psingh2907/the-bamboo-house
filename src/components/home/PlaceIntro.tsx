import { business } from "@/data/business";
import { chapters } from "@/data/experience";
import { hoursLabel } from "@/lib/hours";
import { Button } from "../ui/Button";
import { Media } from "../ui/Media";
import { SectionHeading } from "../ui/SectionHeading";

const space = chapters[0].visual;

const facts = [
  // VERIFIED from the listing photo.
  { title: "Built from bamboo", body: "Bamboo-slat walls, bamboo chairs and frames, and clay pots hung overhead." },
  // VERIFIED category.
  { title: "Made for families", body: "Tables for two or for the whole family, and a menu everyone can agree on." },
  // REPORTED hours.
  { title: "Open every day", body: `${hoursLabel}, lunch through dinner.` },
];

export function PlaceIntro() {
  return (
    <section id="place" aria-labelledby="place-title" className="scroll-mt-20 bg-paper py-24 sm:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div data-reveal="clip" className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-smoke">
          <div data-parallax="0.12" className="absolute -inset-y-[8%] inset-x-0">
            <Media visual={space} sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        </div>

        <div>
          <SectionHeading
            eyebrow="02 — The place"
            title={
              <span id="place-title">
                A place worth <em className="text-clay-deep">stopping</em> for.
              </span>
            }
            intro={`${business.name} is a family restaurant in ${business.address.area}, near ${business.address.locality} in Panna district — the kind of place you remember the drive home from.`}
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
              Our story
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
