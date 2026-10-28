import fs from "fs";
import path from "path";
import matter from "gray-matter";
import siteData from "../../content/site.json";
import aboutData from "../../content/about.json";
import eventsData from "../../content/events.json";
import ministriesData from "../../content/ministries.json";
import galleryData from "../../content/gallery.json";
import aboutGalleryData from "../../content/about-gallery.json";
import heroData from "../../content/hero.json";
import { getSermons } from "./sermons";

export { formatDate, youtubeThumb } from "./format";
export { CATEGORIES, getSermons, preacherPages, residentPreacher, sermonsForEvent, type Category, type Preacher, type Sermon } from "./sermons";

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
  image?: string;
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

/** Events that have finished, most recent first. */
export function getPastEvents(): ChurchEvent[] {
  const today = todayISO();
  return getEvents().filter((e) => (e.endDate ?? e.date) < today).reverse();
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
        // An unquoted date (as the CMS may save it) is read as a Date, so turn it back into YYYY-MM-DD.
        date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? file.replace(/\.md$/, "")),
        image: data.image ? String(data.image) : undefined,
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

/** The newest sermon (for the homepage and the Live page). */
export async function getLatestVideo() {
  return (await getSermons())[0];
}
