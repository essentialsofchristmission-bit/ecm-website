// Sermons: where they come from, who preached and which series they belong to.
//
// Videos come from two places and are merged (each video only once):
//   1. content/extra-sermons.json: the saved list of videos (old and new).
//   2. YouTube's free channel feed: the 15 newest uploads, so new sermons appear by themselves.
// No YouTube API key is needed.

import extraData from "../../content/extra-sermons.json";
import hiddenData from "../../content/hidden-videos.json";
import preachersData from "../../content/preachers.json";
import seriesData from "../../content/series.json";
import siteData from "../../content/site.json";
import { youtubeThumb } from "./format";

export type Sermon = {
  youtubeId: string;
  title: string;
  date: string; // YYYY-MM-DD, or "" if unknown
  preacher: string;
  preacherSlug: string;
  guest: boolean;
  series: string; // "" if not part of a series
  service: string; // for example "Sunday Service", or ""
  thumbnail: string;
};

export type Preacher = { name: string; slug: string; photo: string; resident: boolean; sermons: Sermon[] };

type ExtraEntry = { url: string; title?: string; date?: string; preacher?: string; series?: string };
type PreacherEntry = { name: string; resident?: boolean; photo?: string; aliases?: string[] };
type SeriesEntry = { name: string; titles?: string[]; videos?: string[] };
type RawVideo = { id: string; title: string; date: string; thumbnail?: string; preacher?: string; series?: string };

const extras = extraData as ExtraEntry[];
const preacherList = preachersData as PreacherEntry[];
const seriesList = seriesData as SeriesEntry[];
const resident = preacherList.find((p) => p.resident) ?? { name: "Pastor Dr. Samuel E. Tandoh", resident: true };

// ---------- Small text helpers ----------

/** Gets the video ID from any YouTube link (or returns the ID if one is given). */
export function videoId(urlOrId: string) {
  const s = urlOrId.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  return s.match(/(?:v=|youtu\.be\/|\/live\/|\/shorts\/|\/embed\/)([\w-]{11})/)?.[1];
}

