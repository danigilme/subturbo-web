'use client';

import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import Toggle from '@/components/Toggle';
import { useAppStore } from '@/store/useAppStore';

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-[13px] font-semibold text-text-tertiary uppercase tracking-wider px-4 mb-2">{title}</h3>
      <div className="bg-surface rounded-[12px] mx-4 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function SettingsRow({ label, value, onClick, isLast = false }: { label: string; value?: string | React.ReactNode; onClick?: () => void; isLast?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 min-h-[44px] py-3 ${!isLast ? 'border-b border-divider' : ''}`}
    >
      <span className="text-[17px] text-text-primary">{label}</span>
      <div className="flex items-center gap-2">
        {typeof value === 'string' ? (
          <span className="text-[17px] text-text-secondary">{value}</span>
        ) : value}
        {onClick && (
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M1 1L7 7L1 13" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { isSubscribed, styleSettings, updateStyle, exportQuality, setExportQuality } = useAppStore();

  const cycleQuality = () => {
    const options: ('720p' | '1080p' | '4K')[] = ['720p', '1080p', '4K'];
    const currentIndex = options.indexOf(exportQuality);
    setExportQuality(options[(currentIndex + 1) % options.length]);
  };

  return (
    <div className="w-full min-h-dvh bg-bg flex flex-col">
      <NavBar title="Settings" />

      <div className="flex-1 overflow-y-auto no-scrollbar safe-bottom pt-4">
        {/* Subscription */}
        <SettingsGroup title="Subscription">
          <div className="px-4 py-3 border-b border-divider">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[17px] text-text-primary font-semibold">SubTurbo Pro</p>
                <p className="text-[13px] text-text-secondary mt-0.5">
                  {isSubscribed ? 'Renews Apr 30, 2026' : 'Not subscribed'}
                </p>
              </div>
              {isSubscribed ? (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/10">
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5L4.5 8.5L11 1.5" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[12px] text-success font-medium">Active</span>
                </div>
              ) : (
                <button
                  onClick={() => router.push('/paywall')}
                  className="px-3 py-1.5 rounded-full bg-accent text-white text-[13px] font-semibold"
                >
                  Upgrade
                </button>
              )}
            </div>
          </div>
          <SettingsRow
            label="Manage Subscription"
            onClick={() => {}}
            isLast
          />
        </SettingsGroup>

        {/* Defaults */}
        <SettingsGroup title="Defaults">
          <SettingsRow
            label="Default Style"
            value={styleSettings.preset.charAt(0).toUpperCase() + styleSettings.preset.slice(1)}
            onClick={() => router.push('/editor')}
          />
          <div className="px-4">
            <Toggle
              value={styleSettings.cleanAudio}
              onChange={(v) => updateStyle({ cleanAudio: v })}
              label="Clean Audio"
            />
          </div>
          <SettingsRow
            label="Export Quality"
            value={exportQuality}
            onClick={cycleQuality}
            isLast
          />
        </SettingsGroup>

        {/* About */}
        <SettingsGroup title="About">
          <SettingsRow label="Help & Support" onClick={() => {}} />
          <SettingsRow label="Rate SubTurbo" onClick={() => {}} />
          <SettingsRow label="Privacy Policy" onClick={() => {}} />
          <SettingsRow label="Terms of Use" onClick={() => {}} isLast />
        </SettingsGroup>

        {/* Version */}
        <div className="text-center py-4">
          <p className="text-[13px] text-text-tertiary">Version 1.0.0 (42)</p>
        </div>
      </div>
    </div>
  );
}
