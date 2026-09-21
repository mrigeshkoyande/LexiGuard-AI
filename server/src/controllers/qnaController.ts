import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { QuestionAnsweringService } from '../services/QuestionAnsweringService';
import { DocumentService } from '../services/DocumentService';

const qnaService = new QuestionAnsweringService();
const documentService = new DocumentService();

export class QnAController {
  static async ask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { question } = req.body;

      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: 'Valid question text is required.' });
      }

      // Check ownership
      await documentService.getDocumentById(id, userId);

      const response = await qnaService.askQuestion(id, userId, question);
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      // Check ownership
      await documentService.getDocumentById(id, userId);

      const history = await qnaService.getQuestionHistory(id, userId);
      return res.status(200).json({ history });
    } catch (err) {
      next(err);
    }
  }
}
