import { mapEmbedUrl } from "@/lib/content";

export default function MapEmbed({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl shadow-lg ring-1 ring-gray-100 ${className}`}>
      <iframe src={mapEmbedUrl()} title="Map showing the location of Essentials of Christ Mission" className="h-full min-h-80 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
