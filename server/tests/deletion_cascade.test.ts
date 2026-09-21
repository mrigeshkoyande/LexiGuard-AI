import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import fs from 'fs';
import app from '../src/app';
import { AuthService } from '../src/services/AuthService';
import prisma from '../src/db/prisma';

describe('Document Deletion Cascade Integration Tests', () => {
  let userToken: string;
  let userId: string;

  beforeAll(async () => {
    const auth = new AuthService();
    const user = await auth.register({
      email: `cascade_test_${Date.now()}@lexiguard.ai`,
      password: 'password123!',
      name: 'Cascade Tester'
    });
    userToken = user.token;
    userId = user.user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { contains: 'cascade_test_' } }
    });
  });

  it('should cascade delete document, db relations, and disk file', async () => {
    const testText = `SECTION 1: TEST
1.1 Termination
Either party may terminate upon 30 days notice.`;

    // 1. Upload document
    const uploadRes = await request(app)
      .post('/api/documents/upload')
      .set('Authorization', `Bearer ${userToken}`)
      .field('title', 'Cascade Test Document')
      .attach('document', Buffer.from(testText), 'cascade_doc.txt');

    expect(uploadRes.status).toBe(201);
    const docId = uploadRes.body.document.id;
    const filePath = uploadRes.body.document.filePath;

    // Verify DB records exist
    const clausesBefore = await prisma.documentClause.count({ where: { documentId: docId } });
    const analysisBefore = await prisma.analysis.count({ where: { documentId: docId } });
    const findingsBefore = await prisma.finding.count({ where: { documentId: docId } });
    const actionItemsBefore = await prisma.actionItem.count({ where: { documentId: docId } });

    expect(clausesBefore).toBeGreaterThan(0);
    expect(analysisBefore).toBe(1);
    expect(findingsBefore).toBeGreaterThan(0);
    expect(actionItemsBefore).toBeGreaterThan(0);

    if (filePath) {
      expect(fs.existsSync(filePath)).toBe(true);
    }

    // 2. Delete document
    const deleteRes = await request(app)
      .delete(`/api/documents/${docId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(deleteRes.status).toBe(200);

    // 3. Verify all DB records and disk files are deleted
    const docAfter = await prisma.document.findUnique({ where: { id: docId } });
    const clausesAfter = await prisma.documentClause.count({ where: { documentId: docId } });
    const analysisAfter = await prisma.analysis.count({ where: { documentId: docId } });
    const findingsAfter = await prisma.finding.count({ where: { documentId: docId } });
    const actionItemsAfter = await prisma.actionItem.count({ where: { documentId: docId } });

    expect(docAfter).toBeNull();
    expect(clausesAfter).toBe(0);
    expect(analysisAfter).toBe(0);
    expect(findingsAfter).toBe(0);
    expect(actionItemsAfter).toBe(0);

    if (filePath) {
      expect(fs.existsSync(filePath)).toBe(false);
    }
  });
});
