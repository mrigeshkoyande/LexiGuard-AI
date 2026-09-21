import prisma from '../db/prisma';
import { ActionBrief, ActionItemRecord } from '@lexiguard/shared';
import { DocumentService } from './DocumentService';

export class ActionBriefService {
  private documentService: DocumentService;

  constructor() {
    this.documentService = new DocumentService();
  }

  /**
   * Retrieves full Action Brief with interactive checklist items.
   */
  async getActionBrief(documentId: string, userId: string): Promise<ActionBrief> {
    const doc = await this.documentService.getDocumentById(documentId, userId);

    const items = await prisma.actionItem.findMany({
      where: { documentId, userId },
      orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }]
    });

    const completedCount = items.filter((i) => i.isCompleted).length;
    const summary = `${completedCount} of ${items.length} pre-signing action items completed.`;

    const mappedItems: ActionItemRecord[] = items.map((i) => ({
      id: i.id,
      documentId: i.documentId,
      userId: i.userId,
      category: i.category as any,
      title: i.title,
      description: i.description,
      isCompleted: i.isCompleted,
      sourceClauseId: i.sourceClauseId,
      priority: i.priority as any,
      createdAt: i.createdAt.toISOString()
    }));

    return {
      documentId: doc.id,
      documentTitle: doc.title,
      items: mappedItems,
      summary
    };
  }

  /**
   * Toggles completion status of a specific action item.
   */
  async toggleActionItem(itemId: string, userId: string, isCompleted: boolean): Promise<ActionItemRecord> {
    const item = await prisma.actionItem.findUnique({
      where: { id: itemId }
    });

    if (!item) {
      throw new Error('Action item not found');
    }

    if (item.userId !== userId) {
      const err: any = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }

    const updated = await prisma.actionItem.update({
      where: { id: itemId },
      data: { isCompleted }
    });

    return {
      id: updated.id,
      documentId: updated.documentId,
      userId: updated.userId,
      category: updated.category as any,
      title: updated.title,
      description: updated.description,
      isCompleted: updated.isCompleted,
      sourceClauseId: updated.sourceClauseId,
      priority: updated.priority as any,
      createdAt: updated.createdAt.toISOString()
    };
  }
}
