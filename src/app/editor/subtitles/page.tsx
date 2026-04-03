'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditSubtitlesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/editor');
  }, [router]);

  return null;
}
