'use client';

import { ReactNode } from 'react';

export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Mobile: render directly */}
      <div className="block md:hidden w-full min-h-dvh bg-bg">
        {children}
      </div>
      {/* Desktop: phone frame — thinner bezel, subtler shadow */}
      <div className="hidden md:flex items-center justify-center min-h-screen">
        <div className="relative w-[393px] h-[852px] bg-bg rounded-[48px] border border-[#1E1E28] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)]">
          {/* Dynamic Island */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-b-[18px] z-50" />
          {/* Screen */}
          <div className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar">
            {children}
          </div>
          {/* Home indicator */}
          <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-white/20 rounded-full z-50" />
        </div>
      </div>
    </>
  );
}
