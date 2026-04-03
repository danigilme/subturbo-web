'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import Toggle from '@/components/Toggle';
import Slider from '@/components/Slider';
import PresetCard from '@/components/PresetCard';
import { useAppStore } from '@/store/useAppStore';

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

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-divider">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 px-4 min-h-[44px]"
      >
        <span className="text-[15px] font-semibold text-text-secondary">{title}</span>
        <svg
          width="14" height="8" viewBox="0 0 14 8" fill="none"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M1 1L7 7L13 1" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function ColorGrid({ colors, selected, onSelect }: { colors: string[]; selected: string; onSelect: (c: string) => void }) {
  return (
    <div className="grid grid-cols-6 gap-3">
      {colors.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className={`w-[40px] h-[40px] rounded-full border-2 transition-all ${
            selected === c ? 'border-accent scale-110' : 'border-transparent'
          }`}
          style={{ backgroundColor: c, boxShadow: c === '#000000' ? 'inset 0 0 0 1px rgba(255,255,255,0.2)' : 'none' }}
        />
      ))}
    </div>
  );
}

export default function EditorPage() {
  const router = useRouter();
  const { styleSettings, updateStyle, subtitles } = useAppStore();

  const currentPreset = presets.find(p => p.id === styleSettings.preset);
  const currentFont = fonts.find(f => f.name === styleSettings.font) || fonts[0];

  const getSubtitleStyle = (): React.CSSProperties => ({
    fontFamily: currentFont.css,
    fontWeight: currentFont.weight,
    fontSize: `${styleSettings.fontSize * 0.6}px`,
    color: styleSettings.textColor,
    textAlign: styleSettings.alignment,
    textShadow: styleSettings.shadow ? `0 2px 4px rgba(0,0,0,0.5)` : 'none',
    WebkitTextStroke: styleSettings.outlineWidth > 0 ? `${styleSettings.outlineWidth * 0.5}px ${styleSettings.outlineColor}` : 'none',
    backgroundColor: styleSettings.backgroundBox ? `rgba(0,0,0,${styleSettings.backgroundOpacity / 100})` : 'transparent',
    padding: styleSettings.backgroundBox ? '4px 12px' : '0',
    borderRadius: styleSettings.backgroundBox ? '6px' : '0',
  });

  return (
    <div className="w-full min-h-dvh bg-bg flex flex-col">
      <NavBar
        title="Style"
        rightAction={
          <button
            onClick={() => router.push('/preview')}
            className="text-[17px] text-accent font-semibold min-h-[44px] flex items-center"
          >
            Done
          </button>
        }
      />

      {/* Video Preview */}
      <div className="w-full bg-surface" style={{ aspectRatio: '9/10' }}>
        <div className="w-full h-full relative flex items-end justify-center overflow-hidden">
          {/* Simulated video background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460]" />
          <div className="absolute inset-0 opacity-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-full h-px bg-white" style={{ marginTop: `${(i + 1) * 8.3}%` }} />
            ))}
          </div>

          {/* Subtitle preview */}
          <div
            className="relative z-10 w-full px-4 transition-all duration-200"
            style={{ paddingBottom: `${100 - styleSettings.position}%` }}
          >
            <p style={getSubtitleStyle()} className="text-center leading-snug">
              {subtitles[0]?.text || 'Perfect subtitles in any language'}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-1 overflow-y-auto no-scrollbar safe-bottom">
        {/* Clean audio toggle */}
        <div className="px-4 border-b border-divider">
          <Toggle
            value={styleSettings.cleanAudio}
            onChange={(v) => updateStyle({ cleanAudio: v })}
            label="Clean audio"
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2V18M6 5V15M14 5V15M2 8V12M18 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            }
          />
        </div>

        {/* Preset carousel */}
        <div className="px-4 py-4 border-b border-divider">
          <h3 className="text-[15px] font-semibold text-text-secondary mb-3">Presets</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
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

        {/* Font & Color */}
        <Section title="Font & Color" defaultOpen={true}>
          <div className="mb-4">
            <p className="text-[13px] text-text-tertiary mb-2">Font</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {fonts.map((f) => (
                <button
                  key={f.name}
                  onClick={() => updateStyle({ font: f.name })}
                  className={`flex-shrink-0 px-4 py-2 rounded-[10px] text-[14px] transition-all ${
                    styleSettings.font === f.name
                      ? 'bg-accent text-white'
                      : 'bg-surface text-text-secondary'
                  }`}
                  style={{ fontFamily: f.css, fontWeight: f.weight }}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-[13px] text-text-tertiary mb-2">Text Color</p>
            <ColorGrid colors={textColors} selected={styleSettings.textColor} onSelect={(c) => updateStyle({ textColor: c })} />
          </div>

          <div>
            <p className="text-[13px] text-text-tertiary mb-2">Outline Color</p>
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
            <p className="text-[13px] text-text-tertiary mb-2">Alignment</p>
            <div className="flex gap-2">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => updateStyle({ alignment: align })}
                  className={`flex-1 h-[44px] rounded-[10px] flex items-center justify-center transition-all ${
                    styleSettings.alignment === align ? 'bg-accent' : 'bg-surface'
                  }`}
                >
                  <div className="flex flex-col gap-1 items-center w-[20px]">
                    <div className={`h-[2px] rounded-full ${styleSettings.alignment === align ? 'bg-white' : 'bg-text-secondary'}`}
                      style={{ width: '100%', alignSelf: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center' }} />
                    <div className={`h-[2px] rounded-full ${styleSettings.alignment === align ? 'bg-white' : 'bg-text-secondary'}`}
                      style={{ width: '70%', alignSelf: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center' }} />
                    <div className={`h-[2px] rounded-full ${styleSettings.alignment === align ? 'bg-white' : 'bg-text-secondary'}`}
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
          <div className="border-b border-divider/50">
            <Toggle
              value={styleSettings.shadow}
              onChange={(v) => updateStyle({ shadow: v })}
              label="Drop Shadow"
            />
          </div>
          <div className="border-b border-divider/50">
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
          <div>
            <Toggle
              value={styleSettings.wordHighlight}
              onChange={(v) => updateStyle({ wordHighlight: v })}
              label="Word-by-word Highlight"
            />
          </div>
        </Section>

        {/* Edit Subtitles button */}
        <div className="px-4 py-6">
          <button
            onClick={() => router.push('/editor/subtitles')}
            className="w-full h-[52px] bg-surface rounded-[14px] text-text-primary text-[17px] font-semibold border border-divider active:scale-[0.98] transition-transform"
          >
            Edit Subtitles
          </button>
        </div>
      </div>
    </div>
  );
}
