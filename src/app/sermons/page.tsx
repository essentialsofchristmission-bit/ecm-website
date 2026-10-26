import type { Metadata } from "next";
import SermonBrowser from "@/components/SermonBrowser";
import { ButtonLink, Container, PageHero } from "@/components/ui";
import { getSermons, site } from "@/lib/content";

export const metadata: Metadata = { title: "Sermons", description: "Watch recent sermons from Essentials of Christ Mission." };

export default function SermonsPage() {
  return (
    <>
      <PageHero title="Sermons" subtitle="Be blessed by recent messages from ECM." image="/images/banner-sermons.jpg" />
      <section className="py-16 sm:py-20">
        <Container>
          <SermonBrowser sermons={getSermons()} />
          <div className="mt-12 text-center"><ButtonLink href={site.social.youtube} variant="red">See all on YouTube</ButtonLink></div>
        </Container>
      </section>
    </>
  );
}
