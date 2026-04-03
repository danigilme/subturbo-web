'use client';

import { create } from 'zustand';

export interface SubtitleChunk {
  id: string;
  startTime: string;
  endTime: string;
  text: string;
}

export interface StyleSettings {
  preset: 'youtube' | 'tiktok' | 'cinema' | 'minimal';
  font: string;
  textColor: string;
  outlineColor: string;
  fontSize: number;
  position: number;
  alignment: 'left' | 'center' | 'right';
  outlineWidth: number;
  shadow: boolean;
  backgroundBox: boolean;
  backgroundOpacity: number;
  wordHighlight: boolean;
  cleanAudio: boolean;
}

interface AppState {
  onboardingComplete: boolean;
  freeVideoUsed: boolean;
  isSubscribed: boolean;
  selectedPlan: 'weekly' | 'yearly';
  styleSettings: StyleSettings;
  subtitles: SubtitleChunk[];
  exportQuality: '720p' | '1080p' | '4K';

  setOnboardingComplete: (v: boolean) => void;
  setFreeVideoUsed: (v: boolean) => void;
  setIsSubscribed: (v: boolean) => void;
  setSelectedPlan: (v: 'weekly' | 'yearly') => void;
  updateStyle: (partial: Partial<StyleSettings>) => void;
  setSubtitles: (chunks: SubtitleChunk[]) => void;
  updateSubtitle: (id: string, text: string) => void;
  setExportQuality: (q: '720p' | '1080p' | '4K') => void;
}

const defaultStyle: StyleSettings = {
  preset: 'youtube',
  font: 'Montserrat Bold',
  textColor: '#FFFFFF',
  outlineColor: '#000000',
  fontSize: 28,
  position: 80,
  alignment: 'center',
  outlineWidth: 2,
  shadow: true,
  backgroundBox: false,
  backgroundOpacity: 60,
  wordHighlight: true,
  cleanAudio: true,
};

const defaultSubtitles: SubtitleChunk[] = [
  { id: '1', startTime: '0:00', endTime: '0:03', text: 'Perfect subtitles in any language' },
  { id: '2', startTime: '0:03', endTime: '0:07', text: 'Word-by-word timing that feels natural' },
  { id: '3', startTime: '0:07', endTime: '0:11', text: 'AI-powered noise removal for clean audio' },
  { id: '4', startTime: '0:11', endTime: '0:15', text: 'Beautiful styles that match your brand' },
  { id: '5', startTime: '0:15', endTime: '0:19', text: 'Export in seconds, share everywhere' },
  { id: '6', startTime: '0:19', endTime: '0:22', text: 'SubTurbo makes it effortless' },
];

export const useAppStore = create<AppState>((set) => ({
  onboardingComplete: false,
  freeVideoUsed: false,
  isSubscribed: false,
  selectedPlan: 'yearly',
  styleSettings: defaultStyle,
  subtitles: defaultSubtitles,
  exportQuality: '1080p',

  setOnboardingComplete: (v) => set({ onboardingComplete: v }),
  setFreeVideoUsed: (v) => set({ freeVideoUsed: v }),
  setIsSubscribed: (v) => set({ isSubscribed: v }),
  setSelectedPlan: (v) => set({ selectedPlan: v }),
  updateStyle: (partial) => set((s) => ({ styleSettings: { ...s.styleSettings, ...partial } })),
  setSubtitles: (chunks) => set({ subtitles: chunks }),
  updateSubtitle: (id, text) =>
    set((s) => ({
      subtitles: s.subtitles.map((c) => (c.id === id ? { ...c, text } : c)),
    })),
  setExportQuality: (q) => set({ exportQuality: q }),
}));
