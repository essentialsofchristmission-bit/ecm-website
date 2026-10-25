import Image from "next/image";
import Link from "next/link";
import type { ChurchEvent } from "@/lib/content";
import { ClockIcon, PinIcon } from "./Icons";

export function DateBadge({ date, className = "" }: { date: string; className?: string }) {
  const d = new Date(`${date}T12:00:00`);
  return (
    <div className={`flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-ecm-red-dark text-white shadow-lg ${className}`}>
      <span className="font-display text-2xl leading-none">{d.getDate()}</span>
      <span className="text-xs font-bold uppercase">{d.toLocaleDateString("en-GB", { month: "short" })}</span>
    </div>
  );
}

export default function EventCard({ event }: { event: ChurchEvent }) {
  return (
    <Link href={`/events/${event.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={event.image} alt={`${event.title} flyer`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <DateBadge date={event.date} className="absolute left-4 top-4" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-ecm-navy">{event.title}</h3>
        <p className="mt-2 text-sm text-gray-600">{event.summary}</p>
        <div className="mt-auto space-y-1 pt-4 text-sm text-gray-600">
          <p className="flex items-center gap-2"><ClockIcon className="h-4 w-4 text-ecm-green" />{event.time}</p>
          <p className="flex items-center gap-2"><PinIcon className="h-4 w-4 text-ecm-green" />{event.venue}</p>
        </div>
      </div>
    </Link>
  );
}
