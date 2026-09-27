"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { chapters } from "@/data/experience";
import { cn } from "@/lib/cn";
import { Media } from "../ui/Media";
import { SectionHeading } from "../ui/SectionHeading";
import { type Locale, pick } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { Accent } from "../ui/Accent";

gsap.registerPlugin(ScrollTrigger);

/**
 * 01 The Space → 04 The Moments (brief §14).
 * Desktop: the picture stays put (CSS sticky) and crossfades as each chapter
 * passes the middle of the screen. Phones: each chapter carries its own picture.
 */
export function ExperienceStory({ locale = "en" }: { locale?: Locale }) {
  const text = t(locale).experience;
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const triggers = gsap.utils.toArray<HTMLElement>("[data-chapter]").map((el, i) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        }),
      );
      return () => triggers.forEach((t) => t.kill());
    },
    { scope: root },
  );

  return (
    <section ref={root} id="experience" aria-labelledby="experience-title" className="scroll-mt-20 bg-cream py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow={text.eyebrow}
          title={
            <span id="experience-title">
              <Accent parts={text.title} className="text-clay-deep" />
            </span>
          }
        />

        <div className="mt-16 lg:grid lg:grid-cols-2 lg:gap-20">
          {/* Sticky picture (desktop only) */}
          <div className="hidden lg:block">
            <div className="sticky top-28 aspect-[4/5] max-h-[calc(100svh-9rem)] w-full overflow-hidden rounded-[2rem] bg-smoke">
              {chapters.map((chapter, i) => (
                <div
                  key={chapter.number}
                  aria-hidden={i !== active}
                  className={cn(
                    "absolute inset-0 transition-[opacity,transform] duration-[1.1s] ease-[var(--ease-expo)]",
                    i === active ? "scale-100 opacity-100" : "scale-[1.06] opacity-0",
                  )}
                >
                  <Media visual={chapter.visual} locale={locale} sizes="45vw" />
                </div>
              ))}
              <p className="label absolute top-5 right-5 rounded-full bg-smoke/70 px-3 py-1.5 text-bamboo-light backdrop-blur-sm">
                {chapters[active].number} / 0{chapters.length}
              </p>
            </div>
          </div>

          <ol>
            {chapters.map((chapter, i) => (
              <li
                key={chapter.number}
                data-chapter
                className="flex flex-col justify-center border-t border-ink/10 py-12 first:border-t-0 lg:min-h-[75svh] lg:py-0"
              >
                <div className="relative mb-8 aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-smoke lg:hidden">
                  <Media visual={chapter.visual} locale={locale} sizes="100vw" />
                </div>
                <p
                  className={cn(
                    "font-display text-[clamp(4rem,9vw,8rem)] leading-none tracking-[-0.04em] transition-colors duration-700",
                    // Faded, but still 3.3:1 for large text (was ink/15, 1.4:1).
                    i === active ? "text-clay" : "text-[#948779]",
                  )}
                >
                  {chapter.number}
                </p>
                <h3 className="mt-4 font-display text-4xl tracking-[-0.02em] sm:text-5xl">{pick(locale, chapter.title, chapter.titleHi)}</h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">{pick(locale, chapter.body, chapter.bodyHi)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
