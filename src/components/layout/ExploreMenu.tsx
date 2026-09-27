"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { navItems } from "@/data/navigation";
import { type Locale, localePath } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { directionsUrl, phoneDisplay, phoneHref, socialLinks, whatsappHref } from "@/lib/contact";
import { getLenis } from "@/lib/motion";
import { Icon } from "../ui/Icon";
import { OpenStatus } from "../ui/OpenStatus";
import { TrackedLink } from "../ui/TrackedLink";
import { BambooMark } from "./Brand";
import { chip } from "./chip";
import { BrandChip, LanguageChip } from "./HeaderChips";

/**
 * Full-screen site menu (after JP Pizzeria's): a dark panel that grows out of
 * the Explore button as a circle, with big handwritten links over faint
 * bamboo, and the ways to reach us underneath.
 *
 * A native <dialog>, so focus is trapped and Escape works. The reveal is a
 * clip-path transition (see `.explore-menu` in globals.css).
 */
export function ExploreMenu({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const text = t(locale);
  const links = [{ href: localePath(locale, "/"), label: text.nav.home, englishOnly: false }, ...navItems(locale)];

  const open = () => {
    const el = dialog.current;
    const button = opener.current;
    if (!el || !button) return;
    // Grow the circle out of the button.
    const r = button.getBoundingClientRect();
    el.style.setProperty("--ox", `${r.left + r.width / 2}px`);
    el.style.setProperty("--oy", `${r.top + r.height / 2}px`);
    el.showModal();
    getLenis()?.stop();
    requestAnimationFrame(() => setVisible(true));
  };

  const close = useCallback(() => {
    const el = dialog.current;
    if (!el?.open) return;
    setVisible(false);
    const done = () => {
      el.close();
      getLenis()?.start();
      opener.current?.focus();
    };
    // Wait for the circle to close; the timeout covers reduced motion.
    const timer = window.setTimeout(done, 650);
    el.addEventListener(
      "transitionend",
      (e) => {
        if (e.target !== el) return;
        window.clearTimeout(timer);
        done();
      },
      { once: true },
    );
  }, []);

  // Navigating away closes the menu.
  useEffect(() => close(), [pathname, close]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(phoneDisplay);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked: the number is still visible to copy by hand.
    }
  };

  return (
    <>
      <button
        ref={opener}
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className={cn(chip(), "inline-flex gap-2.5 px-4 text-sm font-semibold")}
      >
        <BambooMark className="size-5 text-bamboo" />
        <span>{text.nav.explore}</span>
      </button>

      <dialog
        ref={dialog}
        aria-label={text.explore.dialog}
        data-open={visible ? "" : undefined}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        className="explore-menu m-0 h-svh max-h-none w-screen max-w-none overflow-y-auto bg-smoke p-0 text-cream backdrop:bg-transparent"
      >
        <BambooGrove />

        <div className="relative flex min-h-svh flex-col">
          {/* Mirrors the floating header, so Close sits exactly where Explore was. */}
          <div className="container-x flex items-center justify-between py-3 lg:py-4">
            <BrandChip locale={locale} onClick={close} />
            <div className="flex items-center gap-2">
              <LanguageChip locale={locale} />
              <button
                type="button"
                onClick={close}
                className={cn(chip("light"), "inline-flex gap-2.5 px-4 text-sm font-semibold")}
              >
                <Icon name="close" className="size-4" />
                <span>{text.nav.close}</span>
              </button>
            </div>
          </div>

          <nav aria-label={text.nav.main} className="flex flex-1 flex-col items-center justify-center py-10">
            <ul className="text-center">
              {links.map((link, i) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href} className="explore-link" style={{ animationDelay: `${120 + i * 60}ms` }}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={close}
                      className={cn(
                        "font-hand relative inline-block text-[clamp(3rem,11vw,6.5rem)] leading-[1.08] transition-colors duration-300 hover:text-bamboo",
                        active ? "text-bamboo" : "text-cream",
                      )}
                    >
                      {link.label}
                      {link.englishOnly && (
                        <span className="label absolute -top-1 -right-9 rounded-full border border-cream/30 px-1.5 py-0.5 text-[0.55rem] text-mist">
                          {text.nav.englishOnly}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="explore-link container-x pb-10 text-center" style={{ animationDelay: "480ms" }}>
            <p className="font-hand text-2xl text-mist">{text.explore.callOrWhatsApp}</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <TrackedLink
                href={phoneHref}
                track={{ event: "call_click", params: { location: "explore_menu" } }}
                className="text-lg text-cream hover:text-bamboo-light"
              >
                {phoneDisplay}
              </TrackedLink>
              <button
                type="button"
                onClick={copy}
                aria-label={text.explore.copy}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-cream/25 px-2.5 text-xs text-mist hover:border-bamboo hover:text-bamboo-light"
              >
                <Icon name={copied ? "check" : "copy"} className="size-3.5" />
                <span aria-live="polite">{copied ? text.explore.copied : text.explore.copy}</span>
              </button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <TrackedLink
                href={whatsappHref()}
                external
                track={{ event: "whatsapp_click", params: { location: "explore_menu" } }}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-whatsapp px-5 text-sm font-semibold text-smoke"
              >
                <Icon name="whatsapp" className="size-4" /> {text.explore.whatsapp}
              </TrackedLink>
              <TrackedLink
                href={directionsUrl}
                external
                track={{ event: "directions_click", params: { location: "explore_menu" } }}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-bamboo px-5 text-sm font-semibold text-smoke"
              >
                <Icon name="pin" className="size-4" /> {text.explore.directions}
              </TrackedLink>
            </div>
            <OpenStatus locale={locale} className="mt-6 text-sm text-mist" />
            {socialLinks.length > 0 && (
              <div className="mt-5 flex items-center justify-center gap-3 text-sm text-mist">
                <span className="font-hand text-lg">{text.explore.follow}</span>
                {socialLinks.map((social) => (
                  <TrackedLink
                    key={social.label}
                    href={social.href}
                    external
                    aria-label={social.label}
                    track={{ event: "social_click", params: { network: social.label, location: "explore_menu" } }}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-cream/25 text-cream hover:border-bamboo hover:text-bamboo-light"
                  >
                    <Icon name={social.icon} className="size-[1.1rem]" />
                  </TrackedLink>
                ))}
              </div>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}

/** Faint bamboo culms and leaves behind the menu (JP's fern backdrop, in bamboo). */
function BambooGrove() {
  const culms = [6, 16, 84, 94];
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full opacity-[0.07]">
      {culms.map((x, i) => (
        <g key={x}>
          <rect x={x - 1.4} y={-2} width={2.8} height={104} fill="#e7cf9e" transform={`rotate(${i % 2 ? 2 : -2} ${x} 50)`} />
          {[18, 42, 66, 88].map((y) => (
            <rect key={y} x={x - 1.8} y={y + (i % 2) * 6} width={3.6} height={0.7} fill="#16110c" transform={`rotate(${i % 2 ? 2 : -2} ${x} 50)`} />
          ))}
          {[24, 52, 78].map((y, j) => (
            <path
              key={y}
              d={`M${x} ${y} q ${j % 2 ? 7 : -7} -4 ${j % 2 ? 13 : -13} -1 q ${j % 2 ? -6 : 6} 3 ${j % 2 ? -13 : 13} 1 z`}
              fill="#e7cf9e"
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
