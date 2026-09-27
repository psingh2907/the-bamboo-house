import type { Review } from "./types";

/**
 * Selected Google reviews, shown only with the owner's approval and copied
 * word for word from the Google Business Profile (brief §15).
 *
 * Intentionally EMPTY: reviews were not visible when the listing was checked
 * (27 Sep 2026) and must never be written or paraphrased by us. While empty,
 * the site shows the rating and links to Google instead.
 */
export const reviews: Review[] = [];
