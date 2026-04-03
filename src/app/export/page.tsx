'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type ExportPhase = 'rendering' | 'success';

const renderLabels = [
  { pct: 0, label: 'Preparing...' },
  { pct: 25, label: 'Burning in subtitles' },
  { pct: 65, label: 'Replacing audio' },
  { pct: 90, label: 'Saving' },
];

export default function ExportPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<ExportPhase>('rendering');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase !== 'rendering') return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase('success'), 300);
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
      <div className="w-full min-h-dvh bg-bg flex flex-col items-center justify-center safe-top safe-bottom px-6 animate-fade-in">
        {/* Animated checkmark */}
        <div className="mb-8">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="var(--success)"
              strokeWidth="4"
              className="checkmark-circle"
            />
            <path
              d="M30 50 L44 64 L70 38"
              fill="none"
              stroke="var(--success)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="checkmark-check"
            />
          </svg>
        </div>

        <h1 className="text-[28px] font-bold text-text-primary mb-2">Video saved!</h1>
        <p className="text-[17px] text-text-secondary mb-12">Your subtitled video is ready</p>

        <div className="w-full space-y-3">
          <button
            onClick={() => {
              // Simulate share
            }}
            className="w-full h-[52px] bg-accent rounded-[14px] text-white text-[17px] font-semibold active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 10V17H17V10M10 2V13M10 2L6 6M10 2L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Share Video
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full h-[52px] bg-transparent border-2 border-surface-high rounded-[14px] text-text-primary text-[17px] font-semibold active:scale-[0.98] transition-transform"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-dvh bg-bg flex flex-col items-center justify-center safe-top safe-bottom px-6">
      {/* Video thumbnail */}
      <div className="w-[140px] h-[249px] bg-surface rounded-[16px] mb-8 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-high/50 to-surface" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[40px] h-[40px] rounded-full bg-surface-high/80 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 2L14 8L3 14V2Z" fill="var(--text-tertiary)"/>
            </svg>
          </div>
        </div>
      </div>

      <h2 className="text-[22px] font-bold text-text-primary mb-2">Rendering your video...</h2>
      <p className="text-[15px] text-text-secondary mb-8">{currentLabel}</p>

      {/* Progress bar */}
      <div className="w-full h-[6px] bg-surface-high rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-accent rounded-full transition-all duration-100 progress-pulse"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="text-[13px] text-text-tertiary">{Math.round(progress)}%</span>
    </div>
  );
}
