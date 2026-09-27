import { type Locale, hasHindi, localePath } from "@/i18n";
import { t } from "@/i18n/dictionaries";

export interface NavItem {
  href: string;
  label: string;
  /** The page only exists in English (shown with an "EN" tag on Hindi pages). */
  englishOnly: boolean;
}

const pages = [
  { path: "/menu", key: "menu" },
  { path: "/about", key: "about" },
  { path: "/gallery", key: "gallery" },
  { path: "/contact", key: "visit" },
] as const;

/** Main navigation in the page's language, pointing at that language's pages where they exist. */
export function navItems(locale: Locale): NavItem[] {
  const labels = t(locale).nav;
  return pages.map(({ path, key }) => {
    const translated = locale === "hi" && hasHindi(path);
    return {
      href: translated ? localePath("hi", path) : path,
      label: labels[key],
      englishOnly: locale === "hi" && !translated,
    };
  });
}

/** English page paths (sitemap). */
export const pagePaths = pages.map((p) => p.path);
