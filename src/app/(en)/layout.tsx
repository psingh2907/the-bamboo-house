import type { Viewport } from "next";
import { SiteDocument } from "@/components/site/SiteDocument";
import { rootMetadata } from "@/lib/seo";
import { fontVariables } from "../fonts";
import "../globals.css";

export const metadata = rootMetadata("en");

export const viewport: Viewport = {
  themeColor: "#16110c",
  viewportFit: "cover",
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteDocument locale="en" fontClassName={fontVariables}>
      {children}
    </SiteDocument>
  );
}
