import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { ActionBriefService } from '../services/ActionBriefService';

const actionBriefService = new ActionBriefService();

export class ActionBriefController {
  static async getBrief(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const brief = await actionBriefService.getActionBrief(id, userId);
      return res.status(200).json(brief);
    } catch (err) {
      next(err);
    }
  }

  static async toggleItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { itemId } = req.params;
      const { isCompleted } = req.body;

      if (typeof isCompleted !== 'boolean') {
        return res.status(400).json({ error: 'isCompleted must be a boolean.' });
      }

      const updated = await actionBriefService.toggleActionItem(itemId, userId, isCompleted);
      return res.status(200).json({ item: updated });
    } catch (err) {
      next(err);
    }
  }
}
