import React, { useState } from 'react';
import { Mic, MicOff, Plus, Sparkles, Users, Zap, AlertTriangle, CheckCircle2, Trash2 } from 'lucide-react';
import { InteractionData } from '../types';
import { parseInteractionNotesWithAI } from '../services/aiService';

interface InteractionsTabProps {
  interactions: InteractionData[];
  onAddInteraction: (interaction: InteractionData) => void;
  onDeleteInteraction: (id: string) => void;
  isOffline: boolean;
}

export const InteractionsTab: React.FC<InteractionsTabProps> = ({
  interactions,
  onAddInteraction,
  onDeleteInteraction,
  isOffline
}) => {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [contactName, setContactName] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
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
    setContactName('Marcus Vance');
    setCompany('VectorStream Cloud');
    setLocation('Booth 614 (Hall B)');
    setRawNotes(
      'Met Marcus at their booth. They offer real-time CDC postgres streaming with sub-50ms latency. Quoted team pricing starting at $650/mo. Marcus said they are eager to do a proof of concept pilot with us next month if we can pass security audit. Need to find out if they support private VPC peering in us-east-1. Forgot to grab his personal direct email or phone number!'
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawNotes.trim()) return;

    setIsProcessing(true);
    try {
      const result = await parseInteractionNotesWithAI(
        rawNotes,
        contactName || 'Met at booth',
        company || 'Company',
        isOffline
      );

      const newInteraction: InteractionData = {
        id: `interaction-${Date.now()}`,
        contactName: contactName || 'Booth Contact',
        company: company || 'Vendor Partner',
        location: location || 'Expo Floor',
        timestamp: Date.now(),
        rawNotes,
        structuredData: {
          role: result.role,
          topicsDiscussed: result.topicsDiscussed,
          dealOrOpportunity: result.dealOrOpportunity,
          urgency: result.urgency,
          actionItems: result.actionItems,
          missingDetailsAlert: result.missingDetailsAlert
        },
        inferenceSource: result.source,
        latencyMs: result.latencyMs
      };

      onAddInteraction(newInteraction);
      setContactName('');
      setCompany('');
      setLocation('');
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
            <Users className="h-5 w-5 text-indigo-400" />
            Booth Visits & 1-on-1 Interactions
          </h2>
          <p className="text-xs text-slate-400">
            Log quick notes after walking away from a booth. Gemini Nano structures lead details, assigns urgency, and warns if you forgot their email before you walk away.
          </p>
        </div>

        <button
          onClick={() => setIsOpenForm(!isOpenForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs text-white shadow-lg shadow-indigo-600/30 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Interaction</span>
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
              On-Device Lead Triage (Gemini Nano)
            </span>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Load Sample Booth Chat
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-400">Contact Person</label>
              <input
                type="text"
                placeholder="e.g. Marcus Vance"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Company / Organization</label>
              <input
                type="text"
                placeholder="e.g. VectorStream Cloud"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Booth / Hall Location</label>
              <input
                type="text"
                placeholder="e.g. Booth 614 (Hall B)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-400">
                Conversation Notes / Dictation
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
              placeholder="What did you discuss? Mention pricing, feature requirements, POC interest, or next steps..."
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
                  <span>Structuring on Device...</span>
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

      {/* Interactions List */}
      {interactions.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <Users className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No interaction records yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Click "New Interaction" or load the sample booth chat to see on-device lead structuring.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {interactions.map((it) => (
            <div
              key={it.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-white">{it.contactName}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {it.company}
                    </span>
                    {it.structuredData?.urgency && (
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          it.structuredData.urgency === 'high'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : it.structuredData.urgency === 'medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {it.structuredData.urgency} Urgency
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span>{it.location}</span>
                    <span>•</span>
                    <span className="text-slate-300">{it.structuredData?.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-mono flex items-center gap-1.5 border ${
                      it.inferenceSource === 'on_device'
                        ? 'bg-amber-950/40 text-amber-300 border-amber-600/30'
                        : 'bg-emerald-950/40 text-emerald-300 border-emerald-600/30'
                    }`}
                  >
                    <Zap className="h-3 w-3 text-amber-400" />
                    <span>
                      {it.inferenceSource === 'on_device' ? '⚡ On-Device' : '☁️ Cloud'}{' '}
                      [{it.latencyMs}ms]
                    </span>
                  </span>

                  <button
                    onClick={() => onDeleteInteraction(it.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition"
                    title="Delete interaction"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Missing Details Alert Banner (The on-the-spot triage reminder) */}
              {it.structuredData?.missingDetailsAlert && (
                <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-300">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">On-Site Attention Required:</span>
                    <span>{it.structuredData.missingDetailsAlert}</span>
                  </div>
                </div>
              )}

              {/* Deal / Opportunity Summary */}
              {it.structuredData?.dealOrOpportunity && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Opportunity / Deal Potential
                  </h4>
                  <p className="text-xs text-slate-200 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                    {it.structuredData.dealOrOpportunity}
                  </p>
                </div>
              )}

              {/* Topics Discussed */}
              {it.structuredData?.topicsDiscussed && it.structuredData.topicsDiscussed.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Topics Discussed
                  </h4>
                  <ul className="space-y-1">
                    {it.structuredData.topicsDiscussed.map((topic, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Items */}
              {it.structuredData?.actionItems && it.structuredData.actionItems.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Immediate Action Items
                  </h4>
                  <div className="space-y-1">
                    {it.structuredData.actionItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw notes expandable/collapsible */}
              <details className="text-xs text-slate-500 pt-1">
                <summary className="cursor-pointer hover:text-slate-300">View raw conversation notes</summary>
                <p className="mt-2 p-2 bg-slate-950 rounded text-slate-400 font-mono text-[11px] leading-relaxed">
                  {it.rawNotes}
                </p>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
