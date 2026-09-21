import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { DocumentService } from '../services/DocumentService';
import { DocumentAnalysisService } from '../services/DocumentAnalysisService';

const documentService = new DocumentService();
const analysisService = new DocumentAnalysisService();

export class AnalysisController {
  static async reanalyze(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const struct = await documentService.getDocumentStructure(id, userId);
      const result = await analysisService.analyzeAndSave(id, userId, struct);

      return res.status(200).json({
        message: 'Document analysis completed successfully.',
        analysis: result
      });
    } catch (err) {
      next(err);
    }
  }
}
