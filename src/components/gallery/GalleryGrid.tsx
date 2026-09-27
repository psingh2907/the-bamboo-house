"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type GalleryItem, galleryCategories } from "@/data/gallery";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { getLenis } from "@/lib/motion";
import { Icon } from "../ui/Icon";
import { Media } from "../ui/Media";

type Filter = "All" | (typeof galleryCategories)[number];

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const visible = filter === "All" ? items : items.filter((item) => item.category === filter);
  const current = openIndex === null ? null : visible[openIndex];

  const open = (index: number, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    setOpenIndex(index);
    trackEvent("gallery_open", { image: visible[index].id });
  };

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) => setOpenIndex((i) => (i === null ? i : (i + delta + visible.length) % visible.length)),
    [visible.length],
  );

  // Native <dialog>: focus trapping, Escape and the backdrop come for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (openIndex !== null && !dialog.open) {
      dialog.showModal();
      getLenis()?.stop();
    } else if (openIndex === null && dialog.open) {
      dialog.close();
    }
  }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, step]);

  return (
    <div className="bg-paper py-12 sm:py-16">
      <div className="container-x">
        <div role="group" aria-label="Filter photos" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
          {(["All", ...galleryCategories] as Filter[]).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={filter === option}
              onClick={() => setFilter(option)}
              className={cn(
                "shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
                filter === option ? "border-smoke bg-smoke text-cream" : "border-ink/15 text-muted hover:border-ink/40 hover:text-ink",
              )}
            >
              {option}
            </button>
          ))}
        </div>

        <ul className="mt-10 grid auto-rows-[62vw] grid-cols-1 gap-4 sm:auto-rows-[34vw] sm:grid-cols-2 lg:auto-rows-[22vw] lg:grid-cols-3">
          {visible.map((item, i) => (
            <li key={item.id} className={cn("relative", item.wide && "sm:col-span-2")}>
              <button
                type="button"
                onClick={(e) => open(i, e.currentTarget)}
                className="group relative block size-full overflow-hidden rounded-[1.25rem] bg-smoke text-left"
              >
                <span className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.04]">
                  <Media visual={item} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" showLabel={false} />
                </span>
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-smoke/85 to-transparent p-5 pt-16 text-cream">
                  <span>
                    <span className="label block text-[0.6rem] text-bamboo">{item.category}</span>
                    <span className="mt-1 block font-display text-xl">{item.alt}</span>
                  </span>
                  <span className="sr-only">— open larger</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={current ? current.alt : "Photo"}
        onClose={() => {
          setOpenIndex(null);
          getLenis()?.start();
          openerRef.current?.focus();
        }}
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-auto size-full max-h-none max-w-none bg-transparent p-0 backdrop:bg-smoke/95 backdrop:backdrop-blur-sm"
      >
        {current && (
          <div className="flex size-full flex-col items-center justify-center gap-5 p-4 sm:p-10" onClick={(e) => e.target === e.currentTarget && close()}>
            <figure className="relative aspect-[4/5] w-full max-w-[min(90vw,62svh)] overflow-hidden rounded-[1.5rem]">
              <Media visual={current} sizes="90vw" />
            </figure>
            <div className="flex w-full max-w-[min(90vw,62svh)] items-center justify-between gap-4 text-cream">
              <div>
                <p className="label text-[0.6rem] text-bamboo">
                  {current.category} · {(openIndex ?? 0) + 1} / {visible.length}
                </p>
                <p className="mt-1 font-display text-xl">{current.alt}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => step(-1)} className="inline-flex size-12 items-center justify-center rounded-full border border-cream/25 hover:bg-cream/10">
                  <Icon name="chevronLeft" className="size-5" />
                  <span className="sr-only">Previous photo</span>
                </button>
                <button type="button" onClick={() => step(1)} className="inline-flex size-12 items-center justify-center rounded-full border border-cream/25 hover:bg-cream/10">
                  <Icon name="chevronRight" className="size-5" />
                  <span className="sr-only">Next photo</span>
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={close}
              className="absolute top-4 right-4 inline-flex size-12 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-cream/20"
            >
              <Icon name="close" className="size-5" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        )}
      </dialog>
    </div>
  );
}
