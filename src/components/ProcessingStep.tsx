'use client';

type StepStatus = 'pending' | 'in-progress' | 'completed';

interface ProcessingStepProps {
  label: string;
  status: StepStatus;
  counter?: string;
}

export default function ProcessingStep({ label, status, counter }: ProcessingStepProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      {/* Status icon */}
      <div className="w-[28px] h-[28px] flex items-center justify-center flex-shrink-0">
        {status === 'pending' && (
          <div className="w-[20px] h-[20px] rounded-full border-2 border-text-tertiary" />
        )}
        {status === 'in-progress' && (
          <div className="relative w-[20px] h-[20px]">
            <div className="absolute inset-0 rounded-full border-2 border-accent opacity-30" />
            <div className="absolute inset-0 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          </div>
        )}
        {status === 'completed' && (
          <div className="w-[20px] h-[20px] rounded-full bg-success flex items-center justify-center">
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
              <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>

      {/* Label */}
      <span
        className={`text-[17px] transition-colors duration-300 ${
          status === 'completed' ? 'text-text-secondary' :
          status === 'in-progress' ? 'text-text-primary font-medium' :
          'text-text-tertiary'
        }`}
      >
        {label}
        {counter && <span className="text-text-secondary ml-1">{counter}</span>}
      </span>
    </div>
  );
}
