import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const authService = new AuthService();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;
      const result = await authService.register({ email, password, name });

      res.cookie('token', result.token, COOKIE_OPTIONS);
      return res.status(201).json({
        user: result.user,
        token: result.token
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });

      res.cookie('token', result.token, COOKIE_OPTIONS);
      return res.status(200).json({
        user: result.user,
        token: result.token
      });
    } catch (err) {
      next(err);
    }
  }

  static async logout(_req: Request, res: Response) {
    res.clearCookie('token', COOKIE_OPTIONS);
    return res.status(200).json({ message: 'Logged out successfully.' });
  }

  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Not authenticated.' });
      }
      const user = await authService.getCurrentUser(req.user.id);
      return res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  }
}
