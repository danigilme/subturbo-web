'use client';

import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import Toggle from '@/components/Toggle';
import { useAppStore } from '@/store/useAppStore';

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-[10px] font-medium text-text-tertiary/60 uppercase tracking-[0.1em] px-6 mb-3">{title}</h3>
      <div className="mx-6">
        {children}
      </div>
    </div>
  );
}

function SettingsRow({ label, value, onClick, isLast = false }: { label: string; value?: string | React.ReactNode; onClick?: () => void; isLast?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between min-h-[44px] py-3 ${!isLast ? 'border-b border-divider/30' : ''}`}
    >
      <span className="text-[15px] text-text-primary">{label}</span>
      <div className="flex items-center gap-2">
        {typeof value === 'string' ? (
          <span className="text-[15px] text-text-tertiary">{value}</span>
        ) : value}
        {onClick && (
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
            <path d="M1 1L6 6L1 11" stroke="var(--text-tertiary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
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

      <div className="flex-1 overflow-y-auto no-scrollbar safe-bottom pt-6">
        {/* Subscription */}
        <SettingsGroup title="Subscription">
          <div className="py-3 border-b border-divider/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[15px] text-text-primary font-medium">SubTurbo Pro</p>
                <p className="text-[12px] text-text-tertiary mt-0.5">
                  {isSubscribed ? 'Renews Apr 30, 2026' : 'Not subscribed'}
                </p>
              </div>
              {isSubscribed ? (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/8">
                  <svg width="10" height="8" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5L4.5 8.5L11 1.5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[11px] text-accent">Active</span>
                </div>
              ) : (
                <button
                  onClick={() => router.push('/paywall')}
                  className="px-4 py-1.5 rounded-full bg-accent text-white text-[12px] font-medium"
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
          <div>
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
        <div className="text-center py-6">
          <p className="text-[11px] text-text-tertiary/40">Version 1.0.0 (42)</p>
        </div>
      </div>
    </div>
  );
}
