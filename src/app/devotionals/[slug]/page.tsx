import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink, Container } from "@/components/ui";
import { formatDate, getDevotional, getPublishedDevotionals } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

// Refresh every hour, so a devotional prepared in advance appears on its day.
export const revalidate = 3600;

export function generateStaticParams() {
  return getPublishedDevotionals().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = getDevotional((await params).slug);
  if (!d) return {};
  return {
    title: `${d.title} | Moment With Jesus`,
    description: d.keyVerseText ? `${d.keyVerse}: ${d.keyVerseText}` : `Moment With Jesus devotional for ${formatDate(d.date)}`,
    openGraph: d.image ? { images: [d.image] } : undefined,
  };
}

export default async function DevotionalPage({ params }: Props) {
  const d = getDevotional((await params).slug);
  if (!d) notFound();
  const hasText = Boolean(d.keyVerseText || d.message.length || d.prayer || d.proclamation);
  const download = d.image && (
    <ButtonLink href={d.image} download={`ECM-Moment-With-Jesus-${d.date}${d.image.slice(d.image.lastIndexOf("."))}`}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 20h14" /></svg>
      Download devotional
    </ButtonLink>
  );
  return (
    <article className="py-12 sm:py-16">
      <Container className="max-w-3xl">
        <Link href="/devotionals" className="text-sm font-semibold text-ecm-green hover:underline">&larr; All devotionals</Link>
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-ecm-red-dark">Moment With Jesus &middot; {formatDate(d.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        <h1 className="mt-2 font-display text-5xl uppercase leading-tight text-ecm-navy sm:text-6xl">{d.title}</h1>

        {/* With the text typed in, the text is the devotional and the image is only a download. */}
        {download && hasText && <div className="mt-6">{download}</div>}

        {d.image && !hasText && (
          <figure className="mt-8">
            <a href={d.image} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-3xl shadow-lg ring-1 ring-gray-100">
              <Image src={d.image} alt={`${d.title}, Moment With Jesus devotional for ${formatDate(d.date)}`} width={1414} height={2000} sizes="(min-width: 768px) 768px, 100vw" className="h-auto w-full" priority />
            </a>
            <figcaption className="mt-4 flex flex-wrap items-center gap-4">
              {download}
              <span className="text-sm text-gray-600">Tap the image to view it full size.</span>
            </figcaption>
          </figure>
        )}

        {d.keyVerseText && (
          <blockquote className="mt-8 rounded-3xl bg-ecm-green p-6 text-white sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">Key verse</p>
            <p className="mt-2 text-xl italic leading-relaxed">&ldquo;{d.keyVerseText}&rdquo;</p>
            <footer className="mt-3 font-bold">{d.keyVerse}</footer>
          </blockquote>
        )}

        {d.message.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-3xl uppercase text-ecm-navy">Daily Meal</h2>
            <div className="mt-4 space-y-4 text-lg leading-relaxed text-gray-800">
              {d.message.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </section>
        )}

        {d.prayer && (
          <section className="mt-10 rounded-3xl bg-ecm-cream p-6 sm:p-8">
            <h2 className="font-display text-3xl uppercase text-ecm-navy">Prayer</h2>
            <p className="mt-3 text-lg leading-relaxed text-gray-800">{d.prayer}</p>
          </section>
        )}

        {d.proclamation && (
          <section className="mt-6 rounded-3xl bg-ecm-navy p-6 text-white sm:p-8">
            <h2 className="font-display text-3xl uppercase">Proclamation</h2>
            <p className="mt-3 text-lg font-semibold leading-relaxed">{d.proclamation}</p>
          </section>
        )}
      </Container>
    </article>
  );
}
