import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

const authService = new AuthService();

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required. Please log in to continue.'
      });
    }

    const payload = authService.verifyToken(token);
    req.user = { id: payload.userId };
    next();
  } catch (err: any) {
    return res.status(401).json({
      error: 'Invalid or expired authentication token.'
    });
  }
}
