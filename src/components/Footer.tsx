import Image from "next/image";
import Link from "next/link";
import { mapDirectionsUrl, site, whatsappUrl } from "@/lib/content";
import { NewsletterForm } from "./Forms";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./Icons";
import SocialLinks from "./SocialLinks";
import { Container } from "./ui";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/live", label: "ECM Live" },
  { href: "/sermons", label: "Sermons" },
  { href: "/events", label: "Events" },
  { href: "/ministries", label: "Ministries" },
  { href: "/devotionals", label: "Moment With Jesus" },
  { href: "/give", label: "Give" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-ecm-navy text-white">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="ECM logo" width={64} height={64} className="h-16 w-16 rounded-full bg-white" />
            <span className="font-display text-2xl uppercase leading-tight">Essentials of<br />Christ Mission</span>
          </Link>
          <p className="mt-4 text-white/80 italic">&ldquo;{site.tagline}&rdquo;</p>
          <SocialLinks className="mt-6" />
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-white/70">Quick links</h2>
          <ul className="grid grid-cols-2 gap-x-2 text-sm sm:grid-cols-1">
            {quickLinks.map((l) => (
              <li key={l.href}><Link href={l.href} className="inline-block py-2 text-white/90 hover:text-white hover:underline sm:py-1">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-white/70">Service times</h2>
          <ul className="space-y-3 text-sm">
            {site.serviceTimes.map((s) => (
              <li key={s.name}>
                <span className="block font-semibold">{s.name}</span>
                <span className="text-white/80">{s.day}, {s.time}</span>
              </li>
            ))}
          </ul>
          <h2 className="mb-3 mt-8 text-sm font-bold uppercase tracking-[0.2em] text-white/70">Contact</h2>
          <ul className="space-y-1 text-sm text-white/90">
            <li className="flex gap-2 py-1">
              <PinIcon className="h-5 w-5 shrink-0" />
              <span>
                {site.contact.address}, {site.contact.region}
                <a href={mapDirectionsUrl()} target="_blank" rel="noopener noreferrer" className="mt-1 block py-1 font-semibold text-white underline underline-offset-4 hover:text-white/80">
                  Get directions<span className="sr-only"> on Google Maps (opens in a new tab)</span>
                </a>
              </span>
            </li>
            <li><a className="flex gap-2 py-2 hover:underline sm:py-1" href={`tel:${site.contact.phone}`}><PhoneIcon className="h-5 w-5 shrink-0" />{site.contact.phoneDisplay}</a></li>
            <li><a className="flex gap-2 py-2 hover:underline sm:py-1" href={`mailto:${site.contact.email}`}><MailIcon className="h-5 w-5 shrink-0" /><span className="min-w-0">{site.contact.email.split("@")[0]}<wbr />@{site.contact.email.split("@")[1]}</span></a></li>
            <li><a className="flex gap-2 py-2 hover:underline sm:py-1" href={whatsappUrl()} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="h-5 w-5 shrink-0" />WhatsApp us</a></li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-white/70">Stay connected</h2>
          <p className="mb-4 text-sm text-white/80">Get news, events and devotionals in your inbox.</p>
          {/* Sign-ups go to the newsletter form when one is set up, otherwise to the church's contact form (marked "New newsletter signup"). */}
          <NewsletterForm formUrl={site.forms.newsletter || site.forms.contact} email={site.contact.email} />
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/70 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Essentials of Christ Mission. All rights reserved.</p>
          <p>{site.contact.address}, {site.contact.region}</p>
        </Container>
      </div>
    </footer>
  );
}
