import Link from "next/link";
import { directionsUrl, phoneHref } from "@/lib/contact";
import { Icon } from "../ui/Icon";
import { TrackedLink } from "../ui/TrackedLink";

/** Always-visible Call · Menu · Directions bar on phones (brief §31). */
export function MobileActionBar() {
  const item = "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[0.7rem] font-semibold tracking-[0.12em] uppercase";
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-smoke-line bg-smoke/95 pb-[env(safe-area-inset-bottom)] text-cream backdrop-blur-md lg:hidden"
    >
      <div className="flex">
        <TrackedLink href={phoneHref} track={{ event: "call_click", params: { location: "action_bar" } }} className={item}>
          <Icon name="phone" className="size-5 text-bamboo" />
          Call
        </TrackedLink>
        <Link href="/menu" className={`${item} border-x border-smoke-line`}>
          <Icon name="book" className="size-5 text-bamboo" />
          Menu
        </Link>
        <TrackedLink
          href={directionsUrl}
          external
          track={{ event: "directions_click", params: { location: "action_bar" } }}
          className={`${item} bg-bamboo text-smoke`}
        >
          <Icon name="pin" className="size-5" />
          Directions
        </TrackedLink>
      </div>
    </nav>
  );
}
