"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/live", label: "ECM Live" },
  { href: "/sermons", label: "Sermons" },
  { href: "/events", label: "Events" },
  { href: "/ministries", label: "Ministries" },
  { href: "/give", label: "Give" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ isLive }: { isLive: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Essentials of Christ Mission home">
          <Image src="/images/logo.png" alt="ECM logo" width={52} height={52} className="h-12 w-12 rounded-full" priority />
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-extrabold uppercase tracking-wide text-ecm-green">Essentials of</span>
            <span className="block text-sm font-extrabold uppercase tracking-wide text-ecm-navy">Christ Mission</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive(item.href) ? "text-ecm-green" : "text-gray-700 hover:text-ecm-green"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/live"
            className="inline-flex items-center gap-2 rounded-full bg-ecm-red-dark px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-ecm-red sm:px-5 sm:text-sm"
          >
            <span className={`h-2.5 w-2.5 rounded-full bg-white ${isLive ? "live-dot" : ""}`} aria-hidden="true" />
            Watch Live
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ecm-navy hover:bg-gray-100 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-gray-100 bg-white xl:hidden">
          <ul className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block rounded-xl px-4 py-3 text-base font-semibold ${
                    isActive(item.href) ? "bg-ecm-cream text-ecm-green" : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/devotionals" className="block rounded-xl px-4 py-3 text-base font-semibold text-gray-800 hover:bg-gray-50">
                Moment With Jesus
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
