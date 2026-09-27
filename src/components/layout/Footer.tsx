import Link from "next/link";
import { business } from "@/data/business";
import { navLinks } from "@/data/navigation";
import { fullAddress, phoneDisplay, phoneHref, placeUrl, socialLinks } from "@/lib/contact";
import { hoursLabel } from "@/lib/hours";
import { TigerGame } from "../game/TigerGame";
import { TrackedLink } from "../ui/TrackedLink";
import { Brand } from "./Brand";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-smoke text-mist">
      <TigerGame />

      <div className="container-x pb-10">
        <div className="grid gap-10 border-t border-smoke-line pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 text-cream">
            <Brand />
            {/* Entity description: keeps name, place and category consistent for local SEO. */}
            <p className="max-w-xs text-sm leading-relaxed text-mist">
              {business.name} is a {business.category.toLowerCase()} in {business.address.area}, near{" "}
              {business.address.locality}, {business.address.district} district, {business.address.state}.
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <p className="label text-bamboo">[ Visit ]</p>
            <address className="leading-relaxed not-italic">{fullAddress}</address>
            <p>Plus code {business.address.plusCode}</p>
          </div>

          <div className="space-y-3 text-sm">
            <p className="label text-bamboo">[ Hours & contact ]</p>
            <p>Open daily, {hoursLabel}</p>
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
                Google reviews ↗
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

          <nav aria-label="Footer" className="space-y-3 text-sm">
            <p className="label text-bamboo">[ Explore ]</p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-bamboo-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-smoke-line pt-6 text-xs sm:flex-row sm:justify-between">
          <p>
            © {year} {business.name}. All rights reserved. ·{" "}
            <Link href="/privacy" className="hover:text-bamboo-light">
              Privacy
            </Link>
          </p>
          <p>Syamardanda · Devendranagar · Panna · Madhya Pradesh</p>
        </div>
      </div>
    </footer>
  );
}
