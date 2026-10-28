import type { Sermon } from "@/lib/sermons";
import { formatDate } from "@/lib/format";
import { PlayIcon } from "./Icons";

export default function SermonCard({ sermon }: { sermon: Sermon }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-video overflow-hidden bg-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={sermon.thumbnail} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ecm-red-dark text-white"><PlayIcon className="h-6 w-6" /></span>
        </span>
        {sermon.guest && <span className="absolute left-3 top-3 rounded-full bg-ecm-navy/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">Guest</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {sermon.series && <p className="text-xs font-bold uppercase tracking-wider text-ecm-red-dark">{sermon.series}</p>}
        <h3 className="mt-1 text-lg font-bold text-ecm-navy">{sermon.title}</h3>
        <p className="mt-auto pt-3 text-sm text-gray-600">{sermon.preacher}</p>
        <p className="text-sm text-gray-500">{[sermon.service, sermon.date && formatDate(sermon.date)].filter(Boolean).join(" · ")}</p>
      </div>
    </a>
  );
}
