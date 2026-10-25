export default function YouTubeEmbed({ src, title }: { src: string; title: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-xl">
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

export const videoEmbedUrl = (id: string) => `https://www.youtube-nocookie.com/embed/${id}`;
export const liveEmbedUrl = (channelId: string, videoId?: string) =>
  videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : `https://www.youtube.com/embed/live_stream?channel=${channelId}`;
