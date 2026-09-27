import type { ReactNode } from "react";
import { BambooMark } from "./layout/Brand";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}

/** Dark opening band for inner pages (keeps the transparent navbar legible). */
export function PageHero({ eyebrow, title, intro, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-smoke pt-36 pb-16 text-cream sm:pt-44 sm:pb-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_85%_0%,rgba(214,150,70,0.18),transparent_70%)]"
      />
      <BambooMark className="absolute -right-10 -bottom-24 size-[26rem] text-smoke-line/50 sm:size-[34rem]" />
      <div className="container-x relative">
        <p className="label intro-line text-bamboo">[ {eyebrow} ]</p>
        <h1
          className="intro-line mt-6 max-w-5xl font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.92] font-medium tracking-[-0.03em]"
          style={{ animationDelay: "0.12s" }}
        >
          {title}
        </h1>
        {intro && (
          <p className="intro-line mt-8 max-w-xl text-lg leading-relaxed text-mist" style={{ animationDelay: "0.24s" }}>
            {intro}
          </p>
        )}
        {children && (
          <div className="intro-line mt-10" style={{ animationDelay: "0.36s" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
