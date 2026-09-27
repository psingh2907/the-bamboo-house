import type { Metadata } from "next";
import { MenuBrowser } from "@/components/menu/MenuBrowser";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Accent } from "@/components/ui/Accent";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { business } from "@/data/business";
import { menu } from "@/data/menu";
import type { Locale } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { phoneHref } from "@/lib/contact";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

const { min, max } = business.priceRange;

export const menuMetadata = (locale: Locale): Metadata => {
  const text = t(locale).menuPage;
  return pageMetadata({ title: text.metaTitle, description: text.metaDescription(min, max), path: "/menu", locale });
};

/** The menu page, in either language (/menu and /hi/menu). */
export function MenuPage({ locale }: { locale: Locale }) {
  const text = t(locale).menuPage;
  return (
    <>
      <PageHero eyebrow={text.eyebrow} title={<Accent parts={text.title} className="text-bamboo" />} intro={text.intro(min, max)}>
        {siteConfig.prototypeMode && (
          <p className="max-w-xl rounded-2xl border border-clay/40 bg-clay/10 px-5 py-4 text-sm leading-relaxed text-bamboo-light">
            {text.sample}
          </p>
        )}
      </PageHero>

      <MenuBrowser menu={menu} locale={locale} />

      <section className="lamp bg-smoke py-20 text-cream">
        <div className="container-x flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl font-display text-3xl leading-tight sm:text-4xl">
            <Accent parts={text.specials} className="text-bamboo" />
          </p>
          <Button href={phoneHref} icon="phone" track={{ event: "call_click", params: { location: "menu_footer" } }}>
            {text.call}
          </Button>
        </div>
      </section>

      <JsonLd data={breadcrumbJsonLd(text.metaTitle, "/menu", locale)} />
    </>
  );
}
