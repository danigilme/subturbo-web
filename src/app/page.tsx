'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const mockExports = [
  { id: 1, duration: '0:32', color: '#2D1B69' },
  { id: 2, duration: '1:05', color: '#1B3D69' },
  { id: 3, duration: '0:47', color: '#69441B' },
  { id: 4, duration: '2:12', color: '#1B6935' },
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
      <div className="flex items-center justify-between px-4 h-[56px]">
        <button
          onClick={() => router.push('/settings')}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M19.14 15C19.35 14.32 19.92 13.8 20.63 13.68L21 13.62C21 13.62 21 12.38 21 12.38L20.63 12.32C19.92 12.2 19.35 11.68 19.14 11L18.86 10.22C18.65 9.54 18.77 8.8 19.21 8.24L19.46 7.93C19.46 7.93 18.62 6.62 18.07 6.54L17.73 6.74C17.12 7.09 16.37 7.09 15.76 6.74L15.07 6.34C14.46 5.99 14.05 5.35 14.02 4.64L14 4.27C14 4.27 12.5 4 12 4C11.5 4 10 4.27 10 4.27L9.98 4.64C9.95 5.35 9.54 5.99 8.93 6.34L8.24 6.74C7.63 7.09 6.88 7.09 6.27 6.74L5.93 6.54C5.38 6.62 4.54 7.93 4.54 7.93L4.79 8.24C5.23 8.8 5.35 9.54 5.14 10.22L4.86 11C4.65 11.68 4.08 12.2 3.37 12.32L3 12.38V13.62L3.37 13.68C4.08 13.8 4.65 14.32 4.86 15L5.14 15.78C5.35 16.46 5.23 17.2 4.79 17.76L4.54 18.07C4.54 18.07 5.38 19.38 5.93 19.46L6.27 19.26C6.88 18.91 7.63 18.91 8.24 19.26L8.93 19.66C9.54 20.01 9.95 20.65 9.98 21.36L10 21.73C10 21.73 11.5 22 12 22C12.5 22 14 21.73 14 21.73L14.02 21.36C14.05 20.65 14.46 20.01 15.07 19.66L15.76 19.26C16.37 18.91 17.12 18.91 17.73 19.26L18.07 19.46C18.62 19.38 19.46 18.07 19.46 18.07L19.21 17.76C18.77 17.2 18.65 16.46 18.86 15.78L19.14 15Z" stroke="currentColor" strokeWidth="1.8"/>
          </svg>
        </button>
        <span className="text-[22px] font-bold text-text-primary tracking-tight">
          Sub<span className="text-accent">Turbo</span>
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 pt-8">
        <div className="flex-1 flex flex-col items-center justify-center">
          <button
            onClick={handleChooseVideo}
            className="w-full max-w-[280px] h-[200px] rounded-[20px] border-2 border-dashed border-text-tertiary flex flex-col items-center justify-center gap-4 mb-8 active:border-accent active:bg-accent/5 transition-all"
          >
            <div className="w-[64px] h-[64px] rounded-full bg-surface flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 6V22M6 14H22" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[17px] text-text-secondary">Add your video</span>
          </button>

          <div className="w-full space-y-3 mb-6">
            <button
              onClick={handleChooseVideo}
              className="w-full h-[52px] bg-accent rounded-[14px] text-white text-[17px] font-semibold active:scale-[0.98] transition-transform"
            >
              Choose from Library
            </button>
            <button
              onClick={handleRecordVideo}
              className="w-full h-[52px] bg-transparent border-2 border-surface-high rounded-[14px] text-text-primary text-[17px] font-semibold active:scale-[0.98] transition-transform"
            >
              Record Video
            </button>
          </div>

          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${freeRemaining > 0 ? 'bg-accent/10' : 'bg-surface'}`}>
            <div className={`w-[8px] h-[8px] rounded-full ${freeRemaining > 0 ? 'bg-accent' : 'bg-text-tertiary'}`} />
            <span className={`text-[13px] font-medium ${freeRemaining > 0 ? 'text-accent' : 'text-text-secondary'}`}>
              {freeRemaining > 0 ? `${freeRemaining} free video remaining` : 'No free videos left'}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Exports */}
      <div className="px-6 pb-6">
        <h3 className="text-[15px] font-semibold text-text-secondary mb-3">Recent Exports</h3>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {mockExports.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-[100px] h-[178px] rounded-[12px] relative overflow-hidden"
              style={{ backgroundColor: item.color }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/50 text-[11px] text-white font-medium">
                {item.duration}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
