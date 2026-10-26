"use client";

import { useMemo, useState } from "react";
import type { Sermon } from "@/lib/content";
import SermonCard from "./SermonCard";

export default function SermonBrowser({ sermons }: { sermons: Sermon[] }) {
  const [query, setQuery] = useState("");
  const [preacher, setPreacher] = useState("");
  const [series, setSeries] = useState("");

  const preachers = useMemo(() => [...new Set(sermons.map((s) => s.preacher))].sort(), [sermons]);
  const seriesList = useMemo(() => [...new Set(sermons.map((s) => s.series))].sort(), [sermons]);

  const filtered = sermons.filter((s) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || [s.title, s.preacher, s.series, s.service].join(" ").toLowerCase().includes(q);
    return matchesQuery && (!preacher || s.preacher === preacher) && (!series || s.series === series);
  });

  const select = "w-full rounded-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-ecm-green focus:outline-none focus:ring-2 focus:ring-ecm-green/30";

  return (
    <div>
      <div className="mb-8 grid gap-3 rounded-2xl bg-ecm-cream p-4 sm:grid-cols-3">
        <div className="relative">
          <label htmlFor="s-search" className="sr-only">Search sermons</label>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input id="s-search" type="search" placeholder="Search sermons..." value={query} onChange={(e) => setQuery(e.target.value)} className={`${select} pl-10`} />
        </div>
        <div>
          <label htmlFor="s-preacher" className="sr-only">Filter by preacher</label>
          <select id="s-preacher" value={preacher} onChange={(e) => setPreacher(e.target.value)} className={select}>
            <option value="">All preachers</option>
            {preachers.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="s-series" className="sr-only">Filter by series</label>
          <select id="s-series" value={series} onChange={(e) => setSeries(e.target.value)} className={select}>
            <option value="">All series</option>
            {seriesList.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <p className="mb-4 text-sm text-gray-600" aria-live="polite">{filtered.length} sermon{filtered.length === 1 ? "" : "s"}</p>
      {filtered.length ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => <li key={s.youtubeId}><SermonCard sermon={s} /></li>)}
        </ul>
      ) : (
        <p className="rounded-2xl bg-gray-50 p-10 text-center text-gray-600">No sermons match your search.</p>
      )}
    </div>
  );
}
