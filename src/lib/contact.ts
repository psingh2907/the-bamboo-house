import { business } from "@/data/business";
import type { Locale } from "@/i18n";
import { isConfigured } from "@/lib/placeholders";

const digits = (value: string) => value.replace(/\D/g, "");

const { lat, lng } = business.geo;
const coords = `${lat},${lng}`;

export const phoneHref = `tel:+${digits(business.contact.phone)}`;

/** Local display format, e.g. "079876 29286". */
export const phoneDisplay = business.contact.phone.replace(/^\+91\s*/, "0");

export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${digits(business.contact.whatsapp)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Opens the listing itself (photos, reviews). */
export const placeUrl = `https://maps.google.com/?cid=${business.googleCid}`;

/** Starts turn-by-turn navigation to the exact pin. */
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords}`;

/** Keyless embed centred on the pin. */
export const mapEmbedUrl = `https://www.google.com/maps?q=${coords}&z=15&output=embed`;

/** Full postal address in the page's language. */
export function addressText(locale: Locale = "en"): string {
  const a = business.address;
  if (locale === "hi") {
    const h = business.addressHi;
    return `${h.area}, ${h.locality}, ${h.district} ज़िला, ${h.state} ${a.postalCode}`;
  }
  return `${a.area}, ${a.locality}, ${a.district} district, ${a.state} ${a.postalCode}`;
}

export const socialLinks = (
  [
    { label: "Instagram", href: business.socials.instagram },
    { label: "Facebook", href: business.socials.facebook },
  ] as const
).filter((link) => isConfigured(link.href));
