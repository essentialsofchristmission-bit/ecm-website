import Link from "next/link";
import { PinIcon, WhatsAppIcon } from "./Icons";

// Quick shortcuts fixed to the bottom of the screen on phones (hidden from tablet width up).
export default function MobileActionBar({ directionsUrl, whatsappUrl, isLive }: { directionsUrl: string; whatsappUrl: string; isLive: boolean }) {
  const item = "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-bold uppercase tracking-wide";
  return (
    <nav aria-label="Quick actions" className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
      <div className="flex h-16 items-stretch">
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className={`${item} text-ecm-green active:bg-gray-100`}>
          <PinIcon className="h-6 w-6" />Directions
        </a>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={`${item} border-x border-gray-200 text-[#1a7f45] active:bg-gray-100`}>
          <WhatsAppIcon className="h-6 w-6" />WhatsApp
        </a>
        <Link href="/live" className={`${item} bg-ecm-red-dark text-white active:bg-ecm-red`}>
          <span className="flex h-6 items-center"><span className={`h-3 w-3 rounded-full bg-white ${isLive ? "live-dot" : ""}`} aria-hidden="true" /></span>
          Watch Live
        </Link>
      </div>
    </nav>
  );
}
