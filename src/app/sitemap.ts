import type { MetadataRoute } from "next";
import { getDevotionals, getEvents, getMinistries, site } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.siteUrl.replace(/\/$/, "");
  const pages = ["", "/about", "/live", "/sermons", "/events", "/ministries", "/devotionals", "/give", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 })),
    ...getEvents().map((e) => ({ url: `${base}/events/${e.slug}`, priority: 0.6 })),
    ...getMinistries().map((m) => ({ url: `${base}/ministries/${m.slug}`, priority: 0.6 })),
    ...getDevotionals().map((d) => ({ url: `${base}/devotionals/${d.slug}`, priority: 0.5 })),
  ];
}
