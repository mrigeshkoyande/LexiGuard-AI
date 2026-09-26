import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma';
import { AppError } from '../utils/AppError';
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
      throw new AppError('Valid email address is required.', 400);
    }

    if (!params.password || params.password.length < 6) {
      throw new AppError('Password must be at least 6 characters long.', 400);
    }

    if (!name) {
      throw new AppError('Name is required.', 400);
    }

    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      throw new AppError('An account with this email already exists.', 409);
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
      throw new AppError('Invalid email or password.', 401);
    }

    const valid = await bcrypt.compare(params.password, user.passwordHash);
    if (!valid) {
      throw new AppError('Invalid email or password.', 401);
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
      throw new AppError('User not found.', 404);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString()
    };
  }
}
