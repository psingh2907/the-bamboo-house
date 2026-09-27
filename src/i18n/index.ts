/**
 * Languages. English lives at the existing URLs; Hindi under /hi.
 * Only the pages listed in HINDI_PAGES exist in Hindi; everything else links
 * back to English.
 */
export type Locale = "en" | "hi";

export const htmlLang: Record<Locale, string> = { en: "en-IN", hi: "hi-IN" };
export const ogLocale: Record<Locale, string> = { en: "en_IN", hi: "hi_IN" };

/** English paths that also have a Hindi version. */
export const HINDI_PAGES = ["/", "/menu", "/contact"] as const;

export const hasHindi = (path: string) => (HINDI_PAGES as readonly string[]).includes(path);

/** "/menu" → "/hi/menu" for Hindi; unchanged for English. */
export function localePath(locale: Locale, path: string): string {
  if (locale === "en") return path;
  return path === "/" ? "/hi" : `/hi${path}`;
}

/** "/hi/menu" → "/menu". */
export function englishPath(pathname: string): string {
  if (pathname === "/hi") return "/";
  return pathname.startsWith("/hi/") ? pathname.slice(3) : pathname;
}

/** The same page in the other language, or that language's home if it has no equivalent. */
export function switchPath(locale: Locale, pathname: string): string {
  const en = englishPath(pathname);
  if (locale === "hi") return en; // Hindi → English: every Hindi page exists in English
  return hasHindi(en) ? localePath("hi", en) : "/hi";
}

/** Picks the Hindi value when there is one, otherwise English. */
export function pick<T>(locale: Locale, en: T, hi: T | undefined): T {
  return locale === "hi" && hi !== undefined ? hi : en;
}

/** "21:30" → "9:30 pm" / "रात 9:30 बजे". */
export function formatTime(locale: Locale, hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const hour = h % 12 || 12;
  const clock = m ? `${hour}:${String(m).padStart(2, "0")}` : `${hour}`;
  if (locale === "en") return `${clock} ${h >= 12 ? "pm" : "am"}`;
  const part = h < 4 ? "रात" : h < 12 ? "सुबह" : h < 16 ? "दोपहर" : h < 19 ? "शाम" : "रात";
  return `${part} ${clock} बजे`;
}
