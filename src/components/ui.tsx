import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <div className={`mb-10 ${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow && (
        <p className={`mb-2 text-sm font-bold uppercase tracking-[0.2em] ${light ? "text-white/80" : "text-ecm-red-dark"}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-display text-4xl uppercase leading-tight sm:text-5xl ${light ? "text-white" : "text-ecm-navy"}`}>
        {title}
      </h2>
      {intro && <p className={`mt-4 text-lg ${light ? "text-white/85" : "text-gray-600"}`}>{intro}</p>}
    </div>
  );
}

type Variant = "red" | "green" | "navy" | "outline" | "outlineLight" | "white";

const variants: Record<Variant, string> = {
  red: "bg-ecm-red-dark text-white hover:bg-ecm-red",
  green: "bg-ecm-green text-white hover:bg-ecm-green-dark",
  navy: "bg-ecm-navy text-white hover:bg-ecm-navy/90",
  outline: "border-2 border-ecm-green text-ecm-green hover:bg-ecm-green hover:text-white",
  outlineLight: "border-2 border-white text-white hover:bg-white hover:text-ecm-green",
  white: "bg-white text-ecm-green hover:bg-ecm-cream",
};

export function ButtonLink({
  href,
  children,
  variant = "green",
  className = "",
  external = false,
  download,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
  download?: string;
}) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${variants[variant]} ${className}`;
  if (download) {
    return (
      <a href={href} download={download} className={cls}>
        {children}
      </a>
    );
  }
  if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function PageHero({
  title,
  subtitle,
  image,
  photos,
}: {
  title: string;
  subtitle?: string;
  image?: string;
  photos?: { src: string; alt: string }[];
}) {
  const collage = photos && photos.length > 0;
  return (
    <section className={`relative isolate flex items-center overflow-hidden bg-ecm-green ${collage ? "min-h-[28rem] lg:min-h-[30rem]" : ""}`}>
      {collage ? (
        // Layout in globals.css (.hero-collage): 3 photos stacked on phones, 4 on tablets, 6 on desktop.
        <ul className="hero-collage absolute inset-0 -z-10">
          {photos.map((p, i) => (
            <li key={p.src} className="relative overflow-hidden">
              <Image src={p.src} alt={p.alt} fill priority={i < 3} sizes={i === 1 || i === 5 ? "(min-width: 1024px) 40vw, (min-width: 640px) 67vw, 100vw" : "(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 100vw"} className="object-cover" />
            </li>
          ))}
        </ul>
      ) : (
        image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        )
      )}
      <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${collage ? "from-ecm-green/85 via-ecm-green/65 to-ecm-navy/55" : "from-ecm-green/90 via-ecm-green/75 to-ecm-navy/60"}`} />
      <Container className={`py-20 text-center sm:py-28 ${collage ? "[text-shadow:0_2px_14px_rgb(0_0_0/0.55)]" : ""}`}>
        <h1 className="font-display text-5xl uppercase text-white sm:text-6xl lg:text-7xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">{subtitle}</p>}
      </Container>
    </section>
  );
}
