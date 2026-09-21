import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { ComparisonService } from '../services/ComparisonService';

const comparisonService = new ComparisonService();

export class ComparisonController {
  static async compare(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { docAId, docBId } = req.body;

      if (!docAId || !docBId) {
        return res.status(400).json({ error: 'Both docAId and docBId are required for comparison.' });
      }

      if (docAId === docBId) {
        return res.status(400).json({ error: 'Please select two different documents to compare.' });
      }

      const result = await comparisonService.compareDocuments(userId, docAId, docBId);
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const result = await comparisonService.getComparisonById(id, userId);
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}
