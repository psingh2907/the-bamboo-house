import { business } from "@/data/business";
import { formatTime, type Locale } from "@/i18n";
import { t } from "@/i18n/dictionaries";

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** "11 am – 9:30 pm" / "सुबह 11 बजे – रात 9:30 बजे". */
export const hoursText = (locale: Locale = "en") =>
  `${formatTime(locale, business.hours.opens)} – ${formatTime(locale, business.hours.closes)}`;

export interface OpenStatus {
  open: boolean;
  label: string;
}

/** Open/closed right now, in India Standard Time regardless of the visitor's clock. */
export function getOpenStatus(locale: Locale = "en", now: Date = new Date()): OpenStatus {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  const openToday = (business.hours.days as readonly string[]).includes(get("weekday"));

  const opens = toMinutes(business.hours.opens);
  const closes = toMinutes(business.hours.closes);
  const { hours } = t(locale);

  if (openToday && minutes >= opens && minutes < closes) {
    return { open: true, label: hours.openNow(formatTime(locale, business.hours.closes)) };
  }
  const openTime = formatTime(locale, business.hours.opens);
  return {
    open: false,
    label: openToday && minutes < opens ? hours.closedToday(openTime) : hours.closedTomorrow(openTime),
  };
}
