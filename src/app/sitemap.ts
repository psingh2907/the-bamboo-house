import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { pagePaths } from "@/data/navigation";
import { hasHindi, htmlLang, localePath } from "@/i18n";

const abs = (path: string) => new URL(path, siteConfig.url).toString();

export default function sitemap(): MetadataRoute.Sitemap {
  const english = ["/", ...pagePaths, "/privacy"];
  const entries: MetadataRoute.Sitemap = [];
  for (const path of english) {
    const priority = path === "/" ? 1 : path === "/privacy" ? 0.3 : 0.8;
    const changeFrequency = path === "/menu" ? "weekly" : "monthly";
    const alternates = hasHindi(path)
      ? { languages: { [htmlLang.en]: abs(path), [htmlLang.hi]: abs(localePath("hi", path)) } }
      : undefined;
    entries.push({ url: abs(path), changeFrequency, priority, alternates });
    if (hasHindi(path)) entries.push({ url: abs(localePath("hi", path)), changeFrequency, priority, alternates });
  }
  return entries;
}
