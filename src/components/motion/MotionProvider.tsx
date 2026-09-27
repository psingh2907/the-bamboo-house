"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { INTRO_DONE_EVENT, isIntroRunning } from "@/lib/intro";
import { setLenis } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The site's animation language (brief §40), applied through data attributes
 * so sections stay server components:
 *
 *   data-reveal            fade + rise when scrolled into view
 *   data-reveal="clip"     image uncovered from the bottom edge
 *   data-reveal-stagger    children reveal one after another
 *   data-parallax="0.15"   drifts at a fraction of scroll speed
 *
 * Everything is skipped for visitors who prefer reduced motion — content is
 * simply visible. Nothing is hidden by CSS, so a script failure never hides
 * content. Only opacity is animated (never `visibility`), so unrevealed
 * sections stay readable by screen readers and in-page search.
 */
export function MotionProvider() {
  const pathname = usePathname();

  // Smooth scrolling, desktop pointers only (touch keeps native momentum).
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const lenis = new Lenis({ lerp: 0.11, anchors: { offset: -80 } });
    setLenis(lenis);

    // Hold the page still while the first-visit loader is up.
    const release = () => {
      lenis.start();
      ScrollTrigger.refresh();
    };
    if (isIntroRunning()) {
      lenis.stop();
      window.addEventListener(INTRO_DONE_EVENT, release, { once: true });
    }
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener(INTRO_DONE_EVENT, release);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // New page: start at the top and rebuild the triggers for its content.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          const clip = el.dataset.reveal === "clip";
          gsap.fromTo(
            el,
            clip ? { clipPath: "inset(100% 0% 0% 0%)" } : { opacity: 0, y: 36 },
            {
              ...(clip ? { clipPath: "inset(0% 0% 0% 0%)" } : { opacity: 1, y: 0 }),
              duration: clip ? 1.4 : 1.1,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
          gsap.fromTo(
            group.children,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "expo.out",
              stagger: 0.09,
              scrollTrigger: { trigger: group, start: "top 88%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax) || 0.12;
          gsap.fromTo(
            el,
            { yPercent: -amount * 50 },
            {
              yPercent: amount * 50,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
      // Fonts and late layout can move trigger positions.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return () => mm.revert();
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
