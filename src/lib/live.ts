// Is the church live on YouTube right now? Read from YouTube's public pages (no API key), checked every minute.
// "isLive": true with a "liveVideoId" in content/site.json still forces a live stream by hand.

import siteData from "../../content/site.json";

const CHECK_EVERY = 60; // seconds

async function page(url: string) {
  const res = await fetch(url, { headers: { "Accept-Language": "en" }, next: { revalidate: CHECK_EVERY }, signal: AbortSignal.timeout(8000) });
  return res.ok ? res.text() : "";
}

const isLiveNow = (html: string) => /"isLiveNow":true/.test(html);

export type LiveStatus = { live: boolean; videoId: string };

/** Whether the church is live now, and the live video (videoId is "" when it is not known). */
export async function getLiveStatus(): Promise<LiveStatus> {
  const { live } = siteData;
  if (live.isLive && live.liveVideoId) return { live: true, videoId: live.liveVideoId };
  try {
    // 1. The channel's /live address opens the current live stream, when there is one.
    const html = await page(`https://www.youtube.com/channel/${live.youtubeChannelId}/live`);
    const id = html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})"/)?.[1];
    if (id && isLiveNow(html)) return { live: true, videoId: id };

    // 2. Otherwise look at the newest uploads in the channel feed (a live stream is listed there too).
    const feed = await page(`https://www.youtube.com/feeds/videos.xml?channel_id=${live.youtubeChannelId}`);
    const newest = [...feed.matchAll(/<yt:videoId>([\w-]{11})</g)].slice(0, 3).map((m) => m[1]);
    for (const v of newest) if (isLiveNow(await page(`https://www.youtube.com/watch?v=${v}`))) return { live: true, videoId: v };
  } catch {
    // YouTube did not answer: treat as not live.
  }
  return { live: live.isLive, videoId: "" };
}
