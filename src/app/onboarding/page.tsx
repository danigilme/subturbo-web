'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Waveform from '@/components/Waveform';

const subtitleTexts = ['Perfect subtitles', 'Subtitulos perfectos', '完璧な字幕', 'Sous-titres parfaits'];

function PageDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-[8px] rounded-full transition-all duration-300 ${
            i === current ? 'w-[24px] bg-accent' : 'w-[8px] bg-surface-high'
          }`}
        />
      ))}
    </div>
  );
}

function OnboardingPage1({ isNoisy, setIsNoisy }: { isNoisy: boolean; setIsNoisy: (v: boolean) => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8">
      <div className="w-full max-w-[300px] mb-8">
        <div className="bg-surface rounded-[16px] p-6 relative overflow-hidden">
          <Waveform noisy={isNoisy} animated={true} barCount={35} />
        </div>
      </div>

      {/* Toggle Pill */}
      <div className="bg-surface rounded-full p-[3px] flex mb-8">
        <button
          onClick={() => setIsNoisy(true)}
          className={`px-5 py-2 rounded-full text-[15px] font-medium transition-all duration-300 ${
            isNoisy ? 'bg-surface-high text-text-primary' : 'text-text-tertiary'
          }`}
        >
          Noisy
        </button>
        <button
          onClick={() => setIsNoisy(false)}
          className={`px-5 py-2 rounded-full text-[15px] font-medium transition-all duration-300 ${
            !isNoisy ? 'bg-accent text-white' : 'text-text-tertiary'
          }`}
        >
          Clean
        </button>
      </div>

      <h2 className="text-[28px] font-bold text-text-primary text-center mb-3">
        Hear the Difference
      </h2>
      <p className="text-[17px] text-text-secondary text-center leading-relaxed">
        AI-powered noise removal makes every word crystal clear
      </p>
    </div>
  );
}

function OnboardingPage2() {
  const [textIndex, setTextIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % subtitleTexts.length);
        setFading(false);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8">
      {/* Video placeholder */}
      <div className="w-[200px] h-[356px] bg-surface rounded-[16px] mb-8 relative overflow-hidden flex items-end justify-center pb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-high/30 to-surface" />
        {/* Grid lines to simulate video */}
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-full h-px bg-text-secondary" style={{ marginTop: `${(i + 1) * 12.5}%` }} />
          ))}
        </div>
        <span
          className={`relative z-10 text-[18px] font-bold text-white text-center px-3 py-1 rounded-lg transition-all duration-300 ${
            fading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
        >
          {subtitleTexts[textIndex]}
        </span>
      </div>

      <h2 className="text-[28px] font-bold text-text-primary text-center mb-3">
        Styled Subtitles
      </h2>
      <p className="text-[17px] text-text-secondary text-center leading-relaxed">
        Perfect subtitles in any language. Word-by-word timing. Zero editing.
      </p>
    </div>
  );
}

function OnboardingPage3({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8">
      {/* Icon */}
      <div className="w-[120px] h-[120px] rounded-[28px] bg-accent/10 flex items-center justify-center mb-8">
        <div className="relative">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="24" stroke="var(--accent)" strokeWidth="3"/>
            <polygon points="23,18 40,28 23,38" fill="var(--accent)"/>
          </svg>
          {/* Subtitle lines */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
            <div className="w-[40px] h-[3px] rounded-full bg-accent" />
            <div className="w-[28px] h-[3px] rounded-full bg-accent/60" />
          </div>
        </div>
      </div>

      <h2 className="text-[28px] font-bold text-text-primary text-center mb-3">
        Your First Video is Free
      </h2>
      <p className="text-[17px] text-text-secondary text-center leading-relaxed mb-2">
        Full quality. No watermark. See why creators love SubTurbo.
      </p>

      <div className="w-full mt-8">
        <button
          onClick={onGetStarted}
          className="w-full h-[52px] bg-accent rounded-[14px] text-white text-[17px] font-semibold active:scale-[0.98] transition-transform"
        >
          Get Started
        </button>
        <p className="text-[13px] text-text-tertiary text-center mt-3">
          No account needed
        </p>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [isNoisy, setIsNoisy] = useState(true);
  const [touchStart, setTouchStart] = useState(0);

  const nextPage = useCallback(() => {
    if (currentPage < 2) setCurrentPage(currentPage + 1);
  }, [currentPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  }, [currentPage]);

  const handleGetStarted = () => {
    localStorage.setItem('subturbo_onboarded', 'true');
    router.replace('/');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextPage();
      else prevPage();
    }
  };

  return (
    <div
      className="w-full min-h-dvh bg-bg flex flex-col safe-top safe-bottom"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Skip button */}
      {currentPage < 2 && (
        <div className="flex justify-end p-4">
          <button
            onClick={handleGetStarted}
            className="text-[15px] text-text-tertiary min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            Skip
          </button>
        </div>
      )}
      {currentPage === 2 && <div className="h-[60px]" />}

      {/* Page content */}
      <div className="flex-1 flex flex-col animate-fade-in" key={currentPage}>
        {currentPage === 0 && <OnboardingPage1 isNoisy={isNoisy} setIsNoisy={setIsNoisy} />}
        {currentPage === 1 && <OnboardingPage2 />}
        {currentPage === 2 && <OnboardingPage3 onGetStarted={handleGetStarted} />}
      </div>

      {/* Bottom section */}
      <div className="px-8 pb-4">
        <PageDots current={currentPage} total={3} />
        {currentPage < 2 && (
          <button
            onClick={nextPage}
            className="w-full h-[52px] bg-surface-high rounded-[14px] text-white text-[17px] font-semibold mt-6 active:scale-[0.98] transition-transform"
          >
            Next
          </button>
        )}
        {currentPage === 2 && <div className="h-[52px] mt-6" />}
      </div>
    </div>
  );
}
