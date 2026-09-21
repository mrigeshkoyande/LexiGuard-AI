import prisma from '../db/prisma';
import { ComparisonResult, DocumentStructure } from '@lexiguard/shared';
import { DocumentService } from './DocumentService';
import { getAIProvider } from '../ai';

export class ComparisonService {
  private documentService: DocumentService;

  constructor() {
    this.documentService = new DocumentService();
  }

  /**
   * Compares two documents owned by the user, computing clause diffs.
   */
  async compareDocuments(
    userId: string,
    docAId: string,
    docBId: string
  ): Promise<ComparisonResult> {
    // 1. Fetch both documents with ownership check
    const docA = await this.documentService.getDocumentById(docAId, userId);
    const docB = await this.documentService.getDocumentById(docBId, userId);

    const structA = await this.documentService.getDocumentStructure(docAId, userId);
    const structB = await this.documentService.getDocumentStructure(docBId, userId);

    // 2. Diff via AI provider
    const aiProvider = getAIProvider();
    const diffResult = await aiProvider.compareDocuments(structA, structB);

    const title = `Comparison: ${docA.title} vs ${docB.title}`;

    // 3. Save comparison record
    const compRecord = await prisma.comparison.create({
      data: {
        userId,
        docAId,
        docBId,
        title,
        diffRecordsJson: JSON.stringify(diffResult.records),
        summary: diffResult.summary
      }
    });

    return {
      id: compRecord.id,
      docAId,
      docBId,
      docATitle: docA.title,
      docBTitle: docB.title,
      records: diffResult.records,
      summary: diffResult.summary,
      createdAt: compRecord.createdAt.toISOString()
    };
  }

  /**
   * Fetches saved comparison by ID.
   */
  async getComparisonById(comparisonId: string, userId: string): Promise<ComparisonResult> {
    const comp = await prisma.comparison.findUnique({
      where: { id: comparisonId }
    });

    if (!comp) {
      throw new Error('Comparison record not found');
    }

    if (comp.userId !== userId) {
      const err: any = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }

    const docA = await prisma.document.findUnique({ where: { id: comp.docAId } });
    const docB = await prisma.document.findUnique({ where: { id: comp.docBId } });

    return {
      id: comp.id,
      docAId: comp.docAId,
      docBId: comp.docBId,
      docATitle: docA?.title || 'Document A',
      docBTitle: docB?.title || 'Document B',
      records: JSON.parse(comp.diffRecordsJson || '[]'),
      summary: comp.summary,
      createdAt: comp.createdAt.toISOString()
    };
  }
}
