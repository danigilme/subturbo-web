'use client';

interface PresetCardProps {
  name: string;
  active: boolean;
  onSelect: () => void;
  previewStyle: {
    font: string;
    color: string;
    bg?: string;
    outline?: boolean;
  };
}

export default function PresetCard({ name, active, onSelect, previewStyle }: PresetCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`flex-shrink-0 w-[140px] rounded-[12px] p-3 transition-all duration-200 ${
        active
          ? 'bg-surface border-2 border-accent shadow-lg shadow-accent/10'
          : 'bg-surface border-2 border-transparent'
      }`}
    >
      {/* Preview area */}
      <div className="w-full h-[80px] bg-bg rounded-[8px] flex items-end justify-center pb-2 mb-2 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
        <span
          className="relative z-10 text-[13px] font-bold leading-tight text-center px-1"
          style={{
            fontFamily: previewStyle.font,
            color: previewStyle.color,
            textShadow: previewStyle.outline ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none',
            backgroundColor: previewStyle.bg || 'transparent',
            padding: previewStyle.bg ? '2px 6px' : '0',
            borderRadius: previewStyle.bg ? '4px' : '0',
          }}
        >
          Subtitles
        </span>
      </div>
      <span className={`text-[13px] font-medium ${active ? 'text-accent' : 'text-text-secondary'}`}>
        {name}
      </span>
    </button>
  );
}
