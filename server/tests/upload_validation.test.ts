import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { AuthService } from '../src/services/AuthService';
import prisma from '../src/db/prisma';

describe('Document Upload Validation Integration Tests', () => {
  let userToken: string;
  let userId: string;

  beforeAll(async () => {
    const auth = new AuthService();
    const registered = await auth.register({
      email: `upload_test_${Date.now()}@lexiguard.ai`,
      password: 'testPassword123!',
      name: 'Upload Tester'
    });
    userToken = registered.token;
    userId = registered.user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { contains: 'upload_test_' } }
    });
  });

  it('should reject upload of executable file (.exe)', async () => {
    const exeBuffer = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00]); // MZ header
    const res = await request(app)
      .post('/api/documents/upload')
      .set('Authorization', `Bearer ${userToken}`)
      .attach('document', exeBuffer, 'malicious.exe');

    expect(res.status).toBe(500); // Multer extension rejection or 400
  });

  it('should reject fake PDF that contains executable magic bytes (magic byte mismatch)', async () => {
    // File named fake.pdf but has MZ header
    const fakePdfBuffer = Buffer.from([0x4d, 0x5a, 0x00, 0x00, 0x00]);
    const res = await request(app)
      .post('/api/documents/upload')
      .set('Authorization', `Bearer ${userToken}`)
      .attach('document', fakePdfBuffer, 'fake.pdf');

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Executable files');
  });

  it('should accept valid plain text (.txt) legal document', async () => {
    const validTxt = `SECTION 1: APPOINTMENT
1.1 Position
Employee agrees to serve as Lead Developer for the Company.`;

    const res = await request(app)
      .post('/api/documents/upload')
      .set('Authorization', `Bearer ${userToken}`)
      .field('title', 'Valid Test Agreement')
      .attach('document', Buffer.from(validTxt), 'agreement.txt');

    expect(res.status).toBe(201);
    expect(res.body.document).toBeDefined();
    expect(res.body.document.title).toBe('Valid Test Agreement');
    expect(res.body.document.status).toBe('ANALYZED');
  });
});
