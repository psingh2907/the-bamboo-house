"use client";

import type { AnchorHTMLAttributes } from "react";
import { type AnalyticsEvent, type AnalyticsParams, trackEvent } from "@/lib/analytics";

export interface TrackOptions {
  event: AnalyticsEvent;
  params?: AnalyticsParams;
}

export interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** Opens in a new tab with safe `rel` attributes. */
  external?: boolean;
  track?: TrackOptions;
}

/** An anchor that reports an analytics event when clicked. */
export function TrackedLink({ href, external, track, onClick, children, ...rest }: TrackedLinkProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
      onClick={(event) => {
        if (track) trackEvent(track.event, track.params);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
