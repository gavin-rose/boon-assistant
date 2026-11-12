export type InferenceSourceType = 'on_device' | 'in_cloud' | 'simulated';

export interface JargonEntry {
  term: string;
  definition: string;
}

export interface SessionData {
  id: string;
  title: string;
  speaker: string;
  room?: string;
  track?: string;
  timestamp: number;
  rawNotes: string;
  structuredNotes?: {
    takeaways: string[];
    jargonGlossary: JargonEntry[];
    qaQuestions: string[];
  };
  inferenceSource?: InferenceSourceType;
  latencyMs?: number;
  isProcessing?: boolean;
}

export interface InteractionData {
  id: string;
  contactName: string;
  company: string;
  location?: string;
  timestamp: number;
  rawNotes: string;
  structuredData?: {
    role: string;
    topicsDiscussed: string[];
    dealOrOpportunity: string;
    urgency: 'low' | 'medium' | 'high';
    actionItems: string[];
    missingDetailsAlert: string | null;
  };
  inferenceSource?: InferenceSourceType;
  latencyMs?: number;
  isProcessing?: boolean;
}

export interface FollowUpEmail {
  recipient: string;
  company: string;
  subject: string;
  body: string;
}

export interface SummaryReport {
  id: string;
  generatedAt: number;
  sessionCount: number;
  interactionCount: number;
  executiveBriefing: string;
  keyTrends: string[];
  followUpEmails: FollowUpEmail[];
  actionPlan: string[];
  inferenceSource: InferenceSourceType;
  latencyMs?: number;
}
