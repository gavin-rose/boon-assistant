import React from 'react';
import { Zap, Wifi, WifiOff, Settings, NotepadText } from 'lucide-react';

interface HeaderProps {
  isSimulatingOffline: boolean;
  setIsSimulatingOffline: (val: boolean | ((prev: boolean) => boolean)) => void;
  isOnline: boolean;
  nanoAvailable: boolean;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSimulatingOffline,
  setIsSimulatingOffline,
  isOnline,
  nanoAvailable,
  onOpenSettings
}) => {
  const effectiveOnline = isOnline && !isSimulatingOffline;

  return (
    <header className="sticky top-0 z-40 bg-black border-b border-zinc-800 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center font-bold text-white">
            <NotepadText className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">Boon: Event Assistant</h1>
            </div>
            <p className="text-xs text-zinc-400">
              #BuildHybridAI 2026
            </p>
          </div>
        </div>

        {/* Status Indicators & Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Active Model Indicator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium transition-colors ${
              !effectiveOnline
                ? 'bg-amber-950/30 text-amber-300 border-amber-600/40'
                : 'bg-emerald-950/30 text-emerald-300 border-emerald-600/40'
            }`}
            title={nanoAvailable ? "Chrome Gemini Nano detected locally" : "Fallback on-device hybrid routing"}
          >
            <Zap className={`h-3.5 w-3.5 animate-pulse ${effectiveOnline ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span>
              {!effectiveOnline ? 'Local Mode' : 'Hybrid Mode'}
            </span>
          </div>

          {/* Network / Deadzone Simulator Button */}
          <button
            onClick={() => setIsSimulatingOffline((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-medium transition-all cursor-pointer bg-transparent ${
              effectiveOnline
                ? 'text-zinc-300 border-zinc-800 hover:text-white hover:border-zinc-700'
                : 'text-amber-300 border-amber-500/60'
            }`}
          >
            {effectiveOnline ? (
              <>
                <Wifi className="h-3.5 w-3.5 text-emerald-400" />
                <span>Start Simulating Deadzone</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5 text-amber-400" />
                <span>Stop Simulating Deadzone</span>
              </>
            )}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-transparent border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition cursor-pointer"
            title="Config"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
