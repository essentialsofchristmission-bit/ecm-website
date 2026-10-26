import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink, Container, PageHero, SectionHeading } from "@/components/ui";
import CopyButton from "@/components/CopyButton";
import { site, whatsappUrl } from "@/lib/content";

export const metadata: Metadata = { title: "Give", description: "Support the work of Essentials of Christ Mission through Mobile Money or bank transfer." };

function Detail({ label, value, copy }: { label: string; value: string; copy?: boolean }) {
  return (
    <div className="flex flex-col border-b border-gray-200 py-3 last:border-0 sm:flex-row sm:justify-between">
      <dt className="text-sm font-semibold text-gray-600">{label}</dt>
      <dd className="flex items-center gap-3 font-bold text-ecm-navy sm:justify-end">
          <span className="select-all">{value}</span>
          {copy && <CopyButton value={value} label={label} />}
        </dd>
    </div>
  );
}

export default function GivePage() {
  const { give } = site;
  return (
    <>
      <PageHero title="Give" subtitle="Partner with us to spread the gospel and serve our community." image="/images/give-banner.jpg" />
      <section className="py-16 sm:py-20">
        <Container className="max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-lg text-gray-700">{give.intro}</p>
            <p className="mt-4 italic text-ecm-green">{give.scripture}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
              <p className="inline-block rounded-full bg-yellow-300 px-3 py-1 text-xs font-bold uppercase text-gray-900">Mobile Money</p>
              <h2 className="mt-4 font-display text-3xl uppercase text-ecm-navy">
                {give.momo.logo ? (
                  <Image src={give.momo.logo} alt={give.momo.network} width={640} height={255} className="h-14 w-auto rounded-lg sm:h-16" />
                ) : (
                  give.momo.network
                )}
              </h2>
              <dl className="mt-4">
                <Detail label="Number" value={give.momo.number} copy />
                <Detail label="Name" value={give.momo.name} />
                {give.momo.merchantId && <Detail label="Merchant ID" value={give.momo.merchantId} copy />}
              </dl>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
              <p className="inline-block rounded-full bg-ecm-navy px-3 py-1 text-xs font-bold uppercase text-white">Bank transfer</p>
              <h2 className="mt-4 font-display text-3xl uppercase text-ecm-navy">
                {give.bank.logo ? (
                  <Image src={give.bank.logo} alt={`${give.bank.bankName}, United Bank for Africa`} width={600} height={270} className="h-14 w-auto sm:h-16" />
                ) : (
                  give.bank.bankName
                )}
              </h2>
              <dl className="mt-4">
                <Detail label="Account name" value={give.bank.accountName} />
                <Detail label="Account number" value={give.bank.accountNumber} copy />
                <Detail label="Branch" value={give.bank.branch} />
              </dl>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-gray-600">{give.reference}</p>
        </Container>
      </section>

      <section id="partner" className="scroll-mt-20 bg-ecm-green py-16 text-white sm:py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Evangelism Ministry" title="Partner with us" align="left" light intro={`Help us take the gospel to Akuse Prisons and beyond. Your gifts provide food, toiletries, Bibles and transport for the ${site.outreach.title}.`} />
            <ul className="space-y-2 text-white/90">
              <li>Give with the reference <strong className="text-white">Evangelism</strong> using the details above</li>
              <li>Donate items such as toiletries, clothing and Bibles</li>
              <li>Volunteer to join the next outreach team</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={whatsappUrl("Hello ECM, I would like to partner with the Evangelism Ministry outreach.")} variant="white">Become a partner</ButtonLink>
              <ButtonLink href="/ministries/evangelism" variant="outlineLight">Learn about Evangelism Ministry</ButtonLink>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
            <Image src={site.outreach.images[0]} alt="Go Ye Train outreach team" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </Container>
      </section>
    </>
  );
}
