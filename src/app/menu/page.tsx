import { MenuBrowser } from "@/components/menu/MenuBrowser";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { business } from "@/data/business";
import { menu } from "@/data/menu";
import { phoneHref } from "@/lib/contact";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Menu",
  description: `The menu at ${business.name}, Syamardanda (Panna): starters, thalis, curries, breads, biryani, Chinese and drinks. Around ₹${business.priceRange.min}–${business.priceRange.max} per person.`,
  path: "/menu",
});

export default function MenuPage() {
  return (
    <>
      <PageHero
        eyebrow="Menu"
        title={
          <>
            Something for <em className="text-bamboo">everyone</em> at the table.
          </>
        }
        intro={`Starters to sweet lassi, cooked fresh every day. Around ₹${business.priceRange.min}–${business.priceRange.max} per person.`}
      >
        {siteConfig.prototypeMode && (
          <p className="max-w-xl rounded-2xl border border-clay/40 bg-clay/10 px-5 py-4 text-sm leading-relaxed text-bamboo-light">
            Sample menu: dishes and prices are placeholders to show the layout. They will be replaced with the restaurant&apos;s real menu.
          </p>
        )}
      </PageHero>

      <MenuBrowser menu={menu} />

      <section className="bg-smoke py-20 text-cream">
        <div className="container-x flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl font-display text-3xl leading-tight sm:text-4xl">
            Ask about <em className="text-bamboo">today&apos;s specials</em> — or order ahead for your group.
          </p>
          <Button href={phoneHref} icon="phone" track={{ event: "call_click", params: { location: "menu_footer" } }}>
            Call the restaurant
          </Button>
        </div>
      </section>

      <JsonLd data={breadcrumbJsonLd("Menu", "/menu")} />
    </>
  );
}
