import fs from "fs";
import path from "path";
import matter from "gray-matter";
import siteData from "../../content/site.json";
import aboutData from "../../content/about.json";
import sermonsData from "../../content/sermons.json";
import eventsData from "../../content/events.json";
import ministriesData from "../../content/ministries.json";
import galleryData from "../../content/gallery.json";

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
  time: string;
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
  return getEvents().filter((e) => e.date >= today);
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

export function whatsappUrl(text = "Hello ECM, ") {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}`;
}
