"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ChurchEvent } from "@/lib/content";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function EventsCalendar({ events }: { events: ChurchEvent[] }) {
  const first = events[0]?.date ?? new Date().toISOString().slice(0, 10);
  const [month, setMonth] = useState(() => {
    const d = new Date(`${first}T12:00:00`);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const byDate = useMemo(() => {
    const m = new Map<string, ChurchEvent[]>();
    events.forEach((e) => {
      const day = new Date(`${e.date}T12:00:00`);
      const last = e.endDate && e.endDate > e.date ? e.endDate : e.date;
      for (let key = e.date; key <= last; day.setDate(day.getDate() + 1), key = day.toLocaleDateString("en-CA")) {
        m.set(key, [...(m.get(key) ?? []), e]);
      }
    });
    return m;
  }, [events]);

  const year = month.getFullYear();
  const mon = month.getMonth();
  const offset = (new Date(year, mon, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, mon + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  const iso = (d: number) => `${year}-${String(mon + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={() => setMonth(new Date(year, mon - 1, 1))} className="rounded-full px-4 py-2 text-sm font-bold text-ecm-green hover:bg-ecm-cream" aria-label="Previous month">Prev</button>
        <h3 className="font-display text-2xl uppercase text-ecm-navy" aria-live="polite">
          {month.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
        </h3>
        <button type="button" onClick={() => setMonth(new Date(year, mon + 1, 1))} className="rounded-full px-4 py-2 text-sm font-bold text-ecm-green hover:bg-ecm-cream" aria-label="Next month">Next</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase text-gray-500">
        {DAYS.map((d) => <div key={d} className="py-2">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          const evs = d ? byDate.get(iso(d)) : undefined;
          return (
            <div key={i} className={`min-h-16 rounded-lg p-1 text-left text-sm sm:min-h-24 sm:p-2 ${d ? (evs ? "bg-ecm-green/10" : "bg-gray-50") : ""}`}>
              {d && <span className={`text-xs font-semibold ${evs ? "text-ecm-green" : "text-gray-500"}`}>{d}</span>}
              {evs?.map((e) => (
                <Link key={e.slug} href={`/events/${e.slug}`} className="mt-1 block truncate rounded bg-ecm-green px-1 py-0.5 text-[10px] font-semibold text-white hover:bg-ecm-green-dark sm:text-xs" title={e.title}>
                  {e.title}
                </Link>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
