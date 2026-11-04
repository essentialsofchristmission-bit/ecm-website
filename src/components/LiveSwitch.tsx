"use client";

import Link from "next/link";
import type { LiveStatus } from "@/lib/live";
import { useLive } from "@/lib/useLive";
import { Container } from "./ui";
import YouTubeEmbed, { liveEmbedUrl } from "./YouTubeEmbed";

const LivePill = () => (
  <p className="inline-flex items-center gap-3 rounded-full bg-ecm-red-dark px-5 py-2 font-bold uppercase tracking-wider text-white">
    <span className="live-dot h-3 w-3 rounded-full bg-white" aria-hidden="true" /> We are live
  </p>
);

/**
 * Shows the live stream while the church is live on YouTube, and `children` (the latest sermon) the rest
 * of the time. It keeps checking, so an open page switches by itself when the stream starts or ends.
 */
export default function LiveSwitch({
  channelId,
  initial,
  layout,
  children,
}: {
  channelId: string;
  initial?: LiveStatus;
  layout: "home" | "page";
  children?: React.ReactNode;
}) {
  const status = useLive(initial);
  if (!status.live) return <>{children}</>;
  const player = <YouTubeEmbed src={liveEmbedUrl(channelId, status.videoId)} title="ECM live stream" />;

  if (layout === "page")
    return (
      <>
        <div className="mb-6 flex justify-center"><LivePill /></div>
        {player}
      </>
    );

  return (
    <section className="bg-ecm-cream py-20 sm:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">{player}</div>
        <div className="lg:col-span-2">
          <LivePill />
          <h2 className="mt-5 font-display text-4xl uppercase leading-tight text-ecm-navy sm:text-5xl">Join the service now</h2>
          <p className="mt-4 text-lg text-gray-700">Worship with us live from Essentials of Christ Mission, wherever you are.</p>
          <Link href="/live" className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-ecm-red-dark px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-ecm-red">Open ECM Live</Link>
        </div>
      </Container>
    </section>
  );
}
