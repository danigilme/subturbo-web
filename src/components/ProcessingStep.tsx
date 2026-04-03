'use client';

type StepStatus = 'pending' | 'in-progress' | 'completed';

interface ProcessingStepProps {
  label: string;
  status: StepStatus;
  counter?: string;
}

export default function ProcessingStep({ label, status, counter }: ProcessingStepProps) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      {/* Minimal status indicator */}
      <div className="w-[20px] flex items-center justify-center flex-shrink-0">
        {status === 'pending' && (
          <div className="w-[5px] h-[5px] rounded-full bg-text-tertiary/40" />
        )}
        {status === 'in-progress' && (
          <div className="w-[5px] h-[5px] rounded-full bg-accent" />
        )}
        {status === 'completed' && (
          <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
            <path d="M1 6L5 10L13 2" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {/* Label */}
      <span
        className={`text-[15px] transition-colors duration-300 ${
          status === 'completed' ? 'text-text-tertiary' :
          status === 'in-progress' ? 'text-text-primary' :
          'text-text-tertiary/60'
        }`}
      >
        {label}
        {counter && <span className="text-text-tertiary ml-1.5 text-[13px]">{counter}</span>}
      </span>
    </div>
  );
}
