import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { navLinks } from "@/data/navigation";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [{ href: "/" }, ...navLinks, { href: "/privacy" }];
  return pages.map(({ href }) => ({
    url: new URL(href, siteConfig.url).toString(),
    changeFrequency: href === "/menu" ? "weekly" : "monthly",
    priority: href === "/" ? 1 : href === "/privacy" ? 0.3 : 0.8,
  }));
}
