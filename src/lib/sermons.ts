// Sermons: where they come from, who preached and which series they belong to.
//
// Videos come from two places and are merged (each video only once):
//   1. content/extra-sermons.json: the saved list of videos (old and new).
//   2. YouTube's free channel feed: the 15 newest uploads, so new sermons appear by themselves.
// No YouTube API key is needed.
//
// Corrections in content/sermon-overrides.json (by video ID) always win over what is read from titles.

import extraData from "../../content/extra-sermons.json";
import hiddenData from "../../content/hidden-videos.json";
import preachersData from "../../content/preachers.json";
import overridesData from "../../content/sermon-overrides.json";
import seriesData from "../../content/series.json";
import siteData from "../../content/site.json";
import { youtubeThumb } from "./format";
import { CATEGORIES, ROLES, type Category, type Role } from "./sermon-groups";

export { CATEGORIES, ROLES, type Category, type Role };

export type Sermon = {
  youtubeId: string;
  title: string;
  date: string; // YYYY-MM-DD, or "" if unknown
  preacher: string; // "" for a prayer meeting whose leader is not known yet
  preacherSlug: string;
  role: Role | ""; // "" for a panel, or a prayer meeting whose leader is not known yet
  category: Category;
  series: string; // "" if not part of a series
  service: string; // for example "Sunday Service", or ""
  event: string; // slug of an event in events.json, or ""
  thumbnail: string;
};

export type Preacher = { name: string; slug: string; photo: string; role: Role; sermons: Sermon[] };

type ExtraEntry = { url: string; title?: string; date?: string; preacher?: string; series?: string };
type PreacherEntry = { name: string; role?: string; photo?: string; aliases?: string[] };
type SeriesEntry = { name: string; titles?: string[]; videos?: string[] };
type Override = { preacher?: string; leader?: string; category?: string; series?: string; event?: string };
type RawVideo = { id: string; title: string; date: string; thumbnail?: string; preacher?: string; series?: string };

const extras = extraData as ExtraEntry[];
const preacherList = preachersData as PreacherEntry[];
const seriesList = seriesData as SeriesEntry[];
const overrides = overridesData as Record<string, Override>;
const resident = preacherList.find((p) => p.role === "Resident Pastor") ?? { name: "Pastor Dr. Samuel E. Tandoh" };
export const PANEL = "Panel";

