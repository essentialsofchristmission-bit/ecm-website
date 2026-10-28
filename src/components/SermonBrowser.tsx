"use client";

import { useMemo, useState } from "react";
import type { Sermon } from "@/lib/sermons";
import SermonCard from "./SermonCard";

const PAGE = 24; // how many sermons to show before "Show more"

// Preacher filter values: "" = everyone, "resident" = our pastor, "guests" = all guests, or one guest's slug.
export default function SermonBrowser({ sermons, residentName }: { sermons: Sermon[]; residentName: string }) {
  const [query, setQuery] = useState("");
  const [preacher, setPreacher] = useState("");
  const [series, setSeries] = useState("");
  const [year, setYear] = useState("");
  const [shown, setShown] = useState(PAGE);

  const guests = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of sermons) if (s.guest) map.set(s.preacherSlug, s.preacher);
    return [...map].sort((a, b) => a[1].localeCompare(b[1]));
  }, [sermons]);
  const seriesList = useMemo(() => [...new Set(sermons.map((s) => s.series).filter(Boolean))].sort(), [sermons]);
  const years = useMemo(() => [...new Set(sermons.map((s) => s.date.slice(0, 4)).filter(Boolean))].sort().reverse(), [sermons]);

  const q = query.trim().toLowerCase();
  const filtered = sermons.filter((s) => {
    const matchesQuery = !q || [s.title, s.preacher, s.series, s.service].join(" ").toLowerCase().includes(q);
    const matchesPreacher = !preacher || (preacher === "resident" ? !s.guest : preacher === "guests" ? s.guest : s.preacherSlug === preacher);
    return matchesQuery && matchesPreacher && (!series || s.series === series) && (!year || s.date.startsWith(year));
  });
  const filtering = Boolean(q || preacher || series || year);

  // Any change to the filters starts the list from the top again.
  const update = (set: (v: string) => void) => (v: string) => {
    set(v);
    setShown(PAGE);
  };

  const select = "w-full rounded-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-ecm-green focus:outline-none focus:ring-2 focus:ring-ecm-green/30";

  return (
    <div>
      <div className="mb-8 grid gap-3 rounded-2xl bg-ecm-cream p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <label htmlFor="s-search" className="sr-only">Search sermons</label>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input id="s-search" type="search" placeholder="Search sermons..." value={query} onChange={(e) => update(setQuery)(e.target.value)} className={`${select} pl-10`} />
        </div>
        <div>
          <label htmlFor="s-preacher" className="sr-only">Filter by preacher</label>
          <select id="s-preacher" value={preacher} onChange={(e) => update(setPreacher)(e.target.value)} className={select}>
            <option value="">All preachers</option>
            <option value="resident">{residentName}</option>
            {guests.length > 0 && (
              <optgroup label="Guest preachers">
                <option value="guests">All guest preachers</option>
                {guests.map(([slug, name]) => <option key={slug} value={slug}>{name}</option>)}
              </optgroup>
            )}
          </select>
        </div>
        <div>
          <label htmlFor="s-series" className="sr-only">Filter by series</label>
          <select id="s-series" value={series} onChange={(e) => update(setSeries)(e.target.value)} className={select}>
            <option value="">All series</option>
            {seriesList.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="s-year" className="sr-only">Filter by year</label>
          <select id="s-year" value={year} onChange={(e) => update(setYear)(e.target.value)} className={select}>
            <option value="">All years</option>
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1">
        <p className="text-sm text-gray-600" aria-live="polite">{filtered.length} sermon{filtered.length === 1 ? "" : "s"}</p>
        {filtering && (
          <button
            type="button"
            onClick={() => { setQuery(""); setPreacher(""); setSeries(""); setYear(""); setShown(PAGE); }}
            className="py-2 text-sm font-semibold text-ecm-green underline underline-offset-4 hover:text-ecm-green-dark"
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length ? (
        <>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, shown).map((s) => <li key={s.youtubeId}><SermonCard sermon={s} /></li>)}
          </ul>
          {filtered.length > shown && (
            <div className="mt-10 text-center">
              <button type="button" onClick={() => setShown((n) => n + PAGE)} className="rounded-full border-2 border-ecm-green px-8 py-3 text-sm font-bold uppercase tracking-wide text-ecm-green transition-colors hover:bg-ecm-green hover:text-white">
                Show more sermons ({filtered.length - shown} more)
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="rounded-2xl bg-gray-50 p-10 text-center text-gray-600">No sermons match your search.</p>
      )}
    </div>
  );
}
