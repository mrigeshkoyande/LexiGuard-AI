import { Router } from 'express';
import { DocumentController } from '../controllers/documentController';
import { AnalysisController } from '../controllers/analysisController';
import { QnAController } from '../controllers/qnaController';
import { ActionBriefController } from '../controllers/actionBriefController';
import { authenticate } from '../middleware/authMiddleware';
import { handleSingleUpload, validateAndSaveUploadedFile } from '../middleware/uploadMiddleware';
import { apiRateLimiter } from '../middleware/rateLimitMiddleware';

const router = Router();

// All document routes require authentication
router.use(authenticate);

// Document CRUD
router.get('/', DocumentController.list);
router.get('/:id', DocumentController.getById);
router.post('/upload', handleSingleUpload, validateAndSaveUploadedFile, DocumentController.upload);
router.delete('/:id', DocumentController.delete);

// Analysis
router.post('/:id/analyze', AnalysisController.reanalyze);

// Grounded Q&A ("Ask Lexi")
router.post('/:id/qna', apiRateLimiter, QnAController.ask);
router.get('/:id/qna/history', QnAController.getHistory);

// Action Brief
router.get('/:id/action-brief', ActionBriefController.getBrief);
router.patch('/:id/action-brief/items/:itemId', ActionBriefController.toggleItem);

export default router;
