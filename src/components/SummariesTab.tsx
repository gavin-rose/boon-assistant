import React, { useState } from 'react';
import { Cloud, Sparkles, Copy, Check, Mail, TrendingUp, FileText, CheckSquare, RefreshCw, Info } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cloud className="h-5 w-5 text-emerald-400" />
            Summaries and Follow-Ups
          </h2>
          <p className="text-xs text-zinc-400">
            Correlates all sessions and interactions into strategic debriefs and personalized outreach.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || totalItems === 0}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg border font-medium text-xs transition-all cursor-pointer bg-transparent text-zinc-300 border-zinc-800 hover:text-white hover:border-zinc-700 disabled:opacity-50 shrink-0"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-400" />
              <span>Synthesizing...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>
                {summary ? 'Resynthesize' : 'Synthesize'}
              </span>
            </>
          )}
        </button>
      </div>

      {/* When no data at all */}
      {totalItems === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/40">
          <Cloud className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-300">No session or interaction data yet</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
            Capture at least one session note or interaction before running the cloud synthesis engine.
          </p>
        </div>
      ) : !summary ? (
        /* Data exists, but synthesis hasn't been generated yet */
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Ready to Synthesize {sessions.length} Sessions and {interactions.length} Interactions
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
              Click the button above to synthesize! The cloud engine will identify overarching trends, compose executive briefing memos, and draft tailored follow-up emails.
            </p>
          </div>
        </div>
      ) : (
        /* Render Generated Summary Report */
        <div className="space-y-6">
          {/* Metadata pill bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs">
            <div className="flex items-center gap-3 text-zinc-400">
              <Info className="h-4 w-4" />
              <span>Synthesized: <strong>{summary.sessionCount} Sessions</strong>, <strong>{summary.interactionCount} Interactions</strong> at {new Date(summary.generatedAt).toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Section 1: Executive Briefing Memo */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-400" />
                Debriefing
              </h3>
              <button
                onClick={() => copyToClipboard(summary.executiveBriefing)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg border font-medium text-xs transition-all cursor-pointer bg-transparent text-zinc-300 border-zinc-800 hover:text-white hover:border-zinc-700"
              >
                {copiedMemo ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-zinc-400" />}
                <span>{copiedMemo ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-xs text-zinc-300 leading-relaxed space-y-3 whitespace-pre-line bg-black p-4 rounded-xl border border-zinc-800">
              {summary.executiveBriefing}
            </div>
          </div>

          {/* Section 2: Key Macro Trends */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                Detected Trends
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {summary.keyTrends.map((trend, idx) => (
                <div
                  key={idx}
                  className="bg-black p-4 rounded-xl border border-zinc-800 flex flex-col justify-between"
                >
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                    Trend #{idx + 1}
                  </span>
                  <p className="text-xs text-zinc-200 leading-relaxed">{trend}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Personalized Follow-Up Emails */}
          {summary.followUpEmails && summary.followUpEmails.length > 0 && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emerald-400" />
                  Personalized Follow-Up Outreach
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {summary.followUpEmails.map((email, idx) => (
                  <div
                    key={idx}
                    className="bg-black p-4 rounded-xl border border-zinc-800 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-800">
                        <span className="font-semibold text-white">To: {email.recipient} ({email.company})</span>
                        <button
                          onClick={() => copyToClipboard(`Subject: ${email.subject}\n\n${email.body}`, idx)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg border font-medium text-xs transition-all cursor-pointer bg-transparent text-zinc-300 border-zinc-800 hover:text-white hover:border-zinc-700"
                        >
                          {copiedIndex === idx ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 text-zinc-400" />
                          )}
                          <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-xs font-medium text-zinc-300 mt-2">
                        <span className="text-zinc-500">Subject: </span>
                        {email.subject}
                      </p>
                      <p className="text-xs text-zinc-400 mt-2 whitespace-pre-line leading-relaxed bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
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
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-emerald-400" />
                  Post-Event Action Plan
                </h3>
              </div>
              <div className="space-y-2">
                {summary.actionPlan.map((action, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-black p-3 rounded-xl border border-zinc-800 text-xs text-zinc-200"
                  >
                    <span className="h-5 w-5 rounded-full bg-emerald-950/40 text-emerald-400 font-bold flex items-center justify-center shrink-0 border border-emerald-600/30">
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
