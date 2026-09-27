import { siteConfig } from "@/config/site";
import { business } from "@/data/business";
import { placeUrl, socialLinks } from "@/lib/contact";
import { JsonLd } from "./JsonLd";

/**
 * schema.org Restaurant + WebSite markup, built only from real values.
 *
 * Left out on purpose:
 *  - aggregateRating / review: Google does not allow a business to mark up
 *    its own reviews (self-serving), so the rating is shown but not marked up.
 *  - servesCuisine and menu items: add once the owner confirms the real menu.
 */
export function RestaurantSchema() {
  const { address, contact, hours, priceRange } = business;
  const url = siteConfig.url;

  const restaurant: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${url}/#restaurant`,
    name: business.name,
    description: business.description,
    url,
    telephone: contact.phone.replace(/\s/g, ""),
    priceRange: `₹${priceRange.min}–${priceRange.max}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.area,
      addressLocality: address.locality,
      addressRegion: address.state,
      postalCode: address.postalCode,
      addressCountry: "IN",
    },
    geo: { "@type": "GeoCoordinates", latitude: business.geo.lat, longitude: business.geo.lng },
    hasMap: placeUrl,
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: hours.days, opens: hours.opens, closes: hours.closes },
    ],
  };
  // The sample menu is not real data, so it is only referenced in production.
  if (!siteConfig.prototypeMode) restaurant.hasMenu = `${url}/menu`;
  const sameAs = [placeUrl, ...socialLinks.map((s) => s.href)];
  restaurant.sameAs = sameAs;

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name: business.name,
    url,
    inLanguage: "en-IN",
    publisher: { "@id": `${url}/#restaurant` },
  };

  return (
    <>
      <JsonLd data={restaurant} />
      <JsonLd data={website} />
    </>
  );
}
