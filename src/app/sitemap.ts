import type { MetadataRoute } from "next";
import { getPublishedDevotionals, getEvents, getMinistries, getSermons, preacherPages, site } from "@/lib/content";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sermons = await getSermons();
  const base = site.siteUrl.replace(/\/$/, "");
  const pages = ["", "/about", "/live", "/sermons", "/events", "/ministries", "/devotionals", "/give", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 })),
    ...getEvents().map((e) => ({ url: `${base}/events/${e.slug}`, priority: 0.6 })),
    ...getMinistries().map((m) => ({ url: `${base}/ministries/${m.slug}`, priority: 0.6 })),
    ...getPublishedDevotionals().map((d) => ({ url: `${base}/devotionals/${d.slug}`, priority: 0.5 })),
    ...preacherPages(sermons).map((p) => ({ url: `${base}/sermons/preachers/${p.slug}`, priority: 0.5 })),
    ...sermons.map((s) => ({ url: `${base}/sermons/${s.youtubeId}`, ...(s.date && { lastModified: s.date }), priority: 0.4 })),
  ];
}
