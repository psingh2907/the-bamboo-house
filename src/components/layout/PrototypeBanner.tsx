import { siteConfig } from "@/config/site";

/** Makes it obvious to the owner (and anyone they share it with) that this is a preview. */
export function PrototypeBanner() {
  if (!siteConfig.prototypeMode) return null;
  return (
    <div className="bg-clay-deep px-4 py-2 text-center text-[0.72rem] leading-snug font-medium text-cream">
      <span className="sm:hidden">Preview · sample menu &amp; illustrations</span>
      <span className="hidden sm:inline">
        Preview — menu, dishes and illustrations are sample content until the owner confirms them.
      </span>
    </div>
  );
}
