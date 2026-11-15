"use client";

import { useEffect, useState } from "react";
import { FacebookIcon, WhatsAppIcon } from "./Icons";

/** Share a page: the phone's own share menu where there is one, plus WhatsApp, Facebook, X and Copy link. */
export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => setCanShare(typeof navigator.share === "function"), []);

  const text = `${title} | Essentials of Christ Mission`;
  const links = [
    { name: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, icon: <WhatsAppIcon className="h-4 w-4" /> },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, icon: <FacebookIcon className="h-4 w-4" /> },
    { name: "X", href: `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, icon: <span className="text-sm font-black leading-none" aria-hidden="true">𝕏</span> },
  ];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };
  const button = "inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-ecm-navy ring-1 ring-gray-200 transition-colors hover:bg-ecm-cream hover:ring-gray-300";

  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ecm-navy">Share this message</p>
      <ul className="flex flex-wrap gap-2">
        {canShare && (
          <li>
            <button type="button" className={button} onClick={() => navigator.share({ title: text, url }).catch(() => {})}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5" /></svg>
              Share
            </button>
          </li>
        )}
        {links.map((l) => (
          <li key={l.name}>
            <a href={l.href} target="_blank" rel="noopener noreferrer" className={button}>
              {l.icon}
              {l.name}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
        <li>
          <button type="button" className={button} onClick={copy}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 012-2h10" /></svg>
            {copied ? "Link copied" : "Copy link"}
          </button>
        </li>
      </ul>
      <p className="sr-only" aria-live="polite">{copied ? "Link copied" : ""}</p>
    </div>
  );
}
