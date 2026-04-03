'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import PhoneFrame from './PhoneFrame';

export default function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Always show onboarding page immediately
    if (pathname === '/onboarding') {
      setReady(true);
      return;
    }
    const onboarded = localStorage.getItem('subturbo_onboarded');
    if (!onboarded) {
      router.replace('/onboarding');
    } else {
      setReady(true);
    }
  }, [pathname, router]);

  if (!ready) {
    return (
      <PhoneFrame>
        <div className="w-full h-dvh bg-bg flex items-center justify-center">
          <div className="text-accent text-[22px] font-bold animate-pulse">SubTurbo</div>
        </div>
      </PhoneFrame>
    );
  }

  return <PhoneFrame>{children}</PhoneFrame>;
}
