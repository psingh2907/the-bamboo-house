"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems } from "@/data/navigation";
import type { Locale } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { directionsUrl } from "@/lib/contact";
import { Icon } from "../ui/Icon";
import { TrackedLink } from "../ui/TrackedLink";
import { chip } from "./chip";
import { ExploreMenu } from "./ExploreMenu";
import { BrandChip, LanguageChip } from "./HeaderChips";

/**
 * Floating header: separate chips (brand · links · language · Explore)
 * instead of a full-width bar, so nothing wraps or gets cut off on phones
 * and the page runs full-bleed underneath. The wrapper ignores the pointer;
 * only the chips are clickable.
 */
export function Navbar({ locale = "en", hasBanner = false }: { locale?: Locale; hasBanner?: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const text = t(locale);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 z-50 transition-[top] duration-300",
        // Sit below the preview strip until it scrolls away.
        hasBanner && !scrolled ? "top-7" : "top-0",
      )}
    >
      <nav aria-label={text.nav.main} className="container-x flex items-center justify-between gap-2 py-3 lg:py-4">
        <BrandChip locale={locale} />

        <ul className={cn(chip(), "hidden gap-1 px-2 xl:flex")}>
          {navItems(locale).map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "label flex h-9 items-center rounded-xl px-4 transition-colors hover:text-bamboo-light",
                    active ? "bg-cream/10 text-bamboo" : "text-cream/85",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <LanguageChip locale={locale} />
          <TrackedLink
            href={directionsUrl}
            external
            track={{ event: "directions_click", params: { location: "navbar" } }}
            className={cn(chip("accent"), "hidden gap-2 px-4 text-sm font-semibold lg:inline-flex")}
          >
            <Icon name="pin" className="size-4" />
            {text.nav.directions}
          </TrackedLink>
          <ExploreMenu locale={locale} />
        </div>
      </nav>
    </header>
  );
}
