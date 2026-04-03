'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { useAppStore } from '@/store/useAppStore';

export default function EditSubtitlesPage() {
  const router = useRouter();
  const { subtitles, updateSubtitle } = useAppStore();
  const [activeChunk, setActiveChunk] = useState<string | null>(null);

  return (
    <div className="w-full min-h-dvh bg-bg flex flex-col">
      <NavBar
        title="Edit Subtitles"
        rightAction={
          <button
            onClick={() => router.back()}
            className="text-[17px] text-accent font-semibold min-h-[44px] flex items-center"
          >
            Done
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto no-scrollbar safe-bottom">
        <div className="px-4 py-2">
          {subtitles.map((chunk, index) => (
            <div
              key={chunk.id}
              className={`py-4 transition-all duration-200 ${
                index < subtitles.length - 1 ? 'border-b border-divider' : ''
              } ${activeChunk === chunk.id ? 'bg-accent/5 -mx-4 px-4 rounded-[12px]' : ''}`}
            >
              {/* Timecode */}
              <button
                onClick={() => setActiveChunk(activeChunk === chunk.id ? null : chunk.id)}
                className="text-[13px] text-text-tertiary font-mono mb-2 min-h-[28px] flex items-center"
              >
                {chunk.startTime} - {chunk.endTime}
              </button>

              {/* Editable text */}
              <textarea
                value={chunk.text}
                onChange={(e) => updateSubtitle(chunk.id, e.target.value)}
                className="w-full bg-transparent text-[17px] text-text-primary resize-none outline-none leading-relaxed"
                rows={Math.ceil(chunk.text.length / 35) || 1}
                style={{ caretColor: 'var(--accent)' }}
              />
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="px-4 py-6">
          <p className="text-[13px] text-text-tertiary text-center">
            Tap a timecode to highlight the chunk. Edit text directly.
          </p>
        </div>
      </div>
    </div>
  );
}
