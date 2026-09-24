import {
  AnalysisResult,
  AnalysisResultSchema,
  ComparisonRecord,
  DocumentClause,
  DocumentStructure,
  FindingCategory,
  FindingItem,
  Severity
} from '@lexiguard/shared';
import { AIComparisonResult, AIProvider, AIQuestionResult } from './AIProvider';
import { sanitizeSafetyOutput } from '../utils/safety';

export class MockAIProvider implements AIProvider {
  /**
   * Deterministically analyzes structured legal document clauses into realistic categorized findings.
   */
  async analyzeDocument(doc: DocumentStructure): Promise<AnalysisResult> {
    const allClauses: DocumentClause[] = [];
    for (const section of doc.sections) {
      for (const clause of section.clauses) {
        allClauses.push(clause);
      }
    }

    if (allClauses.length === 0) {
      return {
        summary: 'Empty document provided. No legal clauses were identified for analysis.',
        documentType: 'Unknown / Empty Document',
        importantClauses: [],
        obligations: [],
        deadlines: [],
        monetaryTerms: [],
        terminationTerms: [],
        renewalTerms: [],
        potentialConcerns: [],
        missingInformation: ['Document body text and specific contractual terms']
      };
    }

    // Determine document type based on clause keywords
    const fullText = allClauses.map((c) => `${c.title} ${c.text}`).join(' ').toLowerCase();
    let documentType = 'Commercial Agreement';
    if (fullText.includes('employment') || fullText.includes('employee') || fullText.includes('salary') || fullText.includes('probation')) {
      documentType = 'Employment Agreement';
    } else if (fullText.includes('confidential') || fullText.includes('non-disclosure') || fullText.includes('nda')) {
      documentType = 'Non-Disclosure Agreement (NDA)';
    } else if (fullText.includes('services') || fullText.includes('contractor') || fullText.includes('consulting')) {
      documentType = 'Consulting / Services Agreement';
    } else if (fullText.includes('license') || fullText.includes('software') || fullText.includes('saas')) {
      documentType = 'Software License / SaaS Terms';
    } else if (fullText.includes('lease') || fullText.includes('tenant') || fullText.includes('landlord')) {
      documentType = 'Commercial / Residential Lease';
    }

    const importantClauses: FindingItem[] = [];
    const obligations: FindingItem[] = [];
    const deadlines: FindingItem[] = [];
    const monetaryTerms: FindingItem[] = [];
    const terminationTerms: FindingItem[] = [];
    const renewalTerms: FindingItem[] = [];
    const potentialConcerns: FindingItem[] = [];

    // Helper to add finding
    const addFinding = (
      list: FindingItem[],
      clause: DocumentClause,
      category: FindingCategory,
      severity: Severity,
      title: string,
      explanation: string,
      whyItMatters: string
    ) => {
      list.push({
        id: `finding-${category}-${clause.id}-${list.length + 1}`,
        title: sanitizeSafetyOutput(title),
        category,
        severity,
        explanation: sanitizeSafetyOutput(explanation),
        whyItMatters: sanitizeSafetyOutput(whyItMatters),
        sourceClauseId: clause.id,
        pageNumber: clause.page || 1,
        confidence: 0.95,
        supportStatus: 'SUPPORTED'
      });
    };

    // Analyze each clause based on keyword heuristics
    allClauses.forEach((c) => {
      const text = `${c.title} ${c.text}`.toLowerCase();

      // 1. Monetary Terms
      if (text.includes('salary') || text.includes('compensation') || text.includes('payment') || text.includes('fee') || text.includes('$') || text.includes('usd') || text.includes('bonus') || text.includes('equity') || text.includes('remuneration')) {
        addFinding(
          monetaryTerms,
          c,
          'monetaryTerms',
          'Important',
          `Financial Terms: ${c.title}`,
          `Outlines financial compensation, payment schedule, or fee structures established in Clause ${c.number}.`,
          'Ensures compensation amounts, payment intervals, deductions, and bonus conditions align with your expectations before signing.'
        );
      }

      // 2. Deadlines / Dates
      if (text.includes('day') || text.includes('month') || text.includes('year') || text.includes('notice') || text.includes('probation') || text.includes('effective date') || text.includes('schedule') || text.includes('within') || text.includes('timeline')) {
        addFinding(
          deadlines,
          c,
          'deadlines',
          text.includes('probation') || text.includes('notice') ? 'Important' : 'Review',
          `Timeline Requirement: ${c.title}`,
          `Specifies time-sensitive windows, probation milestones, or formal notice period durations in Clause ${c.number}.`,
          'Missing contractual deadlines can lead to forfeiture of rights, automatic renewals, or default.'
        );
      }

      // 3. Obligations / Duties
      if (text.includes('shall') || text.includes('must') || text.includes('agree to') || text.includes('duties') || text.includes('responsibilities') || text.includes('obliged') || text.includes('covenant') || text.includes('warrant')) {
        addFinding(
          obligations,
          c,
          'obligations',
          'Review',
          `Binding Duty: ${c.title}`,
          `Defines affirmative duties and operational responsibilities required under Clause ${c.number}.`,
          'Clear understanding of your ongoing operational commitments prevents unintended contractual breach.'
        );
      }

      // 4. Termination Terms
      if (text.includes('terminate') || text.includes('termination') || text.includes('severance') || text.includes('breach') || text.includes('for cause') || text.includes('without cause') || text.includes('resignation')) {
        addFinding(
          terminationTerms,
          c,
          'terminationTerms',
          'Important',
          `Termination Protocol: ${c.title}`,
          `Establishes exit conditions, required notice periods, and post-termination handling in Clause ${c.number}.`,
          'Crucial for understanding how either party may exit the agreement and what penalties or notice obligations apply.'
        );
      }

      // 5. Renewal Terms
      if (text.includes('renew') || text.includes('renewal') || text.includes('extension') || text.includes('automatic') || text.includes('term of agreement')) {
        addFinding(
          renewalTerms,
          c,
          'renewalTerms',
          'Review',
          `Renewal & Extension: ${c.title}`,
          `Governs contract duration, expiration, and automatic extension mechanisms in Clause ${c.number}.`,
          'Automatic renewal provisions can lock you into future terms unless opted out in writing beforehand.'
        );
      }

      // 6. Potential Concerns / Restrictive Covenants / Liability / IP
      if (text.includes('non-compete') || text.includes('non-solicit') || text.includes('indemnif') || text.includes('liability') || text.includes('intellectual property') || text.includes('invention assignment') || text.includes('confidential') || text.includes('dispute') || text.includes('arbitration') || text.includes('penalty')) {
        let concernTitle = `Review Point: ${c.title}`;
        let why = 'May restrict future business opportunities, require broad indemnification, or assign proprietary rights.';
        let sev: Severity = 'Review';

        if (text.includes('non-compete')) {
          concernTitle = `Restrictive Covenant: Non-Compete Scope`;
          why = 'Restricts post-contract employment or business activities within defined geographic and temporal boundaries.';
          sev = 'Important';
        } else if (text.includes('intellectual property') || text.includes('invention assignment')) {
          concernTitle = `IP Assignment: Scope of Ownership`;
          why = 'Assigns rights for work product or inventions created during the contractual term to the other party.';
          sev = 'Important';
        } else if (text.includes('indemnif') || text.includes('liability')) {
          concernTitle = `Liability & Indemnification Allocation`;
          why = 'Shifts financial risk or exposure for third-party claims.';
          sev = 'Review';
        }

        addFinding(
          potentialConcerns,
          c,
          'potentialConcerns',
          sev,
          concernTitle,
          `Highlights potential risk areas or restrictive covenants located in Clause ${c.number}.`,
          why
        );
      }
    });

    // Populate importantClauses with a curated subset of high severity items
    const topClauses = [...potentialConcerns, ...terminationTerms, ...monetaryTerms].slice(0, 5);
    topClauses.forEach((item) => {
      importantClauses.push({
        ...item,
        id: `finding-importantClauses-${item.sourceClauseId}-${importantClauses.length + 1}`,
        category: 'importantClauses'
      });
    });

    // Fallback if document is sparse
    if (importantClauses.length === 0 && allClauses.length > 0) {
      const firstClause = allClauses[0];
      importantClauses.push({
        id: `finding-importantClauses-${firstClause.id}-1`,
        title: `Primary Provision: ${firstClause.title}`,
        category: 'importantClauses',
        severity: 'Informational',
        explanation: `Clause ${firstClause.number} sets forth core opening provisions of this document.`,
        whyItMatters: 'Establishes initial scope and mutual contractual intentions.',
        sourceClauseId: firstClause.id,
        pageNumber: firstClause.page || 1,
        confidence: 0.9,
        supportStatus: 'SUPPORTED'
      });
    }

    const missingInformation = [
      'Specific governing jurisdiction and choice-of-law venue clarity (if not explicitly detailed)',
      'Detailed SLA or response time commitments for deliverables',
      'Escalation procedure prior to formal arbitration filing'
    ];

    const result: AnalysisResult = {
      summary: sanitizeSafetyOutput(
        `This ${documentType} contains ${allClauses.length} distinct clauses across ${doc.sections.length} sections. ` +
        `The agreement establishes key commitments regarding compensation, service expectations, confidentiality safeguards, and defined termination mechanisms. ` +
        `Users should pay specific attention to the highlighted review items before execution.`
      ),
      documentType,
      importantClauses,
      obligations,
      deadlines,
      monetaryTerms,
      terminationTerms,
      renewalTerms,
      potentialConcerns,
      missingInformation
    };

    // Validate with Zod schema
    return AnalysisResultSchema.parse(result);
  }

