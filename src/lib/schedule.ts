// The weekly services from content/site.json ("serviceTimes"), the single list used by the footer, the homepage
// and the ECM Live page, so the times always match. Times are Ghana time (Africa/Accra, the same as GMT).

export type ServiceTime = { name: string; day: string; time: string };

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** "8:30 - 11:30 AM" or "7:30 PM - 9 PM" as minutes after midnight. The AM/PM of the end applies to the start too. */
function parseTimes(time: string) {
  const m = time.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*(?:-|to)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i) ?? time.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (!m) return null;
  const toMinutes = (h: string, min: string | undefined, half: string) => ((Number(h) % 12) + (half.toLowerCase() === "pm" ? 12 : 0)) * 60 + Number(min ?? 0);
  if (m.length > 4 && m[6]) {
    const end = toMinutes(m[4], m[5], m[6]);
    let start = toMinutes(m[1], m[2], m[3] ?? m[6]);
    if (!m[3] && start > end) start -= 12 * 60; // "11:30 - 1:00 PM" starts in the morning
    return { start, end };
  }
  const start = toMinutes(m[1], m[2], m[3]);
  return { start, end: start + 120 };
}

/** "8:30 AM" from minutes after midnight. */
export function clock(minutes: number) {
  const h = Math.floor(minutes / 60);
  return `${h % 12 || 12}:${String(minutes % 60).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

/** The start time of a service, for example "8:30 AM" for "8:30 - 11:30 AM" (the text itself if it cannot be read). */
export function startTime(s: ServiceTime) {
  const t = parseTimes(s.time);
  return t ? clock(t.start) : s.time;
}

/** Now in Ghana, as a day of the week and minutes after midnight, plus today's date. */
function ghanaNow(now = new Date()) {
  const accra = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Accra" }));
  return { day: accra.getDay(), minutes: accra.getHours() * 60 + accra.getMinutes(), date: accra };
}

export type NextService = ServiceTime & { start: string; date: Date; daysAway: number; onNow: boolean };

/** The service happening now, or else the next one to start. */
export function nextService(services: ServiceTime[], now = new Date()): NextService | undefined {
  const { day, minutes, date } = ghanaNow(now);
  let best: NextService | undefined;
  let bestWait = Infinity;
  for (const s of services) {
    const d = DAYS.findIndex((name) => name.toLowerCase() === s.day.trim().toLowerCase());
    const t = parseTimes(s.time);
    if (d < 0 || !t) continue;
    let daysAway = (d - day + 7) % 7;
    const onNow = daysAway === 0 && minutes >= t.start && minutes < t.end;
    if (daysAway === 0 && minutes >= t.end) daysAway = 7; // today's has finished: next week
    const wait = onNow ? -1 : daysAway * 1440 + t.start - minutes;
    if (wait < bestWait) {
      bestWait = wait;
      const when = new Date(date);
      when.setDate(date.getDate() + daysAway);
      best = { ...s, start: clock(t.start), date: when, daysAway, onNow };
    }
  }
  return best;
}

/** "Today", "Tomorrow" or "Sunday 22 November". */
export function whenLabel(n: NextService) {
  if (n.daysAway === 0) return "Today";
  if (n.daysAway === 1) return "Tomorrow";
  return n.date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}
