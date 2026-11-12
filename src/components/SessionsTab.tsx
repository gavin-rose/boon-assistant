import React, { useState } from 'react';
import { Mic, MicOff, Plus, Sparkles, BookOpen, MessageSquare, Zap, Clock, Trash2 } from 'lucide-react';
import { SessionData } from '../types';
import { parseSessionNotesWithAI } from '../services/aiService';

interface SessionsTabProps {
  sessions: SessionData[];
  onAddSession: (session: SessionData) => void;
  onDeleteSession: (id: string) => void;
  isOffline: boolean;
}

export const SessionsTab: React.FC<SessionsTabProps> = ({
  sessions,
  onAddSession,
  onDeleteSession,
  isOffline
}) => {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [title, setTitle] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [room, setRoom] = useState('');
  const [rawNotes, setRawNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Web Speech API for voice dictation
  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition isn't supported in this browser. Please type directly.");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setRawNotes((prev) => (prev ? prev + ' ' : '') + currentTranscript);
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  };

  const handleLoadSample = () => {
    setTitle('Keynote: The Architecture of Local-First Intelligent Systems');
    setSpeaker('Dr. Elena Rostova (Chief Scientist, EdgeCompute Labs)');
    setRoom('Grand Hall A');
    setRawNotes(
      'Speaker discusses shifting inference loads away from high-latency centralized clusters down to edge client devices using eBPF and CRDT primitives for zero-conflict state reconciliation. Highlights that WebAssembly (WASM) and Gemini Nano allow web apps to parse tokens in under 40 milliseconds without touching external APIs. Emphasized that data privacy and SOC2 compliance will mandate local scrubbing before any RAG vector pipeline transmits data to cloud backends.'
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawNotes.trim()) return;

    setIsProcessing(true);
    try {
      const result = await parseSessionNotesWithAI(
        rawNotes,
        title || 'General Session',
        speaker || 'Speaker',
        isOffline
      );

      const newSession: SessionData = {
        id: `session-${Date.now()}`,
        title: title || 'Untitled Session',
        speaker: speaker || 'Keynote Speaker',
        room: room || 'Hall B',
        timestamp: Date.now(),
        rawNotes,
        structuredNotes: {
          takeaways: result.takeaways,
          jargonGlossary: result.jargonGlossary,
          qaQuestions: result.qaQuestions
        },
        inferenceSource: result.source,
        latencyMs: result.latencyMs
      };

      onAddSession(newSession);
      setTitle('');
      setSpeaker('');
      setRoom('');
      setRawNotes('');
      setIsOpenForm(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-400" />
            Conference Sessions & Keynotes
          </h2>
          <p className="text-xs text-slate-400">
            Jot down rapid thoughts or dictate live. Gemini Nano structures takeaways, explains jargon, and drafts Q&A microphone questions instantly.
          </p>
        </div>

        <button
          onClick={() => setIsOpenForm(!isOpenForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs text-white shadow-lg shadow-indigo-600/30 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Session Note</span>
        </button>
      </div>

      {/* Creation Form Modal/Card */}
      {isOpenForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 p-5 rounded-2xl border border-indigo-500/30 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top duration-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              On-Device Session Scribe (Gemini Nano)
            </span>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Load Sample Keynote
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-400">Session Title</label>
              <input
                type="text"
                placeholder="e.g. Keynote: Local-First AI"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Speaker / Track</label>
              <input
                type="text"
                placeholder="e.g. Dr. Elena Rostova"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Room / Hall</label>
              <input
                type="text"
                placeholder="e.g. Grand Ballroom A"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-400">
                Raw Notes / Real-Time Thoughts
              </label>
              <button
                type="button"
                onClick={toggleRecording}
                className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 transition ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {isRecording ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                <span>{isRecording ? 'Listening...' : 'Voice Dictate'}</span>
              </button>
            </div>
            <textarea
              rows={4}
              placeholder="Type rough bullets or speak freely. Mention any dense acronyms or concepts you want unpacked..."
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpenForm(false)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing || !rawNotes.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-lg transition"
            >
              {isProcessing ? (
                <>
                  <Zap className="h-4 w-4 animate-spin text-amber-300" />
                  <span>Processing on Device...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 text-amber-300" />
                  <span>Structure with Gemini Nano</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <BookOpen className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No session notes yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Click "New Session Note" or load the sample keynote to see on-device structuring in action.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div>
                  <h3 className="text-base font-bold text-white">{session.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                    <span className="text-indigo-400 font-medium">{session.speaker}</span>
                    <span>•</span>
                    <span>{session.room}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Latency / Model Badge */}
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-mono flex items-center gap-1.5 border ${
                      session.inferenceSource === 'on_device'
                        ? 'bg-amber-950/40 text-amber-300 border-amber-600/30'
                        : 'bg-emerald-950/40 text-emerald-300 border-emerald-600/30'
                    }`}
                  >
                    <Zap className="h-3 w-3 text-amber-400" />
                    <span>
                      {session.inferenceSource === 'on_device' ? '⚡ On-Device' : '☁️ Cloud'}{' '}
                      [{session.latencyMs}ms]
                    </span>
                  </span>

                  <button
                    onClick={() => onDeleteSession(session.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition"
                    title="Delete session"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Takeaways */}
              {session.structuredNotes?.takeaways && session.structuredNotes.takeaways.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Key Actionable Takeaways
                  </h4>
                  <ul className="space-y-1">
                    {session.structuredNotes.takeaways.map((point, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Jargon Glossary */}
              {session.structuredNotes?.jargonGlossary && session.structuredNotes.jargonGlossary.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Live Jargon Glossary (Explained On-Device)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {session.structuredNotes.jargonGlossary.map((j, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                      >
                        <span className="font-semibold text-amber-300 mr-1.5">{j.term}:</span>
                        <span className="text-slate-400">{j.definition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Microphone Q&A Polished Questions */}
              {session.structuredNotes?.qaQuestions && session.structuredNotes.qaQuestions.length > 0 && (
                <div className="bg-slate-950/60 p-3 rounded-xl border border-indigo-950">
                  <h4 className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5 mb-1.5">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Microphone-Ready Q&A Questions
                  </h4>
                  <ul className="space-y-1">
                    {session.structuredNotes.qaQuestions.map((q, idx) => (
                      <li key={idx} className="text-xs text-slate-300 italic">
                        "{q}"
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Raw notes expandable/collapsible */}
              <details className="text-xs text-slate-500 pt-1">
                <summary className="cursor-pointer hover:text-slate-300">View raw notes</summary>
                <p className="mt-2 p-2 bg-slate-950 rounded text-slate-400 font-mono text-[11px] leading-relaxed">
                  {session.rawNotes}
                </p>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
