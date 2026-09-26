import prisma from '../db/prisma';
import { AppError } from '../utils/AppError';
import { DocumentClause, QuestionResponse, QuestionSource, SupportStatus } from '@lexiguard/shared';
import { scoreClausesForQuery } from '../utils/relevance';
import { DECLINED_ADVICE_RESPONSE, isAdviceSeekingQuestion, sanitizeSafetyOutput } from '../utils/safety';
import { getAIProvider } from '../ai';

export class QuestionAnsweringService {
  /**
   * Answers user questions grounded strictly in document clauses.
   * Multi-stage pipeline:
   * 1. Ownership validation
   * 2. Classification & advice refusal
   * 3. Clause retrieval & relevance filtering
   * 4. Minimum evidence threshold gate
   * 5. LLM structured generation
   * 6. Server-side source validation gate (rejects hallucinated sources)
   * 7. Unsupported numerical/date/claim checks
   * 8. Response formatting with limitation and next step
   */
  async askQuestion(
    documentId: string,
    userId: string,
    question: string
  ): Promise<QuestionResponse> {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      throw new Error('Question cannot be empty');
    }

    // 1. Verify Document Ownership
    const document = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    if (document.userId !== userId) {
      throw new AppError('Unauthorized: You do not have permission to access this document.', 403);
    }

    // 2. Question Classification & Safety Refusal
    if (isAdviceSeekingQuestion(trimmedQuestion)) {
      const qaRecord = await prisma.questionAnswer.create({
        data: {
          documentId,
          userId,
          questionText: trimmedQuestion,
          answerText: DECLINED_ADVICE_RESPONSE,
          confidence: 1.0,
          sourceClauseIdsJson: JSON.stringify([]),
          pageNumber: null,
          isDeclinedAdvice: true
        }
      });

      return {
        id: qaRecord.id,
        question: trimmedQuestion,
        answer: DECLINED_ADVICE_RESPONSE,
        status: 'INSUFFICIENT_EVIDENCE',
        supportStatus: 'INSUFFICIENT_EVIDENCE',
        sources: [],
        sourceClauseIds: [],
        confidence: 1.0,
        limitation: 'LexiGuard AI does not provide binding legal counsel or advice on signing agreements.',
        nextStep: 'Consult a licensed attorney for tailored advice on your specific legal circumstances.',
        isDeclinedAdvice: true,
        matchedClauses: []
      };
    }

    // 3. Fetch All Document Clauses from Database
    const dbClauses = await prisma.documentClause.findMany({
      where: { documentId },
      orderBy: { createdAt: 'asc' }
    });

    const clauses: DocumentClause[] = dbClauses.map((c) => ({
      id: c.id,
      number: c.number,
      title: c.title,
      text: c.text,
      page: c.page,
      startOffset: c.startOffset,
      endOffset: c.endOffset
    }));

    // Handle Empty Document
    if (clauses.length === 0) {
      const noClauseAnswer = "I couldn't find information relevant to this question because the uploaded document contains no readable clauses.";
      const qaRecord = await prisma.questionAnswer.create({
        data: {
          documentId,
          userId,
          questionText: trimmedQuestion,
          answerText: noClauseAnswer,
          confidence: 0.1,
          sourceClauseIdsJson: JSON.stringify([]),
          pageNumber: null,
          isDeclinedAdvice: false
        }
      });

      return {
        id: qaRecord.id,
        question: trimmedQuestion,
        answer: noClauseAnswer,
        status: 'INSUFFICIENT_EVIDENCE',
        supportStatus: 'INSUFFICIENT_EVIDENCE',
        sources: [],
        sourceClauseIds: [],
        confidence: 0.1,
        limitation: 'No text clauses were extracted from this document.',
        isDeclinedAdvice: false,
        matchedClauses: []
      };
    }

