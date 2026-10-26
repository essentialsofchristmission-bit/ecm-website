import type { Metadata } from "next";
import { ContactForm, PrayerForm } from "@/components/Forms";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/Icons";
import MapEmbed from "@/components/MapEmbed";
import ServiceTimes from "@/components/ServiceTimes";
import { ButtonLink, Container, PageHero } from "@/components/ui";
import { mapDirectionsUrl, site, whatsappUrl } from "@/lib/content";

export const metadata: Metadata = { title: "Contact", description: "Get in touch with Essentials of Christ Mission, send a prayer request or find directions." };

export default function ContactPage() {
  const { contact, forms } = site;
  return (
    <>
      <PageHero title="Contact Us" subtitle="We would love to hear from you." image="/images/contact-hero.jpg" />
      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-6">
            <div className="rounded-3xl bg-ecm-cream p-6">
              <h2 className="mb-4 font-display text-2xl uppercase text-ecm-navy">Reach us</h2>
              <ul className="space-y-4 text-gray-800">
                <li className="flex gap-3"><PinIcon className="h-5 w-5 shrink-0 text-ecm-green" />{contact.address}, {contact.region}</li>
                <li><a href={`tel:${contact.phone}`} className="flex gap-3 hover:underline"><PhoneIcon className="h-5 w-5 shrink-0 text-ecm-green" />{contact.phoneDisplay}</a></li>
                <li><a href={`mailto:${contact.email}`} className="flex gap-3 break-all hover:underline"><MailIcon className="h-5 w-5 shrink-0 text-ecm-green" />{contact.email}</a></li>
              </ul>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#1a7f45] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-[#156a39]">
                <WhatsAppIcon /> Chat on WhatsApp
              </a>
            </div>
            <div>
              <h2 className="mb-4 font-display text-2xl uppercase text-ecm-navy">Service times</h2>
              <ServiceTimes />
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
            <h2 className="mb-6 font-display text-3xl uppercase text-ecm-navy">Send a message</h2>
            <ContactForm formId={forms.contactFormspreeId} email={contact.email} />
          </div>
          <div id="prayer" className="scroll-mt-24 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
            <h2 className="mb-2 font-display text-3xl uppercase text-ecm-navy">Prayer request</h2>
            <p className="mb-6 text-gray-600">Our prayer team would be honoured to pray with you.</p>
            <PrayerForm formId={forms.prayerFormspreeId} email={contact.email} />
          </div>
        </Container>
      </section>
      <section className="pb-20">
        <Container>
          <MapEmbed className="h-[28rem]" />
          <div className="mt-6 text-center"><ButtonLink href={mapDirectionsUrl()}>Get directions</ButtonLink></div>
        </Container>
      </section>
    </>
  );
}
