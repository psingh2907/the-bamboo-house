import { business } from "@/data/business";
import { formatTime, type Locale } from "@/i18n";
import { t } from "@/i18n/dictionaries";

/** Oryzo-style "spec sheet" — but only with numbers that are true. */
export function Numbers({ locale = "en" }: { locale?: Locale }) {
  const text = t(locale).numbers;
  // "9:30" from the closing time (the unit — pm / बजे — is shown separately).
  const closing = formatTime("en", business.hours.closes).replace(/\s?[ap]m/, "");
  const numbers = [
    { value: String(business.rating.value), unit: "/ 5", label: text.rating },
    { value: String(business.rating.count), unit: "+", label: text.reviews },
    { value: String(business.hours.days.length), unit: text.daysUnit, label: text.days },
    { value: closing, unit: text.untilUnit, label: text.until },
  ];
  return (
    <section aria-label={text.label} className="bg-paper pb-24 sm:pb-32">
      <div className="container-x">
        <dl data-reveal-stagger className="grid grid-cols-2 border-t border-ink/15 lg:grid-cols-4">
          {numbers.map((n) => (
            <div
              key={n.label}
              className="border-b border-ink/15 py-8 odd:border-r odd:pr-4 even:pl-4 lg:border-r lg:border-b-0 lg:px-8 lg:py-10 lg:first:pl-0 lg:last:border-r-0"
            >
              <dt className="label text-muted">[ {n.label} ]</dt>
              <dd className="mt-4 flex items-baseline gap-2 font-display">
                <span className="text-[clamp(3.25rem,8vw,6.5rem)] leading-none tracking-[-0.04em]">{n.value}</span>
                <span className="text-lg text-clay-deep">{n.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
