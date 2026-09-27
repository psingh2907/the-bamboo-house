"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { navLinks } from "@/data/navigation";
import { cn } from "@/lib/cn";
import { directionsUrl, phoneDisplay, phoneHref } from "@/lib/contact";
import { getLenis } from "@/lib/motion";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { OpenStatus } from "../ui/OpenStatus";
import { TrackedLink } from "../ui/TrackedLink";
import { Brand } from "./Brand";

export function Navbar({ banner }: { banner?: ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // The menu remembers the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll and listen for Escape while the menu is open.
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenOn(null);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 text-cream transition-[background-color,backdrop-filter,border-color] duration-500",
        scrolled || open ? "border-b border-smoke-line/70 bg-smoke/85 backdrop-blur-md" : "border-b border-transparent",
      )}
    >
      {banner && (
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-500",
            scrolled || open ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
          )}
        >
          <div className="overflow-hidden">{banner}</div>
        </div>
      )}
      <nav aria-label="Main" className="container-x flex h-16 items-center justify-between gap-6 lg:h-20">
        <Brand onClick={() => setOpen(false)} />

        <ul className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "label relative py-2 transition-colors hover:text-bamboo-light",
                    active ? "text-bamboo" : "text-cream/85",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-5 lg:flex">
          <TrackedLink
            href={phoneHref}
            track={{ event: "call_click", params: { location: "navbar" } }}
            className="text-sm text-cream/80 transition-colors hover:text-bamboo-light"
          >
            {phoneDisplay}
          </TrackedLink>
          <Button
            href={directionsUrl}
            external
            icon="pin"
            track={{ event: "directions_click", params: { location: "navbar" } }}
            className="min-h-11 px-5"
          >
            Get directions
          </Button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="-mr-2 inline-flex size-12 items-center justify-center lg:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden="true" className="relative block h-3 w-6">
            <span className={cn("absolute left-0 h-px w-6 bg-current transition-transform duration-300", open ? "top-1.5 rotate-45" : "top-0")} />
            <span className={cn("absolute left-0 h-px w-6 bg-current transition-transform duration-300", open ? "top-1.5 -rotate-45" : "top-3")} />
          </span>
        </button>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100svh-4rem)] overflow-y-auto bg-smoke lg:hidden"
      >
        <div className="container-x flex min-h-full flex-col justify-between pt-8 pb-28">
          <ul className="space-y-1">
            <li>
              <Link href="/" className="block py-2 font-display text-5xl text-cream">
                Home
              </Link>
            </li>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={cn("block py-2 font-display text-5xl", pathname === link.href ? "text-bamboo" : "text-cream")}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-12 space-y-4 border-t border-smoke-line pt-8 text-mist">
            <OpenStatus className="text-sm" />
            <TrackedLink
              href={phoneHref}
              track={{ event: "call_click", params: { location: "mobile_menu" } }}
              className="flex items-center gap-3 text-lg text-cream"
            >
              <Icon name="phone" className="size-5 text-bamboo" /> {phoneDisplay}
            </TrackedLink>
          </div>
        </div>
      </div>
    </header>
  );
}