    // Explicit Section/Clause Request Check (e.g. "What does Section 99 say?")
    const sectionMatch = trimmedQuestion.match(/(?:section|clause|article)\s+([0-9a-zA-Z\.\-]+)/i);
    if (sectionMatch) {
      const requestedSection = sectionMatch[1].toLowerCase().replace(/[^a-z0-9]/g, '');
      const sectionExists = clauses.some((c) => {
        const numNorm = c.number.toLowerCase().replace(/[^a-z0-9]/g, '');
        const titleNorm = c.title.toLowerCase();
        return numNorm === requestedSection || titleNorm.includes(`section ${requestedSection}`) || titleNorm.includes(`clause ${requestedSection}`);
      });

      if (!sectionExists) {
        const noSectionAnswer = `I couldn't find Section ${sectionMatch[1]} in the uploaded document.`;
        const qaRecord = await prisma.questionAnswer.create({
          data: {
            documentId,
            userId,
            questionText: trimmedQuestion,
            answerText: noSectionAnswer,
            confidence: 0.2,
            sourceClauseIdsJson: JSON.stringify([]),
            pageNumber: null,
            isDeclinedAdvice: false
          }
        });

        return {
          id: qaRecord.id,
          question: trimmedQuestion,
          answer: noSectionAnswer,
          status: 'INSUFFICIENT_EVIDENCE',
          supportStatus: 'INSUFFICIENT_EVIDENCE',
          sources: [],
          sourceClauseIds: [],
          confidence: 0.2,
          limitation: `Section ${sectionMatch[1]} is not present in the indexed document structure.`,
          nextStep: 'Check whether this section is referenced from an external schedule or addendum.',
          isDeclinedAdvice: false,
          matchedClauses: []
        };
      }
    }

    // 4. Grounding: Retrieve top relevant clauses via TF-IDF scoring
    const scored = scoreClausesForQuery(trimmedQuestion, clauses, 4);

    // If no clause exceeds relevance threshold, fail closed: ABSTAIN IMMEDIATELY
    if (scored.length === 0) {
      const noAnswerText = "I couldn't find enough information about this in the uploaded document.";
      const qaRecord = await prisma.questionAnswer.create({
        data: {
          documentId,
          userId,
          questionText: trimmedQuestion,
          answerText: noAnswerText,
          confidence: 0.1,
          sourceClauseIdsJson: JSON.stringify([]),
          pageNumber: null,
          isDeclinedAdvice: false
        }
      });

      return {
        id: qaRecord.id,
        question: trimmedQuestion,
        answer: noAnswerText,
        status: 'INSUFFICIENT_EVIDENCE',
        supportStatus: 'INSUFFICIENT_EVIDENCE',
        sources: [],
        sourceClauseIds: [],
        confidence: 0.1,
        limitation: 'No retrieved clauses had sufficient relevance to this inquiry.',
        nextStep: 'Try rephrasing your question or checking specific sections in the document viewer.',
        isDeclinedAdvice: false,
        matchedClauses: []
      };
    }

    const relevantClauses = scored.map((s) => s.clause);

    // 5. Invoke AI provider with only the relevant clauses
    const aiProvider = getAIProvider();
    const aiResult = await aiProvider.answerQuestion(trimmedQuestion, relevantClauses, clauses);

    // 6. SERVER-SIDE SOURCE VALIDATION GATE
    // Verify each cited source actually exists in the database for this document
    const validClauseMap = new Map(clauses.map((c) => [c.id, c]));
    const verifiedSources: QuestionSource[] = [];

    if (aiResult.sources && aiResult.sources.length > 0) {
      for (const s of aiResult.sources) {
        const dbClause = validClauseMap.get(s.sourceClauseId);
        if (dbClause) {
          verifiedSources.push({
            sourceClauseId: dbClause.id,
            page: dbClause.page || s.page || 1,
            excerpt: s.excerpt || dbClause.text.slice(0, 160),
            clauseTitle: dbClause.title,
            clauseNumber: dbClause.number
          });
        }
      }
    } else if (aiResult.sourceClauseIds && aiResult.sourceClauseIds.length > 0) {
      for (const id of aiResult.sourceClauseIds) {
        const dbClause = validClauseMap.get(id);
        if (dbClause) {
          verifiedSources.push({
            sourceClauseId: dbClause.id,
            page: dbClause.page || 1,
            excerpt: dbClause.text.slice(0, 160),
            clauseTitle: dbClause.title,
            clauseNumber: dbClause.number
          });
        }
      }
    }

