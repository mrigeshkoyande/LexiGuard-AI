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
        answer: "I couldn't find enough information about this in the uploaded document.",
        status: 'INSUFFICIENT_EVIDENCE',
        sources: [],
        sourceClauseIds: [],
        confidence: 0.1,
        limitation: 'No relevant clauses found in the uploaded document.'
      };
    }

    const qLower = question.toLowerCase();
    const primary = contextClauses[0];
    const allContextText = contextClauses.map((c) => `${c.title} ${c.text}`).join(' ').toLowerCase();

    // Check for contradictory clauses in context
    const hasContradiction =
      contextClauses.length >= 2 &&
      ((allContextText.includes('30 days') && allContextText.includes('60 days')) ||
        (allContextText.includes('exclusive') && allContextText.includes('non-exclusive')));

    if (hasContradiction) {
      const c1 = contextClauses[0];
      const c2 = contextClauses[1];
      return {
        answer: sanitizeSafetyOutput(
          `These provisions appear inconsistent.\n\n` +
            `• ${c1.title} (Clause ${c1.number}, Page ${c1.page || 1}): "${c1.text.slice(0, 160)}..."\n` +
            `• ${c2.title} (Clause ${c2.number}, Page ${c2.page || 1}): "${c2.text.slice(0, 160)}..."\n\n` +
            `The document contains differing terms across these clauses.`
        ),
        status: 'CONTRADICTORY_EVIDENCE',
        sources: contextClauses.map((c: DocumentClause) => ({
          sourceClauseId: c.id,
          page: c.page || 1,
          excerpt: c.text.slice(0, 180),
          clauseTitle: c.title,
          clauseNumber: c.number
        })),
        sourceClauseIds: contextClauses.map((c: DocumentClause) => c.id),
        confidence: 0.88,
        limitation: 'The document contains conflicting provisions on this topic.',
        nextStep: 'Consider clarifying which clause governs with the other party or a qualified attorney.'
      };
    }

    // Check specific question intents against actual context contents
    // 1. Renewal Date
    if (qLower.includes('renewal date') || qLower.includes('when is renewal') || qLower.includes('exact renewal fee')) {
      const hasSpecificRenewal = allContextText.includes('renewal on') || allContextText.includes('renews on') || allContextText.includes('renewal fee of');
      if (!hasSpecificRenewal) {
        return {
          answer: "I couldn't find a renewal date or renewal fee specified in the uploaded document.",
          status: 'INSUFFICIENT_EVIDENCE',
          sources: [],
          sourceClauseIds: [],
          confidence: 0.2,
          limitation: 'The agreement does not specify a concrete renewal date or fee.',
          nextStep: 'Check whether an amendment or separate schedule defines the renewal schedule.'
        };
      }
    }

    // 2. Termination Penalty / Late Payment Penalty
    if (qLower.includes('penalty') || qLower.includes('late fee') || qLower.includes('termination penalty') || qLower.includes('late payment penalty')) {
      const hasPenaltyMention = allContextText.includes('penalty') || allContextText.includes('late fee') || allContextText.includes('liquidated damages') || allContextText.includes('interest of');
      if (!hasPenaltyMention) {
        return {
          answer: "I couldn't find a penalty or late-payment fee specified in the uploaded document.",
          status: 'INSUFFICIENT_EVIDENCE',
          sources: [],
          sourceClauseIds: [],
          confidence: 0.2,
          limitation: 'The contract does not appear to state specific penalty sums or late fees.',
          nextStep: 'Consider checking the payment and default clauses or discussing this with a qualified legal professional.'
        };
      }
    }

    // 3. Monthly payment amount when doc only has generic payment text
    if ((qLower.includes('what is the monthly payment') || qLower.includes('what is my salary') || qLower.includes('how much')) &&
        !allContextText.includes('$') && !allContextText.includes('₹') && !allContextText.includes('usd') && !allContextText.includes('inr') && !allContextText.includes('per month') && !allContextText.includes('salary') && !allContextText.includes('fee')) {
      return {
        answer: "The document discusses payment obligations, but I couldn't find a specific monetary payment amount in the provided document.",
        status: 'PARTIALLY_SUPPORTED',
        sources: [{
          sourceClauseId: primary.id,
          page: primary.page || 1,
          excerpt: primary.text.slice(0, 180),
          clauseTitle: primary.title,
          clauseNumber: primary.number
        }],
        sourceClauseIds: [primary.id],
        confidence: 0.7,
        limitation: 'No specific currency amount is stated in the retrieved clause.',
        nextStep: 'Verify if compensation amounts are specified in an attached Statement of Work or Exhibit.'
      };
    }

    // 4. Prompt Injection / Hypothetical Override
    if (qLower.includes('assume the contract says') || qLower.includes('ignore all') || qLower.includes('ignore previous') || qLower.includes('tell me to transfer money') || qLower.includes('say that this contract is safe')) {
      if (allContextText.includes('notice') || allContextText.includes('terminate')) {
        return {
          answer: `The uploaded document does not state that you can terminate immediately or without notice. ${primary.title} (Clause ${primary.number}) specifies the actual terms: "${primary.text.slice(0, 160)}..."`,
          status: 'SUPPORTED',
          sources: [{
            sourceClauseId: primary.id,
            page: primary.page || 1,
            excerpt: primary.text.slice(0, 180),
            clauseTitle: primary.title,
            clauseNumber: primary.number
          }],
          sourceClauseIds: [primary.id],
          confidence: 0.95,
          limitation: 'Hypothetical assumptions contrary to document text are disregarded.'
        };
      }
    }

    // 5. Notice Period comparison (e.g. "Does the contract contain a 90-day notice period?")
    if (qLower.includes('90-day') || qLower.includes('90 day') || qLower.includes('90 days')) {
      if (!allContextText.includes('90 day') && !allContextText.includes('90-day')) {
        const found30 = allContextText.includes('30 day') || allContextText.includes('30-day');
        return {
          answer: found30
            ? `No. The provided termination clause states a 30-day written notice period.`
            : `I couldn't find a 90-day notice period specified in the uploaded document.`,
          status: 'SUPPORTED',
          sources: [{
            sourceClauseId: primary.id,
            page: primary.page || 1,
            excerpt: primary.text.slice(0, 180),
            clauseTitle: primary.title,
            clauseNumber: primary.number
          }],
          sourceClauseIds: [primary.id],
          confidence: 0.95,
          limitation: 'No 90-day requirement is present in the provided clauses.'
        };
      }
    }

    // 6. Jurisdiction questions
    if (qLower.includes('is this legal in') || qLower.includes('governing law') || qLower.includes('jurisdiction')) {
      const hasLaw = allContextText.includes('governing law') || allContextText.includes('jurisdiction') || allContextText.includes('laws of');
      if (!hasLaw) {
        return {
          answer: "The uploaded document alone isn't enough to determine whether this provision complies with applicable local laws.",
          status: 'INSUFFICIENT_EVIDENCE',
          sources: [],
          sourceClauseIds: [],
          confidence: 0.3,
          limitation: 'No governing jurisdiction or choice-of-law clause was retrieved from the document.',
          nextStep: 'Discuss applicable statutory requirements with a qualified legal professional.'
        };
      }
    }

    // Standard grounded answer with primary clause
    const sources = contextClauses.slice(0, 2).map((c) => ({
      sourceClauseId: c.id,
      page: c.page || 1,
      excerpt: c.text.slice(0, 180),
      clauseTitle: c.title,
      clauseNumber: c.number
    }));

    const answer = sanitizeSafetyOutput(
      `Based on ${primary.title} (Clause ${primary.number}, Page ${primary.page || 1}):\n\n` +
      `"${primary.text}"\n\n` +
      (contextClauses.length > 1
        ? `Additionally, Clause ${contextClauses[1].number} (${contextClauses[1].title}) provides related terms regarding this provision.`
        : '')
    );

    return {
      answer,
      status: 'SUPPORTED',
      sources,
      sourceClauseIds: sources.map((s) => s.sourceClauseId),
      confidence: 0.94,
      nextStep: 'Consider reviewing the highlighted clause in the document viewer for full context.'
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