/** Turns fancy bold/italic letters into normal ones and tidies spaces and symbols. */
function clean(raw: string) {
  return raw
    .normalize("NFKC")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\p{Extended_Pictographic}|️/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

const SMALL_WORDS = new Set(["a", "an", "and", "as", "at", "by", "for", "in", "of", "on", "or", "the", "through", "to", "unto", "with"]);

/** Makes ALL-CAPS text read normally: "DAYS OF NOAH" becomes "Days of Noah". */
function titleCase(s: string) {
  if (s !== s.toUpperCase()) return s;
  return s
    .toLowerCase()
    .split(" ")
    .map((w, i, all) => (i > 0 && SMALL_WORDS.has(w) && !all[i - 1].endsWith(":") ? w : w.replace(/\p{L}/u, (c) => c.toUpperCase())))
    .join(" ")
    .replace(/\b(Ii|Iii|Iv|Vi|Vii)\b/g, (m) => m.toUpperCase());
}

// Titles people put before a name, and how to show them.
const HONORIFICS: Record<string, string> = {
  rt: "Rt.", rev: "Rev.", reverend: "Rev.", pastor: "Pastor", ps: "Pastor", apostle: "Apostle", bishop: "Bishop",
  prophet: "Prophet", prophetess: "Prophetess", evangelist: "Evangelist", dr: "Dr.", mrs: "Mrs.", mr: "Mr.",
  ms: "Ms.", elder: "Elder", deacon: "Deacon", deaconess: "Deaconess", minister: "Minister", min: "Minister",
  overseer: "Overseer", lady: "Lady",
};
const HONORIFIC_START = new RegExp(`^(${Object.keys(HONORIFICS).join("|")})\\b\\.?`, "i");

function words(name: string) {
  return name.replace(/\.(?=\S)/g, ". ").split(/\s+/).filter(Boolean);
}

/** Tidies a name: "PS.DR. SAMUEL TANDOH" becomes "Pastor Dr. Samuel Tandoh". */
function formatName(name: string) {
  return words(name)
    .map((w) => HONORIFICS[w.replace(/\./g, "").toLowerCase()] ?? (w.length <= 2 && w.endsWith(".") ? w.toUpperCase() : w.toLowerCase().replace(/(^|[-'])\p{L}/gu, (c) => c.toUpperCase())))
    .join(" ");
}

/** The name without titles, in lower case, for comparing: "Rev. Dr. John K. Mensah" gives "john mensah". */
function nameKey(name: string) {
  return words(name)
    .map((w) => w.replace(/[^\p{L}]/gu, "").toLowerCase())
    .filter((w) => w.length > 1 && !HONORIFICS[w])
    .join(" ");
}

/** True if a name means our resident pastor (Pastor Samuel Tandoh, Ps. Dr. Samuel Tandoh, Pastor Tandoh...). */
function isResident(name: string) {
  const key = nameKey(name).split(" ");
  if (!key.includes("tandoh")) return nameKey(name) === nameKey(resident.name);
  const isMrs = /\b(mrs|ms|mr|lady)\b/i.test(name);
  return !isMrs && (key.includes("samuel") || key.length === 1);
}

function looksLikeName(s: string) {
  return HONORIFIC_START.test(s) || /\btandoh\b/i.test(s);
}

function slugify(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_-]+/g, "-");
}

// ---------- Reading a YouTube title ----------

/**
 * Splits a YouTube title such as "DAYS OF NOAH || WEDNESDAY SERVICE || PS. DR. SAMUEL TANDOH"
 * into the sermon title, the service and the preacher's name.
 */
export function parseTitle(raw: string) {
  const parts = clean(raw).replace(/#[\p{L}\d_]+/gu, "").split(/\s*\|{1,2}\s*/).map((p) => p.trim()).filter(Boolean);
  let title = parts[0] ?? "";
  let preacher = "";
  let service = "";
  for (const part of parts.slice(1)) {
    if (/^\d{1,2}[./-]\d{1,2}[./-]\d{2,4}$/.test(part)) continue; // a date such as 30/06/2024
    if (/^(part|pt\.?|episode|ep\.?|day)\s*\w+$/i.test(part)) title = `${title}, ${part}`;
    else if (!preacher && looksLikeName(part)) preacher = part;
    else if (!service && /service|meeting|conference|program|convention|crusade|revival|retreat|vigil|camp/i.test(part)) service = part;
  }
  // Names written inside the title: "Title - Rev. John Mensah", "Title by Pastor ...", "Title with Apostle ...".
  if (!preacher) {
    const m = title.match(new RegExp(`^(.*?)\\s+(?:-|–|by|with)\\s+((?:${Object.keys(HONORIFICS).join("|")})\\b\\.?.*)$`, "i"));
    if (m) [title, preacher] = [m[1], m[2]];
  }
  // Labels that are not part of the sermon title: "Rebroadcast:", "Title:", "Sunday Service:" and a date at the end.
  title = title.replace(/^(rebroadcast|title)\s*[:\-–]\s*/i, "").replace(/\s*\(?\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\)?$/, "");
  const lead = title.match(/^([\w' ]*service)\s*:\s*(.+)$/i);
  if (lead) {
    service ||= lead[1];
    title = lead[2];
  }
  return {
    title: titleCase(title.replace(/[\s:,|-]+$/, "")),
    preacher: preacher ? formatName(preacher) : "",
    service: service ? titleCase(service) : "",
  };
}

// ---------- Preachers ----------

function findPreacher(name: string) {
  const key = nameKey(name);
  return preacherList.find((p) => nameKey(p.name) === key || p.aliases?.some((a) => nameKey(a) === key));
}

/** Decides who preached: our pastor, or a guest (with the name corrected from preachers.json). */
function resolvePreacher(name: string) {
  if (!name || isResident(name)) return { preacher: resident.name, guest: false };
  const entry = findPreacher(name);
  if (entry?.resident) return { preacher: entry.name, guest: false };
  return { preacher: entry?.name ?? name, guest: true };
}

export function preacherSlug(name: string) {
  return slugify(nameKey(name) || name);
}

// ---------- Series ----------

/** Simplified series name for comparing ("The Foundations of Our Walk" and "Foundation of our walk" match). */
function seriesKey(s: string) {
  return s.toLowerCase().replace(/[-–]/g, " ").replace(/[^\p{L}\d ]/gu, "").replace(/^the /, "").split(" ").filter(Boolean).map((w) => w.replace(/s$/, "")).join(" ");
}

/** Part of a title before "Part 2", "Pt 3", "Episode 1" or "Day 4". */
function partBase(title: string) {
  const m = title.match(/^(.*?)[\s,:–-]*\b(?:part|pt\.?|episode|ep\.?|day)\s*(?:\d+|[ivx]+)\b/i);
  return m && m[1].trim().length > 2 ? m[1].replace(/[\s,:–-]+$/, "").trim() : "";
}

/** Fills in each sermon's series: from extra-sermons.json, then series.json, then guessed from titles. */
function assignSeries(sermons: (Sermon & { setSeries?: string })[]) {
  const byVideo = new Map<string, string>();
  for (const s of seriesList) for (const v of s.videos ?? []) { const id = videoId(v); if (id) byVideo.set(id, s.name); }

  // Guess series from titles. Each sermon can suggest two names: the words before a colon
  // ("Foundations of Our Walk: Humility") and the words before a part number ("Money pt 2").
  // A plain title also counts, so "Look unto Jesus" joins "Look unto Jesus, Part 2".
  const groups = new Map<string, { names: string[]; ids: Set<string> }>();
  const suggest = (name: string, id: string) => {
    const key = seriesKey(name);
    if (!key || name.length > 60) return;
    const g = groups.get(key) ?? { names: [], ids: new Set<string>() };
    g.names.push(name);
    g.ids.add(id);
    groups.set(key, g);
  };
  for (const s of sermons) {
    if (s.title.includes(":")) suggest(s.title.split(":")[0].trim(), s.youtubeId);
    const base = partBase(s.title);
    if (base) {
      suggest(base, s.youtubeId);
      if (base.includes(":")) suggest(base.split(":")[0].trim(), s.youtubeId);
    }
  }
  for (const s of sermons) groups.get(seriesKey(s.title))?.ids.add(s.youtubeId);
  // Every sermon takes the biggest suggested series it belongs to. A series needs at least two videos.
  const guessed = new Map<string, string>();
  const ranked = [...groups.values()].filter((g) => g.ids.size >= 2).sort((a, b) => b.ids.size - a.ids.size);
  for (const g of ranked) {
    const name = mostCommon(g.names);
    for (const id of g.ids) if (!guessed.has(id)) guessed.set(id, name);
  }
  for (const s of sermons) {
    const fromList = seriesList.find((x) => x.titles?.some((t) => s.title.toLowerCase().includes(t.toLowerCase())));
    s.series = s.setSeries || byVideo.get(s.youtubeId) || fromList?.name || guessed.get(s.youtubeId) || "";
    delete s.setSeries;
  }

  // Drop guessed series that ended up with only one video.
  const sizes = new Map<string, number>();
  for (const s of sermons) if (s.series) sizes.set(s.series, (sizes.get(s.series) ?? 0) + 1);
  const named = new Set(seriesList.map((x) => x.name));
  for (const s of sermons) if (s.series && !named.has(s.series) && (sizes.get(s.series) ?? 0) < 2 && guessed.get(s.youtubeId) === s.series) s.series = "";
}

function mostCommon(list: string[]) {
  const count = new Map<string, number>();
  for (const s of list) count.set(s, (count.get(s) ?? 0) + 1);
  return [...count].sort((a, b) => b[1] - a[1])[0][0];
}

// ---------- Hidden videos ----------

const hiddenIds = new Set((hiddenData as { url: string }[]).map((h) => videoId(h.url)).filter(Boolean));

/** Videos that are not sermons: the hide list, birthday wishes and hashtag clips. */
function isHidden(id: string, rawTitle: string) {
  return hiddenIds.has(id) || /birthday|must watch|#\p{L}/iu.test(clean(rawTitle));
}

// ---------- Fetching from YouTube (free, no key) ----------

/** The 15 newest uploads from YouTube's free channel feed. Returns [] if YouTube does not answer. */
async function fetchFeed(): Promise<RawVideo[]> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${siteData.live.youtubeChannelId}`, { next: { revalidate: 900 } });
    if (!res.ok) return [];
    const xml = await res.text();
    return xml
      .split("<entry>")
      .slice(1)
      .filter((e) => !e.includes("/shorts/")) // skip Shorts
      .map((e) => ({
        id: e.match(/<yt:videoId>([^<]+)</)?.[1] ?? "",
        title: e.match(/<title>([^<]+)</)?.[1] ?? "",
        date: e.match(/<published>([^<]+)</)?.[1]?.slice(0, 10) ?? "",
      }))
      .filter((v) => v.id && v.title);
  } catch {
    return [];
  }
}

/** Title and thumbnail of one video from YouTube's free oEmbed link. */
async function fetchOEmbed(id: string): Promise<{ title?: string; thumbnail?: string }> {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`, { next: { revalidate: 86400 } });
    if (!res.ok) return {};
    const data = await res.json();
    return { title: data.title, thumbnail: data.thumbnail_url };
  } catch {
    return {};
  }
}

/** Upload date of one video, read from its public YouTube page (oEmbed does not give dates). */
async function fetchDate(id: string) {
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${id}`, { headers: { "Accept-Language": "en" }, next: { revalidate: 86400 } });
    const html = await res.text();
    return (html.match(/itemprop="(?:uploadDate|datePublished)" content="(\d{4}-\d{2}-\d{2})/) ?? html.match(/"(?:publishDate|uploadDate)":"(\d{4}-\d{2}-\d{2})/))?.[1] ?? "";
  } catch {
    return "";
  }
}

// ---------- Putting it all together ----------

/** All sermons, newest first. */
export async function getSermons(): Promise<Sermon[]> {
  const feed = await fetchFeed();
  const fromFeed = new Map(feed.map((v) => [v.id, v]));

  // 1. Saved videos. Missing titles and dates are fetched from YouTube.
  const saved = await Promise.all(
    extras.map(async (e): Promise<RawVideo | null> => {
      const id = videoId(e.url);
      if (!id) return null;
      const f = fromFeed.get(id);
      const o = e.title || f?.title ? {} : await fetchOEmbed(id);
      const date = e.date || f?.date || (await fetchDate(id));
      return { id, title: e.title || f?.title || o.title || "", date, thumbnail: o.thumbnail, preacher: e.preacher, series: e.series };
    }),
  );

  // 2. New uploads from the feed that are not saved yet.
  const all = new Map<string, RawVideo>();
  for (const v of saved) if (v && v.title && !all.has(v.id)) all.set(v.id, v);
  for (const v of feed) if (!all.has(v.id)) all.set(v.id, v);

  // A rebroadcast is skipped when the original sermon is already in the list.
  const originals = new Set([...all.values()].filter((v) => !/^\s*rebroadcast/i.test(clean(v.title))).map((v) => parseTitle(v.title).title.toLowerCase()));
  const isRepeat = (v: RawVideo) => /^\s*rebroadcast/i.test(clean(v.title)) && originals.has(parseTitle(v.title).title.toLowerCase());

  const sermons = [...all.values()]
    .filter((v) => !isHidden(v.id, v.title) && !isRepeat(v))
    .map((v) => {
      const parsed = parseTitle(v.title);
      const who = resolvePreacher(v.preacher || parsed.preacher);
      return {
        youtubeId: v.id,
        title: parsed.title,
        date: v.date,
        preacher: who.preacher,
        preacherSlug: preacherSlug(who.preacher),
        guest: who.guest,
        series: "",
        setSeries: v.series,
        service: parsed.service,
        thumbnail: v.thumbnail || youtubeThumb(v.id),
      };
    });
  assignSeries(sermons);
  return sermons.sort((a, b) => b.date.localeCompare(a.date));
}

/** Guest preachers, each with their sermons (newest first), most recent guest first. */
export function guestPreachers(sermons: Sermon[]): Preacher[] {
  const map = new Map<string, Preacher>();
  for (const s of sermons) {
    if (!s.guest) continue;
    const p = map.get(s.preacherSlug) ?? { name: s.preacher, slug: s.preacherSlug, photo: findPreacher(s.preacher)?.photo ?? "", resident: false, sermons: [] };
    p.sermons.push(s);
    map.set(s.preacherSlug, p);
  }
  return [...map.values()];
}

export const residentPreacher = resident.name;
