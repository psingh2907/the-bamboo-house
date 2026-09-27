import { cn } from "@/lib/cn";

/**
 * A headline with one accented phrase: ["A place worth ", "stopping", " for."].
 * The accent is set in the handwritten face (see `.font-display em` in globals.css).
 */
export function Accent({ parts, className }: { parts: readonly string[]; className?: string }) {
  const [before, accent, after] = parts;
  return (
    <>
      {before}
      <em className={cn("not-italic", className)}>{accent}</em>
      {after}
    </>
  );
}
