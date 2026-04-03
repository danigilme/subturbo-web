'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const mockExports = [
  { id: 1, duration: '0:32', color: '#1E1540' },
  { id: 2, duration: '1:05', color: '#152840' },
  { id: 3, duration: '0:47', color: '#402A15' },
  { id: 4, duration: '2:12', color: '#154025' },
];

export default function HomePage() {
  const router = useRouter();
  const [freeRemaining, setFreeRemaining] = useState(1);

  useEffect(() => {
    const used = localStorage.getItem('subturbo_free_used');
    if (used) setFreeRemaining(0);
  }, []);

  const handleChooseVideo = () => {
    if (freeRemaining <= 0) {
      router.push('/paywall');
    } else {
      router.push('/processing');
    }
  };

  const handleRecordVideo = () => {
    if (freeRemaining <= 0) {
      router.push('/paywall');
    } else {
      router.push('/processing');
    }
  };

  return (
    <div className="w-full min-h-dvh bg-bg flex flex-col safe-top safe-bottom">
      {/* Top Nav */}
      <div className="flex items-center justify-between px-6 h-[56px]">
        <button
          onClick={() => router.push('/settings')}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-tertiary"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M19.14 15C19.35 14.32 19.92 13.8 20.63 13.68L21 13.62C21 13.62 21 12.38 21 12.38L20.63 12.32C19.92 12.2 19.35 11.68 19.14 11L18.86 10.22C18.65 9.54 18.77 8.8 19.21 8.24L19.46 7.93C19.46 7.93 18.62 6.62 18.07 6.54L17.73 6.74C17.12 7.09 16.37 7.09 15.76 6.74L15.07 6.34C14.46 5.99 14.05 5.35 14.02 4.64L14 4.27C14 4.27 12.5 4 12 4C11.5 4 10 4.27 10 4.27L9.98 4.64C9.95 5.35 9.54 5.99 8.93 6.34L8.24 6.74C7.63 7.09 6.88 7.09 6.27 6.74L5.93 6.54C5.38 6.62 4.54 7.93 4.54 7.93L4.79 8.24C5.23 8.8 5.35 9.54 5.14 10.22L4.86 11C4.65 11.68 4.08 12.2 3.37 12.32L3 12.38V13.62L3.37 13.68C4.08 13.8 4.65 14.32 4.86 15L5.14 15.78C5.35 16.46 5.23 17.2 4.79 17.76L4.54 18.07C4.54 18.07 5.38 19.38 5.93 19.46L6.27 19.26C6.88 18.91 7.63 18.91 8.24 19.26L8.93 19.66C9.54 20.01 9.95 20.65 9.98 21.36L10 21.73C10 21.73 11.5 22 12 22C12.5 22 14 21.73 14 21.73L14.02 21.36C14.05 20.65 14.46 20.01 15.07 19.66L15.76 19.26C16.37 18.91 17.12 18.91 17.73 19.26L18.07 19.46C18.62 19.38 19.46 18.07 19.46 18.07L19.21 17.76C18.77 17.2 18.65 16.46 18.86 15.78L19.14 15Z" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
        </button>
        <span className="text-[18px] font-light text-text-primary tracking-[0.06em]">
          Sub<span className="text-accent">Turbo</span>
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 pt-10">
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Minimal import area — no box, just icon + text */}
          <button
            onClick={handleChooseVideo}
            className="flex flex-col items-center justify-center gap-4 mb-12 active:opacity-70 transition-opacity duration-300"
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M24 12V36M12 24H36" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-[15px] text-text-tertiary">Add your video</span>
          </button>

          <div className="w-full flex flex-col items-center gap-4 mb-8">
            <button
              onClick={handleChooseVideo}
              className="max-w-[260px] w-full h-[48px] bg-accent rounded-full text-white text-[15px] font-medium active:scale-[0.97] transition-all duration-300"
            >
              Choose from Library
            </button>
            <button
              onClick={handleRecordVideo}
              className="text-[15px] text-text-secondary active:text-text-primary transition-colors duration-300 min-h-[44px]"
            >
              Record Video
            </button>
          </div>

          <span className={`text-[12px] ${freeRemaining > 0 ? 'text-text-tertiary' : 'text-text-tertiary/60'}`}>
            {freeRemaining > 0 ? `${freeRemaining} free video remaining` : 'No free videos left'}
          </span>
        </div>
      </div>

      {/* Recent Exports */}
      <div className="px-6 pb-6">
        <h3 className="text-[11px] uppercase tracking-[0.08em] text-text-tertiary mb-3">Recent Exports</h3>
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
          {mockExports.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-[88px] h-[156px] rounded-[14px] relative overflow-hidden"
              style={{ backgroundColor: item.color }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-white/70">
                {item.duration}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
