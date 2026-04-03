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
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-bg to-bg pointer-events-none" />

      <div className={`relative z-10 flex flex-col min-h-dvh safe-top safe-bottom transition-transform duration-250 ${closing ? 'translate-y-full' : ''}`}>
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            onClick={handleClose}
            className="w-[32px] h-[32px] rounded-full bg-surface-high flex items-center justify-center"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2L12 12M12 2L2 12" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 px-6 flex flex-col">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 mb-4">
              <span className="text-[13px] font-semibold text-accent">PRO</span>
            </div>
            <h1 className="text-[34px] font-bold text-text-primary mb-2">
              Sub<span className="text-accent">Turbo</span> Pro
            </h1>
            <p className="text-[17px] text-text-secondary">
              Perfect subtitles, unlimited
            </p>
          </div>

          {/* Features */}
          <div className="bg-surface rounded-[16px] p-5 mb-6">
            {features.map((feat, i) => (
              <div key={i} className={`flex items-center gap-3 py-3 ${i < features.length - 1 ? 'border-b border-divider' : ''}`}>
                <div className="w-[22px] h-[22px] rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5L4.5 8.5L11 1.5" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[17px] text-text-primary">{feat}</span>
              </div>
            ))}
          </div>

          {/* Plans */}
          <div className="space-y-3 mb-6">
            {/* Weekly */}
            <button
              onClick={() => setSelectedPlan('weekly')}
              className={`w-full rounded-[14px] p-4 flex items-center justify-between transition-all ${
                selectedPlan === 'weekly'
                  ? 'bg-surface border-2 border-accent'
                  : 'bg-surface border-2 border-transparent'
              }`}
            >
              <div className="text-left">
                <p className="text-[17px] font-semibold text-text-primary">$6.99/week</p>
                <p className="text-[13px] text-text-secondary mt-0.5">Cancel anytime</p>
              </div>
              <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center ${
                selectedPlan === 'weekly' ? 'border-accent' : 'border-text-tertiary'
              }`}>
                {selectedPlan === 'weekly' && (
                  <div className="w-[12px] h-[12px] rounded-full bg-accent" />
                )}
              </div>
            </button>

            {/* Yearly */}
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`w-full rounded-[14px] p-4 flex items-center justify-between transition-all relative overflow-hidden ${
                selectedPlan === 'yearly'
                  ? 'bg-surface border-2 border-accent'
                  : 'bg-surface border-2 border-transparent'
              }`}
            >
              {/* Save badge */}
              <div className="absolute top-0 right-0 bg-accent px-3 py-1 rounded-bl-[10px]">
                <span className="text-[11px] font-bold text-white">SAVE</span>
              </div>

              <div className="text-left">
                <p className="text-[17px] font-semibold text-text-primary">$39.99/year</p>
                <p className="text-[13px] text-text-secondary mt-0.5">
                  $0.77/week <span className="text-accent font-medium">-- save 89%</span>
                </p>
              </div>
              <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center ${
                selectedPlan === 'yearly' ? 'border-accent' : 'border-text-tertiary'
              }`}>
                {selectedPlan === 'yearly' && (
                  <div className="w-[12px] h-[12px] rounded-full bg-accent" />
                )}
              </div>
            </button>
          </div>

          {/* Social proof */}
          <div className="text-center mb-6">
            <p className="text-[13px] text-text-secondary">
              Used by <span className="text-text-primary font-medium">10,000+</span> creators
            </p>
            <div className="flex items-center justify-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="var(--accent)">
                  <path d="M8 1L10.2 5.4L15 6.2L11.5 9.6L12.4 14.4L8 12.1L3.6 14.4L4.5 9.6L1 6.2L5.8 5.4L8 1Z"/>
                </svg>
              ))}
              <span className="text-[13px] text-text-primary font-medium ml-1">4.8</span>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* CTA */}
          <div className="pb-4">
            <button
              onClick={handleSubscribe}
              className="w-full h-[56px] bg-accent rounded-[14px] text-white text-[17px] font-bold active:scale-[0.98] transition-transform shadow-lg shadow-accent/30"
            >
              Start Free Trial
            </button>
            <div className="flex items-center justify-center gap-3 mt-4">
              <button className="text-[13px] text-text-tertiary">Restore Purchases</button>
              <span className="text-text-tertiary text-[13px]">&middot;</span>
              <button className="text-[13px] text-text-tertiary">Terms</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
