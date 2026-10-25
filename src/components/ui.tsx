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
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
}) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${variants[variant]} ${className}`;
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

export function PageHero({ title, subtitle, image }: { title: string; subtitle?: string; image?: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-ecm-green">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ecm-green/90 via-ecm-green/75 to-ecm-navy/60" />
      <Container className="py-20 text-center sm:py-28">
        <h1 className="font-display text-5xl uppercase text-white sm:text-6xl lg:text-7xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">{subtitle}</p>}
      </Container>
    </section>
  );
}
