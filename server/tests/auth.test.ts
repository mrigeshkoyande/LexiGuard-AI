import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/db/prisma';

describe('Authentication & Access Control Integration Tests', () => {
  const testUser = {
    email: `test_auth_${Date.now()}@lexiguard.ai`,
    password: 'securePassword123!',
    name: 'Auth Test User'
  };

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { contains: 'test_auth_' } }
    });
  });

  it('should successfully register a new user and set httpOnly cookie', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email.toLowerCase());
    expect(res.body.user.name).toBe(testUser.name);
    expect(res.body.token).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should reject registration with invalid email or short password', async () => {
    const badEmailRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', password: 'password123', name: 'User' });
    expect(badEmailRes.status).toBe(400);

    const shortPassRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'valid@lexiguard.ai', password: '123', name: 'User' });
    expect(shortPassRes.status).toBe(400);
  });

  it('should authenticate valid credentials and issue JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testUser.email.toLowerCase());
    expect(res.body.token).toBeDefined();
  });

  it('should reject invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongPassword' });

    expect(res.status).toBe(401);
  });

  it('should reject unauthenticated access to protected /api/documents route', async () => {
    const res = await request(app).get('/api/documents');
    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Authentication required');
  });

  it('should allow access to /api/auth/me with valid Authorization header', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    const token = loginRes.body.token;

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe(testUser.email.toLowerCase());
  });
});
