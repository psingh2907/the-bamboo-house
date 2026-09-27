"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { scrollToElement } from "@/lib/motion";
import type { Locale } from "@/i18n";
import { t } from "@/i18n/dictionaries";

/**
 * Home-page progress rail (Oryzo's sticky section nav): shows which part of
 * the story you're in and jumps to any part. Desktop only; appears once the
 * hero has scrolled away and hides again over the footer.
 */
const sections = [
  { id: "place", key: "place" },
  { id: "food", key: "food" },
  { id: "experience", key: "experience" },
  { id: "panna", key: "panna" },
  { id: "your-table", key: "table" },
  { id: "visit", key: "visit" },
] as const;

export function SectionRail({ locale = "en" }: { locale?: Locale }) {
  const text = t(locale).rail;
  const [active, setActive] = useState<string | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => el !== null);

    // The section crossing the middle of the screen is the active one.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => observer.observe(el));

    const hero = document.getElementById("hero-title")?.closest("section");
    const footer = document.querySelector("footer");
    const onScroll = () => {
      const pastHero = hero ? hero.getBoundingClientRect().bottom < window.innerHeight * 0.4 : true;
      const beforeFooter = footer ? footer.getBoundingClientRect().top > window.innerHeight * 0.6 : true;
      setShown(pastHero && beforeFooter);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const index = sections.findIndex((s) => s.id === active);

  return (
    <nav
      aria-label={text.label}
      className={cn(
        "fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 transition-[opacity,transform] duration-500 lg:block",
        shown ? "opacity-100" : "pointer-events-none translate-x-4 opacity-0",
      )}
    >
      <ol className="relative flex flex-col gap-1 rounded-full bg-smoke/75 py-3 backdrop-blur-md">
        {/* Progress line behind the dots */}
        <span aria-hidden="true" className="absolute top-5 bottom-5 left-1/2 w-px -translate-x-1/2 bg-smoke-line" />
        <span
          aria-hidden="true"
          className="absolute top-5 left-1/2 w-px -translate-x-1/2 bg-bamboo transition-[height] duration-500"
          style={{ height: index < 0 ? 0 : `calc((100% - 2.5rem) * ${index / (sections.length - 1)})` }}
        />
        {sections.map((s, i) => {
          const isActive = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={isActive ? "location" : undefined}
                tabIndex={shown ? 0 : -1}
                onClick={(e) => {
                  const el = document.getElementById(s.id);
                  if (!el) return;
                  e.preventDefault();
                  scrollToElement(el, -72);
                }}
                className="group relative flex h-7 w-7 items-center justify-center"
              >
                {/* Label floats outside the slim rail so it never covers content while hidden. */}
                <span
                  className={cn(
                    "label pointer-events-none absolute right-full mr-2 rounded-full bg-smoke/85 px-2.5 py-1 text-[0.6rem] whitespace-nowrap backdrop-blur-sm transition-[opacity,color] duration-300",
                    isActive ? "text-bamboo-light opacity-100" : "text-mist opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
                  )}
                >
                  {text[s.key]}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative size-2 rounded-full transition-[background-color,transform] duration-300",
                    isActive ? "scale-150 bg-bamboo" : i < index ? "bg-bamboo/70" : "bg-mist/50 group-hover:bg-mist",
                  )}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
