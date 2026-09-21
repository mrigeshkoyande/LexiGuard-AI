import {
  AnalysisResult,
  ComparisonRecord,
  DocumentClause,
  DocumentStructure
} from '@lexiguard/shared';

export interface AIQuestionResult {
  answer: string;
  sourceClauseIds: string[];
  confidence: number;
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
