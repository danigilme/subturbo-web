'use client';

interface WaveformProps {
  color?: string;
  barCount?: number;
  animated?: boolean;
  noisy?: boolean;
  className?: string;
}

export default function Waveform({ color = 'var(--accent)', barCount = 40, animated = true, noisy = false, className = '' }: WaveformProps) {
  const bars = Array.from({ length: barCount }, (_, i) => {
    const baseHeight = noisy
      ? 20 + Math.random() * 60 + (Math.random() > 0.7 ? 20 : 0)
      : 15 + Math.sin(i * 0.3) * 25 + Math.cos(i * 0.5) * 15;
    return { height: Math.min(Math.max(baseHeight, 8), 80), delay: i * 0.05 };
  });

  return (
    <div className={`flex items-center justify-center gap-[1.5px] h-[48px] ${className}`}>
      {bars.map((bar, i) => (
        <div
          key={i}
          className="rounded-full flex-shrink-0"
          style={{
            width: '1.5px',
            height: `${bar.height}%`,
            backgroundColor: noisy ? 'var(--text-tertiary)' : color,
            animation: animated ? `waveform-bar ${0.8 + Math.random() * 0.8}s ease-in-out ${bar.delay}s infinite` : 'none',
            opacity: noisy ? 0.4 + Math.random() * 0.3 : 0.5 + Math.random() * 0.3,
          }}
        />
      ))}
    </div>
  );
}
