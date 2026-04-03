'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

const features = [
  'Unlimited videos',
  'AI noise removal',
  'Word-perfect timing',
  'All styles & presets',
  'Clean audio export',
];

export default function PaywallPage() {
  const router = useRouter();
  const { selectedPlan, setSelectedPlan, setIsSubscribed } = useAppStore();
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => router.back(), 250);
  };

  const handleSubscribe = () => {
    setIsSubscribed(true);
    localStorage.removeItem('subturbo_free_used');
    router.push('/');
  };

  return (
    <div className="w-full min-h-dvh bg-bg flex flex-col">
      {/* Background gradient — subtle */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-bg to-bg pointer-events-none" />

      <div className={`relative z-10 flex flex-col min-h-dvh safe-top safe-bottom transition-transform duration-300 ${closing ? 'translate-y-full' : ''}`}>
        {/* Close button */}
        <div className="flex justify-end px-5 pt-4">
          <button
            onClick={handleClose}
            className="w-[30px] h-[30px] rounded-full bg-surface-high/60 flex items-center justify-center"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M2 2L12 12M12 2L2 12" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 px-8 flex flex-col">
          {/* Header */}
          <div className="text-center mb-10 mt-4">
            <h1 className="text-[36px] font-light text-text-primary mb-2 tracking-tight">
              Sub<span className="text-accent">Turbo</span> Pro
            </h1>
            <p className="text-[15px] text-text-secondary">
              Perfect subtitles, unlimited
            </p>
          </div>

          {/* Features — clean list */}
          <div className="mb-8">
            {features.map((feat, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none" className="flex-shrink-0">
                  <path d="M1 6L5 10L13 2" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[15px] text-text-primary">{feat}</span>
              </div>
            ))}
          </div>

          {/* Plans */}
          <div className="space-y-2.5 mb-8">
            {/* Weekly */}
            <button
              onClick={() => setSelectedPlan('weekly')}
              className={`w-full rounded-[14px] p-4 flex items-center justify-between transition-all duration-300 ${
                selectedPlan === 'weekly'
                  ? 'bg-surface border border-accent/40'
                  : 'bg-surface/60 border border-transparent'
              }`}
            >
              <div className="text-left">
                <p className="text-[15px] font-medium text-text-primary">$6.99/week</p>
                <p className="text-[12px] text-text-tertiary mt-0.5">Cancel anytime</p>
              </div>
              <div className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center ${
                selectedPlan === 'weekly' ? 'border-accent' : 'border-text-tertiary/40'
              }`}>
                {selectedPlan === 'weekly' && (
                  <div className="w-[10px] h-[10px] rounded-full bg-accent" />
                )}
              </div>
            </button>

            {/* Yearly */}
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`w-full rounded-[14px] p-4 flex items-center justify-between transition-all duration-300 relative overflow-hidden ${
                selectedPlan === 'yearly'
                  ? 'bg-surface border border-accent/40'
                  : 'bg-surface/60 border border-transparent'
              }`}
            >
              {/* Save badge */}
              <div className="absolute top-0 right-0 bg-accent/80 px-2.5 py-0.5 rounded-bl-[10px]">
                <span className="text-[10px] font-medium text-white">SAVE</span>
              </div>

              <div className="text-left">
                <p className="text-[15px] font-medium text-text-primary">$39.99/year</p>
                <p className="text-[12px] text-text-tertiary mt-0.5">
                  $0.77/week <span className="text-accent/80">-- save 89%</span>
                </p>
              </div>
              <div className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center ${
                selectedPlan === 'yearly' ? 'border-accent' : 'border-text-tertiary/40'
              }`}>
                {selectedPlan === 'yearly' && (
                  <div className="w-[10px] h-[10px] rounded-full bg-accent" />
                )}
              </div>
            </button>
          </div>

          {/* Social proof */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-0.5 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 16 16" fill="var(--accent)" opacity="0.6">
                  <path d="M8 1L10.2 5.4L15 6.2L11.5 9.6L12.4 14.4L8 12.1L3.6 14.4L4.5 9.6L1 6.2L5.8 5.4L8 1Z"/>
                </svg>
              ))}
              <span className="text-[12px] text-text-tertiary ml-1.5">4.8</span>
            </div>
            <p className="text-[11px] text-text-tertiary">
              10,000+ creators
            </p>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* CTA */}
          <div className="pb-4">
            <button
              onClick={handleSubscribe}
              className="w-full max-w-[280px] mx-auto block h-[48px] bg-accent rounded-full text-white text-[16px] font-medium active:scale-[0.97] transition-all duration-300"
            >
              Subscribe
            </button>
            <div className="flex items-center justify-center gap-3 mt-5">
              <button className="text-[11px] text-text-tertiary/60">Restore Purchases</button>
              <span className="text-text-tertiary/30 text-[11px]">&middot;</span>
              <button className="text-[11px] text-text-tertiary/60">Terms</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
