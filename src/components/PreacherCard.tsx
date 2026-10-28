import Image from "next/image";
import Link from "next/link";
import type { Preacher } from "@/lib/sermons";

// One guest preacher: photo (or their latest video's picture), name and number of messages.
export default function PreacherCard({ preacher }: { preacher: Preacher }) {
  const count = preacher.sermons.length;
  return (
    <Link
      href={`/sermons/preachers/${preacher.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-video overflow-hidden bg-gray-200">
        {preacher.photo ? (
          <Image src={preacher.photo} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover object-top transition duration-500 group-hover:scale-105" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preacher.sermons[0].thumbnail} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-ecm-navy">{preacher.name}</h3>
        <p className="mt-auto pt-2 text-sm text-gray-600">{count} message{count === 1 ? "" : "s"}</p>
      </div>
    </Link>
  );
}
