import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { DocumentService } from '../services/DocumentService';

const documentService = new DocumentService();

export class DocumentController {
  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const docs = await documentService.getUserDocuments(userId);
      return res.status(200).json({ documents: docs });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const doc = await documentService.getDocumentById(id, userId);
      return res.status(200).json({ document: doc });
    } catch (err) {
      next(err);
    }
  }

  static async upload(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      const { title } = req.body;
      const { originalname, mimetype, size, path: filePath } = req.file;

      const doc = await documentService.createAndProcessDocument({
        userId,
        title: title || originalname.replace(/\.[^/.]+$/, ''),
        originalFilename: originalname,
        mimeType: mimetype,
        fileSize: size,
        filePath
      });

      return res.status(201).json({
        message: 'Document uploaded and analyzed successfully.',
        document: doc
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      await documentService.deleteDocument(id, userId);
      return res.status(200).json({ message: 'Document and associated data deleted successfully.' });
    } catch (err) {
      next(err);
    }
  }
}