    // Determine Grounding Status
    const isAbstaining =
      aiResult.answer.toLowerCase().includes("couldn't find") ||
      aiResult.answer.toLowerCase().includes("does not specify") ||
      aiResult.answer.toLowerCase().includes("not present in the uploaded document") ||
      aiResult.answer.toLowerCase().includes("alone isn't enough to determine");

    let finalStatus: SupportStatus = 'SUPPORTED';
    let finalAnswer = sanitizeSafetyOutput(aiResult.answer);

    if (isAbstaining) {
      finalStatus = 'INSUFFICIENT_EVIDENCE';
    } else if (aiResult.status === 'CONTRADICTORY_EVIDENCE') {
      finalStatus = 'CONTRADICTORY_EVIDENCE';
    } else if (aiResult.status === 'PARTIALLY_SUPPORTED' || verifiedSources.length === 0) {
      finalStatus = verifiedSources.length > 0 ? 'PARTIALLY_SUPPORTED' : 'INSUFFICIENT_EVIDENCE';
    } else {
      finalStatus = 'SUPPORTED';
    }

    // If status is INSUFFICIENT_EVIDENCE, clear any phantom sources
    const finalSources = finalStatus === 'INSUFFICIENT_EVIDENCE' ? [] : verifiedSources;
    const finalSourceIds = finalSources.map((s) => s.sourceClauseId);
    const primaryPage = finalSources[0]?.page || relevantClauses[0]?.page || 1;

    // 7. Persist Q&A record
    const qaRecord = await prisma.questionAnswer.create({
      data: {
        documentId,
        userId,
        questionText: trimmedQuestion,
        answerText: finalAnswer,
        confidence: finalStatus === 'SUPPORTED' ? 0.95 : finalStatus === 'PARTIALLY_SUPPORTED' ? 0.75 : 0.2,
        sourceClauseIdsJson: JSON.stringify(finalSourceIds),
        pageNumber: finalStatus === 'INSUFFICIENT_EVIDENCE' ? null : primaryPage,
        isDeclinedAdvice: false
      }
    });

    return {
      id: qaRecord.id,
      question: trimmedQuestion,
      answer: finalAnswer,
      status: finalStatus,
      supportStatus: finalStatus,
      sources: finalSources,
      sourceClauseIds: finalSourceIds,
      pageNumber: finalStatus === 'INSUFFICIENT_EVIDENCE' ? undefined : primaryPage,
      confidence: finalStatus === 'SUPPORTED' ? 0.95 : finalStatus === 'PARTIALLY_SUPPORTED' ? 0.75 : 0.2,
      limitation: aiResult.limitation,
      nextStep: aiResult.nextStep,
      isDeclinedAdvice: false,
      matchedClauses: relevantClauses.map((c) => ({
        id: c.id,
        title: c.title,
        number: c.number,
        text: c.text,
        page: c.page
      }))
    };
  }

  /**
   * Retrieves previous Q&A history for a document.
   */
  async getQuestionHistory(documentId: string, userId: string): Promise<QuestionResponse[]> {
    const history = await prisma.questionAnswer.findMany({
      where: { documentId, userId },
      orderBy: { createdAt: 'desc' }
    });

    return history.map((h) => {
      const sourceIds: string[] = JSON.parse(h.sourceClauseIdsJson || '[]');
      const isAbstaining = h.answerText.toLowerCase().includes("couldn't find") || h.isDeclinedAdvice;
      const supportStatus: SupportStatus = isAbstaining
        ? 'INSUFFICIENT_EVIDENCE'
        : sourceIds.length > 0
        ? 'SUPPORTED'
        : 'PARTIALLY_SUPPORTED';

      return {
        id: h.id,
        question: h.questionText,
        answer: h.answerText,
        status: supportStatus,
        supportStatus,
        sourceClauseIds: sourceIds,
        pageNumber: h.pageNumber || undefined,
        confidence: h.confidence,
        isDeclinedAdvice: h.isDeclinedAdvice
      };
    });
  }
}

