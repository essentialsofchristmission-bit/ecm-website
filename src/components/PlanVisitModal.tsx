"use client";

import { useEffect, useRef, useState } from "react";
import { PinIcon, WhatsAppIcon } from "./Icons";

type Faq = { question: string; answer: string };
type Props = {
  title: string;
  intro: string;
  sundaysToShow: number;
  childrenNote: string;
  faqs: Faq[];
  serviceName: string;
  serviceTime: string;
  directionsUrl: string;
  whatsapp: string;
};

/** The next few Sundays (Ghana time). Today counts while the Sunday service has not ended. */
function upcomingSundays(count: number) {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Accra" }));
  const first = new Date(now);
  first.setHours(12, 0, 0, 0);
  const daysAhead = (7 - now.getDay()) % 7;
  first.setDate(first.getDate() + (daysAhead === 0 && now.getHours() >= 11 ? 7 : daysAhead));
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(first);
    d.setDate(first.getDate() + i * 7);
    return d;
  });
}

const dayLabel = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

/**
 * "Plan your visit" window. Any link to #visit (such as the hero's Plan a Visit button) opens it.
 * Without JavaScript those links simply scroll to the Plan your visit section, as before.
 */
export default function PlanVisitModal(props: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const [sundays, setSundays] = useState<Date[]>([]);
  const [day, setDay] = useState(0);
  const [children, setChildren] = useState(false);

  useEffect(() => {
    // Runs before Next.js handles the link, so the page does not jump to #visit.
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.('a[href="#visit"], a[href="/#visit"]');
      if (!link || !dialog.current) return;
      e.preventDefault();
      trigger.current = link as HTMLElement;
      setSundays(upcomingSundays(props.sundaysToShow));
      setDay(0);
      dialog.current.showModal();
      document.documentElement.style.overflow = "hidden";
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [props.sundaysToShow]);

  const close = () => dialog.current?.close();
  const onClose = () => {
    document.documentElement.style.overflow = "";
    trigger.current?.focus();
  };

  const chosen = sundays[day];
  const message = [
    `Hello ECM, I am planning to visit the ${props.serviceName}${chosen ? ` on ${dayLabel(chosen)}` : ""} (${props.serviceTime}).`,
    children ? "I will be bringing children." : "",
  ]
    .filter(Boolean)
    .join(" ");
  const whatsappHref = `https://wa.me/${props.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && close()} // a click on the dark backdrop closes it
      aria-labelledby="visit-title"
      className="visit-dialog fixed inset-x-0 bottom-0 top-auto m-0 max-h-[92svh] w-full max-w-none flex-col overflow-hidden rounded-t-3xl bg-white p-0 text-gray-900 shadow-2xl backdrop:bg-ecm-navy/70 backdrop:backdrop-blur-sm open:flex sm:inset-0 sm:m-auto sm:max-h-[88vh] sm:max-w-lg sm:rounded-3xl"
    >
      <header className="flex items-start justify-between gap-4 bg-ecm-green px-6 pb-5 pt-6 text-white">
        <div>
          <h2 id="visit-title" className="font-display text-3xl uppercase leading-tight">{props.title}</h2>
          <p className="mt-1 text-sm text-white/90">{props.intro}</p>
        </div>
        <button type="button" onClick={close} className="-mr-2 -mt-1 shrink-0 rounded-full p-2 text-white hover:bg-white/15" aria-label="Close">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">
        <fieldset>
          <legend className="text-sm font-bold uppercase tracking-wider text-ecm-navy">1. Which Sunday are you coming?</legend>
          <p className="mt-1 text-sm text-gray-600">{props.serviceName}, {props.serviceTime}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {sundays.map((d, i) => (
              <label
                key={d.toISOString()}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ecm-green/40 ${day === i ? "border-ecm-green bg-ecm-green/5 text-ecm-green" : "border-gray-200 text-gray-800 hover:border-gray-300"}`}
              >
                <input type="radio" name="visit-day" checked={day === i} onChange={() => setDay(i)} className="h-4 w-4 accent-ecm-green" />
                {i === 0 && d.getDay() === new Date().getDay() ? `Today, ${d.toLocaleDateString("en-GB", { day: "numeric", month: "long" })}` : dayLabel(d)}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6">
          <p className="text-sm font-bold uppercase tracking-wider text-ecm-navy">2. Children</p>
          <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-xl border-2 border-gray-200 px-4 py-3 has-[:checked]:border-ecm-green has-[:checked]:bg-ecm-green/5">
            <input type="checkbox" checked={children} onChange={(e) => setChildren(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-ecm-green" />
            <span>
              <span className="block text-sm font-semibold text-gray-900">Are you bringing children?</span>
              <span className="block text-sm text-gray-600">{props.childrenNote}</span>
            </span>
          </label>
        </div>

        <div className="mt-6">
          <p className="text-sm font-bold uppercase tracking-wider text-ecm-navy">Good to know</p>
          <div className="mt-3 divide-y divide-gray-200 rounded-xl border border-gray-200">
            {props.faqs.map((f) => (
              <details key={f.question} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 [&::-webkit-details-marker]:hidden">
                  {f.question}
                  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-ecm-green transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                </summary>
                <p className="px-4 pb-4 text-sm leading-relaxed text-gray-700">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      <footer className="grid gap-3 border-t border-gray-200 bg-white px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:grid-cols-2">
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a7f45] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#156a39]">
          <WhatsAppIcon className="h-5 w-5" />WhatsApp us
        </a>
        <a href={props.directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ecm-green px-6 py-3 text-sm font-bold uppercase tracking-wide text-ecm-green transition-colors hover:bg-ecm-green hover:text-white">
          <PinIcon className="h-5 w-5" />Get directions
        </a>
        <p className="text-center text-xs text-gray-500 sm:col-span-2">WhatsApp opens with your visit details ready to send to our welcome team.</p>
      </footer>
    </dialog>
  );
}
