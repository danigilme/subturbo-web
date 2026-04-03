'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface NavBarProps {
  title?: string;
  leftAction?: 'back' | ReactNode;
  rightAction?: ReactNode;
  onBack?: () => void;
  transparent?: boolean;
}

export default function NavBar({ title, leftAction = 'back', rightAction, onBack, transparent = false }: NavBarProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className={`safe-top sticky top-0 z-40 ${transparent ? '' : 'bg-bg/80 backdrop-blur-xl border-b border-divider'}`}>
      <div className="flex items-center justify-between h-[44px] px-4">
        <div className="w-[72px] flex items-start">
          {leftAction === 'back' ? (
            <button onClick={handleBack} className="flex items-center gap-1 text-accent min-h-[44px] min-w-[44px]">
              <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
                <path d="M10 2L2 10L10 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[17px]">Back</span>
            </button>
          ) : leftAction ? (
            <div className="min-h-[44px] flex items-center">{leftAction}</div>
          ) : null}
        </div>
        {title && (
          <h1 className="text-[17px] font-semibold text-text-primary flex-1 text-center">{title}</h1>
        )}
        <div className="w-[72px] flex items-end justify-end">
          {rightAction && <div className="min-h-[44px] flex items-center">{rightAction}</div>}
        </div>
      </div>
    </div>
  );
}
