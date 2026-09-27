"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * "The thali's journey" (Oryzo's one-object-through-the-page idea).
 *
 * Leg A — as the hero scrolls away, the bowls (katoris) lift off the hero
 * thali one by one and leave through the top of the screen: the plate is
 * served. Leg B — as the Signature Dishes grid arrives, they drop back in and
 * settle into the dish cards, growing into each card's bowl before fading.
 *
 * The flying bowls are clones of the real SVG bowls in a fixed layer; their
 * start and end points are read from the live elements on every frame, so
 * they follow the plate's scroll rotation and the cards' reveal.
 *
 * Desktop only (on phones the dishes are a sideways row, mostly off-screen)
 * and never for reduced motion. Renders nothing itself.
 */
const EXIT_Y = -140;

interface Point {
  x: number;
  y: number;
}

const center = (el: Element): Point => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

export function ThaliJourney() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const hero = document.querySelector<HTMLElement>("#hero-title")?.closest("section");
      const grid = document.querySelector<HTMLElement>("[data-dish-grid]");
      const katoris = [...document.querySelectorAll<SVGGElement>("[data-hero-plate] [data-katori]")];
      const slots = [...document.querySelectorAll<HTMLElement>("[data-dish-slot]")];
      const heroSvg = katoris[0]?.ownerSVGElement;
      if (!hero || !grid || !heroSvg || !katoris.length) return;

      // One fixed layer of cloned bowls, sized to the bowl on screen.
      const layer = document.createElement("div");
      layer.setAttribute("aria-hidden", "true");
      layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:30;overflow:hidden";
      const chips = katoris.map((katori) => {
        const cx = Number(katori.dataset.cx);
        const cy = Number(katori.dataset.cy);
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", `${cx - 42} ${cy - 42} 84 84`);
        svg.style.cssText = "position:absolute;left:0;top:0;overflow:visible;will-change:transform,opacity;opacity:0";
        // The clone's gradients point at the hero SVG's <defs>, which stay in the page.
        svg.appendChild(katori.cloneNode(true));
        layer.appendChild(svg);
        return svg;
      });
      document.body.appendChild(layer);

      let pA = 0;
      let pB = 0;
      let lifted = false;

      const place = (chip: SVGSVGElement, p: Point, size: number, scale: number, rotate: number, opacity: number) => {
        chip.style.width = `${size}px`;
        chip.style.height = `${size}px`;
        chip.style.opacity = String(opacity);
        chip.style.transform = `translate(${p.x - size / 2}px, ${p.y - size / 2}px) rotate(${rotate}deg) scale(${scale})`;
      };

      const setLifted = (value: boolean) => {
        if (value === lifted) return;
        lifted = value;
        katoris.forEach((k) => (k.style.opacity = value ? "0" : "1"));
      };

      const render = () => {
        // A bowl's on-screen size: the real bowl's width (84 viewBox units → px).
        const plateScale = heroSvg.getBoundingClientRect().width / heroSvg.viewBox.baseVal.width;
        const size = 84 * plateScale;

        if (pB > 0) {
          // Leg B: drop in from above and settle into the cards.
          setLifted(true);
          chips.forEach((chip, i) => {
            const slot = slots[i];
            if (!slot) return place(chip, { x: 0, y: EXIT_Y }, size, 1, 0, 0);
            const t = gsap.parseEase("power3.out")(clamp01((pB - i * 0.07) / 0.6));
            const target = center(slot);
            const from = { x: target.x + (i - 2) * 50, y: EXIT_Y };
            // Grow the bowl's steel rim (r=38 of 84) to the card bowl (35% of card width).
            const endScale = (0.35 * slot.getBoundingClientRect().width * 84) / (38 * size);
            const fade = t > 0.82 ? 1 - (t - 0.82) / 0.18 : 1;
            place(
              chip,
              { x: lerp(from.x, target.x, t), y: lerp(from.y, target.y, t) },
              size,
              lerp(1, endScale, t),
              lerp(-120, 0, t),
              t > 0 ? fade : 0,
            );
          });
        } else if (pA > 0.015) {
          // Leg A: lift off the plate and leave through the top.
          setLifted(true);
          chips.forEach((chip, i) => {
            const t = gsap.parseEase("power2.in")(clamp01((pA - i * 0.08) / 0.55));
            const from = center(katoris[i]);
            const to = { x: from.x + (i - 2) * 90, y: EXIT_Y };
            place(chip, { x: lerp(from.x, to.x, t), y: lerp(from.y, to.y, t) - t * 40 }, size, 1 + t * 0.25, t * (i % 2 ? 160 : -160), 1);
          });
        } else {
          // At rest: the real bowls sit on the plate.
          setLifted(false);
          chips.forEach((chip) => (chip.style.opacity = "0"));
        }
      };

      const legA = ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "60% top",
        onUpdate: (self) => {
          pA = self.progress;
          render();
        },
      });
      const legB = ScrollTrigger.create({
        trigger: grid,
        start: "top bottom",
        end: "top 35%",
        onUpdate: (self) => {
          pB = self.progress;
          render();
        },
      });
      render();

      return () => {
        legA.kill();
        legB.kill();
        layer.remove();
        katoris.forEach((k) => (k.style.opacity = ""));
      };
    });
    return () => mm.revert();
  }, []);

  return null;
}
