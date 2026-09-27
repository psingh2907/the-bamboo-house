"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { directionsUrl, phoneHref, whatsappHref } from "@/lib/contact";
import { Icon } from "../ui/Icon";
import { TrackedLink } from "../ui/TrackedLink";

/**
 * Floating action dock for phones and tablets: Call · Directions · WhatsApp —
 * the three conversions that matter most (brief §29, §31) — in one small
 * pill instead of a full-width tab bar.
 *
 * It keeps out of the way: hidden over the hero, hidden while scrolling
 * down (reading), back when scrolling up (looking for something), and hidden
 * over the Visit section and footer, which carry the same buttons.
 */
export function ActionDock({ locale = "en" }: { locale?: Locale }) {
  const text = t(locale).actionBar;
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const hideOver = () =>
      [...document.querySelectorAll<HTMLElement>("#visit, footer")].some((el) => {
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight * 0.85 && r.bottom > 0;
      });

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < 6) return; // ignore jitter
      lastY = y;
      // Up = looking for something → show; down = reading → hide.
      setShown(y > window.innerHeight * 0.6 && delta < 0 && !hideOver());
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const round =
    "inline-flex size-12 shrink-0 items-center justify-center rounded-full transition-transform duration-200 active:scale-90";

  return (
    <nav
      aria-label={text.label}
      aria-hidden={!shown}
      className={cn(
        "fixed left-1/2 z-40 -translate-x-1/2 transition-[opacity,translate] duration-500 ease-[var(--ease-expo)] lg:hidden",
        "bottom-[calc(1rem+env(safe-area-inset-bottom))]",
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[160%] opacity-0",
      )}
    >
      <div className="flex items-center gap-1.5 rounded-full bg-smoke/90 p-1.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] ring-1 ring-cream/15 backdrop-blur-md">
        <TrackedLink
          href={phoneHref}
          tabIndex={shown ? 0 : -1}
          aria-label={text.call}
          track={{ event: "call_click", params: { location: "dock" } }}
          className={cn(round, "bg-cream/10 text-cream")}
        >
          <Icon name="phone" className="size-5" />
        </TrackedLink>
        <TrackedLink
          href={directionsUrl}
          external
          tabIndex={shown ? 0 : -1}
          track={{ event: "directions_click", params: { location: "dock" } }}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-bamboo px-6 text-sm font-semibold whitespace-nowrap text-smoke transition-transform duration-200 active:scale-95"
        >
          <Icon name="pin" className="size-5" />
          {text.directions}
        </TrackedLink>
        <TrackedLink
          href={whatsappHref()}
          external
          tabIndex={shown ? 0 : -1}
          aria-label={text.whatsapp}
          track={{ event: "whatsapp_click", params: { location: "dock" } }}
          className={cn(round, "bg-whatsapp text-smoke")}
        >
          <Icon name="whatsapp" className="size-5" />
        </TrackedLink>
      </div>
    </nav>
  );
}
