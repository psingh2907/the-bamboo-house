"use client";

import { useEffect } from "react";

/**
 * A warm lamp glow that follows the pointer across dark sections marked
 * `.lamp` — like carrying a lantern past the bamboo walls. (Oryzo's
 * cursor-following hand, translated into light.)
 *
 * The glow is a background layer (see `.lamp` in globals.css), so it always
 * sits beneath the text. The position eases after the pointer for a soft,
 * lantern-like lag. Only for mouse/trackpad users who allow motion.
 */
export function LampLight() {
  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!media.matches) return;

    let target: HTMLElement | null = null;
    let active: HTMLElement | null = null;
    const pos = { x: 0, y: 0 };
    const goal = { x: 0, y: 0 };
    let alpha = 0;
    let frame = 0;
    const last = { x: -1, y: -1 };

    const aim = (clientX: number, clientY: number, hit: Element | null) => {
      const section = hit?.closest<HTMLElement>(".lamp") ?? null;
      if (section !== target) {
        // Entering a new section: start the light where the pointer is.
        if (section) {
          const r = section.getBoundingClientRect();
          pos.x = goal.x = clientX - r.left;
          pos.y = goal.y = clientY - r.top;
        }
        target = section;
      }
      if (target) {
        const r = target.getBoundingClientRect();
        goal.x = clientX - r.left;
        goal.y = clientY - r.top;
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      last.x = e.clientX;
      last.y = e.clientY;
      aim(e.clientX, e.clientY, e.target as Element | null);
    };

    // Scrolling moves the page under a still pointer: re-aim at what's there now.
    const onScroll = () => {
      if (last.x < 0) return;
      aim(last.x, last.y, document.elementFromPoint(last.x, last.y));
    };

    const onLeave = () => {
      target = null;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const tick = () => {
      frame = 0;
      // Fade out of the old section before lighting the new one.
      if (active && active !== target) {
        alpha += (0 - alpha) * 0.18;
        active.style.setProperty("--lamp-a", alpha.toFixed(3));
        if (alpha < 0.01) {
          active.style.setProperty("--lamp-a", "0");
          active = target;
        }
        frame = requestAnimationFrame(tick);
        return;
      }
      active = target;
      if (!active) return;
      pos.x += (goal.x - pos.x) * 0.14;
      pos.y += (goal.y - pos.y) * 0.14;
      alpha += (1 - alpha) * 0.1;
      active.style.setProperty("--lamp-x", `${pos.x.toFixed(1)}px`);
      active.style.setProperty("--lamp-y", `${pos.y.toFixed(1)}px`);
      active.style.setProperty("--lamp-a", alpha.toFixed(3));
      const settled = Math.abs(goal.x - pos.x) < 0.5 && Math.abs(goal.y - pos.y) < 0.5 && alpha > 0.99;
      if (!settled) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return null;
}
