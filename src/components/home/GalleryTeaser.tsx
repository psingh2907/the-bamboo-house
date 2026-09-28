import { gallery } from "@/data/gallery";
import { cn } from "@/lib/cn";
import { business } from "@/data/business";
import { instagramHandle } from "@/lib/contact";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { TrackedLink } from "../ui/TrackedLink";
import { Media } from "../ui/Media";
import { SectionHeading } from "../ui/SectionHeading";
import type { Locale } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { Accent } from "../ui/Accent";

const picks = ["interior-wide", "thali", "pots", "evening", "paneer"]
  .map((id) => gallery.find((item) => item.id === id))
  .filter((item) => item !== undefined);

// Editorial mosaic rather than a uniform grid (brief §17).
const layout = [
  "col-span-2 row-span-2 lg:col-span-3",
  "lg:col-span-2",
  "lg:col-span-1",
  "col-span-2 lg:col-span-2",
  "hidden lg:block lg:col-span-1",
];

export function GalleryTeaser({ locale = "en" }: { locale?: Locale }) {
  const text = t(locale).gallery;
  return (
    <section aria-labelledby="gallery-title" className="lamp bg-smoke py-16 text-cream sm:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            tone="dark"
            eyebrow={text.eyebrow}
            title={
              <span id="gallery-title">
                <Accent parts={text.title} className="text-bamboo" />
              </span>
            }
          />
          <div data-reveal className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/gallery" variant="outline">
              {text.cta}
            </Button>
            {instagramHandle && (
              <TrackedLink
                href={business.socials.instagram}
                external
                track={{ event: "social_click", params: { network: "Instagram", location: "gallery_teaser" } }}
                className="group inline-flex min-h-12 items-center gap-2.5 rounded-full px-2 text-sm text-mist transition-colors hover:text-bamboo-light"
              >
                <Icon name="instagram" className="size-5 text-bamboo" />
                <span>
                  {text.instagram} <span className="text-cream group-hover:text-bamboo-light">{instagramHandle}</span>
                </span>
              </TrackedLink>
            )}
          </div>
        </div>

        <ul data-reveal-stagger className="mt-10 grid auto-rows-[38vw] grid-cols-2 gap-3 sm:auto-rows-[28vw] lg:auto-rows-[15vw] lg:grid-cols-6 lg:gap-4">
          {picks.map((item, i) => (
            <li key={item.id} className={cn("relative overflow-hidden rounded-[1.25rem] bg-smoke-soft", layout[i])}>
              <Media visual={item} locale={locale} sizes="(min-width: 1024px) 50vw, 100vw" showLabel={false} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
