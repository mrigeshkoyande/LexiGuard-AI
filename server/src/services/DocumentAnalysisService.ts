import prisma from '../db/prisma';
import { AnalysisResult, DocumentStructure } from '@lexiguard/shared';
import { getAIProvider } from '../ai';

export class DocumentAnalysisService {
  /**
   * Runs AI analysis on document structure and persists findings & action items.
   */
  async analyzeAndSave(
    documentId: string,
    userId: string,
    docStructure: DocumentStructure
  ): Promise<AnalysisResult> {
    const aiProvider = getAIProvider();

    // Call AI provider to analyze
    const analysisResult = await aiProvider.analyzeDocument(docStructure);

    // Delete existing analysis & findings if any re-analysis happens
    await prisma.finding.deleteMany({ where: { documentId } });
    await prisma.analysis.deleteMany({ where: { documentId } });
    await prisma.actionItem.deleteMany({ where: { documentId } });

    // Create Analysis record
    const analysis = await prisma.analysis.create({
      data: {
        documentId,
        summary: analysisResult.summary,
        documentType: analysisResult.documentType,
        missingInfoJson: JSON.stringify(analysisResult.missingInformation || [])
      }
    });

    // Fetch valid document clause IDs from DB
    const dbClauses = await prisma.documentClause.findMany({
      where: { documentId },
      select: { id: true }
    });
    const validClauseIds = new Set<string>(dbClauses.map((c) => c.id));
    const firstClauseId = dbClauses[0]?.id;

    // Map all findings to DB
    const allFindings = [
      ...analysisResult.importantClauses,
      ...analysisResult.obligations,
      ...analysisResult.deadlines,
      ...analysisResult.monetaryTerms,
      ...analysisResult.terminationTerms,
      ...analysisResult.renewalTerms,
      ...analysisResult.potentialConcerns
    ];

    for (const finding of allFindings) {
      const resolvedClauseId = validClauseIds.has(finding.sourceClauseId)
        ? finding.sourceClauseId
        : firstClauseId;

      if (!resolvedClauseId) {
        // Skip finding creation if document has no clauses (e.g. completely empty document)
        continue;
      }

      await prisma.finding.create({
        data: {
          analysisId: analysis.id,
          documentId,
          sourceClauseId: resolvedClauseId,
          category: finding.category,
          severity: finding.severity,
          title: finding.title,
          explanation: finding.explanation,
          whyItMatters: finding.whyItMatters,
          pageNumber: finding.pageNumber || 1,
          confidence: finding.confidence || 0.9
        }
      });
    }

    // Auto-generate Action Brief checklist items
    await this.generateActionItems(documentId, userId, analysisResult, validClauseIds);

    // Mark document as ANALYZED
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: 'ANALYZED',
        errorMessage: null
      }
    });

    return analysisResult;
  }

  /**
   * Generates actionable checklist items from analysis findings.
   */
  private async generateActionItems(
    documentId: string,
    userId: string,
    analysis: AnalysisResult,
    validClauseIds: Set<string>
  ) {
    const items: {
      category: string;
      title: string;
      description: string;
      sourceClauseId?: string;
      priority: 'High' | 'Medium' | 'Low';
    }[] = [];

    // Overview item
    items.push({
      category: 'Document Overview',
      title: `Verify ${analysis.documentType} Parties & Effective Date`,
      description: 'Confirm all contracting entities, names, registered addresses, and effective start dates are accurately stated.',
      priority: 'Medium'
    });

    // Obligations
    analysis.obligations.slice(0, 3).forEach((ob) => {
      items.push({
        category: 'Important Obligations',
        title: `Confirm Operational Feasibility: ${ob.title}`,
        description: ob.explanation,
        sourceClauseId: ob.sourceClauseId,
        priority: ob.severity === 'Important' ? 'High' : 'Medium'
      });
    });

    // Deadlines
    analysis.deadlines.slice(0, 3).forEach((dl) => {
      items.push({
        category: 'Important Dates',
        title: `Calendar Notice Window: ${dl.title}`,
        description: `${dl.explanation} — Add required reminder dates to calendar.`,
        sourceClauseId: dl.sourceClauseId,
        priority: 'High'
      });
    });

    // Financial
    analysis.monetaryTerms.slice(0, 2).forEach((mt) => {
      items.push({
        category: 'Financial Terms',
        title: `Validate Payment Terms: ${mt.title}`,
        description: mt.explanation,
        sourceClauseId: mt.sourceClauseId,
        priority: 'High'
      });
    });

    // Review Areas
    analysis.potentialConcerns.slice(0, 3).forEach((pc) => {
      items.push({
        category: 'Review Areas',
        title: `Assess Risk Exposure: ${pc.title}`,
        description: `${pc.explanation} Why it matters: ${pc.whyItMatters}`,
        sourceClauseId: pc.sourceClauseId,
        priority: pc.severity === 'Important' ? 'High' : 'Medium'
      });
    });

    // Questions to Consider
    items.push({
      category: 'Questions to Consider',
      title: 'Do you have written approval for any pre-existing outside commitments?',
      description: 'Check whether restrictive covenants or invention assignment clauses affect your personal side projects.',
      priority: 'Medium'
    });

    // Questions for a Lawyer
    if (analysis.potentialConcerns.some((c) => c.severity === 'Important')) {
      items.push({
        category: 'Questions for a Lawyer',
        title: 'Review non-compete/IP scope under local jurisdiction laws',
        description: 'Ask legal counsel to review whether the restrictive covenants and IP assignment provisions conform to governing regional standards.',
        priority: 'High'
      });
    }

    for (const item of items) {
      const resolvedClauseId = item.sourceClauseId && validClauseIds.has(item.sourceClauseId)
        ? item.sourceClauseId
        : null;

      await prisma.actionItem.create({
        data: {
          documentId,
          userId,
          category: item.category,
          title: item.title,
          description: item.description,
          sourceClauseId: resolvedClauseId,
          priority: item.priority,
          isCompleted: false
        }
      });
    }
  }
}
