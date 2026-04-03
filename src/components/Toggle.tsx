'use client';

interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  icon?: React.ReactNode;
}

export default function Toggle({ value, onChange, label, icon }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="flex items-center justify-between w-full min-h-[44px] py-2"
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-text-secondary">{icon}</span>}
        {label && <span className="text-[17px] text-text-primary">{label}</span>}
      </div>
      <div
        className="toggle-track relative flex-shrink-0"
        style={{ backgroundColor: value ? 'var(--success)' : 'var(--surface-high)' }}
      >
        <div
          className="toggle-thumb absolute top-[2px]"
          style={{ transform: value ? 'translateX(22px)' : 'translateX(2px)' }}
        />
      </div>
    </button>
  );
}
