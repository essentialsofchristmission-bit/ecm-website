// TEMPORARY: shows what YouTube returns to the server, to fix live detection. Remove after use.
import siteData from "../../../../content/site.json";

export const dynamic = "force-dynamic";

async function look(url: string) {
  try {
    const res = await fetch(url, { headers: { "Accept-Language": "en" }, cache: "no-store", signal: AbortSignal.timeout(8000) });
    const html = await res.text();
    return {
      url,
      status: res.status,
      finalUrl: res.url,
      length: html.length,
      title: html.match(/<title>([^<]*)</)?.[1],
      canonical: html.match(/<link rel="canonical" href="([^"]+)"/)?.[1],
      isLiveNow: html.match(/"isLiveNow":(true|false)/g)?.slice(0, 3),
      isLive: html.match(/"isLive(?:Content)?":(true|false)/g)?.slice(0, 4),
      liveStatus: html.match(/"(?:style|status)":"(LIVE|UPCOMING|DEFAULT|OK|ERROR|LOGIN_REQUIRED|LIVE_STREAM_OFFLINE)"/g)?.slice(0, 5),
      reason: html.match(/"reason":"([^"]{0,80})/)?.[1],
      consent: /consent\.youtube|before you continue/i.test(html),
      videoIds: [...html.matchAll(/(?:watch\?v=|"videoId":")([\w-]{11})/g)].map((m) => m[1]).filter((v, i, a) => a.indexOf(v) === i).slice(0, 5),
    };
  } catch (e) {
    return { url, error: String(e) };
  }
}

async function player(videoId: string, clientName: string, clientVersion: string) {
  try {
    const res = await fetch("https://www.youtube.com/youtubei/v1/player?prettyPrint=false", {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId, context: { client: { clientName, clientVersion, hl: "en" }, thirdParty: { embedUrl: "https://ecm-website-seven.vercel.app/" } } }),
      signal: AbortSignal.timeout(8000),
    });
    const j = await res.json();
    return { clientName, status: res.status, playability: j.playabilityStatus?.status, reason: j.playabilityStatus?.reason, isLive: j.videoDetails?.isLive, isLiveContent: j.videoDetails?.isLiveContent, isUpcoming: j.videoDetails?.isUpcoming, liveNow: j.microformat?.playerMicroformatRenderer?.liveBroadcastDetails?.isLiveNow };
  } catch (e) {
    return { clientName, error: String(e) };
  }
}

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("channel") || siteData.live.youtubeChannelId;
  const v = new URL(req.url).searchParams.get("v");
  if (v) return Response.json(await Promise.all([player(v, "WEB", "2.20250101.00.00"), player(v, "WEB_EMBEDDED_PLAYER", "1.20250101.00.00"), player(v, "TVHTML5_SIMPLY_EMBEDDED_PLAYER", "2.0"), player(v, "MWEB", "2.20250101.00.00")]));
  const feed = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${id}`, { cache: "no-store" }).then((r) => r.text()).catch(() => "");
  const newest = [...feed.matchAll(/<yt:videoId>([\w-]{11})</g)].slice(0, 3).map((m) => m[1]);
  return Response.json({
    channelLive: await look(`https://www.youtube.com/channel/${id}/live`),
    feedNewest: newest,
    watch: await Promise.all(newest.map((v) => look(`https://www.youtube.com/watch?v=${v}`))),
  });
}
