'use client';

import { ReactNode } from 'react';

export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Mobile: render directly */}
      <div className="block md:hidden w-full min-h-dvh bg-bg">
        {children}
      </div>
      {/* Desktop: phone frame */}
      <div className="hidden md:flex items-center justify-center min-h-screen">
        <div className="relative w-[393px] h-[852px] bg-bg rounded-[50px] border-[3px] border-[#2A2A35] overflow-hidden shadow-2xl">
          {/* Notch / Dynamic Island */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-b-[20px] z-50" />
          {/* Screen */}
          <div className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar">
            {children}
          </div>
          {/* Home indicator */}
          <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-white/30 rounded-full z-50" />
        </div>
      </div>
    </>
  );
}
