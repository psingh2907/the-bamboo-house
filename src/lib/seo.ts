import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { business } from "@/data/business";
import { hasHindi, htmlLang, type Locale, localePath, ogLocale } from "@/i18n";

interface PageSeo {
  title: string;
  description: string;
  /** The English path, e.g. "/menu". */
  path: string;
  locale?: Locale;
}

/**
 * Per-page metadata: canonical URL, Open Graph / X cards, and hreflang
 * alternates linking the English and Hindi versions of the same page.
 */
export function pageMetadata({ title, description, path, locale = "en" }: PageSeo): Metadata {
  const url = localePath(locale, path);
  const languages = hasHindi(path)
    ? { [htmlLang.en]: path, [htmlLang.hi]: localePath("hi", path), "x-default": path }
    : undefined;
  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      title,
      description,
      url,
      siteName: locale === "hi" ? business.nameHi : business.name,
      type: "website",
      locale: ogLocale[locale],
      alternateLocale: hasHindi(path) ? [ogLocale[locale === "en" ? "hi" : "en"]] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** schema.org BreadcrumbList for inner pages. */
export function breadcrumbJsonLd(name: string, path: string, locale: Locale = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "hi" ? "होम" : "Home", item: new URL(localePath(locale, "/"), siteConfig.url).toString() },
      { "@type": "ListItem", position: 2, name, item: new URL(localePath(locale, path), siteConfig.url).toString() },
    ],
  };
}

/** Site-wide metadata shared by both root layouts. */
export function rootMetadata(locale: Locale): Metadata {
  const en = locale === "en";
  const name = en ? business.name : business.nameHi;
  const title = en
    ? `${business.name} | Family Restaurant in Syamardanda, Panna`
    : `${business.nameHi} | श्यामरदंडा, पन्ना का फ़ैमिली रेस्टोरेंट`;
  const description = en
    ? `${business.name} is a family restaurant wrapped in bamboo in Syamardanda, near Devendranagar, Panna (MP). Open daily 11 am – 9:30 pm. See the menu, get directions or call.`
    : `${business.nameHi} — देवेंद्रनगर के पास श्यामरदंडा, पन्ना (म.प्र.) में बाँस से सजा फ़ैमिली रेस्टोरेंट। रोज़ सुबह 11 बजे से रात 9:30 बजे तक खुला। मेन्यू देखें, रास्ता पाएँ या कॉल करें।`;
  return {
    // Page defaults first, so the title template below is not overwritten.
    ...pageMetadata({ title, description, path: "/", locale }),
    metadataBase: new URL(siteConfig.url),
    title: { default: title, template: `%s | ${name}, ${en ? "Panna" : "पन्ना"}` },
    description,
    applicationName: business.name,
    robots: siteConfig.prototypeMode ? { index: false, follow: false } : { index: true, follow: true },
    formatDetection: { telephone: false },
  };
}
