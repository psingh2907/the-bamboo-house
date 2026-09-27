import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";
import { TrackedLink, type TrackOptions } from "./TrackedLink";

type Variant = "primary" | "outline" | "ghost" | "whatsapp";
type Tone = "dark" | "light";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  /** The background the button sits on. */
  tone?: Tone;
  icon?: IconName;
  external?: boolean;
  track?: TrackOptions;
  className?: string;
  "aria-label"?: string;
}

const base =
  "group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 text-sm font-semibold tracking-wide whitespace-nowrap transition-[background-color,color,border-color,transform] duration-300 ease-[var(--ease-soft)] active:scale-[0.98]";

const styles: Record<Variant, Record<Tone, string>> = {
  primary: {
    dark: "bg-bamboo text-smoke hover:bg-bamboo-light",
    light: "bg-smoke text-cream hover:bg-clay-deep",
  },
  outline: {
    dark: "border border-bamboo/50 text-cream hover:border-bamboo hover:bg-bamboo/10",
    light: "border border-ink/25 text-ink hover:border-ink hover:bg-ink/5",
  },
  ghost: {
    dark: "px-2 text-bamboo-light underline-offset-4 hover:underline",
    light: "px-2 text-clay-deep underline-offset-4 hover:underline",
  },
  whatsapp: {
    dark: "bg-whatsapp text-smoke hover:brightness-110",
    light: "bg-whatsapp text-smoke hover:brightness-110",
  },
};

export function Button({
  href,
  children,
  variant = "primary",
  tone = "dark",
  icon,
  external,
  track,
  className,
  ...rest
}: ButtonProps) {
  const classes = cn(base, styles[variant][tone], className);
  const content = (
    <>
      {icon && <Icon name={icon} className="size-[1.15rem] shrink-0" />}
      <span>{children}</span>
      {variant === "ghost" && (
        <Icon name="arrow" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  );

  // Internal links get client-side navigation; everything else is a plain anchor.
  if (href.startsWith("/") && !track) {
    return (
      <Link href={href} className={classes} aria-label={rest["aria-label"]}>
        {content}
      </Link>
    );
  }

  return (
    <TrackedLink href={href} external={external} track={track} className={classes} aria-label={rest["aria-label"]}>
      {content}
    </TrackedLink>
  );
}
