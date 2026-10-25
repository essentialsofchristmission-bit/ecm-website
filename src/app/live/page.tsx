import type { Metadata } from "next";
import { FacebookIcon, YouTubeIcon } from "@/components/Icons";
import YouTubeEmbed, { liveEmbedUrl, videoEmbedUrl } from "@/components/YouTubeEmbed";
import { ButtonLink, Container, PageHero, SectionHeading } from "@/components/ui";
import { getLatestVideo, site } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "ECM Live", description: "Watch Essentials of Christ Mission services live on YouTube and Facebook." };

export const revalidate = 900;

export default async function LivePage() {
  const { live } = site;
  const latest = live.isLive ? undefined : await getLatestVideo();
  return (
    <>
      <PageHero title="ECM Live" subtitle="Worship with us from wherever you are." image="/images/live-banner.jpg" />
      <section className="py-16 sm:py-20">
        <Container className="max-w-5xl">
          <div className="mb-6 flex items-center justify-center gap-3">
            {live.isLive ? (
              <p className="inline-flex items-center gap-3 rounded-full bg-ecm-red-dark px-5 py-2 font-bold uppercase tracking-wider text-white">
                <span className="live-dot h-3 w-3 rounded-full bg-white" aria-hidden="true" /> We are live
              </p>
            ) : (
              <p className="rounded-full bg-ecm-cream px-5 py-2 text-sm font-semibold text-ecm-navy">
                We are not live right now. Here is our most recent service.
              </p>
            )}
          </div>
          {latest ? (
            <>
              <YouTubeEmbed src={videoEmbedUrl(latest.youtubeId)} title={latest.title} />
              <div className="mt-5 text-center">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-ecm-red-dark">Latest sermon</p>
                <h2 className="mt-1 font-display text-3xl uppercase text-ecm-navy sm:text-4xl">{latest.title}</h2>
                <p className="mt-1 text-gray-600">{[latest.preacher, latest.service, formatDate(latest.date)].filter(Boolean).join(" \u00b7 ")}</p>
              </div>
            </>
          ) : (
            <YouTubeEmbed src={liveEmbedUrl(live.youtubeChannelId, live.liveVideoId)} title="ECM live stream" />
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href={`${site.social.youtube}?sub_confirmation=1`} variant="red"><YouTubeIcon /> Subscribe on YouTube</ButtonLink>
            <ButtonLink href={site.social.facebook} variant="navy"><FacebookIcon /> Follow on Facebook</ButtonLink>
            <ButtonLink href={live.facebookLive} variant="outline">Watch on Facebook Live</ButtonLink>
          </div>
        </Container>
      </section>
      <section className="bg-ecm-cream py-16 sm:py-20">
        <Container className="max-w-4xl">
          <SectionHeading eyebrow="Weekly schedule" title="When we stream" />
          <ul className="grid gap-4 sm:grid-cols-3">
            {live.schedule.map((s) => (
              <li key={s.what} className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100">
                <p className="font-display text-3xl uppercase text-ecm-green">{s.day}</p>
                <p className="mt-1 text-lg font-bold text-ecm-navy">{s.time}</p>
                <p className="text-gray-600">{s.what}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center"><ButtonLink href="/sermons">Watch past sermons</ButtonLink></div>
        </Container>
      </section>
    </>
  );
}
