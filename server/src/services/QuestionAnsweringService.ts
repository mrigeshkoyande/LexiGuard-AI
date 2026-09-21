import prisma from '../db/prisma';
import { DocumentClause, QuestionResponse } from '@lexiguard/shared';
import { scoreClausesForQuery } from '../utils/relevance';
import { DECLINED_ADVICE_RESPONSE, isAdviceSeekingQuestion } from '../utils/safety';
import { getAIProvider } from '../ai';

export class QuestionAnsweringService {
  /**
   * Answers user questions grounded strictly in document clauses.
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

    // 1. Check for advice-seeking ("Should I sign this?") refusal heuristic
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
        sourceClauseIds: [],
        confidence: 1.0,
        isDeclinedAdvice: true,
        matchedClauses: []
      };
    }

    // 2. Fetch all document clauses
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

    // 3. Grounding: Retrieve top relevant clauses via keyword / TF-IDF scoring
    const scored = scoreClausesForQuery(trimmedQuestion, clauses, 3);

    // If no clause exceeds relevance threshold, decline to answer from general knowledge
    if (scored.length === 0) {
      const noAnswerText = "I couldn't find this information in the uploaded document.";
      const qaRecord = await prisma.questionAnswer.create({
        data: {
          documentId,
          userId,
          questionText: trimmedQuestion,
          answerText: noAnswerText,
          confidence: 0.2,
          sourceClauseIdsJson: JSON.stringify([]),
          pageNumber: null,
          isDeclinedAdvice: false
        }
      });

      return {
        id: qaRecord.id,
        question: trimmedQuestion,
        answer: noAnswerText,
        sourceClauseIds: [],
        confidence: 0.2,
        isDeclinedAdvice: false,
        matchedClauses: []
      };
    }

    const relevantClauses = scored.map((s) => s.clause);

    // 4. Invoke AI provider with only the relevant clauses
    const aiProvider = getAIProvider();
    const aiResult = await aiProvider.answerQuestion(trimmedQuestion, relevantClauses, clauses);

    // Verify source clause IDs
    const validIds = new Set(clauses.map((c) => c.id));
    const verifiedSourceIds = aiResult.sourceClauseIds.filter((id) => validIds.has(id));
    const fallbackSourceIds = verifiedSourceIds.length > 0 ? verifiedSourceIds : [relevantClauses[0].id];

    const primaryClause = clauses.find((c) => c.id === fallbackSourceIds[0]);

    // 5. Persist Q&A record
    const qaRecord = await prisma.questionAnswer.create({
      data: {
        documentId,
        userId,
        questionText: trimmedQuestion,
        answerText: aiResult.answer,
        confidence: aiResult.confidence,
        sourceClauseIdsJson: JSON.stringify(fallbackSourceIds),
        pageNumber: primaryClause?.page || 1,
        isDeclinedAdvice: false
      }
    });

    return {
      id: qaRecord.id,
      question: trimmedQuestion,
      answer: aiResult.answer,
      sourceClauseIds: fallbackSourceIds,
      pageNumber: primaryClause?.page || 1,
      confidence: aiResult.confidence,
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

    return history.map((h) => ({
      id: h.id,
      question: h.questionText,
      answer: h.answerText,
      sourceClauseIds: JSON.parse(h.sourceClauseIdsJson || '[]'),
      pageNumber: h.pageNumber || undefined,
      confidence: h.confidence,
      isDeclinedAdvice: h.isDeclinedAdvice
    }));
  }
}
