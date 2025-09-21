export type Page = string;

export interface ImageDetectionResult {
  classification: 'AI-generated' | 'Authentic' | 'Uncertain';
  confidence: number;
  explanation: string;
}

export interface CallFraudAnalysisResult {
  classification: 'AI-Generated Voice' | 'Human Voice' | 'Uncertain';
  keywordsFound: string[];
  fraudAssessment: 'Fraudulent Call' | 'Safe Call' | 'Uncertain';
  confidence: number;
  explanation: string;
}

export interface AiVoiceDetectionResult {
  classification: 'AI-Generated Voice' | 'Human Voice' | 'Uncertain';
  confidence: number;
  explanation: string;
}

export interface ArticleAnalysisResult {
  riskLevel: 'Low' | 'Medium' | 'High';
  credibilityScore: number;
  tags: string[];
  summary: string;
  claims: { claim: string; verification: string }[];
}

export interface SmsAnalysisResult {
  classification: 'safe' | 'fraud';
  explanation: string;
}

export interface UserHistoryItem {
  id: string;
  type: 'image' | 'article' | 'voice' | 'sms' | 'aivoice';
  query: string;
  result: string;
  timestamp: string;
}

export interface User {
  name: string;
  email: string;
  profileImageUrl: string | null;
}