  /**
   * Answers grounded questions using context clauses only.
   */
  async answerQuestion(
    question: string,
    contextClauses: DocumentClause[],
    allClauses: DocumentClause[]
  ): Promise<AIQuestionResult> {
    if (!contextClauses || contextClauses.length === 0) {
      return {
        answer: "I couldn't find this information in the uploaded document.",
        sourceClauseIds: [],
        confidence: 0.2
      };
    }

    const sourceClauseIds = contextClauses.map((c) => c.id);
    const primary = contextClauses[0];

    const answer = sanitizeSafetyOutput(
      `Based on ${primary.title} (Clause ${primary.number}, Page ${primary.page || 1}):\n\n` +
      `"${primary.text}"\n\n` +
      (contextClauses.length > 1
        ? `Additionally, Clause ${contextClauses[1].number} (${contextClauses[1].title}) provides related terms regarding this subject.`
        : '')
    );

    return {
      answer,
      sourceClauseIds,
      confidence: 0.92
    };
  }

  /**
   * Diffs two structured documents into comparison records.
   */
  async compareDocuments(
    docA: DocumentStructure,
    docB: DocumentStructure
  ): Promise<AIComparisonResult> {
    const clausesA: DocumentClause[] = [];
    docA.sections.forEach((s) => clausesA.push(...s.clauses));

    const clausesB: DocumentClause[] = [];
    docB.sections.forEach((s) => clausesB.push(...s.clauses));

    const records: ComparisonRecord[] = [];

    // Map doc A clauses by title/number normalized
    const mapA = new Map<string, DocumentClause>();
    clausesA.forEach((c) => {
      const key = `${c.title.toLowerCase().trim()}`;
      mapA.set(key, c);
    });

    const mapB = new Map<string, DocumentClause>();
    clausesB.forEach((c) => {
      const key = `${c.title.toLowerCase().trim()}`;
      mapB.set(key, c);
    });

    // Check additions and modifications
    clausesB.forEach((cB) => {
      const key = `${cB.title.toLowerCase().trim()}`;
      const cA = mapA.get(key);

      if (!cA) {
        records.push({
          type: 'added',
          category: cB.title,
          before: null,
          after: cB.text,
          summary: `Added new clause "${cB.title}" (Clause ${cB.number}) in Document B.`,
          sourceA: null,
          sourceB: cB.id
        });
      } else if (cA.text.trim() !== cB.text.trim()) {
        records.push({
          type: 'modified',
          category: cB.title,
          before: cA.text,
          after: cB.text,
          summary: `Modified wording in "${cB.title}" between Document A (Clause ${cA.number}) and Document B (Clause ${cB.number}).`,
          sourceA: cA.id,
          sourceB: cB.id
        });
      }
    });

    // Check removals
    clausesA.forEach((cA) => {
      const key = `${cA.title.toLowerCase().trim()}`;
      if (!mapB.has(key)) {
        records.push({
          type: 'removed',
          category: cA.title,
          before: cA.text,
          after: null,
          summary: `Removed clause "${cA.title}" (Clause ${cA.number}) present in Document A but absent in Document B.`,
          sourceA: cA.id,
          sourceB: null
        });
      }
    });

    // If documents are identical or no structural match found
    if (records.length === 0 && (clausesA.length > 0 || clausesB.length > 0)) {
      records.push({
        type: 'modified',
        category: 'General Terms',
        before: clausesA[0]?.text || null,
        after: clausesB[0]?.text || null,
        summary: 'Both documents share equivalent clause titles and substantive terms.',
        sourceA: clausesA[0]?.id || null,
        sourceB: clausesB[0]?.id || null
      });
    }

    const summary = `Comparison identified ${records.length} clause variations: ${
      records.filter((r) => r.type === 'added').length
    } added, ${records.filter((r) => r.type === 'modified').length} modified, and ${
      records.filter((r) => r.type === 'removed').length
    } removed provisions.`;

    return {
      summary,
      records
    };
  }
}
