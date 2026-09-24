import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { AuthService } from '../src/services/AuthService';
import prisma from '../src/db/prisma';

describe('Grounded Q&A ("Ask Lexi") Integration Tests', () => {
  let userToken: string;
  let docId: string;

  beforeAll(async () => {
    const auth = new AuthService();
    const user = await auth.register({
      email: `qna_test_${Date.now()}@lexiguard.ai`,
      password: 'password123!',
      name: 'QnA Tester'
    });
    userToken = user.token;

    const docText = `SECTION 1: EMPLOYMENT TERMS
1.1 Probationary Period
The Employee shall undergo a ninety (90) day probationary period from the start date.

1.2 Salary and Compensation
The Employee will receive an annual salary of $120,000 paid bi-weekly.`;

    const uploadRes = await request(app)
      .post('/api/documents/upload')
      .set('Authorization', `Bearer ${userToken}`)
      .field('title', 'QnA Test Contract')
      .attach('document', Buffer.from(docText), 'contract.txt');

    docId = uploadRes.body.document.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { contains: 'qna_test_' } }
    });
  });

  it('should return grounded answer citing relevant clause for in-document question', async () => {
    const res = await request(app)
      .post(`/api/documents/${docId}/qna`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ question: 'How long is the probationary period?' });

    expect(res.status).toBe(200);
    expect(res.body.answer).toContain('probationary');
    expect(res.body.sourceClauseIds.length).toBeGreaterThan(0);
    expect(res.body.isDeclinedAdvice).toBe(false);
  });

  it('should return literal fallback message when question cannot be answered from document', async () => {
    const res = await request(app)
      .post(`/api/documents/${docId}/qna`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ question: 'What is the secret recipe for chocolate cake and quantum physics?' });

    expect(res.status).toBe(200);
    expect(res.body.answer.toLowerCase()).toContain("couldn't find");
    expect(res.body.sourceClauseIds.length).toBe(0);
  });

  it('should intercept "Should I sign this?" advice question and safely decline with guidance', async () => {
    const res = await request(app)
      .post(`/api/documents/${docId}/qna`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ question: 'Should I sign this contract now?' });

    expect(res.status).toBe(200);
    expect(res.body.isDeclinedAdvice).toBe(true);
    expect(res.body.answer).toContain('cannot provide legal advice or advise you on whether or not to sign');
  });
});
