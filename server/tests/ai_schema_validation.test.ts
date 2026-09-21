import { describe, it, expect } from 'vitest';
import { AnalysisResultSchema, FindingItemSchema } from '@lexiguard/shared';

describe('AI Analysis Schema Validation Tests', () => {
  it('should accept valid structured AI analysis payload', () => {
    const validPayload = {
      summary: 'Standard commercial service agreement.',
      documentType: 'Service Agreement',
      importantClauses: [
        {
          id: 'f-1',
          title: 'Payment Terms',
          category: 'monetaryTerms',
          severity: 'Important',
          explanation: 'Requires payment within 30 days.',
          whyItMatters: 'Late fees accrue after 30 days.',
          sourceClauseId: 'clause-1',
          pageNumber: 1,
          confidence: 0.95
        }
      ],
      obligations: [],
      deadlines: [],
      monetaryTerms: [],
      terminationTerms: [],
      renewalTerms: [],
      potentialConcerns: [],
      missingInformation: ['Arbitration seat']
    };

    const parsed = AnalysisResultSchema.safeParse(validPayload);
    expect(parsed.success).toBe(true);
  });

  it('should reject invalid severity enum values like "Illegal" or "Critical"', () => {
    const invalidFinding = {
      id: 'f-1',
      title: 'Invalid Severity Finding',
      category: 'potentialConcerns',
      severity: 'Illegal', // Invalid! Must be Informational, Review, or Important
      explanation: 'Explanation text.',
      whyItMatters: 'Why it matters text.',
      sourceClauseId: 'clause-1',
      pageNumber: 1,
      confidence: 0.9
    };

    const parsed = FindingItemSchema.safeParse(invalidFinding);
    expect(parsed.success).toBe(false);
  });

  it('should reject missing required fields like summary or documentType', () => {
    const missingSummaryPayload = {
      documentType: 'Service Agreement',
      importantClauses: [],
      obligations: [],
      deadlines: [],
      monetaryTerms: [],
      terminationTerms: [],
      renewalTerms: [],
      potentialConcerns: [],
      missingInformation: []
    };

    const parsed = AnalysisResultSchema.safeParse(missingSummaryPayload);
    expect(parsed.success).toBe(false);
  });
});
