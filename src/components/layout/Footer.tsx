import Link from "next/link";
import { business } from "@/data/business";
import { navItems } from "@/data/navigation";
import type { Locale } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { addressText, phoneDisplay, phoneHref, placeUrl, socialLinks } from "@/lib/contact";
import { hoursText } from "@/lib/hours";
import { TigerGame } from "../game/TigerGame";
import { TrackedLink } from "../ui/TrackedLink";
import { Brand } from "./Brand";

export function Footer({ locale = "en" }: { locale?: Locale }) {
  const year = new Date().getFullYear();
  const text = t(locale).footer;
  return (
    <footer className="bg-smoke text-mist">
      <TigerGame locale={locale} />

      <div className="container-x pb-10">
        <div className="grid gap-10 border-t border-smoke-line pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 text-cream">
            <Brand locale={locale} />
            {/* Both names, always: keeps the entity consistent for local search in either language. */}
            <p lang="hi" className="font-hand text-xl text-bamboo-light">
              {business.nameHi}
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
              <TrackedLink href={phoneHref} track={{ event: "call_click", params: { location: "footer" } }} className="text-cream hover:text-bamboo-light">
                {phoneDisplay}
              </TrackedLink>
            </p>
            <p>
              <TrackedLink
                href={placeUrl}
                external
                track={{ event: "google_reviews_click", params: { location: "footer" } }}
                className="hover:text-bamboo-light"
              >
                {text.reviews} ↗
              </TrackedLink>
            </p>
            {socialLinks.map((social) => (
              <p key={social.label}>
                <TrackedLink href={social.href} external track={{ event: "social_click", params: { network: social.label } }} className="hover:text-bamboo-light">
                  {social.label} ↗
                </TrackedLink>
              </p>
            ))}
          </div>

          <nav aria-label={text.explore} className="space-y-3 text-sm">
            <p className="label text-bamboo">[ {text.explore} ]</p>
            <ul className="space-y-2">
              {navItems(locale).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-bamboo-light">
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
            <Link href="/privacy" className="hover:text-bamboo-light">
              {text.privacy}
            </Link>
          </p>
          <p>{text.places}</p>
        </div>
      </div>
    </footer>
  );
}
