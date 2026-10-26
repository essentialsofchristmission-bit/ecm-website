import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClockIcon } from "@/components/Icons";
import { ButtonLink, Container, PageHero } from "@/components/ui";
import { getMinistries, getMinistry, whatsappUrl } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getMinistries().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = getMinistry((await params).slug);
  if (!m) return {};
  return { title: m.name, description: m.summary, openGraph: { images: [m.image] } };
}

export default async function MinistryPage({ params }: Props) {
  const m = getMinistry((await params).slug);
  if (!m) notFound();
  return (
    <>
      <PageHero title={m.name} subtitle={m.summary} image={m.image} />
      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Link href="/ministries" className="text-sm font-semibold text-ecm-green hover:underline">&larr; All ministries</Link>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-gray-700">
              {m.description.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-4">
              {m.photos.map((src, i) => (
                <li key={src + i} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image src={src} alt={`${m.name} photo ${i + 1}`} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
                </li>
              ))}
            </ul>
          </div>
          <aside className="h-fit space-y-5 rounded-3xl bg-ecm-cream p-8 lg:sticky lg:top-28">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ecm-red-dark">Leader</p>
              <p className="text-lg font-bold text-ecm-navy">{m.leader}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ecm-red-dark">We meet</p>
              <p className="flex items-center gap-2 text-lg font-bold text-ecm-navy"><ClockIcon className="h-5 w-5 text-ecm-green" />{m.meetingTime}</p>
            </div>
            <ButtonLink href={whatsappUrl(`Hello ${m.leader}, I would like to join the ${m.name}.`, m.phone)} variant="red" className="w-full">Join this ministry</ButtonLink>
            <ButtonLink href={m.phone ? whatsappUrl(`Hello ${m.leader}, I am contacting you about the ${m.name}.`, m.phone) : "/contact"} variant="outline" className="w-full">Contact us</ButtonLink>
          </aside>
        </Container>
      </section>
    </>
  );
}
