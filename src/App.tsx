import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SessionsTab } from './components/SessionsTab';
import { InteractionsTab } from './components/InteractionsTab';
import { SummariesTab } from './components/SummariesTab';
import { SettingsModal } from './components/SettingsModal';
import { SessionData, InteractionData, SummaryReport } from './types';
import { checkOnDeviceNanoAvailability } from './services/aiService';
import { initFirebase } from './services/firebase';
import { BookOpen, Users, Cloud } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'sessions' | 'interactions' | 'summaries'>('sessions');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSimulatingOffline, setIsSimulatingOffline] = useState(false);
  const [nanoAvailable, setNanoAvailable] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Core state: Sessions, Interactions, Summaries
  const [sessions, setSessions] = useState<SessionData[]>(() => {
    try {
      const saved = localStorage.getItem('boon_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [interactions, setInteractions] = useState<InteractionData[]>(() => {
    try {
      const saved = localStorage.getItem('boon_interactions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [summary, setSummary] = useState<SummaryReport | null>(() => {
    try {
      const saved = localStorage.getItem('boon_summary');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('boon_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('boon_interactions', JSON.stringify(interactions));
  }, [interactions]);

  useEffect(() => {
    if (summary) {
      localStorage.setItem('boon_summary', JSON.stringify(summary));
    }
  }, [summary]);

  // Online / Offline and Nano capability detection
  useEffect(() => {
    initFirebase();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    checkOnDeviceNanoAvailability().then((res) => {
      setNanoAvailable(res.available);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleAddSession = (session: SessionData) => {
    setSessions((prev) => [session, ...prev]);
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddInteraction = (interaction: InteractionData) => {
    setInteractions((prev) => [interaction, ...prev]);
  };

  const handleDeleteInteraction = (id: string) => {
    setInteractions((prev) => prev.filter((it) => it.id !== id));
  };

  const effectiveOffline = !isOnline || isSimulatingOffline;

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans">
      <Header
        isSimulatingOffline={isSimulatingOffline}
        setIsSimulatingOffline={setIsSimulatingOffline}
        isOnline={isOnline}
        nanoAvailable={nanoAvailable}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-800 space-x-1 sm:space-x-4">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition cursor-pointer ${
              activeTab === 'sessions'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Sessions</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300">
              {sessions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('interactions')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition cursor-pointer ${
              activeTab === 'interactions'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Interactions</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300">
              {interactions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('summaries')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition cursor-pointer ${
              activeTab === 'summaries'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cloud className="h-4 w-4" />
            <span>Summaries</span>
            {summary && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] bg-emerald-950/40 text-emerald-300 border border-emerald-600/30">
                Ready
              </span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'sessions' && (
          <SessionsTab
            sessions={sessions}
            onAddSession={handleAddSession}
            onDeleteSession={handleDeleteSession}
            isOffline={effectiveOffline}
          />
        )}

        {activeTab === 'interactions' && (
          <InteractionsTab
            interactions={interactions}
            onAddInteraction={handleAddInteraction}
            onDeleteInteraction={handleDeleteInteraction}
            isOffline={effectiveOffline}
          />
        )}

        {activeTab === 'summaries' && (
          <SummariesTab
            sessions={sessions}
            interactions={interactions}
            summary={summary}
            onSetSummary={setSummary}
            isOffline={effectiveOffline}
          />
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        nanoAvailable={nanoAvailable}
      />
    </div>
  );
}
export default App;
