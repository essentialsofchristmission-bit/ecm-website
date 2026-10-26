import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink, Container, PageHero, SectionHeading } from "@/components/ui";
import Gallery from "@/components/Gallery";
import { about, aboutGallery, site } from "@/lib/content";

export const metadata: Metadata = { title: "About Us", description: `Our story, vision, mission, beliefs and leadership at ${site.name}.` };

function initials(name: string) {
  return name.replace(/^(Mr|Mrs|Ms|Dr|Pastor)\.?\s+/g, "").split(" ").filter((w) => /^[A-Z][a-z]/.test(w)).map((w) => w[0]).slice(0, 2).join("");
}

export default function AboutPage() {
  return (
    <>
      <PageHero title="About Us" subtitle={site.tagline} image="/images/about-church.jpg" />

      <section className="py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Who we are" title="Our story" align="left" />
            <div className="space-y-4 text-lg leading-relaxed text-gray-700">
              {about.story.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
          <div>
            <div className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4">
              {aboutGallery.slice(0, 4).map((p, i) => (
                <div key={p.src} className={`relative overflow-hidden rounded-3xl shadow-xl ${i === 0 ? "row-span-2 aspect-[3/4] sm:aspect-auto" : "aspect-[4/3]"}`}>
                  <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                </div>
              ))}
            </div>
            <a href="#gallery" className="mt-4 inline-block font-bold text-ecm-green underline-offset-4 hover:underline">See more photos of life at ECM</a>
          </div>
        </Container>
      </section>

      <section className="bg-ecm-cream py-20">
        <Container className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-ecm-green p-8 text-white sm:p-10">
            <h2 className="font-display text-4xl uppercase">Our vision</h2>
            <p className="mt-4 text-lg text-white/90">{about.vision}</p>
          </div>
          <div className="rounded-3xl bg-ecm-navy p-8 text-white sm:p-10">
            <h2 className="font-display text-4xl uppercase">Our mission</h2>
            <p className="mt-4 text-lg text-white/90">{about.mission}</p>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="What we believe" title="Statement of faith" />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {about.statementOfFaith.map((s) => (
              <li key={s.title} className="rounded-2xl border-t-4 border-ecm-red-dark bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h3 className="text-lg font-bold text-ecm-navy">{s.title}</h3>
                <p className="mt-2 text-gray-700">{s.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="gallery" className="scroll-mt-20 py-20">
        <Container>
          <SectionHeading eyebrow="Life at ECM" title="Our church in pictures" />
          <Gallery photos={aboutGallery} layout="masonry" initialCount={16} />
        </Container>
      </section>

      <section className="bg-ecm-cream py-20">
        <Container>
          <SectionHeading eyebrow="Our team" title="Leadership" />
          <ul className="flex flex-wrap justify-center gap-6">
            {about.leaders.map((l, i) => (
              <li key={i} className="w-full overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]">
                <div className="relative aspect-[4/5]">
                  {l.image ? (
                    <Image src={l.image} alt={l.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover object-top" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-ecm-green to-ecm-navy" aria-hidden="true">
                      <span className="font-display text-7xl text-white/90">{initials(l.name)}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-ecm-navy">{l.name}</h3>
                  <p className="text-sm font-bold uppercase tracking-wider text-ecm-red-dark">{l.role}</p>
                  <p className="mt-3 text-gray-700">{l.bio}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-12 text-center"><ButtonLink href="/contact">Get in touch</ButtonLink></div>
        </Container>
      </section>
    </>
  );
}
