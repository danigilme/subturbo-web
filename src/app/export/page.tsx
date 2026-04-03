'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type ExportPhase = 'rendering' | 'success';

const renderLabels = [
  { pct: 0, label: 'Preparing...' },
  { pct: 5, label: 'Burning in subtitles...' },
  { pct: 90, label: 'Replacing audio...' },
  { pct: 95, label: 'Saving to camera roll...' },
];

export default function ExportPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<ExportPhase>('rendering');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase !== 'rendering') return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 1.25;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase('success'), 400);
          return 100;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [phase]);

  const currentLabel = [...renderLabels].reverse().find(l => progress >= l.pct)?.label || 'Preparing...';

  if (phase === 'success') {
    return (
      <div className="w-full min-h-dvh bg-bg flex flex-col items-center justify-center safe-top safe-bottom px-8 animate-fade-in">
        {/* Animated checkmark — accent color, thin stroke */}
        <div className="mb-10">
          <svg width="80" height="80" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              className="checkmark-circle"
              opacity="0.5"
            />
            <path
              d="M30 50 L44 64 L70 38"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="checkmark-check"
            />
          </svg>
        </div>

        <h1 className="text-[24px] font-medium text-text-primary mb-2">Video saved</h1>
        <p className="text-[15px] text-text-secondary mb-14">Saved to your camera roll</p>

        <div className="w-full flex flex-col items-center gap-4">
          <button
            onClick={() => {
              // Simulate share
            }}
            className="max-w-[260px] w-full h-[48px] bg-accent rounded-full text-white text-[15px] font-medium active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M3 10V17H17V10M10 2V13M10 2L6 6M10 2L14 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Share Video
          </button>
          <button
            onClick={() => router.push('/')}
            className="text-[15px] text-text-secondary active:text-text-primary transition-colors duration-300 min-h-[44px]"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-dvh bg-bg flex flex-col items-center justify-center safe-top safe-bottom px-8">
      {/* Video thumbnail */}
      <div className="w-[120px] h-[213px] bg-surface/60 rounded-[16px] mb-10 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-high/30 to-surface/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" opacity="0.3">
            <path d="M3 2L14 8L3 14V2Z" fill="var(--text-tertiary)"/>
          </svg>
        </div>
      </div>

      <h2 className="text-[20px] font-medium text-text-primary mb-2">Creating your video...</h2>
      <p className="text-[13px] text-text-secondary mb-10">{currentLabel}</p>

      {/* Progress bar — thin, elegant */}
      <div className="w-full max-w-[280px] h-[3px] bg-surface-high rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-accent rounded-full transition-all duration-200 ease-out progress-pulse"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="text-[12px] text-text-tertiary/60">{Math.round(progress)}%</span>
    </div>
  );
}
