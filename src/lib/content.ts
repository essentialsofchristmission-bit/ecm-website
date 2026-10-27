import fs from "fs";
import path from "path";
import matter from "gray-matter";
import siteData from "../../content/site.json";
import aboutData from "../../content/about.json";
import sermonsData from "../../content/sermons.json";
import eventsData from "../../content/events.json";
import ministriesData from "../../content/ministries.json";
import galleryData from "../../content/gallery.json";
import aboutGalleryData from "../../content/about-gallery.json";
import heroData from "../../content/hero.json";

export { formatDate, youtubeThumb } from "./format";

export type Sermon = {
  title: string;
  preacher: string;
  series: string;
  service: string;
  date: string;
  youtubeId: string;
  description?: string;
};

export type ChurchEvent = {
  slug: string;
  title: string;
  date: string;
  endDate?: string;
  time?: string;
  venue: string;
  image: string;
  summary: string;
  description: string[];
};

export type Ministry = {
  slug: string;
  name: string;
  summary: string;
  description: string[];
  leader: string;
  phone?: string;
  canJoin?: boolean;
  contactButton?: string;
  contactMessage?: string;
  linkButton?: string;
  linkHref?: string;
  meetingTime: string;
  image: string;
  photos: string[];
};

export type Devotional = {
  slug: string;
  title: string;
  date: string;
  keyVerse: string;
  keyVerseText: string;
  prayer: string;
  proclamation: string;
  message: string[];
};

export const site = siteData;
export const about = aboutData;
export const gallery = galleryData;
export const aboutGallery = aboutGalleryData;
export const hero = heroData;

export function getSermons(): Sermon[] {
  return [...(sermonsData as Sermon[])].sort((a, b) => b.date.localeCompare(a.date));
}

export function getMinistries(): Ministry[] {
  return ministriesData as Ministry[];
}

export function getMinistry(slug: string) {
  return getMinistries().find((m) => m.slug === slug);
}

export function todayISO() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Accra" });
}

export function getEvents(): ChurchEvent[] {
  return [...(eventsData as ChurchEvent[])].sort((a, b) => a.date.localeCompare(b.date));
}

export function getUpcomingEvents(): ChurchEvent[] {
  const today = todayISO();
  return getEvents().filter((e) => (e.endDate ?? e.date) >= today);
}

export function getEvent(slug: string) {
  return getEvents().find((e) => e.slug === slug);
}

const devotionalsDir = path.join(process.cwd(), "content", "devotionals");

export function getDevotionals(): Devotional[] {
  if (!fs.existsSync(devotionalsDir)) return [];
  return fs
    .readdirSync(devotionalsDir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(devotionalsDir, file), "utf8"));
      return {
        slug: file.replace(/\.md$/, ""),
        title: String(data.title ?? ""),
        date: String(data.date ?? file.replace(/\.md$/, "")),
        keyVerse: String(data.keyVerse ?? ""),
        keyVerseText: String(data.keyVerseText ?? ""),
        prayer: String(data.prayer ?? ""),
        proclamation: String(data.proclamation ?? ""),
        message: content
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPublishedDevotionals() {
  const today = todayISO();
  return getDevotionals().filter((d) => d.date <= today);
}

export function getTodaysDevotional() {
  return getPublishedDevotionals()[0];
}

export function getDevotional(slug: string) {
  return getDevotionals().find((d) => d.slug === slug);
}

export function mapEmbedUrl() {
  return `https://maps.google.com/maps?q=${encodeURIComponent(site.contact.mapQuery)}&z=15&output=embed`;
}

export function mapDirectionsUrl() {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.contact.mapQuery)}`;
}

export function whatsappUrl(text = "Hello ECM, ", phone: string = site.contact.whatsapp) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

export type LatestVideo = { youtubeId: string; title: string; date: string; preacher: string; service: string };

function tidyYouTubeTitle(raw: string) {
  const parts = raw
    .normalize("NFKC")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .split("||")
    .map((p) => p.trim())
    .filter(Boolean);
  const small = new Set(["a", "an", "and", "at", "by", "for", "in", "of", "on", "or", "the", "through", "to", "with"]);
  const titleCase = (s: string) =>
    s === s.toUpperCase()
      ? s
          .toLowerCase()
          .split(" ")
          .map((w, i) => (i > 0 && small.has(w) ? w : w.replace(/\p{L}/u, (c) => c.toUpperCase())))
          .join(" ")
      : s;
  return { title: titleCase(parts[0] ?? raw), service: parts.find((p) => /service|prayer|conference|program/i.test(p)) };
}

export async function getLatestVideo(): Promise<LatestVideo | undefined> {
  const fallback = getSermons()[0];
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${site.live.youtubeChannelId}`, { next: { revalidate: 900 } });
    if (!res.ok) throw new Error(`YouTube feed ${res.status}`);
    const entry = (await res.text()).split("<entry>")[1];
    const id = entry?.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const rawTitle = entry?.match(/<title>([^<]+)<\/title>/)?.[1];
    const published = entry?.match(/<published>([^<]+)<\/published>/)?.[1];
    if (!id || !rawTitle || !published) throw new Error("YouTube feed has no videos");
    const known = getSermons().find((s) => s.youtubeId === id);
    if (known) return known;
    const { title, service } = tidyYouTubeTitle(rawTitle);
    return { youtubeId: id, title, date: published.slice(0, 10), preacher: fallback?.preacher ?? "", service: service ? tidyYouTubeTitle(service).title : "Recent service" };
  } catch {
    return fallback;
  }
}
