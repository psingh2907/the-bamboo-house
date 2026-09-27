import { business } from "@/data/business";
import { reviews } from "@/data/reviews";
import { placeUrl } from "@/lib/contact";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import type { Locale } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { Accent } from "../ui/Accent";

/**
 * The real Google reputation (brief §15). Review quotes appear only once the
 * owner approves them in src/data/reviews.ts — none are ever written by us.
 */
export function SocialProof({ locale = "en" }: { locale?: Locale }) {
  const { value, count } = business.rating;
  const text = t(locale).reviews;

  return (
    <section aria-labelledby="reviews-title" className="lamp relative overflow-hidden bg-smoke-soft py-24 text-cream sm:py-32">
      {/* Oversized rating as a backdrop */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-6 font-display text-[clamp(14rem,38vw,34rem)] leading-none tracking-[-0.06em] text-smoke-line/60 select-none"
      >
        {value}
      </p>

      <div className="container-x relative">
        <p className="label text-bamboo">[ {text.eyebrow} ]</p>
        <div data-reveal className="mt-8 flex items-end gap-5">
          <span className="font-display text-[clamp(5rem,14vw,10rem)] leading-[0.8] tracking-[-0.05em]">{value}</span>
          <div className="pb-2">
            <div className="flex gap-1 text-bamboo" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => {
                // Fill each star by the share of the rating it covers, e.g. 4.7 → the fifth is 70% full.
                const fill = Math.min(Math.max(value - i, 0), 1);
                return (
                  <span key={i} className="relative size-5">
                    <Icon name="star" className="absolute inset-0 size-5" />
                    <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                      <Icon name="star" className="size-5 max-w-none fill-current" />
                    </span>
                  </span>
                );
              })}
            </div>
            <p className="label mt-3 text-mist">
              [ {text.summary(value, count)} ]
            </p>
          </div>
        </div>

        <h2 id="reviews-title" data-reveal className="mt-10 max-w-3xl font-display text-[clamp(2.4rem,6vw,4.75rem)] leading-[0.98] tracking-[-0.02em]">
          <Accent parts={text.title} className="text-bamboo" />
        </h2>

        {reviews.length > 0 && (
          <ul data-reveal-stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <li key={review.author + review.date} className="rounded-[1.5rem] border border-smoke-line bg-smoke/60 p-7">
                <p className="label text-bamboo">[ {review.rating}/5 ]</p>
                <blockquote className="mt-4 font-display text-xl leading-snug">“{review.text}”</blockquote>
                <p className="label mt-6 text-mist">{review.author}</p>
              </li>
            ))}
          </ul>
        )}

        <div data-reveal className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Button href={placeUrl} external icon="star" track={{ event: "google_reviews_click", params: { location: "reviews" } }}>
            {text.read}
          </Button>
          <Button
            href={placeUrl}
            external
            variant="outline"
            track={{ event: "google_reviews_click", params: { location: "reviews_write" } }}
          >
            {text.write}
          </Button>
        </div>
      </div>
    </section>
  );
}
