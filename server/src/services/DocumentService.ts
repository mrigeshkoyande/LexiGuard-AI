import fs from 'fs';
import path from 'path';
import prisma from '../db/prisma';
import { DocumentStructure, DocumentSummary } from '@lexiguard/shared';
import { DocumentExtractionService } from './DocumentExtractionService';
import { DocumentAnalysisService } from './DocumentAnalysisService';

export class DocumentService {
  private extractionService: DocumentExtractionService;
  private analysisService: DocumentAnalysisService;

  constructor() {
    this.extractionService = new DocumentExtractionService();
    this.analysisService = new DocumentAnalysisService();
  }

  /**
   * Lists all documents belonging to a specific user.
   */
  async getUserDocuments(userId: string): Promise<DocumentSummary[]> {
    const docs = await prisma.document.findMany({
      where: { userId },
      include: {
        analysis: true,
        _count: {
          select: { findings: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return docs.map((doc: any) => ({
      id: doc.id,
      userId: doc.userId,
      title: doc.title,
      originalFilename: doc.originalFilename,
      mimeType: doc.mimeType,
      fileSize: doc.fileSize,
      pageCount: doc.pageCount,
      status: doc.status as any,
      errorMessage: doc.errorMessage,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
      analysisSummary: doc.analysis?.summary,
      documentType: doc.analysis?.documentType,
      findingCount: doc._count.findings
    }));
  }

  /**
   * Gets a document by ID with strict user ownership check.
   */
  async getDocumentById(documentId: string, userId: string) {
    const doc = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        sections: {
          orderBy: { orderIndex: 'asc' },
          include: {
            clauses: {
              orderBy: { createdAt: 'asc' }
            }
          }
        },
        analysis: {
          include: {
            findings: {
              orderBy: { createdAt: 'asc' }
            }
          }
        }
      }
    });

    if (!doc) {
      const err: any = new Error('Document not found');
      err.statusCode = 404;
      throw err;
    }

    if (doc.userId !== userId) {
      const err: any = new Error('Unauthorized: You do not have permission to access this document.');
      err.statusCode = 403;
      throw err;
    }

    return doc;
  }

  /**
   * Creates and processes an uploaded document.
   */
  async createAndProcessDocument(params: {
    userId: string;
    title: string;
    originalFilename: string;
    mimeType: string;
    fileSize: number;
    filePath: string;
  }) {
    // 1. Create document record with PENDING status
    const doc = await prisma.document.create({
      data: {
        userId: params.userId,
        title: params.title || params.originalFilename,
        originalFilename: params.originalFilename,
        mimeType: params.mimeType,
        fileSize: params.fileSize,
        filePath: params.filePath,
        status: 'PROCESSING'
      }
    });

    // 2. Extract sections & clauses
    try {
      const { structure, pageCount } = await this.extractionService.extractDocumentStructure(
        params.filePath,
        params.mimeType,
        params.originalFilename
      );

      // Update document page count
      await prisma.document.update({
        where: { id: doc.id },
        data: { pageCount }
      });

      // Save sections and clauses in database
      for (let sIdx = 0; sIdx < structure.sections.length; sIdx++) {
        const sec = structure.sections[sIdx];
        const dbSection = await prisma.documentSection.create({
          data: {
            documentId: doc.id,
            title: sec.title,
            orderIndex: sIdx
          }
        });

        for (const cl of sec.clauses) {
          await prisma.documentClause.create({
            data: {
              documentId: doc.id,
              sectionId: dbSection.id,
              number: cl.number,
              title: cl.title,
              text: cl.text,
              page: cl.page,
              startOffset: cl.startOffset,
              endOffset: cl.endOffset
            }
          });
        }
      }

      // Re-fetch document with created IDs to pass to analysis
      const structuredDoc = await this.getDocumentStructure(doc.id, params.userId);

      // 3. Analyze document using AI provider
      await this.analysisService.analyzeAndSave(doc.id, params.userId, structuredDoc);

      return await this.getDocumentById(doc.id, params.userId);
    } catch (err: any) {
      await prisma.document.update({
        where: { id: doc.id },
        data: {
          status: 'ERROR',
          errorMessage: err.message
        }
      });
      throw err;
    }
  }

  /**
   * Retrieves clean DocumentStructure for AI consumption.
   */
  async getDocumentStructure(documentId: string, userId: string): Promise<DocumentStructure> {
    const doc = await this.getDocumentById(documentId, userId);

    return {
      sections: doc.sections.map((sec: any) => ({
        id: sec.id,
        title: sec.title,
        clauses: sec.clauses.map((c: any) => ({
          id: c.id,
          number: c.number,
          title: c.title,
          text: c.text,
          page: c.page,
          startOffset: c.startOffset,
          endOffset: c.endOffset
        }))
      }))
    };
  }

  /**
   * Deletes a document, cascading deletion across all DB relations and unlinking from disk.
   */
  async deleteDocument(documentId: string, userId: string): Promise<boolean> {
    const doc = await this.getDocumentById(documentId, userId);

    // Delete DB record (Prisma cascade onDelete will remove sections, clauses, analysis, findings, action items, QnA)
    await prisma.document.delete({
      where: { id: documentId }
    });

    // Delete physical file from disk if it exists
    if (doc.filePath && fs.existsSync(doc.filePath)) {
      try {
        fs.unlinkSync(doc.filePath);
      } catch (err) {
        console.error(`Failed to delete file on disk at ${doc.filePath}:`, err);
      }
    }

    return true;
  }
}
