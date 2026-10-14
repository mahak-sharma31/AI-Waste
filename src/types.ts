export type WasteCategory =
  | 'plastic'
  | 'paper'
  | 'metal'
  | 'organic'
  | 'glass'
  | 'e-waste'
  | 'hazardous';

export interface EcoDecisionInfo {
  title: string;
  disposal: string[];
  preparation: string[];
  reuse: string[];
  recycling: string;
  safety: string;
}

export interface AnalysisAlternative {
  className: string;
  probability: number;
}

export interface UpcycleIdea {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  materialsNeeded?: string[];
  estTime?: string;
}

export interface AnalysisResult {
  id: string;
  itemName: string;
  category: WasteCategory;
  categoryLabel: string;
  materialDetail: string;
  confidence: number;
  lowConfidence: boolean;
  alternatives: AnalysisAlternative[];
  cleanlinessStatus: string;
  decompositionTime: string;
  co2DivertedKg: number;
  ecoDecision: EcoDecisionInfo;
  upcycleIdea?: UpcycleIdea;
  previewUrl: string;
  timestamp: number;
  timeFormatted: string;
  engineUsed: 'gemini' | 'local-ai';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explain: string;
  category: WasteCategory | 'general';
  difficulty: 'Beginner' | 'Intermediate' | 'Pro';
}

export interface QuizRecord {
  score: number;
  total: number;
  percent: number;
  time: string;
  timestamp: number;
}

export interface ResinCode {
  code: number;
  symbol: string;
  acronym: string;
  fullName: string;
  recyclable: boolean;
  recyclabilityLevel: 'Widely Recycled' | 'Limited Recycled' | 'Rarely / Specialist';
  commonProducts: string[];
  safeForReuse: boolean;
  notes: string;
  safetyBadge: 'Food Safe' | 'Avoid Hot Food' | 'Caution' | 'Hazardous';
}

export interface UpcycleProject {
  id: string;
  title: string;
  category: WasteCategory;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  time: string;
  description: string;
  materials: string[];
  steps: string[];
  ecoBenefit: string;
}
