"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Locale, localePath, switchPath } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { BambooMark } from "./Brand";
import { chip } from "./chip";

/** Brand chip: the bamboo mark, plus the name from small tablets up. */
export function BrandChip({ locale, onClick }: { locale: Locale; onClick?: () => void }) {
  return (
    <Link href={localePath(locale, "/")} onClick={onClick} className={cn(chip(), "group inline-flex gap-2.5 px-3 sm:px-4")}>
      <BambooMark className="size-6 text-bamboo transition-transform duration-500 group-hover:-rotate-6" />
      {/* The name is always the link's accessible name; it is only visible from sm up. */}
      <span className="sr-only font-display text-[1.1rem] leading-none font-medium tracking-[-0.01em] whitespace-nowrap sm:not-sr-only">
        {locale === "hi" ? "द बैम्बू हाउस" : "The Bamboo House"}
      </span>
    </Link>
  );
}

/** Language chip: "हिं"/"EN" on phones, "हिंदी"/"English" from md up. Full reload (separate root layouts). */
export function LanguageChip({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const other = locale === "en" ? "hi" : "en";
  return (
    <a
      href={switchPath(locale, pathname)}
      hrefLang={other}
      lang={other}
      title={t(locale).nav.switchAria}
      className={cn(chip(), "inline-flex justify-center px-3.5 text-sm font-semibold")}
    >
      {/* Short on phones; the full language name is always the accessible name. */}
      <span aria-hidden="true" className="md:hidden">
        {locale === "en" ? "हिं" : "EN"}
      </span>
      <span className="sr-only md:not-sr-only">{locale === "en" ? "हिंदी" : "English"}</span>
    </a>
  );
}
