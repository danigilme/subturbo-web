'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Toggle from '@/components/Toggle';
import Slider from '@/components/Slider';
import PresetCard from '@/components/PresetCard';
import { useAppStore } from '@/store/useAppStore';

/* ────────────────────────────── data ────────────────────────────── */

const presets = [
  { id: 'youtube' as const, name: 'YouTube', font: 'Arial, sans-serif', color: '#FFFFFF', outline: true },
  { id: 'tiktok' as const, name: 'TikTok', font: 'Impact, sans-serif', color: '#FFFF00', outline: true },
  { id: 'cinema' as const, name: 'Cinema', font: 'Georgia, serif', color: '#FFFFFF', bg: 'rgba(0,0,0,0.7)' },
  { id: 'minimal' as const, name: 'Minimal', font: 'Helvetica Neue, sans-serif', color: '#CCCCCC' },
];

const fonts = [
  { name: 'Montserrat Bold', css: 'Montserrat, Arial, sans-serif', weight: 700 },
  { name: 'Impact', css: 'Impact, sans-serif', weight: 400 },
  { name: 'Helvetica Light', css: '"Helvetica Neue", Helvetica, sans-serif', weight: 300 },
  { name: 'SF Pro Medium', css: '-apple-system, "SF Pro Display", sans-serif', weight: 500 },
  { name: 'Bangers', css: 'Bangers, Impact, cursive', weight: 400 },
  { name: 'Literata Bold', css: 'Literata, Georgia, serif', weight: 700 },
];

const textColors = [
  '#FFFFFF', '#000000', '#FF3B30', '#FF9500', '#FFCC00', '#34C759',
  '#00C7BE', '#30B0C7', '#007AFF', '#5856D6', '#AF52DE', '#FF2D55',
];

const outlineColors = [
  '#000000', '#FFFFFF', '#1C1C1E', '#333333', '#FF3B30', '#FF9500',
  '#FFCC00', '#34C759', '#007AFF', '#5856D6', '#AF52DE', '#FF2D55',
];

const fontsMap: Record<string, { css: string; weight: number }> = Object.fromEntries(
  fonts.map((f) => [f.name, { css: f.css, weight: f.weight }]),
);

/* ────────────────────────── sub-components ──────────────────────── */

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mt-1">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 px-6 min-h-[44px]"
      >
        <span className="text-[10px] font-medium text-text-tertiary/60 uppercase tracking-[0.1em]">{title}</span>
        <svg
          width="10" height="6" viewBox="0 0 10 6" fill="none"
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M1 1L5 5L9 1" stroke="var(--text-tertiary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
        </svg>
      </button>
      {open && <div className="px-6 pb-5">{children}</div>}
    </div>
  );
}

function ColorGrid({ colors, selected, onSelect }: { colors: string[]; selected: string; onSelect: (c: string) => void }) {
  return (
    <div className="grid grid-cols-6 gap-3.5">
      {colors.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className={`w-[32px] h-[32px] rounded-full transition-all duration-300 ${
            selected === c ? 'ring-[1.5px] ring-accent ring-offset-2 ring-offset-bg scale-105' : ''
          }`}
          style={{ backgroundColor: c, boxShadow: c === '#000000' ? 'inset 0 0 0 1px rgba(255,255,255,0.1)' : 'none' }}
        />
      ))}
    </div>
  );
}

/* ──────────────── recent style mini-preview ────────────────────── */

