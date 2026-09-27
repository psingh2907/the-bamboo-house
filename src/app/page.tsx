import { ExperienceStory } from "@/components/home/ExperienceStory";
import { GalleryTeaser } from "@/components/home/GalleryTeaser";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Numbers } from "@/components/home/Numbers";
import { PannaConnection } from "@/components/home/PannaConnection";
import { PlaceIntro } from "@/components/home/PlaceIntro";
import { SignatureDishes } from "@/components/home/SignatureDishes";
import { SocialProof } from "@/components/home/SocialProof";
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
      <VisitSection />
    </>
  );
}
