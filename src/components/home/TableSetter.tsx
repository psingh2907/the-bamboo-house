"use client";

import { useState } from "react";
import type { Locale } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { phoneDisplay, phoneHref, whatsappHref } from "@/lib/contact";
import { Icon } from "../ui/Icon";
import { Accent } from "../ui/Accent";
import { SectionHeading } from "../ui/SectionHeading";

/**
 * "How many of you?" — pick a group size and watch the table set itself,
 * then ask for a table on WhatsApp. (Oryzo's "your input moves the object",
 * turned into a conversion.) It asks rather than books: reservations are not
 * confirmed with the owner yet (owner checklist Q10).
 */

const MAX = 20;

// Table drawing, in viewBox units.
const VB_W = 800;
const VB_H = 380;

function layout(guests: number) {
  const perSide = Math.max(1, Math.ceil(guests / 2));
  const length = Math.min(720, 170 + perSide * 88);
  const plate = Math.min(66, ((length - 60) / perSide) * 0.7);
  const tableH = plate * 2 + 70;
  const x = (VB_W - length) / 2;
  const y = (VB_H - tableH) / 2;
  const seats = Array.from({ length: guests }, (_, i) => {
    const top = i % 2 === 0; // alternate sides so the table fills evenly
    const col = Math.floor(i / 2);
    const colsOnSide = top ? Math.ceil(guests / 2) : Math.floor(guests / 2);
    const step = length / colsOnSide;
    return {
      x: x + step * (col + 0.5),
      y: top ? y + plate / 2 + 16 : y + tableH - plate / 2 - 16,
      top,
    };
  });
  return { length, tableH, x, y, plate, seats };
}

const ANOTHER_DAY = 3;