function RecentStyleThumb({
  style,
  onSelect,
}: {
  style: { font: string; textColor: string; outlineColor: string; outlineWidth: number; backgroundBox: boolean; backgroundOpacity: number; shadow: boolean };
  onSelect: () => void;
}) {
  const f = fontsMap[style.font] || fontsMap['Montserrat Bold'];
  return (
    <button
      onClick={onSelect}
      className="flex-shrink-0 w-[60px] h-[60px] rounded-[10px] bg-surface/60 flex items-center justify-center overflow-hidden"
    >
      <span
        className="text-[16px] font-bold leading-none"
        style={{
          fontFamily: f.css,
          fontWeight: f.weight,
          color: style.textColor,
          textShadow: style.shadow ? '0 1px 3px rgba(0,0,0,0.6)' : 'none',
          WebkitTextStroke: style.outlineWidth > 0 ? `${style.outlineWidth * 0.4}px ${style.outlineColor}` : 'none',
          backgroundColor: style.backgroundBox ? `rgba(0,0,0,${style.backgroundOpacity / 100})` : 'transparent',
          padding: style.backgroundBox ? '2px 6px' : '0',
          borderRadius: style.backgroundBox ? '4px' : '0',
        }}
      >
        Aa
      </span>
    </button>
  );
}

/* ═══════════════════════════ MAIN PAGE ═══════════════════════════ */

