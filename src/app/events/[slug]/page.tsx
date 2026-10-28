import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DateBadge } from "@/components/EventCard";
import { ClockIcon, PinIcon } from "@/components/Icons";
import { ButtonLink, Container } from "@/components/ui";
import { getEvent, getEvents, getSermons, sermonsForEvent } from "@/lib/content";
import { formatEventDate } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

export function generateStaticParams() {
  return getEvents().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = getEvent((await params).slug);
  if (!event) return {};
  return { title: event.title, description: event.summary, openGraph: { images: [event.image] } };
}

export default async function EventPage({ params }: Props) {
  const event = getEvent((await params).slug);
  if (!event) notFound();
  // Videos linked to this event in content/sermon-overrides.json ("event": this event's slug).
  const videos = sermonsForEvent(await getSermons(), event.slug);
  const label = event.title.replace(/\s*celebration$/i, "");
  return (
    <section className="py-12 sm:py-16">
      <Container className="max-w-6xl">
        <Link href="/events" className="text-sm font-semibold text-ecm-green hover:underline">&larr; All events</Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl">
            <Image src={event.image} alt={`${event.title} flyer`} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <DateBadge date={event.date} />
            <h1 className="mt-6 font-display text-5xl uppercase leading-tight text-ecm-navy">{event.title}</h1>
            <ul className="mt-6 space-y-3 text-gray-800">
              <li className="flex items-center gap-3 font-semibold">{formatEventDate(event)}</li>
              {event.time && <li className="flex items-center gap-3"><ClockIcon className="h-5 w-5 text-ecm-green" />{event.time}</li>}
              <li className="flex items-center gap-3"><PinIcon className="h-5 w-5 text-ecm-green" />{event.venue}</li>
            </ul>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-gray-700">
              {event.description.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {videos.map((v) => (
                <ButtonLink key={v.youtubeId} href={`https://www.youtube.com/watch?v=${v.youtubeId}`} variant="red" external>
                  {videos.length > 1 ? `Watch: ${v.title}` : `Watch ${label} service`}
                </ButtonLink>
              ))}
              <ButtonLink href="/contact">Ask a question</ButtonLink>
              <ButtonLink href="/events" variant="outline">See all events</ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
