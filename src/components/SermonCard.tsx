import Link from "next/link";
import { formatDate } from "@/lib/format";
import { sermonKind } from "@/lib/sermon-groups";
import type { Sermon } from "@/lib/sermons";
import { PlayIcon } from "./Icons";

/** One video in a grid. Opens the sermon's own page, which has the video and its details. */
export default function SermonCard({ sermon }: { sermon: Sermon }) {
  const who = sermon.category === "Prayer Meetings" ? `Led by: ${sermon.preacher || "To be updated"}` : sermon.preacher;
  return (
    <Link
      href={`/sermons/${sermon.youtubeId}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-video overflow-hidden bg-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={sermon.thumbnail} alt="" loading="lazy" decoding="async" width={480} height={360} className="h-full w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
        <span className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/30" aria-hidden="true" />
        <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/55 text-white shadow-lg ring-2 ring-white/80 backdrop-blur-sm transition duration-300 group-hover:scale-110 group-hover:bg-ecm-red-dark motion-reduce:group-hover:scale-100">
            <PlayIcon className="ml-0.5 h-6 w-6" />
          </span>
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-ecm-navy/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">{sermonKind(sermon)}</span>
        {sermon.duration && (
          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-white">
            <span className="sr-only">Length </span>{sermon.duration}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {/* The series line keeps its space when empty, so titles line up across a row. */}
        <p className="line-clamp-1 min-h-4 text-xs font-bold uppercase tracking-wider text-ecm-red-dark" aria-hidden={!sermon.series || undefined}>{sermon.series}</p>
        <h3 className="mt-1 line-clamp-2 text-lg font-bold leading-snug text-ecm-navy group-hover:text-ecm-green">{sermon.title}</h3>
        <p className="mt-auto line-clamp-1 pt-3 text-sm font-semibold text-gray-700">{who}</p>
        {sermon.date && <p className="text-sm text-gray-500"><time dateTime={sermon.date}>{formatDate(sermon.date)}</time></p>}
      </div>
    </Link>
  );
}
