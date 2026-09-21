import { Router } from 'express';
import authRoutes from './authRoutes';
import documentRoutes from './documentRoutes';
import comparisonRoutes from './comparisonRoutes';
import { LEGAL_DISCLAIMER } from '@lexiguard/shared';

const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'LexiGuard AI',
    disclaimer: LEGAL_DISCLAIMER,
    timestamp: new Date().toISOString()
  });
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/documents', documentRoutes);
apiRouter.use('/comparisons', comparisonRoutes);

export default apiRouter;
