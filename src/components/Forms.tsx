"use client";

import { useState, type FormEvent, type ReactNode } from "react";

type Status = "idle" | "sending" | "sent" | "error" | "notConfigured";

function useFormspree(formId: string) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formId) {
      setStatus("notConfigured");
      return;
    }
    setStatus("sending");
    const form = e.currentTarget;
    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        form.reset();
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return { status, onSubmit };
}

const input =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-ecm-green focus:outline-none focus:ring-2 focus:ring-ecm-green/30";
const label = "mb-1 block text-sm font-semibold text-gray-800";

function StatusMessage({ status, email, success }: { status: Status; email: string; success: string }) {
  if (status === "sent") return <p role="status" className="rounded-xl bg-green-50 p-3 text-sm font-semibold text-ecm-green">{success}</p>;
  if (status === "error")
    return <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-ecm-red-dark">Sorry, something went wrong. Please try again or email us at {email}.</p>;
  if (status === "notConfigured")
    return (
      <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-800">
        This form is not connected yet. Please email us at <a className="underline" href={`mailto:${email}`}>{email}</a> for now.
      </p>
    );
  return null;
}

function Field({ id, text, children }: { id: string; text: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={label}>{text}</label>
      {children}
    </div>
  );
}

export function ContactForm({ formId, email }: { formId: string; email: string }) {
  const { status, onSubmit } = useFormspree(formId);
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" name="_subject" value="New message from the ECM website" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="c-name" text="Name"><input id="c-name" name="name" required autoComplete="name" className={input} /></Field>
        <Field id="c-phone" text="Phone"><input id="c-phone" name="phone" type="tel" autoComplete="tel" className={input} /></Field>
      </div>
      <Field id="c-email" text="Email"><input id="c-email" name="email" type="email" required autoComplete="email" className={input} /></Field>
      <Field id="c-message" text="Message"><textarea id="c-message" name="message" rows={5} required className={input} /></Field>
      <StatusMessage status={status} email={email} success="Thank you! Your message has been sent. We will get back to you soon." />
      <button type="submit" disabled={status === "sending"} className="rounded-full bg-ecm-green px-8 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-ecm-green-dark disabled:opacity-60">
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}

export function PrayerForm({ formId, email }: { formId: string; email: string }) {
  const { status, onSubmit } = useFormspree(formId);
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" name="_subject" value="New prayer request from the ECM website" />
      <Field id="p-name" text="Name (optional)"><input id="p-name" name="name" autoComplete="name" className={input} /></Field>
      <Field id="p-contact" text="Email or phone (optional)"><input id="p-contact" name="contact" className={input} /></Field>
      <Field id="p-request" text="Prayer request"><textarea id="p-request" name="request" rows={5} required className={input} /></Field>
      <label className="flex items-start gap-3 text-sm text-gray-700">
        <input type="checkbox" name="confidential" value="yes" className="mt-1 h-4 w-4 accent-ecm-green" />
        Please keep my request confidential (pastors only)
      </label>
      <StatusMessage status={status} email={email} success="Thank you. Our prayer team will be praying with you." />
      <button type="submit" disabled={status === "sending"} className="rounded-full bg-ecm-red-dark px-8 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-ecm-red disabled:opacity-60">
        {status === "sending" ? "Sending..." : "Send prayer request"}
      </button>
    </form>
  );
}

export function NewsletterForm({ formId, email }: { formId: string; email: string }) {
  const { status, onSubmit } = useFormspree(formId);
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input type="hidden" name="_subject" value="New newsletter signup" />
      <label htmlFor="n-email" className="sr-only">Email address</label>
      <div className="flex flex-col gap-2 sm:flex-row xl:flex-col">
        <input id="n-email" name="email" type="email" required placeholder="Your email address" autoComplete="email" className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/60" />
        <button type="submit" disabled={status === "sending"} className="shrink-0 rounded-full bg-ecm-red-dark px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-ecm-red disabled:opacity-60">
          Subscribe
        </button>
      </div>
      {status === "sent" && <p role="status" className="text-sm text-white">Thanks for subscribing!</p>}
      {status === "error" && <p role="alert" className="text-sm text-white">Something went wrong. Please try again.</p>}
      {status === "notConfigured" && <p role="alert" className="text-sm text-white">Signup is not connected yet. Email {email} to join our mailing list.</p>}
    </form>
  );
}
