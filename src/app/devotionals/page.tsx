import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container, PageHero } from "@/components/ui";
import { formatDate, getPublishedDevotionals } from "@/lib/content";

export const metadata: Metadata = { title: "Moment With Jesus Devotionals", description: "Daily devotionals from Essentials of Christ Mission." };
export const revalidate = 3600;

export default function DevotionalsPage() {
  const devotionals = getPublishedDevotionals();
  return (
    <>
      <PageHero title="Moment With Jesus" subtitle="Daily devotionals to feed your spirit. Newest first." />
      <section className="py-16 sm:py-20">
        <Container className="max-w-4xl">
          <ul className="space-y-6">
            {devotionals.map((d) => (
              <li key={d.slug}>
                <Link href={`/devotionals/${d.slug}`} className="flex gap-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-lg sm:gap-6 sm:p-8">
                  {d.image && (
                    <div className="relative aspect-[707/1000] w-20 shrink-0 overflow-hidden rounded-xl bg-ecm-cream sm:w-28">
                      <Image src={d.image} alt="" fill sizes="112px" className="object-cover object-top" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-bold uppercase tracking-wider text-ecm-red-dark">{formatDate(d.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                    <h2 className="mt-2 font-display text-3xl uppercase text-ecm-navy">{d.title}</h2>
                    {d.keyVerseText && <p className="mt-3 italic text-gray-700">&ldquo;{d.keyVerseText}&rdquo; <span className="font-bold not-italic text-ecm-green">{d.keyVerse}</span></p>}
                    <span className="mt-4 inline-block text-sm font-bold text-ecm-green underline underline-offset-4">Read devotional</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
