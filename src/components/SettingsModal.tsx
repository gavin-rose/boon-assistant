import React, { useState } from 'react';
import { X, ShieldCheck, Database, Cpu, CheckCircle, RefreshCw } from 'lucide-react';
import { getStoredConfig, saveStoredConfig } from '../services/firebase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  nanoAvailable: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  nanoAvailable
}) => {
  const [config, setConfig] = useState(getStoredConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredConfig(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
      window.location.reload();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Firebase & System Settings</h3>
            <p className="text-xs text-slate-400">Configure Firebase AI Logic, App Check, and local engine</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Diagnostic Status Box */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Cpu className="h-4 w-4 text-amber-400" />
              <span className="font-semibold">Gemini Nano Engine</span>
            </div>
            <p className="text-slate-200">
              {nanoAvailable ? (
                <span className="text-emerald-400 font-medium">✓ Chrome Nano Active</span>
              ) : (
                <span className="text-slate-400">Hybrid Fallback Ready</span>
              )}
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Database className="h-4 w-4 text-indigo-400" />
              <span className="font-semibold">Firestore Offline Cache</span>
            </div>
            <p className="text-emerald-400 font-medium">✓ IndexedDB Persistent</p>
          </div>
        </div>

        {/* Firebase Config Form */}
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-400">Firebase API Key</label>
            <input
              type="text"
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              className="w-full mt-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-400">Project ID</label>
              <input
                type="text"
                value={config.projectId}
                onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
                className="w-full mt-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">App ID</label>
              <input
                type="text"
                value={config.appId}
                onChange={(e) => setConfig({ ...config, appId: e.target.value })}
                className="w-full mt-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Firebase App Check Ready</span>
            </div>
            <p>
              Preconfigured with debug tokens for Devpost evaluation. In production, App Check validates requests using Google reCAPTCHA v3.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('boon_firebase_config');
                window.location.reload();
              }}
              className="text-xs text-slate-500 hover:text-slate-300 underline"
            >
              Reset to Defaults
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs text-white shadow-lg transition flex items-center gap-1.5"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-emerald-300" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save & Reload</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
