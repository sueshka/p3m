import { useEffect, useRef } from 'react';

interface OverlayPreviewProps {
  src: string;
  /** Poster frame, shown until the video has decoded its first frame. */
  poster: string;
}

/**
 * Looping, muted preview of one overlay.
 *
 * Only clips actually on screen play: twelve simultaneous decoders would
 * heat an older phone and stutter the scroll, however small the files are.
 * An IntersectionObserver starts a clip when it scrolls in and pauses it on
 * the way out, so at most a screenful is ever decoding.
 *
 * `preload="none"` keeps the 5 MB of video off the initial load — the
 * poster carries the grid until something is actually looked at.
 *
 * Note: these files must NOT be served with `Content-Disposition:
 * attachment` (see vercel.json) — that header tells the browser to save
 * rather than decode, which would stop playback here. Telegram's
 * downloadFile supplies its own filename, so the header is not needed.
 */
export function OverlayPreview({ src, poster }: OverlayPreviewProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Without IntersectionObserver, fall back to a still poster rather than
    // playing everything at once.
    if (typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // play() rejects if the element is detached mid-scroll; ignore.
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      // iOS only honours inline autoplay when the video is muted; both
      // attributes are required together.
      autoPlay={false}
      aria-hidden
      style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
    />
  );
}
