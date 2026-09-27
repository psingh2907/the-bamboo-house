"use client";

import { type FormEvent, useState } from "react";
import { business } from "@/data/business";
import type { Locale } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { trackEvent } from "@/lib/analytics";
import { whatsappHref } from "@/lib/contact";
import { Icon } from "../ui/Icon";

interface Errors {
  name?: string;
  guests?: string;
  date?: string;
}

/** Local date as YYYY-MM-DD (not UTC, which lags India by 5.5 hours). */
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/**
 * Group / occasion enquiry (brief §7, Persona 4).
 * Nothing is stored or sent to a server: the details are composed into a
 * WhatsApp message the guest reviews and sends themselves. That keeps the
 * site static, spam-free and free of personal data.
 */
export function GroupEnquiryForm({ locale = "en" }: { locale?: Locale }) {
  const text = t(locale).form;
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const guests = Number(data.get("guests"));
    const date = String(data.get("date") ?? "");
    const time = String(data.get("time") ?? "");
    const occasion = String(data.get("occasion") ?? "");
    const notes = String(data.get("notes") ?? "").trim().slice(0, 500);

    const next: Errors = {};
    if (name.length < 2) next.name = text.errors.name;
    if (!Number.isInteger(guests) || guests < 1 || guests > 200) next.guests = text.errors.guests;
    if (!date || date < today()) next.date = text.errors.date;
    setErrors(next);
    if (Object.keys(next).length) {
      const first = event.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`);
      first?.focus();
      return;
    }

    const message = [
      text.message.intro,
      `${text.message.name}: ${name}`,
      `${text.message.guests}: ${guests}`,
      `${text.message.date}: ${new Date(`${date}T00:00`).toLocaleDateString(text.dateLocale, { day: "numeric", month: "long", year: "numeric" })}`,
      time && `${text.message.time}: ${time}`,
      occasion && `${text.message.occasion}: ${occasion}`,
      notes && `${text.message.notes}: ${notes}`,
    ]
      .filter(Boolean)
      .join("\n");

    trackEvent("contact_submit", { guests, occasion: occasion || "none" });
    window.open(whatsappHref(message), "_blank", "noopener,noreferrer");
  };

  const field = "mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-base text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none aria-[invalid=true]:border-clay";
  const labelCls = "text-sm font-semibold text-ink";
  const error = (id: keyof Errors) =>
    errors[id] && (
      <p id={`${id}-error`} className="mt-1.5 text-sm text-clay-deep">
        {errors[id]}
      </p>
    );

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="name" className={labelCls}>
          {text.name}
        </label>
        <input id="name" name="name" autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
        {error("name")}
      </div>
      <div>
        <label htmlFor="guests" className={labelCls}>
          {text.guests}
        </label>
        <input id="guests" name="guests" type="number" inputMode="numeric" min={1} max={200} className={field} aria-invalid={!!errors.guests} aria-describedby={errors.guests ? "guests-error" : undefined} />
        {error("guests")}
      </div>
      <div>
        <label htmlFor="occasion" className={labelCls}>
          {text.occasion} <span className="font-normal text-muted">{text.optional}</span>
        </label>
        <select id="occasion" name="occasion" className={field} defaultValue="">
          {text.occasions.map((o, i) => (
            <option key={o} value={i === 0 ? "" : o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="date" className={labelCls}>
          {text.date}
        </label>
        <input id="date" name="date" type="date" min={today()} className={field} aria-invalid={!!errors.date} aria-describedby={errors.date ? "date-error" : undefined} />
        {error("date")}
      </div>
      <div>
        <label htmlFor="time" className={labelCls}>
          {text.time} <span className="font-normal text-muted">{text.optional}</span>
        </label>
        <input id="time" name="time" type="time" min={business.hours.opens} max={business.hours.closes} className={field} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="notes" className={labelCls}>
          {text.notes} <span className="font-normal text-muted">{text.optional}</span>
        </label>
        <textarea id="notes" name="notes" rows={3} maxLength={500} className={field} placeholder={text.notesPlaceholder} />
      </div>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-whatsapp px-7 text-sm font-semibold text-smoke transition hover:brightness-110 active:scale-[0.98]"
        >
          <Icon name="whatsapp" className="size-5" />
          {text.submit}
        </button>
        <p className="text-sm text-muted">{text.note}</p>
      </div>
    </form>
  );
}
