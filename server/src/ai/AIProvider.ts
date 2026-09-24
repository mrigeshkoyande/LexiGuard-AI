import {
  AnalysisResult,
  ComparisonRecord,
  DocumentClause,
  DocumentStructure,
  QuestionSource,
  SupportStatus
} from '@lexiguard/shared';

export interface AIQuestionResult {
  answer: string;
  status?: SupportStatus;
  sources?: QuestionSource[];
  sourceClauseIds: string[];
  confidence: number;
  limitation?: string;
  nextStep?: string;
}

export interface AIComparisonResult {
  summary: string;
  records: ComparisonRecord[];
}

export interface AIProvider {
  analyzeDocument(doc: DocumentStructure): Promise<AnalysisResult>;
  answerQuestion(
    question: string,
    contextClauses: DocumentClause[],
    allClauses: DocumentClause[]
  ): Promise<AIQuestionResult>;
  compareDocuments(
    docA: DocumentStructure,
    docB: DocumentStructure
  ): Promise<AIComparisonResult>;
}
