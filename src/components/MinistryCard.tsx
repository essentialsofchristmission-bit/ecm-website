import Image from "next/image";
import Link from "next/link";
import type { Ministry } from "@/lib/content";

export default function MinistryCard({ ministry }: { ministry: Ministry }) {
  return (
    <Link href={`/ministries/${ministry.slug}`} className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg focus-visible:-translate-y-1 motion-reduce:hover:translate-y-0 sm:aspect-[4/3] lg:aspect-[4/5]">
      <Image src={ministry.image} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-ecm-navy/95 via-ecm-navy/50 via-35% to-transparent to-65%" />
      <div className="relative p-5 text-white">
        <h3 className="font-display text-2xl uppercase">{ministry.name}</h3>
        <p className="mt-1 text-sm text-white/90">{ministry.summary}</p>
        <span className="mt-3 inline-block text-sm font-bold underline underline-offset-4">Learn more</span>
      </div>
    </Link>
  );
}
