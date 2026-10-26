import type { Metadata } from "next";
import MinistryCard from "@/components/MinistryCard";
import { Container, PageHero } from "@/components/ui";
import { getMinistries } from "@/lib/content";

export const metadata: Metadata = { title: "Ministries", description: "Find your place to serve and grow at Essentials of Christ Mission." };

export default function MinistriesPage() {
  return (
    <>
      <PageHero title="Ministries" subtitle="Find your people, use your gifts and grow in faith." image="/images/banner-ministries.jpg" />
      <section className="py-16 sm:py-20">
        <Container>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:[&>li:last-child:nth-child(3n+1)]:col-start-2">
            {getMinistries().map((m) => <li key={m.slug}><MinistryCard ministry={m} /></li>)}
          </ul>
        </Container>
      </section>
    </>
  );
}
