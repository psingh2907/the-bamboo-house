"use client";

import { useState } from "react";
import { business } from "@/data/business";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { phoneDisplay, phoneHref, whatsappHref } from "@/lib/contact";
import { Icon } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";

/**
 * "How many of you?" — pick a group size and watch the table set itself,
 * then ask for a table on WhatsApp. (Oryzo's "your input moves the object",
 * turned into a conversion.) It asks rather than books: reservations are not
 * confirmed with the owner yet (owner checklist Q10).
 */

const MAX = 20;
const days = ["Today", "Tomorrow", "This weekend", "Another day"] as const;
const meals = ["Lunch", "Dinner"] as const;

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

export function TableSetter() {
  const [guests, setGuests] = useState(4);
  const [day, setDay] = useState<(typeof days)[number]>("Tomorrow");
  const [meal, setMeal] = useState<(typeof meals)[number] | null>("Dinner");

  const { length, tableH, x, y, plate, seats } = layout(guests);
  const when = [day === "Another day" ? null : day.toLowerCase(), meal?.toLowerCase()].filter(Boolean).join(", ");
  const message = `Hello ${business.name}! Could we have a table for ${guests}${when ? ` — ${when}` : ""}?`;
  const set = (n: number) => setGuests(Math.min(MAX, Math.max(1, n)));

  const chip = (active: boolean) =>
    cn(
      "min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors",
      active ? "border-smoke bg-smoke text-cream" : "border-ink/15 text-muted hover:border-ink/40 hover:text-ink",
    );

  return (
    <section id="your-table" aria-labelledby="table-title" className="scroll-mt-20 bg-cream py-24 sm:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="08 — Your table"
            title={
              <span id="table-title">
                How many <em className="text-clay-deep">of you</em>?
              </span>
            }
            intro="Big family, birthday, or a car full of travellers — tell us how many and when, and we'll get back to you on WhatsApp."
          />

          <div data-reveal className="mt-10">
            <div className="flex items-end gap-5">
              <output htmlFor="guests-range" className="font-display text-[clamp(4.5rem,10vw,7rem)] leading-[0.8] tracking-[-0.04em] tabular-nums">
                {String(guests).padStart(2, "0")}
              </output>
              <span className="pb-2 text-lg text-muted">{guests === 1 ? "guest" : "guests"}</span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => set(guests - 1)}
                disabled={guests <= 1}
                className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-ink/20 text-xl disabled:opacity-30"
              >
                <span aria-hidden="true">−</span>
                <span className="sr-only">One fewer guest</span>
              </button>
              <label htmlFor="guests-range" className="sr-only">
                Number of guests
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
                <span className="sr-only">One more guest</span>
              </button>
            </div>

            <fieldset className="mt-8">
              <legend className="label text-muted">When</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {days.map((d) => (
                  <button key={d} type="button" aria-pressed={day === d} onClick={() => setDay(d)} className={chip(day === d)}>
                    {d}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-5">
              <legend className="label text-muted">Meal</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {meals.map((m) => (
                  <button key={m} type="button" aria-pressed={meal === m} onClick={() => setMeal(meal === m ? null : m)} className={chip(meal === m)}>
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
              Ask for a table for {guests}
            </a>
            <p className="mt-4 text-sm text-muted">
              More than {MAX}?{" "}
              <a href={phoneHref} className="text-clay-deep underline underline-offset-4">
                Call {phoneDisplay}
              </a>
              .
            </p>
          </div>
        </div>

        {/* The table sets itself */}
        <div data-reveal className="relative overflow-hidden rounded-[2rem] bg-smoke p-4 sm:p-8">
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            role="img"
            aria-label={`A table set for ${guests}`}
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
            [ Table for {guests} · {day} ]
          </p>
        </div>
      </div>
    </section>
  );
}
