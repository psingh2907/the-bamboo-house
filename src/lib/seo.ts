import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { business } from "@/data/business";

interface PageSeo {
  title: string;
  description: string;
  path: string;
}

/** Per-page metadata with canonical URL and matching Open Graph / X cards. */
export function pageMetadata({ title, description, path }: PageSeo): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: business.name, type: "website", locale: siteConfig.locale },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** schema.org BreadcrumbList for inner pages. */
export function breadcrumbJsonLd(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name, item: new URL(path, siteConfig.url).toString() },
    ],
  };
}
