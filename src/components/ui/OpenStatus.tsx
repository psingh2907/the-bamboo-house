"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { getOpenStatus, hoursLabel, type OpenStatus as Status } from "@/lib/hours";

/**
 * Live "Open now" badge. Renders the static hours on the server and swaps
 * in the live status after mount, so there is no hydration mismatch.
 */
export function OpenStatus({ className }: { className?: string }) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "size-2 rounded-full",
          status === null ? "bg-bamboo" : status.open ? "bg-[#6fcf6f] shadow-[0_0_0_4px_rgba(111,207,111,0.18)]" : "bg-clay",
        )}
      />
      <span>{status ? status.label : `Open daily · ${hoursLabel}`}</span>
    </span>
  );
}
