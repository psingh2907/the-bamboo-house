"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Progress dots under a horizontal swipe row (phones), so people can see
 * there is more to the side. Purely visual: the row itself is the control.
 */
export function ScrollDots({ targetId, count, tone = "light" }: { targetId: string; count: number; tone?: "light" | "dark" }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setActive(max <= 0 ? 0 : Math.round((el.scrollLeft / max) * (count - 1)));
    };
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [targetId, count]);

  return (
    <div aria-hidden="true" className="mt-5 flex justify-center gap-1.5 lg:hidden">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i === active ? "w-6" : "w-1.5",
            tone === "dark" ? (i === active ? "bg-bamboo" : "bg-cream/25") : i === active ? "bg-clay-deep" : "bg-ink/20",
          )}
        />
      ))}
    </div>
  );
}