export function TableSetter({ locale = "en" }: { locale?: Locale }) {
  const text = t(locale).table;
  const [guests, setGuests] = useState(4);
  const [day, setDay] = useState(1); // index into text.days: "Tomorrow"
  const [meal, setMeal] = useState<number | null>(1); // "Dinner"

  const { length, tableH, x, y, plate, seats } = layout(guests);
  const lower = (s: string) => (locale === "en" ? s.toLowerCase() : s);
  const when = [day === ANOTHER_DAY ? null : lower(text.days[day]), meal === null ? null : lower(text.meals[meal])]
    .filter(Boolean)
    .join(", ");
  const message = text.message(guests, when);
  const set = (n: number) => setGuests(Math.min(MAX, Math.max(1, n)));

  const chip = (active: boolean) =>
    cn(
      "min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors",
      active ? "border-smoke bg-smoke text-cream" : "border-ink/15 text-muted hover:border-ink/40 hover:text-ink",
    );

  return (
    // Phones: shares the Visit section's background and runs straight into it,
    // in the order heading → table → controls (grid areas below).
    <section id="your-table" aria-labelledby="table-title" className="scroll-mt-20 bg-paper pt-16 pb-2 lg:bg-cream lg:py-32">
      <div className="container-x grid gap-6 [grid-template-areas:'head'_'table'_'controls'] lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-x-20 lg:gap-y-10 lg:[grid-template-areas:'head_table'_'controls_table']">
        <div className="[grid-area:head]">
          <SectionHeading
            eyebrow={text.eyebrow}
            title={
              <span id="table-title">
                <Accent parts={text.title} className="text-clay-deep" />
              </span>
            }
            intro={text.intro}
          />
        </div>

        <div data-reveal className="[grid-area:controls]">
            <div className="flex items-end gap-5">
              <output htmlFor="guests-range" className="font-display text-[clamp(4.5rem,10vw,7rem)] leading-[0.8] tracking-[-0.04em] tabular-nums">
                {String(guests).padStart(2, "0")}
              </output>
              <span className="pb-2 text-lg text-muted">{guests === 1 ? text.guest : text.guests}</span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => set(guests - 1)}
                disabled={guests <= 1}
                className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-ink/20 text-xl disabled:opacity-30"
              >
                <span aria-hidden="true">−</span>
                <span className="sr-only">{text.fewer}</span>
              </button>
              <label htmlFor="guests-range" className="sr-only">
                {text.count}
              </label>
              <input
                id="guests-range"
                type="range"
                min={1}
                max={MAX}
                value={guests}
                onChange={(e) => set(Number(e.target.value))}
                className="h-12 w-full cursor-pointer accent-[var(--color-clay-deep)]"
              />
              <button
                type="button"
                onClick={() => set(guests + 1)}
                disabled={guests >= MAX}
                className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-ink/20 text-xl disabled:opacity-30"
              >
                <span aria-hidden="true">+</span>
                <span className="sr-only">{text.more}</span>
              </button>
            </div>

            <fieldset className="mt-8">
              <legend className="label text-muted">{text.when}</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {text.days.map((d, i) => (
                  <button key={d} type="button" aria-pressed={day === i} onClick={() => setDay(i)} className={chip(day === i)}>
                    {d}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-5">
              <legend className="label text-muted">{text.meal}</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {text.meals.map((m, i) => (
                  <button key={m} type="button" aria-pressed={meal === i} onClick={() => setMeal(meal === i ? null : i)} className={chip(meal === i)}>
                    {m}
                  </button>
                ))}
              </div>
            </fieldset>

            <a
              href={whatsappHref(message)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("whatsapp_click", { location: "table_setter", guests })}
              className="mt-9 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-whatsapp px-7 text-sm font-semibold text-smoke transition hover:brightness-110 active:scale-[0.98]"
            >
              <Icon name="whatsapp" className="size-5" />
              {text.ask(guests)}
            </a>
            <p className="mt-4 text-sm text-muted">
              {text.over(MAX)}{" "}
              <a href={phoneHref} className="inline-flex min-h-11 items-center text-clay-deep underline underline-offset-4">
                {text.call(phoneDisplay)}
              </a>
            </p>
        </div>

        {/* The table sets itself */}
        <div data-reveal className="relative overflow-hidden rounded-[1.5rem] bg-smoke p-3 [grid-area:table] sm:p-8 lg:rounded-[2rem]">
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            role="img"
            aria-label={text.svg(guests)}
            className="h-auto w-full"
          >
            <defs>
              <linearGradient id="ts-wood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#4a331d" />
                <stop offset="1" stopColor="#2b1d10" />
              </linearGradient>
              <radialGradient id="ts-steel" cx="0.35" cy="0.3" r="0.8">
                <stop offset="0" stopColor="#f4f1ea" />
                <stop offset="0.6" stopColor="#b9b3a8" />
                <stop offset="1" stopColor="#7c776e" />
              </radialGradient>
              <radialGradient id="ts-light" cx="0.5" cy="0.5" r="0.6">
                <stop offset="0" stopColor="#e7a95a" stopOpacity="0.25" />
                <stop offset="1" stopColor="#e7a95a" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width={VB_W} height={VB_H} fill="url(#ts-light)" />

            {/* Chairs */}
            {seats.map((s, i) => (
              <rect
                key={`c${i}`}
                className="table-seat"
                width={plate * 0.9}
                height={22}
                rx={8}
                fill="#8c6630"
                style={{ transform: `translate(${s.x - plate * 0.45}px, ${s.top ? y - 30 : y + tableH + 8}px)` }}
              />
            ))}

            {/* Table */}
            <rect
              className="table-top"
              rx={22}
              fill="url(#ts-wood)"
              stroke="#c99a55"
              strokeOpacity={0.35}
              style={{ x, y, width: length, height: tableH }}
            />

            {/* Centrepiece: a small clay pot in the gap between the two rows */}
            <g style={{ transform: `translate(${VB_W / 2}px, ${VB_H / 2}px)` }} className="table-seat">
              <circle r={Math.min(16, (tableH - 2 * plate - 32) / 2 - 3)} fill="#a44b22" />
              <circle r={Math.min(9, (tableH - 2 * plate - 32) / 3)} fill="#6d2f14" />
            </g>

            {/* Thalis */}
            {seats.map((s, i) => (
              <g key={`p${i}`} className="table-seat" style={{ transform: `translate(${s.x}px, ${s.y}px)` }}>
                <circle r={plate / 2} fill="url(#ts-steel)" />
                <circle r={plate / 2 - 4} fill="#cfc9be" />
                <circle cx={-plate * 0.16} cy={-plate * 0.14} r={plate * 0.12} fill="hsl(38 68% 42%)" />
                <circle cx={plate * 0.16} cy={-plate * 0.14} r={plate * 0.12} fill="hsl(12 68% 40%)" />
                <circle cx={0} cy={plate * 0.16} r={plate * 0.14} fill="#ece4d2" />
              </g>
            ))}
          </svg>
          <p className="label mt-3 text-center text-mist">
            [ {text.caption(guests, text.days[day])} ]
          </p>
        </div>
      </div>
    </section>
  );
}
