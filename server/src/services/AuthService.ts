import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma';
import { UserProfile } from '@lexiguard/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'lexiguard_dev_secret_key_change_in_production_32_chars_min';
const JWT_EXPIRES_IN = '7d';

export class AuthService {
  /**
   * Generates JWT token for user ID.
   */
  generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  /**
   * Verifies JWT token and returns payload.
   */
  verifyToken(token: string): { userId: string } {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  }

  /**
   * Registers a new user.
   */
  async register(params: { email: string; password: string; name: string }): Promise<{ user: UserProfile; token: string }> {
    const email = params.email.trim().toLowerCase();
    const name = params.name.trim();

    if (!email || !email.includes('@')) {
      const err: any = new Error('Valid email address is required.');
      err.statusCode = 400;
      throw err;
    }

    if (!params.password || params.password.length < 6) {
      const err: any = new Error('Password must be at least 6 characters long.');
      err.statusCode = 400;
      throw err;
    }

    if (!name) {
      const err: any = new Error('Name is required.');
      err.statusCode = 400;
      throw err;
    }

    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      const err: any = new Error('An account with this email already exists.');
      err.statusCode = 409;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(params.password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name
      }
    });

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString()
      },
      token
    };
  }

  /**
   * Authenticates user credentials.
   */
  async login(params: { email: string; password: string }): Promise<{ user: UserProfile; token: string }> {
    const email = params.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      const err: any = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    const valid = await bcrypt.compare(params.password, user.passwordHash);
    if (!valid) {
      const err: any = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString()
      },
      token
    };
  }

  /**
   * Retrieves profile for current authenticated user.
   */
  async getCurrentUser(userId: string): Promise<UserProfile> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      const err: any = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString()
    };
  }
}
