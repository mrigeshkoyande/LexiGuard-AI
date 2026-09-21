import { Router } from 'express';
import { ComparisonController } from '../controllers/comparisonController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.post('/', ComparisonController.compare);
router.get('/:id', ComparisonController.getById);

export default router;
