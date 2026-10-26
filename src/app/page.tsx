import Image from "next/image";
import Link from "next/link";
import EventCard from "@/components/EventCard";
import Gallery from "@/components/Gallery";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/Icons";
import LiveBanner from "@/components/LiveBanner";
import MapEmbed from "@/components/MapEmbed";
import MinistryCard from "@/components/MinistryCard";
import ServiceTimes from "@/components/ServiceTimes";
import YouTubeEmbed, { videoEmbedUrl } from "@/components/YouTubeEmbed";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import {
  formatDate,
  gallery,
  getMinistries,
  getLatestVideo,
  getTodaysDevotional,
  getUpcomingEvents,
  mapDirectionsUrl,
  site,
} from "@/lib/content";

export const revalidate = 3600;

export default async function Home() {
  const latest = await getLatestVideo();
  const devotional = getTodaysDevotional();
  const events = getUpcomingEvents().slice(0, 3);
  const ministries = getMinistries();

  return (
    <>
      {/* 1. Hero */}
      <section className="relative isolate flex min-h-[calc(100svh-5rem)] items-center overflow-hidden">
        <Image src="/images/hero-worship.jpg" alt="Worship at Essentials of Christ Mission" fill priority sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ecm-green/95 via-ecm-green/75 to-ecm-navy/40" />
        <Container className="py-20 text-white">
          <p className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] backdrop-blur">
            Our {site.theme.year} theme
          </p>
          <h1 className="max-w-4xl font-display text-5xl uppercase leading-[1.05] sm:text-7xl lg:text-8xl">{site.theme.headline}</h1>
          {site.theme.scriptureText && <p className="mt-5 max-w-2xl text-base italic leading-relaxed text-white/90 sm:text-lg">&ldquo;{site.theme.scriptureText}&rdquo;</p>}
          <p className="mt-3 text-xl font-semibold text-white/90 sm:text-2xl">{site.theme.scripture}</p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {site.serviceTimes.map((s) => (
              <li key={s.name} className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                <span className="block text-xs font-bold uppercase tracking-wider text-white/75">{s.name}</span>
                <span className="text-sm font-semibold">{s.day}, {s.time}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="#visit" variant="red" className="px-8 py-4">Plan a Visit</ButtonLink>
            <ButtonLink href="/live" variant="outlineLight" className="px-8 py-4">Watch Online</ButtonLink>
          </div>
        </Container>
      </section>

      {/* 2. Live banner */}
      <LiveBanner />

      {/* 3. Latest sermon */}
      {latest && (
        <section className="py-20 sm:py-24">
          <Container className="grid items-center gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <YouTubeEmbed src={videoEmbedUrl(latest.youtubeId)} title={latest.title} />
            </div>
            <div className="lg:col-span-2">
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-ecm-red-dark">Latest sermon</p>
              <h2 className="font-display text-4xl uppercase leading-tight text-ecm-navy sm:text-5xl">{latest.title}</h2>
              <p className="mt-4 text-lg font-semibold text-gray-800">{latest.preacher}</p>
              <p className="text-gray-600">{latest.service} &middot; {formatDate(latest.date)}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/sermons">More sermons</ButtonLink>
                <ButtonLink href={site.social.youtube} variant="outline">Subscribe on YouTube</ButtonLink>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 4. Welcome */}
      <section className="bg-ecm-cream py-20 sm:py-24">
        <Container className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative mx-auto w-full max-w-md pl-4 pt-4">
            <div className="absolute left-0 top-0 h-[calc(100%-1rem)] w-[calc(100%-1rem)] rounded-3xl bg-ecm-green" aria-hidden="true" />
            <div className="relative aspect-square overflow-hidden rounded-3xl shadow-xl">
              <Image src={site.welcome.pastorImage} alt={site.welcome.pastorImageAlt ?? site.welcome.pastorName} fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover object-top" />
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-ecm-red-dark">Welcome to ECM</p>
            <h2 className="font-display text-4xl uppercase leading-tight text-ecm-navy sm:text-5xl">{site.welcome.heading}</h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-700">{site.welcome.message}</p>
            <p className="mt-6 font-bold text-ecm-green">{site.welcome.pastorName}</p>
            <p className="text-sm text-gray-600">{site.welcome.pastorTitle}</p>
            <ButtonLink href="/about" className="mt-8">About Us</ButtonLink>
          </div>
        </Container>
      </section>

      {/* 5. Moment With Jesus */}
      {devotional && (
        <section className="py-20 sm:py-24">
          <Container>
            <div className="relative overflow-hidden rounded-3xl bg-ecm-navy p-8 text-white shadow-xl sm:p-12 lg:p-16">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ecm-green/40 blur-3xl" aria-hidden="true" />
              <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-ecm-red/30 blur-3xl" aria-hidden="true" />
              <div className="relative grid gap-8 lg:grid-cols-3 lg:items-center">
                <div className="lg:col-span-2">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/75">Moment With Jesus &middot; {formatDate(devotional.date, { weekday: "long", day: "numeric", month: "long" })}</p>
                  <h2 className="mt-3 font-display text-4xl uppercase leading-tight sm:text-5xl">{devotional.title}</h2>
                  <blockquote className="mt-6 border-l-4 border-ecm-red pl-5 text-lg italic text-white/90">
                    &ldquo;{devotional.keyVerseText}&rdquo;
                    <footer className="mt-2 text-sm font-bold not-italic text-white">{devotional.keyVerse}</footer>
                  </blockquote>
                </div>
                <div className="flex flex-col gap-3 lg:items-end">
                  <ButtonLink href={`/devotionals/${devotional.slug}`} variant="red" className="px-8 py-4">Read today&apos;s devotional</ButtonLink>
                  <Link href="/devotionals" className="text-sm font-semibold text-white/85 underline underline-offset-4 hover:text-white">Past devotionals</Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 6. Ministries */}
      <section className="bg-ecm-cream py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Get involved" title="Our ministries" intro="There is a place for everyone at ECM. Find your people, use your gifts and grow in faith." />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ministries.slice(0, 8).map((m) => <li key={m.slug}><MinistryCard ministry={m} /></li>)}
          </ul>
          <div className="mt-10 text-center">
            <ButtonLink href="/ministries" variant="green">See all ministries</ButtonLink>
          </div>
        </Container>
      </section>

      {/* 7. Outreach highlight */}
      <section className="py-20 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-ecm-red-dark">Evangelism Ministry</p>
            <h2 className="font-display text-4xl uppercase leading-tight text-ecm-navy sm:text-5xl">{site.outreach.title}</h2>
            <p className="mt-2 text-xl font-semibold text-ecm-green">{site.outreach.subtitle}</p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-ecm-cream px-5 py-3">
              <span className="font-display text-5xl text-ecm-red-dark">{site.outreach.years}</span>
              <span className="text-sm font-bold uppercase leading-tight text-ecm-navy">years<br />running</span>
            </div>
            <p className="mt-6 text-lg leading-relaxed text-gray-700">{site.outreach.text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/give#partner" variant="red">Support our outreach</ButtonLink>
              <ButtonLink href="/ministries/evangelism" variant="outline">About Evangelism Ministry</ButtonLink>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {site.outreach.images.map((src, i) => (
              <div key={src} className={`relative overflow-hidden rounded-2xl shadow-md ${i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"}`}>
                <Image src={src} alt={`Go Ye Train outreach to Akuse Prisons, photo ${i + 1}`} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 8. Upcoming events */}
      <section className="bg-ecm-cream py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="What's on" title="Upcoming events" />
          {events.length ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => <li key={e.slug}><EventCard event={e} /></li>)}
            </ul>
          ) : (
            <p className="text-center text-gray-600">New events are coming soon. Check back shortly.</p>
          )}
          <div className="mt-10 text-center"><ButtonLink href="/events">See all events</ButtonLink></div>
        </Container>
      </section>

      {/* 9. Gallery */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Life at ECM" title="Photo gallery" />
          <Gallery photos={gallery} />
        </Container>
      </section>

      {/* 10. Plan your visit */}
      <section id="visit" className="scroll-mt-20 bg-ecm-green py-20 text-white sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Plan your visit" title="We'd love to meet you" align="left" light intro="Come as you are. Our welcome team will be at the door to greet you and help you find a seat." />
            <ServiceTimes light />
            <ul className="mt-8 space-y-3 text-white/90">
              <li className="flex gap-3"><PinIcon className="h-5 w-5 shrink-0" />{site.contact.address}, {site.contact.region}</li>
              <li><a href={`tel:${site.contact.phone}`} className="flex gap-3 hover:underline"><PhoneIcon className="h-5 w-5 shrink-0" />{site.contact.phoneDisplay}</a></li>
              <li><a href={`mailto:${site.contact.email}`} className="flex gap-3 break-all hover:underline"><MailIcon className="h-5 w-5 shrink-0" />{site.contact.email}</a></li>
            </ul>
            <ButtonLink href={mapDirectionsUrl()} variant="white" className="mt-8">Get directions</ButtonLink>
          </div>
          <MapEmbed className="h-full min-h-96" />
        </Container>
      </section>
    </>
  );
}
