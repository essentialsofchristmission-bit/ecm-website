"use client";

import { useState } from "react";
import { PlayIcon } from "./Icons";
import { videoEmbedUrl } from "./YouTubeEmbed";

/**
 * A YouTube video that only loads the player when Play is pressed, so the page opens fast.
 * Until then it is the video's thumbnail with a play button.
 */
export default function LiteYouTube({ id, title, thumbnail }: { id: string; title: string; thumbnail: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-xl">
      {playing ? (
        <iframe
          src={`${videoEmbedUrl(id)}?autoplay=1&rel=0`}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 h-full w-full" aria-label={`Play video: ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumbnail} alt="" fetchPriority="high" className="h-full w-full object-cover" />
          <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/35" aria-hidden="true" />
          <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-ecm-red-dark text-white shadow-2xl ring-4 ring-white/80 transition-transform duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100">
              <PlayIcon className="ml-1 h-9 w-9" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
