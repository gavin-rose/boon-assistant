import React, { useState } from 'react';
import { Cloud, Sparkles, Copy, Check, Mail, TrendingUp, FileText, CheckSquare, Zap, RefreshCw } from 'lucide-react';
import { SessionData, InteractionData, SummaryReport } from '../types';
import { generateCloudSummaryReport } from '../services/aiService';

interface SummariesTabProps {
  sessions: SessionData[];
  interactions: InteractionData[];
  summary: SummaryReport | null;
  onSetSummary: (summary: SummaryReport) => void;
  isOffline: boolean;
}

export const SummariesTab: React.FC<SummariesTabProps> = ({
  sessions,
  interactions,
  summary,
  onSetSummary,
  isOffline
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedMemo, setCopiedMemo] = useState(false);

  const totalItems = sessions.length + interactions.length;

  const handleGenerate = async () => {
    if (totalItems === 0) return;
    setIsGenerating(true);
    try {
      const report = await generateCloudSummaryReport(sessions, interactions);
      onSetSummary(report);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text);
    if (index !== undefined) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      setCopiedMemo(true);
      setTimeout(() => setCopiedMemo(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cloud className="h-5 w-5 text-indigo-400" />
            Executive Synthesis & Follow-Ups
          </h2>
          <p className="text-xs text-slate-400">
            Powered by Firebase AI Logic Cloud. Cross-correlates all {sessions.length} sessions and {interactions.length} interactions into strategic debriefs and personalized outreach.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || totalItems === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 font-semibold text-xs text-white shadow-xl shadow-indigo-600/30 transition cursor-pointer"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin text-white" />
              <span>Generating Cloud Synthesis...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>
                {summary ? 'Regenerate Cloud Synthesis' : 'Generate Cloud Synthesis'}
              </span>
            </>
          )}
        </button>
      </div>

      {/* When no data at all */}
      {totalItems === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <Cloud className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No session or interaction data yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Capture at least one session note or interaction before running the cloud synthesis engine.
          </p>
        </div>
      ) : !summary ? (
        /* Data exists, but synthesis hasn't been generated yet */
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Ready to Synthesize {sessions.length} Sessions & {interactions.length} Interactions
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Click the button above to trigger Firebase AI Logic's Cloud inference. The cloud engine will identify overarching trends, compose executive briefing memos, and draft tailored follow-up emails.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg transition"
          >
            <Cloud className="h-4 w-4" />
            <span>Launch Cloud Synthesis Engine</span>
          </button>
        </div>
      ) : (
        /* Render Generated Summary Report */
        <div className="space-y-6">
          {/* Metadata pill bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-3 text-slate-400">
              <span>Synthesized: <strong>{summary.sessionCount} Sessions</strong>, <strong>{summary.interactionCount} Interactions</strong></span>
              <span>•</span>
              <span>{new Date(summary.generatedAt).toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full font-mono flex items-center gap-1.5 border bg-emerald-950/40 text-emerald-300 border-emerald-600/30">
                <Cloud className="h-3 w-3 text-emerald-400" />
                <span>☁️ Firebase AI Logic Cloud [{summary.latencyMs}ms]</span>
              </span>
            </div>
          </div>

          {/* Section 1: Executive Briefing Memo */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-400" />
                Executive Trip ROI & Debrief Memo
              </h3>
              <button
                onClick={() => copyToClipboard(summary.executiveBriefing)}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition"
              >
                {copiedMemo ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedMemo ? 'Copied Memo' : 'Copy Memo'}</span>
              </button>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed space-y-3 whitespace-pre-line bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 font-serif">
              {summary.executiveBriefing}
            </div>
          </div>

          {/* Section 2: Key Macro Trends */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-400" />
                Detected Cross-Session Industry Trends
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {summary.keyTrends.map((trend, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between"
                >
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-2">
                    Trend #{idx + 1}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">{trend}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Personalized Follow-Up Emails */}
          {summary.followUpEmails && summary.followUpEmails.length > 0 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emerald-400" />
                  Personalized Follow-Up Outreach
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {summary.followUpEmails.map((email, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
                        <span className="font-semibold text-white">To: {email.recipient} ({email.company})</span>
                        <button
                          onClick={() => copyToClipboard(`Subject: ${email.subject}\n\n${email.body}`, idx)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          {copiedIndex === idx ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-xs font-medium text-slate-300 mt-2">
                        <span className="text-slate-500">Subject: </span>
                        {email.subject}
                      </p>
                      <p className="text-xs text-slate-400 mt-2 whitespace-pre-line leading-relaxed bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/50">
                        {email.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Action Plan Checklist */}
          {summary.actionPlan && summary.actionPlan.length > 0 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-indigo-400" />
                  Post-Event Action Plan
                </h3>
              </div>
              <div className="space-y-2">
                {summary.actionPlan.map((action, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-200"
                  >
                    <span className="h-5 w-5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold flex items-center justify-center shrink-0 border border-indigo-500/20">
                      {idx + 1}
                    </span>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
