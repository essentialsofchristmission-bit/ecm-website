import type { Metadata, Viewport } from "next";
import { Anton, Montserrat } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { site } from "@/lib/content";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: `${site.name} (${site.shortName}) | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: ["Essentials of Christ Mission", "ECM", "church in Tema", "church in Lashibi", "church Ghana", "Pastor Dr. Samuel E. Tandoh"],
  icons: { icon: "/images/logo.png", apple: "/images/logo.png" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.description,
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: site.name }],
    locale: "en_GH",
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description, images: ["/images/og-image.jpg"] },
};

export const viewport: Viewport = { themeColor: "#0B5C2E" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: site.name,
  url: site.siteUrl,
  logo: `${site.siteUrl}/images/logo.png`,
  telephone: site.contact.phone,
  email: site.contact.email,
  address: { "@type": "PostalAddress", streetAddress: site.contact.address, addressLocality: "Tema", addressRegion: "Greater Accra", addressCountry: "GH" },
  sameAs: Object.values(site.social),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${anton.variable}`}>
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header isLive={site.live.isLive} />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
