import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SermonCard from "@/components/SermonCard";
import { Container, PageHero } from "@/components/ui";
import { getSermons, guestPreachers } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

async function findGuest(slug: string) {
  return guestPreachers(await getSermons()).find((p) => p.slug === slug);
}

export async function generateStaticParams() {
  return guestPreachers(await getSermons()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await findGuest((await params).slug);
  if (!p) return {};
  return { title: `${p.name} | Sermons`, description: `Messages by ${p.name} at Essentials of Christ Mission.` };
}

export default async function GuestPreacherPage({ params }: Props) {
  const p = await findGuest((await params).slug);
  if (!p) notFound();
  const count = p.sermons.length;
  return (
    <>
      <PageHero title={p.name} subtitle={`Guest preacher at ECM · ${count} message${count === 1 ? "" : "s"}`} image={p.photo || "/images/banner-sermons.jpg"} />
      <section className="py-16 sm:py-20">
        <Container>
          <Link href="/sermons#guest-preachers" className="text-sm font-semibold text-ecm-green hover:underline">&larr; All guest preachers</Link>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {p.sermons.map((s) => <li key={s.youtubeId}><SermonCard sermon={s} /></li>)}
          </ul>
        </Container>
      </section>
    </>
  );
}
