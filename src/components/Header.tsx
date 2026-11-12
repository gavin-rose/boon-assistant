import React from 'react';
import { Zap, Cloud, Wifi, WifiOff, Settings } from 'lucide-react';

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
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            <Zap className="h-5 w-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">Boon</h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                #BuildHybridAI
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Hybrid Event Copilot • Gemini Nano & Firebase AI Logic
            </p>
          </div>
        </div>

        {/* Status Indicators & Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Active Model Indicator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium transition-colors ${
              !effectiveOnline
                ? 'bg-amber-950/40 text-amber-300 border-amber-600/30'
                : 'bg-emerald-950/40 text-emerald-300 border-emerald-600/30'
            }`}
            title={nanoAvailable ? "Chrome Gemini Nano detected locally" : "Fallback on-device hybrid routing"}
          >
            <Zap className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span>
              {!effectiveOnline ? '⚡ On-Device Engine' : '⚡ Hybrid (Local + Cloud)'}
            </span>
          </div>

          {/* Network / Deadzone Simulator Button */}
          <button
            onClick={() => setIsSimulatingOffline((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
              effectiveOnline
                ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                : 'bg-red-950/60 text-red-300 border-red-500/50 shadow-inner'
            }`}
          >
            {effectiveOnline ? (
              <>
                <Wifi className="h-3.5 w-3.5 text-emerald-400" />
                <span>Simulate Deadzone</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5 text-red-400" />
                <span>Offline Active (Nano Only)</span>
              </>
            )}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition"
            title="Firebase Config & App Check Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
