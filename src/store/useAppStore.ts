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

export type StyleConfig = StyleSettings & { id: string; createdAt: number };

interface AppState {
  onboardingComplete: boolean;
  freeVideoUsed: boolean;
  isSubscribed: boolean;
  selectedPlan: 'weekly' | 'yearly';
  styleSettings: StyleSettings;
  subtitles: SubtitleChunk[];
  exportQuality: '720p' | '1080p' | '4K';
  recentStyles: StyleConfig[];
  activeEditorTab: 'style' | 'text';
  currentSubtitleIndex: number;

  setOnboardingComplete: (v: boolean) => void;
  setFreeVideoUsed: (v: boolean) => void;
  setIsSubscribed: (v: boolean) => void;
  setSelectedPlan: (v: 'weekly' | 'yearly') => void;
  updateStyle: (partial: Partial<StyleSettings>) => void;
  setSubtitles: (chunks: SubtitleChunk[]) => void;
  updateSubtitle: (id: string, text: string) => void;
  setExportQuality: (q: '720p' | '1080p' | '4K') => void;
  saveRecentStyle: () => void;
  setActiveEditorTab: (tab: 'style' | 'text') => void;
  setCurrentSubtitleIndex: (index: number) => void;
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
  { id: '2', startTime: '0:03', endTime: '0:05', text: 'Word by word timing' },
  { id: '3', startTime: '0:05', endTime: '0:08', text: 'Zero editing needed' },
  { id: '4', startTime: '0:08', endTime: '0:12', text: 'AI-powered noise removal makes every word crystal clear' },
  { id: '5', startTime: '0:12', endTime: '0:15', text: 'Perfect for content creators' },
  { id: '6', startTime: '0:15', endTime: '0:18', text: 'Any language, thirty seconds' },
];

// Mock recent styles for initial state
const mockRecentStyles: StyleConfig[] = [
  {
    ...defaultStyle,
    id: 'recent-1',
    preset: 'tiktok',
    font: 'Impact',
    textColor: '#FFFF00',
    outlineColor: '#000000',
    outlineWidth: 3,
    shadow: false,
    createdAt: Date.now() - 86400000,
  },
  {
    ...defaultStyle,
    id: 'recent-2',
    preset: 'cinema',
    font: 'Literata Bold',
    textColor: '#FFFFFF',
    backgroundBox: true,
    backgroundOpacity: 70,
    shadow: false,
    outlineWidth: 0,
    createdAt: Date.now() - 172800000,
  },
];

export const useAppStore = create<AppState>((set) => ({
  onboardingComplete: false,
  freeVideoUsed: false,
  isSubscribed: false,
  selectedPlan: 'yearly',
  styleSettings: defaultStyle,
  subtitles: defaultSubtitles,
  exportQuality: '1080p',
  recentStyles: mockRecentStyles,
  activeEditorTab: 'style',
  currentSubtitleIndex: 0,

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
  saveRecentStyle: () =>
    set((s) => {
      const newConfig: StyleConfig = {
        ...s.styleSettings,
        id: `recent-${Date.now()}`,
        createdAt: Date.now(),
      };
      const updated = [newConfig, ...s.recentStyles].slice(0, 3);
      return { recentStyles: updated };
    }),
  setActiveEditorTab: (tab) => set({ activeEditorTab: tab }),
  setCurrentSubtitleIndex: (index) => set({ currentSubtitleIndex: index }),
}));
