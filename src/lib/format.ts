export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", opts);
}

export function youtubeThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function formatEventDate(event: { date: string; endDate?: string }) {
  const start = new Date(`${event.date}T12:00:00`);
  if (!event.endDate || event.endDate === event.date) {
    return start.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }
  const end = new Date(`${event.endDate}T12:00:00`);
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();
  const from = start.toLocaleDateString("en-GB", sameMonth ? { day: "numeric" } : sameYear ? { day: "numeric", month: "long" } : { day: "numeric", month: "long", year: "numeric" });
  return `${from} to ${end.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;
}
