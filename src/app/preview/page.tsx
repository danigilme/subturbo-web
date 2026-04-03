'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { useAppStore } from '@/store/useAppStore';

export default function PreviewPage() {
  const router = useRouter();
  const { subtitles, styleSettings } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeChunkIndex, setActiveChunkIndex] = useState(0);
  const totalDuration = 22; // seconds
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunkListRef = useRef<HTMLDivElement>(null);

  const fonts: Record<string, { css: string; weight: number }> = {
    'Montserrat Bold': { css: 'Montserrat, Arial, sans-serif', weight: 700 },
    'Impact': { css: 'Impact, sans-serif', weight: 400 },
    'Helvetica Light': { css: '"Helvetica Neue", Helvetica, sans-serif', weight: 300 },
    'SF Pro Medium': { css: '-apple-system, "SF Pro Display", sans-serif', weight: 500 },
    'Bangers': { css: 'Bangers, Impact, cursive', weight: 400 },
    'Literata Bold': { css: 'Literata, Georgia, serif', weight: 700 },
  };

  const currentFont = fonts[styleSettings.font] || fonts['Montserrat Bold'];

  // Time boundaries per chunk
  const chunkTimes = subtitles.map((_, i) => {
    const dur = totalDuration / subtitles.length;
    return { start: i * dur, end: (i + 1) * dur };
  });

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 0.1;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    const idx = chunkTimes.findIndex(t => currentTime >= t.start && currentTime < t.end);
    if (idx !== -1) setActiveChunkIndex(idx);
  }, [currentTime]);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  const getSubtitleStyle = (): React.CSSProperties => ({
    fontFamily: currentFont.css,
    fontWeight: currentFont.weight,
    fontSize: `${styleSettings.fontSize * 0.55}px`,
    color: styleSettings.textColor,
    textAlign: styleSettings.alignment,
    textShadow: styleSettings.shadow ? `0 2px 4px rgba(0,0,0,0.5)` : 'none',
    WebkitTextStroke: styleSettings.outlineWidth > 0 ? `${styleSettings.outlineWidth * 0.5}px ${styleSettings.outlineColor}` : 'none',
    backgroundColor: styleSettings.backgroundBox ? `rgba(0,0,0,${styleSettings.backgroundOpacity / 100})` : 'transparent',
    padding: styleSettings.backgroundBox ? '4px 10px' : '0',
    borderRadius: styleSettings.backgroundBox ? '6px' : '0',
  });

  return (
    <div className="w-full min-h-dvh bg-bg flex flex-col">
      <NavBar
        title="Preview"
        rightAction={
          <button
            onClick={() => router.push('/export')}
            className="text-[17px] text-accent font-semibold min-h-[44px] flex items-center"
          >
            Export
          </button>
        }
      />

      {/* Video preview */}
      <div className="w-full bg-surface relative" style={{ aspectRatio: '9/12' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460]" />
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-full h-px bg-white" style={{ marginTop: `${(i + 1) * 10}%` }} />
          ))}
        </div>

        {/* Subtitle */}
        <div
          className="absolute z-10 w-full px-4 transition-all duration-200"
          style={{ bottom: `${100 - styleSettings.position}%` }}
        >
          <p style={getSubtitleStyle()} className="text-center leading-snug">
            {subtitles[activeChunkIndex]?.text || ''}
          </p>
        </div>

        {/* Play button overlay when paused */}
        {!isPlaying && (
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 z-20 flex items-center justify-center"
          >
            <div className="w-[64px] h-[64px] rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M8 4L24 14L8 24V4Z" fill="white"/>
              </svg>
            </div>
          </button>
        )}
      </div>

      {/* Playback controls */}
      <div className="px-4 py-3 border-b border-divider">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="2" width="5" height="16" rx="1" fill="white"/>
                <rect x="12" y="2" width="5" height="16" rx="1" fill="white"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 2L18 10L4 18V2Z" fill="white"/>
              </svg>
            )}
          </button>

          <div className="flex-1 relative h-[44px] flex items-center">
            <div className="absolute w-full h-[4px] rounded-full bg-surface-high">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${(currentTime / totalDuration) * 100}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={totalDuration}
              step={0.1}
              value={currentTime}
              onChange={handleScrub}
              className="absolute w-full h-[44px] opacity-0 cursor-pointer z-10"
            />
          </div>

          <span className="text-[13px] text-text-secondary font-mono whitespace-nowrap">
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </span>
        </div>
      </div>

      {/* Chunk list */}
      <div ref={chunkListRef} className="flex-1 overflow-y-auto no-scrollbar safe-bottom">
        {subtitles.map((chunk, i) => (
          <button
            key={chunk.id}
            onClick={() => {
              setCurrentTime(chunkTimes[i].start);
              setActiveChunkIndex(i);
            }}
            className={`w-full text-left px-4 py-3 border-l-[3px] transition-all ${
              i === activeChunkIndex
                ? 'border-l-accent bg-accent/5'
                : 'border-l-transparent'
            } ${i < subtitles.length - 1 ? 'border-b border-divider' : ''}`}
          >
            <span className="text-[12px] text-text-tertiary font-mono">{chunk.startTime} - {chunk.endTime}</span>
            <p className={`text-[15px] mt-1 ${i === activeChunkIndex ? 'text-text-primary' : 'text-text-secondary'}`}>
              {chunk.text}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
