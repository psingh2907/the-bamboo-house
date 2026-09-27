import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { business } from "@/data/business";
import { gallery } from "@/data/gallery";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Gallery",
  description: `Photos of ${business.name} in Syamardanda, Panna — the bamboo dining room, the food, the team and guests' moments.`,
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={
          <>
            Bamboo, lamplight <em className="text-bamboo">&amp; thalis</em>.
          </>
        }
        intro="The food, the space, the people and the moments that happen around our tables."
      />
      <GalleryGrid items={gallery} />
      <JsonLd data={breadcrumbJsonLd("Gallery", "/gallery")} />
    </>
  );
}
