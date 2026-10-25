import { site } from "@/lib/content";
import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon } from "./Icons";

const links = [
  { href: site.social.youtube, label: "YouTube", Icon: YouTubeIcon },
  { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: site.social.tiktok, label: "TikTok", Icon: TikTokIcon },
];

export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex gap-3 ${className}`}>
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`ECM on ${label}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-ecm-red-dark"
          >
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  );
}
