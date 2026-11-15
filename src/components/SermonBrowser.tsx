"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, sermonKind } from "@/lib/sermon-groups";
import type { Sermon } from "@/lib/sermons";
import SermonCard from "./SermonCard";

const PAGE = 24; // how many videos to show before "Show more"

type Filters = { tab: string; q: string; preacher: string; series: string; year: string };
const EMPTY: Filters = { tab: "", q: "", preacher: "", series: "", year: "" };
type Key = keyof Filters;

/** Everything a search can match, in lower case: title, preacher, series, kind, scripture and date. */
const searchText = (s: Sermon) =>
  [s.title, s.preacher, s.series, sermonKind(s), s.scripture, s.description, s.date, s.date && new Date(s.date).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" })]
    .join(" ")
    .toLowerCase();

/** Everyone with this role who has videos, as [slug, name], A to Z. */
function peopleWith(sermons: Sermon[], role: string) {
  const map = new Map<string, string>();
  for (const s of sermons) if (s.role === role) map.set(s.preacherSlug, s.preacher);
  return [...map].sort((a, b) => a[1].localeCompare(b[1]));
}

/**
 * Tabs pick a category ("" = all). The preacher filter is "" for everyone, "resident" for our pastor, or one
 * preacher's slug. All filters work together, and each list only offers choices that still have videos.
 * The filters are kept in the page address, so a filtered list can be shared or bookmarked.
 */
export default function SermonBrowser({ sermons, residentName }: { sermons: Sermon[]; residentName: string }) {
  const [f, setF] = useState<Filters>(EMPTY);
  const [shown, setShown] = useState(PAGE);

  // Start from the filters in the address (for example /sermons?series=End+Times), and keep it up to date.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setF({ tab: p.get("tab") ?? "", q: p.get("q") ?? "", preacher: p.get("preacher") ?? "", series: p.get("series") ?? "", year: p.get("year") ?? "" });
  }, []);
  useEffect(() => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(f)) if (v) p.set(k, v);
    const url = `${window.location.pathname}${p.size ? `?${p}` : ""}${window.location.hash}`;
    if (url !== `${window.location.pathname}${window.location.search}${window.location.hash}`) window.history.replaceState(window.history.state, "", url);
  }, [f]);

  const text = useMemo(() => new Map(sermons.map((s) => [s.youtubeId, searchText(s)])), [sermons]);
  const words = f.q.trim().toLowerCase().split(/\s+/).filter(Boolean);

  // Does a sermon pass every filter, leaving out one (so that filter's list can show what else is available)?
  const passes = (s: Sermon, skip?: Key) =>
    (skip === "tab" || !f.tab || s.category === f.tab) &&
    (skip === "q" || words.every((w) => text.get(s.youtubeId)!.includes(w))) &&
    (skip === "preacher" || !f.preacher || (f.preacher === "resident" ? s.role === "Resident Pastor" : s.preacherSlug === f.preacher)) &&
    (skip === "series" || !f.series || s.series === f.series) &&
    (skip === "year" || !f.year || s.date.startsWith(f.year));

  const filtered = sermons.filter((s) => passes(s));
  const count = (skip: Key, value: (s: Sermon) => string) => {
    const map = new Map<string, number>();
    for (const s of sermons) if (passes(s, skip)) map.set(value(s), (map.get(value(s)) ?? 0) + 1);
    return map;
  };

  const tabCounts = count("tab", (s) => s.category);
  const tabs = CATEGORIES.filter((c) => sermons.some((s) => s.category === c));
  const preacherCounts = count("preacher", (s) => (s.role === "Resident Pastor" ? "resident" : s.preacherSlug));
  const leadership = useMemo(() => peopleWith(sermons, "ECM Leadership"), [sermons]);
  const guests = useMemo(() => peopleWith(sermons, "Guest Preacher"), [sermons]);
  const seriesCounts = count("series", (s) => s.series);
  const seriesList = useMemo(() => [...new Set(sermons.map((s) => s.series).filter(Boolean))].sort(), [sermons]);
  const yearCounts = count("year", (s) => s.date.slice(0, 4));
  const years = useMemo(() => [...new Set(sermons.map((s) => s.date.slice(0, 4)).filter(Boolean))].sort().reverse(), [sermons]);

  // Any change to the filters starts the list from the top again.
  const set = (key: Key, value: string) => {
    setF((old) => ({ ...old, [key]: value }));
    setShown(PAGE);
  };
  const filtering = Boolean(f.q || f.preacher || f.series || f.year);

  // A choice is offered when it has videos with the other filters, or when it is the current choice.
  const available = (counts: Map<string, number>, value: string, current: string) => (counts.get(value) ?? 0) > 0 || value === current;
  const label = (name: string, n = 0) => `${name} (${n})`;

  const field = "w-full rounded-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition-colors hover:border-gray-400 focus:border-ecm-green focus:outline-none focus:ring-2 focus:ring-ecm-green/30";
  const caption = "mb-1.5 block px-1 text-xs font-bold uppercase tracking-wider text-ecm-navy";
  const tabClass = (active: boolean) =>
    `shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${active ? "bg-ecm-green text-white" : "bg-white text-ecm-navy ring-1 ring-gray-200 hover:bg-ecm-cream"}`;

  return (
    <div>
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Show">
        {[["", "All"], ...tabs.map((c) => [c, c])].map(([value, name]) => (
          <button key={value} type="button" aria-pressed={f.tab === value} onClick={() => set("tab", value)} className={tabClass(f.tab === value)}>
            {name}
            <span className={`ml-1.5 text-xs font-semibold ${f.tab === value ? "text-white/80" : "text-gray-500"}`}>
              {value ? tabCounts.get(value) ?? 0 : sermons.filter((s) => passes(s, "tab")).length}
            </span>
          </button>
        ))}
      </div>

      <div className="mb-8 grid gap-4 rounded-2xl bg-ecm-cream p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
        <div>
          <label htmlFor="s-search" className={caption}>Search</label>
          <div className="relative">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            <input id="s-search" type="search" placeholder="Title, preacher, month..." value={f.q} onChange={(e) => set("q", e.target.value)} className={`${field} pl-10`} />
          </div>
        </div>
        <div>
          <label htmlFor="s-preacher" className={caption}>Preacher</label>
          <select id="s-preacher" value={f.preacher} onChange={(e) => set("preacher", e.target.value)} className={field}>
            <option value="">All preachers</option>
            {available(preacherCounts, "resident", f.preacher) && <option value="resident">{label(residentName, preacherCounts.get("resident"))}</option>}
            {[["ECM Leadership", leadership], ["Guest preachers", guests]].map(([group, list]) => {
              const options = (list as [string, string][]).filter(([slug]) => available(preacherCounts, slug, f.preacher));
              return options.length > 0 && (
                <optgroup key={group as string} label={group as string}>
                  {options.map(([slug, name]) => <option key={slug} value={slug}>{label(name, preacherCounts.get(slug))}</option>)}
                </optgroup>
              );
            })}
          </select>
        </div>
        <div>
          <label htmlFor="s-series" className={caption}>Series</label>
          <select id="s-series" value={f.series} onChange={(e) => set("series", e.target.value)} className={field}>
            <option value="">All series</option>
            {seriesList.filter((s) => available(seriesCounts, s, f.series)).map((s) => <option key={s} value={s}>{label(s, seriesCounts.get(s))}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="s-year" className={caption}>Year</label>
          <select id="s-year" value={f.year} onChange={(e) => set("year", e.target.value)} className={field}>
            <option value="">All years</option>
            {years.filter((y) => available(yearCounts, y, f.year)).map((y) => <option key={y} value={y}>{label(y, yearCounts.get(y))}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1">
        <p className="text-sm font-semibold text-gray-700" aria-live="polite">{filtered.length} video{filtered.length === 1 ? "" : "s"}</p>
        {filtering && (
          <button
            type="button"
            onClick={() => { setF((old) => ({ ...EMPTY, tab: old.tab })); setShown(PAGE); }}
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
                Show more ({filtered.length - shown} more)
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="rounded-2xl bg-gray-50 p-10 text-center text-gray-600">No videos match your search.</p>
      )}
    </div>
  );
}
