import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { AuthService } from '../src/services/AuthService';
import prisma from '../src/db/prisma';

describe('Ownership Enforcement & IDOR Prevention Tests', () => {
  let userAToken: string;
  let userBToken: string;
  let docAId: string;

  beforeAll(async () => {
    const auth = new AuthService();
    const userA = await auth.register({
      email: `user_a_${Date.now()}@lexiguard.ai`,
      password: 'passwordA123!',
      name: 'User Alpha'
    });
    userAToken = userA.token;

    const userB = await auth.register({
      email: `user_b_${Date.now()}@lexiguard.ai`,
      password: 'passwordB123!',
      name: 'User Beta'
    });
    userBToken = userB.token;

    // User A uploads a document
    const uploadRes = await request(app)
      .post('/api/documents/upload')
      .set('Authorization', `Bearer ${userAToken}`)
      .field('title', 'Confidential Alpha Agreement')
      .attach('document', Buffer.from('1.1 Confidentiality: Strictly private to Alpha.'), 'alpha.txt');

    docAId = uploadRes.body.document.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { contains: 'user_' } }
    });
  });

  it('should allow User A to read their own document', async () => {
    const res = await request(app)
      .get(`/api/documents/${docAId}`)
      .set('Authorization', `Bearer ${userAToken}`);

    expect(res.status).toBe(200);
    expect(res.body.document.id).toBe(docAId);
  });

  it('should prevent User B from reading User A\'s document (IDOR Check)', async () => {
    const res = await request(app)
      .get(`/api/documents/${docAId}`)
      .set('Authorization', `Bearer ${userBToken}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toContain('Unauthorized');
  });

  it('should prevent User B from asking Q&A on User A\'s document', async () => {
    const res = await request(app)
      .post(`/api/documents/${docAId}/qna`)
      .set('Authorization', `Bearer ${userBToken}`)
      .send({ question: 'What is the confidentiality term?' });

    expect(res.status).toBe(403);
  });

  it('should prevent User B from deleting User A\'s document', async () => {
    const res = await request(app)
      .delete(`/api/documents/${docAId}`)
      .set('Authorization', `Bearer ${userBToken}`);

    expect(res.status).toBe(403);

    // Document A should still exist
    const checkRes = await request(app)
      .get(`/api/documents/${docAId}`)
      .set('Authorization', `Bearer ${userAToken}`);

    expect(checkRes.status).toBe(200);
  });
});
