import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { YouTubeIcon } from "@/components/Icons";
import LiteYouTube from "@/components/LiteYouTube";
import SermonCard from "@/components/SermonCard";
import ShareButtons from "@/components/ShareButtons";
import { ButtonLink, Container } from "@/components/ui";
import { findSermon, formatDate, getSermons, relatedSermons, site, type Sermon } from "@/lib/content";
import { sermonKind } from "@/lib/sermon-groups";

type Props = { params: Promise<{ id: string }> };

export const revalidate = 3600;

const pageUrl = (s: Sermon) => `${site.siteUrl.replace(/\/$/, "")}/sermons/${s.youtubeId}`;
const watchUrl = (s: Sermon) => `https://www.youtube.com/watch?v=${s.youtubeId}`;
const fullDate = (iso: string) => formatDate(iso, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

/** A one-line summary built only from what is known about the video. */
function summary(s: Sermon) {
  const by = s.preacher && (s.category === "Prayer Meetings" ? ` led by ${s.preacher}` : ` by ${s.preacher}`);
  return `${sermonKind(s)}${by || ""}${s.date ? ` on ${formatDate(s.date)}` : ""} at Essentials of Christ Mission.`;
}

/** Where the preacher's name links to: their own page, or the Sermons page filtered to our pastor. */
function preacherHref(s: Sermon) {
  if (s.role === "Resident Pastor") return "/sermons?preacher=resident";
  if (s.role === "ECM Leadership" || s.role === "Guest Preacher") return `/sermons/preachers/${s.preacherSlug}`;
  return "";
}

// The newest videos are built in advance; any other one is built the first time someone opens it.
export async function generateStaticParams() {
  return (await getSermons()).slice(0, 30).map((s) => ({ id: s.youtubeId }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = findSermon(await getSermons(), (await params).id);
  if (!s) return {};
  const description = s.description || summary(s);
  return {
    title: `${s.title} | Sermons`,
    description,
    alternates: { canonical: `/sermons/${s.youtubeId}` },
    openGraph: { type: "video.other", title: s.title, description, url: pageUrl(s), images: [{ url: s.thumbnail, width: 480, height: 360, alt: s.title }], videos: [{ url: watchUrl(s) }] },
    twitter: { card: "summary_large_image", title: s.title, description, images: [s.thumbnail] },
  };
}

export default async function SermonPage({ params }: Props) {
  const sermons = await getSermons();
  const s = findSermon(sermons, (await params).id);
  if (!s) notFound();
  const related = relatedSermons(sermons, s, 3);
  const href = preacherHref(s);
  const kind = sermonKind(s);

  // Details shown beside the video. Only what is known is listed; nothing is filled in by guesswork.
  const details: [string, React.ReactNode][] = [
    [s.category === "Prayer Meetings" ? "Led by" : "Preacher", s.preacher ? (href ? <Link href={href} className="font-semibold text-ecm-green underline-offset-4 hover:underline">{s.preacher}</Link> : s.preacher) : s.category === "Prayer Meetings" ? "To be updated" : ""],
    ["Date", s.date && <time dateTime={s.date}>{fullDate(s.date)}</time>],
    ["Type", kind],
    ["Series", s.series && <Link href={`/sermons?series=${encodeURIComponent(s.series)}`} className="font-semibold text-ecm-green underline-offset-4 hover:underline">{s.series}</Link>],
    ["Scripture", s.scripture],
    ["Length", s.duration],
    ["Listed under", <Link key="category" href={`/sermons?tab=${encodeURIComponent(s.category)}`} className="font-semibold text-ecm-green underline-offset-4 hover:underline">{s.category}</Link>],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: s.title,
    description: s.description || summary(s),
    thumbnailUrl: [s.thumbnail],
    ...(s.date && { uploadDate: s.date }),
    embedUrl: `https://www.youtube.com/embed/${s.youtubeId}`,
    url: pageUrl(s),
    ...(s.preacher && s.preacher !== "Panel" && { author: { "@type": "Person", name: s.preacher } }),
    publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.siteUrl}/images/logo.png` } },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="py-10 sm:py-14">
        <Container>
          <nav aria-label="Breadcrumb" className="text-sm">
            <ol className="flex flex-wrap items-center gap-x-2 text-gray-600">
              <li><Link href="/sermons" className="font-semibold text-ecm-green hover:underline">Sermons</Link></li>
              {s.series && (
                <>
                  <li aria-hidden="true">/</li>
                  <li><Link href={`/sermons?series=${encodeURIComponent(s.series)}`} className="font-semibold text-ecm-green hover:underline">{s.series}</Link></li>
                </>
              )}
            </ol>
          </nav>

          <header className="mt-6 max-w-4xl">
            <p className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-ecm-navy px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">{kind}</span>
              {s.date && <time dateTime={s.date} className="text-sm font-semibold text-gray-600">{formatDate(s.date)}</time>}
            </p>
            <h1 className="mt-3 font-display text-4xl uppercase leading-tight text-ecm-navy sm:text-5xl">{s.title}</h1>
            {s.preacher && s.preacher !== "Panel" && (
              <p className="mt-2 text-lg font-semibold text-gray-800">{s.category === "Prayer Meetings" ? `Led by ${s.preacher}` : s.preacher}</p>
            )}
          </header>

          <div className="mt-8 grid gap-8 lg:grid-cols-3 lg:gap-10">
            <div className="lg:col-span-2">
              <LiteYouTube id={s.youtubeId} title={s.title} thumbnail={s.thumbnail} />
              <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <ShareButtons url={pageUrl(s)} title={s.title} />
                <ButtonLink href={watchUrl(s)} variant="red" className="shrink-0"><YouTubeIcon /> Watch on YouTube</ButtonLink>
              </div>
              {s.description && (
                <section className="mt-10" aria-labelledby="about-heading">
                  <h2 id="about-heading" className="font-display text-3xl uppercase text-ecm-navy">About this message</h2>
                  <div className="mt-3 space-y-4 text-lg leading-relaxed text-gray-800">
                    {s.description.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </section>
              )}
            </div>

            <aside className="h-fit rounded-2xl bg-ecm-cream p-6" aria-labelledby="details-heading">
              <h2 id="details-heading" className="text-sm font-bold uppercase tracking-[0.2em] text-ecm-red-dark">Message details</h2>
              <dl className="mt-4 divide-y divide-gray-200">
                {details.filter(([, value]) => value).map(([name, value]) => (
                  <div key={name} className="grid grid-cols-[7rem_1fr] gap-3 py-3 text-sm">
                    <dt className="font-bold text-ecm-navy">{name}</dt>
                    <dd className="text-gray-800">{value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <section className="bg-ecm-cream py-14 sm:py-16" aria-labelledby="related-heading">
          <Container>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-ecm-red-dark">Keep watching</p>
                <h2 id="related-heading" className="mt-1 font-display text-4xl uppercase text-ecm-navy">Related messages</h2>
              </div>
              <Link href="/sermons" className="text-sm font-semibold text-ecm-green underline underline-offset-4 hover:text-ecm-green-dark">All sermons</Link>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => <li key={r.youtubeId}><SermonCard sermon={r} /></li>)}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
