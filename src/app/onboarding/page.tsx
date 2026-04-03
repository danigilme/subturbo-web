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
          className={`rounded-full transition-all duration-300 ${
            i === current ? 'w-[6px] h-[6px] bg-accent' : 'w-[5px] h-[5px] bg-text-tertiary/30'
          }`}
        />
      ))}
    </div>
  );
}

function OnboardingPage1({ isNoisy, setIsNoisy }: { isNoisy: boolean; setIsNoisy: (v: boolean) => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-10">
      <div className="w-full max-w-[280px] mb-12">
        <div className="bg-surface/60 rounded-[20px] p-8 relative overflow-hidden">
          <Waveform noisy={isNoisy} animated={true} barCount={35} />
        </div>
      </div>

      {/* Toggle Pill — refined, thin */}
      <div className="bg-surface/60 rounded-full p-[2px] flex mb-12 border border-divider/50">
        <button
          onClick={() => setIsNoisy(true)}
          className={`px-5 py-1.5 rounded-full text-[13px] transition-all duration-300 ${
            isNoisy ? 'bg-surface-high text-text-primary' : 'text-text-tertiary'
          }`}
        >
          Noisy
        </button>
        <button
          onClick={() => setIsNoisy(false)}
          className={`px-5 py-1.5 rounded-full text-[13px] transition-all duration-300 ${
            !isNoisy ? 'bg-accent text-white' : 'text-text-tertiary'
          }`}
        >
          Clean
        </button>
      </div>

      <h2 className="text-[32px] font-light text-text-primary text-center mb-3 tracking-tight">
        Hear the Difference
      </h2>
      <p className="text-[16px] text-text-secondary text-center leading-relaxed">
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
    <div className="flex flex-col items-center justify-center flex-1 px-10">
      {/* Video placeholder */}
      <div className="w-[180px] h-[320px] bg-surface/60 rounded-[20px] mb-12 relative overflow-hidden flex items-end justify-center pb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface/80" />
        <span
          className={`relative z-10 text-[16px] font-medium text-white text-center px-3 py-1 transition-all duration-300 ${
            fading ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
          }`}
          style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
        >
          {subtitleTexts[textIndex]}
        </span>
      </div>

      <h2 className="text-[32px] font-light text-text-primary text-center mb-3 tracking-tight">
        Styled Subtitles
      </h2>
      <p className="text-[16px] text-text-secondary text-center leading-relaxed">
        Perfect subtitles in any language. Word-by-word timing. Zero editing.
      </p>
    </div>
  );
}

function OnboardingPage3({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-10">
      {/* Icon */}
      <div className="w-[100px] h-[100px] rounded-[24px] bg-accent/8 flex items-center justify-center mb-12">
        <div className="relative">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="18" stroke="var(--accent)" strokeWidth="1.5" opacity="0.6"/>
            <polygon points="18,14 32,22 18,30" fill="var(--accent)" opacity="0.8"/>
          </svg>
          {/* Subtitle lines */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex flex-col gap-0.5 items-center">
            <div className="w-[32px] h-[2px] rounded-full bg-accent/50" />
            <div className="w-[22px] h-[2px] rounded-full bg-accent/30" />
          </div>
        </div>
      </div>

      <h2 className="text-[32px] font-light text-text-primary text-center mb-3 tracking-tight">
        Your First Video is Free
      </h2>
      <p className="text-[16px] text-text-secondary text-center leading-relaxed mb-2">
        Full quality. No watermark. See why creators love SubTurbo.
      </p>

      <div className="w-full mt-10">
        <button
          onClick={onGetStarted}
          className="w-full max-w-[280px] mx-auto block h-[48px] bg-accent rounded-full text-white text-[16px] font-medium active:scale-[0.97] transition-all duration-300"
        >
          Get Started
        </button>
        <p className="text-[12px] text-text-tertiary text-center mt-3">
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
        <div className="flex justify-end px-6 pt-4">
          <button
            onClick={handleGetStarted}
            className="text-[13px] text-text-tertiary min-h-[44px] min-w-[44px] flex items-center justify-center"
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
      <div className="px-10 pb-6">
        <PageDots current={currentPage} total={3} />
        {currentPage < 2 && (
          <button
            onClick={nextPage}
            className="w-full mt-8 text-[15px] text-text-secondary text-center min-h-[44px] active:text-text-primary transition-colors duration-300"
          >
            Next
          </button>
        )}
        {currentPage === 2 && <div className="h-[44px] mt-8" />}
      </div>
    </div>
  );
}
