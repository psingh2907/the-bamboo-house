import type { Viewport } from "next";
import { SiteDocument } from "@/components/site/SiteDocument";
import { rootMetadata } from "@/lib/seo";
import { fontVariables } from "../fonts";
import "../globals.css";

export const metadata = rootMetadata("hi");

export const viewport: Viewport = {
  themeColor: "#16110c",
  viewportFit: "cover",
};

export default function HindiLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteDocument locale="hi" fontClassName={fontVariables}>
      {children}
    </SiteDocument>
  );
}
