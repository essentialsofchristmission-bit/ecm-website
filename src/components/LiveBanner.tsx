import Link from "next/link";
import { site } from "@/lib/content";

export default function LiveBanner() {
  if (!site.live.isLive) return null;
  return (
    <Link href="/live" className="block bg-ecm-red-dark text-white transition hover:bg-ecm-red">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 py-3 text-center">
        <span className="live-dot h-3 w-3 rounded-full bg-white" aria-hidden="true" />
        <span className="font-display text-xl uppercase tracking-wider">We are live</span>
        <span className="text-sm font-semibold underline underline-offset-4">Join the service now</span>
      </div>
    </Link>
  );
}