export default function EditorPage() {
  const router = useRouter();
  const {
    styleSettings,
    updateStyle,
    subtitles,
    updateSubtitle,
    recentStyles,
    activeEditorTab,
    setActiveEditorTab,
    currentSubtitleIndex,
    setCurrentSubtitleIndex,
    isSubscribed,
    freeVideoUsed,
    saveRecentStyle,
  } = useAppStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunkListRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(currentSubtitleIndex);

  // Keep ref in sync with store value
  useEffect(() => {
    currentIndexRef.current = currentSubtitleIndex;
  }, [currentSubtitleIndex]);

  const currentFont = fontsMap[styleSettings.font] || fontsMap['Montserrat Bold'];

  /* ──── simulated playback ──── */
  const totalDuration = 18; // seconds
  const chunkDuration = totalDuration / subtitles.length;

  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
  }, []);

  const startPlayback = useCallback(() => {
    setIsPlaying(true);
    playIntervalRef.current = setInterval(() => {
      const next = currentIndexRef.current + 1;
      if (next >= subtitles.length) {
        stopPlayback();
        setCurrentSubtitleIndex(0);
      } else {
        setCurrentSubtitleIndex(next);
      }
    }, chunkDuration * 1000);
  }, [chunkDuration, subtitles.length, setCurrentSubtitleIndex, stopPlayback]);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  }, [isPlaying, startPlayback, stopPlayback]);

  useEffect(() => {
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, []);

  /* ──── auto-scroll text tab ──── */
  useEffect(() => {
    if (activeEditorTab !== 'text' || !chunkListRef.current) return;
    const active = chunkListRef.current.querySelector(`[data-chunk-index="${currentSubtitleIndex}"]`);
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentSubtitleIndex, activeEditorTab]);

  /* ──── subtitle style helper ──── */
  const getSubtitleStyle = (scale = 0.6): React.CSSProperties => ({
    fontFamily: currentFont.css,
    fontWeight: currentFont.weight,
    fontSize: `${styleSettings.fontSize * scale}px`,
    color: styleSettings.textColor,
    textAlign: styleSettings.alignment,
    textShadow: styleSettings.shadow ? '0 2px 4px rgba(0,0,0,0.5)' : 'none',
    WebkitTextStroke: styleSettings.outlineWidth > 0 ? `${styleSettings.outlineWidth * 0.5}px ${styleSettings.outlineColor}` : 'none',
    backgroundColor: styleSettings.backgroundBox ? `rgba(0,0,0,${styleSettings.backgroundOpacity / 100})` : 'transparent',
    padding: styleSettings.backgroundBox ? '4px 12px' : '0',
    borderRadius: styleSettings.backgroundBox ? '6px' : '0',
  });

  /* ──── navigation ──── */
  const handleBack = () => setShowDiscardDialog(true);

  const handleExport = () => {
    saveRecentStyle();
    if (!isSubscribed && freeVideoUsed) {
      router.push('/paywall');
    } else {
      router.push('/export');
    }
  };

  const applyRecentStyle = (style: typeof recentStyles[number]) => {
    const { id: _id, createdAt: _ca, ...settings } = style;
    updateStyle(settings);
  };

  /* ──── segmented control ──── */
  const tabs = ['Style', 'Text'] as const;
  const tabIndexMap = { Style: 0, Text: 1 } as const;
  const activeTabIndex = tabIndexMap[tabs.find((t) => t.toLowerCase() === activeEditorTab) || 'Style'];

  /* ═══════════════════ FULLSCREEN MODE ═══════════════════ */
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col animate-fade-in">
        {/* Close button */}
        <div className="absolute top-0 left-0 right-0 z-10 safe-top">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsFullscreen(false)}
              className="w-[32px] h-[32px] rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M2 2L12 12M12 2L2 12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Full-screen video */}
        <button
          onClick={togglePlayback}
          className="flex-1 relative flex items-end justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460]" />

          {/* Play/pause overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-[56px] h-[56px] rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                  <path d="M8 4L24 14L8 24V4Z" fill="white" opacity="0.8"/>
                </svg>
              </div>
            </div>
          )}

          {/* Subtitle */}
          <div
            className="relative z-10 w-full px-6 transition-all duration-200"
            style={{ paddingBottom: `${100 - styleSettings.position}%` }}
          >
            <p style={getSubtitleStyle(0.7)} className="text-center leading-snug">
              {subtitles[currentSubtitleIndex]?.text || ''}
            </p>
          </div>
        </button>
      </div>
    );
  }

  /* ═══════════════════ NORMAL EDITOR MODE ═══════════════════ */
  return (
    <div className="w-full min-h-dvh bg-bg flex flex-col">
      {/* ──── Nav Bar ──── */}
      <div className="safe-top sticky top-0 z-40 bg-bg/90 backdrop-blur-xl">
        <div className="flex items-center justify-between h-[44px] px-5">
          {/* Left: Back */}
          <button onClick={handleBack} className="flex items-center text-accent min-h-[44px] min-w-[44px]">
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Right: Fullscreen + Export */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFullscreen(true)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-tertiary"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M3 7V3H7M13 3H17V7M17 13V17H13M7 17H3V13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={handleExport}
              className="h-[32px] px-5 rounded-full bg-accent text-white text-[13px] font-medium active:scale-[0.96] transition-all duration-300"
            >
              Export
            </button>
          </div>
        </div>
      </div>

      {/* ──── Video Preview ──── */}
      <button
        onClick={togglePlayback}
        className="w-full bg-surface/40 relative cursor-pointer"
        style={{ aspectRatio: '9/8' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460]" />

        {/* Play/pause indicator */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-[48px] h-[48px] rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 3L21 12L7 21V3Z" fill="white" opacity="0.8"/>
              </svg>
            </div>
          </div>
        )}

        {/* Subtitle preview */}
        <div
          className="absolute z-10 w-full px-4 transition-all duration-200"
          style={{ bottom: `${100 - styleSettings.position}%` }}
        >
          <p style={getSubtitleStyle()} className="text-center leading-snug">
            {subtitles[currentSubtitleIndex]?.text || 'Perfect subtitles'}
          </p>
        </div>
      </button>

      {/* ──── Segmented Control ──── */}
      <div className="px-6 pt-5 pb-3">
        <div className="relative bg-surface/50 rounded-full p-[2px] flex">
          {/* Sliding indicator */}
          <div
            className="absolute top-[2px] bottom-[2px] rounded-full bg-accent/80 transition-all duration-300 ease-out"
            style={{
              width: `calc(50% - 2px)`,
              left: activeTabIndex === 0 ? '2px' : 'calc(50%)',
            }}
          />
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveEditorTab(tab.toLowerCase() as 'style' | 'text')}
              className={`relative z-10 flex-1 py-[6px] text-[13px] font-medium text-center transition-colors duration-300 ${
                activeEditorTab === tab.toLowerCase() ? 'text-white' : 'text-text-tertiary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ──── Tab Content ──── */}
      <div className="flex-1 overflow-y-auto no-scrollbar safe-bottom">
        {activeEditorTab === 'style' ? (
          /* ═══════ STYLE TAB ═══════ */
          <div>
            {/* Clean audio toggle */}
            <div className="px-6 py-1">
              <Toggle
                value={styleSettings.cleanAudio}
                onChange={(v) => updateStyle({ cleanAudio: v })}
                label="Clean audio"
                icon={
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2V18M6 5V15M14 5V15M2 8V12M18 8V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                }
              />
            </div>

            {/* Preset carousel */}
            <div className="px-6 py-4">
              <h3 className="text-[10px] font-medium text-text-tertiary/60 uppercase tracking-[0.1em] mb-3">Presets</h3>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {presets.map((preset) => (
                  <PresetCard
                    key={preset.id}
                    name={preset.name}
                    active={styleSettings.preset === preset.id}
                    onSelect={() => updateStyle({ preset: preset.id })}
                    previewStyle={{
                      font: preset.font,
                      color: preset.color,
                      bg: preset.bg,
                      outline: preset.outline,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Recent styles */}
            {recentStyles.length > 0 && (
              <div className="px-6 py-3">
                <h3 className="text-[10px] font-medium text-text-tertiary/60 uppercase tracking-[0.1em] mb-3">Recent</h3>
                <div className="flex gap-2">
                  {recentStyles.map((rs) => (
                    <RecentStyleThumb
                      key={rs.id}
                      style={rs}
                      onSelect={() => applyRecentStyle(rs)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Font & Color */}
            <Section title="Font & Color" defaultOpen={true}>
              <div className="mb-5">
                <p className="text-[11px] text-text-tertiary/50 mb-2">Font</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {fonts.map((f) => (
                    <button
                      key={f.name}
                      onClick={() => updateStyle({ font: f.name })}
                      className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[13px] transition-all duration-300 ${
                        styleSettings.font === f.name
                          ? 'text-accent border-b border-accent'
                          : 'text-text-tertiary'
                      }`}
                      style={{ fontFamily: f.css, fontWeight: f.weight }}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <p className="text-[11px] text-text-tertiary/50 mb-3">Text Color</p>
                <ColorGrid colors={textColors} selected={styleSettings.textColor} onSelect={(c) => updateStyle({ textColor: c })} />
              </div>

              <div>
                <p className="text-[11px] text-text-tertiary/50 mb-3">Outline Color</p>
                <ColorGrid colors={outlineColors} selected={styleSettings.outlineColor} onSelect={(c) => updateStyle({ outlineColor: c })} />
              </div>
            </Section>

            {/* Size & Position */}
            <Section title="Size & Position">
              <Slider
                label="Font Size"
                valueLabel={`${styleSettings.fontSize}pt`}
                value={styleSettings.fontSize}
                min={16}
                max={48}
                onChange={(v) => updateStyle({ fontSize: v })}
              />
              <Slider
                label="Position"
                valueLabel={`${styleSettings.position}%`}
                value={styleSettings.position}
                min={10}
                max={90}
                onChange={(v) => updateStyle({ position: v })}
              />
              <div className="mt-2">
                <p className="text-[11px] text-text-tertiary/50 mb-2">Alignment</p>
                <div className="flex gap-2">
                  {(['left', 'center', 'right'] as const).map((align) => (
                    <button
                      key={align}
                      onClick={() => updateStyle({ alignment: align })}
                      className={`flex-1 h-[40px] rounded-[10px] flex items-center justify-center transition-all duration-300 ${
                        styleSettings.alignment === align ? 'bg-accent/15' : 'bg-surface/40'
                      }`}
                    >
                      <div className="flex flex-col gap-1 items-center w-[18px]">
                        <div className={`h-[1.5px] rounded-full ${styleSettings.alignment === align ? 'bg-accent' : 'bg-text-tertiary/40'}`}
                          style={{ width: '100%', alignSelf: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center' }} />
                        <div className={`h-[1.5px] rounded-full ${styleSettings.alignment === align ? 'bg-accent' : 'bg-text-tertiary/40'}`}
                          style={{ width: '70%', alignSelf: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center' }} />
                        <div className={`h-[1.5px] rounded-full ${styleSettings.alignment === align ? 'bg-accent' : 'bg-text-tertiary/40'}`}
                          style={{ width: '85%', alignSelf: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center' }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Section>

            {/* Effects */}
            <Section title="Effects">
              <Slider
                label="Outline Width"
                valueLabel={`${styleSettings.outlineWidth}px`}
                value={styleSettings.outlineWidth}
                min={0}
                max={5}
                step={0.5}
                onChange={(v) => updateStyle({ outlineWidth: v })}
              />
              <div className="py-0.5">
                <Toggle
                  value={styleSettings.shadow}
                  onChange={(v) => updateStyle({ shadow: v })}
                  label="Drop Shadow"
                />
              </div>
              <div className="py-0.5">
                <Toggle
                  value={styleSettings.backgroundBox}
                  onChange={(v) => updateStyle({ backgroundBox: v })}
                  label="Background Box"
                />
              </div>
              {styleSettings.backgroundBox && (
                <Slider
                  label="Box Opacity"
                  valueLabel={`${styleSettings.backgroundOpacity}%`}
                  value={styleSettings.backgroundOpacity}
                  min={20}
                  max={100}
                  onChange={(v) => updateStyle({ backgroundOpacity: v })}
                />
              )}
              <div className="py-0.5">
                <Toggle
                  value={styleSettings.wordHighlight}
                  onChange={(v) => updateStyle({ wordHighlight: v })}
                  label="Word-by-word Highlight"
                />
              </div>
            </Section>
          </div>
        ) : (
          /* ═══════ TEXT TAB ═══════ */
          <div ref={chunkListRef} className="px-0">
            {subtitles.map((chunk, index) => (
              <div
                key={chunk.id}
                data-chunk-index={index}
                className="relative transition-all duration-300"
              >
                {/* Active indicator — thin accent left border */}
                {index === currentSubtitleIndex && (
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent rounded-r-full" />
                )}

                <div className={`px-6 py-4 ${index === currentSubtitleIndex ? 'bg-accent/3' : ''}`}>
                  {/* Timecode */}
                  <button
                    onClick={() => {
                      setCurrentSubtitleIndex(index);
                      stopPlayback();
                    }}
                    className="text-[11px] text-text-tertiary/40 font-mono mb-1.5 min-h-[24px] flex items-center"
                  >
                    {chunk.startTime} - {chunk.endTime}
                  </button>

                  {/* Editable text */}
                  <textarea
                    value={chunk.text}
                    onChange={(e) => updateSubtitle(chunk.id, e.target.value)}
                    onFocus={() => {
                      setCurrentSubtitleIndex(index);
                      stopPlayback();
                    }}
                    className="w-full bg-transparent text-[15px] text-text-primary resize-none outline-none leading-relaxed"
                    rows={Math.ceil(chunk.text.length / 35) || 1}
                    style={{ caretColor: 'var(--accent)' }}
                  />
                </div>
              </div>
            ))}

            {/* Bottom spacer for keyboard clearance */}
            <div className="h-[120px]" />
          </div>
        )}
      </div>

      {/* ──── Discard changes dialog ──── */}
      {showDiscardDialog && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 animate-fade-in">
          <div className="w-full max-w-[393px] mx-4 mb-8 animate-fade-in-up">
            <div className="bg-surface-high rounded-[16px] overflow-hidden mb-2">
              <div className="px-4 py-5 text-center">
                <p className="text-[13px] text-text-secondary">Discard changes? Your edits will be lost.</p>
              </div>
              <div className="h-px bg-divider/50" />
              <button
                onClick={() => router.push('/')}
                className="w-full py-3.5 text-[16px] text-error font-medium text-center"
              >
                Discard
              </button>
            </div>
            <button
              onClick={() => setShowDiscardDialog(false)}
              className="w-full py-3.5 bg-surface-high rounded-[16px] text-[16px] text-accent font-medium text-center"
            >
              Keep Editing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
