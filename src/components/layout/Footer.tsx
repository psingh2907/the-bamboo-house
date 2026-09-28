import Link from "next/link";
import { business } from "@/data/business";
import { navItems } from "@/data/navigation";
import type { Locale } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { addressText, directionsUrl, phoneDisplay, phoneHref, placeUrl, socialLinks, whatsappHref } from "@/lib/contact";
import { hoursText } from "@/lib/hours";
import { TigerGame } from "../game/TigerGame";
import { Icon } from "../ui/Icon";
import { TrackedLink } from "../ui/TrackedLink";
import { Brand } from "./Brand";

export function Footer({ locale = "en" }: { locale?: Locale }) {
  const year = new Date().getFullYear();
  const text = t(locale).footer;
  const actions = t(locale).actionBar;
  return (
    <footer className="bg-smoke text-mist">
      <TigerGame locale={locale} />

      <div className="container-x pb-10">
        {/* Phones: the three things people come to the footer for, as buttons. */}
        <div className="grid grid-cols-3 gap-2 border-t border-smoke-line pt-8 lg:hidden">
          <TrackedLink href={phoneHref} track={{ event: "call_click", params: { location: "footer_actions" } }} className={footerAction}>
            <Icon name="phone" className="size-5 text-bamboo" />
            {actions.call}
          </TrackedLink>
          <TrackedLink href={whatsappHref()} external track={{ event: "whatsapp_click", params: { location: "footer_actions" } }} className={footerAction}>
            <Icon name="whatsapp" className="size-5 text-whatsapp" />
            {actions.whatsapp}
          </TrackedLink>
          <TrackedLink href={directionsUrl} external track={{ event: "directions_click", params: { location: "footer_actions" } }} className={footerAction}>
            <Icon name="pin" className="size-5 text-bamboo" />
            {actions.directions}
          </TrackedLink>
        </div>

        <div className="grid gap-8 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:border-t lg:border-smoke-line lg:pt-12">
          <div className="space-y-4 text-cream">
            <Brand locale={locale} />
            {/* Both names, always: the other language's name under the brand keeps the
                entity consistent for local search in either language. */}
            <p lang={locale === "hi" ? "en" : "hi"} className="font-hand text-xl text-bamboo-light">
              {locale === "hi" ? business.name : business.nameHi}
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-mist">{text.entity}</p>
          </div>

          <div className="space-y-3 text-sm">
            <p className="label text-bamboo">[ {text.visit} ]</p>
            <address className="leading-relaxed not-italic">{addressText(locale)}</address>
            <p>{text.plusCode(business.address.plusCode)}</p>
          </div>

          <div className="space-y-3 text-sm">
            <p className="label text-bamboo">[ {text.contact} ]</p>
            <p>{text.openDaily(hoursText(locale))}</p>
            <p>
              <TrackedLink href={phoneHref} track={{ event: "call_click", params: { location: "footer" } }} className="inline-flex min-h-11 items-center text-cream hover:text-bamboo-light lg:min-h-0">
                {phoneDisplay}
              </TrackedLink>
            </p>
            <p>
              <TrackedLink
                href={placeUrl}
                external
                track={{ event: "google_reviews_click", params: { location: "footer" } }}
                className="inline-flex min-h-11 items-center hover:text-bamboo-light lg:min-h-0"
              >
                {text.reviews} ↗
              </TrackedLink>
            </p>
            {socialLinks.length > 0 && (
              <p className="flex gap-2 pt-1">
                {socialLinks.map((social) => (
                  <TrackedLink
                    key={social.label}
                    href={social.href}
                    external
                    aria-label={social.label}
                    track={{ event: "social_click", params: { network: social.label, location: "footer" } }}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-cream/20 text-cream transition-colors hover:border-bamboo hover:text-bamboo-light"
                  >
                    <Icon name={social.icon} className="size-[1.1rem]" />
                  </TrackedLink>
                ))}
              </p>
            )}
          </div>

          <nav aria-label={text.explore} className="space-y-3 text-sm">
            <p className="label text-bamboo">[ {text.explore} ]</p>
            <ul className="grid grid-cols-2 gap-x-6 lg:grid-cols-1 lg:gap-y-2">
              {navItems(locale).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex min-h-11 items-center hover:text-bamboo-light lg:inline lg:min-h-0">
                    {link.label}
                    {link.englishOnly && <span className="ml-1.5 text-xs text-mist/70">(EN)</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-smoke-line pt-6 text-xs sm:flex-row sm:justify-between">
          <p>
            © {year} {locale === "hi" ? business.nameHi : business.name}. {text.rights} ·{" "}
            <Link href="/privacy" className="inline-flex min-h-11 items-center hover:text-bamboo-light sm:min-h-0">
              {text.privacy}
            </Link>
          </p>
          <p>{text.places}</p>
        </div>
      </div>
    </footer>
  );
}

const footerAction =
  "flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-2xl bg-smoke-soft text-xs font-semibold text-cream ring-1 ring-smoke-line transition active:scale-95";