/** Reads a role or category written loosely ("guest preacher", "Forum Discussion") as one of the fixed values. */
function pick<T extends string>(list: readonly T[], value?: string) {
  const key = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim().replace(/s$/, "");
  return value ? list.find((x) => key(x) === key(value)) : undefined;
}

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
  const caps = s.replace(/['’]s\b/g, ""); // "ECM's" still counts as all capitals
  if (caps !== caps.toUpperCase()) return s;
  return s
    .toLowerCase()
    .split(" ")
    .map((w, i, all) => (i > 0 && SMALL_WORDS.has(w) && !all[i - 1].endsWith(":") ? w : w.replace(/\p{L}/u, (c) => c.toUpperCase())))
    .join(" ")
    .replace(/\b(Ii|Iii|Iv|Vi|Vii|Ecm)\b/g, (m) => m.toUpperCase())
    .replace(/\b(?:\p{L}\.)+\p{L}\b/gu, (m) => m.toUpperCase()); // initials such as "E.C.M"
}

// Titles people put before a name, and how to show them.
const HONORIFICS: Record<string, string> = {
  rt: "Rt.", rev: "Rev.", reverend: "Rev.", pastor: "Pastor", ps: "Pastor", apostle: "Apostle", bishop: "Bishop",
  prophet: "Prophet", prophetess: "Prophetess", evangelist: "Evangelist", dr: "Dr.", mrs: "Mrs.", mr: "Mr.",
  ms: "Ms.", elder: "Elder", deacon: "Deacon", deaconess: "Deaconess", minister: "Minister", min: "Minister",
  overseer: "Overseer", lady: "Lady", coach: "Coach", rtd: "(Rtd.)",
};
const HONORIFIC_START = new RegExp(`^(${Object.keys(HONORIFICS).join("|")})\\b\\.?`, "i");

function words(name: string) {
  return name.replace(/\.(?=\S)/g, ". ").split(/\s+/).filter(Boolean);
}

/** Tidies a name: "PS.DR. SAMUEL TANDOH" becomes "Pastor Dr. Samuel Tandoh". */
function formatName(name: string) {
  const he = /^h\.\s?e\.?\s+/i.test(name) ? "H.E. " : ""; // His/Her Excellency
  return he + words(name.replace(/^h\.\s?e\.?\s+/i, ""))
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

/** Like nameKey, but also ignores doubled letters, so "Scoffray" and "Scofray" count as the same name. */
function sameNameKey(name: string) {
  return nameKey(name).replace(/(\p{L})\1+/gu, "$1");
}

/** True if a name means our resident pastor (Pastor Samuel Tandoh, Ps. Dr. Samuel Tandoh, Pastor Tandoh...). */
function isResident(name: string) {
  const key = nameKey(name).split(" ");
  if (!key.includes("tandoh")) return nameKey(name) === nameKey(resident.name);
  const isMrs = /\b(mrs|ms|mr|lady)\b/i.test(name);
  return !isMrs && (key.includes("samuel") || key.length === 1);
}

function looksLikeName(s: string) {
  return HONORIFIC_START.test(s) || /^h\.\s?e\b/i.test(s) || /\btandoh\b/i.test(s);
}

const SERVICE_WORDS = /se?r?v+ice|meeting|conference|program|convention|crusade|revival|retreat|vigil|camp/i;
const NOT_A_NAME = /\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday|easter|christmas|holy|new year|day|discussion|panel|forum|school|church|mission|ministry|outreach|celebration|prayer|worship)\b/i;

/** The last part of a title, after "||", is a name if it is 2 to 6 plain words, such as "MAXWELL AZAFOKPE". */
function looksLikeEndName(s: string) {
  const w = s.split(/\s+/);
  return w.length >= 2 && w.length <= 6 && /^[\p{L}.'’() -]+$/u.test(s) && !NOT_A_NAME.test(s) && !SERVICE_WORDS.test(s) && !w.some((x) => SMALL_WORDS.has(x.toLowerCase()));
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
  parts.slice(1).forEach((part, i, rest) => {
    if (/^\d{1,2}[./-]\d{1,2}[./-]\d{2,4}$/.test(part)) return; // a date such as 30/06/2024
    if (/^(part|pt\.?|episode|ep\.?|day)\s*\w+$/i.test(part)) title = `${title}, ${part}`;
    else if (!preacher && looksLikeName(part)) preacher = part;
    else if (!service && SERVICE_WORDS.test(part)) service = part;
    else if (!preacher && i === rest.length - 1 && looksLikeEndName(part)) preacher = part;
  });
  // Names written inside the title: "Title - Rev. John Mensah", "Title by Pastor ...", "Title with Apostle ...".
  if (!preacher) {
    const m = title.match(new RegExp(`^(.*?)\\s+(?:-|–|by|with)\\s+((?:${Object.keys(HONORIFICS).join("|")})\\b\\.?.*)$`, "i"));
    if (m) [title, preacher] = [m[1], m[2]];
  }
  // Labels that are not part of the sermon title: "Rebroadcast:", "Title:", "Sunday Service:" and a date at the end.
  title = title.replace(/^(rebroadcast|title|panel discussion|forum discussion)\s*[:\-–]\s*/i, "").replace(/\s*\(?\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\)?$/, "");
  // Only a short label such as "Sunday Service:" counts, not a title like "Diligence in Service: ...".
  const lead = title.match(/^((?:[\w']+ ){0,2}service)\s*:\s*(.+)$/i);
  if (lead && !lead[1].split(" ").some((w) => SMALL_WORDS.has(w.toLowerCase()))) {
    service ||= lead[1];
    title = lead[2];
  }
  return {
    title: titleCase(title.replace(/[\s:,|-]+$/, "")),
    preacher: preacher ? formatName(preacher) : "",
    service: service ? titleCase(service.replace(/\bse?r?v+ice\b/i, (w) => (w === w.toUpperCase() ? "SERVICE" : "Service"))) : "",
    forum: /\b(panel|forum) discussion\b/i.test(raw.normalize("NFKC")),
    outreach: /\boutreach\b/i.test(raw.normalize("NFKC")),
    prayer: /\bprayer\s*meeting\b/i.test(raw.normalize("NFKC")),
  };
}

// ---------- Preachers ----------

function findPreacher(name: string) {
  const key = sameNameKey(name);
  return preacherList.find((p) => sameNameKey(p.name) === key || p.aliases?.some((a) => sameNameKey(a) === key));
}

/** Decides who preached and their role. The name and role come from preachers.json when the person is listed there. */
function resolvePreacher(name: string): { preacher: string; role: Role | "" } {
  if (!name || isResident(name)) return { preacher: resident.name, role: "Resident Pastor" };
  if (name.trim().toLowerCase() === PANEL.toLowerCase()) return { preacher: PANEL, role: "" };
  const entry = findPreacher(name);
  return { preacher: entry?.name ?? name, role: pick(ROLES, entry?.role) ?? "Guest Preacher" };
}

const ROLE_CATEGORY: Record<Role, Category> = { "Resident Pastor": "Sermons", "ECM Leadership": "ECM Leadership", "Guest Preacher": "Guest Preachers" };

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
      const fix = overrides[v.id] ?? {};
      // Preacher: the override, then extra-sermons.json, then the title. A discussion with no name is a panel.
      // A prayer meeting's leader is only what is written in ("leader" in the overrides, or a name in the title), never assumed.
      const name = fix.leader || fix.preacher || v.preacher || parsed.preacher || (parsed.forum ? PANEL : "");
      const who: { preacher: string; role: Role | "" } = !name && parsed.prayer ? { preacher: "", role: "" } : resolvePreacher(name);
      const category =
        pick(CATEGORIES, fix.category) ??
        (parsed.forum ? "Forum Discussions" : parsed.prayer ? "Prayer Meetings" : parsed.outreach ? "Outreach" : who.role ? ROLE_CATEGORY[who.role] : "Forum Discussions");
      return {
        youtubeId: v.id,
        title: parsed.title,
        date: v.date,
        preacher: who.preacher,
        preacherSlug: preacherSlug(who.preacher),
        role: who.role,
        category,
        series: "",
        setSeries: fix.series || v.series,
        service: parsed.service,
        event: fix.event ?? "",
        thumbnail: v.thumbnail || youtubeThumb(v.id),
      };
    });
  assignSeries(sermons);
  return sermons.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Everyone who gets their own page: ECM Leadership and guest preachers, each with all their
 * messages (newest first). Most recent preacher first.
 */
export function preacherPages(sermons: Sermon[]): Preacher[] {
  const map = new Map<string, Preacher>();
  for (const s of sermons) {
    if (s.role !== "ECM Leadership" && s.role !== "Guest Preacher") continue;
    const p = map.get(s.preacherSlug) ?? { name: s.preacher, slug: s.preacherSlug, photo: findPreacher(s.preacher)?.photo ?? "", role: s.role, sermons: [] };
    p.sermons.push(s);
    map.set(s.preacherSlug, p);
  }
  return [...map.values()];
}

/** Videos linked to one event (by its slug in events.json). */
export function sermonsForEvent(sermons: Sermon[], eventSlug: string) {
  return sermons.filter((s) => s.event === eventSlug);
}

export const residentPreacher = resident.name;
