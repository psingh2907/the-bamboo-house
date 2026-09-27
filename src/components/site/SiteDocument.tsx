import type { ReactNode } from "react";
import Script from "next/script";
import { Footer } from "@/components/layout/Footer";
import { ActionDock } from "@/components/layout/ActionDock";
import { Navbar } from "@/components/layout/Navbar";
import { PrototypeBanner } from "@/components/layout/PrototypeBanner";
import { Loader } from "@/components/loader/Loader";
import { LampLight } from "@/components/motion/LampLight";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { RestaurantSchema } from "@/components/seo/RestaurantSchema";
import { siteConfig } from "@/config/site";
import { htmlLang, type Locale } from "@/i18n";
import { LOADER_INIT_SCRIPT } from "@/lib/intro";

const skipText: Record<Locale, string> = { en: "Skip to content", hi: "मुख्य सामग्री पर जाएँ" };

/**
 * The whole page shell (<html> to </body>), shared by the English and Hindi
 * root layouts. Each root layout passes its language and its fonts.
 */
export function SiteDocument({ locale, fontClassName, children }: { locale: Locale; fontClassName: string; children: ReactNode }) {
  return (
    // suppressHydrationWarning: the head script adds loader classes to <html> before React hydrates.
    <html lang={htmlLang[locale]} className={`${fontClassName} antialiased`} suppressHydrationWarning>
      {/* Rendered from the root layouts (app/(en) and app/hi), where <head> is correct. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: LOADER_INIT_SCRIPT }} />
      </head>
      <body className="min-h-svh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-cream focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink"
        >
          {skipText[locale]}
        </a>
        <Loader locale={locale} />
        {/* Preview strip: in the page flow, so it scrolls away (the header sits below it until then). */}
        <PrototypeBanner locale={locale} />
        <Navbar locale={locale} hasBanner={siteConfig.prototypeMode} />
        <main id="main">{children}</main>
        <Footer locale={locale} />
        <ActionDock locale={locale} />
        <MotionProvider />
        <LampLight />
        <RestaurantSchema locale={locale} />

        {siteConfig.gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.gaId}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${siteConfig.gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
