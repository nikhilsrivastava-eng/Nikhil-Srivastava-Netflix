import React, { useEffect, useRef, useState } from 'react';
// video.js runtime and styles
// Note: Ensure `video.js` is installed: npm i video.js
// @ts-ignore - typings are optional; we treat as any to avoid adding extra deps
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  src: string; // m3u8 URL
  poster?: string | null;
  className?: string;
  autoPlay?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, className, autoPlay = false }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // If no src, dispose existing player (if any) and show poster-only
    if (!src) {
      if (playerRef.current) {
        try { playerRef.current.dispose(); } catch {}
        playerRef.current = null;
      }
      setErrorText('No video available');
      try { poster && el.setAttribute('poster', poster); } catch {}
      return;
    }

    // Defer init until element is in DOM to avoid warning
    const init = () => {
      if (!document.body.contains(el)) {
        // try again on next frame
        requestAnimationFrame(init);
        return;
      }
      if (!playerRef.current) {
        playerRef.current = videojs(el, {
          controls: true,
          autoplay: autoPlay,
          preload: 'auto',
          fluid: true,
          responsive: true,
          poster: poster || undefined,
          controlBar: {
            volumePanel: { inline: false },
            pictureInPictureToggle: true,
            remainingTimeDisplay: true,
          },
        });
      }

      const player = playerRef.current as any;
      player.src({ src, type: 'application/x-mpegURL' });
      setErrorText(null);
      player.one('error', () => {
        const err = player.error?.();
        console.error('Video.js error:', err);
        setErrorText(err?.message || 'Playback error');
      });
      player.one('loadedmetadata', () => {
        console.log('Video.js loadedmetadata');
      });
      if (autoPlay) {
        const tryPlay = () => {
          const p = player.play?.();
          if (p && typeof p.then === 'function') p.catch(() => {});
        };
        if (player.readyState() >= 1) tryPlay();
        else player.one('canplay', tryPlay);
      }
    };

    requestAnimationFrame(init);

    return () => {
      // do not dispose on src change; only on unmount
    };
  }, [src, poster, autoPlay]);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div className={className}>
      <div className="w-full aspect-[16/9] bg-black rounded-lg overflow-hidden">
        <div data-vjs-player className="w-full h-full">
          <video
            ref={videoRef}
            className="video-js vjs-big-play-centered rounded-lg overflow-hidden w-full h-full"
            controls
            playsInline
            preload="auto"
          />
        </div>
        {errorText && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-red-400 bg-black/40">
            {errorText}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
