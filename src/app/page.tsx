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

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <PlaceIntro />
      <Numbers />
      <SignatureDishes />
      <ExperienceStory />
      <SocialProof />
      <PannaConnection />
      <GalleryTeaser />
      <TableSetter />
      <VisitSection />
      <ThaliJourney />
      <SectionRail />
    </>
  );
}
