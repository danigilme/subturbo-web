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
      className={`flex-shrink-0 w-[130px] rounded-[14px] p-2.5 transition-all duration-300 ${
        active
          ? 'bg-surface border border-accent/40'
          : 'bg-surface/60 border border-transparent'
      }`}
    >
      {/* Preview area */}
      <div className="w-full h-[72px] bg-bg/60 rounded-[10px] flex items-end justify-center pb-2 mb-2 overflow-hidden relative">
        <span
          className="relative z-10 text-[12px] font-bold leading-tight text-center px-1"
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
      <span className={`text-[12px] ${active ? 'text-accent' : 'text-text-tertiary'}`}>
        {name}
      </span>
    </button>
  );
}
