import type { Metadata } from "next";
import PreacherCard from "@/components/PreacherCard";
import SermonBrowser from "@/components/SermonBrowser";
import { ButtonLink, Container, PageHero, SectionHeading } from "@/components/ui";
import { getSermons, guestPreachers, residentPreacher, site } from "@/lib/content";

export const metadata: Metadata = { title: "Sermons", description: "Watch sermons from Essentials of Christ Mission, by our pastor and guest preachers." };
export const revalidate = 3600;

export default async function SermonsPage() {
  const sermons = await getSermons();
  const guests = guestPreachers(sermons);
  return (
    <>
      <PageHero title="Sermons" subtitle="Be blessed by messages from ECM." image="/images/banner-sermons.jpg" />
      <section className="py-16 sm:py-20">
        <Container>
          <SermonBrowser sermons={sermons} residentName={residentPreacher} />
          <div className="mt-12 text-center"><ButtonLink href={site.social.youtube} variant="red">See all on YouTube</ButtonLink></div>
        </Container>
      </section>

      {guests.length > 0 && (
        <section id="guest-preachers" className="scroll-mt-20 bg-ecm-cream py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Visiting ministers" title="Guest preachers" intro="Messages from the men and women of God who have ministered at ECM." />
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {guests.map((p) => <li key={p.slug}><PreacherCard preacher={p} /></li>)}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
