import { business } from "@/data/business";
import { formatTime } from "@/lib/hours";

/** Oryzo-style "spec sheet" — but only with numbers that are true. */
const numbers = [
  { value: String(business.rating.value), unit: "/ 5", label: "Google rating" },
  { value: String(business.rating.count), unit: "+", label: "Guest reviews" },
  { value: String(business.hours.days.length), unit: "days", label: "Open every week" },
  { value: formatTime(business.hours.closes).replace(/\s?pm/, ""), unit: "pm", label: "Open until" },
];

export function Numbers() {
  return (
    <section aria-label="The Bamboo House in numbers" className="bg-paper pb-24 sm:pb-32">
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
