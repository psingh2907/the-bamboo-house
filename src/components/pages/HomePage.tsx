import { ExperienceStory } from "@/components/home/ExperienceStory";
import { GalleryTeaser } from "@/components/home/GalleryTeaser";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Numbers } from "@/components/home/Numbers";
import { PannaConnection } from "@/components/home/PannaConnection";
import { PlaceIntro } from "@/components/home/PlaceIntro";
import { SectionRail } from "@/components/home/SectionRail";
import { SignatureDishes } from "@/components/home/SignatureDishes";
import { SocialProof } from "@/components/home/SocialProof";
import { TableSetter } from "@/components/home/TableSetter";
import { ThaliJourney } from "@/components/home/ThaliJourney";
import { VisitSection } from "@/components/VisitSection";
import type { Locale } from "@/i18n";

/** The home page, in either language (/ and /hi). */
export function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <Hero locale={locale} />
      <Manifesto locale={locale} />
      <PlaceIntro locale={locale} />
      <Numbers locale={locale} />
      <SignatureDishes locale={locale} />
      <ExperienceStory locale={locale} />
      <SocialProof locale={locale} />
      <PannaConnection locale={locale} />
      <GalleryTeaser locale={locale} />
      <TableSetter locale={locale} />
      <VisitSection locale={locale} />
      <ThaliJourney />
      <SectionRail locale={locale} />
    </>
  );
}
