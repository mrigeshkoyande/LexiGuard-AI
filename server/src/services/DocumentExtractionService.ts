import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { DocumentClause, DocumentSection, DocumentStructure } from '@lexiguard/shared';

export class DocumentExtractionService {
  /**
   * Extracts text from PDF, DOCX, or TXT and parses into structured sections and clauses.
   */
  async extractDocumentStructure(
    filePath: string,
    mimeType: string,
    originalFilename: string
  ): Promise<{ structure: DocumentStructure; pageCount: number; rawText: string }> {
    const ext = originalFilename.split('.').pop()?.toLowerCase();
    let rawText = '';
    let pageCount = 1;

    if (ext === 'pdf' || mimeType.includes('pdf')) {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      rawText = pdfData.text || '';
      pageCount = pdfData.numpages || 1;
    } else if (ext === 'docx' || mimeType.includes('wordprocessingml') || mimeType.includes('officedocument')) {
      const result = await mammoth.extractRawText({ path: filePath });
      rawText = result.value || '';
      // Rough page estimation for DOCX (~3000 chars per page)
      pageCount = Math.max(1, Math.ceil(rawText.length / 3000));
    } else {
      // Plain text (.txt or fallback)
      rawText = fs.readFileSync(filePath, 'utf-8');
      pageCount = Math.max(1, Math.ceil(rawText.length / 3000));
    }

    const structure = this.parseTextToSections(rawText, pageCount);
    return { structure, pageCount, rawText };
  }

  /**
   * Parses raw text into sections and clauses with character offsets and page approximations.
   */
  parseTextToSections(rawText: string, totalPages: number): DocumentStructure {
    const cleanedText = rawText.replace(/\r\n/g, '\n').trim();
    if (!cleanedText) {
      return { sections: [] };
    }

    const totalLength = cleanedText.length;
    const charsPerPage = Math.max(1000, Math.ceil(totalLength / Math.max(1, totalPages)));

    // Split text into paragraphs
    const paragraphs = cleanedText
      .split(/\n\s*\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const sections: DocumentSection[] = [];
    let currentSection: DocumentSection = {
      id: 'section-1',
      title: 'General Provisions',
      clauses: []
    };
    sections.push(currentSection);

    let clauseIndex = 1;
    let sectionIndex = 1;
    let currentOffset = 0;

    // Regex patterns to identify clause/section headers
    const sectionPattern = /^(SECTION|ARTICLE|PART)\s+([0-9IVXLCDM]+)[:.\s-]*(.*)$/i;
    const clausePattern = /^([0-9]{1,2}(\.[0-9]{1,2})*|\([a-z0-9]\)|[A-Z][.:])\s+([A-Z][\w\s,/-]{2,50})[:.\s-]*(.*)$/s;
    const standaloneHeaderPattern = /^[A-Z0-9\s,/-]{4,50}$/;

    for (const paragraph of paragraphs) {
      const startOffset = cleanedText.indexOf(paragraph, currentOffset);
      const safeStart = startOffset !== -1 ? startOffset : currentOffset;
      const endOffset = safeStart + paragraph.length;
      currentOffset = endOffset;

      const page = Math.min(totalPages, Math.max(1, Math.floor(safeStart / charsPerPage) + 1));

      // Check for Section Header
      const sectionMatch = paragraph.match(sectionPattern);
      if (sectionMatch && paragraph.length < 120) {
        sectionIndex++;
        currentSection = {
          id: `section-${sectionIndex}`,
          title: paragraph.replace(/\n/g, ' ').trim(),
          clauses: []
        };
        sections.push(currentSection);
        continue;
      }

      // Check for Clause Header
      const clauseMatch = paragraph.match(clausePattern);
      if (clauseMatch) {
        const number = clauseMatch[1] || `${clauseIndex}`;
        const titleCandidate = clauseMatch[3]?.trim() || `Clause ${clauseIndex}`;
        const clauseTitle = titleCandidate.length > 50 ? titleCandidate.slice(0, 50) + '...' : titleCandidate;

        const clause: DocumentClause = {
          id: `clause-${clauseIndex}`,
          number,
          title: clauseTitle,
          text: paragraph,
          page,
          startOffset: safeStart,
          endOffset
        };
        currentSection.clauses.push(clause);
        clauseIndex++;
        continue;
      }

      // Check if short all-caps line could be a section header
      if (standaloneHeaderPattern.test(paragraph) && paragraph.length < 60 && !paragraph.includes('.')) {
        sectionIndex++;
        currentSection = {
          id: `section-${sectionIndex}`,
          title: paragraph,
          clauses: []
        };
        sections.push(currentSection);
        continue;
      }

      // Standard paragraph converted to clause
      const firstLine = paragraph.split('\n')[0].trim();
      let title = firstLine.length > 40 ? firstLine.slice(0, 40) + '...' : firstLine;
      if (/^[0-9]+/.test(title)) {
        title = `Clause ${title}`;
      } else if (!title || title.length < 3) {
        title = `Provision ${clauseIndex}`;
      }

      const clause: DocumentClause = {
        id: `clause-${clauseIndex}`,
        number: `${clauseIndex}`,
        title: title.replace(/[:.-]+$/, ''),
        text: paragraph,
        page,
        startOffset: safeStart,
        endOffset
      };

      currentSection.clauses.push(clause);
      clauseIndex++;
    }

    // Clean up any empty initial section
    const nonEmptySections = sections.filter((s) => s.clauses.length > 0);
    return {
      sections: nonEmptySections.length > 0 ? nonEmptySections : sections
    };
  }
}
