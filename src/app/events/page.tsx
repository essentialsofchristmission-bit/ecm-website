import type { Metadata } from "next";
import EventCard from "@/components/EventCard";
import EventsCalendar from "@/components/EventsCalendar";
import { Container, PageHero, SectionHeading } from "@/components/ui";
import { getUpcomingEvents } from "@/lib/content";

export const metadata: Metadata = { title: "Events", description: "Upcoming events at Essentials of Christ Mission." };
export const revalidate = 3600;

export default function EventsPage() {
  const events = getUpcomingEvents();
  return (
    <>
      <PageHero title="Events" subtitle="There is always something happening at ECM. Come and be part of it." image="/images/gallery-04.jpg" />
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Coming up" title="Upcoming events" />
          {events.length ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => <li key={e.slug}><EventCard event={e} /></li>)}
            </ul>
          ) : (
            <p className="text-center text-gray-600">New events are coming soon.</p>
          )}
        </Container>
      </section>
      <section className="bg-ecm-cream py-16 sm:py-20">
        <Container className="max-w-5xl">
          <SectionHeading eyebrow="Calendar" title="Events calendar" />
          <EventsCalendar events={events} />
        </Container>
      </section>
    </>
  );
}
