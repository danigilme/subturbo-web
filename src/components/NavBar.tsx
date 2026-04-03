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
    <div className={`safe-top sticky top-0 z-40 ${transparent ? '' : 'bg-bg/90 backdrop-blur-xl'}`}>
      <div className="flex items-center justify-between h-[44px] px-5">
        <div className="w-[72px] flex items-start">
          {leftAction === 'back' ? (
            <button onClick={handleBack} className="flex items-center gap-1 text-accent min-h-[44px] min-w-[44px]">
              <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                <path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ) : leftAction ? (
            <div className="min-h-[44px] flex items-center">{leftAction}</div>
          ) : null}
        </div>
        {title && (
          <h1 className="text-[16px] font-medium text-text-primary flex-1 text-center">{title}</h1>
        )}
        <div className="w-[72px] flex items-end justify-end">
          {rightAction && <div className="min-h-[44px] flex items-center">{rightAction}</div>}
        </div>
      </div>
    </div>
  );
}
