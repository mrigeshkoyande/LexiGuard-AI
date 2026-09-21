import { z } from 'zod';

// ============================================================================
// Legal Disclaimer Constant
// ============================================================================
export const LEGAL_DISCLAIMER =
  'LexiGuard AI provides general legal information and document analysis. It does not provide legal advice or replace a qualified legal professional.';

// ============================================================================
// Severity and Categories
// ============================================================================
export const SeverityEnum = z.enum(['Informational', 'Review', 'Important']);
export type Severity = z.infer<typeof SeverityEnum>;

export const FindingCategoryEnum = z.enum([
  'importantClauses',
  'obligations',
  'deadlines',
  'monetaryTerms',
  'terminationTerms',
  'renewalTerms',
  'potentialConcerns'
]);
export type FindingCategory = z.infer<typeof FindingCategoryEnum>;

// ============================================================================
// Document Structure
// ============================================================================
export interface DocumentClause {
  id: string;
  number: string;
  title: string;
  text: string;
  page: number;
  startOffset: number;
  endOffset: number;
}

export interface DocumentSection {
  id: string;
  title: string;
  clauses: DocumentClause[];
}

export interface DocumentStructure {
  sections: DocumentSection[];
}

// ============================================================================
// AI Finding Item Schema
// ============================================================================
export const FindingItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  severity: SeverityEnum,
  explanation: z.string(),
  whyItMatters: z.string(),
  sourceClauseId: z.string(),
  pageNumber: z.number().int().min(1),
  confidence: z.number().min(0).max(1).default(0.9)
});

export type FindingItem = z.infer<typeof FindingItemSchema>;

// ============================================================================
// Full Analysis Schema
// ============================================================================
export const AnalysisResultSchema = z.object({
  summary: z.string(),
  documentType: z.string(),
  importantClauses: z.array(FindingItemSchema),
  obligations: z.array(FindingItemSchema),
  deadlines: z.array(FindingItemSchema),
  monetaryTerms: z.array(FindingItemSchema),
  terminationTerms: z.array(FindingItemSchema),
  renewalTerms: z.array(FindingItemSchema),
  potentialConcerns: z.array(FindingItemSchema),
  missingInformation: z.array(z.string())
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

// ============================================================================
// Q&A Models
// ============================================================================
export interface QuestionRequest {
  question: string;
}

export interface QuestionResponse {
  id?: string;
  question: string;
  answer: string;
  sourceClauseIds: string[];
  pageNumber?: number;
  confidence: number;
  isDeclinedAdvice: boolean;
  matchedClauses?: {
    id: string;
    title: string;
    number: string;
    text: string;
    page: number;
  }[];
}

// ============================================================================
// Comparison Models
// ============================================================================
export type ComparisonType = 'added' | 'removed' | 'modified';

export const ComparisonRecordSchema = z.object({
  type: z.enum(['added', 'removed', 'modified']),
  category: z.string(),
  before: z.string().nullable(),
  after: z.string().nullable(),
  summary: z.string(),
  sourceA: z.string().nullable(),
  sourceB: z.string().nullable()
});

export type ComparisonRecord = z.infer<typeof ComparisonRecordSchema>;

export interface ComparisonResult {
  id?: string;
  docAId: string;
  docBId: string;
  docATitle: string;
  docBTitle: string;
  records: ComparisonRecord[];
  summary: string;
  createdAt?: string;
}

// ============================================================================
// Action Brief Models
// ============================================================================
export interface ActionItemRecord {
  id: string;
  documentId: string;
  userId: string;
  category:
    | 'Document Overview'
    | 'Important Obligations'
    | 'Important Dates'
    | 'Financial Terms'
    | 'Review Areas'
    | 'Questions to Consider'
    | 'Questions for a Lawyer';
  title: string;
  description: string;
  isCompleted: boolean;
  sourceClauseId?: string | null;
  priority: 'High' | 'Medium' | 'Low';
  createdAt?: string;
}

export interface ActionBrief {
  documentId: string;
  documentTitle: string;
  items: ActionItemRecord[];
  summary: string;
}

// ============================================================================
// User & Auth Models
// ============================================================================
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  user: UserProfile;
  token?: string;
}

// ============================================================================
// Document Metadata
// ============================================================================
export interface DocumentSummary {
  id: string;
  userId: string;
  title: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  pageCount: number;
  status: 'PENDING' | 'PROCESSING' | 'ANALYZED' | 'ERROR';
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
  analysisSummary?: string;
  documentType?: string;
  findingCount?: number;
}
