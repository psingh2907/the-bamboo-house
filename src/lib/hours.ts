import { business } from "@/data/business";

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** "21:30" → "9:30 pm", "11:00" → "11 am". */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return m ? `${hour}:${String(m).padStart(2, "0")} ${suffix}` : `${hour} ${suffix}`;
}

export const hoursLabel = `${formatTime(business.hours.opens)} – ${formatTime(business.hours.closes)}`;

export interface OpenStatus {
  open: boolean;
  label: string;
}

/** Open/closed right now, in India Standard Time regardless of the visitor's clock. */
export function getOpenStatus(now: Date = new Date()): OpenStatus {
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

  if (openToday && minutes >= opens && minutes < closes) {
    return { open: true, label: `Open now · until ${formatTime(business.hours.closes)}` };
  }
  const when = openToday && minutes < opens ? "today" : "tomorrow";
  return { open: false, label: `Closed · opens ${when} ${formatTime(business.hours.opens)}` };
}
