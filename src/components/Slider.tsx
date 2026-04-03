'use client';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  label?: string;
  valueLabel?: string;
}

export default function Slider({ value, min, max, step = 1, onChange, label, valueLabel }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full py-2">
      {(label || valueLabel) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-[15px] text-text-secondary">{label}</span>}
          {valueLabel && <span className="text-[15px] text-text-primary font-medium">{valueLabel}</span>}
        </div>
      )}
      <div className="relative w-full h-[44px] flex items-center">
        <div className="absolute w-full h-[4px] rounded-full bg-surface-high">
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-[44px] opacity-0 cursor-pointer z-10"
        />
        <div
          className="absolute w-[28px] h-[28px] rounded-full bg-white shadow-lg pointer-events-none"
          style={{ left: `calc(${pct}% - 14px)` }}
        />
      </div>
    </div>
  );
}
