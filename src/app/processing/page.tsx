'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import ProcessingStep from '@/components/ProcessingStep';
import Waveform from '@/components/Waveform';

type StepStatus = 'pending' | 'in-progress' | 'completed';

interface Step {
  label: string;
  status: StepStatus;
  counter?: string;
}

export default function ProcessingPage() {
  const router = useRouter();
  const [showCancel, setShowCancel] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);
  const [steps, setSteps] = useState<Step[]>([
    { label: 'Removing noise', status: 'in-progress' },
    { label: 'Listening carefully', status: 'pending', counter: '0/7' },
    { label: 'Perfecting words', status: 'pending' },
    { label: 'Timing every syllable', status: 'pending' },
  ]);

  const updateStep = useCallback((index: number, update: Partial<Step>) => {
    setSteps(prev => prev.map((s, i) => i === index ? { ...s, ...update } : s));
  }, []);

  useEffect(() => {
    // Step 1: Removing noise (3s)
    const t1 = setTimeout(() => {
      updateStep(0, { status: 'completed' });
      updateStep(1, { status: 'in-progress' });
    }, 3000);

    // Step 2: Listening carefully - counter increments
    const counters: NodeJS.Timeout[] = [];
    for (let i = 1; i <= 7; i++) {
      counters.push(setTimeout(() => {
        updateStep(1, { counter: `${i}/7` });
      }, 3000 + i * 800));
    }

    // Step 2 complete
    const t2 = setTimeout(() => {
      updateStep(1, { status: 'completed', counter: '7/7' });
      updateStep(2, { status: 'in-progress' });
    }, 9600);

    // Step 3 complete
    const t3 = setTimeout(() => {
      updateStep(2, { status: 'completed' });
      updateStep(3, { status: 'in-progress' });
    }, 14000);

    // Step 4 complete & navigate
    const t4 = setTimeout(() => {
      updateStep(3, { status: 'completed' });
    }, 18000);

    const t5 = setTimeout(() => {
      localStorage.setItem('subturbo_free_used', 'true');
      router.push('/editor');
    }, 19500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      counters.forEach(clearTimeout);
    };
  }, [router, updateStep]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-dvh bg-bg flex flex-col">
      <NavBar
        title=""
        leftAction={
          <button
            onClick={() => setShowCancel(true)}
            className="flex items-center gap-1 text-accent min-h-[44px] min-w-[44px]"
          >
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        }
      />

      <div className="flex-1 flex flex-col items-center px-8 pt-12">
        {/* Video thumbnail placeholder */}
        <div className="w-[140px] h-[248px] bg-surface/60 rounded-[16px] mb-10 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-surface-high/30 to-surface/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" opacity="0.3">
              <path d="M4 3L17 10L4 17V3Z" fill="var(--text-tertiary)"/>
            </svg>
          </div>
        </div>

        {/* Waveform */}
        <div className="w-full mb-10 opacity-60">
          <Waveform animated={true} barCount={50} color="var(--accent)" />
        </div>

        {/* Steps */}
        <div className="w-full">
          {steps.map((step, i) => (
            <ProcessingStep
              key={i}
              label={step.label}
              status={step.status}
              counter={step.counter}
            />
          ))}
        </div>

        {/* Time remaining */}
        <p className="text-[12px] text-text-tertiary/60 mt-8">
          About {timeLeft}s remaining
        </p>
      </div>

      {/* Cancel dialog */}
      {showCancel && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 animate-fade-in">
          <div className="w-full max-w-[393px] mx-4 mb-8 animate-fade-in-up">
            <div className="bg-surface-high rounded-[16px] overflow-hidden mb-2">
              <div className="px-4 py-5 text-center">
                <p className="text-[13px] text-text-secondary">Cancel processing? Your progress will be lost.</p>
              </div>
              <div className="h-px bg-divider/50" />
              <button
                onClick={() => router.push('/')}
                className="w-full py-3.5 text-[16px] text-error font-medium text-center"
              >
                Cancel Processing
              </button>
            </div>
            <button
              onClick={() => setShowCancel(false)}
              className="w-full py-3.5 bg-surface-high rounded-[16px] text-[16px] text-accent font-medium text-center"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
