"use client";

import { useEffect, useRef, useState } from "react";
import type { MenuCategory } from "@/data/types";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { scrollToElement } from "@/lib/motion";

/** Indian food-labelling mark: green square/dot for veg, brown triangle for non-veg. */
function DietMark({ veg }: { veg: boolean }) {
  return (
    <span
      role="img"
      aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
      className={cn(
        "inline-flex size-3.5 shrink-0 items-center justify-center rounded-[2px] border-[1.5px]",
        veg ? "border-[#2e8b3a]" : "border-[#8a3b12]",
      )}
    >
      {veg ? (
        <span className="size-1.5 rounded-full bg-[#2e8b3a]" />
      ) : (
        <span className="size-0 border-x-[3.5px] border-b-[6px] border-x-transparent border-b-[#8a3b12]" />
      )}
    </span>
  );
}

export function MenuBrowser({ menu }: { menu: MenuCategory[] }) {
  const [active, setActive] = useState(menu[0]?.id);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackEvent("menu_view");
  }, []);

  // Highlight the category currently in view.
  useEffect(() => {
    const sections = menu.map((c) => document.getElementById(c.id)).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [menu]);

  // Keep the active tab visible in the horizontal strip.
  useEffect(() => {
    const tab = tabsRef.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    tab?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  return (
    <div className="bg-paper">
      <div className="sticky top-16 z-30 border-b border-ink/10 bg-paper/90 backdrop-blur-md lg:top-20">
        <div ref={tabsRef} className="container-x no-scrollbar flex gap-2 overflow-x-auto py-3">
          {menu.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              data-tab={category.id}
              aria-current={active === category.id ? "true" : undefined}
              onClick={(e) => {
                const target = document.getElementById(category.id);
                if (!target) return;
                e.preventDefault();
                scrollToElement(target, -150);
                history.replaceState(null, "", `#${category.id}`);
              }}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
                active === category.id ? "bg-smoke text-cream" : "text-muted hover:bg-ink/5 hover:text-ink",
              )}
            >
              {category.title}
            </a>
          ))}
        </div>
      </div>

      <div className="container-x py-16 sm:py-24">
        {menu.map((category, ci) => (
          <section key={category.id} id={category.id} aria-labelledby={`${category.id}-title`} className="scroll-mt-40 border-t border-ink/10 py-14 first:border-t-0 first:pt-0 lg:grid lg:grid-cols-[18rem_1fr] lg:gap-16">
            <div>
              <p className="label text-clay-deep">[ 0{ci + 1} ]</p>
              <h2 id={`${category.id}-title`} className="mt-3 font-display text-4xl tracking-[-0.02em] sm:text-5xl">
                {category.title}
              </h2>
              {category.note && <p className="mt-3 text-muted">{category.note}</p>}
            </div>
            <ul className="mt-8 grid gap-x-12 gap-y-7 md:grid-cols-2 lg:mt-2">
              {category.items.map((item) => (
                <li key={item.name}>
                  <div className="flex items-baseline gap-3">
                    <DietMark veg={item.veg} />
                    <h3 className="font-display text-xl leading-tight">
                      {item.name}
                      {item.signature && <span className="label ml-2 align-middle text-[0.58rem] text-clay-deep">Signature</span>}
                    </h3>
                    <span aria-hidden="true" className="mb-1 min-w-4 flex-1 border-b border-dotted border-ink/25" />
                    <span className="font-display text-lg text-clay-deep">₹{item.price}</span>
                  </div>
                  {item.description && <p className="mt-1.5 pl-6 text-sm leading-relaxed text-muted">{item.description}</p>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
