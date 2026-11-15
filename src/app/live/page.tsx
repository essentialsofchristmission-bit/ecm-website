import type { Metadata } from "next";
import Link from "next/link";
import { FacebookIcon, YouTubeIcon } from "@/components/Icons";
import LiteYouTube from "@/components/LiteYouTube";
import LiveSwitch from "@/components/LiveSwitch";
import SermonCard from "@/components/SermonCard";
import ServiceSchedule from "@/components/ServiceSchedule";
import { ButtonLink, Container, PageHero, SectionHeading } from "@/components/ui";
import { getSermons, site } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { getLiveStatus } from "@/lib/live";
import { nextService, whenLabel } from "@/lib/schedule";

export const metadata: Metadata = { title: "ECM Live", description: "Watch Essentials of Christ Mission services live on YouTube and Facebook." };

// Every minute, so the live stream shows soon after it starts (an open page also switches by itself).
export const revalidate = 60;

export default async function LivePage() {
  const { live } = site;
  const [status, sermons] = await Promise.all([getLiveStatus(), getSermons()]);
  const latest = sermons[0];
  const next = nextService(site.serviceTimes);

  return (
    <>
      <PageHero title="ECM Live" subtitle="Worship with us from wherever you are." image="/images/live-banner.jpg" />

      {/* Live stream, or (when we are not live) the next service and the latest message */}
      <section className="relative isolate overflow-hidden bg-ecm-navy py-16 text-white sm:py-20" aria-labelledby="stream-heading">
        <div className="absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-ecm-green/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-32 -z-10 h-96 w-96 rounded-full bg-ecm-red/20 blur-3xl" aria-hidden="true" />
        <Container className="max-w-6xl">
          <h2 id="stream-heading" className="sr-only">Live stream</h2>
          <LiveSwitch channelId={live.youtubeChannelId} initial={status} layout="page">
            <div className="grid items-center gap-10 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/90 ring-1 ring-white/20">
                  <span className={`h-2.5 w-2.5 rounded-full ${next?.onNow ? "live-dot bg-ecm-red" : "bg-white/50"}`} aria-hidden="true" />
                  {next?.onNow ? "Starting soon" : "Offline"}
                </p>
                {next && (
                  <>
                    <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-white/70">{next.onNow ? "Happening now" : "Next live service"}</p>
                    <p className="mt-2 font-display text-4xl uppercase leading-tight sm:text-5xl">{next.name}</p>
                    <p className="mt-2 text-xl font-semibold text-white/90">
                      {next.onNow ? `${next.day}, ${next.time}` : `${whenLabel(next)} at ${next.start}`}
                    </p>
                  </>
                )}
                <p className="mt-5 max-w-md text-white/80">
                  {next?.onNow
                    ? "The stream will appear here as soon as it starts. If it does not, you can also watch on YouTube or Facebook."
                    : "We stream every service live on YouTube and Facebook. Subscribe on YouTube to be told when we go live."}
                </p>
              </div>

              {latest && (
                <div className="lg:col-span-3">
                  <LiteYouTube id={latest.youtubeId} title={latest.title} thumbnail={latest.thumbnail} />
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">While you wait: latest message</p>
                    <p className="mt-1 text-xl font-bold">
                      <Link href={`/sermons/${latest.youtubeId}`} className="hover:underline">{latest.title}</Link>
                    </p>
                    <p className="text-sm text-white/75">{[latest.preacher, latest.service, latest.date && formatDate(latest.date)].filter(Boolean).join(" · ")}</p>
                  </div>
                </div>
              )}
            </div>
          </LiveSwitch>
          <div className="mt-10 flex flex-wrap justify-center gap-3 border-t border-white/10 pt-8">
            <ButtonLink href={`${site.social.youtube}?sub_confirmation=1`} variant="red"><YouTubeIcon /> Subscribe on YouTube</ButtonLink>
            <ButtonLink href={site.social.facebook} variant="outlineLight"><FacebookIcon /> Follow on Facebook</ButtonLink>
            <ButtonLink href={live.facebookLive} variant="outlineLight">Watch on Facebook Live</ButtonLink>
          </div>
        </Container>
      </section>

      {/* Weekly schedule (the same list as the footer) */}
      <section className="bg-ecm-cream py-16 sm:py-20">
        <Container className="max-w-5xl">
          <SectionHeading eyebrow="Weekly schedule" title="When we stream" intro="All times are Ghana time (GMT)." />
          <ServiceSchedule services={site.serviceTimes} />
        </Container>
      </section>

      {/* Recent sermons */}
      {sermons.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Missed a service?" title="Recent sermons" />
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sermons.slice(0, 3).map((s) => <li key={s.youtubeId}><SermonCard sermon={s} /></li>)}
            </ul>
            <div className="mt-10 text-center"><ButtonLink href="/sermons">Explore our sermon library</ButtonLink></div>
          </Container>
        </section>
      )}
    </>
  );
}
