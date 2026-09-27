import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  /** Short bracketed label above the title, e.g. "02 — Food". */
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "light",
  align = "left",
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)} data-reveal>
      <p className={cn("label", dark ? "text-bamboo" : "text-clay-deep")}>[ {eyebrow} ]</p>
      <Tag
        className={cn(
          "mt-5 font-display text-[clamp(2.4rem,6vw,4.75rem)] leading-[0.98] font-medium tracking-[-0.02em]",
          dark ? "text-cream" : "text-ink",
        )}
      >
        {title}
      </Tag>
      {intro && (
        <p className={cn("mt-6 max-w-xl text-base leading-relaxed sm:text-lg", align === "center" && "mx-auto", dark ? "text-mist" : "text-muted")}>
          {intro}
        </p>
      )}
    </div>
  );
}
