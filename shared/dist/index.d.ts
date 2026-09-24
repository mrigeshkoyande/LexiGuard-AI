import { z } from 'zod';
export declare const LEGAL_DISCLAIMER = "LexiGuard AI provides general legal information and document analysis. It does not provide legal advice or replace a qualified legal professional.";
export declare const SeverityEnum: z.ZodEnum<["Informational", "Review", "Important"]>;
export type Severity = z.infer<typeof SeverityEnum>;
export declare const FindingCategoryEnum: z.ZodEnum<["importantClauses", "obligations", "deadlines", "monetaryTerms", "terminationTerms", "renewalTerms", "potentialConcerns"]>;
export type FindingCategory = z.infer<typeof FindingCategoryEnum>;
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
export declare const SupportStatusEnum: z.ZodEnum<["SUPPORTED", "PARTIALLY_SUPPORTED", "INSUFFICIENT_EVIDENCE", "CONTRADICTORY_EVIDENCE", "PARTIALLY SUPPORTED", "INSUFFICIENT EVIDENCE"]>;
export type SupportStatus = z.infer<typeof SupportStatusEnum>;
export declare const FindingItemSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    category: z.ZodString;
    severity: z.ZodEnum<["Informational", "Review", "Important"]>;
    explanation: z.ZodString;
    whyItMatters: z.ZodString;
    sourceClauseId: z.ZodString;
    pageNumber: z.ZodNumber;
    confidence: z.ZodDefault<z.ZodNumber>;
    supportStatus: z.ZodDefault<z.ZodEnum<["SUPPORTED", "PARTIALLY_SUPPORTED", "INSUFFICIENT_EVIDENCE", "CONTRADICTORY_EVIDENCE", "PARTIALLY SUPPORTED", "INSUFFICIENT EVIDENCE"]>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    category: string;
    severity: "Informational" | "Review" | "Important";
    explanation: string;
    whyItMatters: string;
    sourceClauseId: string;
    pageNumber: number;
    confidence: number;
    supportStatus: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE";
}, {
    id: string;
    title: string;
    category: string;
    severity: "Informational" | "Review" | "Important";
    explanation: string;
    whyItMatters: string;
    sourceClauseId: string;
    pageNumber: number;
    confidence?: number | undefined;
    supportStatus?: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE" | undefined;
}>;
export type FindingItem = z.infer<typeof FindingItemSchema>;
export declare const AnalysisResultSchema: z.ZodObject<{
    summary: z.ZodString;
    documentType: z.ZodString;
    importantClauses: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        category: z.ZodString;
        severity: z.ZodEnum<["Informational", "Review", "Important"]>;
        explanation: z.ZodString;
        whyItMatters: z.ZodString;
        sourceClauseId: z.ZodString;
        pageNumber: z.ZodNumber;
        confidence: z.ZodDefault<z.ZodNumber>;
        supportStatus: z.ZodDefault<z.ZodEnum<["SUPPORTED", "PARTIALLY_SUPPORTED", "INSUFFICIENT_EVIDENCE", "CONTRADICTORY_EVIDENCE", "PARTIALLY SUPPORTED", "INSUFFICIENT EVIDENCE"]>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence: number;
        supportStatus: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE";
    }, {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence?: number | undefined;
        supportStatus?: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE" | undefined;
    }>, "many">;
    obligations: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        category: z.ZodString;
        severity: z.ZodEnum<["Informational", "Review", "Important"]>;
        explanation: z.ZodString;
        whyItMatters: z.ZodString;
        sourceClauseId: z.ZodString;
        pageNumber: z.ZodNumber;
        confidence: z.ZodDefault<z.ZodNumber>;
        supportStatus: z.ZodDefault<z.ZodEnum<["SUPPORTED", "PARTIALLY_SUPPORTED", "INSUFFICIENT_EVIDENCE", "CONTRADICTORY_EVIDENCE", "PARTIALLY SUPPORTED", "INSUFFICIENT EVIDENCE"]>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence: number;
        supportStatus: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE";
    }, {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence?: number | undefined;
        supportStatus?: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE" | undefined;
    }>, "many">;
    deadlines: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        category: z.ZodString;
        severity: z.ZodEnum<["Informational", "Review", "Important"]>;
        explanation: z.ZodString;
        whyItMatters: z.ZodString;
        sourceClauseId: z.ZodString;
        pageNumber: z.ZodNumber;
        confidence: z.ZodDefault<z.ZodNumber>;
        supportStatus: z.ZodDefault<z.ZodEnum<["SUPPORTED", "PARTIALLY_SUPPORTED", "INSUFFICIENT_EVIDENCE", "CONTRADICTORY_EVIDENCE", "PARTIALLY SUPPORTED", "INSUFFICIENT EVIDENCE"]>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence: number;
        supportStatus: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE";
    }, {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence?: number | undefined;
        supportStatus?: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE" | undefined;
    }>, "many">;
    monetaryTerms: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        category: z.ZodString;
        severity: z.ZodEnum<["Informational", "Review", "Important"]>;
        explanation: z.ZodString;
        whyItMatters: z.ZodString;
        sourceClauseId: z.ZodString;
        pageNumber: z.ZodNumber;
        confidence: z.ZodDefault<z.ZodNumber>;
        supportStatus: z.ZodDefault<z.ZodEnum<["SUPPORTED", "PARTIALLY_SUPPORTED", "INSUFFICIENT_EVIDENCE", "CONTRADICTORY_EVIDENCE", "PARTIALLY SUPPORTED", "INSUFFICIENT EVIDENCE"]>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence: number;
        supportStatus: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE";
    }, {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence?: number | undefined;
        supportStatus?: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE" | undefined;
    }>, "many">;
    terminationTerms: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        category: z.ZodString;
        severity: z.ZodEnum<["Informational", "Review", "Important"]>;
        explanation: z.ZodString;
        whyItMatters: z.ZodString;
        sourceClauseId: z.ZodString;
        pageNumber: z.ZodNumber;
        confidence: z.ZodDefault<z.ZodNumber>;
        supportStatus: z.ZodDefault<z.ZodEnum<["SUPPORTED", "PARTIALLY_SUPPORTED", "INSUFFICIENT_EVIDENCE", "CONTRADICTORY_EVIDENCE", "PARTIALLY SUPPORTED", "INSUFFICIENT EVIDENCE"]>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence: number;
        supportStatus: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE";
    }, {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence?: number | undefined;
        supportStatus?: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE" | undefined;
    }>, "many">;
    renewalTerms: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        category: z.ZodString;
        severity: z.ZodEnum<["Informational", "Review", "Important"]>;
        explanation: z.ZodString;
        whyItMatters: z.ZodString;
        sourceClauseId: z.ZodString;
        pageNumber: z.ZodNumber;
        confidence: z.ZodDefault<z.ZodNumber>;
        supportStatus: z.ZodDefault<z.ZodEnum<["SUPPORTED", "PARTIALLY_SUPPORTED", "INSUFFICIENT_EVIDENCE", "CONTRADICTORY_EVIDENCE", "PARTIALLY SUPPORTED", "INSUFFICIENT EVIDENCE"]>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence: number;
        supportStatus: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE";
    }, {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence?: number | undefined;
        supportStatus?: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE" | undefined;
    }>, "many">;
    potentialConcerns: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        category: z.ZodString;
        severity: z.ZodEnum<["Informational", "Review", "Important"]>;
        explanation: z.ZodString;
        whyItMatters: z.ZodString;
        sourceClauseId: z.ZodString;
        pageNumber: z.ZodNumber;
        confidence: z.ZodDefault<z.ZodNumber>;
        supportStatus: z.ZodDefault<z.ZodEnum<["SUPPORTED", "PARTIALLY_SUPPORTED", "INSUFFICIENT_EVIDENCE", "CONTRADICTORY_EVIDENCE", "PARTIALLY SUPPORTED", "INSUFFICIENT EVIDENCE"]>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence: number;
        supportStatus: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE";
    }, {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence?: number | undefined;
        supportStatus?: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE" | undefined;
    }>, "many">;
    missingInformation: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    importantClauses: {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence: number;
        supportStatus: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE";
    }[];
    obligations: {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence: number;
        supportStatus: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE";
    }[];
    deadlines: {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence: number;
        supportStatus: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE";
    }[];
    monetaryTerms: {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence: number;
        supportStatus: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE";
    }[];
    terminationTerms: {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence: number;
        supportStatus: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE";
    }[];
    renewalTerms: {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence: number;
        supportStatus: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE";
    }[];
    potentialConcerns: {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence: number;
        supportStatus: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE";
    }[];
    summary: string;
    documentType: string;
    missingInformation: string[];
}, {
    importantClauses: {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence?: number | undefined;
        supportStatus?: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE" | undefined;
    }[];
    obligations: {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence?: number | undefined;
        supportStatus?: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE" | undefined;
    }[];
    deadlines: {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence?: number | undefined;
        supportStatus?: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE" | undefined;
    }[];
    monetaryTerms: {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence?: number | undefined;
        supportStatus?: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE" | undefined;
    }[];
    terminationTerms: {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence?: number | undefined;
        supportStatus?: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE" | undefined;
    }[];
    renewalTerms: {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence?: number | undefined;
        supportStatus?: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE" | undefined;
    }[];
    potentialConcerns: {
        id: string;
        title: string;
        category: string;
        severity: "Informational" | "Review" | "Important";
        explanation: string;
        whyItMatters: string;
        sourceClauseId: string;
        pageNumber: number;
        confidence?: number | undefined;
        supportStatus?: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_EVIDENCE" | "CONTRADICTORY_EVIDENCE" | "PARTIALLY SUPPORTED" | "INSUFFICIENT EVIDENCE" | undefined;
    }[];
    summary: string;
    documentType: string;
    missingInformation: string[];
}>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
export interface QuestionRequest {
    question: string;
}
export interface QuestionSource {
    sourceClauseId: string;
    page: number;
    excerpt: string;
    clauseTitle?: string;
    clauseNumber?: string;
}
export interface QuestionResponse {
    id?: string;
    question: string;
    answer: string;
    status?: SupportStatus;
    supportStatus: SupportStatus;
    sources?: QuestionSource[];
    sourceClauseIds: string[];
    pageNumber?: number;
    confidence: number;
    limitation?: string;
    nextStep?: string;
    isDeclinedAdvice: boolean;
    matchedClauses?: {
        id: string;
        title: string;
        number: string;
        text: string;
        page: number;
    }[];
}
export type ComparisonType = 'added' | 'removed' | 'modified';
export declare const ComparisonRecordSchema: z.ZodObject<{
    type: z.ZodEnum<["added", "removed", "modified"]>;
    category: z.ZodString;
    before: z.ZodNullable<z.ZodString>;
    after: z.ZodNullable<z.ZodString>;
    summary: z.ZodString;
    sourceA: z.ZodNullable<z.ZodString>;
    sourceB: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category: string;
    type: "added" | "removed" | "modified";
    summary: string;
    before: string | null;
    after: string | null;
    sourceA: string | null;
    sourceB: string | null;
}, {
    category: string;
    type: "added" | "removed" | "modified";
    summary: string;
    before: string | null;
    after: string | null;
    sourceA: string | null;
    sourceB: string | null;
}>;
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
export interface ActionItemRecord {
    id: string;
    documentId: string;
    userId: string;
    category: 'Document Overview' | 'Important Obligations' | 'Important Dates' | 'Financial Terms' | 'Review Areas' | 'Questions to Consider' | 'Questions for a Lawyer';
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
