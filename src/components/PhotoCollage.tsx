import Image from "next/image";

type Photo = { src: string; alt: string; label?: string };

// Grid layout lives in globals.css (.photo-collage): one column on phones, two on tablets,
// and a collage with the first photo large on desktop.
export default function PhotoCollage({ photos }: { photos: Photo[] }) {
  return (
    <ul className="photo-collage">
      {photos.map((p, i) => (
        <li key={p.src} className="group relative overflow-hidden rounded-2xl bg-ecm-cream shadow-md">
          <Image
            src={p.src}
            alt={p.alt}
            fill
            priority={i < 2}
            sizes={i === 0 || (i === photos.length - 1 && i % 2 === 1) ? "(min-width: 1024px) 400px, 100vw" : "(min-width: 1024px) 200px, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
          />
          {p.label && (
            <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ecm-green shadow-sm">
              {p.label}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
