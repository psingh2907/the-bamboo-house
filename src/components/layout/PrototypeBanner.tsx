import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n";
import { t } from "@/i18n/dictionaries";

/** Makes it obvious to the owner (and anyone they share it with) that this is a preview. */
export function PrototypeBanner({ locale = "en" }: { locale?: Locale }) {
  if (!siteConfig.prototypeMode) return null;
  const text = t(locale).banner;
  return (
    <div className="relative z-[51] flex h-7 items-center justify-center truncate bg-clay-deep px-4 text-center text-[0.72rem] font-medium text-cream">
      <span className="sm:hidden">{text.short}</span>
      <span className="hidden sm:inline">{text.long}</span>
    </div>
  );
}
