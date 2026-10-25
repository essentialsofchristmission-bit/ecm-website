import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { formatDate, getDevotional, getDevotionals } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getDevotionals().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = getDevotional((await params).slug);
  if (!d) return {};
  return { title: `${d.title} | Moment With Jesus`, description: `${d.keyVerse}: ${d.keyVerseText}` };
}

export default async function DevotionalPage({ params }: Props) {
  const d = getDevotional((await params).slug);
  if (!d) notFound();
  return (
    <article className="py-12 sm:py-16">
      <Container className="max-w-3xl">
        <Link href="/devotionals" className="text-sm font-semibold text-ecm-green hover:underline">&larr; All devotionals</Link>
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-ecm-red-dark">Moment With Jesus &middot; {formatDate(d.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        <h1 className="mt-2 font-display text-5xl uppercase leading-tight text-ecm-navy sm:text-6xl">{d.title}</h1>

        <blockquote className="mt-8 rounded-3xl bg-ecm-green p-6 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">Key verse</p>
          <p className="mt-2 text-xl italic leading-relaxed">&ldquo;{d.keyVerseText}&rdquo;</p>
          <footer className="mt-3 font-bold">{d.keyVerse}</footer>
        </blockquote>

        <section className="mt-10">
          <h2 className="font-display text-3xl uppercase text-ecm-navy">Daily Meal</h2>
          <div className="mt-4 space-y-4 text-lg leading-relaxed text-gray-800">
            {d.message.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </section>

        <section className="mt-10 rounded-3xl bg-ecm-cream p-6 sm:p-8">
          <h2 className="font-display text-3xl uppercase text-ecm-navy">Prayer</h2>
          <p className="mt-3 text-lg leading-relaxed text-gray-800">{d.prayer}</p>
        </section>

        <section className="mt-6 rounded-3xl bg-ecm-navy p-6 text-white sm:p-8">
          <h2 className="font-display text-3xl uppercase">Proclamation</h2>
          <p className="mt-3 text-lg font-semibold leading-relaxed">{d.proclamation}</p>
        </section>
      </Container>
    </article>
  );
}
