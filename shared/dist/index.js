"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComparisonRecordSchema = exports.AnalysisResultSchema = exports.FindingItemSchema = exports.SupportStatusEnum = exports.FindingCategoryEnum = exports.SeverityEnum = exports.LEGAL_DISCLAIMER = void 0;
const zod_1 = require("zod");
// ============================================================================
// Legal Disclaimer Constant
// ============================================================================
exports.LEGAL_DISCLAIMER = 'LexiGuard AI provides general legal information and document analysis. It does not provide legal advice or replace a qualified legal professional.';
// ============================================================================
// Severity and Categories
// ============================================================================
exports.SeverityEnum = zod_1.z.enum(['Informational', 'Review', 'Important']);
exports.FindingCategoryEnum = zod_1.z.enum([
    'importantClauses',
    'obligations',
    'deadlines',
    'monetaryTerms',
    'terminationTerms',
    'renewalTerms',
    'potentialConcerns'
]);
// ============================================================================
// ============================================================================
// ============================================================================
// Evidence Support States (Hallucination Prevention)
// ============================================================================
exports.SupportStatusEnum = zod_1.z.enum([
    'SUPPORTED',
    'PARTIALLY_SUPPORTED',
    'INSUFFICIENT_EVIDENCE',
    'CONTRADICTORY_EVIDENCE',
    'PARTIALLY SUPPORTED',
    'INSUFFICIENT EVIDENCE'
]);
// ============================================================================
// AI Finding Item Schema
// ============================================================================
exports.FindingItemSchema = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string(),
    category: zod_1.z.string(),
    severity: exports.SeverityEnum,
    explanation: zod_1.z.string(),
    whyItMatters: zod_1.z.string(),
    sourceClauseId: zod_1.z.string(),
    pageNumber: zod_1.z.number().int().min(1),
    confidence: zod_1.z.number().min(0).max(1).default(0.9),
    supportStatus: exports.SupportStatusEnum.default('SUPPORTED')
});
// ============================================================================
// Full Analysis Schema
// ============================================================================
exports.AnalysisResultSchema = zod_1.z.object({
    summary: zod_1.z.string(),
    documentType: zod_1.z.string(),
    importantClauses: zod_1.z.array(exports.FindingItemSchema),
    obligations: zod_1.z.array(exports.FindingItemSchema),
    deadlines: zod_1.z.array(exports.FindingItemSchema),
    monetaryTerms: zod_1.z.array(exports.FindingItemSchema),
    terminationTerms: zod_1.z.array(exports.FindingItemSchema),
    renewalTerms: zod_1.z.array(exports.FindingItemSchema),
    potentialConcerns: zod_1.z.array(exports.FindingItemSchema),
    missingInformation: zod_1.z.array(zod_1.z.string())
});
exports.ComparisonRecordSchema = zod_1.z.object({
    type: zod_1.z.enum(['added', 'removed', 'modified']),
    category: zod_1.z.string(),
    before: zod_1.z.string().nullable(),
    after: zod_1.z.string().nullable(),
    summary: zod_1.z.string(),
    sourceA: zod_1.z.string().nullable(),
    sourceB: zod_1.z.string().nullable()
});
