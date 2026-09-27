import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { Navbar } from "@/components/layout/Navbar";
import { PrototypeBanner } from "@/components/layout/PrototypeBanner";
import { Loader } from "@/components/loader/Loader";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { RestaurantSchema } from "@/components/seo/RestaurantSchema";
import { siteConfig } from "@/config/site";
import { business } from "@/data/business";
import { LOADER_INIT_SCRIPT } from "@/lib/intro";
import "./globals.css";

// Upright display face: preloaded, weight axis only (the opsz/SOFT axes more
// than doubled the file size for a barely visible difference).
const display = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

// Italic is only used for accent words, so it is not preloaded: it arrives
// after first paint instead of competing with the page. See globals.css.
const displayItalic = Fraunces({
  variable: "--font-fraunces-italic",
  subsets: ["latin"],
  style: "italic",
  display: "swap",
  preload: false,
});

const body = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const title = `${business.name} | Family Restaurant in Syamardanda, Panna`;
const description = `${business.name} is a family restaurant wrapped in bamboo in Syamardanda, near Devendranagar, Panna (MP). Open daily 11 am – 9:30 pm. See the menu, get directions or call.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: title, template: `%s | ${business.name}, Panna` },
  description,
  applicationName: business.name,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: siteConfig.locale, url: "/", siteName: business.name, title, description },
  twitter: { card: "summary_large_image", title, description },
  robots: siteConfig.prototypeMode ? { index: false, follow: false } : { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#16110c",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the head script adds loader classes to <html> before React hydrates.
    <html lang="en-IN" className={`${display.variable} ${displayItalic.variable} ${body.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LOADER_INIT_SCRIPT }} />
      </head>
      <body className="pb-action-bar min-h-svh lg:pb-0">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-cream focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>
        <Loader />
        <Navbar banner={<PrototypeBanner />} />
        <main id="main">{children}</main>
        <Footer />
        <MobileActionBar />
        <MotionProvider />
        <RestaurantSchema />

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
