import Link from "next/link";
import { type Locale, localePath } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";

/** Bamboo mark: three culms with nodes. Temporary until the owner's logo arrives. */
export function BambooMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="currentColor">
      <rect x="6" y="5" width="5" height="23" rx="2.5" />
      <rect x="13.5" y="2" width="5" height="27" rx="2.5" />
      <rect x="21" y="7" width="5" height="21" rx="2.5" />
      <g fill="var(--color-smoke, #16110c)" opacity="0.55">
        <rect x="6" y="12" width="5" height="1.4" />
        <rect x="6" y="21" width="5" height="1.4" />
        <rect x="13.5" y="9" width="5" height="1.4" />
        <rect x="13.5" y="18" width="5" height="1.4" />
        <rect x="21" y="15" width="5" height="1.4" />
      </g>
    </svg>
  );
}

export function Brand({ className, onClick, locale = "en" }: { className?: string; onClick?: () => void; locale?: Locale }) {
  return (
    <Link href={localePath(locale, "/")} onClick={onClick} className={cn("group inline-flex items-center gap-2.5", className)} aria-label={t(locale).brand.home}>
      <BambooMark className="size-7 text-bamboo transition-transform duration-500 group-hover:-rotate-6" />
      <span className="font-display text-[1.2rem] leading-none font-medium tracking-[-0.01em]">
        The Bamboo House
      </span>
    </Link>
  );
}
